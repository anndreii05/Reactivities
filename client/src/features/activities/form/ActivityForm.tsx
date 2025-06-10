import { Paper, Typography, Box, TextField, Button } from "@mui/material";
import type { FormEvent } from "react";
import { useActivities } from "../../../lib/hooks/useActivities";

type Props = {
    activity?: Activity;
    closeForm: () => void;
}

export default function ActivityForm({ activity, closeForm }: Props) {
    const { updateActivity, createActivity } = useActivities();
    
    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);

        const data: {[key: string]: FormDataEntryValue} = {}

        // parse form data into an object
        formData.forEach((value, key) => {
            data[key] = value; //key taken from the form field "name"
        });

        if (activity){
            data.id = activity.id; // if activity is passed, add the id to the data object
            await updateActivity.mutateAsync(data as unknown as Activity); // use the updateActivity mutation to update the activity
            closeForm(); // close the form after updating
        } else {
            await createActivity.mutateAsync(data as unknown as Activity); // if no activity is passed, create a new activity
            closeForm(); // close the form after creating
        }
    }

    return (
        <Paper sx={{borderRadius: 3, padding: 3}}>
            <Typography variant="h5" gutterBottom color="primary">
                Create activity
            </Typography>
            <Box component='form' onSubmit={handleSubmit} display='flex' flexDirection='column' gap={3}>
                <TextField name='title' label='Title' defaultValue={activity?.title} />
                <TextField name='description' label='Description' defaultValue={activity?.description} multiline rows={3} />
                <TextField name='category' label='Category' defaultValue={activity?.category} />
                <TextField name='date' label='Date' type="date" defaultValue={activity?.date
                    ? new Date(activity.date).toISOString().split('T')[0] 
                    : new Date().toISOString().split('T')[0]
                } />
                <TextField name='city' label='City' defaultValue={activity?.city} />
                <TextField name='venue' label='Venue' defaultValue={activity?.venue}/>
                <Box display='flex' justifyContent='end' gap={3}>
                    <Button onClick={closeForm} color='inherit'>Cancel</Button>
                    <Button 
                        type="submit" 
                        color='success' 
                        variant='contained'
                        disabled={updateActivity.isPending || createActivity.isPending}
                    >Submit</Button>
                </Box>
            </Box>
        </Paper>
    );
}
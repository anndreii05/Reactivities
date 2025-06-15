import { Paper, Typography, Box, TextField, Button } from "@mui/material";
import type { FormEvent } from "react";
import { useNavigate, useParams } from "react-router";
import { useActivities } from "../../../lib/hooks/useActivities";

export default function ActivityForm() {
    const {id} = useParams();
    const { updateActivity, createActivity, activity, isLoadingActivity } = useActivities(id);
    const navigate = useNavigate();
    
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
            navigate(`/activities/${activity.id}`);
        } else {
            createActivity.mutate(data as unknown as Activity, {
                onSuccess: (id) => {
                    navigate(`/activities/${id}`); // navigate to the newly created activity
                }
            }); // if no activity is passed, create a new activity
        }
    }

    if (isLoadingActivity) return <Typography>Loading...</Typography>; // show loading text while activity is being fetched

    return (
        <Paper sx={{borderRadius: 3, padding: 3}}>
            <Typography variant="h5" gutterBottom color="primary">
                {activity ? 'Edit Activity' : 'Create Activity'}
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
                    <Button color='inherit'>Cancel</Button>
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
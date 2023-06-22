import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Layout from "./Layout"
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import CardActions from '@mui/material/CardActions';
import { styled } from '@mui/system';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useContext } from 'react';
import { AuthContext } from '../AuthContext';
import Rating from '@mui/material/Rating';

const theme = createTheme();

const Container = styled(Box)({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '85vh',
});

const CustomCard = styled(Card)({
    backgroundColor: 'white',
    border: '1px solid #E0E0E0',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    minWidth: 900,
    padding: '16px',
    margin: '16px',
});

const CustomDivider = styled(Divider)({
    backgroundColor: 'black',
    height: '100%',
    margin: '0 100px',
});

export default function History() {
    const [histories, setHistories] = useState([]);
    const { authData, setAuthData } = useContext(AuthContext);
    const userId = authData.user.id;
    const [ratings, setRatings] = useState([]);

    const fetchHistory = async () => {
        try {
            const userHistory = await axios.get(`https://sea-turtle-app-kehgq.ondigitalocean.app/api/histories/getHistory?userId=${userId}`);
            if (Array.isArray(userHistory.data.history)) {
                setHistories(userHistory.data.history);
            } else if(!userHistory.data.history)  {
                setHistories([]);
            } else {
                setHistories([userHistory.data.history]);
            }
        } catch (error) {
            console.error('Error fetching ride history:', error);
        }
    };

    const submitRatings = async (historyId, ratings) => {
        try {
            const userRatingsForHistory = Object.entries(ratings)
                .filter(([key]) => key.startsWith(historyId))
                .reduce((acc, [key, value]) => {
                    const userId = key.split('-')[1];
                    acc[userId] = value;
                    return acc;
                }, {});
    
            await axios.post(`https://sea-turtle-app-kehgq.ondigitalocean.app/api/histories/submitRatings`, {
                historyId,
                ratings: userRatingsForHistory,
            });
            fetchHistory();
            console.log('Ratings submitted successfully');
        } catch (error) {
            console.error('Error submitting ratings:', error);
        }
    };

    const [userRatings, setUserRatings] = useState({});

    const handleRatingChange = (historyId, userId, rating) => {
        setUserRatings({ ...userRatings, [`${historyId}-${userId}`]: rating });
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    const renderHistory = () => {
        console.log(histories);
        return histories.map((history, index) => (
            <CustomCard key={history._id}>
                <CardContent>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Typography variant="h5" gutterBottom>
                                {history.rideName}
                            </Typography>
                            <Typography variant="subtitle1">
                                {new Date(history.timestamp).toLocaleDateString()}
                            </Typography>
                        </Grid>
                        {history.otherUsers.map((user, userIndex) => {
                            return (
                                <Grid item xs={12} key={user._id}>
                                    <Typography variant="body1">
                                        User: {user.firstName} {user.lastName} ({user.rating})
                                    </Typography>
                                    <Typography variant="body1">
                                        {user.matricNumber}
                                    </Typography>
                                    <Rating
                                        value={userRatings[`${history._id}-${user._id}`] || 0}
                                        onChange={(event, newValue) => handleRatingChange(history._id, user._id, newValue)}
                                    />

                                </Grid>
                            );
                        })}
                    </Grid>
                </CardContent>
                <CardActions>
                    <Grid container justifyContent="flex-end">
                        <Grid item>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => submitRatings(history._id, userRatings)}
                            >
                                Submit
                            </Button>
                        </Grid>
                    </Grid>
                </CardActions>
            </CustomCard>
        ));
    };

    return (
        <div>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <Box
                    sx={{
                        backgroundImage: `url(${process.env.PUBLIC_URL}/images/background.png)`,
                        backgroundSize: 'cover',
                        minHeight: '100vh',
                    }}
                >
                    <Layout>
                        <Container>
                            {renderHistory()}
                        </Container>
                    </Layout>
                </Box>
            </ThemeProvider>
        </div>
    );
}

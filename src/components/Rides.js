import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Layout from "./Layout"
import Fab from '@mui/material/Fab';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/system';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import CircularProgress from '@mui/material/CircularProgress';
import { useContext } from 'react';
import { AuthContext } from '../AuthContext';
import { io } from 'socket.io-client';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import InputAdornment from '@mui/material/InputAdornment'

const theme = createTheme();

const Container = styled(Box)({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
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

export default function Rides() {
    const navigate = useNavigate();

    const [rides, setRides] = useState([]);
    const [userRide, setUserRide] = useState(null);
    const [user, setUser] = useState();
    const { authData, setAuthData } = useContext(AuthContext);
    const [participantData, setParticipantData] = useState([]);
    const [filteredRides, setFilteredRides] = useState([]);
    const [searchName, setSearchName] = useState('');
    const [searchStartingPoint, setSearchStartingPoint] = useState('');
    const [searchDestination, setSearchDestination] = useState('');
    const [searchTime, setSearchTime] = useState('');

    const fetchRides = async () => {
        try {
            const allRides = await axios.get('https://sea-turtle-app-kehgq.ondigitalocean.app/api/rides/getRides');
            const userIds = [...new Set(allRides.data.flatMap(ride => ride.participants))];

            if (userIds.length > 0) {
                const allUsers = await axios.post('https://sea-turtle-app-kehgq.ondigitalocean.app/api/users/getUsersByIds', { userIds });
                setParticipantData(allUsers.data.users);
            } else {
                setParticipantData([]);
            }

            const ridesWithLoadingState = allRides.data.map(ride => ({ ...ride, loading: false }));
            setUser(JSON.parse(window.localStorage.getItem('authData')).user);
            setUserRide(ridesWithLoadingState.find(ride => ride.userId === JSON.parse(window.localStorage.getItem('authData')).user.id || ride.participants.includes(JSON.parse(window.localStorage.getItem('authData')).user.id)));
            setRides(ridesWithLoadingState.filter(ride => ride.userId !== JSON.parse(window.localStorage.getItem('authData')).user.id && !ride.participants.includes(JSON.parse(window.localStorage.getItem('authData')).user.id)));
            setFilteredRides(ridesWithLoadingState.filter(ride => ride.userId !== JSON.parse(window.localStorage.getItem('authData')).user.id && !ride.participants.includes(JSON.parse(window.localStorage.getItem('authData')).user.id)));

        } catch (error) {
            console.error('Error fetching rides:', error);
        }
    };

    useEffect(() => {
        setFilteredRides(
            rides.filter((ride) =>
                ride.name.toLowerCase().includes(searchName.toLowerCase()) &&
                ride.startingPoint.toLowerCase().includes(searchStartingPoint.toLowerCase()) &&
                ride.destination.toLowerCase().includes(searchDestination.toLowerCase()) &&
                ride.time.toLowerCase().includes(searchTime.toLowerCase())
            )
        );
    }, [searchName, searchStartingPoint, searchDestination, searchTime, rides]);

    const getUserById = (userId) => {
        return participantData.find(user => user._id === userId);
    };

    const applyForRide = async (rideId, userId) => {
        try {
            await axios.post('https://sea-turtle-app-kehgq.ondigitalocean.app/api/rides/apply', { rideId, userId });

            const updatedUser = {
                ...JSON.parse(window.localStorage.getItem('authData')).user,
                isApply: rideId,
            };
            setUser(updatedUser);

            const updatedAuthData = { ...authData, user: updatedUser };
            setAuthData(updatedAuthData);
            window.localStorage.setItem('authData', JSON.stringify(updatedAuthData));

        } catch (error) {
            console.error('Error applying for ride:', error);
            if (error.response && error.response.data && error.response.data.message) {
                alert(error.response.data.message);
            } else {
                alert('Error applying for ride.');
            }
        }
    };

    const cancelApplyForRide = async (rideId, userId, index) => {
        try {
            await axios.post('https://sea-turtle-app-kehgq.ondigitalocean.app/api/rides/cancelApply', { rideId, userId, index });

            const updatedUser = {
                ...JSON.parse(window.localStorage.getItem('authData')).user,
                isApply: null,
            };
            setUser(updatedUser);

            const updatedAuthData = { ...authData, user: updatedUser };
            setAuthData(updatedAuthData);
            window.localStorage.setItem('authData', JSON.stringify(updatedAuthData));

        } catch (error) {
            console.error('Error applying for ride:', error);
        }
    };

    const leaveRide = async (rideId, userId) => {
        try {
            await axios.post('https://sea-turtle-app-kehgq.ondigitalocean.app/api/rides/leave', { rideId, userId });

            const updatedUser = {
                ...JSON.parse(window.localStorage.getItem('authData')).user,
                isApply: null,
                currentRide: null,
            };
            setUser(updatedUser);

            const updatedAuthData = { ...authData, user: updatedUser };
            setAuthData(updatedAuthData);
            window.localStorage.setItem('authData', JSON.stringify(updatedAuthData));
            fetchRides();

        } catch (error) {
            console.error('Error leaving the ride:', error);
        }
    };

    useEffect(() => {
        const socket = io.connect('https://sea-turtle-app-kehgq.ondigitalocean.app');

        socket.emit('joiningRide', authData.user.id);

        if (authData.user.isApply) {
            socket.emit('joinRide', authData.user.isApply);
            socket.on('applicantDenied', (data) => {
                if (data.applicantId === authData.user.id) {
                    alert('The ride leader denied your request.');
                    const updatedUser = {
                        ...JSON.parse(window.localStorage.getItem('authData')).user,
                        isApply: null,
                    };
                    setUser(updatedUser);

                    const updatedAuthData = { ...authData, user: updatedUser };
                    setAuthData(updatedAuthData);
                    window.localStorage.setItem('authData', JSON.stringify(updatedAuthData));
                    fetchRides();
                }
            });
            socket.on('applicantAccepted', (data) => {
                if (data.applicantId === authData.user.id) {
                    const updatedUser = {
                        ...JSON.parse(window.localStorage.getItem('authData')).user,
                        currentRide: authData.user.isApply,
                        isApply: null,
                    };
                    setUser(updatedUser);

                    const updatedAuthData = { ...authData, user: updatedUser };
                    setAuthData(updatedAuthData);
                    window.localStorage.setItem('authData', JSON.stringify(updatedAuthData));
                    navigate('/ride')
                }
            });
        }

        socket.on('rideDisbanded', () => {
            alert('The ride has been disbanded by the ride leader.');
            const updatedUser = {
                ...JSON.parse(window.localStorage.getItem('authData')).user,
                isApply: null,
            };
            setUser(updatedUser);

            const updatedAuthData = { ...authData, user: updatedUser };
            setAuthData(updatedAuthData);
            window.localStorage.setItem('authData', JSON.stringify(updatedAuthData));
            fetchRides();
        });

        return () => {
            socket.disconnect();
        };
    }, [authData.user.isApply]);

    useEffect(() => {
        fetchRides();
    }, []);


    const renderRides = () => {
        let ridesToRender = filteredRides.slice();

        if (userRide) {
            ridesToRender.unshift(userRide);
        }

        return ridesToRender.map((ride, index) => (
            <CustomCard key={ride.userId}>
                <CardContent>
                    <Grid container spacing={3}>
                        <Grid item xs>
                            <Typography variant="h5" gutterBottom>
                                {ride.name}
                            </Typography>
                            <Typography variant="body1">
                                Destination: {ride.destination}
                            </Typography>
                            <Typography variant="body1">
                                Time: {ride.time}
                            </Typography>
                            <Typography variant="body1">
                                Starting Point: {ride.startingPoint}
                            </Typography>
                            <br />
                            <CardActions>
                                {
                                    (userRide && userRide.userId === ride.userId) || (ride.participants && ride.participants.includes(user.id))
                                        ? (
                                            <>
                                                <Button variant="contained" color="primary" onClick={() => navigate('/ride')}>
                                                    View
                                                </Button>
                                                <Button variant="contained" color="error" onClick={() => leaveRide(ride._id, user.id)}>
                                                    Leave
                                                </Button>
                                            </>
                                        ) : (!userRide && user.isApply === null)
                                            ? (
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    onClick={() => applyForRide(ride._id, user.id, index)}
                                                >
                                                    Apply
                                                </Button>
                                            ) : !userRide && user.isApply !== null ? (
                                                <Button
                                                    variant="contained"
                                                    color="error"
                                                    disabled={user.isApply === ride._id ? false : true}
                                                    onClick={() => cancelApplyForRide(ride._id, user.id, index)}
                                                >
                                                    {user.isApply === ride._id ? (
                                                        <CircularProgress size={24} />
                                                    ) : (
                                                        'Apply'
                                                    )}
                                                </Button>
                                            ) : null
                                }
                            </CardActions>

                        </Grid>

                        <Grid item xs={3}>
                            <CustomDivider orientation="vertical" flexItem />
                        </Grid>

                        <Grid item xs={5}>
                            <Box>
                                <Typography variant="body1">
                                    Ride Type: {ride.type}
                                </Typography>
                                {ride.type === "Offered Ride" && (
                                    <Typography variant="body1">
                                        Vehicle Type: {ride.vehicleType}
                                    </Typography>
                                )}
                                <Typography variant="body1">
                                    Ride Leader: {ride.userName}
                                </Typography>
                                <Typography variant="body1">
                                    Available Seats: {ride.availableSeats}
                                </Typography>
                            </Box>
                            <br />
                            <Box>
                                <Typography variant="body1">
                                    Passengers:
                                </Typography>
                                <ul style={{ listStyleType: 'none', padding: 0 }}>
                                    {ride.participants.map((participantId) => {
                                        const passenger = getUserById(participantId);
                                        return (
                                            <>
                                                {passenger ? (
                                                    <>
                                                        <li key={passenger._id}>
                                                            <Typography variant="body2">
                                                                {passenger.firstName} {passenger.lastName} ( {passenger.gender === 'male' ? 'M' : 'F'} ) ( {passenger.rating} )
                                                            </Typography>
                                                        </li>
                                                    </>
                                                ) : null}
                                            </>
                                        );
                                    })}
                                </ul>
                            </Box>
                        </Grid>
                    </Grid>
                </CardContent>
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
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                marginBottom: '10px',
                                marginTop: '20px',
                                backgroundColor: '#ffffff',
                                borderRadius: '12px',
                                padding: '10px',
                                paddingRight: '30px',
                                width: '80%',
                                marginLeft: 'auto',
                                marginRight: 'auto',
                            }}
                        >
                            <Grid container justifyContent="center" spacing={2} sx={{ margin: '0.1rem 0' }}>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        variant="outlined"
                                        label="Search by name"
                                        value={searchName}
                                        onChange={(e) => setSearchName(e.target.value)}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        variant="outlined"
                                        label="Search by starting point"
                                        value={searchStartingPoint}
                                        onChange={(e) => setSearchStartingPoint(e.target.value)}
                                    />
                                </Grid>
                            </Grid>
                            <Grid container justifyContent="center" spacing={2} sx={{ margin: '0.5rem 0' }}>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        variant="outlined"
                                        label="Search by destination"
                                        value={searchDestination}
                                        onChange={(e) => setSearchDestination(e.target.value)}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        variant="outlined"
                                        label="Search by time"
                                        value={searchTime}
                                        onChange={(e) => setSearchTime(e.target.value)}
                                    />
                                </Grid>
                            </Grid>
                        </Box>

                        <Container>
                            {renderRides()}
                        </Container>
                        <Box
                            sx={{
                                position: 'fixed',
                                bottom: 100,
                                right: 16,
                                display: 'flex',
                                flexDirection: 'row',
                                gap: 2,
                            }}
                        >
                            <Fab
                                sx={{
                                    backgroundColor: 'white',
                                    color: 'black',
                                    border: '1px solid black',
                                    padding: 5,
                                }}
                                aria-label="post ride"
                                onClick={() => {
                                    navigate('/postride');
                                }}
                            >
                                Post Ride
                            </Fab>
                            <Fab
                                sx={{
                                    backgroundColor: 'white',
                                    color: 'black',
                                    border: '1px solid black',
                                    padding: 5,
                                }}
                                aria-label="offer ride"
                                onClick={() => {
                                    navigate('/offerride');
                                }}
                            >
                                Offer Ride
                            </Fab>
                        </Box>
                    </Layout>
                </Box>
            </ThemeProvider>
        </div>
    );
}

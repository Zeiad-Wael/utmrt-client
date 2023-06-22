import React, { useContext, useState, useEffect, useRef } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Layout from './Layout';
import axios from 'axios';
import { AuthContext } from '../AuthContext';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import {
    Avatar,
    ListItem,
    ListItemAvatar,
    ListItemText,
    List,
    Divider,
    TextField,
    IconButton,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

const Ride = () => {
    const [ride, setRide] = useState(null);
    const [passengers, setPassengers] = useState([]);
    const [rideLeader, setRideLeader] = useState();
    const [applicants, setApplicants] = useState([]);
    const { authData, setAuthData } = useContext(AuthContext);
    const [messages, setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState('');
    const defaultProfileImage = 'https://via.placeholder.com/100';

    const navigate = useNavigate();
    const chatContainerRef = useRef(null);

    const fetchRide = async () => {
        try {
            const rideId = authData.user.currentRide;
            const response = await axios.get(`https://sea-turtle-app-kehgq.ondigitalocean.app/api/rides/getRide?rideId=${rideId}`);
            setRide(response.data.ride);
            setRideLeader(response.data.rideLeader);
            setPassengers(response.data.passengers || []);
            setApplicants(response.data.applicants || []);
            fetchMessages();

        } catch (error) {
            console.error('Error fetching ride:', error);
        }
    };

    const fetchMessages = async () => {
        try {
            const rideId = authData.user.currentRide;
            const response = await axios.get(`https://sea-turtle-app-kehgq.ondigitalocean.app/api/chats/getMessages?rideId=${rideId}`);
            setMessages(response.data.messages);
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    const acceptApplicant = async (rideId, applicantId) => {
        try {
            const response = await axios.post('https://sea-turtle-app-kehgq.ondigitalocean.app/api/rides/accept', { rideId, userId: applicantId });

            setApplicants(applicants.filter(applicant => applicant._id !== applicantId));
            setPassengers([...passengers, response.data.participant]);
        } catch (error) {
            console.error('Error accepting applicant:', error);
            if (error.response && error.response.data && error.response.data.message) {
                alert(error.response.data.message);
            } else {
                alert('Error accepting applicant.');
            }
        }
    };

    const denyApplicant = async (rideId, applicantId) => {
        try {
            await axios.post('https://sea-turtle-app-kehgq.ondigitalocean.app/api/rides/deny', { rideId, userId: applicantId });
            setApplicants(applicants.filter(applicant => applicant._id !== applicantId));
        } catch (error) {
            console.error('Error denying applicant:', error);
            alert('Error denying applicant.');
        }
    };

    const removePassenger = async (rideId, passengerId) => {
        try {
            await axios.post('https://sea-turtle-app-kehgq.ondigitalocean.app/api/rides/remove', { rideId, userId: passengerId });

            setPassengers(passengers.filter(passenger => passenger._id !== passengerId));
        } catch (error) {
            console.error('Error removing passenger:', error);
            alert('Error removing passenger.');
        }
    };

    const sendMessage = async (rideId) => {
        if (!messageInput.trim()) return;

        const data = {
            senderId: authData.user.id,
            content: messageInput,
        };

        try {
            const response = await axios.post('https://sea-turtle-app-kehgq.ondigitalocean.app/api/chats/sendMessage', { rideId, data });
            setMessageInput('');
        } catch (error) {
            console.error('Error sending message:', error);
            if (error.response && error.response.data && error.response.data.message) {
                alert(error.response.data.message);
            } else {
                alert('Error sending message.');
            }
        }
    };

    const rideMessage = async (rideId, msg) => {
        const data = {
            senderId: null,
            content: msg,
        };

        try {
            const response = await axios.post('https://sea-turtle-app-kehgq.ondigitalocean.app/api/chats/sendMessage', { rideId, data });
        } catch (error) {
            console.error('Error sending message:', error);
            if (error.response && error.response.data && error.response.data.message) {
                alert(error.response.data.message);
            } else {
                alert('Error sending message.');
            }
        }
    };

    useEffect(() => {
        const socket = io.connect('https://sea-turtle-app-kehgq.ondigitalocean.app');

        socket.emit('joinRide', authData.user.currentRide);

        socket.on('newApplicant', () => {
            fetchRide();
        });

        socket.on('applicantCanceled', () => {
            fetchRide();
        });

        socket.on('applicantDenied', () => {
            fetchRide();
        });
        socket.on('applicantAccepted', (data) => {
            rideMessage(authData.user.currentRide, data.msg);
            fetchMessages();
            fetchRide();
        });

        socket.on('passengerLeave', (data) => {
            rideMessage(authData.user.currentRide, data.msg);
            fetchMessages();
            fetchRide();
        });

        socket.on('newMessage', () => {
            fetchMessages();
        });

        socket.on('passengerRemoved', (data) => {
            if (data.participantId === authData.user.id) {
                alert('You have been removed from the ride.');
                navigate('/rides');
            } else {
                rideMessage(authData.user.currentRide, data.msg);
                fetchMessages();
                fetchRide();
            }
        });

        socket.on('rideDisbandedIn', () => {
            const updatedUser = {
                ...JSON.parse(window.localStorage.getItem('authData')).user,
                isApply: null,
                currentRide: null,
            };

            const updatedAuthData = { ...authData, user: updatedUser };
            setAuthData(updatedAuthData);
            localStorage.setItem('authData', JSON.stringify(updatedAuthData));
            navigate('/rides');
            alert('The ride has been disbanded by the ride leader.');
        });

        socket.on('doneRide', () => {
            const updatedUser = {
                ...JSON.parse(window.localStorage.getItem('authData')).user,
                isApply: null,
                currentRide: null,
            };

            const updatedAuthData = { ...authData, user: updatedUser };
            setAuthData(updatedAuthData);
            localStorage.setItem('authData', JSON.stringify(updatedAuthData));
            navigate('/rides');
            alert('The ride is completed.');
        });

        socket.on('ridePulledUp', (data) => {
            rideMessage(authData.user.currentRide, data.msg);
            fetchMessages();
        });


        socket.on('newMessage', (message) => {
            setMessages((prevMessages) => [...prevMessages, message]);
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    useEffect(() => {
        fetchRide();
    }, []);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]);

    const rideDone = async (rideId) => {
        try {
            const response = await axios.post(`https://sea-turtle-app-kehgq.ondigitalocean.app/api/histories/done?rideId=${rideId}`);

            if (response.data.success) {
                console.log('Ride marked as done');
            } else {
                console.error('Error marking ride as done');
            }
        } catch (error) {
            console.error('Request error:', error);
        }
    };

    const ridePullUp = async (rideId) => {
        try {
            const response = await axios.post(`https://sea-turtle-app-kehgq.ondigitalocean.app/api/rides/pullUp?rideId=${rideId}`);

            if (response.data.success) {
                console.log('Ride pulled up');
            } else if (!response.data.success) {
                alert(response.data.message);
            } else {
                console.error('Error pulling up the ride');
            }
        } catch (error) {
            console.error('Request error:', error);
        }
    };

    const renderPassengers = () => {
        if (!ride) return null;

        return passengers.map(passenger => (
            <ListItem key={passenger.matricNumber}>
                <ListItemAvatar>
                    <Avatar
                        alt="Profile Image"
                        src={passenger.profileImage || defaultProfileImage}
                        sx={{ width: 80, height: 80, marginRight: '16px' }}
                    />
                </ListItemAvatar>
                <ListItemText
                    primary={`${passenger.firstName} ${passenger.lastName} ( ${passenger.gender === 'male' ? 'M' : 'F'} ) ( ${passenger.rating} )`}
                    secondary={`Matric Number: ${passenger.matricNumber}`}
                />
                {authData.user.id === ride.userId ? (
                    <Button
                        variant="contained"
                        color="error"
                        onClick={() => removePassenger(ride._id, passenger._id)}
                    >
                        Remove
                    </Button>
                ) : null}
            </ListItem>
        ));
    };
    const renderApplicants = () => {
        if (!ride) return null;

        return applicants.map((applicant) => (
            <Box key={applicant._id} sx={{ marginBottom: '16px' }}>
                <ListItem>
                    <ListItemAvatar>
                        <Avatar
                            alt="Profile Image"
                            src={applicant.profileImage || defaultProfileImage}
                            sx={{ width: 80, height: 80, marginRight: '16px' }}
                        />
                    </ListItemAvatar>
                    <ListItemText
                        primary={`${applicant.firstName} ${applicant.lastName} ( ${applicant.gender === 'male' ? 'M' : 'F'} ) ( ${applicant.rating} )`}
                        secondary={`Matric Number: ${applicant.matricNumber}`}
                    />
                </ListItem>
                {authData.user.id === ride.userId ? (
                    <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'flex-end' }}>
                        <Button
                            variant="contained"
                            color="primary"
                            sx={{ marginRight: '8px' }}
                            onClick={() => acceptApplicant(ride._id, applicant._id)}
                        >
                            Accept
                        </Button>
                        <Button variant="contained" color="error" onClick={() => denyApplicant(ride._id, applicant._id)}>
                            Deny
                        </Button>
                    </Box>
                ) : null}
            </Box>

        ));
    };

    const renderRideInfo = () => {
        if (!ride) return null;

        return (
            <Box sx={{ marginTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                    <Typography variant="h6" gutterBottom>
                        Ride Information
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                        Name: {ride.name}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                        Destination: {ride.destination}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                        Start Point: {ride.startingPoint}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                        Time: {ride.time}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                        Available Seats: {ride.availableSeats}
                    </Typography>
                </Box>
                {authData.user.id === ride.userId && (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '80px', marginRight: '40px' }}>
                        <Button variant="contained" color="success" onClick={() => rideDone(ride._id)}>
                            Done
                        </Button>
                        <Button variant="contained" color="warning" onClick={() => ridePullUp(ride._id)}>
                            Pull Up
                        </Button>
                    </Box>
                )}
            </Box>
        );
    };

    return (
        <Layout headerHeight={64} footerHeight={64}>
            <Grid container spacing={0} sx={{ height: `calc(100vh - ${64 + 64}px)` }}>
                <Grid item xs={3}>
                    <Paper elevation={3} sx={{ height: '100%', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
                        <Box sx={{ padding: '16px', flexGrow: 1 }}>
                            <Typography variant="h5" gutterBottom>
                                Passengers
                            </Typography>
                            <List>
                                <ListItem>
                                    <Avatar
                                        alt="Profile Image"
                                        src={rideLeader?.profileImage || defaultProfileImage}
                                        sx={{ width: 80, height: 80, marginRight: '16px' }}
                                    />
                                    <ListItemText
                                        primary={`${rideLeader?.firstName} ${rideLeader?.lastName} ( ${rideLeader?.gender === 'male' ? 'M' : 'F'} ) ( ${rideLeader?.rating} )`}
                                        secondary={`Matric Number: ${rideLeader?.matricNumber}`}
                                    />
                                </ListItem>
                                <Divider />
                                {renderPassengers()}
                            </List>
                        </Box>
                        <Box sx={{ padding: '16px', backgroundColor: 'background.paper' }}>
                            {renderRideInfo()}
                        </Box>
                    </Paper>
                </Grid>
                <Grid item xs={6}>
                    <Paper elevation={3} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                        <Box sx={{ padding: '16px' }}>
                            <Typography variant="h5" gutterBottom sx={{ textAlign: 'center' }}>
                                Chat
                            </Typography>

                        </Box>
                        <Box sx={{ flexGrow: 1, padding: '0 16px', display: 'flex', flexDirection: 'column' }}>
                            <div style={{ maxHeight: '650px', overflowY: 'auto' }} ref={chatContainerRef}>
                                {messages.map((message) => (
                                    <Box key={message._id} sx={{ marginBottom: '16px' }}>
                                        <ListItem>
                                            <ListItemText
                                                primary={message.senderId ? `${message.senderName}` : null}
                                                secondary={message.content}
                                                align={message.senderId === authData.user.id ? 'right' : message.senderId ? 'left' : 'center'}
                                            />
                                        </ListItem>
                                        {message.senderId &&
                                            <Box
                                                sx={{
                                                    textAlign: message.senderId === authData.user.id ? 'right' : 'left',
                                                    paddingRight: message.senderId === authData.user.id ? '8px' : '0px',
                                                    paddingLeft: message.senderId === authData.user.id ? '0px' : '8px',
                                                }}
                                            >
                                                <Typography variant="caption">
                                                    {new Date(message.time).toLocaleString()}
                                                </Typography>
                                            </Box>
                                        }
                                    </Box>
                                ))}
                            </div>
                        </Box>


                        <Divider sx={{ marginTop: '16px', marginBottom: '8px' }} />
                        <Box sx={{ padding: '8px 16px' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    size="small"
                                    label="Type your message"
                                    value={messageInput}
                                    onChange={(e) => setMessageInput(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            console.log('enter');
                                            sendMessage(ride._id);
                                        }
                                    }}
                                />

                                <IconButton
                                    color="primary"
                                    aria-label="Send message"
                                    sx={{ marginLeft: '8px' }}
                                    onClick={() => sendMessage(ride._id)}
                                >

                                    <SendIcon />
                                </IconButton>

                            </Box>
                        </Box>
                    </Paper>
                </Grid>
                <Grid item xs={3}>
                    <Paper elevation={3} sx={{ height: '100%', overflowY: 'auto' }}>
                        <Box sx={{ padding: '16px' }}>
                            <Typography variant="h5" gutterBottom>
                                Applicants
                            </Typography>
                            <List>{renderApplicants()}</List>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Layout>

    );
};

export default Ride;
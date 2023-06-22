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
import InputAdornment from '@mui/material/InputAdornment';

const theme = createTheme();

const CustomCard = styled(Card)({
    backgroundColor: 'white',
    border: '1px solid #E0E0E0',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    minWidth: 300,
    minHeight: 400,
    padding: '10px',
    margin: '20px',
});

const Container = styled(Grid)({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
});

export default function Tickets() {
    const navigate = useNavigate();
    const [tickets, setTickets] = useState([]);
    const [user, setUser] = useState(JSON.parse(window.localStorage.getItem('authData')).user);
    const [filteredTickets, setFilteredTickets] = useState([]);
    const [searchName, setSearchName] = useState('');
    const [searchStartingPoint, setSearchStartingPoint] = useState('');
    const [searchDestination, setSearchDestination] = useState('');
    const [searchTime, setSearchTime] = useState('');

    const fetchTickets = async () => {
        try {
            const res = await axios.get('https://sea-turtle-app-kehgq.ondigitalocean.app/api/tickets/getTickets');
            setTickets(res.data);
            setFilteredTickets(res.data);
        } catch (error) {
            console.error('Error fetching tickets:', error);
        }
    };

    useEffect(() => {
        fetchTickets();
    }, []);

    useEffect(() => {
        setFilteredTickets(
            tickets.filter((ticket) =>
                ticket.name.toLowerCase().includes(searchName.toLowerCase()) &&
                ticket.startingPoint.toLowerCase().includes(searchStartingPoint.toLowerCase()) &&
                ticket.destination.toLowerCase().includes(searchDestination.toLowerCase()) &&
                ticket.time.toLowerCase().includes(searchTime.toLowerCase())
            )
        );
    }, [searchName, searchStartingPoint, searchDestination, searchTime, tickets]);


    const handleRemoveTicket = async (ticketId) => {
        try {
            await axios.post('https://sea-turtle-app-kehgq.ondigitalocean.app/api/tickets/removeTicket', { ticketId });
            setTickets(tickets.filter(ticket => ticket._id !== ticketId));
            setFilteredTickets(filteredTickets.filter(ticket => ticket._id !== ticketId));
        } catch (error) {
            console.error('Error removing ticket:', error);
        }
    };

    const renderTickets = () => {
        return filteredTickets.map((ticket, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                <CustomCard>
                    <CardContent sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
                        <div>
                            <Typography variant="h5" gutterBottom>
                                {ticket.name}
                            </Typography>
                            <Typography variant="body1" sx={{ marginTop: '20px' }}>
                                Starting Point: {ticket.startingPoint}
                            </Typography>
                            <Typography variant="body1" sx={{ marginTop: '10px' }}>
                                Destination: {ticket.destination}
                            </Typography>
                            <Typography variant="body1" sx={{ marginTop: '10px' }}>
                                Time: {ticket.time}
                            </Typography>
                            <Typography variant="body1" sx={{ marginTop: '10px' }}>
                                Phone number: {ticket.phoneNumber}
                            </Typography>
                            <Typography variant="body1" sx={{ marginTop: '10px' }}>
                                Price: {ticket.price}
                            </Typography>
                        </div>
                        {(ticket.userId === user.id)
                            ? (<Button variant="contained" color="error" onClick={() => handleRemoveTicket(ticket._id)} sx={{ marginTop: '80px' }}>
                                Remove
                            </Button>
                            ) :
                            (
                                <Button variant="contained" color="success" onClick={() => navigator.clipboard.writeText(ticket.phoneNumber)} sx={{ marginTop: '80px' }}>
                                    Copy Phone Number
                                </Button>

                            )
                        }
                    </CardContent>
                </CustomCard>
            </Grid>
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
                            {renderTickets(filteredTickets)}
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
                                aria-label="sell ticket"
                                onClick={() => {
                                    navigate('/sellticket');
                                }}
                            >
                                Sell Ticket
                            </Fab>
                        </Box>
                    </Layout>
                </Box>
            </ThemeProvider>
        </div>
    );
}

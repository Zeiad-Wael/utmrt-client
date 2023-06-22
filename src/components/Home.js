import React from 'react';
import '../css/Home.css';

import Layout from './Layout';

import { Box, Grid, Typography, Button, Container, Stack } from '@mui/material';
import { Link } from 'react-router-dom';

export default function Home() {
    return (
        <div>
            <Layout>
                <Box>   
                    <Box sx={{ bgcolor: 'black', py: 36 }}>
                        <Box sx={{ maxWidth: '60%', mx: 'auto' }}>
                            <Typography variant="h4" color="white">
                                Gather Together
                            </Typography>
                            <Typography variant="h4" color="white" sx={{ ml: "110px" }}>
                                Order Together
                            </Typography>
                        </Box>
                    </Box>
                    <Box sx={{ py: 2, bgcolor: '#4F1212', borderBottom: '3px solid #4F1212', }}>
                        <Grid container spacing={1} justifyContent="center">
                            <Grid item xs={12} md={3}>
                                <Box sx={{ textAlign: 'center' }}>
                                    <Typography variant="h6" gutterBottom sx={{ color: 'white' }}>
                                        Authentication
                                    </Typography>
                                    <Stack>
                                        <Button component={Link} to="/signin" sx={{ color: 'white' }}>
                                            Login
                                        </Button>
                                        <Button component={Link} to="/register" sx={{ color: 'white' }}>
                                            Register
                                        </Button>
                                    </Stack>
                                </Box>
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <Box sx={{ textAlign: 'center' }}>
                                    <Typography variant="h6" gutterBottom sx={{ color: 'white' }}>
                                        Create Ride
                                    </Typography>
                                    <Stack>
                                        <Button component={Link} to="/postride" sx={{ color: 'white' }}>
                                            Post Ride
                                        </Button>
                                        <Button component={Link} to="/offerride" sx={{ color: 'white' }}>
                                            Offer Ride
                                        </Button>
                                    </Stack>
                                </Box>
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <Box sx={{ textAlign: 'center' }}>
                                    <Typography variant="h6" gutterBottom sx={{ color: 'white' }}>
                                        Ride
                                    </Typography>
                                    <Stack>
                                        <Button component={Link} to="/rides" sx={{ color: 'white' }}>
                                            Available Rides
                                        </Button>
                                        <Button component={Link} to="/history" sx={{ color: 'white' }}>
                                            History
                                        </Button>
                                    </Stack>
                                </Box>
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <Box sx={{ textAlign: 'center' }}>
                                    <Typography variant="h6" gutterBottom sx={{ color: 'white' }}>
                                        Tickets
                                    </Typography>
                                    <Stack>
                                        <Button component={Link} to="/tickets" sx={{ color: 'white' }}>
                                            Tickets
                                        </Button>
                                        <Button component={Link} to="/selltickets" sx={{ color: 'white' }}>
                                            Sell Tickets
                                        </Button>
                                    </Stack>
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Layout>
        </div>
    );
}

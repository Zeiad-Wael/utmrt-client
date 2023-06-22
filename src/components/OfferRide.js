import * as React from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { TextField } from '@mui/material';
import { Formik, Form, Field } from 'formik';
import * as yup from 'yup';
import Layout from './Layout';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../AuthContext';

const theme = createTheme();

const OfferRideSchema = yup.object().shape({
    name: yup.string().required('Name is required'),
    destination: yup.string().required('Destination is required'),
    time: yup.string().required('Time is required'),
    startingPoint: yup.string().required('Starting point is required'),
    vehicleType: yup.string().required('Vehicle type is required'),
    availableSeats: yup
        .number()
        .min(1, 'Minimum 1 seat')
        .max(5, 'Maximum 5 seats')
        .required('Available seats are required'),
});

function OfferRide() {
    const navigate = useNavigate();
    const { authData } = useContext(AuthContext);
    const [serverError, setServerError] = useState(null);
    const { user } = authData;

    const handleSubmit = async (values) => {
        try {
            const rideData = {
                userId: user.id,
                userName: `${user.firstName} ${user.lastName}`,
                name: values.name,
                destination: values.destination,
                startingPoint: values.startingPoint,
                time: values.time,
                availableSeats: values.availableSeats,
                vehicleType: values.vehicleType,
            };

            const response = await axios.post('https://sea-turtle-app-kehgq.ondigitalocean.app/api/rides/offerRide', rideData);

            if (response.status === 201) {
                console.log('Ride successfully created:', response.data);
                authData.user.currentRide = response.data.ride._id;
                navigate(`/rides`);
            } else {
                console.error('Error creating ride:', response);
            }
        } catch (error) {
            console.error('Error creating ride:', error);
            setServerError(error.response.data.message);
        }
    };


    return (
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
                    <Container component="main" maxWidth="xs">
                        <Box
                            sx={{
                                marginTop: 2,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                backgroundColor: 'white',
                                padding: '2rem',
                                borderRadius: '1rem',
                            }}
                        >
                            <Typography component="h1" variant="h5" >
                                Offer Ride
                            </Typography>
                            <hr
                                style={{
                                    width: '50%',
                                    borderTop: '1px solid black',
                                    margin: '1rem auto',
                                }}
                            />
                            <Formik
                                initialValues={{
                                    name: '',
                                    destination: '',
                                    time: '',
                                    startingPoint: '',
                                    availableSeats: '',
                                    vehicleType: '',
                                }}
                                validationSchema={OfferRideSchema}
                                onSubmit={handleSubmit}
                            >
                                {({ errors, touched, values, handleChange }) => (
                                    <Form noValidate>
                                        <Field
                                            as={TextField}
                                            variant="outlined"
                                            margin="normal"
                                            required
                                            fullWidth
                                            id="name"
                                            label="Name"
                                            name="name"
                                            value={values.name}
                                            onChange={handleChange}
                                            error={errors.name && touched.name}
                                            helperText={errors.name && touched.name && errors.name}
                                        />
                                        <Field
                                            as={TextField}
                                            variant="outlined"
                                            margin="normal"
                                            required
                                            fullWidth
                                            id="destination"
                                            label="Destination"
                                            name="destination"
                                            value={values.destination}
                                            onChange={handleChange}
                                            error={errors.destination && touched.destination}
                                            helperText={errors.destination && touched.destination && errors.destination}
                                        />
                                        <Field
                                            as={TextField}
                                            variant="outlined"
                                            margin="normal"
                                            required
                                            fullWidth
                                            id="time"
                                            label="Time"
                                            name="time"
                                            value={values.time}
                                            onChange={handleChange}
                                            error={errors.time && touched.time}
                                            helperText={errors.time && touched.time && errors.time}
                                        />

                                        <Field
                                            as={TextField}
                                            variant="outlined"
                                            margin="normal"
                                            required
                                            fullWidth
                                            id="startingPoint"
                                            label="Starting Point"
                                            name="startingPoint"
                                            value={values.startingPoint}
                                            onChange={handleChange}
                                            error={errors.startingPoint && touched.startingPoint}
                                            helperText={errors.startingPoint && touched.startingPoint && errors.startingPoint}
                                        />

                                        <Field
                                            as={TextField}
                                            variant="outlined"
                                            margin="normal"
                                            required
                                            fullWidth
                                            id="vehicleType"
                                            label="Vehicle Type"
                                            name="vehicleType"
                                            value={values.vehicleType}
                                            onChange={handleChange}
                                            error={errors.vehicleType && touched.vehicleType}
                                            helperText={errors.vehicleType && touched.vehicleType && errors.vehicleType}
                                        />

                                        <Field
                                            as={TextField}
                                            variant="outlined"
                                            margin="normal"
                                            required
                                            fullWidth
                                            id="availableSeats"
                                            label="Available Seats"
                                            name="availableSeats"
                                            type="number"
                                            inputProps={{ min: 1, max: 5 }}
                                            value={values.availableSeats}
                                            onChange={handleChange}
                                            error={errors.availableSeats && touched.availableSeats}
                                            helperText={errors.availableSeats && touched.availableSeats && errors.availableSeats}
                                        />
                                        <Button
                                            type="submit"
                                            fullWidth
                                            variant="contained"
                                            sx={{
                                                mt: 2,
                                                color: 'white',
                                                bgcolor: 'black',
                                                ':hover': {
                                                    bgcolor: 'black',
                                                    opacity: [0.9, 0.8, 0.7],
                                                },
                                            }}
                                        >
                                            Submit
                                        </Button>
                                        {serverError && (
                                            <Typography color="error" variant="body2" sx={{ mt: 2 }}>
                                                {serverError}
                                            </Typography>
                                        )}
                                    </Form>
                                )}
                            </Formik>
                        </Box>
                    </Container>
                </Layout>
            </Box>
        </ThemeProvider>
    );
}

export default OfferRide;
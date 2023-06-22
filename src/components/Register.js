import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import withNoAuth from './withNoAuth';
import * as yup from 'yup';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { TextField } from 'formik-material-ui';
import Layout from "./Layout"
import { useState } from 'react';

const theme = createTheme();

function Register() {

    const [serverError, setServerError] = useState(null);

    const RegisterSchema = yup.object().shape({
        firstName: yup.string().required('First name is required'),
        lastName: yup.string().required('Last name is required'),
        matricNumber: yup
            .string()
            .length(9, 'Matric Number must be exactly 9 characters')
            .required('Matric Number is required'),
        phone: yup
            .string()
            .matches(
                /^(\+?6?01)[0-46-9]-*[0-9]{7,8}$/,
                'Must be a valid Malaysian phone number'
            )
            .required('Phone number is required'),
        gender: yup.string().required('Gender is required'),
        email: yup
            .string()
            .email('Must be a valid email address')
            .required('Email is required'),
        password: yup
            .string()
            .min(8, 'Password must be at least 8 characters')
            .required('Password is required'),
    });

    const navigate = useNavigate();
    const handleSubmit = async (values) => {
        const user = {
            firstName: values.firstName,
            lastName: values.lastName,
            email: values.email,
            password: values.password,
            matricNumber: values.matricNumber,
            phone: values.phone,
            gender: values.gender,
        };

        try {
            const response = await axios.post('https://sea-turtle-app-kehgq.ondigitalocean.app/api/users/register', user);
            console.log(response.data);
            navigate(`/signin`);
        } catch (error) {
            console.error('Error registering user:', error.response.data);
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
                                Sign up
                            </Typography>
                            <hr style={{
                                width: '50%',
                                borderTop: '1px solid black',
                                margin: '1rem auto',
                            }} />
                            <Formik
                                initialValues={{
                                    firstName: '',
                                    lastName: '',
                                    matricNumber: '',
                                    phone: '',
                                    gender: '',
                                    email: '',
                                    password: '',
                                }}
                                validationSchema={RegisterSchema}
                                onSubmit={handleSubmit}
                            >
                                {({ errors, touched }) => (
                                    <Form noValidate>
                                        <Box sx={{ mt: 3 }}>
                                            <Grid container spacing={2}>
                                                <Grid item xs={12} sm={6}>
                                                    <Field
                                                        component={TextField}
                                                        fullWidth
                                                        id="firstName"
                                                        label="First Name"
                                                        name="firstName"
                                                        autoComplete="given-name"
                                                        autoFocus
                                                    />
                                                </Grid>
                                                <Grid item xs={12} sm={6}>
                                                    <Field
                                                        component={TextField}
                                                        fullWidth
                                                        id="lastName"
                                                        label="Last Name"
                                                        name="lastName"
                                                        autoComplete="family-name"
                                                    />
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <Field
                                                        component={TextField}
                                                        fullWidth
                                                        id="matricNumber"
                                                        label="Matric Number"
                                                        name="matricNumber"
                                                        autoComplete="off"
                                                    />
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <Field
                                                        component={TextField}
                                                        fullWidth
                                                        id="phone"
                                                        label="Phone Number"
                                                        name="phone"
                                                        autoComplete="off"
                                                    />
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <Field
                                                        component={TextField}
                                                        select
                                                        fullWidth
                                                        id="gender"
                                                        name="gender"
                                                        SelectProps={{
                                                            native: true,
                                                        }}
                                                        sx={{ mb: 1 }}
                                                    >
                                                        <option value="">Select Gender</option>
                                                        <option value="male">Male</option>
                                                        <option value="female">Female</option>
                                                    </Field>
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <Field
                                                        component={TextField}
                                                        fullWidth
                                                        id="email"
                                                        label="Email Address"
                                                        name="email"
                                                        autoComplete="email"
                                                    />
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <Field
                                                        component={TextField}
                                                        fullWidth
                                                        id="password"
                                                        label="Password"
                                                        type="password"
                                                        name="password"
                                                        autoComplete="new-password"
                                                    />
                                                </Grid>
                                            </Grid>
                                            <Button
                                                type="submit"
                                                fullWidth
                                                variant="contained"
                                                sx={{ mt: 3, mb: 2, bgcolor: 'black', ":hover": { bgcolor: 'black', opacity: [0.9, 0.8, 0.7] } }}
                                            >
                                                Sign Up
                                            </Button>
                                            {serverError && (
                                                <Typography color="error" variant="body2" sx={{ mt: 2 }}>
                                                    {serverError}
                                                </Typography>
                                            )}


                                            <Grid container justifyContent="flex-end">
                                                <Grid item>
                                                    <Link href="/signin" variant="body2">
                                                        Already have an account? Sign in
                                                    </Link>
                                                </Grid>
                                            </Grid>
                                        </Box>
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

export default withNoAuth(Register);
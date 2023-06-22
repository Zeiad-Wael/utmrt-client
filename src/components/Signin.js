import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useContext } from 'react';
import { AuthContext } from '../AuthContext';
import withNoAuth from './withNoAuth';
import * as yup from 'yup';
import { Formik, Form, Field, ErrorMessage } from 'formik';

import Layout from "./Layout"

const theme = createTheme();

function Signin() {
    const [serverError, setServerError] = React.useState(null);

    const SignInSchema = yup.object().shape({
        email: yup
            .string()
            .email('Must be a valid email address')
            .required('Email is required'),
        password: yup
            .string()
            .required('Password is required'),
    });

    const navigate = useNavigate();
    const { setAuthData } = useContext(AuthContext);

    const handleSubmit = async (values) => {
        const credentials = {
            email: values.email,
            password: values.password,
        };

        try {
            const response = await axios.post('https://sea-turtle-app-kehgq.ondigitalocean.app/api/users/signin', credentials);
        setAuthData({
            token: response.data.token,
            user: {
                id: response.data.user.id,
                firstName: response.data.user.firstName,
                lastName: response.data.user.lastName,
                email: response.data.user.email,
                password: response.data.user.password,
                matricNumber: response.data.user.matricNumber,
                phone: response.data.user.phone,
                gender: response.data.user.gender,
                profileImage: response.data.user.profileImage,
                currentRide: response.data.user.currentRide,
                isApply: response.data.user.isApply,
            },
        });
            navigate(`/`);
        } catch (error) {
            console.error('Error signing in:', error.response.data);
            setServerError('Invalid email or password');
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
                                marginTop: 8,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                backgroundColor: 'white',
                                padding: '2rem',
                                borderRadius: '1rem',
                            }}
                        >
                            <Typography component="h1" variant="h5" sx={{ mt: 5 }}>
                                Sign in
                            </Typography>
                            <hr style={{
                                width: '50%',
                                borderTop: '1px solid black',
                                margin: '1rem auto',
                            }} />
                            <Formik
                                initialValues={{
                                    email: '',
                                    password: '',
                                }}
                                validationSchema={SignInSchema}
                                onSubmit={handleSubmit}
                            >
                                {({ errors, touched }) => (
                                    <Form noValidate>
                                        <Field
                                            as={TextField}
                                            margin="normal"
                                            required
                                            fullWidth
                                            id="email"
                                            label="Email Address"
                                            name="email"
                                            autoComplete="email"
                                            autoFocus
                                            error={errors.email && touched.email}
                                            helperText={errors.email && touched.email && errors.email}
                                        />
                                        <Field
                                            as={TextField}
                                            margin="normal"
                                            required
                                            fullWidth
                                            name="password"
                                            label="Password"
                                            type="password"
                                            id="password"
                                            autoComplete="current-password"
                                            error={errors.password && touched.password}
                                            helperText={errors.password && touched.password && errors.password}
                                        />
                                        {serverError && (
                                            <Typography color="error" variant="body2" sx={{ mt: 2 }}>
                                                {serverError}
                                            </Typography>
                                        )}
                                        <Button
                                            type="submit"
                                            fullWidth
                                            variant="contained"
                                            sx={{ mt: 3, mb: 2, color: 'white', bgcolor: 'black', ":hover": { bgcolor: 'black', opacity: [0.9, 0.8, 0.7] } }}
                                        >
                                            Sign In
                                        </Button>
                                        <Grid container justifyContent="flex-end">
                                            <Grid item>
                                                <Link href="/register" variant="body2">
                                                    Don't have an account? Sign Up
                                                </Link>
                                            </Grid>
                                        </Grid>
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

export default withNoAuth(Signin);


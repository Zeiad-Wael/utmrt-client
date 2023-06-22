import React, { useContext, useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, Grid, Avatar } from '@mui/material';
import { AuthContext } from '../AuthContext';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Layout from './Layout';
import axios from 'axios';

const theme = createTheme();

function Profile() {
    const [jsonString] = useState(window.localStorage.getItem('authData'));
    const jsonObj = JSON.parse(jsonString);

    const { authData, setAuthData } = useContext(AuthContext);
    const [firstName, setFirstName] = useState(jsonObj.user.firstName);
    const [lastName, setLastName] = useState(jsonObj.user.lastName);
    const [phone, setPhone] = useState(jsonObj.user.phone);
    const [profileImage, setProfileImage] = useState(jsonObj.user.profileImage);
    const [profileImageUrl, setProfileImageUrl] = useState(jsonObj.user.profileImage);
    const [password, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [serverError, setServerError] = useState('');

    const defaultProfileImage = 'https://via.placeholder.com/100';

    useEffect(() => {
        if (!profileImage) {
            setProfileImageUrl(jsonObj.user.profileImage);
        }
    }, [jsonObj.user.profileImage, profileImage]);

    const isMalaysianPhoneNumber = (number) => {
        const pattern = /^(\+?6?01)[0-46-9]-*[0-9]{7,8}$/;
        return pattern.test(number);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (phone && !isMalaysianPhoneNumber(phone)) {
            alert('Please enter a valid Malaysian phone number.');
            return;
        }

        if (newPassword && newPassword.length < 8) {
            alert('New password must be at least 8 characters.');
            return;
        }

        const formData = new FormData();
        formData.append('firstName', firstName);
        formData.append('lastName', lastName);
        formData.append('phone', phone);
        formData.append('password', password);
        formData.append('newPassword', newPassword);
        if (profileImage) {
            formData.append('profileImage', profileImage);
        }

        try {
            const response = await axios.patch(
                'https://sea-turtle-app-kehgq.ondigitalocean.app/api/users/update',
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${authData.token}`,
                    },
                }
            );
            setAuthData({
                ...authData,
                user: response.data.user,
            });
            setServerError('');
        } catch (error) {
            console.error('Error updating profile:', error.response.data);
            setServerError(error.response.data.message);
        }
    };

    const handleImageChange = (event) => {
        if (event.target.files && event.target.files[0]) {
            setProfileImage(event.target.files[0]);
            setProfileImageUrl(URL.createObjectURL(event.target.files[0]));
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box
                sx={{
                    backgroundImage: `url(${process.env.PUBLIC_URL}/images/background.png)`,
                    backgroundSize: 'cover',
                    minHeight: '50vh',
                }}
            >
                <Layout>
                    <Box
                        sx={{
                            minHeight: '80vh',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            flexDirection: 'column',
                        }}
                    >
                        <Box
                            sx={{
                                backgroundColor: 'white',
                                borderRadius: '4px',
                                padding: '2rem',
                            }}
                        >
                            <Typography component="h1" variant="h5" sx={{
                                mt: 5,
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                flexDirection: 'column',
                            }}>
                                Profile
                            </Typography>
                            <hr
                                style={{
                                    width: '50%',
                                    borderTop: '1px solid black',
                                    margin: '1rem auto',
                                    marginBottom: '2rem',
                                }}
                            />
                            <Grid container spacing={2} justifyContent="center">
                                <Grid item xs={12} sm={6}>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            flexDirection: 'column',
                                            mt: 10
                                        }}
                                    >
                                        <Avatar
                                            alt="Profile Image"
                                            src={profileImageUrl || defaultProfileImage}
                                            sx={{ width: 100, height: 100 }}
                                        />
                                        <input
                                            accept="image/*"
                                            id="contained-button-file"
                                            type="file"
                                            style={{ display: 'none' }}
                                            onChange={handleImageChange}
                                        />
                                        <label htmlFor="contained-button-file">
                                            <Button variant="contained" component="span" sx={{ mt: 2, bgcolor: 'black', ":hover": { bgcolor: 'black', opacity: [0.9, 0.8, 0.7] } }}>
                                                Change Image
                                            </Button>
                                        </label>
                                    </Box>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="First Name"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                    />
                                    <TextField
                                        fullWidth
                                        label="Last Name"
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        sx={{ mt: 2 }}
                                    />
                                    <TextField
                                        fullWidth
                                        label="Phone"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        sx={{ mt: 2 }}
                                    />
                                    <TextField
                                        fullWidth
                                        label="Current Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        type="password"
                                        sx={{ mt: 2 }}
                                    />
                                    <TextField
                                        fullWidth
                                        label="New Password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        type="password"
                                        sx={{ mt: 2 }}
                                    />
                                    {serverError && (
                                        <Typography
                                            color="error"
                                            variant="body2"
                                            sx={{ mt: 2 }}
                                        >
                                            {serverError}
                                        </Typography>
                                    )}

                                </Grid>
                                <Button
                                    variant="contained"
                                    onClick={handleSubmit}
                                    sx={{ mt: 10, bgcolor: 'black', ":hover": { bgcolor: 'black', opacity: [0.9, 0.8, 0.7] }}}
                                >
                                    Update Profile
                                </Button>
                            </Grid>
                        </Box>
                    </Box>
                </Layout>
            </Box>
        </ThemeProvider>
    );
}

export default Profile;


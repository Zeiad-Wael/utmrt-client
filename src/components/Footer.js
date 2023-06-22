import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import Badge from '@mui/material/Badge';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MailIcon from '@mui/icons-material/Mail';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MoreIcon from '@mui/icons-material/MoreVert';
import { FaTwitter, FaFacebook, FaYoutube } from 'react-icons/fa';


export default function Footer() {
    const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);

    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

    const handleMobileMenuClose = () => {
        setMobileMoreAnchorEl(null);
    };


    const handleMobileMenuOpen = (event) => {
        setMobileMoreAnchorEl(event.currentTarget);
    };

    const menuId = 'primary-search-account-menu';

    const mobileMenuId = 'primary-search-account-menu-mobile';
    const renderMobileMenu = (
        <Menu
            anchorEl={mobileMoreAnchorEl}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            id={mobileMenuId}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={isMobileMenuOpen}
            onClose={handleMobileMenuClose}
        >
            <MenuItem>
                <IconButton
                    size="large"
                    href="https://www.twitter.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    color="inherit"
                >
                    <FaTwitter />
                </IconButton>
                <p>Twitter</p>
            </MenuItem>
            <MenuItem>
                <IconButton
                    size="large"
                    href="https://www.facebook.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    color="inherit"
                >
                    <FaFacebook />
                </IconButton>
                <p>Facebook</p>
            </MenuItem>
            <MenuItem >
                <IconButton
                    size="large"
                    href="https://www.youtube.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    color="inherit"
                >
                    <FaYoutube />
                </IconButton>
                <p>Youtube</p>
            </MenuItem>
        </Menu>
    );

    return (
        <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column'}}>
            <Box sx={{ flexGrow: 1 }}>
            </Box>
            <AppBar position="static"
                sx={{
                    bottom: 0,
                    bgcolor: 'white',
                    boxShadow: 'none',
                    borderTop: '1px solid black',
                    color: 'black',
                    height: '64px'
                }}>
                <Toolbar sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    minHeight: 10,
                }}>
                    <Typography
                        variant="h11"
                        noWrap
                        component="div"
                        sx={{ display: { xs: 'none', sm: 'block' } }}
                        mx='1'
                    >
                        UTM Ride Together
                    </Typography>
                    <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                        <IconButton
                            size="large"
                            href="https://www.twitter.com/"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="watch us on YouTube"
                            color="inherit"
                        >
                            <FaTwitter />
                        </IconButton>
                        <IconButton
                            size="large"
                            href="https://www.facebook.com/"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="watch us on YouTube"
                            color="inherit"
                        >
                            <FaFacebook />
                        </IconButton>
                        <IconButton
                            size="large"
                            href="https://www.youtube.com/"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="watch us on YouTube"
                            color="inherit"
                        >
                            <FaYoutube />
                        </IconButton>
                    </Box>
                    <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
                        <IconButton
                            size="large"
                            aria-label="show more"
                            aria-controls={mobileMenuId}
                            aria-haspopup="true"
                            onClick={handleMobileMenuOpen}
                            color="inherit"
                        >
                            <MoreIcon />
                        </IconButton>
                    </Box>
                </Toolbar>
            </AppBar>
            {renderMobileMenu}
        </Box>
    );
}
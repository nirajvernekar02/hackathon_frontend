import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { Link } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Logoo from '../Images/output-onlinegiftools.gif';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { useRef } from "react";



const defaultTheme = createTheme();

export default function SignIn() {
  const navigate = useNavigate();
  const [isVerified, setIsVerified] = React.useState(false);
  const recaptchaRef = React.useRef();

  const handleRecaptchaChange = (value) => {
    if (value) {
      setIsVerified(true);
    }
  };


  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    console.log({
      emailUsr: formData.get('emailUsr'),
      usrPwd: formData.get('usrPwd'),
    });

    try {
      const response = await axios.post('http://localhost:3500/api/user/login', {
        emailUsr: formData.get('emailUsr'),
        usrPwd: formData.get('usrPwd'),
      });
     
        if (isVerified) {
                console.log({
            emailUsr:formData.get("emailUsr"),
            usrPwd: formData.get("usrPwd"),
          });
          console.log('Response:', response.data);
          toast.success("Login succesfull")
          localStorage.setItem('userData', JSON.stringify(response.data));
          navigate('/')
          // Proceed with login
        } else {
          toast.warn("Please complete the reCAPTCHA verification.");
        }
     
    
  
      // Add code to handle success
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error check your credentials')
      // Add code to handle error
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs" sx={{ boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px" }}>
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Grid container justifyContent="center" alignItems="center">
            <Avatar alt="Logo" src={Logoo} sx={{ width: 200, height: 200 }} />
          </Grid>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="emailUsr"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="usrPwd"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
              <ReCAPTCHA
              ref={recaptchaRef}
              sitekey="6LedhYQpAAAAAPjssU5QXcYcacOWUWgN36HAW4iy"
              onChange={handleRecaptchaChange}
            />{" "}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link to="/signup" >
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

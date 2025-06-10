'use client'

import { FormEvent, useEffect, useRef, useState } from 'react';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/system';
import { csrfBroadcastChannel, httpRequestHeader } from '@misc';

const StyledContainer = styled(Container)({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    padding: '16px',
    boxSizing: 'border-box',
    width: '400px',
    maxWidth: '100%'
});

const SignInForm = ({csrf}:{csrf:string}) => {
  const [csrfToken, setCsrfToken] = useState(csrf)
  const [showPassword, setShowPassword] = useState(false);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [errorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleClickShowPassword = () => setShowPassword(!showPassword);

  const handleCloseSnackbar = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  const disableFields = (disabled:boolean) => {
    (emailRef.current as HTMLInputElement).disabled = disabled;
    (passwordRef.current as HTMLInputElement).disabled = disabled;
    setLoading(disabled);
  }

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const emailField = emailRef.current as HTMLInputElement;
    const passwordField = passwordRef.current as HTMLInputElement;
    const email = emailField.value;
    const password = passwordField.value;

    passwordField.value = ''
  
    disableFields(true);
  
    const resp = await fetch('/api/admin/sign-in', {
      method: 'POST',
      headers:httpRequestHeader(false,'client',true,csrfToken),
      body: JSON.stringify({ email, password })
    });
  
    if (resp.ok) {
      const urlParams = new URLSearchParams(window.location.search);
      const redirectPath = decodeURIComponent(urlParams.get('rd') || '');
      if (!!redirectPath && redirectPath.startsWith('/')) {
        window.location.href = redirectPath;
      } else {
        window.location.href = '/dashboard';
      }
    } else {
      const text = await resp.text()
      console.log(resp.status, text)
    }
  
    disableFields(false);
  };

  useEffect(()=>{
    const csrfBcChannel = csrfBroadcastChannel()
    csrfBcChannel.postMessage(csrfToken)
    csrfBcChannel.onmessage = (ev:MessageEvent<string>) => setCsrfToken(ev.data)
  },[])
  

  return (
    <StyledContainer maxWidth="sm">
      <form onSubmit={onSubmit}>
        <TextField
          inputRef={emailRef}
          label="Email"
          variant="outlined"
          fullWidth
          margin="normal"
          required
          type="email"
          sx={{ marginTop: '16px' }} // Add top margin to the email field
        />
        <TextField
          inputRef={passwordRef}
          label="Password"
          variant="outlined"
          fullWidth
          margin="normal"
          required
          type={showPassword ? 'text' : 'password'}
          slotProps={{
            input:{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }
          }}
        />
        <Button 
          variant="contained" 
          color="primary" 
          fullWidth 
          type="submit"
          sx={{ marginTop: '16px', marginBottom: '16px' }} // Add bottom margin to the submit button
          disabled={loading}
        >
          Submit
          {loading && (
            <CircularProgress
              size={24}
              sx={{
                position: 'absolute',
                right: '16px',
                color: 'primary',
              }}
            />
          )}
        </Button>
      </form>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={10000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          severity="error"
          onClose={handleCloseSnackbar}
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={handleCloseSnackbar}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
        >
          {errorMessage}
        </Alert>
      </Snackbar>
    </StyledContainer>
  );
};

export default SignInForm;

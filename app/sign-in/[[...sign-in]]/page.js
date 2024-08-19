'use client'

import React from 'react';
import { Container, Box, Typography, AppBar, Toolbar, Button,CardContent } from '@mui/material';
import { SignIn } from '@clerk/nextjs';
import Link from 'next/link';
import { useRouter } from 'next/navigation'


export default function SignUpPage() {
  const router = useRouter();
  const homepage =()=> {
    router.push('/');
  };

  return (
    <>
      <AppBar position="static" sx={{ bgcolor: 'black', width: '100%' }}>
        <Toolbar>
          <Typography href="/" variant="h6" sx={{ flexGrow: 1, cursor: 'pointer' }} onClick={homepage}> 
          FlashKard
          </Typography>

          <Button color="inherit" href="/sign-in">Login</Button>

          <Button color="inherit" href="/sign-up">Sign Up</Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md">
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          sx={{ textAlign: 'center', my: 4 }}
        >
          <Typography variant="h4" component="h1" gutterBottom>
            Sign In
          </Typography>
          <SignIn />
        </Box>
      </Container>
    </>
  );
}

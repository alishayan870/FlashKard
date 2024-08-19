'use client'
import Image from "next/image";
import { AppBar, Container, Toolbar, Typography, Button, Box, Grid, Paper} from "@mui/material"
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import Head from 'next/head'
import getStripe from "@/utils/get-stripe";

export default function Home() {
  
  const handleSubmit = async () => {
    const checkoutSession = await fetch('/api/checkout_sessions', {
      method: 'POST',
      headers: { origin: 'http://localhost:3000' },
    })

    const checkoutSessionJson = await checkoutSession.json()

    if(checkoutSession.statusCode === 500){
      console.error(checkoutSession.message)
      return
    }
  
    const stripe = await getStripe()

    const {error} = await stripe.redirectToCheckout({
      sessionId: checkoutSessionJson.id,
    })
  
    if (error) {
      console.warn(error.message)
    }
  }

  return (
    <>
    <AppBar sx = {{bgcolor: "black"}} position="static">
  <Toolbar>
    <Typography variant="h6" style={{flexGrow: 1}}>
      FlashKard
    </Typography>
    <SignedOut>
      <Button color="inherit" href="/sign-in">Login</Button>
      <Button color="inherit" href="/sign-up">Sign Up</Button>
    </SignedOut>
    <SignedIn>
      <UserButton />
    </SignedIn>
  </Toolbar>
  </AppBar>

  <Box sx={{textAlign: 'center', my: 4}}>
    
  <Typography variant="h2" component="h1" gutterBottom  sx={{fontFamily: 'Arial, sans-serif', fontWeight: '700',
  background: 'linear-gradient(to bottom, black, navy)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
    Flashcard Set Generator
  </Typography>

  <Typography variant="h5" component="h2" gutterBottom sx={{fontFamily: 'Arial, sans-serif', fontWeight: '400'}}>
    Effortless transform your text into flashcards.
  </Typography>

<SignedIn>
  <Button variant="contained" color="primary" sx={{':hover': {bgcolor: 'black'},mt: 2, mr: 2, bgcolor: "black"}} href="/generate">
    Begin Generating
  </Button>
  </SignedIn>

  <Button variant="contained" color="primary" sx={{':hover': {bgcolor: 'black'},mt: 2, mr: 2, bgcolor: "black"}}>
    Learn More
  </Button>

<Box sx={{ my: 6 }}>
  <Typography variant="h4" gutterBottom>Features</Typography>
  <Grid container spacing={4}>
    <Grid item xs={12} md={4}>
      <Paper elevation={3} sx={{ padding: 3 }}>
        <Typography variant="h6">Seamless Text Input</Typography>
        <Typography>
          Simply enter your text and let our AI software do the rest. Creating flashcards has never been easier.
        </Typography>
      </Paper>
    </Grid>
    <Grid item xs={12} md={4}>
      <Paper elevation={3} sx={{ padding: 3 }}>
        <Typography variant="h6">Accessible Anywhere</Typography>
        <Typography>
          Access your flashcards from any device, any time.
        </Typography>
      </Paper>
    </Grid>
    <Grid item xs={12} md={4}>
      <Paper elevation={3} sx={{ padding: 3 }}>
        <Typography variant="h6">Instant Generation</Typography>
        <Typography>
          Instantly create flashcards from your text, streamlining your study process and making it easier to review key concepts.
        </Typography>
      </Paper>
    </Grid>
  </Grid>
</Box>
</Box>

<Box sx={{my: 6, mx: 2, textAlign: 'center'}}>
  <Typography variant="h4" gutterBottom>Choose your plan</Typography>
  <Grid container spacing={4} justifyContent={"center"}>

    <SignedOut>
    <Grid item xs={4} md={3}>
      <Paper elevation={3} sx={{ padding: 3 }}>
        <Typography variant="h6" gutterBottom>Standard</Typography>
        <Typography gutterBottom> $0 / month</Typography>
        <Typography gutterBottom>
          Access to basic flashcard features & limited storage.
        </Typography>
        <Button variant="contained" color="primary" sx={{':hover': {bgcolor: 'black'},mt: 2, mr: 2, bgcolor: "black"}} href="/sign-up" >Choose Standard</Button>
      </Paper>
    </Grid>
    </SignedOut>

    
    <Grid item xs={4} md={3}>
      <Paper elevation={3} sx={{ padding: 3 }}>
        <Typography variant="h6" gutterBottom>Premium</Typography>
        <Typography gutterBottom> $10 / month</Typography> 
        <Typography gutterBottom>
          Unlimited flashcards & storage with priority support.
        </Typography>
        <Button variant="contained" color="primary" sx={{':hover': {bgcolor: 'gold'},mt: 2, mr: 2, bgcolor: "black"}} onClick={handleSubmit}>Choose Premium</Button>
      </Paper>
    </Grid>
    
  </Grid>
</Box>
</>
  )

}
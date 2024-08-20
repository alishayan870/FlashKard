'use client'

import { useUser } from "@clerk/nextjs"
import { useState, useEffect } from "react"
import { collection, doc, getDoc, setDoc } from "firebase/firestore"
import { db } from "@/firebase"
import { useRouter } from "next/navigation"
import { CardActionArea, CardContent, Typography, Container, Grid, Box, Button } from "@mui/material"


export default function Flashcards() {
  const {isLoaded, isSignedIn, user} = useUser();
  const {flashcards, setFlashcards} = useState([]);
  const router = useRouter();
  
  useEffect(() => {
    async function getFlashcards() {
      if (!user) return
      const docRef = doc(collection(db, 'users', user.id));
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const collections = docSnap.data().flashcards || [];
        setFlashcards(collections);
      } else {
        await setDoc(docRef, {flashcards: []});
        setFlashcards([]);
      }
    }
    getFlashcards();
  }, [user]);

  if (!isLoaded || !isSignedIn) {
    return <></>
  }

  const handleCardClick = (id) => {
    router.push(`/flashcard?id=${id}`)
  }

  const handleButtonClick = () => {
    router.push('/generate');
  };


  return (
    <Container maxWidth="100vw">
      <Grid container spacing={3} sx={{ mt: 4 }}>
        {flashcards && flashcards.length > 0 ? (
          flashcards.map((flashcard, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card>
                <CardActionArea onClick={() => handleCardClick(flashcard.name)}>
                  <CardContent>
                    <Typography variant="h5" component="div">
                      {flashcard.name}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))
        ) : (
          <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh', 
        width: '100vw',
        textAlign: 'center', 
        bgcolor: 'background.default',
        padding: 3,
      }}
    >
      <Typography variant="h4" color="textSecondary" gutterBottom>
        No flashcards found
      </Typography>
      <Typography variant="body1" color="textSecondary">
        Please create a new set of flashcards to get started.
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={handleButtonClick}
        sx={{ mt: 2 }}
      >
        Go Back to Generate Page
      </Button>
    </Box>
        )}
      </Grid>
    </Container>
  );
}

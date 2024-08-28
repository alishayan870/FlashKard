'use client';

import { useState } from 'react';
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import { collection, getDoc, writeBatch, doc, setDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { db } from '@/firebase';

export default function Generate() {
  const { isLoaded, isSignedIn, user } = useUser(); 
  const [text, setText] = useState('');
  const [flashcards, setFlashcards] = useState([]);
  const [name, setName] = useState('');
  const [open, setOpen] = useState(false);
  const [flipped, setFlipped] = useState([]);
  const router = useRouter();

  const handleOpen = () => {
    setOpen(true);
  };
  
  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async () => {
    fetch('api/generate', {
      method: 'POST',
      body: text,
    })
      .then((res) => res.json())
      .then((data) => setFlashcards(data)); 
  };

  const handleFlip = (index) => {
    setFlipped((prev) => {
      const newFlipped = [...prev];
      newFlipped[index] = !newFlipped[index];
      return newFlipped;
    });
  };

  // Saving flashcards to Firebase
  const saveFlashcards = async () => {
    if (!name) {
      alert('Please enter a name for your flashcard set.');
      return;
    }

    if (!user) {
      alert('User not authenticated');
      return;
    }

    const batch = writeBatch(db);
    const userDocRef = doc(collection(db, 'users'), user?.id)
    const docSnap = await getDoc(userDocRef);

    if (docSnap.exists()) {
      const collections = docSnap.data().flashcards || [];
      if (collections.find((f) => f.name === name)) {
        alert('There is already a flashcard collection with this same name.');
        return;
      } else {
        collections.push({ name });
        batch.set(userDocRef, { flashcards: collections }, { merge: true });
      }
    } else {
      batch.set(userDocRef, { flashcards: [{ name }] });
    }

    const colRef = collection(userDocRef, name);
    flashcards.forEach((flashcard) => {
      const cardDocRef = doc(colRef);
      batch.set(cardDocRef, flashcard);
    });

    await batch.commit();
    handleClose();
    router.push('/flashcards')
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Generate Flashcards
        </Typography>
        <TextField
          value={text}
          onChange={(e) => setText(e.target.value)}
          label="Enter text"
          fullWidth
          multiline
          rows={4}
          variant="outlined"
          sx={{
            mb: 2,
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: 'black',
              },
              '&:hover fieldset': {
                borderColor: 'black',
              },
              '&.Mui-focused fieldset': {
                borderColor: 'black',
              },
            },
          }}
        />
        <Button
          variant="contained"
          onClick={handleSubmit}
          fullWidth
          sx={{ bgcolor: 'black', color: 'white' }}
        >
          Generate Flashcards
        </Button>
      </Box>

      {flashcards.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            Generated Flashcards
          </Typography>
          <Grid container spacing={2}>
            {flashcards.map((flashcard, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Box
                  sx={{
                    perspective: '1000px',
                    cursor: 'pointer',
                    '&:hover': {
                      transform: 'scale(1.05)',
                    },
                  }}
                  onClick={() => handleFlip(index)}
                >
                  <Box
                    sx={{
                      position: 'relative',
                      width: '100%',
                      height: '200px',
                      transformStyle: 'preserve-3d',
                      transform: flipped[index] ? 'rotateY(180deg)' : 'rotateY(0deg)',
                      transition: 'transform 0.6s',
                    }}
                  >
                    <Card
                      sx={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        backfaceVisibility: 'hidden',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: 2,
                      }}
                    >
                      <CardContent>
                        <Typography>{flashcard.front}</Typography>
                      </CardContent>
                    </Card>
                    <Card
                      sx={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        backfaceVisibility: 'hidden',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transform: 'rotateY(180deg)',
                        padding: 2,
                      }}
                    >
                      <CardContent>
                        <Typography>{flashcard.back}</Typography>
                      </CardContent>
                    </Card>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {flashcards.length > 0 && (
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
          <Button variant="contained" color="primary" onClick={handleOpen}>
            Save Flashcards
          </Button>
        </Box>
      )}

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Save Flashcard Set</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter a name for your flashcard set.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Set Name"
            type="text"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
            variant="outlined"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={saveFlashcards} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

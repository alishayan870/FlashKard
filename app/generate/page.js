'use client'

import { useState } from 'react'
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
  CardContent
} from '@mui/material'

export default function Generate() {
  const [text, setText] = useState('')
  const [flashcards, setFlashcards] = useState([])
  const [setName, setSetName] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [flipped, setFlipped] = useState([])

  const handleOpenDialog = () => setDialogOpen(true)
  const handleCloseDialog = () => setDialogOpen(false)

  const handleSubmit = async () => {
    if (!text.trim()) {
      alert('Please enter some text to generate flashcards.')
      return
    }
  
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        body: text,
      })
  
      if (!response.ok) {
        throw new Error('Failed to generate flashcards')
      }
  
      const data = await response.json()
      setFlashcards(data)
      setFlipped(new Array(data.length).fill(false))
    } catch (error) {
      console.error('Error generating flashcards:', error)
      alert('An error occurred while generating flashcards. Please try again.')
    }
  }

  const handleFlip = (index) => {
    setFlipped(flipped.map((flip, i) => (i === index ? !flip : flip)))
  }

  // saving flashcards to firebase
  const saveFlashcards = async () => {
    if (!setName.trim()) {
      alert('Please enter a name for your flashcard set.')
      return
    }
  
    try {
      const userDocRef = doc(collection(db, 'users'), user.id)
      const userDocSnap = await getDoc(userDocRef)
  
      const batch = writeBatch(db)
  
      if (userDocSnap.exists()) {
        const userData = userDocSnap.data()
        const updatedSets = [...(userData.flashcardSets || []), { name: setName }]
        batch.update(userDocRef, { flashcardSets: updatedSets })
      } else {
        batch.set(userDocRef, { flashcardSets: [{ name: setName }] })
      }
  
      const setDocRef = doc(collection(userDocRef, 'flashcardSets'), setName)
      batch.set(setDocRef, { flashcards })
  
      await batch.commit()
  
      alert('Flashcards saved successfully!')
      handleCloseDialog()
      setSetName('')
    } catch (error) {
      console.error('Error saving flashcards:', error)
      alert('An error occurred while saving flashcards. Please try again.')
    }
  }

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
          sx={{bgcolor: 'black', color: 'white'}}
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
          <Button variant="contained" color="primary" onClick={handleOpenDialog}>
            Save Flashcards
          </Button>
        </Box>
      )}

      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
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
            value={setName}
            onChange={(e) => setSetName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={saveFlashcards} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

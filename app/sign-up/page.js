"use client"
import { useState } from 'react';
import { useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { auth } from "@/firebase";
import { TextField, Button, Typography, Box } from '@mui/material';
import { useRouter } from 'next/navigation';
import Header from '../components/header';
import { Login } from '@mui/icons-material';

export default function Signup() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const [createUserWithEmailAndPassword] = useCreateUserWithEmailAndPassword(auth)
  const router = useRouter()

  const handleSubmit = async () => {
    event.preventDefault()
    try {
        const res = await createUserWithEmailAndPassword(email, password)
        if (res?.user) {
          console.log({res})
          sessionStorage.setItem('user', true)
          router.push('/dashboard')
          setEmail('')
          setPassword('')
        } else {
          throw new Error('Authentication failed!');
        }        
    } catch(e) {
        setError("*Something went wrong*")
        setTimeout(() => {
          setError('')
        }, 2000)
    }
  };

  return (
    <>
      <Header Button={<Button variant="contained" onClick={
          () => {
            router.push('/sign-in')
        }} startIcon={<Login />}>Sign in</Button>
      }/>
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        width="100vw"
        minHeight="100vh"
        bgcolor="#e5eaf5"
        gap={1.5}
      >
        <Typography variant="h2" textAlign="center" color="#333" margin={4}>
          Thanks for choosing Pantry Nest!
        </Typography>
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          width="50vw"
          border="1px solid #333"
          padding={2}
        >
          <Typography variant="h4" component="h1" gutterBottom>
            Sign Up
          </Typography>
          <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            <TextField
              label="Email"
              variant="outlined"
              margin="normal"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <TextField
              label="Password"
              variant="outlined"
              margin="normal"
              type="password"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Typography variant="h7" color='red'>
              {error}
            </Typography>
            <Box marginTop={2}>
              <Button type="submit" variant="contained" color="primary" fullWidth>
                Sign Up
              </Button>
            </Box>
          </form>
        </Box>
      </Box>
    </>
  );
}
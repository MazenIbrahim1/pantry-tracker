"use client"
import { useState } from 'react';
import { TextField, Button, Typography, Box } from '@mui/material';
import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { auth } from "@/firebase";
import { useRouter } from 'next/navigation';
import Header from "../components/header";

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [signInWithEmailAndPassword] = useSignInWithEmailAndPassword(auth)

  const router = useRouter()

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
        const res = await signInWithEmailAndPassword(email, password)
        console.log({res})
        sessionStorage.setItem('user', true)
        setEmail('')
        setPassword('')
        router.push('/dashboard')
    } catch(e) {
        console.log(e)
    }
  };

  return (
    <>
      <Header />
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
            Sign In
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
            <Box marginTop={2}>
              <Button type="submit" variant="contained" color="primary" fullWidth>
                Sign In
              </Button>
            </Box>
          </form>
            <Box marginTop={2} width='100%' display='flex' flexDirection='row' alignItems='center' justifyContent='center' gap={3}>
              <Typography variant='h5'>
                Don't have an account?
              </Typography>
              <Button variant="contained" color="primary" onClick={() => router.push('/sign-up')}>
                Sign Up
              </Button>
            </Box>
        </Box>
      </Box>
    </>
  );
}
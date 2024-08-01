"use client"
import { Box, Button, Typography } from "@mui/material";
import { useRouter } from 'next/navigation';
import LoginIcon from '@mui/icons-material/Login';
import StraightIcon from '@mui/icons-material/Straight';
import Header from "./components/header";

export default function Home() {
  const router = useRouter()

  return (
    <>
      <Header />
      <Box
        width="100vw"
        height="100vh"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        bgcolor="#e5eaf5"
        gap={3}
        overflow='hidden'
      >
        <Typography variant="h2" textAlign="center" color="#333">
          Welcome to Pantry Nest!
        </Typography>
        <Typography variant="h6" textAlign="center" color="#666" maxWidth="600px">
          Pantry Nest helps you keep track of the items in your pantry. 
          Easily add, remove, and manage your pantry items, and never run out of your essentials again!
        </Typography>
        <Box display="flex" flexDirection="row" gap={2}>
        <Button
          variant="contained" 
          color="primary" 
          onClick={() => router.push('/sign-in')}
          startIcon={<LoginIcon />}
        >
          Sign In
        </Button>
        <Button
          variant="contained" 
          color="primary" 
          onClick={() => router.push('/sign-up')}
          startIcon={<StraightIcon />}
        >
          Sign Up
        </Button>
        </Box>
      </Box>
    </>
  );
}

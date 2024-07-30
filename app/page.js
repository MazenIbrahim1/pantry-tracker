"use client"
import { Box, Stack, Typography } from "@mui/material";
import { firestore } from "@/firebase";
import { collection, getDocs, query } from "firebase/firestore";
import { useEffect, useState } from "react";

export default function Home() {
  const [pantry, setPantry] = useState([])

  useEffect(() => {
    console.log('updating pantry')
    const updatePantry = async () => {
      const snapshot = query(collection(firestore, 'pantry')) 
      const docs = await getDocs(snapshot)
      const pantryList = []
      docs.forEach(doc => {
        pantryList.push(doc.id)
      })
      console.log(pantryList)
      setPantry(pantryList)
    }
    updatePantry()
  }, []);

  return (
    <Box 
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
      <Box border={'1px solid #333'}>
        <Box sx={{
          width: '800px',
          height: '100px',
          bgcolor: '#add8e6',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <Typography 
            variant="h2"
            textAlign={'center'}
            color={'#333'}
          >
            Pantry Items
          </Typography>
        </Box>
        <Stack width="800px" height="300px" spacing={2} overflow={'auto'}> 
          {pantry.map((i) => (
            <Box 
            key={i}
              sx={{
                width: "100%",
                minHeight: "150px",
                display: 'flex',
                flexDirection: { xs: "column", md: "row"},
                justifyContent: "center",
                alignItems: "center",
                bgcolor: '#f0f0f0'
              }}
            >
              <Typography variant={"h3"} color={'#333'} textAlign={'center'}>
                {
                  // Capitalize the first letter
                  i.charAt(0).toUpperCase() + i.slice(1)
                }
              </Typography>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}

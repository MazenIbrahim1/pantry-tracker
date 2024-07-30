"use client"
import { Box, Button, Modal, Stack, TextField, Typography } from "@mui/material";
import { firestore } from "@/firebase";
import { collection, getDocs, query } from "firebase/firestore";
import { useEffect, useState } from "react";

export default function Home() {
  // Pantry list
  const [pantry, setPantry] = useState([])

  // Modal
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // Adding an item
  const [itemName, setItemName] = useState('')

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    display: 'flex',
    flexDirection: 'column',
    gap: 1.5
  };

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

  // Adding an item to the pantry
  const addItem = async (item) => {
    console.log(item)
  }

  return (
    <Box 
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      gap={1.5}
    >
      <Modal 
        open={open}
        onClose={handleClose}
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Add Item
          </Typography>
          <Stack width='100%' direction={'row'} spacing={2} justifyContent='center'>
            <TextField 
              id="outlined-basic" 
              label="Item" 
              variant="outlined" 
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
            <Button 
              variant="contained" 
              onClick={ () => {
                addItem(itemName)
                setItemName('')
                handleClose()
              }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>
      <Button variant="contained" onClick={handleOpen}>
        Add Item
      </Button>
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

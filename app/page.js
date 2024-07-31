"use client"
import { Box, Button, Modal, Stack, TextField, Typography } from "@mui/material";
import { firestore } from "@/firebase";
import { collection, getDocs, getDoc, query, doc, setDoc, deleteDoc } from "firebase/firestore";
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

  // Style for modal
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

  // Get the pantry data
  const updatePantry = async () => {
    const snapshot = query(collection(firestore, 'pantry')) 
    const docs = await getDocs(snapshot)
    const pantryList = []
    docs.forEach(doc => {
      pantryList.push({
        name: doc.id,
        ...doc.data()
      })
    })
    console.log(pantryList)
    setPantry(pantryList)
  }

  useEffect(() => {
    console.log('updating pantry')
    updatePantry()
  }, []);

  // Adding an item to the pantry database
  const addItem = async (item) => {
    console.log('Adding item: ', item)
    const docRef = doc(collection(firestore, 'pantry'), item)
    // Check if it exists
    const docSnap = await getDoc(docRef)
    if(docSnap.exists()) {
      const {count} = docSnap.data()
      await setDoc(docRef, {count: count + 1})
    } else {
      await setDoc(docRef, {count: 1})
    }
    await updatePantry()
  }
  
  // Removing an item from the database
  const removeItem = async (item) => {
    console.log('Removing: ', item)
    const docRef = doc(collection(firestore, 'pantry'), item)
    // Check if it exists
    const docSnap = await getDoc(docRef)
    if(docSnap.exists()) {
      const {count} = docSnap.data()
      if(count === 1) {
        await deleteDoc(docRef)
      } else {
        await setDoc(docRef, {count: count - 1})
      }
    }
    await updatePantry()
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
          {pantry.map(({name, count}) => (
            <Box
              key={name}
                sx={{
                  width: "100%",
                  minHeight: "150px",
                  display: 'flex',
                  flexDirection: { xs: "column", md: "row"},
                  justifyContent: "space-between",
                  alignItems: "center",
                  bgcolor: '#f0f0f0',
                  paddingX: 4
                }}
              >
                <Typography variant={"h3"} color={'#333'} textAlign={'center'}>
                  {
                    // Capitalize the first letter
                    name.charAt(0).toUpperCase() + name.slice(1)
                  }
                </Typography>
                <Typography variant={"h3"} color={'#333'} textAlign={'center'}>
                  Quantity: {count}
                </Typography>
              <Button variant="contained" onClick={() => removeItem(name)}>Remove</Button>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}

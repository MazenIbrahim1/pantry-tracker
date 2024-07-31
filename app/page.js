"use client"
import { Box, Button, Modal, Stack, TextField, Typography, ToggleButtonGroup, ToggleButton, InputAdornment } from "@mui/material";
import { firestore } from "@/firebase";
import { collection, getDocs, getDoc, query, doc, setDoc, deleteDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';

export default function Home() {
  // Pantry list
  const [pantry, setPantry] = useState([])

  // Modal
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // Loading state
  const [loading, setLoading] = useState(true)

  // Adding an item
  const [itemName, setItemName] = useState('')
  const [itemCount, setItemCount] = useState(1)

  // Search 
  const [search, setSearch] = useState('')
  const filteredPantry = pantry.filter(p => p.name.toLowerCase().startsWith(search.toLowerCase()))

  // Filter
  const [toggle, setToggle] = useState('name')

  const filteringToggles = [
    <ToggleButton value="name" key="name">
      name
    </ToggleButton>,
    <ToggleButton value="count" key="count">
      Quantity
    </ToggleButton>,
  ]

  const handleToggleChange = (event, toggle) => {
    setToggle(toggle);
  }

  const control = {
    value: toggle,
    onChange: handleToggleChange,
    exclusive: true,
  }
  
  // Style for modal
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #333',
    borderRadius: '8px',
    boxShadow: 24,
    p: 4,
    display: 'flex',
    flexDirection: 'column',
    gap: 2
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

    if (toggle === 'name') {
      pantryList.sort((a, b) => a.name.localeCompare(b.name));
    } else if (toggle === 'count') {
      pantryList.sort((a, b) => b.count - a.count);
    }
    
    console.log(pantryList)
    setPantry(pantryList)
    setLoading(false)
  }
  
  useEffect(() => {
    setLoading(true)
    console.log('updating pantry')
    updatePantry()
  }, [toggle]);

  // Adding an item to the pantry database
  const addItem = async (item, count) => {
    console.log('Adding item: ', item)
    const docRef = doc(collection(firestore, 'pantry'), item)
    // Check if it exists
    const docSnap = await getDoc(docRef)
    if(docSnap.exists()) {
      const quantity = docSnap.data().count || 0
      await setDoc(docRef, {count: Number(quantity) + Number(count)})
    } else {
      await setDoc(docRef, {count: count})
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
      bgcolor="#e5eaf5"
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
              autoComplete="off"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
            <TextField 
              id="outlined-basic-count" 
              label="Quantity" 
              variant="outlined" 
              autoComplete="off"
              type="number"
              value={itemCount}
              onChange={(e) => setItemCount(e.target.value)}
            />
            <Button 
              variant="contained" 
              onClick={ () => {
                addItem(itemName, itemCount)
                setItemName('')
                setItemCount(1)
                handleClose()
              }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>
      <Box sx={{
        width: '800px',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'left',
        alignItems: 'center',
        gap: 2
      }}>
        <Button variant="contained" onClick={handleOpen}>
          Add Item
        </Button>
        <TextField 
          id="outlined-basic"
          label="Search"
          variant="outlined"
          fullWidth
          autoComplete="off"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
          <Typography 
            variant="h10"
            textAlign={'center'}
            color={'#333'}
          >
            Filter by: 
          </Typography>
        <Stack alignItems="center">
        <ToggleButtonGroup size="large" {...control} aria-label="Large sizes">
          {filteringToggles}
        </ToggleButtonGroup>
      </Stack>
      </Box>
      <Box border={'1px solid #333'} borderRadius="50px" height='63vh'>
        <Box sx={{
          borderRadius: "50px",
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
            fontFamily='Audrey'
          >
            Pantry Items
          </Typography>
        </Box>
        <Stack width="800px" height="300px" spacing={2} overflow={'auto'} alignItems='center'> 
          {loading ? (
            <Box sx={{
              width: "100%",
              minHeight: "300px",
              display: 'flex',
              flexDirection: { xs: "column", md: "row"},
              justifyContent: "center",
              alignItems: "center",
          }}
          >
            <Typography variant={"h3"} textAlign={'center'} color={"lightblue"}>
              Loading...
            </Typography>
          </Box>
          ) : 
          filteredPantry.length > 0 ? 
            filteredPantry.map(({name, count}) => (
            <Box
              key={name}
                sx={{
                  width: "95%",
                  minHeight: "130px",
                  display: 'flex',
                  flexDirection: { xs: "column", md: "row"},
                  justifyContent: "space-between",
                  alignItems: "center",
                  bgcolor: '#f0f0f0',
                  borderRadius: "50px",
                  paddingX: 4
                }}
              >
                <Typography variant={"h4"} color={'#333'} textAlign={'center'} fontFamily='Courier New, Courier, monospace' fontWeight='bold'>
                  {
                    // Capitalize the first letter
                    name.charAt(0).toUpperCase() + name.slice(1)
                  }
                </Typography>
                <Typography variant={"h4"} color={'#333'} textAlign={'center'} fontFamily='Courier New, Courier, monospace' fontWeight='bold'>
                  Quantity: {count}
                </Typography>
              <Stack direction="row" spacing={1.5}>
                <Button variant="contained" onClick={() => addItem(name, 1)} startIcon={<AddIcon />} >Add</Button>
                <Button variant="contained" onClick={() => removeItem(name)} startIcon={<DeleteIcon />}>Remove</Button>
              </Stack>
            </Box>
            ))
            : 
            <Box sx={{
                width: "100%",
                minHeight: "300px",
                display: 'flex',
                flexDirection: { xs: "column", md: "row"},
                justifyContent: "center",
                alignItems: "center",
            }}
            >
              <Typography variant={"h3"} textAlign={'center'} color={"#333"}>
                No Results...
              </Typography>
            </Box>
          }
        </Stack>
      </Box>
    </Box>
  );
}

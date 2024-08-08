"use client"
import { Box, Button, Modal, Stack, TextField, Typography, ToggleButtonGroup, ToggleButton, InputAdornment } from "@mui/material";
import { firestore } from "@/firebase";
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/firebase';
import { signOut } from 'firebase/auth';
import { collection, getDocs, getDoc, query, doc, setDoc, deleteDoc } from "firebase/firestore";
import { useEffect, useState, useRef } from "react";
import { useRouter } from 'next/navigation';
import Header from "../components/header";
import Recipe from "../components/recipe";
import { Camera } from "react-camera-pro";
import { Logout, Add, Delete, Search, Image, PhotoCamera, Remove } from "@mui/icons-material";
import Classification from "../components/classification";

export default function Dashboard() {
  // User
  const [user] = useAuthState(auth)
  const router = useRouter()

  if (typeof window !== 'undefined') {
    const userSession = sessionStorage.getItem('user')
    if(!user && !userSession) {
      router.push('/sign-in')
    }
  }

  // User Pantry list
  const [pantry, setPantry] = useState([])

  // Modal
  const [open, setOpen] = useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  // Image
  const camera = useRef(null)
  const [image, setImage] = useState(null)
  const [cameraActive, setCameraActive] = useState(false)
  const [classification, setClassification] = useState([])
  const [showClass, setShowClass] = useState(false)

  const handleImageChange = (e) => {
    const pic = e.target.files[0]
    if (pic) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImage(reader.result)
      }
      reader.readAsDataURL(pic)
    }
  }

  const handleCapture = () => {
    const photo = camera.current.takePhoto()
    setCameraActive(false)
    setImage(photo)
  }

  const handleUploadClick = () => {
    document.getElementById("fileInput").click()
  }

  const handleClassification = async () => {
    try {
      console.log('Starting classification...');
      const response = await fetch(image);
      const blob = await response.blob();
      console.log('Blob received, reading...');

      const reader = new FileReader();
      reader.readAsDataURL(blob);

      const base64 = await new Promise((resolve, reject) => {
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = error => reject(error);
      });

      console.log('Image converted to Base64, sending to API...');
      const apiResponse = await fetch('/api/classifyImage', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({ image: base64.split(',')[1] })
      });

      if (!apiResponse.ok) {
          console.log('File too large')
          throw new Error('API response was not ok.');
      }

      const data = await apiResponse.json();
      console.log('Classification result:', data);
      const classList = []
      data.forEach(d => {
        classList.push({
          description: d.description,
          confidence: d.score * 100
        })
      })
      setClassification(classList)

    } catch (error) {
        console.error('Error during classification:', error);
    } finally {
        setShowClass(true)
        console.log("Done classifying");
    }
  }

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
    setToggle(toggle)
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
    width: '40vw',
    bgcolor: 'background.paper',
    border: '2px solid #333',
    borderRadius: '8px',
    boxShadow: 24,
    p: 4,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'auto',
    maxHeight: '80vh',
    gap: 2
  }

  // Get the pantry data
  const updatePantry = async () => {
    if(!user) {
      return
    }
    const userId = user.uid;
    const snapshot = query(collection(firestore, 'users', userId, 'pantry'))
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
    if(!user) {
      router.push('/sign-in')
    }
    setLoading(true)
    console.log('updating pantry')
    updatePantry()
  }, [toggle, user]);

  // Adding an item to the pantry database
  const addItem = async (item, count) => {
    console.log('Adding item: ', item)
    const userId = user.uid;
    const docRef = doc(collection(firestore, 'users', userId, 'pantry'), item)
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
    const userId = user.uid;
    const docRef = doc(collection(firestore, 'users', userId, 'pantry'), item)
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

  const deleteItem = async (item) => {
    console.log('Deleting: ', item)
    const userId = user.uid;
    const docRef = doc(collection(firestore, 'users', userId, 'pantry'), item)
    // Check if it exists
    const docSnap = await getDoc(docRef)
    await deleteDoc(docRef)
    await updatePantry()
  }

  return (
    <>
      <Header Button={
        <Button variant="contained" onClick={
          () => {
            signOut(auth)
            sessionStorage.removeItem('user')
        }} startIcon={<Logout />}>Logout</Button>
      }/>
      <Box
        width="100vw"
        height="100vh"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        bgcolor="#e5eaf5"
        overflow='hidden'
        gap={1.5}
      >
        <Modal 
          open={open}
          onClose={handleClose}
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Add Item Manually
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
              <Typography variant="h6" justifyContent='center'>
                OR Use AI Classification
              </Typography>
              <Box display="flex" flexDirection="row" justifyContent='center' gap={2}>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<Image />}
                  onClick={handleUploadClick}
                >
                  Upload Image
                </Button>
                <input
                  id="fileInput"
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handleImageChange}
                />
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<PhotoCamera />}
                  onClick={() => setCameraActive(true)}
                >
                  Take Photo
                </Button>
              </Box>
                { cameraActive ? 
                    <Box width="100%" maxWidth="500px">
                      <Camera ref={camera} aspectRatio={14 / 9} />
                      <Box
                        display='flex' 
                        justifyContent='center' 
                        alignItems='center' 
                        mt={2} 
                        gap={4}
                      >
                        <Button 
                          variant="contained" 
                          onClick={handleCapture}
                        >
                          Snap Picture
                        </Button>
                        <Button 
                          variant="contained" 
                          onClick={ () => setCameraActive(false)}
                        >
                          Cancel
                        </Button>
                      </Box>
                    </Box>
                  :
                  console.log("no camera")
                }
                  {image && (
                  <Box textAlign="center">
                    <Typography variant="h6" color="#333">
                      Image Preview:
                    </Typography>
                    <img src={image} alt="Captured" style={{ height: "auto", maxWidth: "100%"}} />
                    <Box display='flex' alignItems='center' justifyContent='center' gap={2} margin={2}>
                      <Button 
                        variant="contained" 
                        onClick={handleClassification}
                      >
                        Classify using AI
                      </Button>
                      <Button 
                        variant="contained" 
                        onClick={ () => {
                          setImage(null)
                          setShowClass(false)
                        }}
                      >
                        Remove
                      </Button>
                    </Box>
                    {showClass ? 
                      <Classification Classification={classification} user={user}/>
                      :
                      <Typography variant="h6">
                        Try Classifying!
                      </Typography>
                    }
                  </Box>
                )}
          </Box>
        </Modal>
        <Box sx={{
          width: '50vw',
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
                  <Search />
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
        <Box border={'1px solid #333'} borderRadius="50px" height="60vh">
          <Box sx={{
            borderRadius: "50px",
            width: '52vw',
            height: '12vh',
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
          <Stack width="52vw" height="42vh" spacing={2} overflow={'auto'} alignItems='center'> 
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
                    {count}
                  </Typography>
                <Stack display='flex' flexDirection="column" spacing={1}>
                  <Button variant="contained" onClick={() => addItem(name, 1)}> <Add /> </Button>
                  <Button variant="contained" onClick={() => removeItem(name)}> <Remove /> </Button>
                </Stack>
                <Button variant="contained" onClick={() => deleteItem(name)} startIcon={<Delete />}>Delete</Button>
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
        <Typography variant={"h4"} textAlign={'center'} color={"#333"} paddingY={2}>
          Number of items: {filteredPantry.length}
        </Typography>
        <Recipe list={filteredPantry}/>
      </Box>
    </>
  );
}

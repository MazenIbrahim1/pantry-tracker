import { useState } from "react";
import { Box, Button, Typography, Modal, Stack } from "@mui/material";
import generateRecipes from "../dashboard/ai";

const Recipe = (props) => {
    const [recipes, setRecipes] = useState([])
    const list = props.list

    // Loading state
    const [loading, setLoading] = useState(true)

    // Modal
    const [open, setOpen] = useState(false)
    const handleOpen = async () => {
        setOpen(true)
        await handleGenerate()
    }
    const handleClose = () => setOpen(false)

    const handleGenerate = async () => {
        setLoading(true)
        if(list.length > 0) {
            console.log("Generating recipes")
            const result = await generateRecipes(list)
            setRecipes(result)
            setLoading(false)
            console.log("RESULT:: ", result)
        } 
    }

    // Style for modal
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '50vw',
        bgcolor: 'background.paper',
        border: '2px solid #333',
        borderRadius: '8px',
        boxShadow: 24,
        p: 4,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'auto',
        height: '80vh',
        gap: 2
    }

    return (
      <Box
        position='relative'
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
    >
       <Modal 
          open={open}
          onClose={handleClose}
        >
          <Box sx={style}>
            <Box display='flex' flexDirection='row' justifyContent='space-between' alignItems='center'>
                <Typography id="modal-modal-title" variant="h3" component="h2">
                    Recipes:
                </Typography>
                <Button variant="contained" onClick={handleOpen}>
                    Generate again
                </Button>
            </Box>
            <Stack width='100%' direction={'column'} spacing={2} justifyContent='center' alignItems='center'>
                {loading ?
                    (
                        <Box sx={{
                          width: "100%",
                          minHeight: "500px",
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
                      )
                :
                recipes.length > 0 ? 
                    recipes.map(({recipeNum, recipeName, details}) => (
                          <Box
                            key={recipeNum}
                            sx={{
                                width: "95%",
                                minHeight: "140px",
                                display: 'flex',
                                flexDirection: { xs: "column", md: "row"},
                                justifyContent: "space-between",
                                alignItems: "center",
                                bgcolor: '#f0f0f0',
                                borderRadius: "50px",
                                paddingX: 4
                              }}
                          >
                            <Typography variant="h5">
                                {recipeName === "Instructions" ? recipeName + ': ' + details : recipeName}
                            </Typography>
                          </Box>
                        )
                    )
                    :
                    <Typography variant="h4">
                        No recipes can be done with current pantry list.
                    </Typography>
                }
            </Stack>
          </Box>
        </Modal>
        <Button variant="contained" onClick={handleOpen}>
            Generate Recipes
        </Button>
    </Box>
    )
}

export default Recipe
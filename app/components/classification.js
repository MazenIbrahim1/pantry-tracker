import { Stack, Box, Typography, Button } from "@mui/material"
import { firestore } from "@/firebase";
import { collection, getDoc, doc, setDoc } from "firebase/firestore";

const Classification = (props) => {
    const classList = props.Classification

    // Adding an item to the pantry database
    const addItem = async (item, count, user) => {
        console.log('Adding item: ', item)
        console.log('Count: ', count)
        const userId = user.uid;
        const docRef = doc(collection(firestore, 'users', userId, 'pantry'), item)
        // Check if it exists
        const docSnap = await getDoc(docRef)
        console.log('Doc snap', docSnap)
        if(docSnap.exists()) {
            const quantity = docSnap.data().count || 0
            await setDoc(docRef, {count: Number(quantity) + Number(count)})
        } else {
            await setDoc(docRef, {count: count})
        }
    }

    return (
        <>
            <Stack width='100%' direction={'column'} spacing={2} justifyContent='center' alignItems='center' overflow='auto'>
                {classList.length > 0 ? 
                    classList.map(({description, confidence}) => (
                          <Box
                            key={description}
                            sx={{
                                width: "65%",
                                minHeight: "100px",
                                display: 'flex',
                                flexDirection: { xs: "column", md: "row"},
                                justifyContent: "space-between",
                                alignItems: "center",
                                bgcolor: '#f0f0f0',
                                borderRadius: "50px",
                                gap: 2,
                                paddingX: 4
                              }}
                          >
                            <Typography variant="h6" padding={2}>
                               Description: {description} <br /> Confidence: {Math.round(confidence*100) / 100}%
                            </Typography>
                            <Button 
                                variant="contained"
                                onClick={() => addItem(description, 1, props.user)}
                            >
                                Add
                            </Button>
                          </Box>
                        )
                    )
                    :
                    <Typography variant="h4">
                        AI couldn't classify this image.
                    </Typography>
                }
            </Stack>
        </>
    )
}

export default Classification
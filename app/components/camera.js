"use client";
import React, { useRef, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import { Camera } from "react-camera-pro";
import { Image, PhotoCamera} from "@mui/icons-material";

export default function CameraView() {
  const camera = useRef(null)
  const [image, setImage] = useState(null)

  const handleCapture = () => {
    const photo = camera.current.takePhoto()
    setImage(photo);
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
      gap={3}
      overflow="hidden"
    >
      <Box
        width="100%"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        gap={3}
      >
        <Box width="100%" maxWidth="500px">
          <Camera ref={camera} aspectRatio={16 / 9} />
        </Box>
        {image && (
          <Box textAlign="center">
            <Typography variant="h6" color="#333">
              Image Preview:
            </Typography>
            <img src={image} alt="Captured" style={{ maxHeight: "300px" }} />
          </Box>
        )}
      </Box>
    </Box>
  );
}

import { useState, useEffect } from "react";

import { styled } from "@mui/material/styles";
import { Typography, Container, Button, Box } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import * as tf from "@tensorflow/tfjs";

function App() {
  const [model, setModel] = useState(null);
  const [image, setImage] = useState(null);
  const [predictions, setPredictions] = useState(null);

  useEffect(() => {
    try {
      async function loadModel() {
        const loadedModel = await tf.loadGraphModel("/models/model.json");
        setModel(loadedModel);
      }

      loadModel();
    } catch (error) {
      console.log(`Error while loading model: ${error}`);
    }
  }, []);

  useEffect(() => {
    const makePrediction = async () => {
      if (model && image) {
        // Cargar la imagen como un elemento HTMLImageElement
        const imgElement = document.createElement("img");
        const imgUrl = URL.createObjectURL(image);
        imgElement.src = imgUrl;

        // Esperar a que la imagen se cargue completamente
        await imgElement.decode();

        // Redimensionar la imagen a las dimensiones esperadas por el modelo
        const resizedImage = tf.image.resizeBilinear(
          tf.browser.fromPixels(imgElement),
          [150, 150]
        );
        const expandedImage = resizedImage.expandDims(0);

        // Realizar inferencia en la imagen utilizando el modelo cargado
        const predictions = await model.predict(expandedImage).data();
        console.log(predictions[0]);
        setPredictions(predictions[0]);
      }
    };
    makePrediction();
  }, [model, image]);

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    setImage(file);
  };

  const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1,
  });

  const StyledContent = styled("div")({
    background: "linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab)",
    backgroundSize: "400% 400%",
    minHeight: "100vh",
    animation: "$gradient 15s ease infinite",
    WebkitAnimation: "$gradient 15s ease infinite",
    "&:hover": {
      animationPlayState: "paused",
      WebkitAnimationPlayState: "paused",
    },
    "@keyframes gradient": {
      "0%": {
        backgroundPosition: "0% 50%",
      },
      "50%": {
        backgroundPosition: "100% 50%",
      },
      "100%": {
        backgroundPosition: "0% 50%",
      },
    },
  });

  return (
    <>
      <StyledContent
        maxWidth="md"
        sx={{
          display: "flex",

          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <Typography
          align="center"
          sx={{
            m: 10,
            mb: 2,
            fontFamily: "Pixelify Sans",
            fontWeight: "bold",
            fontSize: 50,
            textShadow: "-3px 3px 4px #ffffff",
          }}
        >
          Is it a dog or a cat?
        </Typography>

        <Typography
          align="center"
          sx={{
            m: 5,
            fontFamily: "Pixelify Sans",
            fontWeight: "bold",
            fontSize: 50,
          }}
        >
          AI Model
        </Typography>
        <Button
          component="label"
          role={undefined}
          variant="contained"
          tabIndex={-1}
          startIcon={<CloudUploadIcon />}
          onChange={handleImageUpload}
        >
          <Typography
            sx={{
              fontFamily: "Pixelify Sans",
              fontWeight: "bold",
              fontSize: 20,
            }}
          >
            Upload file
          </Typography>

          <VisuallyHiddenInput type="file" />
        </Button>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 5,
            mt: 5,
            padding: "0px 20px",
          }}
        >
          {image && (
            <img
              id="uploaded-image"
              src={URL.createObjectURL(image)}
              alt="Uploaded"
              style={{
                width: "100%",
                maxWidth: "600px",
                minWidth: "200px",
                maxHeight: "48vh",
              }}
            />
          )}
          <Typography
            sx={{
              fontFamily: "Pixelify Sans",
              fontWeight: "bold",
              fontSize: 30,
              textShadow: "-3px 3px 7px #ffffff",
            }}
          >
            {predictions === null
              ? "Test the IA model..."
              : predictions === 1
              ? "It's a Dog!"
              : "It's a Cat!"}
          </Typography>
        </Box>
      </StyledContent>
    </>
  );
}

export default App;

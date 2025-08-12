import React, { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import * as faceapi from "face-api.js";
import axios from "axios";

export default function RegisterFace() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [status, setStatus] = useState("Loading face models...");

  // ✅ Load models
  useEffect(() => {
    const loadModels = async () => {
      try {
        console.log("Loading models from /models...");
        await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
        console.log("✅ tinyFaceDetector loaded");
        await faceapi.nets.faceLandmark68Net.loadFromUri("/models");
        console.log("✅ faceLandmark68Net loaded");
        await faceapi.nets.faceRecognitionNet.loadFromUri("/models");
        console.log("✅ faceRecognitionNet loaded");

        setModelsLoaded(true);
        setStatus("Models loaded! Ready to capture.");
      } catch (err) {
        console.error("❌ Error loading models:", err);
        setStatus("Error loading models. Check console.");
      }
    };
    loadModels();
  }, []);

  // ✅ Wait for webcam
  const waitForWebcam = () => {
    return new Promise((resolve) => {
      const interval = setInterval(() => {
        if (webcamRef.current?.video && webcamRef.current.video.readyState === 4) {
          clearInterval(interval);
          console.log("✅ Webcam is ready");
          resolve();
        }
      }, 300);
    });
  };

  // ✅ Detect and capture face
  const captureFace = async () => {
    try {
      setStatus("Detecting face...");
      await waitForWebcam();

      const video = webcamRef.current.video;

      const detection = await faceapi
        .detectSingleFace(
          video,
          new faceapi.TinyFaceDetectorOptions({ inputSize: 608, scoreThreshold: 0.4 })
        )
        .withFaceLandmarks()
        .withFaceDescriptor();

      // Clear canvas before drawing
      const displaySize = { width: video.width, height: video.height };
      faceapi.matchDimensions(canvasRef.current, displaySize);
      const context = canvasRef.current.getContext("2d");
      context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

      if (!detection) {
        console.warn("⚠ No face detected");
        setStatus("No face detected. Make sure you are in good light & centered.");
        return;
      }

      // Draw box around face
      const resizedDetection = faceapi.resizeResults(detection, displaySize);
      faceapi.draw.drawDetections(canvasRef.current, resizedDetection);
      faceapi.draw.drawFaceLandmarks(canvasRef.current, resizedDetection);

      console.log("✅ Face detected:", detection);
      console.log("Descriptor length:", detection.descriptor.length);

      // Send descriptor to backend
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "https://liefcare.onrender.com/api/face/register-face",
        { descriptor: Array.from(detection.descriptor) },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("✅ Face registered:", response.data);
      setStatus("✅ Face registered successfully!");
    } catch (err) {
      console.error("❌ Error in captureFace:", err);
      setStatus(err.response?.data?.message || "Error registering face");
    }
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h2>Face Registration</h2>
      <p>{status}</p>

      {modelsLoaded ? (
        <div style={{ position: "relative", display: "inline-block" }}>
          <Webcam
            ref={webcamRef}
            audio={false}
            width={640}
            height={480}
            videoConstraints={{ width: 640, height: 480, facingMode: "user" }}
          />
          <canvas
            ref={canvasRef}
            style={{ position: "absolute", top: 0, left: 0 }}
          />
          <br />
          <button onClick={captureFace} style={{ marginTop: "10px" }}>
            Register Face
          </button>
        </div>
      ) : (
        <p>Loading models, please wait...</p>
      )}
    </div>
  );
}

import React, { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import * as faceapi from "face-api.js";
import axios from "axios";

export default function FaceClock() {
  const webcamRef = useRef(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState(null); 

  useEffect(() => {
    const loadModels = async () => {
      await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
      await faceapi.nets.faceLandmark68Net.loadFromUri("/models");
      await faceapi.nets.faceRecognitionNet.loadFromUri("/models");
    };
    loadModels();
  }, []);

  const captureAndSend = async () => {
    if (!webcamRef.current || !type) return;

    setLoading(true);
    const video = webcamRef.current.video;

    try {
      const detection = await faceapi
        .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (!detection) {
        alert("No face detected, please try again.");
        setLoading(false);
        return;
      }

      const position = await new Promise((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(resolve, reject)
      );

      await axios.post(
        `/api/${type === "in" ? "face-clock-in" : "face-clock-out"}`,
        {
          descriptor: Array.from(detection.descriptor),
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        },
        { withCredentials: true }
      );

      alert(`${type === "in" ? "Clocked in" : "Clocked out"} successfully!`);
      setCameraActive(false);
      setType(null);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || err.message || "Error during clock-in/out");
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const buttonStyle = {
    padding: "12px 25px",
    margin: "10px",
    fontSize: "16px",
    fontWeight: "600",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
    color: "white",
  };

  const clockInStyle = {
    ...buttonStyle,
    backgroundColor: "#28a745",
  };

  const clockOutStyle = {
    ...buttonStyle,
    backgroundColor: "#dc3545",
  };

  const cancelStyle = {
    ...buttonStyle,
    backgroundColor: "#6c757d",
    marginLeft: "10px",
  };

  return (
    <div style={{ textAlign: "center" }}>
      {!cameraActive ? (
        <>
          <button
            style={clockInStyle}
            onClick={() => {
              setType("in");
              setCameraActive(true);
            }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#218838")}
            onMouseLeave={(e) => (e.target.style.backgroundColor = "#28a745")}
          >
            Clock In
          </button>
          <button
            style={clockOutStyle}
            onClick={() => {
              setType("out");
              setCameraActive(true);
            }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#c82333")}
            onMouseLeave={(e) => (e.target.style.backgroundColor = "#dc3545")}
          >
            Clock Out
          </button>
        </>
      ) : (
        <div>
          <Webcam
            ref={webcamRef}
            audio={false}
            width={320}
            height={240}
            screenshotFormat="image/jpeg"
          />
          <div style={{ marginTop: "10px" }}>
            <button
              onClick={captureAndSend}
              disabled={loading}
              style={{ ...buttonStyle, backgroundColor: "#007bff" }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = "#0056b3")}
              onMouseLeave={(e) => (e.target.style.backgroundColor = "#007bff")}
            >
              {loading ? "Processing..." : "Capture & Verify"}
            </button>
            <button
              style={cancelStyle}
              onClick={() => {
                setCameraActive(false);
                setType(null);
              }}
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

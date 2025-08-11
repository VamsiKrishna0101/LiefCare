import React, { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import * as faceapi from "face-api.js";
import axios from "axios";

export default function FaceClockInOut({ type }) {
  const webcamRef = useRef(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [loading, setLoading] = useState(false);

  // Load models only once
  useEffect(() => {
    const loadModels = async () => {
      await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
      await faceapi.nets.faceLandmark68Net.loadFromUri("/models");
      await faceapi.nets.faceRecognitionNet.loadFromUri("/models");
    };
    loadModels();
  }, []);

  const captureAndSend = async () => {
    if (!webcamRef.current) return;

    setLoading(true);
    const video = webcamRef.current.video;

    const detection = await faceapi
      .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (!detection) {
      alert("No face detected, please try again.");
      setLoading(false);
      return;
    }

    // Get location
    navigator.geolocation.getCurrentPosition(async (pos) => {
      try {
        await axios.post(
          `/api/${type === "in" ? "face-clock-in" : "face-clock-out"}`,
          {
            descriptor: Array.from(detection.descriptor),
            lat: pos.coords.latitude,
            lng: pos.coords.longitude
          },
          { withCredentials: true }
        );
        alert(`${type === "in" ? "Clocked in" : "Clocked out"} successfully!`);
      } catch (err) {
        alert(err.response?.data?.message || "Error during clock-in/out");
      } finally {
        setLoading(false);
        setCameraActive(false); // Close camera after processing
      }
    });
  };

  return (
    <div style={{ textAlign: "center" }}>
      {!cameraActive ? (
        <button onClick={() => setCameraActive(true)}>
          {type === "in" ? "Start Face Clock In" : "Start Face Clock Out"}
        </button>
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
            <button onClick={captureAndSend} disabled={loading}>
              {loading ? "Processing..." : "Capture & Verify"}
            </button>
            <button
              style={{ marginLeft: "10px" }}
              onClick={() => setCameraActive(false)}
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

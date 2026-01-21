import React, { useState, useRef, useEffect } from "react";
import "../style/_qrcodescanner.scss";
import { BsQrCodeScan } from "react-icons/bs";
import { MdOutlineImageSearch } from "react-icons/md";
import axios from "axios";
import jsQR from "jsqr";
import { Link } from "react-router";
import QrScanner from "../components/QrScanner";

export default function QRCodeScanner() {
  const [selectedParty, setSelectedParty] = useState("0");
  const [showImageScan, setShowImageScan] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [scanSuccess, setScanSuccess] = useState(false);
  const [scanData, setScanData] = useState(null);
  const [error, setError] = useState("");
  const [cameraActive, setCameraActive] = useState(false);
  const [devices, setDevices] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState("");

  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    navigator.mediaDevices?.enumerateDevices?.().then((list) => {
      setDevices(list.filter((d) => d.kind === "videoinput"));
    });
  }, []);

  const callScanApi = async (code) => {
    try {
      const res = await axios.get(
        `https://www.izemak.com/azimak/public/api/scan/${code}`
      );

      setScanData(res.data.data);
      setScanSuccess(true);
    } catch {
      setError("Scan failed");
    }
  };

  return (
    <main className="mainOfQRCodeScanner">
      <div className="logo">
        <Link to="/mainpartydata">
          <img src="/اعزمك-01.png" alt="logo" />
        </Link>
      </div>

<div className="selecte_party">
        <select
        value={selectedParty}
        onChange={(e) => setSelectedParty(e.target.value)}
        style={{ marginBottom: 20 }}
      >
        <option value="0">Choose party</option>
        <option value="1">party1</option>
        <option value="2">party2</option>
        <option value="3">party3</option>
        <option value="4">party4</option>
        <option value="5">party5</option>
        <option value="6">party6</option>
        <option value="7">party7</option>
        <option value="8">party8</option>
        <option value="9">party9</option>
        <option value="10">party10</option>
      </select>
</div>

      {selectedParty !== "0" && (
        <>
          {!scanSuccess && (
            <div className="scannerContainer">
              <QrScanner
                selectedParty={selectedParty}
                onSubmit={callScanApi}
              />

              {!showImageScan && (
                <div className="scanCard">
                  <BsQrCodeScan />

                  <button onClick={() => setCameraActive(true)}>
                    Start Camera
                  </button>

                  <button onClick={() => setShowImageScan(true)}>
                    Scan Image
                  </button>
                </div>
              )}

              {showImageScan && (
                <div className="scanCard">
                  <MdOutlineImageSearch />
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={() => {}}
                  />
                  <button onClick={() => setShowImageScan(false)}>
                    Back
                  </button>
                </div>
              )}
            </div>
          )}

          {scanSuccess && (
            <div className="successfully">
              <h2>Scan Success</h2>
              <p>Name: {scanData?.name}</p>
              <p>Phone: {scanData?.phone}</p>
              <button onClick={() => setScanSuccess(false)}>
                Scan Again
              </button>
            </div>
          )}
        </>
      )}
    </main>
  );
}

import React, { useState } from "react";
import axios from "axios";
import "../style/components/_qrScanner.scss";

export default function QrScanner({ onSubmit, disabled }) {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  async function callScanApi(scanned) {
    setError("");

    if (scannedSetRef.current.has(scanned)) {
      setError("This barcode has already been scanned");
      return false;
    }

    try {
      const res = await axios.get(
        `https://www.izemak.com/azimak/public/api/scan/${encodeURIComponent(
          scanned
        )}`
      );

      if (res.status === 200 && res.data) {
        const apiData = res.data.data || {};
        const scanCount = Number(apiData.scan ?? 0);
        const maxScan = Number(apiData.maxScan ?? apiData.max_scan ?? 0);

        if (scanCount >= maxScan) {
          setError("You reached max scan limit");
          return false;
        }

        scannedSetRef.current.add(scanned);

        setScanData({
          name: apiData.name,
          phone: apiData.phoneNumber ?? apiData.phone,
          scan: scanCount,
          maxScan,
        });

        setScanSuccess(true);
        return true;
      }

      setError("Invalid scan");
      return false;
    } catch (err) {
      setError("Scan failed");
      return false;
    }
  }

  const handleKeyDown = async (e) => {
    if (e.key === "Enter" && value.trim() !== "") {
      const success = await onSubmit(value.trim());

      if (success) {
        setValue("");
      }
    }
  };

  return (
    <main className="inputs">
      <select>
        <option value=""></option>
      </select>
      <input
        type="text"
        inputMode="text"
        autoFocus
        disabled={disabled}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
      />
    </main>
  );
}
"use client";
import { useEffect, useState } from "react";

export default function TenKDigitsBg() {
  const [colors, setColors] = useState<string[]>([]);

  useEffect(() => {
    // Fetch the file containing the hex digits of Pi
    fetch("/pi_hex_10k.txt")
      .then((response) => response.text())
      .then((data) => {
        // Process the file content
        // console.log(data.split('\n').map((line) => line.split(":")[0]).join("").replace(/[^0-9a-fA-F]/g, ""));
        const hexValues =
          data
            .split("\n") // Split into lines
            .map((line) => line.split(":")[0]) // Remove everything after ':'
            .join("") // Combine all lines
            .replace(/[^0-9a-fA-F]/g, "") // Remove non-hex characters
            .match(/.{1,6}/g) || []; // Group into 6-character chunks
        console.log(hexValues);
        setColors(hexValues.map((hex) => `#${hex.padEnd(6, "0")}`)); // Ensure valid hex colors
      });
  }, []);

  return (
    <div className="p-4 bg-primary h-screen w-screen">
      <h1 className="text-3xl text-primary-foreground w-full font-bold mb-4">Your looking at 10,000 digits of pi</h1>
      <div className="grid grid-cols-50 gap-1">
        {colors.map((color, index) => (
          <div
            key={index}
            style={{
              backgroundColor: color,
              width: "20px",
              height: "20px",
            }}
            title={color}
          ></div>
        ))}
      </div>
    </div>
  );
}

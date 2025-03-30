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

        const valueArray = (hexValues || []).slice(0, 1600);
        console.log(valueArray.length);
        setColors(valueArray.map((hex) => `#${hex.padEnd(6, "0")}`)); // Ensure valid hex colors
      });
  }, []);

  return (
      <div className="grid grid-cols-40 z-0 h-full w-full opacity-100 ">
        {colors.map((color, index) => (
          <div
            key={index}
            style={{
              backgroundColor: color,
              borderRadius: "0%",
              width: "calc(100% / 10 )",
              height: "calc(100% / 10)",
              border: "1px solid #fff4"
            }}
            title={color}
          ></div>
        ))}
      </div>
  );
}

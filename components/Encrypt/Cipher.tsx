"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
// import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  // DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

export default function Cipher() {
  const [isEncrypt, setIsEncrypt] = useState(true);
  const [message, setMessage] = useState("No operation has been conducted");
  const [input_string, setInput_string] = useState("");
  
  function handleCopy() {
    navigator.clipboard.writeText(message);
    alert("Copied to clipboard");
  }

  async function handleOperation() {
    const drawerTrigger = document.querySelector("[data-state='closed']") as HTMLElement;
    if (drawerTrigger) {
      drawerTrigger.click();
    }
    console.log(isEncrypt ? "Encrypting..." : "Decrypting...");
    try {
      if (isEncrypt) {
        // Use search endpoint for encryption
        const response = await fetch("/api?endpoint=search", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ 'input_string': input_string }),
        });

        const data = await response.json();
        setMessage(data.encrypted_string || "No encrypted string found");
        console.log("encrypting... :", input_string);

      } else {
        // Use decipher endpoint for decryption
        const response = await fetch("/api", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ input_string }),
        });

        const data = await response.json();
        setMessage(data.deciphered_string || "No deciphered string found");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage(
        "Error: " + (error instanceof Error ? error.message : String(error))
      );
    }
  }

  function toggleMode() {
    setIsEncrypt(!isEncrypt);
  }

  return (
    <div className="absolute bottom-0 left-0 mb-16 w-full flex justify-center items-center z-10">
      <div className="w-5 h-full"></div>
      <Drawer>
        <DrawerTrigger className="bg-purple-50 p-3 py-2 rounded-lg">
          Result
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Result:</DrawerTitle>
          </DrawerHeader>
          <div className="flex flex-row gap-4 justify-center p-2 ">
          <div className="font-bold "> 
            {message}
          </div>
          </div>
          <DrawerFooter className="flex flex-row justify-center">
            <Button onClick={handleCopy}>Copy</Button>
            <DrawerClose className="bg-red-600 text-white px-4 rounded-lg">
              Close
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      <div className="w-5 h-full"></div>
      <div className="bg-secondary/5 border-1 border-secondary/10 w-md flex flex-row p-4 gap-4 rounded-lg">
        <div className="flex w-full items-center justify-end ">
          <Input
            id="message"
            className="border-none h-full  focus:bg-primary/70 bg-primary/50 text-white"
            onChange={(e) => setInput_string(e.target.value)}
            placeholder={
              isEncrypt ? "Text to encrypt..." : "Text to decrypt..."
            }
          />
        </div>

        <div className="flex flex-row gap-1 w-fit items-center">
          <Button
            variant="secondary"
            type="submit"
            onClick={handleOperation}
            className="active:bg-primary active:text-primary-foreground"
          >
            {isEncrypt ? "Encrypt" : "Decrypt"}
          </Button>
          <div className="flex flex-row justify-center">
            {/* <span className="text-sm text-primary-foreground mr-2">
              {isEncrypt ? "Encrypt" : "Decrypt"}
            </span> */}
            <Switch
              checked={!isEncrypt}
              onCheckedChange={toggleMode}
              className=""
              aria-label="Toggle encryption mode"
            />
          </div>
        </div>
      </div>
      <div className="w-5 h-full"></div>
    </div>
  );
}

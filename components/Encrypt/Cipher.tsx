"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
// import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

export default function Cipher() {
  const [isEncrypt, setIsEncrypt] = useState(true);

  function handleOperation() {
    console.log(isEncrypt ? "Encrypting..." : "Decrypting...");
  }

  function toggleMode() {
    setIsEncrypt(!isEncrypt);
  }

  return (
    <div className="absolute bottom-0 left-0 mb-16 w-full flex justify-center items-center z-10">
      <div className="bg-secondary/5 border-1 border-secondary/10 w-md flex flex-row p-4 gap-4 rounded-lg">
        <div className="flex w-full items-center justify-end ">
          <Input
            id="message"
            className="border-none h-full outline-0 focus:bg-primary/70 bg-primary/50 text-primary-foreground"
            placeholder={
              isEncrypt ? "Text to encrypt..." : "Text to decrypt..."
            }
          />
        </div>

        <div className="flex flex-row gap-1 w-fit items-center">
        <Button variant="secondary" type="submit" onClick={handleOperation} className="active:bg-primary active:text-primary-foreground">
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
    </div>
  );
}

import Spirograph from "@/components/Spirograph/SpirographBg";
import TenKDigitsBg from "@/components/tenKdigitsBg/tenKDigitsBg";
export default function Home() {
  return (
    <div className="bg-primary w-screen h-screen relative justify-center items-center">
      <div className="w-full h-full">
      <TenKDigitsBg />
      </div>
            
      <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center z-10">
        <div className="text-5xl text-primary-foreground shadow-lg bg-primary/30 p-5">
          PI-cipher
        </div>
      </div>
      <div className="absolute top-0 z-10 justify-between items-center">
        <Spirograph />
      </div>
    </div>
  );
}

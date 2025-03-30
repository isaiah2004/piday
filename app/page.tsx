import Spirograph from "@/components/Spirograph/SpirographBg";
import TenKDigitsBg from "@/components/tenKdigitsBg/tenKDigitsBg";
export default function Home() {
  return (
    <div className="bg-primary w-screen h-screen relative justify-center items-center">
      <div className="w-full h-full overflow-hidden opacity-30">
      <TenKDigitsBg />
      </div>
            
      <div className="absolute top-0 left-0 w-full flex justify-center items-center z-10">
        <div className="text-5xl text-primary-foreground shadow-md shadow-primary-foreground/30 m-3 rounded-md bg-primary/50 border-2 border-primary-foreground p-5">
        Pi(π)-cipher
        </div>
      </div>
      <div className="absolute top-0 z-10 justify-between items-center">
        <Spirograph />
      </div>
    </div>
  );
}

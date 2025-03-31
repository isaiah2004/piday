import Spirograph from "@/components/Spirograph/SpirographBg";
import TenKDigitsBg from "@/components/tenKdigitsBg/tenKDigitsBg";
import Cipher from "@/components/Encrypt/Cipher";
export default function Home() {

  
  return (
    <div className="bg-primary w-screen h-screen relative justify-center items-center overflow-hidden">
      <div className="w-full h-full overflow-hidden opacity-70 bg-primary/70 z-1">
        <TenKDigitsBg />
      </div>

      <div className="absolute top-0 left-0 w-full flex justify-center items-center z-10">
        <div className="text-2xl text-primary-foreground  shadow-primary-foreground/30 m-3 mt-20 rounded-md bg-primary/50 border-2 border-primary-foreground/20 p-5">
          Pi(π)-cipher
        </div>
      </div>
      <div className="absolute top-0 z-0 justify-between items-center">
        <Spirograph />
      </div>
      <Cipher/>
      <div className="hidden  md:flex absolute top-0 right-0 h-screen w-3xs  p-5 py-30 justify-center items-center">
        <div className="w-1/2 h-6/12 flex flex-col justify-center rounded-lg p-2 gap-2">
          <div className="w-full h-full max-h-40 bg-amber-300 rounded-lg flex text-xl justify-center items-center text-center">
            <div className="h-fit font-bold"> Cipher</div>
          </div>
          <div className="w-full h-full max-h-40 bg-blue-400 rounded-lg flex text-xl justify-center items-center text-center">
            <div className="h-fit font-bold"> Viz</div>
          </div>
          <div className="w-full h-full max-h-40 bg-emerald-400 rounded-lg flex text-xl justify-center items-center text-center">
            <div className="h-fit font-bold"> Fact</div>
          </div>
          <div className="w-full h-full max-h-40 bg-red-400 rounded-lg flex text-xl justify-center items-center text-center">
            <div className="h-fit font-bold"> AI</div>
          </div>
        </div>
      </div>
    </div>
  );
}

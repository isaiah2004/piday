import Spirograph from "@/components/Spirograph/SpirographBg";
export default function Home() {
  return (
    <div className="bg-primary w-screen h-screen flex flex-col justify-center items-center">
      <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center">
        <div className="text-3xl text-primary-foreground">PI-cipher</div>
      </div>
      <div className="flex flex-row justify-between items-center">
          <Spirograph />
        
      </div>
    </div>
  );
}

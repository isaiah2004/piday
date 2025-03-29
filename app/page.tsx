import Spirograph from "@/components/Spirograph/SpirographBg";
export default function Home() {
  return (
    <div className="bg-primary w-screen h-screen flex flex-col justify-center items-center">
      <div className="text-3xl text-primary-foreground">Hello world</div>
      <Spirograph/>
    </div>
  );
}

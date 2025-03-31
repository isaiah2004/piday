import Spirograph from "@/components/Spirograph/SpirographBg";
import TenKDigitsBg from "@/components/tenKdigitsBg/tenKDigitsBg";
import Cipher from "@/components/Encrypt/Cipher";
import Link from "next/link";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";

// Navigation configuration
const navItems = [
  { label: "Cipher", href: "/", bgColor: "bg-amber-300", hoverColor: "hover:bg-amber-200" },
  { label: "Viz", href: "/viz", bgColor: "bg-blue-400", hoverColor: "hover:bg-blue-300" },
  { label: "Fact", href: "/fact", bgColor: "bg-emerald-400", hoverColor: "hover:bg-emerald-300" },
  { label: "AI", href: "/ai", bgColor: "bg-red-400", hoverColor: "hover:bg-red-300" },
  { label: "Videos", href: "/vidz", bgColor: "bg-purple-400", hoverColor: "hover:bg-purple-300" },
];

export default function Home() {
  return (
    <div className="bg-primary w-screen h-screen relative justify-center items-center overflow-hidden">
      <div className="hidden md:flex w-full h-full overflow-hidden opacity-70 bg-primary/70 z-1">
        <TenKDigitsBg />
      </div>

      <div className="absolute top-0 left-0 w-full flex justify-center items-center z-10">
        <div className="text-2xl text-primary-foreground shadow-primary-foreground/30 m-3 mt-20 rounded-md bg-primary/50 border-2 border-primary-foreground/20 p-5">
          Pi(π)-cipher
        </div>
      </div>
      <div className="absolute top-0 z-0 justify-between items-center">
        <Spirograph />
      </div>
      <Cipher />
      
      {/* Mobile Navigation Menu */}
      <div className="md:hidden fixed bottom-40 right-6 z-50 text-white">
        <Sheet>
          <SheetTrigger asChild>
            <button className="p-3 rounded-full bg-primary-foreground/20 backdrop-blur-md shadow-lg">
              <Menu className="h-6 w-6 text-primary-foreground" />
            </button>
          </SheetTrigger>
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <SheetContent side="right" className="rounded-t-xl px-4 py-6 bg-white/90">
            <div className="flex flex-col gap-4 mt-10">
              {navItems.map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  className={`w-full p-4 ${item.bgColor} ${item.hoverColor} rounded-lg flex text-xl justify-center items-center text-center`}
                >
                  <div className="h-fit font-bold">{item.label}</div>
                </Link>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </div>
      
      {/* Desktop Navigation */}
      <div className="hidden md:flex absolute top-0 right-0 h-screen w-3xs p-5 py-30 justify-center items-center">
        <div className="w-1/2 h-6/12 flex flex-col justify-center rounded-lg p-2 gap-2">
          {navItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className={`w-full h-full max-h-40 ${item.bgColor} ${item.hoverColor} rounded-lg flex text-xl justify-center items-center text-center`}
            >
              <div className="h-fit font-bold"> {item.label}</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

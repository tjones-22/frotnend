import Image from "next/image";
import Navbar from "./components/Nav";

export default function Home() {
  return (
    <>
      <Navbar />

      <div className="w-full mt-[10vh]">
        <ul className="flex flex-row justify-around m-[20px] items-center w-full text-blue-600 text-[25px] font-bold border-b-2">
          <button>Home</button>
          <button>Add</button>
          
        </ul>
      </div>
    </>
  );
}

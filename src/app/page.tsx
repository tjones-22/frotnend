"use client"

import Image from "next/image";
import Navbar from "./components/Nav";
import {motion} from 'framer-motion';
import { useState } from "react";
import Closet from './components/Closet';
import Add from './components/Add';
import Outfits from './components/Outfits'

export default function Home() {
  const [buttonSelector, setButonSelector] = useState(0);

  return (
    <>
      <Navbar />

      <div className="w-full mt-[10vh]">
        <ul className="flex flex-row justify-around m-[20px] items-center w-full text-blue-600 text-[25px] font-bold border-b-2">
          <button onClick={() => setButonSelector(0)}>Closet</button>
          <button onClick={() => setButonSelector(2)}> Outfits</button>
          <button onClick={() => setButonSelector(1)}>Add</button>
        </ul>
      </div>

      <div>
      {buttonSelector === 0 ? <Closet /> : null}
      {buttonSelector === 2 ? <Outfits /> : null}
      {buttonSelector === 1 ? <Add /> : null}
      </div>
    </>
  );
}

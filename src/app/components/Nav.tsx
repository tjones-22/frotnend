"use client"

import {motion} from 'framer-motion';

const Navbar = () => {
    return (  
        <>
        <motion.nav 
        initial={{opacity:0}}
        animate={{opacity:1}}
        transition={{duration: 1.5}}
        className=" nav-background w-full h-[20vh]  bg-yellow-300 text-blue-600 text-[60px] rounded-md border-b-2 border-blue-600">
            <h1 className="text-center pt-10 ">Jerilynn's Closet</h1>
        </motion.nav>
        </>
    );
}
 
export default Navbar;
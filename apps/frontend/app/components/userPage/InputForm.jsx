"use client";
import React, { useEffect, useState } from "react";
import { motion }  from 'framer-motion';



const InputForm = () => {
     const [showPassword, setShowPassword] = useState(false);
    return (
        <div className="h-auto w-[60vw] bg-zinc-200  p-[3vh] rounded-lg  flex flex-col ">
            {/*Title  */}
            <h1 className="font-bold ">
                Input Paragraf
            </h1>
            {/* untuk form select */}
            <div className=" bg-white grid justify-center">
                <label htmlFor="inputField" className="block text-sm font-medium text-gray-700">
                    Dropdown
                </label>
                        <select className="w-[50vw] block border rounded-lg" id="city-select" name="city">
                            
                <option value="" disabled default>-- Select a city --</option> 
                
                <option value="nyc">New York City</option>
                <option value="sf">San Francisco</option>
                <option value="lon">London</option>
                </select>   
                </div>
             {/* untuk form from-to atau start-end */}
              <div className=" bg-white justify-center">
                
            <div className="flex justify-center gap-[5vw]">
            <form className="w-[22.5vw]">
                <label htmlFor="inputField" className="block text-sm font-medium text-gray-700">
                    From
                </label>
                <input
                    type="text"
                    id="inputField"
                    className="block w-full rounded-lg border px-3 py-2"
                    placeholder="Type something..."
                />
            </form>
             <form className="w-[22.5vw]">
                <label htmlFor="inputField" className="block text-sm font-medium text-gray-700">
                    To
                </label>
                <input
                    type="text"
                    id="inputField"
                    className="block w-full rounded-lg border px-3 py-2"
                    placeholder="Type something..."
                />
            </form>
            </div>
            </div>
            {/* untuk text paragraf (Notifikasi) */}
             <div className="bg-white grid grid-flow-row justify-center ">
            
            <form className="w-[50vw]">
                <label htmlFor="inputField" className="block text-sm font-medium text-gray-700">
                    Text
                </label>
                 <textarea
              name="message"
              rows={4}
              className="w-full rounded-lg border p-2 resize-none md:h-[30vh] h-[60vh] focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ketik paragraf..."
            />
            </form>
            
            </div>
            {/* untuk form text */}
            <div className="bg-white grid grid-flow-row justify-center ">
            <h1 className="font-bold ">
                Input Text
                
            </h1>
            <form className="w-[50vw]">
                <label htmlFor="inputField" className="block text-sm font-medium text-gray-700">
                    Text
                </label>
                <input
                    type="text"
                    id="inputField"
                    className="block w-full rounded-lg border px-3 py-2"
                    placeholder="Type something..."
                />
            </form>
            
            </div>
           
          
            {/* untuk password */}
            <div className="bg-white grid grid-flow-row justify-center" >
                <form className="w-[50vw]">
                <label
                    htmlFor="inputField"
                    className="block text-sm font-medium text-gray-700 mb-1"
                >
                    Password
                </label>

                        <div className="relative">
                            <input
                            type={showPassword ? "text" : "password"}
                            id="inputField"
                            className="block w-full rounded-lg border border-gray-300 px-3 py-2 pr-16 focus:border-blue-500 focus:ring-blue-500"
                            placeholder="Enter your password"
                            />
                            <button
                            type="button"
                            onClick={() => setShowPassword((prev) => !prev)}
                            className="absolute inset-y-0 right-0 flex items-center pr-3 text-sm text-blue-600 hover:underline"
                            >
                            {showPassword ? "Sembunyi" : "Tampilkan"}
                            </button>
                        </div>
                </form>
            </div>
                {/* submit button */}
                    <div className="flex justify-center">
                    <motion.button
                    className="h-[10vh] w-[50vw] rounded-lg mt-[2vh] "
                    initial={{ opacity: 0.8, scale: 0.9, backgroundColor: "#2563eb"}}
                    whileHover={{ opacity: 1, scale: 1,  backgroundColor: "#1e40af" }}
                    transition={{ duration: 0.25,  ease: 'easeOut' }}
                    >
                            Submit
                    </motion.button>
                    </div>
            
           
        </div>
    );
};

export default InputForm;
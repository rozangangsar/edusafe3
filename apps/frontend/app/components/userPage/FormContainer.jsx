"use client";
import { motion } from "framer-motion";
import React from "react";
import Image from "next/image";

export default function FormContainer({ title, fields, onSubmit, error, success }) {
  {error && (
    <p className="text-red-600 text-sm mb-2">
      {error}
    </p>
  )}
  {success && (
    <p className="text-emerald-600 text-sm mb-2">
      {success}
    </p>
  )}

  const [showPassword, setShowPassword] = React.useState({});

  return (
    
    <section className="p-[2vh] md:px-[2vh] flex justify-center items-center min-h-screen w-full">
      <div className="w-full max-w-5xl bg-white border-[3px] border-[#608FC2] rounded-lg  p-[4vh] md:px-[4vh]">
        <div className="flex flex-col gap-[5vh]">
          
          {/* Title */}
          <h1 className="text-2xl font-bold text-[#0B3869] p-[2vh]">
            {title}
          </h1>

          <form onSubmit={onSubmit} className="flex flex-col gap-[5vh]">

            <div className="flex flex-col gap-[3vh] ">
              {fields.map((field) => (
                <div key={field.id} className="flex flex-col gap-[1vh]]">
                  <label  
                    htmlFor={field.id}
                    className="text-xs text-gray-400 px-[1vh]"
                  >
                    {field.label}
                  </label>

                  {field.type === "text" && (
                    <div className="bg-gray-100 rounded-lg px-4 py-3">
                      <input
                        id={field.id}
                        name={field.id}
                        type="text"
                        placeholder={field.placeholder}
                        className="w-full bg-transparent  text-black placeholder:text-gray-400 focus:outline-none"
                      />
                    </div>
                  )}

                  {field.type === "password" && (
                    <div className="bg-gray-100 rounded-lg px-4 py-3 relative">
                      <input
                        id={field.id}
                        name={field.id}
                        type={showPassword[field.id] ? "text" : "password"}
                        placeholder={field.placeholder}
                        className="w-full pr-16 bg-transparent text-black placeholder:text-gray-400 focus:outline-none"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowPassword((prev) => ({
                            ...prev,
                            [field.id]: !prev[field.id],
                          }))
                        }
                        className="absolute inset-y-0 right-4 flex items-center text-xs text-gray-500"
                      >
                        {showPassword[field.id] ? <Image
                        src="/assets/svg/eye-off.svg"
                        alt="Eye_off_icon"
                        width={77}
                        height={87}
                        className="w-fit h-fit cursor-pointer"/> : <Image
                        src="/assets/svg/mdi_eye.svg"
                        alt="Eye_icon"
                        width={77}
                        height={87}
                        className="w-fit h-fit cursor-pointer"
                      />}
                      </button>
                    </div>
                  )}

                  {field.type === "select" && (
                    <div className="relative">
                      <select
                        id={field.id}
                        name={field.id}
                        className="w-full appearance-none bg-gray-100 rounded-lg px-4 py-3  text-gray-400  cursor-pointer"
                      >
                        {field.options.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>

                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4">
                        <img
                          src="/assets/svg/chevron-down.svg"
                          className="w-6 h-6"
                        />
                      </div>
                    </div>
                  )}

                  {field.type === "textarea" && (
                    <div className="bg-gray-100 rounded-lg px-4 py-3 ">
                      <textarea
                        id={field.id}
                        name={field.id}
                        placeholder={field.placeholder}
                        rows={field.rows || 2}
                        className="w-full bg-transparent  text-black placeholder:text-gray-400  resize-y focus:outline-none" 
                      />
                    </div>
                  )}

                  {field.type === "number" && (
                  <div className="bg-gray-100 rounded-lg px-4 py-3">
                    <input
                      type="number"
                      id={field.id}
                      name={field.id}
                      placeholder={field.placeholder}
                      min={field.min}
                      max={field.max}
                      step={field.step}
                      className="w-full bg-transparent  text-black placeholder:text-gray-400 focus:outline-none"
                    />
                  </div>
                )}

                  {field.type === "date" && (
                    <input
                        type="date"
                        id={field.id}
                        name={field.id}
                        className="w-full bg-gray-100 rounded-lg px-4 py-3  text-black focus:outline-none"
                    />
                    )}

                  {field.type === "time" && (
                    <input
                        type="time"
                        id={field.id}
                        name={field.id}
                        className="w-full bg-gray-100 rounded-lg px-4 py-3  text-black focus:outline-none"
                        placeholder="Select time"
                    />
                    )}

                </div>
              ))}
            </div>

            <motion.button
              type="submit"
              className="w-full sm:w-[50vh] bg-[#608FC2] text-white font-bold  rounded-xl py-[2vh] flex items-center justify-center gap-2 "
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>Konfirmasi</span>
              <img src="/assets/svg/Check.svg" className="w-[17px] h-[17px]" />
            </motion.button>

          </form>
        </div>
      </div>
    </section>
  );
}

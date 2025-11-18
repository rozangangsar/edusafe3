"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion }  from 'framer-motion';
import { useRouter } from 'next/navigation';
import { apiFetch} from '@/lib/api';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

    useEffect(() => {
      if (typeof window === 'undefined') return;
      const token = localStorage.getItem('token');
      const role = localStorage.getItem('userRole');
      if(!token|| !role) return;
      (async () => {
        try {
          await apiFetch('/api/auth/me');
          if(role ==='admin') {
            router.replace('/admin');}
            else if (role === 'teacher'){
               router.replace('/teacher');}
            else if (role === 'parent') {
              router.replace('/parent');}
            else {
              router.replace('/');}
        } catch (err) {
          localStorage.removeItem('token');
          localStorage.removeItem('userRole');
        }
      })();
    }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = await apiFetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
        headers: { 'Content-Type': 'application/json' },
      });
      
      if(typeof window !== 'undefined') {
        localStorage.setItem('token', data.token);
        localStorage.setItem('userRole', data.user.role);
      }

      const role = data.user.role;
      if (role === 'admin') {
        router.push('/admin');}
      else if (role === 'teacher'){
         router.push('/teacher');}
      else if (role === 'parent') {
        router.push('/parent');}
      else {
        router.push('/');}
    } catch (err) {
      setError(err.message || 'Email atau Password salah!');
    } finally {
      setLoading(false);
    }
  };
 return (
<div>
  <Link href="/" className="absolute left-4 sm:left-6 lg:left-[41px] top-4 sm:top-6 lg:top-[25px] items-center flex gap-4">
            <Image
              src="/assets/svg/logo.svg"
              alt="EduSafe Logo"
              width={38.66}
              height={43.67}
              className="w-12 h-14 sm:w-16 sm:h-[72px] lg:w-[50px] lg:h-[55px]"
            /> <div className='text-3xl text-[#14263E] font-bold'>
              EduSafe
            </div>
          </Link>
  <div className="h-screen w-screen justify-center items-center flex flex-col">
    
     <div className="border grid p-[3vh] rounded-lg gap-1 border-gray-300">
     <div className='bg-white font-bold text-3xl text-[#313131]'>
      Login
      </div>
     <div className='bg-white text-[#313131]'>Cari tahu kegiatan anak anda!</div>
     {error && <div className="bg-red-100 text-red-700 text-sm rounded-md px-3 py-2 mt-2">{error}</div>}
           <div className=" bg-white pt-5 justify-center">
             
         </div>
         {/* untuk form text */}
         <div className="bg-white grid grid-flow-row justify-center">
         <form className="w-[40vw]">
             <label htmlFor="inputField" className="block text-sm font-medium text-gray-700">
                 Email
             </label>
              <input
                type="email"
                id="email"
                className="block w-full rounded-md border border-gray-300 px-3 py-2"
                placeholder="Masukkan email anda"
                value={email}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit(e)}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

         </form>
         
         </div>
         {/* untuk form from-to atau start-end */}
       
         {/* untuk password */}
         <div className="bg-white grid grid-flow-row justify-center" >
             <form className="w-[40vw]">
             <label
                 htmlFor="inputField"
                 className="block text-sm font-medium text-gray-700 mb-1"
             >
                 Password
             </label>

                     <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          id="password"
                          className="block w-full rounded-md border border-gray-300 px-3 py-2 pr-16 focus:border-blue-500 focus:ring-blue-500"
                          placeholder="Masukkan password"
                          value={password}
                          onKeyDown={(e) => e.key === "Enter" && handleSubmit(e)}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />


                         <button
                         type="button"
                         onClick={() => setShowPassword((prev) => !prev)}
                         className="absolute inset-y-0 right-0 flex items-center pr-3 text-sm text-blue-600 hover:underline"
                         >
                         {showPassword ? <Image
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
             </form>
         </div>
                 <div className="flex justify-center">
                 <motion.button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="px-6 py-3 w-[40vw] rounded-lg mt-[2vh] text-white font-bold text-2xl disabled:opacity-70"
                  initial={{ opacity: 1, scale: 0.95, backgroundColor: '#608FC2' }}
                  whileHover={{ opacity: 0.9, scale: 1, backgroundColor: '#608FC2' }}
                  transition={{ duration: 0.2, ease: 'easeOut' }}
                >
                  {loading ? 'Logging in...' : 'Login'}
                </motion.button>
                 </div>
         
        
     </div>
     </div>
     </div>
 );
};
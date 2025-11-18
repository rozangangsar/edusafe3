"use client";
import { motion } from "framer-motion";

const bookingData = [
  {
    id: 1,
    name: 'John Doe',
    checkIn: '2024-05-01',
    checkOut: '2024-05-05',
    status: 'Confirmed',
    notes: 'Early check-in requested'
  },
  {
    id: 2,
    name: 'Jane Smith',
    checkIn: '2024-05-03',
    checkOut: '2024-05-07',
    status: 'Pending',
    notes: 'Extra bed required'
  },
  {
    id: 3,
    name: 'Bob Johnson',
    checkIn: '2024-05-10',
    checkOut: '2024-05-15',
    status: 'Confirmed',
    notes: 'Airport pickup needed'
  },
  {
    id: 4,
    name: 'Alice Brown',
    checkIn: '2024-05-12',
    checkOut: '2024-05-14',
    status: 'Cancelled',
    notes: 'Refund processed'
  },
  {
    id: 5,
    name: 'Charlie Wilson',
    checkIn: '2024-05-15',
    checkOut: '2024-05-20',
    status: 'Confirmed',
    notes: 'Anniversary celebration'
  },
  {
    id: 6,
    name: 'Diana Martinez',
    checkIn: '2024-05-18',
    checkOut: '2024-05-22',
    status: 'Pending',
    notes: 'Late checkout requested'
  },
  {
    id: 7,
    name: 'Ethan Davis',
    checkIn: '2024-05-20',
    checkOut: '2024-05-25',
    status: 'Confirmed',
    notes: 'Business trip'
  },
  {
    id: 8,
    name: 'Fiona Garcia',
    checkIn: '2024-05-22',
    checkOut: '2024-05-27',
    status: 'Confirmed',
    notes: 'Family vacation'
  }
];

const Tabel = () => {
    return (
         <div className="flex flex-col justify-center p-[5vh]   ">
          <h1 className=" font-bold text-2xl ">Data Kehadiran</h1>
          <table className="w-[90vw] rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-[#0B3869] text-white">
                <th className="px-4 py-3 text-left font-semibold">Name</th>
                <th className="px-4 py-3 text-left font-semibold">Check In</th>
                <th className="px-4 py-3 text-left font-semibold">Check Out</th>
                <th className="px-4 py-3 text-left font-semibold">Status</th>
                <th className="px-4 py-3 text-left font-semibold">Notes</th>
                
              </tr>
            </thead>
            <tbody>
              {bookingData.map((booking, index) => (
                <tr
                  key={booking.id}
                  className={index % 2 === 0 ? 'bg-[#DFE8F2]' : 'bg-white'}
                >
                  <td className="px-4 py-3 text-gray-700">{booking.name}</td>
                  <td className="px-4 py-3 text-gray-700">{booking.checkIn}</td>
                  <td className="px-4 py-3 text-gray-700">{booking.checkOut}</td>
                  <td className="px-4 py-3 text-gray-700">{booking.status}</td>
                  <td className="px-4 py-3 text-gray-700">{booking.notes}</td>
                
                </tr>
              ))}
            </tbody>
          </table>
          </div>
    
    );
}
export default Tabel;
"use client";
import { motion } from "framer-motion";

const presensiData = [
  {
    id: 1,
    name: 'Mulat Adi',
    status: 'Hihihi',
  },
  {
    id: 2,
    name: 'Mulat Adi',
    status: 'Hihihi',
  },
  {
    id: 3,
    name: 'Mulat Adi',
    status: 'Hihihi',
  },
  {
    id: 4,
    name: 'Mulat Adi',
    status: 'Hihihi',
  },
  {
    id: 5,
    name: 'Mulat Adi',
    status: 'Hihihi',
  },
];

const TabelBeranda = () => {
    return (
         <div className="flex flex-col bg-white rounded-b-lg pb-4">
            <div className="px-4 pt-4 pb-3 border-b border-gray-200">
              <h3 className="text-xl font-bold text-[#0B3869]">Presensi Hari Ini</h3>
              <p className="text-sm text-gray-500 mt-1">Total: {presensiData.length} anak</p>
            </div>
            
          <div className="px-4 pt-3">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-[#0B3869] text-white">
                  <th className="px-6 py-3 text-left font-semibold rounded-tl-lg">Name</th>
                  <th className="px-6 py-3 text-left font-semibold rounded-tr-lg">Status</th>
                </tr>
              </thead>
              <tbody>
                {presensiData.map((presensi, index) => (
                  <motion.tr
                    key={presensi.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`${index % 2 === 0 ? 'bg-[#DFE8F2]' : 'bg-white'} hover:bg-blue-100 transition-colors`}
                  >
                    <td className="px-6 py-3 text-gray-700 font-medium">{presensi.name}</td>
                    <td className="px-6 py-3 text-gray-700">{presensi.status}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Quick Tips */}
          <div className="px-4 pt-4 mt-2">
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="text-3xl">💡</div>
                <div>
                  <h4 className="font-semibold text-[#0B3869] text-base mb-2">Tips Hari Ini</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Pastikan anak Anda membawa perlengkapan sekolah lengkap dan sarapan sebelum berangkat untuk energi optimal!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
       
    
    );
}
export default TabelBeranda;
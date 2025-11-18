import { motion } from "framer-motion";

const ActivityBeranda = ({ name, type, text, date, time_from, time_to, sender, style  }) => {
    let fill_muda, fill_avg, fill_tua;

    if (type === "Kelas") {
        fill_muda = "A9E6F1";
        fill_avg = "24C1DC";
        fill_tua = "187F90";
    } else if (type === "Aktivitas") {
        fill_muda = "FFF695";
        fill_avg = "FFED24";
        fill_tua = "9D910C";
    } else if (type === "Pemberitahuan") {
        fill_muda = "FF98C4";
        fill_avg = "FF3B8F";
        fill_tua = "A91353";
    }

    return (
        <div
            className={`${style} rounded-lg grid grid-flow-col grid-cols-4 border-2 overflow-hidden`}
            style={{ borderColor: `#${fill_tua}` }}
        >
            
           
            <div
                className="items-center flex justify-center font-bold md:text-4xl text-xl "
                style={{ backgroundColor: `#${fill_avg}` }}
            >
                {type}
            </div>

      
            <div className="col-span-2 col-start-2 w-full bg-white flex flex-col justify-between">
                
                <div
                    className="w-fit rounded-br-lg px-[3vh] py-[2vh] font-bold"
                    style={{ backgroundColor: `#${fill_muda}` }}
                >
                    {name} sedang {text}
                </div>

                <div className="px-[2vh]">{date}</div>

                <div className="px-[2vh] py-[1vh] font-bold opacity-70">
                    oleh {sender}
                </div>
            </div>

     
            <div
                className="flex flex-col items-center font-bold gap-y-[2vh]  "
                style={{ backgroundColor: `#${fill_muda}` }}
            >
                <div
                    className="flex justify-center rounded-b-lg text-lg py-[2vh]  w-full  text-center"
                    style={{ backgroundColor: `#${fill_avg}` }}
                >
                    Waktu Dilaksanakan
                </div>

                <div className=" md:text-xl text-xl text-center">
                    {time_from} - {time_to}
                </div>
            </div>
        </div>
    );
}

export default ActivityBeranda;

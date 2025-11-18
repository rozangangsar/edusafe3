"use client";
import { motion } from "framer-motion";

const NotificationSaranPage = ({headline ="", text="", onDelete }) => {
    return (
        <div className="w-[80vw] h-auto border p-[2vh] overflow-hidden rounded-lg">
            <h1 className="font-bold text-2xl py-[2vh] ">{headline}</h1>
            <p className="whitespace-pre-line w-auto">

{`${text}`}
</p>
<div>

</div>
        <div className="flex justify-end ">
            {onDelete && (
            <motion.button className=" text-white p-[1vh] rounded-lg"
        initial={{ scale: 1, backgroundColor:"#0B3869"}}
        whileHover={{ scale: 1.1, backgroundColor:"#1e40af"}}
            onClick={onDelete}
            > Hapus
            </motion.button>
            )}
            </div>
        </div>
    );
}

export default NotificationSaranPage;
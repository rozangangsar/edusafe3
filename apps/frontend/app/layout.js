import { Inter, Nunito, Lato, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Footer from "@/app/components/allPage/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800", "900"],
  variable: "--font-nunito",
});

const lato = Lato({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  variable: "--font-lato",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-jakarta",
});

export const metadata = {
  title: "EduSafe - Sistem Komunikasi Sekolah",
  description: "Platform komunikasi antara Admin, Guru, dan Orang Tua",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className={`${inter.variable} ${nunito.variable} ${lato.variable} ${plusJakartaSans.variable} font-sans antialiased`}>
        {children}
        <Footer />
      </body>
    </html>
  );
}


"use client"
import { Inter } from "next/font/google";
import { usePathname } from 'next/navigation'; // Importa usePathname
import "./globals.css";
import { Navbarv1 as Inicio } from "@/components/navbar";
import { SessionProvider } from "next-auth/react";
const inter = Inter({ subsets: ["latin"] });
import {  } from "@/components/component/breadcrumbItem";
import { Label } from "recharts";
/*export const metadata = {
  title: "AIONET",
};*/

export default function RootLayout({ children}) {
  const pathname = usePathname(); // Obtiene la ruta actual
  const showNavbar = pathname !== '/login';
  const showNavbar3 = pathname !== '/'; // Determina si debe mostrarse la Navbar
  const showNavbar2 = pathname !== '/login/registro'; // Determina si debe mostrarse la Navbar

   
    
  return (
    <SessionProvider>
     <html lang="en">
    <head>
      <title>AIONET</title>
      <meta name="description" content="Bienvenido a AIONET, la plataforma ..." />
      <link rel="icon" type="image/png" sizes="16x16" href="/logo1.png" />
    </head>
    <body className={inter.className}>
     
      <div style={{ display: 'flex' }}>
        {showNavbar && showNavbar3 && showNavbar2 && (
          <div style={{ width: '250px', position: 'fixed', top: '0', left: '0', height: '100vh', backgroundColor: '#000000d6' }}>
            <Inicio /> {/* Navbar */}
          </div>
        )}
        <div style={{ marginLeft: '250px', width: '100%' }}>
          <br />
          
          {children} {/* Contenido principal */}
     
        </div>
      </div>
      
    </body>
  </html>
  </SessionProvider>

  );
}
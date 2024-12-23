"use client"
import { useSession,  signOut } from "next-auth/react";
import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import styles from '../../../../public/CSS/spinner.css';

export function Ingenieria_nuevo_producto() {
  const [openSection, setOpenSection] = useState(null)
  
  const {data: session,status}=useSession ();
  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section)
  }
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner className={styles.spinner} />
        <p className="ml-3">Cargando...</p>
      </div>
    );
  }
  if (status=="loading") {
    return <p>cargando...</p>;
  }
  if (!session || !session.user) {
    return (
      window.location.href = "/",
      <div className="flex items-center justify-center min-h-screen">
        <Spinner className={styles.spinner} />
        <p className="ml-3">No has iniciado sesión</p>
      </div>
    );
  }

  const ingenieriaNuevoProducto = "ingenieria_nuevo_producto";

  return (
    (<div className="w-full max-w-6xl mx-auto py-12 md:py-20">
      <Link href={`/explorador_archivos?id=${ingenieriaNuevoProducto}`}>
        <Button variant="outline" size="sm" className="fixed h-9 gap-2 right-4 top-10 bg-blue-500 text-white p-2 rounded-lg shadow-lg">
          <div className="h-3.5 w-3.5" />
          <FolderIcon className="h-4 w-4" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Explorador de archivos</span>
        </Button>
      </Link>
      <div className="px-4 md:px-6">
        <div className="grid gap-8 md:gap-12">
          <section>
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Proceso de Desarrollo de Productos</h1>
            <p className="mt-4 text-muted-foreground md:text-lg">
              Descubre los pasos clave para crear nuevos productos de manera efectiva y exitosa.
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-bold tracking-tight md:text-3xl">Fases del Proceso</h2>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mt-6">
              <div className="grid gap-4">
                <div className="bg-muted rounded-lg p-4 flex items-center gap-4">
                  <div className="bg-primary rounded-full p-2 text-primary-foreground">
                    <SearchIcon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Investigación de Mercado</h3>
                    <p className="text-muted-foreground text-sm">
                      Analiza el mercado, la competencia y las necesidades de los clientes.
                    </p>
                  </div>
                </div>
                <img
                  src="/placeholder.svg"
                  width={600}
                  height={400}
                  alt="Investigación de mercado"
                  className="rounded-lg object-cover"
                  style={{ aspectRatio: "600/400", objectFit: "cover" }} />
              </div>
              <div className="grid gap-4">
                <div className="bg-muted rounded-lg p-4 flex items-center gap-4">
                  <div className="bg-primary rounded-full p-2 text-primary-foreground">
                    <LightbulbIcon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Ideación</h3>
                    <p className="text-muted-foreground text-sm">
                      Genera ideas innovadoras y creativas para nuevos productos.
                    </p>
                  </div>
                </div>
                <img
                  src="/placeholder.svg"
                  width={600}
                  height={400}
                  alt="Ideación"
                  className="rounded-lg object-cover"
                  style={{ aspectRatio: "600/400", objectFit: "cover" }} />
              </div>
              <div className="grid gap-4">
                <div className="bg-muted rounded-lg p-4 flex items-center gap-4">
                  <div className="bg-primary rounded-full p-2 text-primary-foreground">
                    <LayersIcon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Prototipado</h3>
                    <p className="text-muted-foreground text-sm">Crea prototipos para validar y refinar las ideas.</p>
                  </div>
                </div>
                <img
                  src="/placeholder.svg"
                  width={600}
                  height={400}
                  alt="Prototipado"
                  className="rounded-lg object-cover"
                  style={{ aspectRatio: "600/400", objectFit: "cover" }} />
              </div>
              <div className="grid gap-4">
                <div className="bg-muted rounded-lg p-4 flex items-center gap-4">
                  <div className="bg-primary rounded-full p-2 text-primary-foreground">
                    <BeakerIcon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Pruebas</h3>
                    <p className="text-muted-foreground text-sm">
                      Realiza pruebas con usuarios para validar el producto.
                    </p>
                  </div>
                </div>
                <img
                  src="/placeholder.svg"
                  width={600}
                  height={400}
                  alt="Pruebas"
                  className="rounded-lg object-cover"
                  style={{ aspectRatio: "600/400", objectFit: "cover" }} />
              </div>
              <div className="grid gap-4">
                <div className="bg-muted rounded-lg p-4 flex items-center gap-4">
                  <div className="bg-primary rounded-full p-2 text-primary-foreground">
                    <RocketIcon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Lanzamiento</h3>
                    <p className="text-muted-foreground text-sm">
                      Lanza el producto al mercado y monitorea su rendimiento.
                    </p>
                  </div>
                </div>
                <img
                  src="/placeholder.svg"
                  width={600}
                  height={400}
                  alt="Lanzamiento"
                  className="rounded-lg object-cover"
                  style={{ aspectRatio: "600/400", objectFit: "cover" }} />
              </div>
            </div>
          </section>
          <section>
            <h2 className="text-2xl font-bold tracking-tight md:text-3xl">Beneficios de un Proceso Estructurado</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="bg-muted rounded-lg p-4 flex items-center gap-4">
                <div className="bg-primary rounded-full p-2 text-primary-foreground">
                  <CheckIcon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold">Enfoque Estratégico</h3>
                  <p className="text-muted-foreground text-sm">
                    Un proceso estructurado ayuda a mantener el enfoque en las necesidades del mercado y los objetivos
                    estratégicos.
                  </p>
                </div>
              </div>
              <div className="bg-muted rounded-lg p-4 flex items-center gap-4">
                <div className="bg-primary rounded-full p-2 text-primary-foreground">
                  <GaugeIcon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold">Eficiencia y Agilidad</h3>
                  <p className="text-muted-foreground text-sm">
                    El proceso permite iterar rápidamente, reducir riesgos y lanzar productos de manera más ágil.
                  </p>
                </div>
              </div>
              <div className="bg-muted rounded-lg p-4 flex items-center gap-4">
                <div className="bg-primary rounded-full p-2 text-primary-foreground">
                  <ThumbsUpIcon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold">Productos de Éxito</h3>
                  <p className="text-muted-foreground text-sm">
                    Seguir un proceso estructurado aumenta las probabilidades de desarrollar productos que satisfagan
                    las necesidades de los clientes.
                  </p>
                </div>
              </div>
              <div className="bg-muted rounded-lg p-4 flex items-center gap-4">
                <div className="bg-primary rounded-full p-2 text-primary-foreground">
                  <CombineIcon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold">Colaboración Efectiva</h3>
                  <p className="text-muted-foreground text-sm">
                    El proceso fomenta la colaboración entre diferentes equipos y disciplinas, lo que mejora la calidad
                    y la innovación.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>)
  );
}

function BeakerIcon(props) {
  return (
    (<svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round">
      <path d="M4.5 3h15" />
      <path d="M6 3v16a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V3" />
      <path d="M6 14h12" />
    </svg>)
  );
}


function CheckIcon(props) {
  return (
    (<svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round">
      <path d="M20 6 9 17l-5-5" />
    </svg>)
  );
}


function CombineIcon(props) {
  return (
    (<svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round">
      <rect width="8" height="8" x="2" y="2" rx="2" />
      <path d="M14 2c1.1 0 2 .9 2 2v4c0 1.1-.9 2-2 2" />
      <path d="M20 2c1.1 0 2 .9 2 2v4c0 1.1-.9 2-2 2" />
      <path d="M10 18H5c-1.7 0-3-1.3-3-3v-1" />
      <polyline points="7 21 10 18 7 15" />
      <rect width="8" height="8" x="14" y="14" rx="2" />
    </svg>)
  );
}


function GaugeIcon(props) {
  return (
    (<svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round">
      <path d="m12 14 4-4" />
      <path d="M3.34 19a10 10 0 1 1 17.32 0" />
    </svg>)
  );
}


function LayersIcon(props) {
  return (
    (<svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round">
      <path
        d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z" />
      <path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65" />
      <path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65" />
    </svg>)
  );
}


function LightbulbIcon(props) {
  return (
    (<svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round">
      <path
        d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
      <path d="M9 18h6" />
      <path d="M10 22h4" />
    </svg>)
  );
}


function RocketIcon(props) {
  return (
    (<svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round">
      <path
        d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
      <path
        d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
      <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
      <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
    </svg>)
  );
}


function SearchIcon(props) {
  return (
    (<svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>)
  );
}


function ThumbsUpIcon(props) {
  return (
    (<svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round">
      <path d="M7 10v12" />
      <path
        d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z" />
    </svg>)
  );
}

function FolderIcon(props) {
  return(
    <svg
      className="h-4 w-4 text-gray-600"
      fill="none"
      stroke="black"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M10 4H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V8l-6-4z"
      />
    </svg>
  );
}

function Spinner() {
  return (
    <div className="spinner" />
  );
}
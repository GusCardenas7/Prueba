"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@mui/material";
import axios from "axios";
import Link from "next/link";
import Swal from "sweetalert2";
import styles from "../../../../public/CSS/spinner.css";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";

export function TablaPermisos() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [eventos, setEventos] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const encabezados = [
    "ID papeleta",
    "Estatus",
    "Fecha de subida",
    "Fecha de actualización",
    "Acción",
  ];

  // Obtener eventos desde el backend
  useEffect(() => {
    const fetchEventos = async () => {
      try {
        const response = await axios.get(
          `/api/getPermisosIndividuales?id=${id}`
        );
        setEventos(response.data);
      } catch (error) {
        console.error("Error al obtener eventos:", error);
      }
    };
    fetchEventos();
  }, []);

  // Función para extraer los datos relevantes
  const extractData = (evento) => {
    const fechaCompleta = evento.fecha;
    const fecha = new Date(fechaCompleta);

    // Extraer solo la fecha y la hora
    const fechaFormateada = fecha.toLocaleString("es-ES", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

    const fechaCompleta2 = evento.fecha_actualizacion;
    const fecha2 = new Date(fechaCompleta2);

    // Extraer solo la fecha y la hora
    const fechaFormateada2 = fecha2.toLocaleString("es-ES", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

    const handleDelete = async (index) => {
      try {
        // Mostrar alerta de confirmación
        const result = await Swal.fire({
          title: "¿Deseas eliminar el formulario?",
          text: "No podrás revertir esta acción",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#d33",
          cancelButtonColor: "#3085d6",
          confirmButtonText: "Eliminar",
          cancelButtonText: "Cancelar",
        });

        // Si el usuario confirma la eliminación
        if (result.isConfirmed) {
          const response = await axios.post(
            `/api/eliminarPermisoIndividual?id=${index}`
          );
          if (response.status === 200) {
            await Swal.fire(
              "Eliminado",
              "El formulario ha sido eliminado",
              "success"
            );
            window.location.href = `/permisos?id=${id}`;
          } else {
            Swal.fire("Error", "Error al eliminar el formulario", "error");
          }
        }
      } catch (error) {
        console.error("Error al eliminar el formulario:", error);
        Swal.fire(
          "Error",
          "Ocurrió un error al intentar eliminar el formulario",
          "error"
        );
      }
    };

    return {
      id: evento.id,
      estatus: evento.formulario.autorizado || "No especificado",
      fechaDeSubida: fechaFormateada,
      fechaDeActualizacion: fechaFormateada2,
      accion: (index) => (
        <div style={{ display: "flex", gap: "1px" }}>
          <Button
            onClick={() => handleDelete(index)}
            style={{ width: "1px", height: "40px" }}
          >
            <svg
              width="25px"
              height="25px"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3 3L21 21M18 6L17.6 12M17.2498 17.2527L17.1991 18.0129C17.129 19.065 17.0939 19.5911 16.8667 19.99C16.6666 20.3412 16.3648 20.6235 16.0011 20.7998C15.588 21 15.0607 21 14.0062 21H9.99377C8.93927 21 8.41202 21 7.99889 20.7998C7.63517 20.6235 7.33339 20.3412 7.13332 19.99C6.90607 19.5911 6.871 19.065 6.80086 18.0129L6 6H4M16 6L15.4559 4.36754C15.1837 3.55086 14.4194 3 13.5585 3H10.4416C9.94243 3 9.47576 3.18519 9.11865 3.5M11.6133 6H20M14 14V17M10 10V17"
                stroke="rgb(31 41 55)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Button>
          <Link href={`permisos/ver_permisos?id=${index}`}>
            <Button style={{ width: "1px", height: "40px" }}>
              <VisualizeIcon />
            </Button>
          </Link>
        </div>
      ),
    };
  };

  // Filtrar eventos según el término de búsqueda y estatus
  const filteredEventos = eventos.map(extractData).filter(
    (evento) =>
      (statusFilter === "todos" || evento.estatus === statusFilter) &&
      Object.values(evento)
        .filter((value) => value !== null && value !== undefined) // Filtra valores nulos o indefinidos
        .some((value) =>
          value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
  );

  const { data: session, status } = useSession();
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner className={styles.spinner} />
        <p className="ml-3">Cargando...</p>
      </div>
    );
  }
  if (status == "loading") {
    return <p>cargando...</p>;
  }
  if (!session || !session.user) {
    return (
      (window.location.href = "/"),
      (
        <div className="flex items-center justify-center min-h-screen">
          <Spinner className={styles.spinner} />
          <p className="ml-3">No has iniciado sesión</p>
        </div>
      )
    );
  }

  // Paginación
  const indexOfLastEvento = currentPage * itemsPerPage;
  const indexOfFirstEvento = indexOfLastEvento - itemsPerPage;
  const currentEventos = filteredEventos.slice(
    indexOfFirstEvento,
    indexOfLastEvento
  );
  const totalPages = Math.ceil(filteredEventos.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container mx-auto">
      <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="w-full sm:w-1/3">
          <Label htmlFor="search" className="mb-2 block">
            Buscar
          </Label>
          <SearchIcon
            style={{ marginTop: "10px", marginLeft: "15px" }}
            className="absolute h-5 w-5 text-gray-400"
          />
          <Input
            id="search"
            placeholder="Buscar en todos los campos..."
            className="w-full pl-12 pr-4 py-2 bg-gray-700 rounded-md text-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="w-full sm:w-1/3">
          <Label htmlFor="status-filter" className="mb-2 block">
            Filtrar por estatus
          </Label>
          <Select onValueChange={setStatusFilter} defaultValue={statusFilter}>
            <SelectTrigger id="status-filter">
              <SelectValue placeholder="Seleccionar estatus" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              <SelectItem value="Autorizado">Autorizado</SelectItem>
              <SelectItem value="Pendiente">Pendiente</SelectItem>
              <SelectItem value="No autorizado">No autorizado</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableCaption>Permisos vigentes</TableCaption>
          <TableHeader>
            <TableRow>
              {encabezados.map((encabezado, index) => (
                <TableHead key={index} className="whitespace-nowrap">
                  {encabezado}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentEventos.length > 0 ? (
              currentEventos.map((evento, index) => (
                <TableRow key={index}>
                  {/* Renderiza las celdas aquí */}
                  <TableCell>{evento.id}</TableCell>
                  <TableCell
                    style={{
                      color: (() => {
                        switch (evento.estatus) {
                          case "Autorizado":
                            return "green";
                          case "No autorizado":
                            return "red";
                          case "Pendiente":
                            return "orange";
                          default:
                            return "black"; // color por defecto
                        }
                      })(),
                    }}
                  >
                    {evento.estatus}
                  </TableCell>
                  <TableCell>{evento.fechaDeSubida}</TableCell>
                  <TableCell>{evento.fechaDeActualizacion}</TableCell>
                  <TableCell>
                    {evento.accion ? evento.accion(evento.id) : "N/A"}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  No se encontraron permisos
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Paginación */}
      <div className="flex justify-center mt-4 mb-4">
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Anterior
        </button>
        <span style={{ marginRight: "2rem" }}></span>
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            style={{ marginLeft: "1rem", marginRight: "1rem" }}
            key={index}
            onClick={() => paginate(index + 1)}
            className={currentPage === index + 1 ? "font-bold" : ""}
          >
            {index + 1}
          </button>
        ))}
        <span style={{ marginLeft: "2rem" }}></span>
        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}

function SearchIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function VisualizeIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="30"
      height="30"
      viewBox="0 0 64 64"
      aria-labelledby="title"
      role="img"
    >
      <path
        d="M32 12C16 12 4 32 4 32s12 20 28 20 28-20 28-20S48 12 32 12z"
        fill="none"
        stroke="rgb(31 41 55)"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <circle
        cx="32"
        cy="32"
        r="10"
        fill="none"
        stroke="rgb(31 41 55)"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <circle cx="32" cy="32" r="4" fill="rgb(31 41 55)" />
    </svg>
  );
}

function Spinner() {
  return <div className="spinner" />;
}

"use client"

import { useState, useEffect } from "react"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@mui/material"
import axios from "axios"
import Link from "next/link"
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import * as XLSX from "xlsx";
import styles from '../../../public/CSS/spinner.css';
import { useSession,  signOut } from "next-auth/react";
import PDFDocument from '../../Marketing Strategy/Components/pdf'; // Importa el componente que creamos
import { PDFDownloadLink } from '@react-pdf/renderer';
import { pdf } from '@react-pdf/renderer';

const MySwal = withReactContent(Swal);

export function TablaPermisosFalta() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("todos")
  const [eventos, setEventos] = useState([])
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const encabezados = [
    "Nombre",
    "Fecha de subida",
    "Fecha de último movimiento",
    "Número de empleado",
    "Departamento",
    "Puesto",
    "Jefe directo",
    "Estatus",
    "Acción"
  ]

  // Obtener eventos desde el backend
  useEffect(() => {
    const fetchEventos = async () => {
      try {
        const response = await axios.get('/api/getFaltasTabla') // Asegúrate de que esta ruta esté configurada en tu backend
        setEventos(response.data)
      } catch (error) {
        console.error('Error al obtener eventos:', error)
      }
    }
    fetchEventos()
  }, [])

  const handleDownload = async (evento) => {
    try {
      // Generar el documento PDF
      const blob = await pdf(<PDFDocument evento={evento.formulario} />).toBlob();
      
      // Crear una URL temporal para el Blob
      const url = URL.createObjectURL(blob);
      
      // Crear un elemento <a> temporal para iniciar la descarga
      const a = document.createElement('a');
      a.href = url;
      a.download = `planificacion-evento-${evento.id}.pdf`;
      
      // Añadir el elemento al DOM y desencadenar el clic
      document.body.appendChild(a);
      a.click();
      
      // Limpiar el DOM y revocar la URL temporal
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error al generar o descargar el PDF:', error);
      Swal.fire('Error', 'Ocurrió un error al generar el PDF', 'error');
    }
  };  

  // Función para extraer los datos relevantes
  const extractData = (evento) => {
    const handleDelete = async (index) => {
      try {
        // Mostrar alerta de confirmación
        const result = await Swal.fire({
          title: '¿Deseas eliminar el formulario?',
          text: 'No podrás revertir esta acción',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#d33',
          cancelButtonColor: '#3085d6',
          confirmButtonText: 'Eliminar',
          cancelButtonText: 'Cancelar',
        });

        // Si el usuario confirma la eliminación
        if (result.isConfirmed) {
          const response = await axios.post(`/api/eliminarFormulario?id=${index}`);
          if (response.status === 200) {
            await Swal.fire('Eliminado', 'El formulario ha sido eliminado', 'success');
            window.location.href = "/marketing/estrategias";
          } else {
            Swal.fire('Error', 'Error al eliminar el formulario', 'error');
          }
        }
      } catch (error) {
        console.error('Error al eliminar el formulario:', error);
        Swal.fire('Error', 'Ocurrió un error al intentar eliminar el formulario', 'error');
      }
    };

    return {
      id: evento.id,
      nombre: evento.formulario.evento,
      fecha_subida: evento.fecha_subida,
      fecha_actualizacion: evento.fecha_actualizacion,
      numero_empleado: evento.formulario.evento,
      departamento: evento.formulario.marca,
      puesto: evento.formulario.lugar,
      jefe_directo: evento.formulario.fecha,
      estatus: evento.estatus,
      accion: (index) => (
        <div style={{ display: 'flex', gap: '1px' }}>
          <Button onClick={() => handleDelete(index)} style={{ width: "1px", height: "40px"}}>
            <svg width="25px" height="25px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 3L21 21M18 6L17.6 12M17.2498 17.2527L17.1991 18.0129C17.129 19.065 17.0939 19.5911 16.8667 19.99C16.6666 20.3412 16.3648 20.6235 16.0011 20.7998C15.588 21 15.0607 21 14.0062 21H9.99377C8.93927 21 8.41202 21 7.99889 20.7998C7.63517 20.6235 7.33339 20.3412 7.13332 19.99C6.90607 19.5911 6.871 19.065 6.80086 18.0129L6 6H4M16 6L15.4559 4.36754C15.1837 3.55086 14.4194 3 13.5585 3H10.4416C9.94243 3 9.47576 3.18519 9.11865 3.5M11.6133 6H20M14 14V17M10 10V17" stroke="rgb(31 41 55)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Button>
          <Link href={`estrategias/editar_formulario?id=${index}`}>
            <Button style={{ width: "1px", height: "40px"}} >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke="rgb(31 41 55)" fill="rgb(31 41 55)" width="20px" height="20px">
                <path d="M21,11.5V15H18a3,3,0,0,0-3,3v3H4.5A1.5,1.5,0,0,1,3,19.5V4.5A1.5,1.5,0,0,1,4.5,3h9A1.5,1.5,0,0,0,15,1.5h0A1.5,1.5,0,0,0,13.5,0h-9A4.5,4.5,0,0,0,0,4.5v15A4.5,4.5,0,0,0,4.5,24H16.484a4.5,4.5,0,0,0,3.181-1.317l3.017-3.017A4.5,4.5,0,0,0,24,16.485V11.5A1.5,1.5,0,0,0,22.5,10h0A1.5,1.5,0,0,0,21,11.5Z" />
                <path d="M17.793,1.793l-12.5,12.5A1,1,0,0,0,5,15v3a1,1,0,0,0,1,1H9a1,1,0,0,0,.707-.293L22.038,6.376a3.379,3.379,0,0,0,.952-3.17A3.118,3.118,0,0,0,17.793,1.793Z" />
              </svg>
            </Button>
          </Link>
          <Button
  style={{ width: "1px", height: "40px" }}
  onClick={() => handleDownload(evento)}
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24px"
    height="24px"
    viewBox="0 0 24 24"
    fill="none"
    stroke="rgb(31 41 55)"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="feather feather-file-text"
  >
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
    <line x1="16" y1="13" x2="8" y2="13"></line>
    <line x1="16" y1="17" x2="8" y2="17"></line>
    <polyline points="10 9 9 9 8 9"></polyline>
  </svg>
</Button>
        </div>
      ),
    }
  }

  // Filtrar eventos según el término de búsqueda y estatus
  const filteredEventos = eventos
    .map(extractData)
    .filter(evento => 
      (statusFilter === "todos" || evento.estatus === statusFilter) &&
      Object.values(evento)
        .filter(value => value !== null && value !== undefined)  // Filtra valores nulos o indefinidos
        .some(value => value.toString().toLowerCase().includes(searchTerm.toLowerCase()))
    );

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      filteredEventos.map((evento) => ({
        Evento: evento.evento,
        Marca: evento.marca,
        Lugar: evento.lugar,
        Fecha: evento.fecha,
        Estatus: evento.estatus,
        "Gasto Presupuesto Total": evento.gastoPresupuesto,
        "Gasto Real Total": evento.gastoReal,
        "Venta Total": evento.ventaTotal,
        ROI: evento.roi,
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Estrategias");
    XLSX.writeFile(workbook, "estrategias.xlsx");
  };
  
  const {data: session,status}=useSession ();
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

  // Paginación
  const indexOfLastEvento = currentPage * itemsPerPage;
  const indexOfFirstEvento = indexOfLastEvento - itemsPerPage;
  const currentEventos = filteredEventos.slice(indexOfFirstEvento, indexOfLastEvento);
  const totalPages = Math.ceil(filteredEventos.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container mx-auto">
      <div style={{ display:"flex" }}>
        <Button
          variant="contained"
          color="primary"
          style={{ background: "rgb(31 41 55)", marginBottom: "15px" }}
          onClick={exportToExcel}
        >
          Exportar a Excel
        </Button>
      </div>
      <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="w-full sm:w-1/3">
          <Label htmlFor="search" className="mb-2 block">Buscar</Label>
          <SearchIcon style={{marginTop:"10px", marginLeft:"15px"}} className="absolute h-5 w-5 text-gray-400" />
          <Input
            id="search"
            placeholder="Buscar en todos los campos..."
            className="w-full pl-12 pr-4 py-2 bg-gray-700 rounded-md text-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="w-full sm:w-1/3">
          <Label htmlFor="status-filter" className="mb-2 block">Filtrar por estatus</Label>
          <Select onValueChange={setStatusFilter} defaultValue={statusFilter}>
            <SelectTrigger id="status-filter">
              <SelectValue placeholder="Seleccionar estatus" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              <SelectItem value="Completado">Completado</SelectItem>
              <SelectItem value="Pendiente">Pendiente</SelectItem>
              <SelectItem value="En progreso">En progreso</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableCaption>Permisos pendientes por revisar</TableCaption>
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
                  <TableCell>{evento.evento || 'Sin nombre especificado'}</TableCell>
                  <TableCell>{evento.fecha_subida
                    ? `${new Date(evento.fecha_subida).toLocaleDateString('es-ES', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                      })} ${new Date(evento.fecha_subida).toLocaleTimeString('es-ES', {
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                        hour12: false, // Cambiar a true si prefieres formato de 12 horas
                      })}`
                    : "Sin datos"}</TableCell>
                  <TableCell>{evento.fecha_actualizacion
                    ? `${new Date(evento.fecha_actualizacion).toLocaleDateString('es-ES', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                      })} ${new Date(evento.fecha_actualizacion).toLocaleTimeString('es-ES', {
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                        hour12: false, // Cambiar a true si prefieres formato de 12 horas
                      })}`
                    : "Sin datos"}</TableCell>
                  <TableCell>{evento.fecha || 'Sin número de empleado especificado'}</TableCell>
                  <TableCell>{evento.fecha || 'Sin departamento especificado'}</TableCell>
                  <TableCell>{evento.fecha || 'Sin puesto especificado'}</TableCell>
                  <TableCell>{evento.fecha || 'Sin jefe directo especificado'}</TableCell>
                  <TableCell
                    style={{
                      color: (() => {
                        switch (evento.estatus) {
                          case 'Autorizado':
                            return 'green';
                          case 'No autorizado':
                            return 'red';
                          case 'Pendiente':
                            return 'orange';
                          default:
                            return 'black'; // color por defecto
                        }
                      })(),
                    }}
                  >
                    {evento.estatus || 'Sin estatus especificado'}
                  </TableCell>
                  <TableCell>{evento.accion ? evento.accion(evento.id) : "N/A"}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={9} className="text-center">
                  No se encontraron permisos
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Paginación */}
      <div className="flex justify-center mt-4 mb-4">
      <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
        Anterior
      </button>
      <span style={{ marginRight: "2rem" }}></span>
      
      {/* Páginas */}
      {currentPage > 3 && (
        <>
          <button onClick={() => paginate(1)}>1</button>
          <span style={{ marginLeft: "1rem", marginRight: "1rem" }}>...</span>
        </>
      )}

      {Array.from({ length: totalPages }, (_, index) => index + 1)
        .filter(page => page === currentPage || page === currentPage - 1 || page === currentPage + 1)
        .map(page => (
          <button
            key={page}
            onClick={() => paginate(page)}
            className={currentPage === page ? "font-bold" : ""}
            style={{ marginLeft: "1rem", marginRight: "1rem" }}
          >
            {page}
          </button>
        ))}

      {currentPage < totalPages - 2 && (
        <>
          <span style={{ marginLeft: "1rem", marginRight: "1rem" }}>...</span>
          <button onClick={() => paginate(totalPages)}>{totalPages}</button>
        </>
      )}

      <span style={{ marginLeft: "2rem" }}></span>
      <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages}>
        Siguiente
      </button>
    </div>
    </div>
  )
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

function Spinner() {
  return (
    <div className="spinner" />
  );
}

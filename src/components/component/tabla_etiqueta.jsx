"use client"

import { useState, useEffect } from "react"
import axios from "axios"
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
import Link from "next/link"
import Swal from 'sweetalert2';

export function TablaEventosMejorada() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("todos")
  const [eventos, setEventos] = useState([])

  const encabezados = [
    "Nombre",
    "Articulo",
    "Fecha Envio",
    "Autorización estatus",
    "Fecha último movimiento",
    "Acción"
  ]

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
        const response = await axios.post(`/api/eliminarFormularioEtiqueta?id=${index}`);
        if (response.status === 200) {
          await Swal.fire('Eliminado', 'El formulario ha sido eliminado', 'success');
          window.location.href = "/marketing/etiquetas/tabla_general";
        } else {
          Swal.fire('Error', 'Error al eliminar el formulario', 'error');
        }
      }
    } catch (error) {
      console.error('Error al eliminar el formulario:', error);
      Swal.fire('Error', 'Ocurrió un error al intentar eliminar el formulario', 'error');
    }
  };
  // Obtener eventos desde el backend
  useEffect(() => {
    const fetchEventos = async () => {
      try {
        const response = await axios.get('/api/getEtiquetas')
        setEventos(response.data)
      } catch (error) {
        console.error('Error al obtener etiquetas:', error)
      }
    }
    fetchEventos()
  }, [])

  // Filtrar los eventos en base a la búsqueda y el filtro de estatus
  const filteredEventos = eventos.filter(evento => 
    (statusFilter === "todos" || evento.Autorizacion === statusFilter) &&
    Object.values(evento.datos_formulario || {}).some(value => 
      value?.toString().toLowerCase().includes(searchTerm.toLowerCase())))

  // Acción que contiene los botones
  const renderAccion = (index) => (
    <div style={{ display: 'flex', gap: '1px' }}>
      <Button onClick={() => handleDelete(index)} style={{ width: "1px", height: "40px" }}>
        <svg width="25px" height="25px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 3L21 21M18 6L17.6 12M17.2498 17.2527L17.1991 18.0129C17.129 19.065 17.0939 19.5911 16.8667 19.99C16.6666 20.3412 16.3648 20.6235 16.0011 20.7998C15.588 21 15.0607 21 14.0062 21H9.99377C8.93927 21 8.41202 21 7.99889 20.7998C7.63517 20.6235 7.33339 20.3412 7.13332 19.99C6.90607 19.5911 6.871 19.065 6.80086 18.0129L6 6H4M16 6L15.4559 4.36754C15.1837 3.55086 14.4194 3 13.5585 3H10.4416C9.94243 3 9.47576 3.18519 9.11865 3.5M11.6133 6H20M14 14V17M10 10V17" stroke="red" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </Button>
      <Link href={`../Editar?id=${index}`}>
        <Button style={{ width: "1px", height: "40px" }}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke="orange" fill="orange" width="20px" height="20px">
            <path d="M21,11.5V15H18a3,3,0,0,0-3,3v3H4.5A1.5,1.5,0,0,1,3,19.5V4.5A1.5,1.5,0,0,1,4.5,3h9A1.5,1.5,0,0,0,15,1.5h0A1.5,1.5,0,0,0,13.5,0h-9A4.5,4.5,0,0,0,0,4.5v15A4.5,4.5,0,0,0,4.5,24H16.484a4.5,4.5,0,0,0,3.181-1.317l3.017-3.017A4.5,4.5,0,0,0,24,16.485V11.5A1.5,1.5,0,0,0,22.5,10h0A1.5,1.5,0,0,0,21,11.5Z" />
            <path d="M17.793,1.793l-12.5,12.5A1,1,0,0,0,5,15v3a1,1,0,0,0,1,1H9a1,1,0,0,0,.707-.293L22.038,6.376a3.379,3.379,0,0,0,.952-3.17A3.118,3.118,0,0,0,17.793,1.793Z" />
          </svg>
        </Button>
      </Link>
    </div>
  )

  return (
    <div className="container mx-auto py-10">
      <a href="/marketing/etiquetas">
        <Button variant="contained" color="secondary" style={{ background: "green", padding: "5px", marginBottom: "10px" }}>+</Button>
      </a>
      
      <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="w-full sm:w-1/3"> <br />
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
              <SelectItem value="Autorizado">Autorizado</SelectItem>
              <SelectItem value="Pendiente">Pendiente</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableCaption>Etiquetas vigentes</TableCaption>
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
            {filteredEventos.length > 0 ? (
              filteredEventos.map((evento, index) => (
                <TableRow key={index}>
                  <TableCell>{evento.datos_formulario?.nombre_producto || "Sin nombre"}</TableCell>
                  <TableCell>{evento.datos_formulario?.articulo || "Sin artículo"}</TableCell>
                  <TableCell>{evento.datos_formulario?.fecha_elaboracion || "Sin fecha"}</TableCell>
                  <TableCell>{evento.datos_formulario?.description || "Sin descripción"}</TableCell>
                  <TableCell>{evento.datos_formulario?.['fecha_autorizacion-0'] || "Sin fecha"}</TableCell>
                  <TableCell>{renderAccion(evento.id)}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  No se encontraron etiquetas
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
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
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
import { Button as Button2 } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import axios from "axios";
import Link from "next/link";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import * as XLSX from "xlsx";
import styles from "../../../public/CSS/spinner.css";
import { useSession, signOut } from "next-auth/react";
import PDFDocument from "../../Marketing Strategy/Components/pdf"; // Importa el componente que creamos
import { PDFDownloadLink } from "@react-pdf/renderer";
import { pdf } from "@react-pdf/renderer";
import { FormularioIncidenciasJsx as Formulario } from "./formulario-incidencias";
import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { CalendarIcon, Upload } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { getSession } from "next-auth/react";

const MySwal = withReactContent(Swal);

export function TablaPermisosFaltaUsuario() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [eventos, setEventos] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [isModalOpen, setModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [fechaInicio, setFechaInicio] = useState(null);
  const [fechaFin, setFechaFin] = useState(null);
  const [motivo, setMotivo] = useState("");
  const [dias, setDias] = useState("");
  const [comprobante, setComprobante] = useState(null);
  const [justificada, setJustificada] = useState("");
  const [pagada, setPagada] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [departamento, setDepartamento] = useState("");
  const [idUser, setID] = useState("");
  const [correoUser, setCorreo] = useState("");
  const [numero_empleado, setNumeroEmpleado] = useState("");
  const [jefe_directo, setJefeDirecto] = useState("");
  const [jefeNombre, setJefeNombre] = useState("");
  const [jefeApellidos, setJefeApellidos] = useState("");
  const [puesto, setPuesto] = useState("");

  const [formData, setFormData] = useState({
    dias: "",
    fechaInicio: null,
    fechaFin: null,
    motivo: "",
    comprobante: null,
    justificada: "",
    pagada: "",
  });

  useEffect(() => {
    const fetchUserData = async () => {
      const session = await getSession();
      if (session) {
        const response = await fetch("/api/getUser", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ correo: session.user.email }),
        });
        const userData = await response.json();
        if (userData.success) {
          setNombre(userData.user.nombre);
          setApellidos(userData.user.apellidos);
          setDepartamento(userData.departamento.nombre);
          setID(userData.user.id);
          setCorreo(userData.user.correo);
          setNumeroEmpleado(userData.user.numero_empleado);
          setJefeDirecto(userData.user.jefe_directo);
          setPuesto(userData.user.puesto);

          // Si tienes el ID del jefe directo, hacer una nueva solicitud para obtener su nombre y apellido
          if (userData.user.jefe_directo) {
            const jefeResponse = await fetch("/api/getUserById", {
              // Suponiendo que tienes una API para esto
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ id: userData.user.jefe_directo }),
            });
            const jefeData = await jefeResponse.json();
            if (jefeData.success) {
              setJefeNombre(jefeData.user.nombre);
              setJefeApellidos(jefeData.user.apellidos);
            } else {
              alert("Error al obtener los datos del jefe directo");
            }
          }
        } else {
          alert("Error al obtener los datos del usuario");
        }
      }
    };
    fetchUserData();
  }, []);

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleOpenEditModal = () => {
    setEditModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const encabezados = [
    "Departamento",
    "Puesto",
    "Número de empleado",
    "Fecha de subida",
    "Fecha de último movimiento",
    "Jefe directo",
    "Estatus",
    "Acción",
  ];

  // Obtener eventos desde el backend
  useEffect(() => {
    const fetchEventos = async () => {
      if (!idUser) {
        // Si el idUser no está disponible, no hacemos la solicitud
        return;
      }

      try {
        const response = await axios.get(`/api/getFaltas?id=${idUser}`); // Asegúrate de que esta ruta esté configurada en tu backend
        setEventos(response.data);
      } catch (error) {
        console.error("Error al obtener eventos:", error);
      }
    };
    fetchEventos();
  }, [idUser]);

  const handleEditForm = async (index) => {
    try {
      const response = await fetch(`/api/obtenerFormularioFaltas?id=${index}`);
      const data = await response.json();
      setFormData(data);
    } catch (error) {
      console.error("Error al obtener el formulario:", error);
    }

    setEditModalOpen(true);
  };

  // Función para extraer los datos relevantes
  const extractData = (evento) => {
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
            `/api/eliminarFormularioFaltas?id=${index}`
          );
          if (response.status === 200) {
            await Swal.fire(
              "Eliminado",
              "El formulario ha sido eliminado",
              "success"
            );
            window.location.href = "/gente_y_cultura/faltasUsuario";
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
      departamento: departamento,
      puesto: puesto,
      numero_empleado: numero_empleado,
      fecha_subida: evento.fecha_subida,
      fecha_actualizacion: evento.fecha_actualizacion,
      jefe_directo: jefeNombre + " " + jefeApellidos,
      estatus: evento.estatus,
      accion: (index) => (
        <div style={{ display: "flex", gap: "1px" }}>
          <Button
            style={{ width: "1px", height: "40px" }}
            onClick={() => handleEditForm(index)}
          >
            <VisualizeIcon />
          </Button>
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

  const openModal = () => {
    setFormData({
      dias: "",
      fechaInicio: "", // Siempre vacío al abrir el modal
      fechaFin: "",
      motivo: "",
      comprobante: null,
      justificada: "",
      pagada: "",
    });
    setModalOpen(true); // Abre el modal
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((formData) => ({
      ...formData,
      [name]: value,
    }));
  };

  // Paginación
  const indexOfLastEvento = currentPage * itemsPerPage;
  const indexOfFirstEvento = indexOfLastEvento - itemsPerPage;
  const currentEventos = filteredEventos.slice(
    indexOfFirstEvento,
    indexOfLastEvento
  );
  const totalPages = Math.ceil(filteredEventos.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!session) {
      console.log("No se ha iniciado sesión");
      return;
    }
    try {
      const response = await fetch(
        `/api/guardarFormularioFaltas?id=${idUser}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ formData }), // Enviar todo el objeto formData como JSON
        }
      );
      if (response.ok) {
        Swal.fire({
          title: "Subido",
          text: "Se ha creado correctamente",
          icon: "success",
          timer: 3000, // La alerta desaparecerá después de 1.5 segundos
          showConfirmButton: false,
        }).then(() => {
          window.location.href = "/gente_y_cultura/faltasUsuario";
        });
      } else {
        Swal.fire("Error", "Error al subir formulario", "error");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    if (!session) {
      console.log("No se ha iniciado sesión");
      return;
    }
    try {
      const response = await fetch(
        `/api/guardarFormularioFaltas?id=${idUser}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ formData }), // Enviar todo el objeto formData como JSON
        }
      );
      if (response.ok) {
        Swal.fire({
          title: "Subido",
          text: "Se ha creado correctamente",
          icon: "success",
          timer: 3000, // La alerta desaparecerá después de 1.5 segundos
          showConfirmButton: false,
        }).then(() => {
          window.location.href = "/gente_y_cultura/faltasUsuario";
        });
      } else {
        Swal.fire("Error", "Error al subir formulario", "error");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const renderDatePicker = (
    label,
    date,
    handleChange,
    name,
    readOnly = false
  ) => (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button2
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
            disabled={readOnly} // Desactiva el botón si es readOnly
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? (
              format(date, "PPP", { locale: es })
            ) : (
              <span>Selecciona una fecha</span>
            )}
          </Button2>
        </PopoverTrigger>
        {!readOnly && (
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(selectedDate) =>
                handleChange({ target: { name, value: selectedDate } })
              }
              initialFocus
            />
          </PopoverContent>
        )}
      </Popover>
    </div>
  );

  return (
    <div className="container mx-auto">
      <div style={{ display: "flex" }}>
        <Button
          variant="contained"
          color="secondary"
          style={{ background: "rgb(31 41 55)", padding: "5px" }}
          onClick={openModal}
        >
          +
        </Button>
      </div>
      <br />

      <Dialog open={isModalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="border-none p-0">
          <Card className="w-full max-w-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center">
                Faltas
              </CardTitle>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="motivo">Días</Label>
                  <Input
                    id="dias"
                    name="dias"
                    type="number"
                    onChange={handleChange}
                    required
                    placeholder="Dias que faltó"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {renderDatePicker(
                    "Fecha de inicio",
                    formData.fechaInicio,
                    handleChange,
                    "fechaInicio"
                  )}
                  {renderDatePicker(
                    "Fecha de fin",
                    formData.fechaFin,
                    handleChange,
                    "fechaFin"
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="motivo">Observaciones</Label>
                  <Textarea
                    id="motivo"
                    name="motivo"
                    onChange={handleChange}
                    required
                    className="min-h-[100px]"
                    placeholder="Coloca tus observaciones aquí..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="comprobante">Comprobante</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="comprobante"
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        setFormData((prevFormData) => ({
                          ...prevFormData,
                          comprobante: file ? file.name : null, // Guardar el nombre del archivo en formData
                        }));
                      }}
                      required
                      className="hidden"
                    />
                    <Button2
                      type="button"
                      variant="outline"
                      onClick={() =>
                        document.getElementById("comprobante").click()
                      }
                      className="w-full"
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      Subir archivo (PDF, JPG, PNG)
                    </Button2>
                    {formData.comprobante && (
                      <span className="text-sm text-muted-foreground">
                        {formData.comprobante}
                      </span>
                    )}
                  </div>
                </div>
                <div className="space-y-2" hidden>
                  <Label>¿La falta es justificada?</Label>
                  <RadioGroup
                    onValueChange={handleChange}
                    className="flex space-x-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="si" id="justificada-si" />
                      <Label htmlFor="justificada-si">Sí</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="justificada-no" />
                      <Label htmlFor="justificada-no">No</Label>
                    </div>
                  </RadioGroup>
                </div>
                <div className="space-y-2" hidden>
                  <Label htmlFor="pagada">¿La falta es pagada?</Label>
                  <Select onValueChange={handleChange}>
                    <SelectTrigger id="pagada">
                      <SelectValue placeholder="Selecciona una opción" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="si">Sí, es pagada</SelectItem>
                      <SelectItem value="no">No es pagada</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
              <CardFooter>
                <Button2 type="submit" className="w-full">
                  Enviar
                </Button2>
              </CardFooter>
            </form>
          </Card>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="border-none p-0">
          <Card className="w-full max-w-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center">
                Faltas
              </CardTitle>
            </CardHeader>
            <form onSubmit={handleSubmitEdit}>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="motivo">Días</Label>
                  <Input
                    id="dias"
                    name="dias"
                    type="number"
                    value={formData.dias}
                    onChange={handleChange}
                    placeholder="Dias que faltó"
                    readOnly={true}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {renderDatePicker(
                    "Fecha de inicio",
                    formData.fechaInicio,
                    handleChange,
                    "fechaInicio",
                    true
                  )}
                  {renderDatePicker(
                    "Fecha de fin",
                    formData.fechaFin,
                    handleChange,
                    "fechaFin",
                    true
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="motivo">Observaciones</Label>
                  <Textarea
                    id="motivo"
                    name="motivo"
                    value={formData.motivo}
                    onChange={handleChange}
                    className="min-h-[100px]"
                    placeholder="Coloca tus observaciones aquí..."
                    readOnly={true}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="comprobante">Comprobante</Label>
                  <div className="flex items-center space-x-2">
                    {formData.comprobante ? (
                      // Si hay un valor recuperado, mostrarlo como texto
                      <span className="text-sm text-muted-foreground">
                        {formData.comprobante}
                      </span>
                    ) : (
                      // Si no hay un valor recuperado, permitir la subida de archivo
                      <>
                        <Input
                          id="comprobante"
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => {
                            const file = e.target.files?.[0] || null;
                            setFormData((prevFormData) => ({
                              ...prevFormData,
                              comprobante: file ? file.name : null, // Guardar el nombre del archivo en formData
                            }));
                          }}
                          required
                          className="hidden"
                        />
                        <Button2
                          type="button"
                          variant="outline"
                          onClick={() =>
                            document.getElementById("comprobante").click()
                          }
                          className="w-full"
                        >
                          <Upload className="mr-2 h-4 w-4" />
                          Subir archivo (PDF, JPG, PNG)
                        </Button2>
                      </>
                    )}
                  </div>
                </div>
                <div className="space-y-2" hidden>
                  <Label>¿La falta es justificada?</Label>
                  <RadioGroup
                    value={formData.justificada}
                    onValueChange={handleChange}
                    className="flex space-x-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="si" id="justificada-si" />
                      <Label htmlFor="justificada-si">Sí</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="justificada-no" />
                      <Label htmlFor="justificada-no">No</Label>
                    </div>
                  </RadioGroup>
                </div>
                <div className="space-y-2" hidden>
                  <Label htmlFor="pagada">¿La falta es pagada?</Label>
                  <Select value={formData.pagada} onValueChange={handleChange}>
                    <SelectTrigger id="pagada">
                      <SelectValue placeholder="Selecciona una opción" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="si">Sí, es pagada</SelectItem>
                      <SelectItem value="no">No es pagada</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </form>
          </Card>
        </DialogContent>
      </Dialog>

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
              <SelectItem value="Completado">Completado</SelectItem>
              <SelectItem value="Pendiente">Pendiente</SelectItem>
              <SelectItem value="En progreso">En progreso</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableCaption>Permisos solicitados</TableCaption>
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
                  <TableCell>
                    {evento.departamento || "Sin departamento especificado"}
                  </TableCell>
                  <TableCell>
                    {evento.puesto || "Sin puesto especificado"}
                  </TableCell>
                  <TableCell>
                    {evento.numero_empleado ||
                      "Sin número de empleado especificado"}
                  </TableCell>
                  <TableCell>
                    {evento.fecha_subida
                      ? `${new Date(evento.fecha_subida).toLocaleDateString(
                          "es-ES",
                          {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          }
                        )} ${new Date(evento.fecha_subida).toLocaleTimeString(
                          "es-ES",
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                            hour12: false, // Cambiar a true si prefieres formato de 12 horas
                          }
                        )}`
                      : "Sin datos"}
                  </TableCell>
                  <TableCell>
                    {evento.fecha_actualizacion
                      ? `${new Date(
                          evento.fecha_actualizacion
                        ).toLocaleDateString("es-ES", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })} ${new Date(
                          evento.fecha_actualizacion
                        ).toLocaleTimeString("es-ES", {
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                          hour12: false, // Cambiar a true si prefieres formato de 12 horas
                        })}`
                      : "Sin datos"}
                  </TableCell>
                  <TableCell>
                    {evento.jefe_directo || "Sin jefe directo especificado"}
                  </TableCell>
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
                    {evento.estatus || "Sin estatus especificado"}
                  </TableCell>
                  <TableCell>
                    {evento.accion ? evento.accion(evento.id) : "N/A"}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center">
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

        {/* Páginas */}
        {currentPage > 3 && (
          <>
            <button onClick={() => paginate(1)}>1</button>
            <span style={{ marginLeft: "1rem", marginRight: "1rem" }}>...</span>
          </>
        )}

        {Array.from({ length: totalPages }, (_, index) => index + 1)
          .filter(
            (page) =>
              page === currentPage ||
              page === currentPage - 1 ||
              page === currentPage + 1
          )
          .map((page) => (
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

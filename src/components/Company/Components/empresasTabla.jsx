"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import styles from "../../../../public/CSS/spinner.css";
import { ChevronRight, Search, UserPlus, X } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import axios from "axios";
import Swal from "sweetalert2";

const formSections = [
  {
    id: "Investigación y Desarrollo de Nuevos Productos",
    name: "Investigación y Desarrollo de Nuevos Productos",
    changeOptions: [
      "Código QR",
      "Código de barras",
      "Cambio estético",
      "Cambio crítico",
      "Distribuido y elaborado por",
      "Tabla nutrimental",
      "Lista de ingredientes",
    ],
  },
  {
    id: "Diseño",
    name: "Diseño",
    changeOptions: [
      "nombre_producto",
      "proveedor",
      "terminado",
      "articulo",
      "fecha_elaboracion",
      "edicion",
      "sustrato",
      "dimensiones",
      "escala",
      "description",
      "Tamaño de letra",
      "Logotipo",
      "Tipografía",
      "Colores",
    ],
  },
  {
    id: "Calidad",
    name: "Calidad",
    changeOptions: ["Información", "Ortografía"],
  },
  {
    id: "Auditorías",
    name: "Auditorías",
    changeOptions: ["Auditable"],
  },
  {
    id: "Laboratorio",
    name: "Laboratorio",
    changeOptions: ["Fórmula"],
  },
  {
    id: "Ingeniería de Productos",
    name: "Ingeniería de Productos",
    changeOptions: [
      "Dimensiones",
      "Sustrato",
      "Impresión interior/exterior",
      "Acabado",
      "Rollo",
      "Seleccionar imágenes",
    ],
  },
  {
    id: "Gerente de Marketing",
    name: "Gerente de Marketing",
    changeOptions: ["Teléfono", "Mail/email"],
  },
  {
    id: "Compras",
    name: "Compras",
    changeOptions: ["Valor"],
  },
  {
    id: "Planeación",
    name: "Planeación",
    changeOptions: ["Inventario"],
  },
  {
    id: "Verificación",
    name: "Verificación",
    changeOptions: [
      "Directora de marketing",
      "Gerente de maquilas y desarrollo de nuevo productos",
      "Investigación y desarrollo de nuevos productos",
      "Ingeniería de productos",
      "Gerente de marketing",
      "Diseñador gráfico",
      "Gerente o supervisor de calidad",
      "Gerente o coordinador de auditorías",
      "Químico o formulador",
      "Planeación",
      "Maquilas",
    ],
  },
];

export function EmpresasTabla() {
  const [selectedSections, setSelectedSections] = useState([]);
  const [selectedPermission, setSelectedPermission] = useState("");
  const [selectedPermission1, setSelectedPermission1] = useState("");
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [roleFilter, setRoleFilter] = useState("all");
  const [selectedChanges, setSelectedChanges] = useState({});
  const [isChangeOptionsDialogOpen, setIsChangeOptionsDialogOpen] =
    useState(false);
  const [isFormSectionsDialogOpen, setIsFormSectionsDialogOpen] =
    useState(false);
  const [statusFilter, setStatusFilter] = useState("todos");
  const [error, setError] = useState("");
  //const [dpto, setSelectedDepartamento] = useState('');
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedDepartamento, setSelectedDepartamento] = useState(""); // ID del departamento seleccionado
  const [filteredUsersDpto, setFilteredUsers] = useState([]);
  const [showDomicilioForm, setShowDomicilioForm] = useState(false);
  const [showIdentificacionForm, setShowIdentificacionForm] = useState(true);
  const [rfc, setRFC] = useState("");
  const [razon, setRazon] = useState("");
  const [regimen, setRegimen] = useState("");
  const [nombre, setNombre] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [estatus, setEstatus] = useState("");
  const [fechaCambio, setFechaCambio] = useState("");
  const [domicilio, setDomicilio] = useState("");
  const [codigo, setCodigo] = useState("");
  const [tipoVialidad, setTipoVialidad] = useState("");
  const [nombreVialidad, setNombreVialidad] = useState("");
  const [numeroExterior, setNumeroExterior] = useState("");
  const [numeroInterior, setNumeroInterior] = useState("");
  const [nombreColonia, setNombreColonia] = useState("");
  const [nombreLocalidad, setNombreLocalidad] = useState("");
  const [nombreMunicipio, setNombreMunicipio] = useState("");
  const [nombreEntidad, setNombreEntidad] = useState("");
  const [entreCalle, setEntreCalle] = useState("");
  const [yCalle, setYCalle] = useState("");
  const [formulario, setFormulario] = useState({});

  const filteredUsers = users.filter(
    (user) =>
      // Filtra por estatus
      (statusFilter === "todos" || user.formulario?.estatus === statusFilter) &&
      // Filtra por términos de búsqueda
      Object.values(user).some((value) => {
        // Verifica si el valor no es nulo o indefinido
        if (value === null || value === undefined) return false;

        // Si el valor es un objeto (como formulario), lo convertimos a JSON string para buscar
        if (typeof value === "object") {
          value = JSON.stringify(value); // Convierte objetos a JSON
        }

        // Compara el valor convertido con el término de búsqueda
        return value
          .toString()
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
      })
  );

  const handleDelete = async (index) => {
    try {
      // Mostrar alerta de confirmación
      const result = await Swal.fire({
        title: "¿Deseas eliminar la empresa?",
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
          `/api/Company/eliminarEmpresa?id=${index}`
        );
        if (response.status === 200) {
          await Swal.fire(
            "Eliminada",
            "La empresa ha sido eliminada",
            "success"
          );
          window.location.href = "/usuario/empresas";
        } else {
          Swal.fire("Error", "Error al eliminar la empresa", "error");
        }
      }
    } catch (error) {
      console.error("Error al eliminar al usuario:", error);
      Swal.fire(
        "Error",
        "Ocurrió un error al intentar eliminar la empresa",
        "error"
      );
    }
  };

  const handleChangeRoleUser = async (index, rol) => {
    try {
      const response = await axios.post(
        `/api/actualizarRolUsuarios?id=${index}&rol=${rol}`
      );
      if (response.status === 200) {
        await Swal.fire(
          "Actualizado",
          "El rol del usuario ha sido actualizado con éxito",
          "success"
        );
      } else {
        Swal.fire("Error", "Error al actualizar el rol del usuario", "error");
      }
    } catch (error) {
      console.error("Error al actualizar el rol del usuario:", error);
      Swal.fire(
        "Error",
        "Ocurrió un error al intentar actualizar el rol del usuario",
        "error"
      );
    }
  };

  const openPermissionsDialog = (userId) => {
    setSelectedUserId(userId); // Guardar el ID del usuario seleccionado
    setIsChangeOptionsDialogOpen(false);
  };
  const handlePermissionChange = (permission) => {
    setSelectedPermission(permission);
    setIsFormSectionsDialogOpen(true);
  };

  const handleSectionSelection = (sectionId) => {
    setSelectedSections((prev) =>
      prev.includes(sectionId)
        ? prev.filter((id) => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true); // Iniciar carga
      try {
        const response = await axios.get("/api/Company/getEmpresas");
        if (response.data.success) {
          setUsers(response.data.users);
        } else {
          console.error(
            "Error al obtener los usuarios:",
            response.data.message
          );
        }
      } catch (error) {
        console.error("Error al hacer fetch de los usuarios:", error);
      } finally {
        setLoading(false); // Finalizar carga
      }
    };

    fetchUsers();
    const fetchSelections = async () => {
      if (selectedUserId) {
        setLoading(true); // Iniciar carga
        try {
          const response = await fetch(
            `/api/Gente&CulturaPermission/registroPermiso?id=${selectedUserId}`
          );
          if (response.ok) {
            const data = await response.json();

            // Asegurarse de que data.permiso tenga la estructura esperada
            setSelectedSections(data.permiso?.seccion || []);
            setSelectedChanges(data.permiso?.campo || {});
          } else {
            console.error(
              "Error en la respuesta del servidor:",
              response.status
            );
          }
        } catch (error) {
          console.error("Error fetching selections", error);
        } finally {
          setLoading(false); // Finalizar carga
        }
      }
    };

    // Solo ejecutar fetchSelections si hay un userId seleccionado
    if (selectedUserId) {
      fetchSelections();
    }
  }, [selectedUserId]);

  useEffect(() => {
    if (!users || users.length === 0) {
      console.log("No hay usuarios disponibles para filtrar.");
      return;
    }

    if (!selectedDepartamento) {
      console.log(
        "Ningún departamento seleccionado, usuarios filtrados vacíos."
      );
      setFilteredUsers([]);
      return;
    }

    const filtered = users.filter(
      (usuario) => usuario.departamento_id === selectedDepartamento
    );

    console.log("Usuarios filtrados antes de actualizar el estado:", filtered);
    setFilteredUsers(filtered);
  }, [selectedDepartamento, users]);

  useEffect(() => {
    if (selectedUser?.departamento_id) {
      setFilteredUsers(
        users.filter(
          (user) => user.departamento_id === selectedUser.departamento_id
        )
      );
    } else {
      setFilteredUsers([]);
    }
  }, [selectedUser?.departamento_id, users]);

  const indexOfLastEvento = currentPage * itemsPerPage;
  const indexOfFirstEvento = indexOfLastEvento - itemsPerPage;
  const currentUsers = filteredUsers.slice(
    indexOfFirstEvento,
    indexOfLastEvento
  );
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

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

  const handleEditUser = (userId) => {
    const userToEdit = users.find((user) => user.id === userId); // Buscar el usuario en el estado
    setSelectedUser(userToEdit); // Establecer el usuario seleccionado en el estado
    setFormulario(userToEdit.formulario);
    console.log(userToEdit.formulario.fechaInicio);
  };

  const handleInputChange = (value, name) => {
    setFormulario((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleInputChange2 = (value, field) => {
    setSelectedUser((prev) => ({
      ...prev,
      formulario: {
        ...prev.formulario,
        [field]: value,
      },
    }));
  };

  const formatDate = (isoDate) => {
    if (!isoDate) return "";
    return isoDate.split("T")[0]; // Extraer "YYYY-MM-DD"
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/Company/registrarEmpresa", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ formulario }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message);
        return;
      }

      if (res.ok) {
        Swal.fire({
          title: "Creada",
          text: "La empresa ha sido creada correctamente",
          icon: "success",
          timer: 3000, // La alerta desaparecerá después de 1.5 segundos
          showConfirmButton: false,
        }).then(() => {
          window.location.href = "/usuario/empresas";
        });
      } else {
        Swal.fire("Error", "Error al crear la empresa", "error");
      }
    } catch (err) {
      console.error("Error en el registro:", err);
      setError(
        "Hubo un problema con el registro. Por favor, intenta nuevamente."
      );
      console.log(err);
    }
  };

  const handleSubmitUpdate = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/Company/actualizarEmpresa", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: selectedUser.id,
          formulario: selectedUser.formulario,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Hubo un problema al actualizar el usuario");
        return;
      }

      if (res.ok) {
        Swal.fire({
          title: "Actualizada",
          text: "Los datos de la empresa se han actualizado correctamente",
          icon: "success",
          timer: 3000, // La alerta desaparecerá después de 1.5 segundos
          showConfirmButton: false,
        }).then(() => {
          window.location.href = "/usuario/empresas";
        });
      } else {
        Swal.fire(
          "Error",
          "Error al actualizar los datos de la empresa",
          "error"
        );
      }
    } catch (err) {
      console.error("Error en la actualización:", err);
      setError(
        "Hubo un problema con la actualización. Por favor, intenta nuevamente."
      );
    }
  };

  const saveSelections = async () => {
    if (!selectedUserId) return; // Validación para asegurarnos que tenemos el ID
    const selectedData = [];

    selectedSections.forEach((sectionId) => {
      const section = formSections.find((s) => s.id === sectionId);
      if (section && selectedChanges[sectionId]) {
        selectedChanges[sectionId].forEach((option) => {
          selectedData.push({
            seccion: section.name,
            campo: option,
          });
        });
      }
    });

    const response = await fetch(
      `/api/Gente&CulturaPermission/registroPermiso?id=${selectedUserId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ selections: selectedData }),
      }
    );

    if (response.ok) {
      Swal.fire({
        title: "Creado",
        text: "Se ha creado correctamente el permiso",
        icon: "success",
        timer: 3000, // La alerta desaparecerá después de 1.5 segundos
        showConfirmButton: false,
      }).then(() => {
        window.location.href = "/usuario";
      });
    } else {
      Swal.fire("Error", "Error al cargar permiso ", "error");
    }
  };

  const removeSection = (sectionId) => {
    setSelectedSections((prev) => prev.filter((id) => id !== sectionId));
    setSelectedChanges((prev) => {
      const { [sectionId]: _, ...rest } = prev;
      return rest;
    });
  };

  const handleChangeOptionSelection = (sectionId, option) => {
    setSelectedChanges((prev) => ({
      ...prev,
      [sectionId]: prev[sectionId]?.includes(option)
        ? prev[sectionId].filter((opt) => opt !== option) // Deselecciona
        : [...(prev[sectionId] || []), option], // Selecciona
    }));
  };
  const openChangeOptionsDialog = () => {
    setIsChangeOptionsDialogOpen(true);
    setIsFormSectionsDialogOpen(false);
  };
  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center mb-4 text-sm text-muted-foreground">
        <a href="/inicio" className="hover:underline">
          Inicio
        </a>
        <ChevronRight className="mx-2 h-4 w-4" />
        <a href="/usuario" className="hover:underline">
          Administrador de usuarios
        </a>
        <ChevronRight className="mx-2 h-4 w-4" />
        <a
          href="/usuario/empresas"
          className="font-bold hover:underline text-primary"
        >
          Administrador de empresas
        </a>
      </div>

      <h1 className="text-2xl font-bold mb-6">Administrador de empresas</h1>

      <div className="flex justify-between mb-4">
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar empresa..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          <div hidden>
            <Select onValueChange={setStatusFilter} defaultValue={statusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrar por rol" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos los roles</SelectItem>
                <SelectItem value="activo">Activo</SelectItem>
                <SelectItem value="inactivo">Inactivo</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <EmpresasIcon className="mr-2 h-4 w-4" /> Añadir empresa
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nueva Empresa</DialogTitle>
              <DialogDescription>
                Ingresa los detalles de la empresa.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                {showIdentificacionForm && (
                  <>
                    <DialogHeader>
                      <DialogTitle>
                        Datos de Identificación del Contribuyente
                      </DialogTitle>
                    </DialogHeader>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="rfc" className="text-right">
                        RFC
                      </Label>
                      <Input
                        id="rfc"
                        name="rfc"
                        className="col-span-3"
                        required
                        value={formulario.rfc}
                        onChange={(e) =>
                          handleInputChange(e.target.value, e.target.name)
                        }
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="razon" className="text-right">
                        Razón social
                      </Label>
                      <Input
                        id="razon"
                        name="razon"
                        className="col-span-3"
                        required
                        value={formulario.razon}
                        onChange={(e) =>
                          handleInputChange(e.target.value, e.target.name)
                        }
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="regimen" className="text-right">
                        Régimen capital
                      </Label>
                      <Input
                        id="regimen"
                        name="regimen"
                        className="col-span-3"
                        required
                        value={formulario.regimen}
                        onChange={(e) =>
                          handleInputChange(e.target.value, e.target.name)
                        }
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="nombre" className="text-right">
                        Nombre comercial
                      </Label>
                      <Input
                        id="nombre"
                        name="nombre"
                        className="col-span-3"
                        required
                        value={formulario.nombre}
                        onChange={(e) =>
                          handleInputChange(e.target.value, e.target.name)
                        }
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="fechaInicio" className="text-right">
                        Fecha inicio de operaciones
                      </Label>
                      <Input
                        id="fechaInicio"
                        name="fechaInicio"
                        type="date"
                        className="col-span-3"
                        required
                        value={formulario.fechaInicio}
                        onChange={(e) =>
                          handleInputChange(e.target.value, e.target.name)
                        }
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="estatus" className="text-right">
                        Estatus en el padrón
                      </Label>
                      <Select
                        name="estatus"
                        value={formulario.estatus}
                        onValueChange={(value) =>
                          handleInputChange(value, "estatus")
                        }
                      >
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Seleccione una opción" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ACTIVO">Activo</SelectItem>
                          <SelectItem value="INACTIVO">Inactivo</SelectItem>
                        </SelectContent>
                      </Select>
                      {/*<Input id="estatus" className="col-span-3" required value={estatus} onChange={(e) => setEstatus(e.target.value)} />*/}
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="fechaCambio" className="text-right">
                        Fecha de último cambio de estado
                      </Label>
                      <Input
                        id="fechaCambio"
                        name="fechaCambio"
                        type="date"
                        className="col-span-3"
                        required
                        value={formulario.fechaCambio}
                        onChange={(e) =>
                          handleInputChange(e.target.value, e.target.name)
                        }
                      />
                    </div>
                  </>
                )}

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="domicilio" className="text-right">
                    ¿Agregar domicilio?
                  </Label>
                  <Select
                    value={domicilio}
                    onValueChange={(value) => {
                      setDomicilio(value);
                      setShowDomicilioForm(value === "si"); // Reiniciar el jefe directo
                      setShowIdentificacionForm(value === "no"); // Reiniciar el jefe directo
                    }}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Seleccione una opción" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="si">Sí</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {showDomicilioForm && (
                  <>
                    <DialogHeader>
                      <DialogTitle>Datos del domicilio registrado</DialogTitle>
                    </DialogHeader>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="codigo" className="text-right">
                        Código postal
                      </Label>
                      <Input
                        id="codigo"
                        name="codigo"
                        type="number"
                        className="col-span-3"
                        required
                        value={formulario.codigo}
                        onChange={(e) =>
                          handleInputChange(e.target.value, e.target.name)
                        }
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="tipoVialidad" className="text-right">
                        Tipo de vialidad
                      </Label>
                      <Input
                        id="tipoVialidad"
                        name="tipoVialidad"
                        className="col-span-3"
                        required
                        value={formulario.tipoVialidad}
                        onChange={(e) =>
                          handleInputChange(e.target.value, e.target.name)
                        }
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="nombreVialidad" className="text-right">
                        Nombre de vialidad
                      </Label>
                      <Input
                        id="nombreVialidad"
                        name="nombreVialidad"
                        className="col-span-3"
                        value={formulario.nombreVialidad}
                        onChange={(e) =>
                          handleInputChange(e.target.value, e.target.name)
                        }
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="numeroExterior" className="text-right">
                        Número exterior
                      </Label>
                      <Input
                        id="numeroExterior"
                        name="numeroExterior"
                        className="col-span-3"
                        value={formulario.numeroExterior}
                        onChange={(e) =>
                          handleInputChange(e.target.value, e.target.name)
                        }
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="numeroInterior" className="text-right">
                        Número interior
                      </Label>
                      <Input
                        id="numeroInterior"
                        name="numeroInterior"
                        className="col-span-3"
                        value={formulario.numeroInterior}
                        onChange={(e) =>
                          handleInputChange(e.target.value, e.target.name)
                        }
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="nombreColonia" className="text-right">
                        Nombre de la colonia
                      </Label>
                      <Input
                        id="nombreColonia"
                        name="nombreColonia"
                        className="col-span-3"
                        value={formulario.nombreColonia}
                        onChange={(e) =>
                          handleInputChange(e.target.value, e.target.name)
                        }
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="nombreLocalidad" className="text-right">
                        Nombre de la localidad
                      </Label>
                      <Input
                        id="nombreLocalidad"
                        name="nombreLocalidad"
                        className="col-span-3"
                        value={formulario.nombreLocalidad}
                        onChange={(e) =>
                          handleInputChange(e.target.value, e.target.name)
                        }
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="nombreMunicipio" className="text-right">
                        Nombre del municipio
                      </Label>
                      <Input
                        id="nombreMunicipio"
                        name="nombreMunicipio"
                        className="col-span-3"
                        value={formulario.nombreMunicipio}
                        onChange={(e) =>
                          handleInputChange(e.target.value, e.target.name)
                        }
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="nombreEntidad" className="text-right">
                        Nombre de la entidad federativa
                      </Label>
                      <Input
                        id="nombreEntidad"
                        name="nombreEntidad"
                        className="col-span-3"
                        value={formulario.nombreEntidad}
                        onChange={(e) =>
                          handleInputChange(e.target.value, e.target.name)
                        }
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="entreCalle" className="text-right">
                        Entre calle
                      </Label>
                      <Input
                        id="entreCalle"
                        name="entreCalle"
                        className="col-span-3"
                        value={formulario.entreCalle}
                        onChange={(e) =>
                          handleInputChange(e.target.value, e.target.name)
                        }
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="yCalle" className="text-right">
                        Y calle
                      </Label>
                      <Input
                        id="yCalle"
                        name="yCalle"
                        className="col-span-3"
                        value={formulario.yCalle}
                        onChange={(e) =>
                          handleInputChange(e.target.value, e.target.name)
                        }
                      />
                    </div>
                  </>
                )}
              </div>
              <DialogFooter>
                <Button type="submit">Agregar empresa</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>RFC</TableHead>
            <TableHead>Denominación/Razón social</TableHead>
            <TableHead>Nombre comercial</TableHead>
            <TableHead>Fecha de inicio de operaciones</TableHead>
            <TableHead>Estatus en el padrón</TableHead>
            <TableHead>Fecho de último cambio de estado</TableHead>
            <TableHead>Código postal</TableHead>
            <TableHead>Nombre de vialidad</TableHead>
            <TableHead>Número exterior</TableHead>
            <TableHead>Número interior</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentUsers.length > 0 ? (
            currentUsers.map((user, index) => (
              <TableRow key={index}>
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.formulario.rfc || "Sin datos"}</TableCell>
                <TableCell>{user.formulario.razon || "Sin datos"}</TableCell>
                <TableCell>{user.formulario.nombre || "Sin datos"}</TableCell>
                <TableCell>
                  {user.formulario.fechaInicio
                    ? new Date(
                        new Date(user.formulario.fechaInicio).getTime() +
                          new Date().getTimezoneOffset() * 60000
                      ).toLocaleDateString("es-ES", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })
                    : "Sin datos"}
                </TableCell>
                <TableCell>{user.formulario.estatus || "Sin datos"}</TableCell>
                <TableCell>
                  {user.formulario.fechaCambio
                    ? new Date(
                        new Date(user.formulario.fechaCambio).getTime() +
                          new Date().getTimezoneOffset() * 60000
                      ).toLocaleDateString("es-ES", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })
                    : "Sin datos"}
                </TableCell>
                <TableCell>{user.formulario.codigo || "Sin datos"}</TableCell>
                <TableCell>
                  {user.formulario.nombreVialidad || "Sin datos"}
                </TableCell>
                <TableCell>
                  {user.formulario.numeroExterior || "Sin datos"}
                </TableCell>
                <TableCell>
                  {user.formulario.numeroInterior || "Sin datos"}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          onClick={() => handleEditUser(user.id)}
                          variant="outline"
                          size="sm"
                        >
                          Editar
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Editar empresa</DialogTitle>
                          <DialogDescription>
                            Actualiza los detalles necesarios de la empresa.
                          </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmitUpdate}>
                          <div className="grid gap-4 py-4">
                            {showIdentificacionForm && (
                              <>
                                <DialogHeader>
                                  <DialogTitle>
                                    Datos de Identificación del Contribuyente
                                  </DialogTitle>
                                </DialogHeader>
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label htmlFor="rfc" className="text-right">
                                    RFC
                                  </Label>
                                  <Input
                                    id="rfc"
                                    name="rfc"
                                    className="col-span-3"
                                    value={selectedUser?.formulario?.rfc || ""}
                                    onChange={(e) =>
                                      setSelectedUser({
                                        ...selectedUser,
                                        formulario: {
                                          ...selectedUser.formulario,
                                          rfc: e.target.value,
                                        },
                                      })
                                    }
                                  />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label htmlFor="razon" className="text-right">
                                    Razón social
                                  </Label>
                                  <Input
                                    id="razon"
                                    name="razon"
                                    className="col-span-3"
                                    value={
                                      selectedUser?.formulario?.razon || ""
                                    }
                                    onChange={(e) =>
                                      setSelectedUser({
                                        ...selectedUser,
                                        formulario: {
                                          ...selectedUser.formulario,
                                          razon: e.target.value,
                                        },
                                      })
                                    }
                                  />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label
                                    htmlFor="regimen"
                                    className="text-right"
                                  >
                                    Régimen capital
                                  </Label>
                                  <Input
                                    id="regimen"
                                    name="regimen"
                                    className="col-span-3"
                                    value={
                                      selectedUser?.formulario?.regimen || ""
                                    }
                                    onChange={(e) =>
                                      setSelectedUser({
                                        ...selectedUser,
                                        formulario: {
                                          ...selectedUser.formulario,
                                          regimen: e.target.value,
                                        },
                                      })
                                    }
                                  />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label
                                    htmlFor="nombre"
                                    className="text-right"
                                  >
                                    Nombre comercial
                                  </Label>
                                  <Input
                                    id="nombre"
                                    name="nombre"
                                    className="col-span-3"
                                    value={
                                      selectedUser?.formulario?.nombre || ""
                                    }
                                    onChange={(e) =>
                                      setSelectedUser({
                                        ...selectedUser,
                                        formulario: {
                                          ...selectedUser.formulario,
                                          nombre: e.target.value,
                                        },
                                      })
                                    }
                                  />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label
                                    htmlFor="fechaInicio"
                                    className="text-right"
                                  >
                                    Fecha inicio de operaciones
                                  </Label>
                                  <Input
                                    id="fechaInicio"
                                    name="fechaInicio"
                                    type="date"
                                    className="col-span-3"
                                    value={
                                      selectedUser?.formulario?.fechaInicio ||
                                      ""
                                    }
                                    onChange={(e) =>
                                      setSelectedUser({
                                        ...selectedUser,
                                        formulario: {
                                          ...selectedUser.formulario,
                                          fechaInicio: e.target.value,
                                        },
                                      })
                                    }
                                  />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label
                                    htmlFor="estatus"
                                    className="text-right"
                                  >
                                    Estatus en el padrón
                                  </Label>
                                  <Select
                                    name="estatus"
                                    value={
                                      selectedUser?.formulario?.estatus || ""
                                    }
                                    onValueChange={(value) => {
                                      setSelectedUser((prev) => ({
                                        ...prev,
                                        formulario: {
                                          ...prev.formulario,
                                          estatus: value,
                                        },
                                      }));
                                    }}
                                  >
                                    <SelectTrigger className="col-span-3">
                                      <SelectValue placeholder="Seleccione una opción" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="ACTIVO">
                                        Activo
                                      </SelectItem>
                                      <SelectItem value="INACTIVO">
                                        Inactivo
                                      </SelectItem>
                                    </SelectContent>
                                  </Select>
                                  {/*<Input id="estatus" className="col-span-3" required value={estatus} onChange={(e) => setEstatus(e.target.value)} />*/}
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label
                                    htmlFor="fechaCambio"
                                    className="text-right"
                                  >
                                    Fecha de último cambio de estado
                                  </Label>
                                  <Input
                                    id="fechaCambio"
                                    name="fechaCambio"
                                    type="date"
                                    className="col-span-3"
                                    value={
                                      selectedUser?.formulario?.fechaCambio ||
                                      ""
                                    }
                                    onChange={(e) =>
                                      setSelectedUser({
                                        ...selectedUser,
                                        formulario: {
                                          ...selectedUser.formulario,
                                          fechaCambio: e.target.value,
                                        },
                                      })
                                    }
                                  />
                                </div>
                              </>
                            )}

                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="domicilio" className="text-right">
                                ¿Agregar domicilio?
                              </Label>
                              <Select
                                value={domicilio}
                                onValueChange={(value) => {
                                  setDomicilio(value);
                                  setShowDomicilioForm(value === "si"); // Reiniciar el jefe directo
                                  setShowIdentificacionForm(value === "no"); // Reiniciar el jefe directo
                                }}
                              >
                                <SelectTrigger className="col-span-3">
                                  <SelectValue placeholder="Seleccione una opción" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="si">Sí</SelectItem>
                                  <SelectItem value="no">No</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            {showDomicilioForm && (
                              <>
                                <DialogHeader>
                                  <DialogTitle>
                                    Datos del domicilio registrado
                                  </DialogTitle>
                                </DialogHeader>
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label
                                    htmlFor="codigo"
                                    className="text-right"
                                  >
                                    Código postal
                                  </Label>
                                  <Input
                                    id="codigo"
                                    name="codigo"
                                    type="number"
                                    className="col-span-3"
                                    value={
                                      selectedUser?.formulario?.codigo || ""
                                    }
                                    onChange={(e) =>
                                      setSelectedUser({
                                        ...selectedUser,
                                        formulario: {
                                          ...selectedUser.formulario,
                                          codigo: e.target.value,
                                        },
                                      })
                                    }
                                  />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label
                                    htmlFor="tipoVialidad"
                                    className="text-right"
                                  >
                                    Tipo de vialidad
                                  </Label>
                                  <Input
                                    id="tipoVialidad"
                                    name="tipoVialidad"
                                    className="col-span-3"
                                    value={
                                      selectedUser?.formulario?.tipoVialidad ||
                                      ""
                                    }
                                    onChange={(e) =>
                                      setSelectedUser({
                                        ...selectedUser,
                                        formulario: {
                                          ...selectedUser.formulario,
                                          tipoVialidad: e.target.value,
                                        },
                                      })
                                    }
                                  />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label
                                    htmlFor="nombreVialidad"
                                    className="text-right"
                                  >
                                    Nombre de vialidad
                                  </Label>
                                  <Input
                                    id="nombreVialidad"
                                    name="nombreVialidad"
                                    className="col-span-3"
                                    value={
                                      selectedUser?.formulario
                                        ?.nombreVialidad || ""
                                    }
                                    onChange={(e) =>
                                      setSelectedUser({
                                        ...selectedUser,
                                        formulario: {
                                          ...selectedUser.formulario,
                                          nombreVialidad: e.target.value,
                                        },
                                      })
                                    }
                                  />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label
                                    htmlFor="numeroExterior"
                                    className="text-right"
                                  >
                                    Número exterior
                                  </Label>
                                  <Input
                                    id="numeroExterior"
                                    name="numeroExterior"
                                    className="col-span-3"
                                    value={
                                      selectedUser?.formulario
                                        ?.numeroExterior || ""
                                    }
                                    onChange={(e) =>
                                      setSelectedUser({
                                        ...selectedUser,
                                        formulario: {
                                          ...selectedUser.formulario,
                                          numeroExterior: e.target.value,
                                        },
                                      })
                                    }
                                  />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label
                                    htmlFor="numeroInterior"
                                    className="text-right"
                                  >
                                    Número interior
                                  </Label>
                                  <Input
                                    id="numeroInterior"
                                    name="numeroInterior"
                                    className="col-span-3"
                                    value={
                                      selectedUser?.formulario
                                        ?.numeroInterior || ""
                                    }
                                    onChange={(e) =>
                                      setSelectedUser({
                                        ...selectedUser,
                                        formulario: {
                                          ...selectedUser.formulario,
                                          numeroInterior: e.target.value,
                                        },
                                      })
                                    }
                                  />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label
                                    htmlFor="nombreColonia"
                                    className="text-right"
                                  >
                                    Nombre de la colonia
                                  </Label>
                                  <Input
                                    id="nombreColonia"
                                    name="nombreColonia"
                                    className="col-span-3"
                                    value={
                                      selectedUser?.formulario?.nombreColonia ||
                                      ""
                                    }
                                    onChange={(e) =>
                                      setSelectedUser({
                                        ...selectedUser,
                                        formulario: {
                                          ...selectedUser.formulario,
                                          nombreColonia: e.target.value,
                                        },
                                      })
                                    }
                                  />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label
                                    htmlFor="nombreLocalidad"
                                    className="text-right"
                                  >
                                    Nombre de la localidad
                                  </Label>
                                  <Input
                                    id="nombreLocalidad"
                                    name="nombreLocalidad"
                                    className="col-span-3"
                                    value={
                                      selectedUser?.formulario
                                        ?.nombreLocalidad || ""
                                    }
                                    onChange={(e) =>
                                      setSelectedUser({
                                        ...selectedUser,
                                        formulario: {
                                          ...selectedUser.formulario,
                                          nombreLocalidad: e.target.value,
                                        },
                                      })
                                    }
                                  />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label
                                    htmlFor="nombreMunicipio"
                                    className="text-right"
                                  >
                                    Nombre del municipio
                                  </Label>
                                  <Input
                                    id="nombreMunicipio"
                                    name="nombreMunicipio"
                                    className="col-span-3"
                                    value={
                                      selectedUser?.formulario
                                        ?.nombreMunicipio || ""
                                    }
                                    onChange={(e) =>
                                      setSelectedUser({
                                        ...selectedUser,
                                        formulario: {
                                          ...selectedUser.formulario,
                                          nombreMunicipio: e.target.value,
                                        },
                                      })
                                    }
                                  />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label
                                    htmlFor="nombreEntidad"
                                    className="text-right"
                                  >
                                    Nombre de la entidad federativa
                                  </Label>
                                  <Input
                                    id="nombreEntidad"
                                    name="nombreEntidad"
                                    className="col-span-3"
                                    value={
                                      selectedUser?.formulario?.nombreEntidad ||
                                      ""
                                    }
                                    onChange={(e) =>
                                      setSelectedUser({
                                        ...selectedUser,
                                        formulario: {
                                          ...selectedUser.formulario,
                                          nombreEntidad: e.target.value,
                                        },
                                      })
                                    }
                                  />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label
                                    htmlFor="entreCalle"
                                    className="text-right"
                                  >
                                    Entre calle
                                  </Label>
                                  <Input
                                    id="entreCalle"
                                    name="entreCalle"
                                    className="col-span-3"
                                    value={
                                      selectedUser?.formulario?.entreCalle || ""
                                    }
                                    onChange={(e) =>
                                      setSelectedUser({
                                        ...selectedUser,
                                        formulario: {
                                          ...selectedUser.formulario,
                                          entreCalle: e.target.value,
                                        },
                                      })
                                    }
                                  />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label
                                    htmlFor="yCalle"
                                    className="text-right"
                                  >
                                    Y calle
                                  </Label>
                                  <Input
                                    id="yCalle"
                                    name="yCalle"
                                    className="col-span-3"
                                    value={
                                      selectedUser?.formulario?.yCalle || ""
                                    }
                                    onChange={(e) =>
                                      setSelectedUser({
                                        ...selectedUser,
                                        formulario: {
                                          ...selectedUser.formulario,
                                          yCalle: e.target.value,
                                        },
                                      })
                                    }
                                  />
                                </div>
                              </>
                            )}
                          </div>
                          <DialogFooter>
                            <Button type="submit">Actualizar empresa</Button>
                          </DialogFooter>
                        </form>
                      </DialogContent>
                    </Dialog>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(user.id)}
                    >
                      Eliminar
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={12} className="text-center">
                No se encontraron empresas
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <Dialog
        open={isFormSectionsDialogOpen}
        onOpenChange={setIsFormSectionsDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedPermission}</DialogTitle>
            <DialogDescription>
              Elige la sección del formulario para editar.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex flex-wrap gap-2 mb-4">
              {selectedSections.map((sectionId) => {
                const section = formSections.find((s) => s.id === sectionId);
                return (
                  <span
                    key={sectionId}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary text-primary-foreground"
                  >
                    {section?.name}
                    <button
                      type="button"
                      onClick={() => removeSection(sectionId)}
                      className="flex-shrink-0 ml-1 h-4 w-4 rounded-full inline-flex items-center justify-center text-primary-foreground hover:bg-primary-foreground hover:text-primary focus:outline-none focus:bg-primary-foreground focus:text-primary"
                    >
                      <span className="sr-only">
                        quitar {section?.name} opción
                      </span>
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                );
              })}
            </div>
            {formSections.map((section) => (
              <div key={section.id} className="flex items-center space-x-2">
                <Checkbox
                  id={section.id}
                  checked={selectedSections.includes(section.id)}
                  onCheckedChange={() => handleSectionSelection(section.id)}
                />
                <Label htmlFor={section.id}>{section.name}</Label>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button onClick={openChangeOptionsDialog}>Siguiente</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={isChangeOptionsDialogOpen}
        onOpenChange={setIsChangeOptionsDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Selecciona las opciones</DialogTitle>
            <DialogDescription>
              Estas opciones estarán disponibles para editar.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            {selectedSections.map((sectionId) => {
              const section = formSections.find((s) => s.id === sectionId);
              return (
                <div key={sectionId}>
                  <h3 className="font-semibold mb-2">{section?.name}</h3>
                  <div className="grid gap-2">
                    {section?.changeOptions.map((option) => (
                      <div key={option} className="flex items-center space-x-2">
                        <Checkbox
                          id={`${sectionId}-${option}`}
                          checked={selectedChanges[sectionId]?.includes(option)}
                          onCheckedChange={() =>
                            handleChangeOptionSelection(sectionId, option)
                          }
                        />
                        <Label htmlFor={`${sectionId}-${option}`}>
                          {option}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
          <DialogFooter>
            <Button onClick={saveSelections}>Guardar valores</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
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

function Spinner() {
  return <div className="spinner" />;
}

function EmpresasIcon(props) {
  return (
    <svg
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
      <rect x="3" y="3" width="7" height="18" rx="1" ry="1"></rect>
      <rect x="14" y="7" width="7" height="14" rx="1" ry="1"></rect>
      <path d="M10 22v-2a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v2"></path>
      <line x1="6" y1="8" x2="8" y2="8"></line>
      <line x1="6" y1="12" x2="8" y2="12"></line>
      <line x1="6" y1="16" x2="8" y2="16"></line>
      <line x1="17" y1="10" x2="19" y2="10"></line>
      <line x1="17" y1="14" x2="19" y2="14"></line>
      <line x1="17" y1="18" x2="19" y2="18"></line>
    </svg>
  );
}

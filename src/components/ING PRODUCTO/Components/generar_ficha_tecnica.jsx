"use client"

import { useState, useEffect } from "react";
import styles from '../../../../public/CSS/spinner.css';
import { useSession } from "next-auth/react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Swal from 'sweetalert2';
import { Button } from "@/components/ui/button";
import { CornerDownLeft } from 'lucide-react';
import Link from "next/link";
import { useSearchParams } from 'next/navigation';
import axios from 'axios';
import { getSession } from 'next-auth/react';
import { Textarea } from "@/components/ui/textarea";
import { pdf } from "@react-pdf/renderer";
import FichaTecnicaPDF from "./ficha_tecnica";

export function FichaTecnica() {
  const {data: session, status} = useSession();
  const searchParams = useSearchParams();
  const idProductoValidar = searchParams.get('id');
  const [productoAValidar, setProductoAValidar] = useState(null);
  const [idUser, setID] = useState("");
  const [imagenes, setImagenes] = useState([]);
  const [tipoProducto, setTipoProducto] = useState("");

  const imagenesBolsas = ["/public/imagenesValidaciones/dibujo bolsa 1.jpg", "/public/imagenesValidaciones/dibujo bolsa 2.jpg"];
  const imagenesPastilleros = ["/public/imagenesValidaciones/dibujo envase 1.jpg", "/public/imagenesValidaciones/dibujo envase 3.jpg", "/public/imagenesValidaciones/dibujo envase 2.jpg"];

  useEffect(() => {
    switch (tipoProducto.toString()) {
        case "1":
            setImagenes(imagenesPastilleros);
            break;
        case "2":
          setImagenes(imagenesBolsas);
          break;
        case "3":
            setImagenes([]);
            break;
        default:
          break;
      }
  }, [tipoProducto]);

  useEffect(() => {
    const fetchProductoAValidar = async () => {
        if (!idProductoValidar) {
            console.error('ID de producto no proporcionado');
            return;
        }

        try {
            const response = await axios.post(`/api/ProductEngineering/getProductoValidar?id=${idProductoValidar}`);
            if (response.data.success) {
                const producto = response.data.producto;
                const registros = producto.identificadores.map((identificador) => {
                    const existente = producto.identificadoresProductos.find(
                      (p) => p.identificador_id === identificador.id
                    );
              
                    return {
                      identificador_id: identificador.id,
                      registroN: existente?.registroN ?? '',
                      registroV: existente?.registroV ?? '',
                      tolerancia: existente?.tolerancia ?? '',
                    };
                  });
              
                  setProductoAValidar({
                    producto: producto.producto,
                    identificadores: producto.identificadores,
                    identificadoresProductos: registros,
                  });

                setTipoProducto(producto.producto.tipo);
            } else {
                console.error('Error al obtener el producto a validar:', response.data.message);
            }
        } catch (error) {
            console.error('Error al hacer fetch del producto a validar:', error);
        }
    };

    fetchProductoAValidar();
  }, [idProductoValidar]);

  console.log(productoAValidar);

  useEffect(() => {
      const fetchUserData = async () => {
        const session = await getSession();
        if (session) {
          const response = await fetch("/api/Users/getUser", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ correo: session.user.email, numero_empleado: session.user.numero_empleado }),
          });
          const userData = await response.json();
          if (userData.success) {
            setID(userData.user.id);
          } else {
            alert("Error al obtener los datos del usuario");
          }
        }
      };
      fetchUserData();
    }, []);

    const handleAbrirPDF = async () => {
        // Mostrar alerta de carga
        Swal.fire({
          title: 'Generando...',
          text: 'Estamos procesando el archivo, por favor espere...',
          showConfirmButton: false,
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });
      
        try {
          const blob = await pdf(<FichaTecnicaPDF producto={productoAValidar} />).toBlob();
          const url = URL.createObjectURL(blob);
          window.open(url, "_blank");
      
          Swal.close(); // solo cerrar cuando termine
        } catch (error) {
          console.error("Error al generar PDF:", error);
          Swal.fire({
            icon: "error",
            title: "Error...",
            text: "Hubo un error al generar el PDF.",
          });
        }
    };      

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

  const handleSubmit = async (e) => {
    e.preventDefault();
  };

  return (
    <div className="container mx-auto p-6">
        <div>
            <Link href="/configuraciones/cmd/Productos"><Button><CornerDownLeft className="h-4 w-4" />Regresar</Button></Link>
        </div>
        <div className="flex justify-center items-center text-center mb-8">
            <CardTitle className="text-3xl font-bold">Generar Ficha Técnica</CardTitle>
        </div>
        <div className="flex justify-center mb-4">
            <form 
                onSubmit={handleSubmit} 
                className="w-[1400px] border border-gray-300 rounded-lg shadow-md p-6 bg-white"
            >
                <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="space-y-2">
                    <Label htmlFor="nombre">Nombre</Label>
                    <Input style={{borderColor: "black", borderWidth: "2px", backgroundColor: "#f7f7f7"}} id="nombre" name="nombre" type="text" value={productoAValidar?.producto.nombre || ''} onChange={(e) => setProductoAValidar({...productoAValidar, producto: {...productoAValidar?.producto, nombre: e.target.value},})} placeholder="Nombre del producto" readOnly={true} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="no_articulo">No. de artículo (Código Odoo)</Label>
                    <Input style={{borderColor: "black", borderWidth: "2px", backgroundColor: "#f7f7f7"}} id="no_articulo" name="no_articulo" type="text" value={productoAValidar?.producto.codigo || ''} onChange={(e) => setProductoAValidar({...productoAValidar, producto: {...productoAValidar?.producto, codigo: e.target.value},})} placeholder="Código Odoo" readOnly={true} />
                </div>
                </div>

                <div style={{backgroundColor: "lightgreen"}} className="grid grid-cols-2 gap-4 mb-6">
                    <div className="space-y-2 col-span-2 text-center">
                        <Label style={{fontSize: "20px"}}>Pruebas de identificación</Label>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                {/* Columna izquierda: otras mediciones diferentes de mm */}
                <div className="space-y-2">
                <div className="space-y-2 text-center">
                    <Label style={{ fontSize: "18px" }}>Otras mediciones</Label>
                </div>

                {productoAValidar?.identificadores?.filter((i) => i.medicion !== "MM.").length === 0 ? (
                    <p style={{ marginTop: "45px" }} className="text-center text-gray-500">
                    No hay identificadores con otras mediciones.
                    </p>
                ) : (
                    productoAValidar?.identificadores
                    .filter((identificador) => identificador.medicion !== "MM.")
                    .map((identificador, index) => (
                        <div key={identificador.id} className="flex gap-4 items-start">
                        {/* Columna izquierda: identificador */}
                        <div className="flex flex-col flex-1 gap-y-1.5">
                            <Label htmlFor={identificador.nombre} className="mb-1">{identificador.nombre}</Label>
                            <Input
                            id={identificador.nombre}
                            name={identificador.nombre}
                            type={identificador.calculable === 1 ? "number" : "text"}
                            step={identificador.calculable === 1 ? "0.01" : undefined}
                            readOnly={true}
                            value={
                                productoAValidar.identificadoresProductos.find(i => i.identificador_id === identificador.id)?.[
                                identificador.calculable === 1 ? 'registroN' : 'registroV'
                                ] || ''
                            }
                            onChange={(e) => {
                                const value = e.target.value;
                                if (identificador.calculable === 1) {
                                if (value === '' || /^\d*\.?\d{0,2}$/.test(value)) {
                                    const nuevosIdentificadores = productoAValidar.identificadoresProductos.map((item) => {
                                    if (item.identificador_id === identificador.id) {
                                        return {
                                        ...item,
                                        registroN: value,
                                        };
                                    }
                                    return item;
                                    });
                                    setProductoAValidar({
                                    ...productoAValidar,
                                    identificadoresProductos: nuevosIdentificadores,
                                    });
                                }
                                } else {
                                const nuevosIdentificadores = productoAValidar.identificadoresProductos.map((item) => {
                                    if (item.identificador_id === identificador.id) {
                                    return {
                                        ...item,
                                        registroV: value,
                                    };
                                    }
                                    return item;
                                });
                                setProductoAValidar({
                                    ...productoAValidar,
                                    identificadoresProductos: nuevosIdentificadores,
                                });
                                }
                            }}
                            placeholder={`Valor de ${identificador.nombre.toLowerCase()}`}
                            />
                        </div>

                        {/* Columna derecha: tolerancia */}
                        <div className="flex flex-col w-40 gap-y-1.5">
                            {index === 0 ? (
                            <Label htmlFor={`${identificador.nombre}-tolerancia`} className="mb-1">Tolerancia %</Label>
                            ) : (
                            <div className="h-[18px]" /> // Espaciador visual igual al alto del label anterior
                            )}
                            <Input
                            id={`${identificador.nombre}-tolerancia`}
                            name={`${identificador.nombre}-tolerancia`}
                            type="number"
                            value={
                                productoAValidar.identificadoresProductos.find(i => i.identificador_id === identificador.id)?.tolerancia || ''
                            }
                            onChange={(e) => {
                                const value = e.target.value;
                                const nuevosIdentificadores = productoAValidar.identificadoresProductos.map((item) => {
                                if (item.identificador_id === identificador.id) {
                                    return {
                                    ...item,
                                    tolerancia: value,
                                    };
                                }
                                return item;
                                });

                                setProductoAValidar({
                                ...productoAValidar,
                                identificadoresProductos: nuevosIdentificadores,
                                });
                            }}
                            placeholder="± Tolerancia"
                            />
                        </div>
                        </div>
                    ))
                )}
                </div>

                {/* Columna derecha: solo mediciones en mm */}
                <div className="space-y-2">
                <div className="space-y-2 text-center">
                    <Label style={{ fontSize: "18px" }}>Medidas en mm</Label>
                </div>

                {productoAValidar?.identificadores?.filter((i) => i.medicion === "MM.").length === 0 ? (
                    <p style={{ marginTop: "45px" }} className="text-center text-gray-500">
                    No hay identificadores con medición en mm.
                    </p>
                ) : (
                    productoAValidar?.identificadores
                    .filter((identificador) => identificador.medicion === "MM.")
                    .map((identificador, index) => (
                        <div key={identificador.id} className="flex gap-4 items-start">
                        {/* Columna izquierda: identificador */}
                        <div className="flex flex-col flex-1 gap-y-1.5">
                            <Label htmlFor={identificador.nombre} className="mb-1">{identificador.nombre}</Label>
                            <Input
                            id={identificador.nombre}
                            name={identificador.nombre}
                            type={identificador.calculable === 1 ? "number" : "text"}
                            step={identificador.calculable === 1 ? "0.01" : undefined}
                            readOnly={true}
                            value={
                                productoAValidar.identificadoresProductos.find(i => i.identificador_id === identificador.id)?.[
                                identificador.calculable === 1 ? 'registroN' : 'registroV'
                                ] || ''
                            }
                            onChange={(e) => {
                                const value = e.target.value;
                                if (identificador.calculable === 1) {
                                if (value === '' || /^\d*\.?\d{0,2}$/.test(value)) {
                                    const nuevosIdentificadores = productoAValidar.identificadoresProductos.map((item) => {
                                    if (item.identificador_id === identificador.id) {
                                        return {
                                        ...item,
                                        registroN: value,
                                        };
                                    }
                                    return item;
                                    });
                                    setProductoAValidar({
                                    ...productoAValidar,
                                    identificadoresProductos: nuevosIdentificadores,
                                    });
                                }
                                } else {
                                const nuevosIdentificadores = productoAValidar.identificadoresProductos.map((item) => {
                                    if (item.identificador_id === identificador.id) {
                                    return {
                                        ...item,
                                        registroV: value,
                                    };
                                    }
                                    return item;
                                });
                                setProductoAValidar({
                                    ...productoAValidar,
                                    identificadoresProductos: nuevosIdentificadores,
                                });
                                }
                            }}
                            placeholder={`Valor de ${identificador.nombre.toLowerCase()}`}
                            />
                        </div>

                        {/* Columna derecha: tolerancia */}
                        <div className="flex flex-col w-40 gap-y-1.5">
                            {index === 0 ? (
                            <Label htmlFor={`${identificador.nombre}-tolerancia`} className="mb-1">Tolerancia %</Label>
                            ) : (
                            <div className="h-[18px]" /> // Espaciador visual igual al alto del label anterior
                            )}
                            <Input
                            id={`${identificador.nombre}-tolerancia`}
                            name={`${identificador.nombre}-tolerancia`}
                            type="number"
                            value={
                                productoAValidar.identificadoresProductos.find(i => i.identificador_id === identificador.id)?.tolerancia || ''
                            }
                            onChange={(e) => {
                                const value = e.target.value;
                                const nuevosIdentificadores = productoAValidar.identificadoresProductos.map((item) => {
                                if (item.identificador_id === identificador.id) {
                                    return {
                                    ...item,
                                    tolerancia: value,
                                    };
                                }
                                return item;
                                });

                                setProductoAValidar({
                                ...productoAValidar,
                                identificadoresProductos: nuevosIdentificadores,
                                });
                            }}
                            placeholder="± Tolerancia"
                            />
                        </div>
                        </div>
                    ))
                )}
                </div>
                </div>

                <div style={{backgroundColor: "lightgreen"}} className="grid grid-cols-2 gap-4 mb-6 mt-6">
                    <div className="space-y-2 col-span-2 text-center">
                        <Label style={{fontSize: "20px"}}>Información adicional</Label>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="space-y-2 col-span-2">
                    <Label htmlFor="condiciones">Condiciones de almacenamiento</Label>
                    <Textarea id="condiciones" name="condiciones" value={productoAValidar?.condiciones || ''} onChange={(e) => setProductoAValidar({...productoAValidar, condiciones: e.target.value})} placeholder="..." />
                </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="space-y-2 col-span-2">
                    <Label htmlFor="distribucion">Distribución</Label>
                    <Textarea id="distribucion" name="distribucion" value={productoAValidar?.distribucion || ''} onChange={(e) => setProductoAValidar({...productoAValidar, distribucion: e.target.value})} placeholder="..." />
                </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="space-y-2 col-span-2">
                    <Label htmlFor="consideracion">Consideración sobre la disposición</Label>
                    <Textarea id="consideracion" name="consideracion" value={productoAValidar?.consideracion || ''} onChange={(e) => setProductoAValidar({...productoAValidar, consideracion: e.target.value})} placeholder="..." />
                </div>
                </div>
                <Button onClick={handleAbrirPDF}>
                Generar PDF
                </Button>
            </form>
        </div>
    </div>
  )
}

function Spinner() {
  return (
    <div className="spinner" />
  );
}
"use client";
import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import { EditarProspecto } from "@/components/Ventas/Components/editar_prospecto";

export default function Page() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [isProspectoActive, setIsProspectoActive] = useState(false);
  const [isReferenciaActive, setIsReferenciaActive] = useState(false);
  const [isProductoActive, setIsProductoActive] = useState(false);
  const [levantamiento, setLevantamiento] = useState({});
  const red = "#0565ed";
  useEffect(() => {
    const fetchLevantamiento = async () => {
      await axios
        .get(`/api/Sales/getLevantamiento?id=${id}`)
        .then((res) => {
          setLevantamiento(res.data.levantamiento);
        })
        .catch((error) => {
          console.error("Error al obtener el levantamiento:", error);
        });
    };
    fetchLevantamiento();
  }, []);

  const handleUpdateProspecto = () => {
    setIsProspectoActive(false);
  };

  return (
    <>
      <div className="mb-4 h-full">
        <div className="w-border border-gray-300 rounded-lg shadow-md p-6 bg-white">
          <div className="flex justify-center items-center text-center mb-8">
            <h1 className="text-3xl font-bold">Detalles del Levantamiento</h1>
          </div>
          <div className="py-4">
            <div
              style={{ border: "3px solid rgb(31 41 55)" }}
              className="rounded-lg p-2"
            >
              <div
                className="text-center"
                onClick={() => setIsProspectoActive(!isProspectoActive)}
              >
                <label style={{ fontSize: "20px", color: "black" }}>
                  Datos del cliente
                </label>
              </div>
            </div>
            {isProspectoActive && (
              <EditarProspecto
                id={levantamiento.id_prospecto}
                EmitUpdate={handleUpdateProspecto}
              />
            )}
          </div>

          <div className="py-4">
            <div
              style={{ border: "3px solid rgb(31 41 55)" }}
              className="rounded-lg p-2"
            >
              <div
                className="text-center"
                onClick={() => setIsReferenciaActive(!isReferenciaActive)}
              >
                <label style={{ fontSize: "20px", color: "black" }}>
                  Referencia
                </label>
              </div>
            </div>
            {isReferenciaActive && <div>Referencia</div>}
          </div>

          <div className="py-4">
            <div
              style={{
                border: `3px solid ${red}`,
                fontSize: "20px",
                color: `${red}`,
              }}
              className="rounded-lg p-2 text-center"
            >
              <div onClick={() => setIsProductoActive(!isProductoActive)}>
                <label
                  htmlFor="producto"
                  className={"font-bold hover:cursor-pointer"}
                >
                  producto
                </label>
              </div>
            </div>
            {isProductoActive && (
              <div style={{ fontSize: "20px", color: `${red}` }}>Producto</div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

"use client";
import { Button } from "@/components/ui/button";
import { EditarProspecto as E } from "@/components/Ventas/Components/editar_prospecto";
import { CornerDownLeft } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
function EditarProspecto() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const handleUpdate = () => {
    window.location.href = "/ventas/prospectos";
  };
  return (
    <Suspense>
      <Link href="/ventas/prospectos">
        <Button>
          <CornerDownLeft className="h-4 w-4" />
          Regresar
        </Button>
      </Link>
      <div>
        <E id={id} EmitUpdate={handleUpdate} />
      </div>
    </Suspense>
  );
}

export default EditarProspecto;

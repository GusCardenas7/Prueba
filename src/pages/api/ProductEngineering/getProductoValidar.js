import Producto from "@/models/Productos";
import Identificador from "@/models/Identificadores";
import IdentificadorProducto from "@/models/IdentificadoresProductos";
import IdentificadorTipoProducto from "@/models/IdentificadoresTiposProductos";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Método no permitido" });
  }

  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ success: false, message: "El ID es requerido" });
  }

  try {
    const producto = await Producto.findOne({
      where: { id },
    });

    const identificadorTipoProducto = await IdentificadorTipoProducto.findAll({
      where: { tipo_id: producto.Tipo_id },
      include: [
        {
          model: Identificador,
          attributes: ["id", "nombre", "medicion", "calculable"],
        },
      ],
    });

    const identificadorProducto = await IdentificadorProducto.findAll({
      where: { producto_id: id },
    });

    if (!identificadorTipoProducto || identificadorTipoProducto.length === 0) {
      return res.status(404).json({ success: false, message: "Producto no encontrado" });
    }

    const result = {
      identificadoresProductos: identificadorProducto.map((item) => ({
        id: item?.id || null,
        identificador_id: item?.identificador_id || null,
        producto_id: item?.producto_id || null,
        tolerancia: item?.tolerado || null,
        registroV: item?.registroV || null,
        registroN: item?.registroN || null,
      })),
      producto: {
        id: producto?.id || null,
        nombre: producto?.nombre || null,
        codigo: producto?.codigo || null,
        veredicto: producto?.veredicto,
        tipo: producto?.Tipo_id || null,
        descripcion: producto?.descripcion || null,
        creado_por: producto?.creado_por || null,
        validado_por: producto?.validado_por || null,
        tolerancias_por: producto?.tolerancias_por || null,
      },
      identificadores: identificadorTipoProducto.map((item) => ({
        id: item.Identificador?.id || null,
        nombre: item.Identificador?.nombre || null,
        medicion: item.Identificador?.medicion || null,
        calculable: item.Identificador?.calculable || null,
      })),
    };

    return res.status(200).json({ success: true, producto: result });

  } catch (error) {
    console.error("Error en el servidor:", error);
    return res.status(500).json({ success: false, message: "Error interno del servidor" });
  }
}
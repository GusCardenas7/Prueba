import fs from "fs";
import { Client } from "basic-ftp";
import path from "path";
import formidable from "formidable";
import Producto from "@/models/Productos";
import ImagenProducto from "@/models/ImagenesProductos";

// Configuración para evitar que Next.js maneje el bodyParser automáticamente
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Método no permitido" });
  }

  const form = new formidable.IncomingForm({
    multiples: true,
    uploadDir: "/tmp",
    keepExtensions: true,
  });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("Error procesando el formulario:", err);
      return res.status(500).json({ message: "Error al procesar el formulario" });
    }

    console.log('Archivos recibidos:', files); // Verificar los archivos

    if (!files.imagenes) {
      return res.status(400).json({ message: "No se recibieron imágenes" });
    }

    // En caso de que los archivos sean un array o un solo archivo
    const imagenes = Array.isArray(files.imagenes) ? files.imagenes : [files.imagenes];

    try {
      // Insertar el producto en la base de datos utilizando Sequelize
      const producto = await Producto.create({
        nombre: fields.nombre,
        proveedor_id: fields.proveedor,
        Tipo_id: fields.categoriaGeneral,
        Categoria_id: fields.subcategoria,
        Subcategoria_id: fields.especificacion || null,
        medicion: fields.medicion,
        codigo: fields.codigo,
        costo: fields.costo,
        cMinima: fields.compraMinima,
        descripcion: fields.descripcion,
      });

      // Conectar al servidor FTP
      const client = new Client();
      client.ftp.verbose = true;
      await client.access({
        host: "50.6.199.166",
        user: "aionnet",
        password: "Rrio1003",
        secure: false,
      });

      const uploadedImages = [];

      // Subir cada imagen al servidor FTP
      for (const file of imagenes) {
        // Verifica si la ruta del archivo existe
        console.log("Subiendo archivo:", file.path); 

        // Ruta donde se subirá el archivo en el servidor FTP
        const filePath = `/uploads/imagenesProductos/${file.name}`;

        // Subir el archivo al servidor FTP
        try {
          await client.uploadFrom(file.path, filePath);
          console.log(`Archivo subido con éxito a: ${filePath}`);
        } catch (uploadErr) {
          console.error(`Error subiendo el archivo ${file.name}:`, uploadErr);
          return res.status(500).json({ message: "Error al subir el archivo al FTP" });
        }

        uploadedImages.push({ ruta: filePath, producto_id: producto.id });

        // Eliminar el archivo temporal después de subirlo
        try {
          fs.unlinkSync(file.path);
        } catch (unlinkErr) {
          console.error("Error al eliminar el archivo temporal:", unlinkErr);
        }
      }

      client.close();

      // Guardar las rutas de las imágenes en la base de datos utilizando Sequelize
      const imgProductos = uploadedImages.map(img => ({
        ruta: img.ruta,
        producto_id: img.producto_id
      }));

      // Inserta las imágenes asociadas al producto
      await ImagenProducto.bulkCreate(imgProductos);

      res.status(201).json({ success: true, message: "Producto e imágenes guardadas correctamente" });
    } catch (error) {
      console.error("Error registrando el producto:", error);
      res.status(500).json({ message: "Error en el servidor" });
    }
  });
}
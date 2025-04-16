import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

// Estilos
const styles = StyleSheet.create({
    page: {
    paddingTop: 150, // deja espacio para el encabezado
    paddingHorizontal: 30,
    paddingBottom: 30,
    fontSize: 10,
    fontFamily: "Helvetica",
    },
    header: {
    marginBottom: 10,
    position: "absolute",
    top: 30,
    left: 30,
    right: 30,
    },
  heading: {
    fontSize: 12,
    marginBottom: 5,
  },
  table: {
    display: "table",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    marginBottom: 20,
  },
  tableRow: {
    flexDirection: "row",
  },
  tableCell: {
    borderWidth: 1,
    padding: 5,
    flex: 1,
    textAlign: "center",
  },
  headerText: {
    fontSize: 12,
    fontWeight: "bold",
  },
  logo: {
    width: 50,
    height: 50,
  },
  tableColHeader: {
    width: '40%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#000',
    padding: 5,
    fontWeight: 'bold',
    fontSize: 10,
    textAlign: 'left',
  },
  tableCol: {
    width: '60%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#000',
    padding: 5,
    fontSize: 10,
    textAlign: 'left',
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    marginVertical: 2,
  },  
});

const Encabezado = () => (
    <View style={styles.header} fixed>
      <View style={styles.table}>
        {/* Primera fila */}
        <View style={styles.tableRow}>
          <View style={{ ...styles.tableCell, flex: 1.5, flexDirection: "column", justifyContent: "center" }}>
            <Image src="/aion.png" style={styles.logo} />
          </View>
          <View style={{ ...styles.tableCell, flex: 3 }}>
            <Text style={styles.tableCellHeader}>Asesoría y Desarrollo de Productos Naturistas S.A. de C.V.</Text>
          </View>
          <View style={{ ...styles.tableCell, flex: 3 }}>
            <Text style={styles.tableCellHeader}>Última revisión</Text>
            <View style={styles.divider} />
            <Text>14/03/2025</Text>
          </View>
          <View style={{ ...styles.tableCell, flex: 3 }}>
            <Text style={styles.tableCellHeader}>Vigencia</Text>
            <View style={styles.divider} />
            <Text>06-ene-28</Text>
          </View>
          <View style={{ ...styles.tableCell, flex: 3 }}>
            <Text style={styles.tableCellHeader}>Código</Text>
            <View style={styles.divider} />
            <Text></Text>
          </View>
        </View>
  
        {/* Segunda fila */}
        <View style={styles.tableRow}>
          <View style={{ ...styles.tableCell, flex: 4 }}>
            <Text style={styles.tableCellHeader}>FICHA TÉCNICA</Text>
          </View>
          <View style={{ ...styles.tableCell, flex: 2 }}>
            <Text style={styles.tableCellHeader}>Edición</Text>
            <View style={styles.divider} />
            <Text>000</Text>
          </View>
          <View style={{ ...styles.tableCell, flex: 2 }}>
            <Text render={({ pageNumber, totalPages }) => `Pág. ${pageNumber} de ${totalPages}`} />
          </View>
        </View>
      </View>
    </View>
  );  

// Componente principal
const FichaTecnicaPDF = ({ producto }) => {
    const body = [
    ["Característica", "Unidad", "Máximo", "Mínimo", "Método de inspección"],
    ...producto.identificadores
        .filter((i) => i.medicion && i.medicion.trim() !== "")
        .map((i) => {
        const match = producto.identificadoresProductos.find(
            (p) => p.identificador_id === i.id
        );
        const valorRaw = i.calculable === 1 ? match?.registroN ?? "" : match?.registroV ?? "";
        const toleranciaRaw = match?.tolerancia ?? "";
    
        const valor = parseFloat(valorRaw);
        const tolerancia = parseFloat(toleranciaRaw);
    
        let maximo = "";
        let minimo = "";
    
        if (!isNaN(valor) && !isNaN(tolerancia)) {
            const ajuste = valor * (tolerancia / 100);
            maximo = (valor + ajuste).toFixed(2);
            minimo = (valor - ajuste).toFixed(2);
        }
    
        // Método de inspección
        let metodo = "";
        const unidad = i.medicion.trim().toUpperCase();
        if (unidad === "MM.") metodo = "Método interno 1";
        else if (unidad === "G.") metodo = "Método interno 2";
        else if (unidad === "ML.") metodo = "Método interno 3";
    
        return [i.nombre, i.medicion, maximo, minimo, metodo];
        }),
    ];      

  return (
    <Document>
      <Page size="A4" style={styles.page}>
      <Encabezado />

        {/* Información del evento */}
        <View style={[styles.section]} wrap={false}>
        <View style={styles.table}>

            {/* Fila 1 */}
            <View style={styles.tableRow}>
            <Text style={styles.tableColHeader}>Fecha de elaboración</Text>
            <Text style={styles.tableCol}>14/03/2025</Text>
            </View>

            {/* Fila 2 */}
            <View style={styles.tableRow}>
            <Text style={styles.tableColHeader}>Folio</Text>
            <Text style={styles.tableCol}>001</Text>
            </View>

            {/* Fila 3 */}
            <View style={styles.tableRow}>
            <Text style={styles.tableColHeader}>Nombre del producto</Text>
            <Text style={styles.tableCol}>{producto.producto.nombre}</Text>
            </View>

            {/* Fila 4 */}
            <View style={styles.tableRow}>
            <Text style={styles.tableColHeader}>Código del producto</Text>
            <Text style={styles.tableCol}>{producto.producto.codigo}</Text>
            </View>

            {/* Fila 5 */}
            <View style={styles.tableRow}>
            <Text style={styles.tableColHeader}>Composición</Text>
            <Text style={styles.tableCol}>{producto.producto.composicion || "Sin datos"}</Text>
            </View>

            {/* Fila 6 */}
            <View style={styles.tableRow}>
            <Text style={styles.tableColHeader}>Descripción</Text>
            <Text style={styles.tableCol}>{producto.producto.descripcion}</Text>
            </View>

            {/* Fila 7 */}
            <View style={styles.tableRow}>
            <Text style={styles.tableColHeader}>Modo de empleo (Uso)</Text>
            <Text style={styles.tableCol}>{producto.producto.modo_empleo || "Sin datos"}</Text>
            </View>

        </View>
        </View>

        {/* Tabla de datos */}
        <View style={styles.table} wrap={false}>
          {body.map((row, rowIndex) => (
            <View key={rowIndex} style={styles.tableRow}>
              {row.map((cell, cellIndex) => (
                <View key={cellIndex} style={styles.tableCell}>
                  <Text>{cell}</Text>
                </View>
              ))}
            </View>
          ))}
        </View>

        {/* Sección 1 */}
        <View style={styles.table} wrap={false}>
        {/* Fila 1: Encabezado */}
        <View style={styles.tableRow}>
            <View style={styles.tableCell}>
            <Text style={{ fontWeight: 'bold' }}>Condiciones de almacenamiento</Text>
            </View>
        </View>

        {/* Fila 2: Contenido */}
        <View style={styles.tableRow}>
            <View style={styles.tableCell}>
            <Text>
                {producto.condiciones}
            </Text>
            </View>
        </View>
        </View>

        {/* Sección 2 */}
        <View style={styles.table} wrap={false}>
        {/* Fila 1: Encabezado */}
        <View style={styles.tableRow}>
            <View style={styles.tableCell}>
            <Text style={{ fontWeight: 'bold' }}>Distribución</Text>
            </View>
        </View>

        {/* Fila 2: Contenido */}
        <View style={styles.tableRow}>
            <View style={styles.tableCell}>
            <Text>
                {producto.distribucion}
            </Text>
            </View>
        </View>
        </View>
        
        {/* Sección 3 */}
        <View style={styles.table} wrap={false}>
        {/* Fila 1: Encabezado */}
        <View style={styles.tableRow}>
            <View style={styles.tableCell}>
            <Text style={{ fontWeight: 'bold' }}>Consideración sobre la disposición</Text>
            </View>
        </View>

        {/* Fila 2: Contenido */}
        <View style={styles.tableRow}>
            <View style={styles.tableCell}>
            <Text>
                {producto.consideracion}
            </Text>
            </View>
        </View>
        </View>

        {/* Footer - Información legal */}
        <View
        style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 10,
            paddingRight: 335,            // espacio desde el borde derecho
        }}
        wrap={false}
        >
        {/* Columna izquierda */}
        <Text style={{ fontWeight: 'bold' }}>Información legal:</Text>

        {/* Columna derecha */}
        <View
            style={{
            flexDirection: 'column',
            alignItems: 'flex-start',  // que los textos empiecen en el inicio del bloque
            marginRight: 20,           // margen extra si lo quieres todavía más separado
            }}
        >
            <Text>NMX‑E‑285‑NYCE‑2021</Text>
            <Text>ISO 15270:2008</Text>
        </View>
        </View>

        {/* Footer - Texto */}
        <View wrap={false}>
            <Text style={{ fontSize: 7, textAlign: 'center', marginBottom: 20 }}>Documento informativo, queda prohibida su reproducción total o parcial sin la aprobacón emitida por Asesorías y Desarrollo de Productos Naturistas S.A. de C.V.</Text>
        </View>

        {/* Footer - Tabla de involucrados */}
        <View style={styles.table} wrap={false}>
        {/* Fila 1: Encabezado */}
        <View style={styles.tableRow}>
            <View style={styles.tableCell}>
            <Text style={{ fontWeight: 'bold' }}>Elaborado por</Text>
            </View>
            <View style={styles.tableCell}>
            <Text style={{ fontWeight: 'bold' }}>Aprobado por</Text>
            </View>
            <View style={styles.tableCell}>
            <Text style={{ fontWeight: 'bold' }}>Autorizado por</Text>
            </View>
        </View>

        {/* Fila 2: Contenido */}
        <View style={styles.tableRow}>
            <View style={styles.tableCell}>
            <Text>{producto.producto.creado_por ?? ""}</Text>
            </View>
            <View style={styles.tableCell}>
            <Text>{producto.producto.validado_por ?? ""}</Text>
            </View>
            <View style={styles.tableCell}>
            <Text>{producto.producto.tolerancias_por ?? ""}</Text>
            </View>
        </View>
        </View>
      </Page>
    </Document>
  );
};

export default FichaTecnicaPDF;
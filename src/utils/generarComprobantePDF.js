// ComprobanteNominaPDF.jsx
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import logo from "../img/logo.png";

const styles = StyleSheet.create({
  page: { padding: 20, fontSize: 10 },
  header: { textAlign: "center", marginBottom: 10 },
  section: { marginBottom: 10 },
  row: { flexDirection: "row", justifyContent: "space-between" },
  table: { display: "flex", flexDirection: "column", borderWidth: 1 },
  tableRow: { flexDirection: "row", borderBottomWidth: 1 },
  tableCellHeader: {
    flex: 1,
    fontWeight: "bold",
    padding: 4,
    backgroundColor: "#e6e6e6",
    borderRightWidth: 1,
  },
  tableCell: {
    flex: 1,
    padding: 4,
    borderRightWidth: 1,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 5,
  },
   total: {
    marginTop: 10,
    padding: 8,
    backgroundColor: "#f0f0f0",
    textAlign: "right",
    fontSize: 15,
    fontWeight: "bold",
  },
  neto: {
    marginTop: 10,
    padding: 8,
    backgroundColor: "#f0f0f0",
    textAlign: "right",
    fontSize: 15,
    color:"green",
    fontWeight: "bold",
  },
});

const formatCurrency = (val) =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(val);

export const ComprobanteNominaPDF = ({ nomina }) => {
  const horasExtras = nomina.horasExtras || {};
  const totalPagoExtra = nomina.totalPagoExtra || 0;
  const netoAPagar = nomina.neto + nomina.auxDias;


  const horasArray = [
    ["Horas Extras Diusrnas", nomina.HED, horasExtras.CHED],
    ["HEDDF Horas estras diurnas domingos o festivos", nomina.HEDDF, horasExtras.CHEDDF],
    ["Horas extras noctrunas", nomina.HEN, horasExtras.CHEN],
    ["Horas extrar nocturnas domingos o festivos", nomina.HENDF, horasExtras.CHENDF],
    ["Horas nocturnas domingos o festivos", nomina.HNDF, horasExtras.CHNDF],
    ["Horas dominicales o festivas", nomina.HODF, horasExtras.CHODF],
    ["Horas nocturnas", nomina.HON, horasExtras.CHON],

  ];

  const DatosArray=[
    ["Salario por dias ", nomina.salarioDias],
    ["Descuento de salud ", -nomina.desSalud],
    ["Descuento de pension", -nomina.desPension],
    ["otras deducciones", nomina.deducciones],
    ["Auxilio de transporte", nomina.auxDias]
  ]
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Image src={logo} style={{ width: 80, marginBottom: 10 }} />
        <View style={styles.header}>
          <Text style={{ fontSize: 12 }}>EMPRESA CAPACITACION S.A.</Text>
          <Text>NIT 100313819</Text>
          <Text style={{ marginTop: 4, fontSize: 13 }}>
            Documento soporte de pago nómina electrónica
          </Text>
        </View>

        <View style={styles.row}>
          <Text>Fecha Generación: {nomina.fechaGeneracion}</Text>
          <Text>Periodo: {nomina.periodo}</Text>
        </View>

        <View style={styles.row}>
          <Text>Fecha Emisión: {nomina.fechaEmision}</Text>
          <Text>Comprobante N°: {nomina.comprobante}</Text>
        </View>

        <View style={styles.section}>
          <Text>Nombre: {nomina.nombreEmpleado}</Text>
          <Text>Identificación: {nomina.cedulaEmpleado}</Text>
          <Text>Cargo: {nomina.cargo}</Text>
          <Text>Salario básico: {formatCurrency(nomina.salarioBase)}</Text>
        </View>
        {/*detalles de pago */}
        <Text style={{ fontSize: 11, marginBottom: 5, fontWeight: "bold" }}>
          Detalles de devengos
        </Text>

         <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={styles.tableCellHeader}>Concepto</Text>
            <Text style={styles.tableCellHeader}>Valor</Text>
          </View>
          {DatosArray.map(([concepto, valor], idx) => (
            <View key={idx} style={styles.tableRow}>
              <Text style={styles.tableCell}>{concepto}</Text>
              <Text style={styles.tableCell}>
                {valor != null ? formatCurrency(valor) : "-"}
              </Text>
            </View>
          ))}
        </View>
        <Text style={styles.total}>NETO A PAGAR : {formatCurrency(nomina.Neto)}</Text>

        {/* Tabla Horas Extras */}
        <Text style={{ fontSize: 11, marginBottom: 5, fontWeight: "bold" }}>
          Detalle de Horas Extras
        </Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={styles.tableCellHeader}>Concepto</Text>
            <Text style={styles.tableCellHeader}>Horas</Text>
            <Text style={styles.tableCellHeader}>Valor</Text>
          </View>
          {horasArray.map(([concepto, horas, valor], idx) => (
            <View key={idx} style={styles.tableRow}>
              <Text style={styles.tableCell}>{concepto}</Text>
              <Text style={styles.tableCell}>{horas}</Text>
              <Text style={styles.tableCell}>
                {valor != null ? formatCurrency(valor) : "-"}
              </Text>
            </View>
          ))}
        </View>

        <Text style={styles.totalRow}>
          Total Pago Horas Extras: {formatCurrency(totalPagoExtra)}
        </Text>

        <Text style={styles.neto}>TOTAL A PAGAR: {formatCurrency(nomina.totalAPagar)}</Text>
      </Page>
    </Document>
  );
};
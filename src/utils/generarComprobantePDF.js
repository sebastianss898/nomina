import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";


import logo from "../img/logo.png"; 

export const generarComprobantePDF = (nomina) => {
  const doc = new jsPDF();

  // Logo
  doc.addImage(logo, "PNG", 10, 10, 20, 20);

  // Título
  doc.setFontSize(18);
  doc.text("Comprobante de Nómina", 105, 20, { align: "center" });

  // Datos básicos
  doc.setFontSize(12);
  doc.text(`Nombre: ${nomina.nombreEmpleado}`, 14, 40);
  doc.text(`Cédula: ${nomina.cedulaEmpleado}`, 14, 48);
  doc.text(`Mes: ${nomina.mes} ${nomina.año}`, 14, 56);

  // Tabla con los valores
  autoTable(doc, {
    startY: 70,
    head: [["Concepto", "Valor"]],
    body: [
      ["Salario Base", `$${nomina.salarioBase?.toLocaleString()}`],
      ["Días Laborados", nomina.diasLaborados],
      ["Horas Extras", nomina.horasExtras],
      ["Deducciones", `$${nomina.deducciones?.toLocaleString()}`],
      ["Total a Pagar", `$${nomina.totalAPagar?.toLocaleString()}`],
    ],
    theme: "grid",
    headStyles: {
      fillColor: [0, 102, 204],
      textColor: 255,
      halign: "center",
    },
    styles: {
      fontSize: 11,
      cellPadding: 4,
    },
  });

  // Footer
  doc.setFontSize(10);
  doc.text("Empresa XYZ - contacto@empresa.com", 105, 280, {
    align: "center",
  });

  doc.save(`comprobante_nomina_${nomina.nombreEmpleado}.pdf`);
};

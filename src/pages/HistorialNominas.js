import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  orderBy,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../firebase";
import Layout from "../components/Layout";
import Modal from "../components/Modal";
import Swal from "sweetalert2";
import { generarComprobantePDF } from "../utils/generarComprobantePDF";

export default function HistorialNominas() {
  const [nominas, setNominas] = useState([]);
  const [filtroEmpleado, setFiltroEmpleado] = useState("");
  const [filtroMes, setFiltroMes] = useState("");
  const [filtroCedula, setFiltroCedula] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nominaSeleccionada, setNominaSeleccionada] = useState(null);

  const cargarNominas = async () => {
    const q = query(collection(db, "nominas"), orderBy("fechaPago", "desc"));
    const snapshot = await getDocs(q);
    const lista = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setNominas(lista);
  };

  useEffect(() => {
    cargarNominas();
  }, []);

  const nominasFiltradas = nominas.filter((nomina) => {
    const coincideEmpleado =
      filtroEmpleado === "" ||
      (nomina.nombreEmpleado?.toLowerCase() ?? "").includes(
        filtroEmpleado.toLowerCase()
      );

    const coincideCedula =
      filtroCedula === "" ||
      (nomina.cedulaEmpleado?.toLowerCase() ?? "").includes(
        filtroCedula.toLowerCase()
      );

    const coincideMes =
      filtroMes === "" ||
      (nomina.mes?.toLowerCase() ?? "") === filtroMes.toLowerCase();

    return coincideEmpleado && coincideMes && coincideCedula;
  });

  const abrirModal = (nomina) => {
    setNominaSeleccionada(nomina);
    setIsModalOpen(true);
  };

  const obtenerNomina = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "nominas"));
      const lista = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNominas(lista);
    } catch (error) {
      console.error("Error al obtener empleados:", error);
    }
  };

  const eliminarNomina = async (id) => {
    const { isConfirmed } = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción eliminará la nómina de forma permanente.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (!isConfirmed) return;

    try {
      await deleteDoc(doc(db, "nominas", id));
      obtenerNomina();

      Swal.fire({
        title: "Eliminado",
        text: "La nómina ha sido eliminada correctamente.",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Error al eliminar nómina:", error);
      Swal.fire({
        title: "Error",
        text: "No se pudo eliminar la nómina. Intenta de nuevo.",
        icon: "error",
      });
    }
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-soft border border-pastel-dialogBorder">
        <h2 className="text-3xl font-extrabold mb-6 text-pastel-textMain">
          Historial de Nóminas
        </h2>

        {/* Filtros */}
        <div className="flex flex-col md:flex-row md:space-x-4 mb-6 gap-4">
          <input
            type="text"
            placeholder="Buscar por empleado"
            value={filtroEmpleado}
            onChange={(e) => setFiltroEmpleado(e.target.value)}
            className="flex-1 p-3 rounded-lg border border-pastel-inputBorder bg-pastel-inputBg text-pastel-textMain placeholder-pastel-placeholder focus:outline-none focus:ring-2 focus:ring-pastel-inputFocus"
          />

          <input
            type="text"
            placeholder="Filtrar por cédula"
            value={filtroCedula}
            onChange={(e) => setFiltroCedula(e.target.value)}
            className="flex-1 p-3 rounded-lg border border-pastel-inputBorder bg-pastel-inputBg text-pastel-textMain placeholder-pastel-placeholder focus:outline-none focus:ring-2 focus:ring-pastel-inputFocus"
          />

          <input
            type="text"
            placeholder="Filtrar por mes (ej: abril)"
            value={filtroMes}
            onChange={(e) => setFiltroMes(e.target.value)}
            className="flex-1 p-3 rounded-lg border border-pastel-inputBorder bg-pastel-inputBg text-pastel-textMain placeholder-pastel-placeholder focus:outline-none focus:ring-2 focus:ring-pastel-inputFocus"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full table-auto border border-pastel-inputBorder rounded-md">
            <thead>
              <tr className="bg-pastel-tableHeader text-pastel-textMain">
                <th className="border border-pastel-inputBorder px-4 py-2 text-left">Empleado</th>
                <th className="border border-pastel-inputBorder px-4 py-2 text-left">Cédula</th>
                <th className="border border-pastel-inputBorder px-4 py-2 text-left">Mes</th>
                <th className="border border-pastel-inputBorder px-4 py-2 text-left">Año</th>
                <th className="border border-pastel-inputBorder px-4 py-2 text-right">Total Pagado</th>
                <th className="border border-pastel-inputBorder px-4 py-2 text-center">Opciones</th>
              </tr>
            </thead>
            <tbody>
              {nominasFiltradas.map((nomina) => (
                <tr key={nomina.id} className="hover:bg-pastel-tableRowHover text-pastel-textSecondary">
                  <td className="border border-pastel-inputBorder px-4 py-2">{nomina.nombreEmpleado}</td>
                  <td className="border border-pastel-inputBorder px-4 py-2">{nomina.cedulaEmpleado}</td>
                  <td className="border border-pastel-inputBorder px-4 py-2">{nomina.mes}</td>
                  <td className="border border-pastel-inputBorder px-4 py-2">{nomina.año}</td>
                  <td className="border border-pastel-inputBorder px-4 py-2 font-semibold text-pastel-textMain text-right">
                    ${nomina.totalAPagar?.toLocaleString()}
                  </td>
                  <td className="border border-pastel-inputBorder px-4 py-2">
                    <div className="flex gap-2 justify-center flex-wrap">
                      <button
                        onClick={() => abrirModal(nomina)}
                        className="bg-pastel-primaryHover hover:bg-pastel-primary transition-colors text-white px-3 py-1 rounded-md text-sm"
                      >
                        Ver Detalles
                      </button>
                      <button
                        onClick={() => eliminarNomina(nomina.id)}
                        className="bg-pastel-error hover:bg-red-700 transition-colors text-white px-3 py-1 rounded-md text-sm"
                      >
                        Eliminar
                      </button>
                      <button
                        onClick={() => generarComprobantePDF(nomina)}
                        className="bg-pastel-success hover:bg-green-700 transition-colors text-white px-3 py-1 rounded-md text-sm"
                      >
                        Generar PDF
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {nominasFiltradas.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center py-6 text-pastel-textSecondary italic">
                    No se encontraron resultados
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Detalles de Nómina"
      >
        {nominaSeleccionada && (
          <div className="space-y-4 text-pastel-textMain">
            <p>
              <strong>Nombre:</strong> {nominaSeleccionada.nombreEmpleado}
            </p>
            <p>
              <strong>Cédula:</strong> {nominaSeleccionada.cedulaEmpleado}
            </p>
            <p>
              <strong>Mes:</strong> {nominaSeleccionada.mes}
            </p>
            <p>
              <strong>Año:</strong> {nominaSeleccionada.año}
            </p>
            <p>
              <strong>Salario Base:</strong> $
              {nominaSeleccionada.salarioBase?.toLocaleString()}
            </p>
            <p>
              <strong>Días Laborados:</strong>{" "}
              {nominaSeleccionada.diasLaborados}
            </p>
            <p>
              <strong>Horas Extras:</strong> {nominaSeleccionada.horasExtras}
            </p>
            <p>
              <strong>Deducciones:</strong> $
              {nominaSeleccionada.deducciones?.toLocaleString()}
            </p>
            <p>
              <strong>Total Pagado:</strong> $
              {nominaSeleccionada.totalAPagar?.toLocaleString()}
            </p>
          </div>
        )}
      </Modal>
    </Layout>
  );
}

import { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy,deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import Layout from "../components/Layout";
import Modal from "../components/Modal";

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

  // Filtrar nóminas según los campos
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
  const eliminarNomina  = async (id) => {
    const confirmar = window.confirm(
      "¿Estás seguro de que deseas eliminar este empleado?"
    );
    if (!confirmar) return;

    try {
      await deleteDoc(doc(db, "nominas", id));
      // Actualizar lista después de eliminar
      obtenerNomina();
    } catch (error) {
      console.error("Error al eliminar empleado:", error);
    }
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto mt-10 p-6 bg-white shadow rounded">
        <h2 className="text-2xl font-bold mb-6">Historial de Nóminas</h2>

        {/* Filtros */}
        <div className="flex gap-4 mb-6">
          <input
            type="text"
            placeholder="Buscar por empleado"
            value={filtroEmpleado}
            onChange={(e) => setFiltroEmpleado(e.target.value)}
            className="border p-2 w-1/2"
          />
          <input
            type="text"
            placeholder="Filtrar por mes (ej: abril)"
            value={filtroMes}
            onChange={(e) => setFiltroMes(e.target.value)}
            className="border p-2 w-1/2"
          />
          <input
            type="text"
            placeholder="Filtrar por cédula"
            value={filtroCedula}
            onChange={(e) => setFiltroCedula(e.target.value)}
            className="border p-2 w-1/2"
          />
        </div>

        <table className="w-full table-auto border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2">Empleado</th>
              <th className="border px-4 py-2">Cédula</th>
              <th className="border px-4 py-2">Mes</th>
              <th className="border px-4 py-2">Año</th>
              <th className="border px-4 py-2">Total Pagado</th>
              <th className="border px-4 py-2">Opciones</th>
            </tr>
          </thead>
          <tbody>
            {nominasFiltradas.map((nomina) => (
              <tr key={nomina.id} className="text-center">
                <td className="border px-4 py-2">{nomina.nombreEmpleado}</td>
                <td className="border px-4 py-2">{nomina.cedulaEmpleado}</td>
                <td className="border px-4 py-2">{nomina.mes}</td>
                <td className="border px-4 py-2">{nomina.año}</td>
                <td className="border px-4 py-2 font-semibold">
                  ${nomina.totalAPagar?.toLocaleString()}
                </td>
                <td className="border px-4 py-2">
                  <div className="flex gap-2 justify-center">
                    <button
                      onClick={() => abrirModal(nomina)}
                      className="bg-blue-600 text-white px-3 py-1 rounded"
                    >
                      Ver Detalles
                    </button>
                    <button
                      onClick={() => eliminarNomina(nomina.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded"
                    >
                      eliminar nomina
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {nominasFiltradas.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center py-4 text-gray-500">
                  No se encontraron resultados
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Detalles de Nómina"
      >
        {nominaSeleccionada && (
          <div className="space-y-4">
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

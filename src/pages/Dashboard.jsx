import { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import Modal from "../components/Modal";

export default function Dashboard() {
  const [empleados, setEmpleados] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState(null);

  const abrirModal = (empleado) => {
    setEmpleadoSeleccionado(empleado);
    setIsModalOpen(true);
  };

  const obtenerEmpleados = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "empleados"));
      const lista = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setEmpleados(lista);
    } catch (error) {
      console.error("Error al obtener empleados:", error);
    }
  };

  const eliminarEmpleado = async (id) => {
    const confirmar = window.confirm(
      "¿Estás seguro de que deseas eliminar este empleado?"
    );
    if (!confirmar) return;

    try {
      await deleteDoc(doc(db, "empleados", id));
      // Actualizar lista después de eliminar
      obtenerEmpleados();
    } catch (error) {
      console.error("Error al eliminar empleado:", error);
    }
  };

  useEffect(() => {
    obtenerEmpleados();
  }, []);

  return (
    <Layout>
      <div>
        <img src="./img/Logo.png" alt="" />
      </div>

      <div className="max-w-5xl mx-auto mt-10 p-6 bg-white shadow rounded">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold m-4">Lista de Empleados</h2>
          <Link
            to="/empleado/nuevo"
            className="bg-blue-600 text-white px-4 py-2 rounded -mb-px"
          >
            + Agregar
          </Link>
        </div>
        <Link
          to="/nominas/historial"
          className="bg-blue-600 text-white px-4 py-2 rounded m-4"
        >
          Ver historial de nóminas
        </Link>

        <table className="w-full table-auto border px-4 py-2 m-4">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2">Nombre</th>
              <th className="border px-4 py-2">Cédula</th>
              <th className="border px-4 py-2">Cargo</th>
              <th className="border px-4 py-2">Salario</th>
              <th className="border px-4 py-2">Estado</th>
              <th className="border px-4 py-2">Opciones</th>
            </tr>
          </thead>
          <tbody>
            {empleados.map((emp) => (
              <tr key={emp.id} className="text-center">
                <td className="border px-4 py-2">{emp.nombre}</td>
                <td className="border px-4 py-2">{emp.cedula}</td>
                <td className="border px-4 py-2">{emp.cargo}</td>
                <td className="border px-4 py-2">
                  ${emp.salario?.toLocaleString()}
                </td>
                <td className="border px-4 py-2 capitalize">{emp.estado}</td>
                <td className="border px-4 py-2">
                  {" "}
                  <div className="flex gap-2 justify-center">
                    <button
                      onClick={() => abrirModal(emp)}
                      className="bg-blue-600 text-white px-3 py-1 rounded"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => eliminarEmpleado(emp.id)}
                      className="bg-red-600 text-white px-3 py-1 rounded"
                    >
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Editar Empleado"
        >
          {empleadoSeleccionado && (
            <div className="space-y-4">
              <p>
                <strong>Nombre:</strong> {empleadoSeleccionado.nombre}
              </p>
              <p>
                <strong>Cédula:</strong> {empleadoSeleccionado.cedula}
              </p>
              <p>
                <strong>Cargo:</strong> {empleadoSeleccionado.cargo}
              </p>
              <p>
                <strong>Salario:</strong> $
                {empleadoSeleccionado.salario?.toLocaleString()}
              </p>
              <p>
                <strong>Estado:</strong> {empleadoSeleccionado.estado}
              </p>
              
            </div>
          )}
        </Modal>
      </div>
    </Layout>
  );
}

import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import Modal from "../components/Modal";
import { FaRegTrashAlt, FaRegEdit } from "react-icons/fa";
import Swal from "sweetalert2";

export default function ListEmpleados() {
  const [empleados, setEmpleados] = useState([]);
  const [formulario, setFormulario] = useState({
    nombre: "",
    cedula: "",
    cargo: "",
    salario: "",
    estado: "activo",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState(null);

  const abrirModal = (empleado) => {
    setEmpleadoSeleccionado(empleado);
    setFormulario({
      nombre: empleado.nombre,
      cedula: empleado.cedula,
      cargo: empleado.cargo,
      salario: empleado.salario,
      estado: empleado.estado,
    });
    setIsModalOpen(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormulario({ ...formulario, [name]: value });
  };

  const handleEstadoChange = (e) => {
    setFormulario({ ...formulario, estado: e.target.value });
  };

  const guardarCambios = async () => {
    try {
      await updateDoc(
        doc(db, "empleados", empleadoSeleccionado.id),
        formulario
      );
      obtenerEmpleados();
      setIsModalOpen(false);
      Swal.fire({
        title: "Cambios guardados",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Error al actualizar empleado:", error);
      Swal.fire({
        title: "Error",
        text: "No se pudieron guardar los cambios.",
        icon: "error",
      });
    }
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
    const { isConfirmed } = await Swal.fire({
      title: "¿Eliminar empleado?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#f87171", // rojo pastel
      cancelButtonColor: "#60a5fa", // azul pastel
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (!isConfirmed) return;

    try {
      await deleteDoc(doc(db, "empleados", id));
      obtenerEmpleados();

      Swal.fire({
        title: "Empleado eliminado",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Error al eliminar empleado:", error);
      Swal.fire({
        title: "Error",
        text: "No se pudo eliminar el empleado. Intenta nuevamente.",
        icon: "error",
      });
    }
  };

  useEffect(() => {
    obtenerEmpleados();
  }, []);

  return (
    <Layout>
      {/*<div className="flex justify-center my-6">
        <img
          src="./img/Logo.png"
          alt="Logo"
          className="h-20 w-auto object-contain"
        />
      </div>*/}

      <div className="max-w-6xl mx-auto mt-8 p-8 bg-pastel-bgLight shadow-md rounded-lg transition-shadow duration-300 hover:shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-semibold text-pastel-textMain">
            Lista de Empleados
          </h2>
          <Link
            to="/empleado/nuevo"
            className="bg-pastel-primary hover:bg-pastel-selectionBorder transition-colors duration-300 text-white px-5 py-2 rounded-lg shadow-md"
          >
            Agregar nuevo
          </Link>
        </div>

        <Link
          to="/nominas/historial"
          className="inline-block bg-pastel-primary hover:bg-pastel-selectionBorder transition-colors duration-300 text-white px-4 py-2 rounded-lg mb-6 shadow-md"
        >
          Ver historial de nóminas
        </Link>

        <table className="w-full border-collapse rounded-lg overflow-hidden shadow-sm">
          <thead>
            <tr className="bg-pastel-bgSecondary text-pastel-textSecondary font-medium">
              <th className="border px-6 py-3">Nombre</th>
              <th className="border px-6 py-3">Cédula</th>
              <th className="border px-6 py-3">Cargo</th>
              <th className="border px-6 py-3">Salario</th>
              <th className="border px-6 py-3">Estado</th>
              <th className="border px-6 py-3">Opciones</th>
            </tr>
          </thead>
          <tbody>
            {empleados.map((emp) => (
              <tr
                key={emp.id}
                className="text-center even:bg-pastel-bgLight hover:bg-pastel-bgSecondary cursor-pointer transition-colors duration-200"
              >
                <td className="border px-4 py-2">{emp.nombre}</td>
                <td className="border px-4 py-2">{emp.cedula}</td>
                <td className="border px-4 py-2">{emp.cargo}</td>
                <td className="border px-4 py-2">
                  ${emp.salario?.toLocaleString()}
                </td>
                <td className="border px-4 py-2 capitalize">{emp.estado}</td>
                <td className="border px-4 py-2">
                  <div className="flex justify-center gap-3">
                    <button
                      onClick={() => abrirModal(emp)}
                      className="bg-pastel-primary hover:bg-pastel-selectionBorder transition-colors duration-300 text-white px-3 py-1 rounded-lg shadow-md"
                      aria-label="Editar empleado"
                    >
                      <FaRegEdit />
                    </button>
                    <button
                      onClick={() => eliminarEmpleado(emp.id)}
                      className="bg-pastel-error hover:bg-pastel-errorDark transition-colors duration-300 text-white px-3 py-1 rounded-lg shadow-md"
                      aria-label="Eliminar empleado"
                    >
                      <FaRegTrashAlt />
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
            <div className="space-y-4 text-pastel-textMain">
              <p>
                <strong>Nombre:</strong>
                <input
                  type="text"
                  name="nombre"
                  value={formulario.nombre}
                  onChange={handleChange}
                  className="w-full border border-pastel-inputFocus p-2 rounded-md focus:outline-none focus:border-pastel-selectionBorder transition-colors duration-300"
                />
              </p>
              <p>
                <strong>Cédula:</strong>
                <input
                  type="text"
                  name="cedula"
                  value={formulario.cedula}
                  onChange={handleChange}
                  className="w-full border border-pastel-inputFocus p-2 rounded-md focus:outline-none focus:border-pastel-selectionBorder transition-colors duration-300"
                />
              </p>
              <p>
                <strong>Cargo: </strong>
                <input
                  type="text"
                  name="cargo"
                  value={formulario.cargo}
                  onChange={handleChange}
                  className="w-full border border-pastel-inputFocus p-2 rounded-md focus:outline-none focus:border-pastel-selectionBorder transition-colors duration-300"
                />
              </p>
              <p>
                <strong>Salario:</strong> $
                <input
                  type="text"
                  name="salario"
                  value={formulario.salario}
                  onChange={handleChange}
                  className="w-full border border-pastel-inputFocus p-2 rounded-md focus:outline-none focus:border-pastel-selectionBorder transition-colors duration-300"
                />
              </p>
              <p className="font-semibold">
                <strong>Estado:</strong> {empleadoSeleccionado.estado}
              </p>
              <div className="space-x-6">
                <label className="inline-flex items-center space-x-2">
                  <input
                    type="radio"
                    name="estado"
                    value="activo"
                    checked={formulario.estado === "activo"}
                    onChange={handleEstadoChange}
                    className="accent-pastel-primary"
                  />
                  <span>Activo</span>
                </label>
                <label className="inline-flex items-center space-x-2">
                  <input
                    type="radio"
                    name="estado"
                    value="inactivo"
                    checked={formulario.estado === "inactivo"}
                    onChange={handleEstadoChange}
                    className="accent-pastel-primary"
                  />
                  <span>Inactivo</span>
                </label>
              </div>
            </div>
          )}
          <button
            onClick={guardarCambios}
            className="bg-pastel-primary hover:bg-pastel-selectionBorder transition-colors duration-300 text-white px-5 py-2 rounded-md mt-6 shadow-md"
          >
            Guardar Cambios
          </button>
        </Modal>
      </div>
    </Layout>
  );
}

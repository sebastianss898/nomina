import { useEffect, useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";
import Layout from "../components/Layout";
import Swal from "sweetalert2";

export default function RegistroNomina() {
  const [empleados, setEmpleados] = useState([]);
  const [salarioBase, setSalarioBase] = useState(0);
  const { register, handleSubmit, watch, setValue, reset } = useForm();

  const actualDate = new Date();
  const auxTransporte = 200000;
  const diasLaborados = watch("diasLaborados") || 0;
  const deducciones = parseFloat(watch("deducciones") || 0);
  const horasExtras = parseFloat(watch("totalHorasExtras") || 0);

  const horasCampos = [
    "Horas extra diurnas",
    "Horas ordinarias nocturnas",
    "Horas extra nocturnas",
    "Horas ordinarias domingos o festivos",
    "Horas extra diurnas domingos o festivos",
    "Horas nocturnas domingos o festivos",
    "Horas extra nocturnas domingos o festivos",
  ];

  useEffect(() => {
    const cargarEmpleados = async () => {
      const snapshot = await getDocs(collection(db, "empleados"));
      const lista = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setEmpleados(lista);
    };
    cargarEmpleados();
  }, []);

  const seleccionarEmpleado = async (id) => {
    const empleadoSnap = await getDoc(doc(db, "empleados", id));
    if (empleadoSnap.exists()) {
      const emp = empleadoSnap.data();
      setSalarioBase(emp.salario);
      setValue("empleadoId", id);
      setValue("nombreEmpleado", emp.nombre);
      setValue("cedulaEmpleado", emp.cedula);
    }
  };

  {
    /*esta parte retornla la tabla de verificacion final */
  }
  const { salarioDias, auxDias, desSalud, desPension, totalAPagar } =
    useMemo(() => {
      const salarioDias = (salarioBase / 30) * diasLaborados;
      const auxDias = (auxTransporte / 30) * diasLaborados;
      const desSalud = salarioDias * 0.04;
      const desPension = salarioDias * 0.04;
      const total =
        salarioDias + auxDias - (desSalud + desPension + deducciones);

      return { salarioDias, auxDias, desSalud, desPension, totalAPagar: total };
    }, [salarioBase, diasLaborados, deducciones]);

  const onSubmit = async (data) => {
  try {
    const horas = data.horas || [];
    const horasNumericas = horas.map((h) => parseFloat(h) || 0);

    // Tabla de porcentajes según el orden de las horas en tu formulario
    const recargos = [ // en orden: ejemplo
      0.25, // Hora extra diurna
      0.75, // Hora extra nocturna
      0.35, // Recargo nocturno
      0.75, // Hora dominical o festiva
      1.00, // Hora extra diurna dominical o festiva (25% + 75%)
      1.10  // Hora extra nocturna dominical o festiva (75% + 35%)
    ];

    const valorHora = salarioBase / 240; // 240 horas/mes promedio

    const totalHoras = horasNumericas.reduce((acc, val) => acc + val, 0);

    // Calcular valor total de las horas con recargo
    const valorTotalHoras = horasNumericas.reduce((acc, horas, index) => {
      const recargo = recargos[index] || 0;
      return acc + horas * valorHora * (1 + recargo);
    }, 0);

    const horasDetalle = horasCampos.reduce((obj, label, i) => {
      obj[label] = {
        cantidad: horasNumericas[i],
        recargo: recargos[i] || 0,
        valor: horasNumericas[i] * valorHora * (1 + (recargos[i] || 0))
      };
      return obj;
    }, {});

    await addDoc(collection(db, "nominas"), {
      ...data,
      salarioBase,
      diasLaborados: parseFloat(diasLaborados),
      horasExtras: totalHoras,
      horasDetalle,
      valorTotalHoras,
      deducciones: parseFloat(deducciones),
      conceptoDeducciones: data.conceptoDeducciones,
      totalAPagar: totalAPagar + valorTotalHoras,
      fechaPago: serverTimestamp(),
    });

    await Swal.fire({
      title: "¡Éxito!",
      text: "La nómina ha sido registrada correctamente.",
      icon: "success",
      timer: 2000,
      showConfirmButton: false,
    });

    reset();
    setSalarioBase(0);
  } catch (error) {
    Swal.fire({
      title: "Error",
      text: `No se pudo registrar la nómina: ${error.message}`,
      icon: "error",
    });
  }
};


  return (
    <Layout>
      <div className="max-w-4xl mx-auto mt-10 bg-pastel-card p-8 rounded-2xl shadow-soft space-y-8">
        <h2 className="text-3xl font-bold text-pastel-textMain text-center">
          Registro de Nómina
        </h2>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-8 text-pastel-textMain"
        >
          {/* Sección: Empleado */}
          <div className="bg-white p-6 rounded-xl shadow border border-pastel-line space-y-4">
            <h3 className="text-xl font-semibold border-b pb-2">
              Datos del Empleado
            </h3>
            <div>
              <label className="block font-medium">Seleccionar empleado</label>
              <select
                onChange={(e) => seleccionarEmpleado(e.target.value)}
                className="w-full bg-pastel-inputBg border border-pastel-inputBorder focus:border-pastel-inputFocus p-2 rounded"
              >
                <option value="">Seleccione un empleado</option>
                {empleados.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.nombre}
                  </option>
                ))}
              </select>
            </div>
            <input type="hidden" {...register("empleadoId")} />
            <input type="hidden" {...register("nombreEmpleado")} />
            <input type="hidden" {...register("cedulaEmpleado")} />
          </div>

          {/* Sección: Periodo */}
          <div className="bg-white p-6 rounded-xl shadow border border-pastel-line space-y-4">
            <h3 className="text-xl font-semibold border-b pb-2">
              Periodo Laborado
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block font-medium">Año</label>
                <input
                  type="number"
                  {...register("año")}
                  defaultValue={actualDate.getFullYear()}
                  className="w-full bg-pastel-inputBg border border-pastel-inputBorder p-2 rounded"
                />
              </div>
              <div>
                <label className="block font-medium">Mes</label>
                <input
                  type="text"
                  {...register("mes")}
                  defaultValue={actualDate.toLocaleDateString("es-ES", {
                    month: "long",
                  })}
                  className="w-full bg-pastel-inputBg border border-pastel-inputBorder p-2 rounded"
                />
              </div>
              <div>
                <label className="block font-medium">Quincena</label>
                <select
                  {...register("quincena")}
                  className="w-full bg-pastel-inputBg border border-pastel-inputBorder p-2 rounded"
                >
                  <option value="01-15">Del 01 al 15</option>
                  <option value="16-30">Del 16 al 30</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-medium">Días laborados</label>
              <input
                type="number"
                {...register("diasLaborados")}
                defaultValue={0}
                className="w-full bg-pastel-inputBg border border-pastel-inputBorder p-2 rounded"
              />
            </div>
          </div>

          {/* Sección: Horas Extras */}
          <div className="bg-white p-6 rounded-xl shadow border border-pastel-line">
            <h3 className="text-xl font-semibold border-b pb-2 mb-4">
              Horas Extras
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {horasCampos.map((label, index) => (
                <div key={index}>
                  <label className="block font-medium">{label}</label>
                  <input
                    type="number"
                    {...register(`horas.${index}`)}
                    defaultValue={0}
                    className="w-full bg-pastel-inputBg border border-pastel-inputBorder p-2 rounded"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Sección: Deducciones */}
          <div className="bg-white p-6 rounded-xl shadow border border-pastel-line space-y-4">
            <h3 className="text-xl font-semibold border-b pb-2">Deducciones</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium">Otras deducciones</label>
                <input
                  type="number"
                  {...register("deducciones")}
                  defaultValue={0}
                  className="w-full bg-pastel-inputBg border border-pastel-inputBorder p-2 rounded"
                />
              </div>
              <div>
                <label className="block font-medium">
                  Concepto de deducciones
                </label>
                <input
                  type="text"
                  {...register("conceptoDeducciones")}
                  defaultValue="Préstamos"
                  className="w-full bg-pastel-inputBg border border-pastel-inputBorder p-2 rounded"
                />
              </div>
            </div>
          </div>

          <input
            type="hidden"
            {...register("totalHorasExtras")}
            value={horasExtras}
          />

          {/* Sección: Resumen */}
          <div className="bg-white p-6 rounded-xl shadow border border-pastel-line">
            <h3 className="text-xl font-semibold border-b pb-4 mb-4">
              Resumen Final de Pago
            </h3>
            <table className="w-full text-left text-sm text-pastel-textMain border-separate border-spacing-y-2">
              <tbody>
                <tr className="bg-pastel-tableRow rounded">
                  <td className="px-4 py-2 font-medium">
                    Salario base mensual
                  </td>
                  <td className="px-4 py-2">${salarioBase.toLocaleString()}</td>
                </tr>
                <tr className="bg-pastel-tableRow">
                  <td className="px-4 py-2 font-medium">
                    Auxilio transporte mensual
                  </td>
                  <td className="px-4 py-2">
                    ${auxTransporte.toLocaleString()}
                  </td>
                </tr>
                <tr className="bg-pastel-tableRow">
                  <td className="px-4 py-2 font-medium">
                    Salario proporcional (días)
                  </td>
                  <td className="px-4 py-2">${salarioDias.toLocaleString()}</td>
                </tr>
                <tr className="bg-pastel-tableRow">
                  <td className="px-4 py-2 font-medium">
                    Auxilio transporte (días)
                  </td>
                  <td className="px-4 py-2">${auxDias.toLocaleString()}</td>
                </tr>
                <tr className="bg-pastel-tableRow">
                  <td className="px-4 py-2 font-medium text-red-500">
                    Descuento salud (4%)
                  </td>
                  <td className="px-4 py-2 text-red-500">
                    -${desSalud.toLocaleString()}
                  </td>
                </tr>
                <tr className="bg-pastel-tableRow">
                  <td className="px-4 py-2 font-medium text-red-500">
                    Descuento pensión (4%)
                  </td>
                  <td className="px-4 py-2 text-red-500">
                    -${desPension.toLocaleString()}
                  </td>
                </tr>
                <tr className="bg-pastel-tableRow">
                  <td className="px-4 py-2 font-medium text-red-500">
                    Otras deducciones
                  </td>
                  <td className="px-4 py-2 text-red-500">
                    -${deducciones.toLocaleString()}
                  </td>
                </tr>
                <tr className="bg-pastel-primary text-white font-bold text-lg">
                  <td className="px-4 py-3">Total a pagar</td>
                  <td className="px-4 py-3">${totalAPagar.toLocaleString()}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Botón */}
          <button
            type="submit"
            className="bg-pastel-primary hover:bg-pastel-primaryHover text-white font-semibold w-full py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
          >
            Registrar Nómina
          </button>
        </form>
      </div>
    </Layout>
  );
}

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
  let auxTransporte = 200000;
  const diasLaborados = watch("diasLaborados") || 0;
  const deducciones = parseFloat(watch("deducciones") || 0);
  const valorHora = salarioBase / 230;

  if (salarioBase >= 2847000) {
    auxTransporte = 0;
  }
  
  const HED = parseFloat(watch("HED") || 0);
  const HON = parseFloat(watch("HON") || 0);
  const HEN = parseFloat(watch("HEN") || 0);
  const HODF = parseFloat(watch("HODF") || 0);
  const HEDDF = parseFloat(watch("HEDDF") || 0);
  const HNDF = parseFloat(watch("HNDF") || 0);
  const HENDF = parseFloat(watch("HENDF") || 0);

  const calcularHorasExtras = () => {
  const CHED = HED * (valorHora * 1.25);
  const CHON = HON * (valorHora * 1.35);
  const CHEN = HEN * (valorHora * 1.75);
  const CHODF = HODF * (valorHora * 1.75);
  const CHEDDF = HEDDF * (valorHora * 2);
  const CHNDF = HNDF * (valorHora * 2.1);
  const CHENDF = HENDF * (valorHora * 2.5);

  return {
    CHED,
    CHON,
    CHEN,
    CHODF,
    CHEDDF,
    CHNDF,
    CHENDF,
    total: CHED + CHON + CHEN + CHODF + CHEDDF + CHNDF + CHENDF,
  };
};

  

  const formatCurrency = (value) =>
    new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(value);

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

 

  const horasExtras = useMemo(() => calcularHorasExtras(), [
  HED, HON, HEN, HODF, HEDDF, HNDF, HENDF, valorHora,
]);

const { salarioDias, auxDias, desSalud, desPension, totalAPagar, totalPagoHE, Neto } = useMemo(() => {
  const salarioDias = (salarioBase / 30) * diasLaborados;
  const auxDias = (auxTransporte / 30) * diasLaborados;
  const desSalud = salarioDias * 0.04;
  const desPension = salarioDias * 0.04;
  const Neto = salarioDias+auxDias-(desSalud + desPension + deducciones);
  const total = salarioDias + auxDias + horasExtras.total - (desSalud + desPension + deducciones);
  

  return {
    salarioDias,
    auxDias,
    desSalud,
    desPension,
    totalPagoHE: horasExtras.total,
    totalAPagar: total,
    Neto
  };
}, [salarioBase, diasLaborados, deducciones, horasExtras]);

   

  const onSubmit = async (data) => {
  try {
    const datosLimpios = {
      ...data,
      salarioBase,
      diasLaborados: parseFloat(diasLaborados),
      deducciones: parseFloat(deducciones),
      conceptoDeducciones: data.conceptoDeducciones||"",
      desSalud,
      desPension,
      horasExtras: horasExtras, 
      HorasExtraDiurna:HED,
      HorasOrdinariasNocturnas:HON,
      HorasExtraNocturnas:HEN,
      HorasOrdinariasDomingosFestivos:HODF,
      HorasExtraEiurnasDomingosFestivoss:HEDDF,
      HorasNocturnasDomingosFestivos:HNDF,
      HorasExtraNocturnasDomingosFestivos:HENDF,
      totalPagoExtra:totalPagoHE,
      auxDias,
      Neto,
      totalAPagar,
      salarioDias,
      fechaPago: serverTimestamp(),
    };
      
    
      await addDoc(collection(db, "nominas"), datosLimpios);

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
                {...register("diasLaborados", { min: 0, max: 30 })}
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
              <label className="block font-medium">Horas extra diurna</label>
                <input
                  type="number"
                  {...register("HED")}
                  defaultValue={0}
                  className="w-full bg-pastel-inputBg border border-pastel-inputBorder p-2 rounded"
                />
                <label className="block font-medium">Horas ordinarias nocturnas</label>
                <input
                  type="number"
                  {...register("HON")}
                  defaultValue={0}
                  className="w-full bg-pastel-inputBg border border-pastel-inputBorder p-2 rounded"
                />
                <label className="block font-medium">Horas extra nocturnas</label>
                <input
                  type="number"
                  {...register("HEN")}
                  defaultValue={0}
                  className="w-full bg-pastel-inputBg border border-pastel-inputBorder p-2 rounded"
                />
                <label className="block font-medium">Horas ordinarias domingos o festivos</label>
                <input
                  type="number"
                  {...register("HODF")}
                  defaultValue={0}
                  className="w-full bg-pastel-inputBg border border-pastel-inputBorder p-2 rounded"
                />
                <label className="block font-medium">Horas extra diurnas domingos o festivoss</label>
                <input
                  type="number"
                  {...register("HEDDF")}
                  defaultValue={0}
                  className="w-full bg-pastel-inputBg border border-pastel-inputBorder p-2 rounded"
                />
                <label className="block font-medium">Horas nocturnas domingos o festivos</label>
                <input
                  type="number"
                  {...register("HNDF")}
                  defaultValue={0}
                  className="w-full bg-pastel-inputBg border border-pastel-inputBorder p-2 rounded"
                />
                <label className="block font-medium">Horas extra nocturnas domingos o festivos</label>
                <input
                  type="number"
                  {...register("HENDF")}
                  defaultValue={0}
                  className="w-full bg-pastel-inputBg border border-pastel-inputBorder p-2 rounded"
                />
                
            </div>
           
            
            {/*<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            </div>*/}
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
                  defaultValue=""
                  className="w-full bg-pastel-inputBg border border-pastel-inputBorder p-2 rounded"
                />
              </div>
            </div>
          </div>


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
                  <td className="px-4 py-2">{formatCurrency(salarioBase)}</td>
                </tr>
                <tr className="bg-pastel-tableRow">
                  <td className="px-4 py-2 font-medium">
                    Auxilio transporte mensual
                  </td>
                  <td className="px-4 py-2">{formatCurrency(auxTransporte)}</td>
                </tr>
                <tr className="bg-pastel-tableRow">
                  <td className="px-4 py-2 font-medium">
                    Salario proporcional (días)
                  </td>
                  <td className="px-4 py-2">{formatCurrency(salarioDias)}</td>
                </tr>
                <tr className="bg-pastel-tableRow">
                  <td className="px-4 py-2 font-medium">
                    Auxilio transporte (días)
                  </td>
                  <td className="px-4 py-2">{formatCurrency(auxDias)}</td>
                </tr>
                <tr className="bg-pastel-tableRow">
                  <td className="px-4 py-2 font-medium">
                    horas
                  </td>
                  <td className="px-4 py-2">{formatCurrency(totalPagoHE)}</td>
                </tr>
                
                
                <tr className="bg-pastel-tableRow">
                  <td className="px-4 py-2 font-medium text-red-500">
                    Descuento salud (4%)
                  </td>
                  <td className="px-4 py-2 text-red-500">
                    -{formatCurrency(desSalud)}
                  </td>
                </tr>
                <tr className="bg-pastel-tableRow">
                  <td className="px-4 py-2 font-medium text-red-500">
                    Descuento pensión (4%)
                  </td>
                  <td className="px-4 py-2 text-red-500">
                    -{formatCurrency(desPension)}
                  </td>
                </tr>
                <tr className="bg-pastel-tableRow">
                  <td className="px-4 py-2 font-medium text-red-500">
                    Otras deducciones
                  </td>
                  <td className="px-4 py-2 text-red-500">
                    -{formatCurrency(deducciones)}
                  </td>
                </tr>

                <tr className="bg-pastel-primary text-white font-bold text-lg">
                  <td className="px-4 py-3">Total a pagar</td>
                  <td className="px-4 py-3">{formatCurrency(totalAPagar)}</td>
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

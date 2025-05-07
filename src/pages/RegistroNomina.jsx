import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { db } from "../firebase";
import { collection, addDoc, getDocs, doc, getDoc, serverTimestamp } from "firebase/firestore";
import Layout from "../components/Layout";

export default function RegistroNomina() {
  const [empleados, setEmpleados] = useState([]);
  const [salarioBase, setSalarioBase] = useState(0);

  const { register, handleSubmit, watch, setValue, reset } = useForm();


  // calculo de nomina 

  const diasLaborados = watch("diasLaborados") || 0;
  const auxTransporte = 200000

  //proporcionales 
  const auxDias = (auxTransporte/30)*diasLaborados;
  const salarioDias = (salarioBase/30)*diasLaborados;

  //descuentos 
  const desSalud = ((salarioDias*4)/100);
  const desPension = ((salarioDias*4)/100);

  const descuentos = (desSalud+desPension) ;
  
  const horasExtras = watch("horasExtras") || 0;
  const deducciones = watch("deducciones") || 0;


  // Total a pagar = salario + valor horas extras - deducciones
  const totalAPagar = (salarioDias+auxDias) - parseFloat(descuentos);

  // Obtener empleados desde Firestore
  const cargarEmpleados = async () => {
    const snapshot = await getDocs(collection(db, "empleados"));
    const lista = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setEmpleados(lista);
  };

  const seleccionarEmpleado = async (id) => {
    const empleadoRef = doc(db, "empleados", id);
    const empleadoSnap = await getDoc(empleadoRef);
    if (empleadoSnap.exists()) {
      const emp = empleadoSnap.data();
      setSalarioBase(emp.salario);
      setValue("empleadoId", id);
      setValue("nombreEmpleado", emp.nombre);
      setValue("cedulaEmpleado", emp.cedula);  
    }
  };

  const onSubmit = async (data) => {
    try {
      await addDoc(collection(db, "nominas"), {
        ...data,
        Diasaborados:parseFloat(diasLaborados),
        horasExtras: parseFloat(horasExtras),
        deducciones: parseFloat(deducciones),
        salarioBase,
        totalAPagar,
        fechaPago: serverTimestamp(),
      });
      alert("Nómina registrada con éxito");
      reset();
      setSalarioBase(0);
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  useEffect(() => {
    cargarEmpleados();
  }, []);

  return (
    <Layout>
    <div className="max-w-xl mx-auto mt-10 bg-white p-6 shadow rounded">
      <h2 className="text-xl font-bold mb-4">Registrar Nómina</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block mb-1 font-semibold">Empleado</label>
          <select onChange={(e) => seleccionarEmpleado(e.target.value)} className="w-full border p-2">
            <option value="">Seleccione un empleado</option>
            {empleados.map(emp => (
              <option key={emp.id} value={emp.id}>{emp.nombre}</option>
            ))}
          </select>
        </div>

        <input type="hidden" {...register("empleadoId")} />
        <input type="hidden" {...register("nombreEmpleado")} />
        <input type="hidden" {...register("cedulaEmpleado")} />
        

        <div>
          <label className="block mb-1 font-semibold">Año</label>
          <input type="number" {...register("año")} placeholder="2025" className="w-full border p-2"  defaultValue={"2025"}/>
        </div>

        <div>
          <label className="block mb-1 font-semibold">Mes</label>
          <input type="text" {...register("mes")} placeholder="Ej: Abril" className="w-full border p-2" />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Dias laborados</label>
          <input type="text" {...register("quincena")} placeholder="Ej: 01 al 15" className="w-full border p-2" />
        </div>

            
        <div>
          <label className="block mb-1 font-semibold">Dias laborados</label>
          <input type="number" {...register("diasLaborados")} defaultValue={0} className="w-full border p-2" />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Horas Extras</label>
          <input type="number" {...register("horasExtras")} defaultValue={0} className="w-full border p-2" />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Deducciones</label>
          <input type="number" {...register("deducciones")} defaultValue={0} className="w-full border p-2" />
        </div>

        <div className="bg-gray-100 p-3 rounded text-sm">
          <p><strong>Salario base mensual:</strong> ${salarioBase.toLocaleString()}</p>
          <p><strong>Auxilio de transporte mensual:</strong> ${auxTransporte.toLocaleString()}</p>
          <div className="mb-3 border-b border-gray-300"></div>

          <p><strong>Salario Dias:</strong> ${salarioDias.toLocaleString()}</p>
          <p><strong>Auxilio de transporte Dias:</strong> ${auxDias.toLocaleString()}</p>
          <div className="mb-3 border-b border-gray-300"></div>
          
          <p><strong>Descuento de salud </strong> ${desSalud.toLocaleString()}</p>
          <p><strong>Descuento de pension  </strong> ${desPension.toLocaleString()}</p>
          <div className="mb-3 border-b border-gray-300"></div>


          <p className="font-bold text-lg"><strong>Total a pagar:</strong> ${totalAPagar.toLocaleString()}</p>
        </div>

        <button type="submit" className="bg-green-600 text-white w-full p-2">Registrar Nómina</button>
      </form>
    </div>
    </Layout>
  );
}

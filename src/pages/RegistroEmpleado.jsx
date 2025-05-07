import { useForm } from "react-hook-form";
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Layout from "../components/Layout";

const schema = yup.object().shape({
  nombre: yup.string().required("Nombre obligatorio"),
  cedula: yup.string().required("Cédula requerida"),
  cargo: yup.string().required("Cargo requerido"),
  salario: yup.number().typeError("Debe ser un número").required("Salario requerido"),
  fechaIngreso: yup.date().required("Fecha de ingreso requerida"),
});

export default function RegistroEmpleado() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  });

  const onSubmit = async (data) => {
    try {
      await addDoc(collection(db, "empleados"), {
        ...data,
        salario: Number(data.salario),
        fechaIngreso: new Date(data.fechaIngreso),
        estado: "activo",
        creadoEn: serverTimestamp(),
      });
      alert("Empleado registrado correctamente");
      reset();
    } catch (error) {
      alert("Error al registrar empleado: " + error.message);
    }
  };

  return (
    <Layout>
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4">Registrar Empleado</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <input type="text" {...register("nombre")} placeholder="Nombre completo" className="w-full border p-2" />
          <p className="text-red-500">{errors.nombre?.message}</p>
        </div>
        <div>
          <input type="text" {...register("cedula")} placeholder="Cédula" className="w-full border p-2" />
          <p className="text-red-500">{errors.cedula?.message}</p>
        </div>
        <div>
          <input type="text" {...register("cargo")} placeholder="Cargo" className="w-full border p-2" />
          <p className="text-red-500">{errors.cargo?.message}</p>
        </div>
        <div>
          <input type="number" {...register("salario")} placeholder="Salario" className="w-full border p-2" />
          <p className="text-red-500">{errors.salario?.message}</p>
        </div>
        <div>
          <label className=" mb-4" >fecha de ingreso </label>
          <input type="date" {...register("fechaIngreso")} className="w-full border p-2" />
          <p className="text-red-500">{errors.fechaIngreso?.message}</p>
        </div>
        <button type="submit" className="bg-blue-600 text-white p-2 w-full">Guardar Empleado</button>
      </form>
    </div>
    </Layout>
  );
}

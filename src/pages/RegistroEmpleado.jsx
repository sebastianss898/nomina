import { useForm } from "react-hook-form";
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Layout from "../components/Layout";

const schema = yup.object().shape({
  nombre: yup.string().required("Nombre obligatorio"),
  cedula: yup.string().required("Cédula requerida"),
  fechaNac: yup.date().required("Fecha de nacimiento requerida"),
  cel: yup.number().required("Celular de contacto"),
  email: yup.string().required("Correo electronico requerido"),
  adresse: yup.string().required("Dirección de residencia"),
  afp: yup.string().required("Fondo de pensiones y cesantías requerido"),
  eps: yup.string().required("EPS requerida"),
  banck: yup.string().required("Banco requerido"),
  acount_tipe: yup.string().required("Tipo de cuenta requerido"),
  acount_number: yup
    .number()
    .typeError("Debe ser un número")
    .required("Número de cuenta requerido"),
  cargo: yup.string().required("Cargo requerido"),
  salario: yup
    .number()
    .typeError("Debe ser un número")
    .required("Salario requerido"),
  fechaIngreso: yup.date().required("Fecha de ingreso requerida"),
});

export default function RegistroEmpleado() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
  try {
    // Convertir todos los string a mayúsculas
    const dataMayusculas = Object.fromEntries(
      Object.entries(data).map(([key, value]) => {
        if (typeof value === "string") {
          return [key, value.toUpperCase()];
        }
        return [key, value];
      })
    );

    await addDoc(collection(db, "empleados"), {
      ...dataMayusculas,
      salario: Number(data.salario),
      fechaIngreso: new Date(data.fechaIngreso),
      fechaNac: new Date(data.fechaNac),
      estado: "ACTIVO",
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
            <input
              type="text"
              {...register("nombre")}
              placeholder="Nombre completo"
              className="w-full border p-2"
            />
            <p className="text-red-500">{errors.nombre?.message}</p>
          </div>

          <div>
            <input
              type="text"
              {...register("cedula")}
              placeholder="Cédula"
              className="w-full border p-2"
            />
            <p className="text-red-500">{errors.cedula?.message}</p>
          </div>

          <div>
            <label className=" mb-4">fecha de nacimiento </label>
            <input
              type="date"
              {...register("fechaNac")}
              className="w-full border p-2"
            />
            <p className="text-red-500">{errors.fecha_nac?.message}</p>
          </div>

          <div>
            <input
              type="number"
              {...register("cel")}
              placeholder="celular"
              className="w-full border p-2"
            />
            <p className="text-red-500">{errors.cel?.message}</p>
          </div>
          <div>
            <input
              type="email"
              {...register("email")}
              placeholder="Correo Electronico"
              className="w-full border p-2"
            />
            <p className="text-red-500">{errors.email?.message}</p>
          </div>
          <div>
            <input
              type="text"
              {...register("adresse")}
              placeholder="direccion de residencia"
              className="w-full border p-2"
            />
            <p className="text-red-500">{errors.adresse?.message}</p>
          </div>
          <div>
            <input
              type="text"
              {...register("afp")}
              placeholder="Fondo de pesiones "
              className="w-full border p-2"
            />
            <p className="text-red-500">{errors.afp?.message}</p>
          </div>
          <div>
            <input
              type="text"
              {...register("eps")}
              placeholder="EPS "
              className="w-full border p-2"
            />
            <p className="text-red-500">{errors.eps?.message}</p>
          </div>

          <div>
            <input
              type="text"
              {...register("banck")}
              placeholder="Entidad Bancaria"
              className="w-full border p-2"
            />
            <p className="text-red-500">{errors.banck?.message}</p>
          </div>

          <div>
            <input
              type="text"
              {...register("acount_tipe")}
              placeholder="Tipo de cuenta"
              className="w-full border p-2"
            />
            <p className="text-red-500">{errors.acount_tipe?.message}</p>
          </div>

          <div>
            <input
              type="number"
              {...register("acount_number")}
              placeholder="Numero de cuenta"
              className="w-full border p-2"
            />
            <p className="text-red-500">{errors.acount_number?.message}</p>
          </div>

          <div>
            <input
              type="text"
              {...register("cargo")}
              placeholder="Cargo"
              className="w-full border p-2"
            />
            <p className="text-red-500">{errors.cargo?.message}</p>
          </div>
          <div>
            <input
              type="number"
              {...register("salario")}
              placeholder="salario"
              className="w-full border p-2"
            />
            <p className="text-red-500">{errors.salario?.message}</p>
          </div>

          <div>
            <label className=" mb-4">fecha de ingreso </label>
            <input
              type="date"
              {...register("fechaIngreso")}
              className="w-full border p-2"
            />
            <p className="text-red-500">{errors.fechaIngreso?.message}</p>
          </div>

          <button type="submit" className="bg-blue-600 text-white p-2 w-full">
            Guardar Empleado
          </button>
        </form>
      </div>
    </Layout>
  );
}

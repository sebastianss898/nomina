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
  email: yup.string().required("Correo electrónico requerido"),
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

  const inputBase =
    "w-full border border-pastel-inputFocus p-3 rounded-xl placeholder-pastel-textSecondary focus:outline-none focus:ring-2 focus:ring-pastel-primary shadow-sm";

  return (
    <Layout>
      <div className="max-w-6xl mx-auto bg-white border border-pastel-selectionBorder shadow-xl rounded-3xl p-10 mt-10">
        <h2 className="text-3xl font-bold text-center mb-10 text-pastel-textMain">
          Registrar Empleado
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">

          {/* SECCIÓN: Información Personal */}
          <h3 className="md:col-span-2 text-lg font-semibold text-pastel-textMain">Información Personal</h3>

          <div>
            <input type="text" {...register("nombre")} placeholder="Nombre completo" className={inputBase} />
            <p className="text-red-500 text-xs mt-1">{errors.nombre?.message}</p>
          </div>

          <div>
            <input type="text" {...register("cedula")} placeholder="Cédula" className={inputBase} />
            <p className="text-red-500 text-xs mt-1">{errors.cedula?.message}</p>
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-pastel-textSecondary">Fecha de nacimiento</label>
            <input type="date" {...register("fechaNac")} className={inputBase} />
            <p className="text-red-500 text-xs mt-1">{errors.fechaNac?.message}</p>
          </div>

          <div>
            <input type="number" {...register("cel")} placeholder="Celular" className={inputBase} />
            <p className="text-red-500 text-xs mt-1">{errors.cel?.message}</p>
          </div>

          <div>
            <input type="email" {...register("email")} placeholder="Correo electrónico" className={inputBase} />
            <p className="text-red-500 text-xs mt-1">{errors.email?.message}</p>
          </div>

          <div>
            <input type="text" {...register("adresse")} placeholder="Dirección de residencia" className={inputBase} />
            <p className="text-red-500 text-xs mt-1">{errors.adresse?.message}</p>
          </div>

          {/* SECCIÓN: Seguridad Social */}
          <h3 className="md:col-span-2 text-lg font-semibold text-pastel-textMain">Seguridad Social</h3>

          <div>
            <input type="text" {...register("afp")} placeholder="Fondo de pensiones y cesantías" className={inputBase} />
            <p className="text-red-500 text-xs mt-1">{errors.afp?.message}</p>
          </div>

          <div>
            <input type="text" {...register("eps")} placeholder="EPS" className={inputBase} />
            <p className="text-red-500 text-xs mt-1">{errors.eps?.message}</p>
          </div>

          {/* SECCIÓN: Datos Bancarios */}
          <h3 className="md:col-span-2 text-lg font-semibold text-pastel-textMain">Datos Bancarios</h3>

          <div>
            <input type="text" {...register("banck")} placeholder="Entidad bancaria" className={inputBase} />
            <p className="text-red-500 text-xs mt-1">{errors.banck?.message}</p>
          </div>

          <div>
            <input type="text" {...register("acount_tipe")} placeholder="Tipo de cuenta" className={inputBase} />
            <p className="text-red-500 text-xs mt-1">{errors.acount_tipe?.message}</p>
          </div>

          <div>
            <input type="number" {...register("acount_number")} placeholder="Número de cuenta" className={inputBase} />
            <p className="text-red-500 text-xs mt-1">{errors.acount_number?.message}</p>
          </div>

          {/* SECCIÓN: Datos Laborales */}
          <h3 className="md:col-span-2 text-lg font-semibold text-pastel-textMain">Datos Laborales</h3>

          <div>
            <input type="text" {...register("cargo")} placeholder="Cargo" className={inputBase} />
            <p className="text-red-500 text-xs mt-1">{errors.cargo?.message}</p>
          </div>

          <div>
            <input type="number" {...register("salario")} placeholder="Salario" className={inputBase} />
            <p className="text-red-500 text-xs mt-1">{errors.salario?.message}</p>
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-pastel-textSecondary">Fecha de ingreso</label>
            <input type="date" {...register("fechaIngreso")} className={inputBase} />
            <p className="text-red-500 text-xs mt-1">{errors.fechaIngreso?.message}</p>
          </div>

          {/* BOTÓN */}
          <div className="md:col-span-2">
            <button
              type="submit"
              className="w-full bg-pastel-primary text-white font-semibold py-3 rounded-xl shadow-md hover:bg-pastel-selectionBorder transition-all duration-300"
            >
              Guardar Empleado
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}

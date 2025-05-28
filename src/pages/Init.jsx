import { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../firebase";
import Layout from "../components/Layout";
import {
  RadialBarChart,
  RadialBar,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function Init() {
  const [nominas, setNominas] = useState([]);

  const cargarNominas = async () => {
    const q = query(collection(db, "nominas"), orderBy("fechaPago", "desc"));
    const snapshot = await getDocs(q);
    const lista = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setNominas(lista);
  };

  useEffect(() => {
    cargarNominas();
  }, []);

  // Datos de prueba — reemplaza luego con datos procesados desde nominas
 const data = nominas.map((n) => ({
  name: n.nombreEmpleado ?? "Sin nombre",
  uv: n.valor ?? 0,
  fill: "#8884d8", // Puedes rotar colores
}));


  const style = {
    top: "50%",
    right: 5,
    transform: "translate(0, -50%)",
    lineHeight: "50px",
  };

  return (
    <Layout>
      <div className="w-full h-[400px]  rounded-xl shadow-md p-4">
        <h2 className="text-lg font-semibold mb-4">Distribución de Nóminas</h2>
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            cx="50%"
            cy="50%"
            innerRadius="20%"
            outerRadius="80%"
            barSize={20}
            data={data}
          >
            <RadialBar
              minAngle={80}
              label={{ position: "insideStart", fill: "#fff" }}
              background
              clockWise
              dataKey="uv"
            />
            <Legend
              iconSize={10}
              layout="vertical"
              verticalAlign="middle"
              wrapperStyle={style}
            />
          </RadialBarChart>
        </ResponsiveContainer>
      </div>
    </Layout>
  );
}

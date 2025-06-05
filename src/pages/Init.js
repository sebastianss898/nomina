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

  const pastelColors = [
    "#A8DADC", // verde agua
    "#FDCBBA", // durazno claro
    "#FFE66D", // amarillo pastel
    "#B5EAD7", // menta
    "#FFDAC1", // rosa claro
    "#C7CEEA", // lavanda
    "#E0BBE4", // lila
    "#FFB7B2", // salmón pastel
  ];

  const data = nominas.map((n, index) => ({
    name: n.nombreEmpleado ?? "Sin nombre",
    uv: n.valor ?? 0,
    fill: pastelColors[index % pastelColors.length],
  }));

  const style = {
    top: "50%",
    right: 5,
    transform: "translate(0, -50%)",
    lineHeight: "30px",
    fontSize: "0.9rem",
    color: "#444",
  };

  return (
    <Layout>
      <div className="w-full h-[400px] rounded-2xl shadow-sm p-6 bg-[#F9FAFB]">
        <h2 className="text-xl font-medium mb-4 text-[#555]">
          Distribución de Nóminas
        </h2>
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            cx="50%"
            cy="50%"
            innerRadius="20%"
            outerRadius="80%"
            barSize={18}
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

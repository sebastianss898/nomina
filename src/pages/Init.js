import { useNominas } from "../hooks/useNominas";
import Layout from "../components/Layout";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useMemo } from "react";

export default function Init() {
  const { nominas, loading } = useNominas();

  const formatCurrency = (value) =>
    new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(Number.isFinite(value) ? value : 0);

  const totales = useMemo(() => {
    return nominas.reduce(
      (acc, n) => {
        acc.salarioBase += n.salarioBase ?? 0;
        acc.totalAPagar += n.totalAPagar ?? 0;
        acc.salud += n.desSalud ?? 0;
        acc.pension += n.desPension ?? 0;
        acc.horasExtras += n.horasExtras?.total ?? 0;
        return acc;
      },
      {
        salarioBase: 0,
        totalAPagar: 0,
        salud: 0,
        pension: 0,
        horasExtras: 0,
      }
    );
  }, [nominas]);

  // Total general = lo que tú definas como “total real pagado”
  const totalGeneral = totales.totalAPagar + totales.horasExtras;

  const pastelColors = [
    "#440806",
    "#7e1810",
    "#c61c08",
    "#ef2d07",
    "#fe4711",
    "#ff7f50",
    "#E0BBE4",
    "#FFB7B2",
  ];

  /*const chartData = nominas.map((n, index) => ({
    name: n.nombreEmpleado ?? "Sin nombre",
    salarioBase: n.salarioBase ?? 0,
    salarioDias: n.salarioDias ?? 0,
    totalAPagar: n.totalAPagar ?? 0,
    descuentoSalud: n.desSalud ?? 0,
    descuentoPension: n.desPension ?? 0,
    horasExtras: n.horasExtras?.total ?? 0,
    fill: pastelColors[index % pastelColors.length],
  }));*/

  const columnas = [
    { key: "salarioBase", label: "Salario Base" },
    { key: "salarioDias", label: "Salario Días" },
    { key: "horasExtras", label: "Horas Extras", nested: "total" },
    { key: "desSalud", label: "Descuento salud" },
    { key: "desPension", label: "Descuento pensión" },
    { key: "totalAPagar", label: "Total a Pagar", highlight: true },
  ];

  if (loading)
    return (
      <Layout>
        <div className="p-6">Cargando nóminas...</div>
      </Layout>
    );
  if (!nominas.length)
    return (
      <Layout>
        <div className="p-6">No hay datos disponibles.</div>
      </Layout>
    );
  const empleadosAgrupados = nominas.reduce((acc, n) => {
    const nombre = n.nombreEmpleado ?? "Sin nombre";
    if (!acc[nombre]) {
      acc[nombre] = {
        name: nombre,
        salarioBase: 0,
        salarioDias: 0,
        totalAPagar: 0,
        descuentoSalud: 0,
        descuentoPension: 0,
        horasExtras: 0,
      };
    }

    acc[nombre].salarioBase += n.salarioBase ?? 0;
    acc[nombre].salarioDias += n.salarioDias ?? 0;
    acc[nombre].totalAPagar += n.totalAPagar ?? 0;
    acc[nombre].descuentoSalud += n.desSalud ?? 0;
    acc[nombre].descuentoPension += n.desPension ?? 0;
    acc[nombre].horasExtras += n.horasExtras?.total ?? 0;

    return acc;
  }, {});

  const chartData = Object.values(empleadosAgrupados);

  chartData.sort((a, b) => b.totalAPagar - a.totalAPagar);
  return (
    <Layout>
      <div className="w-full mb-10 p-6 bg-[#F9FAFB] rounded-2xl shadow-sm">
        <div className="mb-4">
          <h2 className="text-xl font-medium text-[#555] mb-2">
            Resumen General
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-700">
            <div className="p-4 bg-white rounded-xl shadow-sm">
              <p className="text-gray-500">Total Pagado (Nómina)</p>
              <p className="text-lg font-bold">
                {formatCurrency(totales.totalAPagar)}
              </p>
            </div>
            <div className="p-4 bg-white rounded-xl shadow-sm">
              <p className="text-gray-500">Total pagado en extras</p>
              <p className="text-lg font-bold">
                {formatCurrency(totales.horasExtras)}
              </p>
            </div>
            <div className="p-4 bg-white rounded-xl shadow-sm">
              <p className="text-gray-500">Total General Pagado</p>
              <p className="text-lg font-bold text-green-700">
                {formatCurrency(totalGeneral)}
              </p>
            </div>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 10, right: 30, left: 40, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="name" type="category" />
            <Tooltip formatter={(value) => formatCurrency(value)} />
            <Legend />
            <Bar dataKey="salarioBase" fill="#440806" name="Salario Base" />
            <Bar dataKey="salarioDias" fill="#7e1810" name="Salario Días" />
            <Bar dataKey="totalAPagar" fill="#c61c08" name="Total a Pagar" />
            <Bar
              dataKey="descuentoSalud"
              fill="#ef2d07"
              name="Descuento salud"
            />
            <Bar
              dataKey="descuentoPension"
              fill="#fe4711"
              name="Descuento pensión"
            />
            <Bar dataKey="horasExtras" fill="#ff7f50" name="Horas Extras" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="w-full p-6 bg-white rounded-2xl shadow-sm overflow-x-auto">
        <h2 className="text-xl font-medium mb-4 text-[#555]">
          Detalle de Empleados
        </h2>
        <table className="min-w-full text-sm text-left text-gray-700">
          <thead className="bg-gray-100 text-xs uppercase text-gray-600">
            <tr>
              <th scope="col" className="px-4 py-2">
                Nombre
              </th>
              {columnas.map((col) => (
                <th key={col.key} scope="col" className="px-4 py-2">
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {nominas.map((n) => (
              <tr key={n.id} className="border-b">
                <td className="px-4 py-2">
                  {n.nombreEmpleado ?? "Sin nombre"}
                </td>
                {columnas.map((col) => {
                  const value = col.nested
                    ? n[col.key]?.[col.nested]
                    : n[col.key];
                  return (
                    <td
                      key={col.key}
                      className={`px-4 py-2 ${
                        col.highlight ? "font-semibold text-green-700" : ""
                      }`}
                    >
                      {formatCurrency(value)}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}

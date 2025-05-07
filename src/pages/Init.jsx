import { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../firebase";
import Layout from "../components/Layout";

export default function Init() {
  const [nominas, setNominas] = useState([]);

  const cargarNominas = async () => {
    const q = query(collection(db, "nominas"), orderBy("fechaPago", "desc"));
    const snapshot = await getDocs(q);
    const lista = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setNominas(lista);
  };

  useEffect(() => {
    cargarNominas();
  }, []);

  return (
    <Layout>
   
    </Layout>
  );
}

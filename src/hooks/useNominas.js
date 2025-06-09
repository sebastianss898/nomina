import { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../firebase";

export function useNominas() {
  const [nominas, setNominas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarNominas = async () => {
      const q = query(collection(db, "nominas"), orderBy("fechaPago", "desc"));
      const snapshot = await getDocs(q);
      const lista = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setNominas(lista);
      setLoading(false);
    };

    cargarNominas();
  }, []);

  return { nominas, loading };
}

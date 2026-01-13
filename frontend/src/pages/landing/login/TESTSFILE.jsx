import api from "axios"
import { useEffect } from "react";
export default function Whoami() {

    useEffect(() => {
    const fetchWho = async () => {
      try {
        const res = await api.get("/whoami")
        console.log(res.data)
      } catch (err) {
        console.error("Error fetching whoami:", err.response?.status || err.message)
      }
    }

    fetchWho()
  }, [])
    return <>
    </>
}
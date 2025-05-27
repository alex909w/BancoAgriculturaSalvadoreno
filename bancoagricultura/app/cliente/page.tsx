"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"

export default function ClientePage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "loading") {
      return
    }

    if (session) {
      router.push("/bienvenida")
    } else {
      router.push("/login")
    }
  }, [session, status, router])

  return <div>{status === "loading" ? <p>Cargando...</p> : <p>Redirigiendo...</p>}</div>
}

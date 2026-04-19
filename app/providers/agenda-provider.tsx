"use client"

import React, { createContext, useContext, useState, useEffect } from "react"

export interface Agenda {
  id: string
  title: string
  layanan: string
  tanggal: string
  jam: string
  lokasi: string
  kapasitas: number
  terdaftar: number
  deskripsi: string
  status: "tersedia" | "penuh" | "ditutup"
}

interface AgendaContextType {
  agendas: Agenda[]
  addAgenda: (agenda: Omit<Agenda, "id">) => void
  updateAgenda: (id: string, agenda: Omit<Agenda, "id">) => void
  deleteAgenda: (id: string) => void
  getAgendaById: (id: string) => Agenda | undefined
}

const AgendaContext = createContext<AgendaContextType | undefined>(undefined)

// Initial data
const initialAgendas: Agenda[] = [
  {
    id: "1",
    title: "Permohonan KTP-el",
    layanan: "KTP Elektronik",
    tanggal: "2026-05-15",
    jam: "08:00 - 14:00",
    lokasi: "Kantor Kab. Minahasen",
    kapasitas: 30,
    terdaftar: 25,
    deskripsi: "Layanan pengajuan KTP Elektronik",
    status: "tersedia",
  },
  {
    id: "2",
    title: "Aktivasi IKD",
    layanan: "IKD",
    tanggal: "2026-05-22",
    jam: "09:00 - 13:00",
    lokasi: "Balai Warga Kab. Panggung",
    kapasitas: 20,
    terdaftar: 20,
    deskripsi: "Layanan aktivasi nomor identitas keluarga digital",
    status: "penuh",
  },
]

export function AgendaProvider({ children }: { children: React.ReactNode }) {
  const [agendas, setAgendas] = useState<Agenda[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  // Load dari localStorage saat mount
  useEffect(() => {
    const saved = localStorage.getItem("agendas")
    if (saved) {
      try {
        setAgendas(JSON.parse(saved))
      } catch {
        setAgendas(initialAgendas)
      }
    } else {
      setAgendas(initialAgendas)
    }
    setIsLoaded(true)
  }, [])

  // Save ke localStorage saat agendas berubah
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("agendas", JSON.stringify(agendas))
    }
  }, [agendas, isLoaded])

  const addAgenda = (agenda: Omit<Agenda, "id">) => {
    const newAgenda: Agenda = {
      ...agenda,
      id: Date.now().toString(),
    }
    setAgendas([...agendas, newAgenda])
  }

  const updateAgenda = (id: string, agenda: Omit<Agenda, "id">) => {
    setAgendas(agendas.map((a) => (a.id === id ? { ...agenda, id } : a)))
  }

  const deleteAgenda = (id: string) => {
    setAgendas(agendas.filter((a) => a.id !== id))
  }

  const getAgendaById = (id: string) => {
    return agendas.find((a) => a.id === id)
  }

  return (
    <AgendaContext.Provider value={{ agendas, addAgenda, updateAgenda, deleteAgenda, getAgendaById }}>
      {children}
    </AgendaContext.Provider>
  )
}

export function useAgenda() {
  const context = useContext(AgendaContext)
  if (!context) {
    throw new Error("useAgenda must be used within AgendaProvider")
  }
  return context
}

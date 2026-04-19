"use client"

import React, { createContext, useContext, useState, useEffect } from "react"

export interface Aspirasi {
    id: string
    nama: string
    email: string
    pesan: string
    tanggal: string
    status: "baru" | "dibaca" | "diproses"
}

interface AspirasiContextType {
    aspirasi: Aspirasi[]
    addAspirasi: (aspirasi: Omit<Aspirasi, "id" | "status">) => void
    updateAspirasiStatus: (id: string, status: "baru" | "dibaca" | "diproses") => void
    getAspirasiById: (id: string) => Aspirasi | undefined
}

const AspirasiContext = createContext<AspirasiContextType | undefined>(undefined)

// Initial data
const initialAspirasi: Aspirasi[] = []

export function AspirasiProvider({ children }: { children: React.ReactNode }) {
    const [aspirasi, setAspirasi] = useState<Aspirasi[]>([])
    const [isLoaded, setIsLoaded] = useState(false)

    // Load dari localStorage saat mount
    useEffect(() => {
        const saved = localStorage.getItem("aspirasi")
        if (saved) {
            try {
                setAspirasi(JSON.parse(saved))
            } catch {
                setAspirasi(initialAspirasi)
            }
        } else {
            setAspirasi(initialAspirasi)
        }
        setIsLoaded(true)
    }, [])

    // Save ke localStorage saat aspirasi berubah
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem("aspirasi", JSON.stringify(aspirasi))
        }
    }, [aspirasi, isLoaded])

    const addAspirasi = (newAspirasi: Omit<Aspirasi, "id" | "status">) => {
        const aspirasisItem: Aspirasi = {
            ...newAspirasi,
            id: Date.now().toString(),
            status: "baru",
        }
        setAspirasi([aspirasisItem, ...aspirasi])
    }

    const updateAspirasiStatus = (id: string, status: "baru" | "dibaca" | "diproses") => {
        setAspirasi(aspirasi.map((a) => (a.id === id ? { ...a, status } : a)))
    }

    const getAspirasiById = (id: string) => {
        return aspirasi.find((a) => a.id === id)
    }

    return (
        <AspirasiContext.Provider value={{ aspirasi, addAspirasi, updateAspirasiStatus, getAspirasiById }}>
            {children}
        </AspirasiContext.Provider>
    )
}

export function useAspirasi() {
    const context = useContext(AspirasiContext)
    if (!context) {
        throw new Error("useAspirasi must be used within AspirasiProvider")
    }
    return context
}

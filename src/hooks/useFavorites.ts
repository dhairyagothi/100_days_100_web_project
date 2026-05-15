"use client"

import { useState, useEffect } from "react"

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([])

  useEffect(() => {
    try {
      const stored = localStorage.getItem("100-days-favorites")
      if (stored) {
        setFavorites(JSON.parse(stored))
      }
    } catch (e) {
      console.error("Could not load favorites", e)
    }
  }, [])

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const isFavorite = prev.includes(id)
      const newFavorites = isFavorite ? prev.filter((f) => f !== id) : [...prev, id]
      localStorage.setItem("100-days-favorites", JSON.stringify(newFavorites))
      return newFavorites
    })
  }

  const isFavorite = (id: string) => favorites.includes(id)

  return { favorites, toggleFavorite, isFavorite }
}

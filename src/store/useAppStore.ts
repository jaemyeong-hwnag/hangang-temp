import { create } from 'zustand'

interface AppState {
  temp: number | null
  tempLoading: boolean
  tempError: string | null
  kospiRate: number | null
  kospiPrice: number | null
  kospiLoading: boolean
  kospiError: string | null
  lastUpdated: Date | null

  setTemp: (temp: number | null) => void
  setTempLoading: (loading: boolean) => void
  setTempError: (error: string | null) => void
  setKospiRate: (rate: number | null) => void
  setKospiPrice: (price: number | null) => void
  setKospiLoading: (loading: boolean) => void
  setKospiError: (error: string | null) => void
  setLastUpdated: (date: Date | null) => void
}

export const useAppStore = create<AppState>((set) => ({
  temp: null,
  tempLoading: false,
  tempError: null,
  kospiRate: null,
  kospiPrice: null,
  kospiLoading: false,
  kospiError: null,
  lastUpdated: null,

  setTemp: (temp) => set({ temp }),
  setTempLoading: (tempLoading) => set({ tempLoading }),
  setTempError: (tempError) => set({ tempError }),
  setKospiRate: (kospiRate) => set({ kospiRate }),
  setKospiPrice: (kospiPrice) => set({ kospiPrice }),
  setKospiLoading: (kospiLoading) => set({ kospiLoading }),
  setKospiError: (kospiError) => set({ kospiError }),
  setLastUpdated: (lastUpdated) => set({ lastUpdated }),
}))

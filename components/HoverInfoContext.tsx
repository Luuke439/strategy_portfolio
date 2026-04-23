'use client'

import { createContext, useCallback, useContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { TileHoverInfo } from './ProjectCard'

interface Ctx {
  hoverInfo: TileHoverInfo | null
  setHoverInfo: (info: TileHoverInfo | null) => void
}

const Context = createContext<Ctx>({ hoverInfo: null, setHoverInfo: () => {} })

export function HoverInfoProvider({ children }: { children: ReactNode }) {
  const [hoverInfo, setHoverInfoState] = useState<TileHoverInfo | null>(null)
  const setHoverInfo = useCallback((info: TileHoverInfo | null) => {
    setHoverInfoState(info)
  }, [])
  return <Context.Provider value={{ hoverInfo, setHoverInfo }}>{children}</Context.Provider>
}

export function useHoverInfo() {
  return useContext(Context)
}

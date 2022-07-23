import { createContext, ReactNode, useContext, useState } from 'react'

interface CreateCycleData {
  task: string
  minutesAmount: number
}

interface Cycle {
  id: string
  task: string
  minutesAmount: number
  startDate: Date
  interrupetdDate?: Date
  finishedDate?: Date
}

interface CyclesContextType {
  cycles: Cycle[]
  activeCycle: Cycle | undefined
  activeCycleId: string | null
  amountSecondsPassed: number
  markCurrentCycleAsFinished: () => void
  setSecondsPassed: (seconds: number) => void
  createNewCycle: (data: CreateCycleData) => void
  interruptCycle: () => void
}

interface CyclesContextTProviderProps {
  children: ReactNode
}

const CyclesContext = createContext({} as CyclesContextType)
export function useCyclesContext() {
  return useContext(CyclesContext)
}

export function CyclesContextProvider({
  children,
}: CyclesContextTProviderProps) {
  const [cycles, setCycles] = useState<Cycle[]>([])
  const [activeCycleId, setActiveCycleId] = useState<string | null>('')
  const [amountSecondsPassed, setAmountSecondsPassed] = useState(0)
  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)

  function markCurrentCycleAsFinished() {
    setCycles((state) => {
      return state.map((cycle) => {
        if (cycle.id === activeCycleId) {
          return { ...cycle, finishedDate: new Date() }
        } else {
          return cycle
        }
      })
    })
  }

  function setSecondsPassed(seconds: number) {
    setAmountSecondsPassed(seconds)
  }

  function createNewCycle(data: CreateCycleData) {
    const id = String(new Date().getTime())
    const newCycle: Cycle = {
      id,
      startDate: new Date(),
      ...data,
    }

    setActiveCycleId(id)
    setCycles((state) => [...state, newCycle])
    setAmountSecondsPassed(0)

    // reset()
  }

  function interruptCycle() {
    setCycles((state) => {
      return state.map((cycle) => {
        if (cycle.id === activeCycleId) {
          return { ...cycle, interrupetdDate: new Date() }
        } else {
          return cycle
        }
      })
    })
    setActiveCycleId(null)
  }

  return (
    <CyclesContext.Provider
      value={{
        cycles,
        activeCycle,
        activeCycleId,
        markCurrentCycleAsFinished,
        amountSecondsPassed,
        setSecondsPassed,
        createNewCycle,
        interruptCycle,
      }}
    >
      {children}
    </CyclesContext.Provider>
  )
}

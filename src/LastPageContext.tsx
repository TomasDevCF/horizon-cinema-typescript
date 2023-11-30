import { createContext, useState, useMemo, useContext } from "react";

interface ContextValues {
  lastID: string | null
  lastTitle: string | null
  setLastID: any
  setLastTitle: any
}

interface Props {
  children: JSX.Element
}

const LastPageContext = createContext<undefined | ContextValues>(undefined)

export function LastPageContextProvider({children}: Props): JSX.Element {

  const [lastId, setLastId] = useState<string | null>(null)
  const [lastTitle, setLastTitle] = useState<string | null>(null)

  const contextValue: ContextValues = useMemo(() => {
    return ({
      lastID: lastId,
      lastTitle: lastTitle,
      setLastID: setLastId,
      setLastTitle: setLastTitle
    })
  }, [lastId, lastTitle])

  return <LastPageContext.Provider value={contextValue}>
    {children}
  </LastPageContext.Provider>
}

export function useLastPageContext(): ContextValues {
  const context = useContext(LastPageContext)

  if (!context) {
    throw new Error;
  }

  return context
}
import { createContext, useState, useMemo, useContext, useEffect } from "react";
import { SavedMovie } from "../movies";

interface ContextValues {
  saved_movies: SavedMovie[] | null
  setSavedMovies: any
}

interface Props {
  children: JSX.Element
}

const SavedMoviesContext = createContext<undefined | ContextValues>(undefined)

export function SavedMoviesContextProvider({children}: Props): JSX.Element {
  const [savedMovies, setSavedMovies] = useState<SavedMovie[] | null>(null)

  useEffect(() => {
    const storage_saved_movies = localStorage.getItem("saved-movies")
    if (storage_saved_movies) {
      setSavedMovies(JSON.parse(storage_saved_movies))
    }
  }, []);

  useEffect(() => {
    if (savedMovies) {
      localStorage.setItem("saved-movies", JSON.stringify(savedMovies))
    }
  }, [savedMovies]);

  const contextValue: ContextValues = useMemo(() => {
    return ({
      saved_movies: savedMovies,
      setSavedMovies
    })
  }, [savedMovies])

  return <SavedMoviesContext.Provider value={contextValue}>
    {children}
  </SavedMoviesContext.Provider>
}

export function useSavedMoviesContext(): ContextValues {
  const context = useContext(SavedMoviesContext)

  if (!context) {
    throw new Error;
  }

  return context
}
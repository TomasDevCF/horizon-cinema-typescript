import { useEffect, useState } from "react";
import { useFetchMovie } from "../CustomHooks/useFetchMovie";
import { Result } from "../../movies";
import MoviesCategories from "./MoviesCategories";
import { useLastPageContext } from "../LastPageContext";
import Carousel from "./Carousel";

export function calculateMovieDuration(duration: number): `${number}h ${number}min` {
  const hours = duration / 60
  const minutes = duration % 60

  return `${hours}h ${minutes}min`
}

export default function MoviesPage() {
  const { lastID, lastTitle } = useLastPageContext()
  const [carouselData, setCarouselData] = useState<null | Result[]>(null)

  useEffect(() => {
    useFetchMovie('https://api.themoviedb.org/3/movie/now_playing?language=es-AR&page=1')
      .then(r => setCarouselData(r.results.slice(0, 3)))
  }, []);

  return (
    <main>
      <Carousel carouselData={carouselData} />
      <section className="movies-categories">
        <h3 className="text-white text-center py-4">Cartelera de peliculas</h3>
        <MoviesCategories URL="https://api.themoviedb.org/3/movie/popular?language=es-AR&page=1" link="/movies/popular/1" topText="Las peliculas mas populares" />
        <MoviesCategories URL="https://api.themoviedb.org/3/movie/upcoming?language=es-AR&page=1" link="/movies/upcoming/1" topText="Peliculas por salir" />
        <MoviesCategories URL="https://api.themoviedb.org/3/movie/top_rated?language=es-AR&page=1" link="/movies/top_rated/1" topText="Peliculas mejores calificadas" />
        <MoviesCategories URL={`https://api.themoviedb.org/3/movie/${lastID}/recommendations?language=es-AR&page=1`} link={`/recommendations/${lastID}/1`} topText={`Segun tu ultima pelicula (${lastTitle})`} />
      </section>
    </main>
  )
}
import { Link } from "react-router-dom"
import { useEffect, useState } from "react"
import { useFetchMovie } from "../CustomHooks/useFetchMovie"
import { Result } from "../../movies"
import Movie from "./Movie"
import Skeleton from "react-loading-skeleton";
import SkeletonMovieRow from "./SkeletonMovieRow"

interface Props {
  URL: `https://api.themoviedb.org/3/${string}`
  topText: string
  link: string
}

export default function MoviesCategories({URL, topText, link}: Props) {

  const [moviesData, setMoviesData] = useState<null | Result[] | false>(null)

  useEffect(() => {
    setMoviesData(null)
    useFetchMovie(URL)
    .then(r => {
      if (r.results)  {
        setMoviesData(r.results.slice(0,6))
      } else {
        setMoviesData(false)
      }
    })
  }, [URL, link]);

  return (
    <>
      {moviesData != false && <section className="movie-category w-100 pb-4">
        <div className="top-div d-flex justify-content-between w-100">
          <h5 className="ps-2 text-white">{moviesData ? topText : <Skeleton width={260}/>}</h5>
          <Link to={link} className="h5 pe-2 text-primary text-decoration-none">Ver mas</Link>
        </div>
        <section className="movies-section m-0 px-1 row">
          {moviesData ? moviesData.map(movie => <Movie overview={movie.overview} backdrop_path={movie.backdrop_path} id={movie.id} image={movie.poster_path} rating={movie.vote_average} title={movie.title} key={movie.id}/>) : <SkeletonMovieRow/>}
        </section>
      </section>}
    </>
  )
}
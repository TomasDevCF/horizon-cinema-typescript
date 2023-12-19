import { useEffect, useState } from "react"
import { useFetchMovie } from "../CustomHooks/useFetchMovie";
import { Result } from "../../movies";
import { Link } from "react-router-dom";

interface Props {
  topText: string
  URL: `https://api.themoviedb.org/3/${string}`,
  link: string
}

export default function MoviesOption({topText, URL, link}: Props) {

  const [movie, setMovie] = useState<null | Result>(null)

  useEffect(() => {
    useFetchMovie(URL)
      .then(r => setMovie(r.results[0]))
  }, []);
  
  return (
    <Link to={link} className="movie-option col-md-4 col-9 p
    py-3 d-flex flex-column align-items-center">
      <div className="top-text pt-2 pb-3 w-100">
        <p className="text-black text-decoration-none py-1 w-100 px-2">{topText}</p>
      </div>
      <div className="movie-photo">
        <img src={`https://image.tmdb.org/t/p/original${movie && movie.poster_path}`} alt={movie?.title} />
      </div>
    </Link>
  )
}
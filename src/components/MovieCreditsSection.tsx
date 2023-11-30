import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import MovieCredit from "./MovieCredit";
import SkeletonMovieRow from "./SkeletonMovieRow";
import { useFetchMovie } from "../CustomHooks/useFetchMovie";
import { Cast } from "../../movies";

interface Props {
  URL: `https://api.themoviedb.org/3/${string}`
  link: string
}

export default function MovieCreditsSection({URL, link}: Props) {

  const [movieCredits, setMovieCredits] = useState<Cast[] | null>(null)

  useEffect(() => {
    setMovieCredits(null)
    useFetchMovie(URL)
      .then(r => setMovieCredits(r.cast))
  }, [URL, link]);

  return (
    <section className="pt-4">
      <div className="d-flex justify-content-between">
        <div className="top-div d-flex justify-content-between w-100">
          <h5 className="ps-2 text-white">Reparto</h5>
          <Link to={link} className="fs-5 pe-2 text-primary text-decoration-none">Ver todos</Link>
        </div>
      </div>
      <section className="cast-section m-0 px-1 row">
        {movieCredits ? movieCredits.slice(0,6).map(Credit => <MovieCredit character={Credit.character ?? "Desconocido"} image={Credit.profile_path} name={Credit.name ?? "Desconocido"} key={Credit.id}/>) : <SkeletonMovieRow isCastComponent/>}
      </section>
    </section>
  )
}
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { ICategoryTranslate, MovieCredits, MovieDetails, MovieVideo, SocialMedia } from "../../movies";
import { useFetchMovie } from "../CustomHooks/useFetchMovie";
import { calculateStars } from "../HomePage";
import { categoryTranslator } from "./Header";
import MovieCreditsSection from "./MovieCreditsSection";
import MoviesCategories from "./MoviesCategories";
import { useLastPageContext } from "../LastPageContext";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

export function durationToTimeFormat(duration: number): `${number}h ${number}min` {
  const hours = Math.floor(duration / 60)
  const minutes = duration % 60

  return `${hours}h ${minutes}min`
}

function changeDateFormat(date: Date): `${string}/${string}/${string}` {
  const splittedDate = date.toString().split("-")

  return `${splittedDate[0]}/${splittedDate[1]}/${splittedDate[2]}`
}

function numberToMoneyFormat(number: number): `$${string}` {
  const newFormat = number.toString().replace(/(\d)(?=(\d{3})+$)/g, '$1,');
  return `$${newFormat}`
}

export default function MovieInfo() {
  const { setLastID, setLastTitle } = useLastPageContext()
  const { movie_id } = useParams()

  const [isShowMoreOverview, setIsShowMoreOverview] = useState<boolean>(false)

  const [movieData, setMovieData] = useState<null | MovieDetails>(null)
  const [movieCredits, setMovieCredits] = useState<null | MovieCredits>(null)
  const [movieSocialMedia, setMovieSocialMedia] = useState<null | SocialMedia>(null)
  const [movieTrailer, setMovieTrailer] = useState<null | MovieVideo>(null)

  useEffect(() => {
    setMovieData(null)
    setMovieCredits(null)
    setMovieSocialMedia(null)
    setMovieTrailer(null)
    useFetchMovie(`https://api.themoviedb.org/3/movie/${movie_id}?language=es-AR`)
      .then(r => {
        setMovieData(r)
        setLastID(movie_id)
        setLastTitle(r.title)
      });

    useFetchMovie(`https://api.themoviedb.org/3/movie/${movie_id}/credits?language=es-AR`)
      .then(r => setMovieCredits(r))

    useFetchMovie(`https://api.themoviedb.org/3/movie/${movie_id}/external_ids`)
      .then(r => setMovieSocialMedia(r))

    useFetchMovie(`https://api.themoviedb.org/3/movie/${movie_id}/videos?language=es-AR`)
      .then(r => {
        const results: MovieVideo[] = r.results

        for (let i = 0; i < results.length; i++) {
          if (results[i].type === "Trailer" && results[i].official) {
            setMovieTrailer(results[i])
            break
          }
        }
      })
  }, [movie_id]);

  function alternateIsShowMoreOverview() {
    setIsShowMoreOverview(!isShowMoreOverview)
  }

  return (
    <main>
      <section className="backdrop-image w-100 position-relative">
        <div className="w-100 h-100 d-flex justify-content-center align-items-center backdrop-container">
          {movieData?.backdrop_path ? <img src={`https://image.tmdb.org/t/p/original${movieData.backdrop_path}`} className="d-block w-100" alt={movieData.title} /> : <span className="fa-regular fa-image text-white fs-1"></span>}
        </div>
      </section>

      <section className="movie-section p-lg-2 pe-lg-3">
        <Link to="/movies" className="btn btn-primary m-1 fs-6"><span className="fa-solid fa-chevron-left"></span> Regresar</Link>
        <div className="d-flex px-3 py-3 px-lg-0 p-lg-2 w-100 row m-0">
          <div className="movie-section-image-container d-flex justify-content-center align-items-center col-lg-4 col-md-5 p-0 col-12 m-0 mb-2">
            {movieData?.poster_path ? <img src={`https://image.tmdb.org/t/p/original${movieData.poster_path}`} alt={movieData.title} className="movie-section-image" width="100%" /> : <span className="fa-solid fa-image text-white fs-1"></span>}
          </div>
          <div className="ps-md-3 p-0 text-white col-lg-8 col-md-7 col-12">
            <h1 className="fs-2">{movieData ? movieData.title : <Skeleton count={.4} />}</h1>
            <div className="d-flex">
              {movieData ? calculateStars(movieData.vote_average, "fs-3") : <h3><SkeletonTheme baseColor="orange" highlightColor="yellow"><Skeleton width={150} height={30} /></SkeletonTheme></h3>}
              {movieData && <p className="ps-1 fs-5">({movieData.vote_average.toString().slice(0, 3)}/10)</p>}
            </div>
            <div className="d-flex overview">
              <p className={`col-12 row`}> 
              <span className={`${!isShowMoreOverview && "movie-overview col-md-10"}  col-12 col-lg-12 d-block`}>{movieData ? movieData.overview : <Skeleton count={4} />}
              <a onClick={alternateIsShowMoreOverview} className="fs-6 d-lg-none px-2 d-md-inline d-none px-1">{movieData && !isShowMoreOverview ? "Ver todo" : movieData && isShowMoreOverview ? "Ver menos" : <SkeletonTheme baseColor="blue" highlightColor="lightblue"><Skeleton/></SkeletonTheme>}</a>
              </span>

              <a onClick={alternateIsShowMoreOverview} className={`fs-6 d-lg-none ${!isShowMoreOverview && "d-md-inline"} d-none p-0 col-2`}>{movieData && !isShowMoreOverview ? "Ver todo" : movieData && isShowMoreOverview ? "Ver menos" : <SkeletonTheme baseColor="blue" highlightColor="lightblue"><Skeleton/></SkeletonTheme>}</a></p>
              
            </div>
            <div className={`d-flex ${isShowMoreOverview && "d-md-none"} d-lg-flex flex-lg-row flex-column`}>
              <div className="d-flex pe-5 column-1">
                <div className="d-flex flex-column pe-3">
                  <strong className="py-2">Duración</strong>
                  <strong className="py-2">Estreno</strong>
                  <strong className="py-2">Recaudación</strong>
                  <strong className="py-2">Director</strong>
                  <strong className="py-2">Géneros</strong>
                </div>
                <div className="d-flex flex-column">
                  {movieData ? <>
                    <p className="py-2 m-0">{durationToTimeFormat(movieData.runtime)}</p>
                    <p className="py-2 m-0">{changeDateFormat(movieData.release_date)}</p>
                    <p className="py-2 m-0">{movieData.revenue != 0 ? numberToMoneyFormat(movieData.revenue) : "Desconocido"}</p>
                    <p className="py-2 m-0">{movieCredits?.crew.find(c => c.job === "Director")?.name}</p>
                    <p className="py-2 m-0">{movieData.genres.map((g, i) => {
                      return i + 1 != movieData.genres.length ? categoryTranslator[g.id as keyof ICategoryTranslate] + ", " : categoryTranslator[g.id as keyof ICategoryTranslate]
                    })}</p>
                  </> : <>
                    <p className="py-2 m-0"><Skeleton width={100} height={20} /></p>
                    <p className="py-2 m-0"><Skeleton width={100} height={20} /></p>
                    <p className="py-2 m-0"><Skeleton width={100} height={20} /></p>
                    <p className="py-2 m-0"><Skeleton width={100} height={20} /></p>
                    <p className="py-2 m-0"><Skeleton width={170} height={20} /></p>
                  </>}
                </div>
              </div>
              <div className="d-flex flex-column column-2">
                <div className="d-flex">
                  <div className="d-flex flex-column pe-3">
                    <strong className="py-2">Presupuesto</strong>
                    <strong className="py-2">Productor/es</strong>
                  </div>
                  <div className="d-flex flex-column">
                    {movieData ? <>
                      <p className="py-2 m-0">{movieData.budget != 0 ? numberToMoneyFormat(movieData.budget) : "Desconocido"}</p>
                      <p className="py-2 m-0">{movieData.production_companies.map((pc, i) => {
                        return i + 1 != movieData.production_companies.length ? pc.name + ", " : pc.name
                      })}</p>
                    </> : <>
                      <p className="py-2 m-0"><Skeleton width={100} height={20} /></p>
                      <p className="py-2 m-0"><Skeleton width={150} height={20} /></p>
                    </>}
                  </div>
                </div>
                <div className="icons d-flex pt-2">
                  {(movieData && movieSocialMedia) ? <>
                    {movieData.homepage != "" &&
                      <a target="_blank" href={movieData.homepage} className="icon fs-6 d-flex justify-content-center align-items-center fa-sharp fa-solid fa-house-chimney"></a>
                    }
                    {movieSocialMedia?.instagram_id &&
                      <a target="_blank" href={`https://instagram.com/${movieSocialMedia.instagram_id}`} className="icon d-flex justify-content-center align-items-center fa-brands fa-instagram"></a>
                    }
                    {movieSocialMedia?.facebook_id &&
                      <a target="_blank" href={`https://facebook.com/${movieSocialMedia.facebook_id}`} className="icon d-flex justify-content-center align-items-center fa-brands fa-facebook-f"></a>
                    }
                    {movieSocialMedia?.twitter_id &&
                      <a target="_blank" href={`https://twitter.com/${movieSocialMedia.twitter_id}`} className="icon d-flex justify-content-center align-items-center fa-brands fa-x-twitter"></a>
                    }
                  </> : <>
                    <Skeleton containerClassName="px-1" width={25} height={25}></Skeleton>
                    <Skeleton containerClassName="px-1" width={25} height={25}></Skeleton>
                    <Skeleton containerClassName="px-1" width={25} height={25}></Skeleton>
                    <Skeleton containerClassName="px-1" width={25} height={25}></Skeleton>
                  </>}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {movieTrailer ? <div className="trailer d-flex justify-content-center pt-2">
          <iframe width="80%" height="100%" src={`https://www.youtube.com/embed/${movieTrailer.key}`}></iframe>
        </div> : <></>}

        <MovieCreditsSection URL={`https://api.themoviedb.org/3/movie/${movie_id}/credits?language=es-AR`} link={`/casting/${movie_id}/1`}/>

        <MoviesCategories URL={`https://api.themoviedb.org/3/movie/${movie_id}/recommendations?language=es-AR&page=1`} link={`/recommendations/${movie_id}/1`} topText="Recomendadas" />
      </section>
    </main>
  )
}
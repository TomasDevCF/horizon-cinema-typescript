import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useFetchMovie } from "../CustomHooks/useFetchMovie";
import { Cast, ICategoryTranslate, Result, SavedMovie, URLType } from "../../movies";
import { useSavedMoviesContext } from "../SavedMoviesContext";
import Movie from "./Movie";
import { categoryTranslator } from "./Header";
import Carousel from "./Carousel";
import { useLastPageContext } from "../LastPageContext";
import MovieCredit from "./MovieCredit";
import SkeletonMovieRow from "./SkeletonMovieRow";
import { toast } from "react-toastify";

type PageType = "category" | "saved" | "search" | "movieList" | "casting" | "recommended"

interface Props {
  pageType: PageType
}

export default function OnlyMoviesPages({ pageType }: Props) {

  const [carouselData, setCarouselData] = useState<null | Result[] | SavedMovie[]>(null)
  const [data, setData] = useState<null | Result[] | SavedMovie[] | Cast[]>()
  const [totalPages, setTotalPages] = useState<number>(1)
  const { category_id, query, page, movie_id, movie_list_name } = useParams()
  const { saved_movies } = useSavedMoviesContext()
  const { lastTitle } = useLastPageContext()
  const navigate = useNavigate()

  function loadData() {
    if (pageType === "search") {
      fetchByPageType(`https://api.themoviedb.org/3/search/movie?query=${query}&language=es-AR`)
      if (query && query.length >= 23) {
        navigate("/movies")
        toast.error('Ingresa una búsqueda menor a 23 caracteres', {
          position: "top-right",
          autoClose: 1400,
          progress: undefined,
          theme: "dark",
        });
      }
    } else if (pageType === "category") {
      fetchByPageType(`https://api.themoviedb.org/3/discover/movie?language=es-AR&sort_by=popularity.desc&with_genres=${category_id}`)
    } else if (pageType === "casting") {
      fetchByPageType(`https://api.themoviedb.org/3/movie/${movie_id}/credits?language=es-AR`)
    } else if (pageType === "movieList") {
      fetchByPageType(`https://api.themoviedb.org/3/movie/${movie_list_name}?language=es-AR`)
    } else if (pageType === "recommended") {
      fetchByPageType(`https://api.themoviedb.org/3/movie/${movie_id}/recommendations?language=es-AR`)
    }
  }

  function fetchByPageType(URL: URLType) {
    if (page) {
      if (pageType !== "casting") {
        useFetchMovie(`${URL}&page=${parseInt(page) * 3 - 2}`)
          .then(r => {
            useFetchMovie(`${URL}&page=${parseInt(page) * 3 - 1}`)
              .then(r2 => {
                useFetchMovie(`${URL}&page=${parseInt(page) * 3}`)
                  .then(r3 => {
                    if (r.total_results !== 0 && (pageType === "search" || pageType === "saved" || pageType === "category")) {
                      if (r.length <= 3) {
                        setCarouselData(r.results.slice(0, r.length))
                      } else {
                        setCarouselData(r.results.slice(0, 3))
                      }
                    }
                    setData([...r.results, ...r2.results.slice(1), ...r3.results.slice(1)])
                    setTotalPages(Math.round(r3.total_pages / 3))
                  })
              })
          })
      } else {
        useFetchMovie(URL)
          .then(r => {
            if (r.cast.length === 0) {
              return navigate("/movies")
            }
            setData(r.cast)
            setTotalPages(Math.round(r.cast.length / 60))
          })
      }
    }
  }

  useEffect(() => {
    if (data?.length == 0) {
      navigate("/movies")
      toast.error('No se han encontrado resultados.', {
        position: "top-right",
        autoClose: 1400,
        progress: undefined,
        theme: "dark",
      });
    }
  }, [data]);

  function chooseText(): string {
    return pageType === "saved" ? "Películas guardadas"
      : pageType === "category" && category_id ? `Películas de la categoría: "${categoryTranslator[parseInt(category_id) as keyof ICategoryTranslate]}"`
        : pageType === "search" ? `Películas para tu búsqueda: "${query}"`
          : pageType === "movieList" ? `Películas ${movie_list_name === "popular" ? "mas populares" : movie_list_name === "top_rated" ? "mejores calificadas" : movie_list_name === "upcoming" ? "por salir" : `según tu última película (${lastTitle})`}`
            : pageType === "casting" && data ? `Reparto`
              : `Recomendadas`
  }

  useEffect(() => {
    if (pageType === "saved") {
      if (page && saved_movies?.length) {
        if (saved_movies.length <= 3) {
          setCarouselData(saved_movies.slice(0, saved_movies.length))
        } else {
          setCarouselData(saved_movies.slice(0, 3))
        }
        console.log(saved_movies);
        setTotalPages(1)
        setData(null)
        setData(saved_movies?.slice(60 * (parseInt(page) - 1), 60 * parseInt(page)))
        setTotalPages(Math.floor(saved_movies?.length / 60))
      } else if ((!saved_movies || saved_movies.length == 0) && pageType === "saved") {
        navigate("/movies")
      }
    } else {
      loadData()
    }
  }, [category_id, query, page, pageType, saved_movies]);

  useEffect(() => {
    if (pageType !== "saved") {
      setTotalPages(1)
      setData(null)
      setCarouselData(null)
    }
  }, [pageType, page, category_id, query]);

  function calculateLinkPath(quantityOnSum: number): string {
    if (page) {
      const nextPage = parseInt(page) + quantityOnSum
      if (pageType === "category") {
        return `/category/${category_id}/${nextPage}`
      } else if (pageType === "search") {
        return `/search/${query}/${nextPage}`
      } else if (pageType === "saved") {
        return `/saved/${nextPage}`
      } else if (pageType === "casting") {
        return `/casting/${movie_id}/${nextPage}`
      } else if (pageType === "movieList") {
        return `/movies/${movie_list_name}/${nextPage}`
      } else {
        return `/recommendations/${movie_id}/${nextPage}`
      }
    } else {
      return "/movies"
    }
  }

  return (
    <main className={`w-100 ${(pageType === "casting" || pageType === "movieList" || pageType === "recommended") && "padding-header"}`}>
      {(pageType === "category" || pageType === "saved" || pageType === "search") && <Carousel carouselData={carouselData} pageType={pageType} />}
      <div className="d-flex justify-content-between flex-md-row flex-column align-items-center text-md-start text-center pt-3 px-2">
        <Link className="fs-5 h-75 d-block btn btn-primary my-md-0 my-2" to={movie_id ? `/movie/${movie_id}` : "/movies"}>Regresar</Link>
        <h3 className="text-white">{chooseText()}</h3>
        <p></p>
      </div>
      <section className="movies-section row m-0 pt-3 px-2">
        {data ? data.map((item, index) => {
          if ("character" in item) {
            const cast = item as Cast
            return (
              <MovieCredit
                character={cast.character ?? "Desconocido"}
                image={cast.profile_path ?? null}
                name={cast.name}
                key={cast.id}
              />
            )
          } else {
            const movie = item as Result | SavedMovie
            return (
              <Movie
                overview={movie.overview}
                backdrop_path={movie.backdrop_path ?? null}
                id={movie.id}
                image={movie.poster_path ?? null}
                rating={movie.vote_average}
                title={movie.title}
                key={index}
              />
            )
          }
        }) : <><SkeletonMovieRow /><SkeletonMovieRow /></>}
      </section>
      {page && <section className="pagination-section px-3">
        <nav aria-label="Page navigation">
          <ul className="pagination justify-content-end">

            {parseInt(page) - 1 > 0 && <li className="page-item">
              <Link aria-hidden="true" className="page-link" to={calculateLinkPath(-1)}>
                <span className="fa-solid fa-chevron-left"></span>
              </Link>
            </li>}
            {parseInt(page) - 2 > 0 && <li className="page-item"><Link to={calculateLinkPath(-2)} className="page-link">{parseInt(page) - 2}</Link></li>}
            {parseInt(page) - 1 > 0 && <li className="page-item"><Link to={calculateLinkPath(-1)} className="page-link">{parseInt(page) - 1}</Link></li>}
            <li className="page-item disabled"><Link to={calculateLinkPath(0)} className="page-link">{page}</Link></li>
            {parseInt(page) + 1 <= totalPages && <li className="page-item"><Link to={calculateLinkPath(1)} className="page-link">{parseInt(page) + 1}</Link></li>}
            {parseInt(page) + 2 <= totalPages && <li className="page-item"><Link to={calculateLinkPath(2)} className="page-link">{parseInt(page) + 2}</Link></li>}
            {parseInt(page) + 1 <= totalPages && <li className="page-item">
              <Link to={calculateLinkPath(1)} className="page-link" aria-hidden="true">
                <span className="fa-solid fa-chevron-right"></span>
              </Link>
            </li>}
          </ul>
        </nav>
      </section>}
    </main >
  )
}
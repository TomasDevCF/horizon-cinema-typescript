import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react";
import { calculateStars } from "../HomePage"
import { useSavedMoviesContext } from "../SavedMoviesContext"

interface Props {
  image: string | null
  rating: number
  title: string
  id: string
  backdrop_path: string | null
  overview: string
}

export default function Movie({id, image, rating, title, backdrop_path, overview}: Props) {
  const navigate = useNavigate()
  const [isMovieSaved, setIsMovieSaved] = useState<boolean>(false)
  const {saved_movies, setSavedMovies} = useSavedMoviesContext()

  useEffect(() => {
    if (saved_movies) {
      setIsMovieSaved(saved_movies.find(movie => movie.id == id) ? true : false)
    }
  }, [saved_movies])

  function alternateSaved() {
    
    if (isMovieSaved) {
      if (saved_movies) {
        setSavedMovies(saved_movies.filter(movie => movie.id != id))
      }
    } else {
      if (saved_movies) {
        setSavedMovies([...saved_movies, {
          id: id,
          title,
          poster_path: image,
          backdrop_path,
          vote_average: rating,
          overview
        }])
      } else {
        setSavedMovies([{
          id: id,
          title,
          poster_path: image,
          backdrop_path,
          vote_average: rating,
          overview
        }])
      }
    }
  }

  return (
    <div className="padding-container col-lg-2 col-md-4 col-sm-6 col-12 px-4 px-lg-1 py-1">
      <div className="position-relative movie w-100 p-0 overflow-hidden" >
        <div className=" image-container d-flex justify-content-center align-items-center" onClick={() => navigate(`/movie/${id}`)} >
            {image ? <img src={`https://image.tmdb.org/t/p/w300${image}`} className="movie-image" alt={title} width="100%"/> : <span className="fa-solid fa-image text-white fs-1"></span>}
        </div>
        <div className="save-movie position-absolute rounded-5 rounded">
            <span className={`fs-4 fa-${isMovieSaved ? "solid movie-saved" : "regular"} fa-bookmark z-3`} onClick={alternateSaved}></span>
          </div>
        <div className=" px-1 movie-info">
          <p className="text-white m-0 py-1 ellipsis">{title}</p>
          <div className="stars d-flex">
            {calculateStars(rating, "fs-6").map(star => star)}
          </div>
        </div>
      </div>
    </div>
  )
}
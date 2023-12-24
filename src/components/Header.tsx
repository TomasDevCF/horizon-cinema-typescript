import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useFetchMovie } from "../CustomHooks/useFetchMovie";
import { Genres, ICategoryTranslate } from "../../movies"
import { toast } from "react-toastify"
import { useSavedMoviesContext } from "../SavedMoviesContext";

export const categoryTranslator: ICategoryTranslate = {
  878: "Ciencia Ficcion",
  10770: "Pelicula de TV",
  28: "Accion",
  12: "Aventura",
  16: "Animacion",
  35: "Comedia",
  80: "Policial",
  99: "Documental",
  18: "Drama",
  10751: "Familiar",
  14: "Fantasia",
  36: "Historia",
  27: "Terror",
  10402: "Musical",
  9648: "Misterio",
  10749: "Romance",
  53: "Suspenso",
  10752: "Guerras",
  37: "Vaqueros"
}

export default function Header() {
  const [categoriesActived, setCategoriesActived] = useState(false)
  const [categories, setCategories] = useState<Genres | null>(null)

  const [searchQuery, setSearchQuery] = useState<string>("")
  const [isMenuOpened, setIsMenuOpened] = useState<boolean>(false)

  const navigate = useNavigate()
  const location = useLocation()

  const {saved_movies} = useSavedMoviesContext()

  useEffect(() => {
    useFetchMovie("https://api.themoviedb.org/3/genre/movie/list?language=en")
      .then(r => {
        setCategories(r)
      })
  }, []);

  useEffect(() => {
    setCategoriesActived(false)
    setIsMenuOpened(false)
  }, [location.pathname]);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if (searchQuery.length < 23) {
      navigate(`/search/${searchQuery}/1`)
    } else {
      toast.error('Ingersa una busqueda menor a 23 caracteres.', {
        position: "top-right",
        autoClose: 1400,
        progress: undefined,
        theme: "dark",
      });
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault()

    setSearchQuery(e.target.value)
  }

  const alternateIsMenuOpened = () => setIsMenuOpened(!isMenuOpened)

  function savedLinkClick(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) {
    alternateIsMenuOpened()
    e.preventDefault()
    if (!saved_movies || saved_movies.length === 0) {
      toast.error('No tienes peliculas guardadas.', {
        position: "top-right",
        autoClose: 1400,
        progress: undefined,
        theme: "dark",
      });
    } else {
      navigate("/saved/1")
    }
  }

  return (
    <header className="w-100 py-3 px-2 d-flex flex-row align-items-center">
      <section className="left-section-responsive-menu d-block d-lg-none col-1">
        <span onClick={alternateIsMenuOpened} className="fa-solid menu-icon fa-bars fs-3"></span>
        {isMenuOpened && <>
          <section className="categories-menu position-absolute p-2 top-0 vh-100 d-flex flex-column z-2">
            <div className="title pb-3">
              <Link onClick={alternateIsMenuOpened} to="/" className="h3 text-decoration-none pe-2" style={{ color: "#1c3166" }}>Horizon Cinema</Link>
            </div>
            <Link onClick={savedLinkClick} className="text-warning fs-5 py-2 text-decoration-none header-link" to="/saved/1"><span className="fa-regular fa-bookmark"></span> Guardados</Link>
            <Link onClick={alternateIsMenuOpened} className="text-primary fs-5 py-2 text-decoration-none header-link" to="/movies"><span className="fa-sharp fa-solid fa-film"></span> Cartelera</Link>
            <p onClick={() => setCategoriesActived(!categoriesActived)} className="m-0 text-danger fs-5 py-2 text-decoration-none header-link"><span className={`fa-solid fa-caret-${categoriesActived ? "up" : "down"}`}></span> Categorías</p>
            {categoriesActived && <div className="overflow-auto">
              {categories && categories.genres.map(genre => {
                return <div className="category rounded text-center my-1 py-1"><Link to={`/category/${genre.id}/1`} className="h7 m-0 text-decoration-none text-black" onClick={alternateIsMenuOpened}>{categoryTranslator[genre.id as keyof ICategoryTranslate]}</Link></div>
              })}
            </div>}
          </section>
          <div className="close-menu position-absolute vh-100 vw-100 top-0 categories-menu bg-transparent z-1" onClick={alternateIsMenuOpened}>
          </div>
        </>}
      </section>
      <section className="left-section col-lg-4 d-none d-lg-block">
        <Link to="/" className="h3 text-decoration-none px-2" style={{ color: "#1c3166" }}>Horizon Cinema</Link>
      </section>
      <section className="center-section col-lg-4 position-relative d-none align-items-center justify-content-around d-lg-flex">
        <Link onClick={savedLinkClick} className="text-black text-decoration-none header-link" to="/saved/1"><span className="fa-regular fa-bookmark"></span> Guardados</Link>
        <Link className="text-black text-decoration-none header-link" to="/movies"><span className="fa-sharp fa-solid fa-film"></span> Cartelera</Link>
        <p onClick={() => setCategoriesActived(!categoriesActived)} className="m-0 text-black text-decoration-none header-link"><span className={`fa-solid fa-caret-${categoriesActived ? "up" : "down"}`}></span> Categorías</p>
        {categoriesActived && <div className="categories position-absolute rounded d-flex flex-column align-items-center px-2 py-2">
          {categories && categories.genres.map(genre => {
            return <div className="category rounded text-center my-1 py-1"><Link to={`/category/${genre.id}/1`} className="h7 m-0 text-decoration-none text-black">{categoryTranslator[genre.id as keyof ICategoryTranslate]}</Link></div>
          })}
        </div>}
      </section>
      <form onSubmit={handleSubmit} className="right-section col-lg-4 col-11 d-flex justify-content-lg-end justify-content-center">
        <span className="search-input px-1 py-1 rounded">
          <span className="fa-solid fa-magnifying-glass"></span>
          <input type="search" placeholder="Buscar..." onChange={handleChange} className="ps-1" />
        </span>
      </form>
    </header>
  )
}
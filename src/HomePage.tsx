import { useEffect, useState } from "react"
import { Result } from "../movies"
import { useFetchMovie } from "./CustomHooks/useFetchMovie";
import Carousel from "./components/Carousel";
import MoviesCategories from "./components/MoviesCategories";

export function calculateStars(rating: number, className: string = "fs-4"): JSX.Element[] {
  let stars: JSX.Element[] = []

  rating = rating / 2
  for (let i = 1; i <= 5; i++) {
    if (rating == 0) {
      stars.push(<span className={`fa-regular fa-star text-warning ${className}`} key={i}></span>)
      stars.push(<span className={`fa-regular fa-star text-warning ${className}`} key={i}></span>)
      stars.push(<span className={`fa-regular fa-star text-warning ${className}`} key={i}></span>)
      stars.push(<span className={`fa-regular fa-star text-warning ${className}`} key={i}></span>)
      stars.push(<span className={`fa-regular fa-star text-warning ${className}`} key={i}></span>)
      break
    }

    if (i <= rating || i <= rating + 1 && rating % (i - 1) > .50) {
      stars.push(<span className={`fa-solid fa-star text-warning ${className}`} key={i}></span>);
    } else if (rating % (i - 1) <= .50) {
      stars.push(<span className={`fa-solid fa-star-half-stroke text-warning ${className}`} key={i}></span>);
    } else {
      stars.push(<span className={`fa-regular fa-star text-warning ${className}`} key={i}></span>);
    }
  }

  return stars
}


function HomePage() {

  const [carouselData, setCarouselData] = useState<null | Result[]>(null)

  useEffect(() => {
    useFetchMovie("https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=es-AR&page=1&sort_by=popularity.desc")
      .then(r => setCarouselData(r.results.slice(0, 3)))
  }, []);

  return (
    <main className="homepage">
      <Carousel carouselData={carouselData} />
      <div className="pt-2">
        <MoviesCategories URL="https://api.themoviedb.org/3/movie/popular?language=es-AR&page=1" link="/movies/popular/1" topText="Las peliculas mas populares" />
      </div>
    </main>
  )
}

export default HomePage

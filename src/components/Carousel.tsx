import { Link } from "react-router-dom";
import { Result, SavedMovie } from "../../movies";
import { useEffect, useState } from "react"
import { calculateStars } from "../HomePage";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

interface Props {
  carouselData: Result[] | SavedMovie[] | null
  pageType?: "category" | "saved" | "search" | "movieList" | "casting" | "recommended"
}

export default function Carousel({ carouselData, pageType }: Props) {
  const [actualCarouselItem, setActualCarouselItem] = useState<number>(0)

  function changeActualCarouselItem(changeType: "prev" | "next") {
    if (carouselData?.length) {
      if (changeType == "next") {
        if (actualCarouselItem == (carouselData?.length >= 3 ? 2 : carouselData?.length - 1)) {
          setActualCarouselItem(0)
        } else {
          setActualCarouselItem(actualCarouselItem + 1)
        }
      } else {
        if (actualCarouselItem == 0) {
          setActualCarouselItem(carouselData?.length >= 3 ? 2 : carouselData?.length - 1)
        } else {
          setActualCarouselItem(actualCarouselItem - 1)
        }
      }
    }
  }

  useEffect(() => {
    setActualCarouselItem(0)
  }, [carouselData, pageType]);

  return (

    <section className={`welcome-section position-relative w-100 vh-100`}>
      <div id="moviescarousel" className="carousel slide w-100 h-100">
        <div className="carousel-inner w-100 h-100">
          {carouselData &&
            <>
              {carouselData[0]?.backdrop_path ? <div className="carousel-item active">
                <img loading="lazy" src={`https://image.tmdb.org/t/p/original${carouselData[0].backdrop_path}`} className="d-block w-100" alt={carouselData[0].title} />
              </div> : <div className="vw-100 carousel-item">
                <span className="fa-solid fa-image"></span>
              </div>}
              {carouselData[1]?.backdrop_path ? <div className="carousel-item">
                <img loading="lazy" src={`https://image.tmdb.org/t/p/original${carouselData[1].backdrop_path}`} className="d-block w-100" alt={carouselData[1].title} />
              </div> : <div className="h-100 carousel-item">
              </div>}
              {carouselData[2]?.backdrop_path ? <div className="carousel-item">
                <img loading="lazy" src={`https://image.tmdb.org/t/p/original${carouselData[2].backdrop_path}`} className="d-block w-100" alt={carouselData[2].title} />
              </div> : <div className="vw-100 d-flex justify-content-center align-items-center carousel-item">
                <span className="fa-solid fa-image"></span>
              </div>}
            </>}
        </div>
        <button className="carousel-control-prev" type="button" data-bs-target="#moviescarousel" data-bs-slide="prev" onClick={() => changeActualCarouselItem("prev")}>
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#moviescarousel" data-bs-slide="next" onClick={() => changeActualCarouselItem("next")}>
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>
      <div className="welcome-text text-center position-absolute flex-column justify-content-center align-items-center w-100 h-100 top-0 text-white">
        <h3>{carouselData ? carouselData[actualCarouselItem].title : <Skeleton width={300} />}</h3>
        <p className="text-center d-none d-md-block w-75 movie-overview">{carouselData ? carouselData[actualCarouselItem].overview : <Skeleton count={5} />}</p>
        <div className="w-75 d-flex justify-content-evenly align-items-center flex-md-row flex-column buttons-carousel">
          {carouselData && <Link to={`/movie/${carouselData[actualCarouselItem].id}`} className="btn btn-secondary col-9 col-md-auto mb-1"><span className="fa-solid fa-play"></span> Ver mas información</Link>}
          <div className={`stars d-none align-items-center d-lg-flex`}>
            {carouselData ? calculateStars(carouselData[actualCarouselItem].vote_average).map(star => star) : <SkeletonTheme baseColor="orange" highlightColor="yellow"><Skeleton width={100} height={25} /></SkeletonTheme>}
          </div>
          {carouselData && <Link to="/movies" className="btn btn-primary col-9 col-md-auto mt-1"><span className="fa-solid fa-film"></span> Ver películas</Link>}
        </div>
      </div>
    </section>
  )
}
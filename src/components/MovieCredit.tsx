interface Props {
  image: string | null;
  name: string;
  character: string;
}

export default function MovieCredit({image, name, character}: Props) {
  return (
    <div className="padding-container col-lg-2 col-md-4 col-sm-6 col-12 px-4 px-lg-1 py-1">
      <div className="cast w-100 p-0">
        <div className="position-relative overflow-hidden image-container d-flex justify-content-center align-items-center">
          {image ? <img src={`https://image.tmdb.org/t/p/w300${image}`} className="movie-image" alt={name} width="100%"/> : <span className="fa-solid fa-image-portrait text-white fs-1"></span>}
        </div>
        <div className="px-1 cast-info">
          <p className="text-white m-0 ellipsis">{name}</p>
          <p className="character-text m-0 ellipsis">{character}</p>
        </div>
      </div>
    </div>
  )
}
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

interface Props {
  isCastComponent?: boolean | null
}

export default function SkeletonMovie({ isCastComponent }: Props) {
  return (
    <div className="padding-container col-lg-2 col-md-4 col-sm-6 col-12 px-4 px-lg-1 py-1">
      <div className="position-relative movie w-100 p-0 overflow-hidden" >
        <div className="image-container d-flex justify-content-center align-items-center skeleton-image">
        </div>
        <div className=" px-1 movie-info">
          <p className="text-white m-0 py-1 ellipsis"><Skeleton count={1} /></p>
          {!isCastComponent ? <div className="stars">
            <SkeletonTheme baseColor="orange" highlightColor="yellow">
              <Skeleton count={.5}></Skeleton>
            </SkeletonTheme>
          </div> : <p><Skeleton baseColor="gray" highlightColor="white" /></p>}
        </div>
      </div>
    </div>
  )
}
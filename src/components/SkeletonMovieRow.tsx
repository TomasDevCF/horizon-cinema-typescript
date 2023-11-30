import SkeletonMovie from "./SkeletonMovie";

interface Props {
  isCastComponent?: boolean
}

export default function SkeletonMovieRow({isCastComponent}: Props) {
  return (
    <>
      <SkeletonMovie isCastComponent={isCastComponent}/>
      <SkeletonMovie isCastComponent={isCastComponent}/>
      <SkeletonMovie isCastComponent={isCastComponent}/>
      <SkeletonMovie isCastComponent={isCastComponent}/>
      <SkeletonMovie isCastComponent={isCastComponent}/>
      <SkeletonMovie isCastComponent={isCastComponent}/>
    </>
  )
}
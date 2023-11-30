export interface ICategoryTranslate {
  28: string
  12: string
  16: string
  35: string
  80: string
  99: string
  18: string
  10751: string
  14: string
  36: string
  27: string
  10402: string
  9648: string
  10749: string
  878: string
  10770: string
  53: string
  10752: string
  37: string
  
}

export interface UsersList {
  page:          number;
  results:       Result[];
  total_pages:   number;
  total_results: number;
}

export interface Result {
  adult:             boolean;
  backdrop_path:     string | null;
  genre_ids:         number[];
  id:                string;
  original_language: string;
  original_title:    string;
  overview:          string;
  popularity:        number;
  poster_path:       string | null;
  release_date:      Date;
  title:             string;
  video:             boolean;
  vote_average:      number;
  vote_count:        number;
}

export interface Genres {
  genres: Genre[];
}

export interface Genre {
  id:   number;
  name: string;
}

export interface MovieDetails {
  adult:                 boolean;
  backdrop_path:         string;
  belongs_to_collection: BelongsToCollection;
  budget:                number;
  genres:                Genre[];
  homepage:              string;
  id:                    number;
  imdb_id:               string;
  original_language:     string;
  original_title:        string;
  overview:              string;
  popularity:            number;
  poster_path:           string;
  production_companies:  ProductionCompany[];
  production_countries:  ProductionCountry[];
  release_date:          Date;
  revenue:               number;
  runtime:               number;
  spoken_languages:      SpokenLanguage[];
  status:                string;
  tagline:               string;
  title:                 string;
  video:                 boolean;
  vote_average:          number;
  vote_count:            number;
}

export interface BelongsToCollection {
  id:            number;
  name:          string;
  poster_path:   string;
  backdrop_path: string;
}

export interface ProductionCompany {
  id:             number;
  logo_path:      null | string;
  name:           string;
  origin_country: string;
}

export interface ProductionCountry {
  iso_3166_1: string;
  name:       string;
}

export interface SpokenLanguage {
  english_name: string;
  iso_639_1:    string;
  name:         string;
}

export interface MovieCredits {
  id:   number;
  cast: Cast[];
  crew: Cast[];
}

export interface Cast {
  adult:                boolean;
  gender:               number;
  id:                   number;
  known_for_department: Department;
  name:                 string;
  original_name:        string;
  popularity:           number;
  profile_path:         null | string;
  cast_id?:             number;
  character?:           string;
  credit_id:            string;
  order?:               number;
  department?:          Department;
  job?:                 string;
}

export enum Department {
  Acting = "Acting",
  Art = "Art",
  Camera = "Camera",
  CostumeMakeUp = "Costume & Make-Up",
  Crew = "Crew",
  Directing = "Directing",
  Editing = "Editing",
  Lighting = "Lighting",
  Production = "Production",
  Sound = "Sound",
  VisualEffects = "Visual Effects",
  Writing = "Writing",
}

export interface SocialMedia {
  id:           number;
  imdb_id:      string | null;
  wikidata_id:  string | null;
  facebook_id:  string | null;
  instagram_id: string | null;
  twitter_id:   string | null;
}

export interface MovieVideo {
  iso_639_1: string;
  iso_3166_1: string;
  name: string;
  key: string;
  site: string;
  size: number;
  type: string;
  official: boolean;
  published_at: string;
  id: string
}

export interface SavedMovie {
  id: string 
  title: string
  poster_path: string | null
  backdrop_path: string | null
  vote_average: number
  overview: string
}

export type URLType = `https://api.themoviedb.org/3/${string}`
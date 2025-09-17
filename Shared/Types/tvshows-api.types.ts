export type TvshowRecommendationType = {
  adult: boolean;
  backdrop_path: string;
  id: number;
  name: string;
  original_name: string;
  overview: string;
  poster_path: string;
  media_type: "tv";
  original_language: string;
  genre_ids: number[];
  popularity: number;
  first_air_date: string;
  vote_average: number;
  vote_count: number;
  origin_country: string[];
};

export type OneTvshowDetailsType = {
  adult: boolean; // Defaults to true
  backdrop_path: string | null;
  created_by: Array<{
    id: number; // Defaults to 0
    credit_id: string;
    name: string;
    gender: number; // Defaults to 0
    profile_path: string | null;
  }>;
  episode_run_time: number[]; // Array of integers
  first_air_date: string; // Date format "YYYY-MM-DD"
  genres: Array<{
    id: number; // Defaults to 0
    name: string;
  }>;
  homepage: string;
  id: number; // Defaults to 0
  in_production: boolean; // Defaults to true
  languages: string[];
  last_air_date: string; // Date format "YYYY-MM-DD"
  last_episode_to_air: {
    id: number; // Defaults to 0
    name: string;
    overview: string;
    vote_average: number; // Defaults to 0
    vote_count: number; // Defaults to 0
    air_date: string; // Date format "YYYY-MM-DD"
    episode_number: number; // Defaults to 0
    episode_type: string;
    production_code: string;
    runtime: number; // Defaults to 0
    season_number: number; // Defaults to 0
    show_id: number; // Defaults to 0
    still_path: string | null;
  };
  name: string;
  next_episode_to_air: string | null;
  networks: Array<{
    id: number;
    logo_path: string | null;
    name: string;
    origin_country: string;
  }>;
  number_of_episodes: number;
  number_of_seasons: number;
  origin_country: string[];
  original_language: string;
  original_name: string;
  overview: string;
  popularity: number;
  poster_path: string | null;
  production_companies: Array<{
    id: number;
    logo_path: string | null;
    name: string;
    origin_country: string;
  }>;
  production_countries: Array<{
    iso_3166_1: string;
    name: string;
  }>;
  seasons: Array<{
    air_date: string; // Date format "YYYY-MM-DD"
    episode_count: number;
    id: number;
    name: string;
    overview: string;
    poster_path: string | null;
    season_number: number;
    vote_average: number;
  }>;
  spoken_languages: Array<{
    english_name: string;
    iso_639_1: string;
    name: string;
  }>;
  status: string;
  tagline: string;
  type: string;
  vote_average: number;
  vote_count: number;
};

export type TrendingTvShowsType = {
  adult: boolean;
  backdrop_path: string | null;
  id: number;
  name: string;
  original_language: string;
  original_name: string;
  overview: string;
  poster_path: string | null;
  media_type: string;
  genre_ids: number[];
  popularity: number;
  first_air_date: string;
  vote_average: number;
  vote_count: number;
  origin_country: string[];
};

// ! tv shows seasons and episodes types
type TvShowEpisodeCrewMember = {
  department: string;
  job: string;
  credit_id: string;
  adult: boolean; // default: true
  gender: number; // default: 0
  id: number; // default: 0
  known_for_department: string;
  name: string;
  original_name: string;
  popularity: number; // default: 0
  profile_path: string;
};

type TvShowEpisodeGuestStar = {
  character: string;
  credit_id: string;
  order: number; // default: 0
  adult: boolean; // default: true
  gender: number; // default: 0
  id: number; // default: 0
  known_for_department: string;
  name: string;
  original_name: string;
  popularity: number; // default: 0
  profile_path: string;
};

export type TvShowEpisodeType = {
  air_date: string;
  episode_number: number; // default: 0
  id: number; // default: 0
  name: string;
  overview: string;
  production_code: string;
  runtime: number; // default: 0
  season_number: number; // default: 0
  show_id: number; // default: 0
  still_path: string;
  vote_average: number; // default: 0
  vote_count: number; // default: 0
  crew: TvShowEpisodeCrewMember[];
  guest_stars: TvShowEpisodeGuestStar[];
};

export type TvshowSeasonDetailsTypes = {
  _id: string;
  air_date: string;
  episodes: TvShowEpisodeType[];
  name: string;
  overview: string;
  id: number; // default: 0
  poster_path: string;
  season_number: number; // default: 0
  vote_average: number; // default: 0
};

import { URLType } from "../../movies";

export async function useFetchMovie(URL: URLType) {
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2MTFmZWEzZDJiNjM1NDkwYjZmMDIyNjU5MjE4Y2JmOSIsInN1YiI6IjY0YzZjNGYxOTVjZTI0MDEwMTJmYTQ3YiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.LUn4EW9aJJ7WVXkEoCb3y8v34qWlrD7wkXvl6stkDQM'
    }
  };
  
  try {
    const res = await fetch(URL, options);
    const r = await res.json();
  
    return r;
  } catch (error) {
    console.error("Ha ocurrido un error al realizar la solicitud:", error);
    throw error
  }
}

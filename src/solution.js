import React from "react";
import {
  BrowserRouter,
  Switch,
  Route,
  Link,
  useParams,
  useLocation,
  useHistory,
} from "react-router-dom";
import * as api from "./api";

function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/movies">View all movies</Link>
      </nav>
      <main>
        <Switch>
          <Route path="/" exact>
            <Home />
          </Route>
          <Route path="/movies" exact>
            <AllMovies />
          </Route>
          <Route path="/movies/:id">
            <MovieDetails />
          </Route>
          <Route path="/search">
            <Search />
          </Route>
          <Route exact>
            <h1>Not found</h1>
          </Route>
        </Switch>
      </main>
    </BrowserRouter>
  );
}

function Home() {
  // history object lets us manually navigate to new paths
  const history = useHistory();
  return (
    <div>
      <h1>Movie App</h1>
      <p>You can learn about movies and stuff</p>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          const query = event.target.elements.search.value;
          // navigate to /search route with user-entered value in searchParam
          history.push("/search?" + query);
        }}
      >
        <input
          type="search"
          name="search"
          aria-label="Search movies"
          placeholder="Search movies"
        />
      </form>
    </div>
  );
}

function AllMovies() {
  const movies = api.getAllMovies();
  return (
    <>
      <h1>All movies</h1>
      <ul>
        {movies.map((movie) => (
          <li key={movie.id}>
            <a href={"/movies/" + movie.id}>{movie.title}</a>
          </li>
        ))}
      </ul>
    </>
  );
}

function MovieDetails() {
  // params are placeholders in the path marked with a colon (:)
  const params = useParams();
  const id = parseInt(params.id, 10); // turn string into number
  const movie = api.getMovie(id);
  return (
    <>
      <h1>{movie.title}</h1>
      <ul>
        <li>{movie.release_year}</li>
        <li>Rated {movie.rating_name}</li>
        <li>{movie.running_time} mins</li>
      </ul>
    </>
  );
}

function Search() {
  // location object represents current URL
  const location = useLocation();
  // allows us to access key/value pairs after ? in URL
  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get("query");
  const movies = api.searchMovies(query);
  return (
    <>
      <h1>Search results</h1>
      <ul>
        {movies.map((movie) => (
          <li key={movie.id}>
            <a href={"/movies/" + movie.id}>{movie.title}</a>
          </li>
        ))}
      </ul>
    </>
  );
}

export default App;

import React from 'react';
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
      <Switch>
        <Route path="/" exact>
          <MovieList />
        </Route>
        <Route path="/movie/:id">
          <Movie />
        </Route>
        <Route path="/search">
          <Search />
        </Route>
        <Route exact>
          <h1>Not found</h1>
        </Route>
      </Switch>
    </BrowserRouter>
  );
}

function MovieList() {
  const movies = api.getAllMovies();
  const history = useHistory();
  return (
    <div>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          const query = event.target.elements.search.value;
          const search = new URLSearchParams({ query }).toString();
          history.push({
            pathname: "/search",
            search,
          });
        }}
      >
        <input
          type="search"
          name="search"
          aria-label="Search movies"
          placeholder="Search movies"
        />
      </form>
      <ul>
        {movies.map((movie) => (
          <li key={movie.id}>
            <Link to={`/movie/${movie.id}`}>{movie.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Movie() {
  const { id } = useParams();
  const movie = api.getMovie(+id);
  return (
    <article>
      <h1>{movie.title}</h1>
    </article>
  );
}

function Search() {
  const location = useLocation();
  const search = new URLSearchParams(location.search);
  const query = search.get("query");
  const movies = api.searchMovies(query);
  return (
    <ul>
      {movies.map((movie) => (
        <li key={movie.id}>
          <Link to={`/movie/${movie.id}`}>{movie.title}</Link>
        </li>
      ))}
    </ul>
  );
}

export default App;

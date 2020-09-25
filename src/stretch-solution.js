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
import { useAllMovies, useMovie, useSearchMovies } from "./api";

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
  const { status, data } = useAllMovies();
  const history = useHistory();
  if (status === "loading") return <div>Loading...</div>;
  if (status === "error") return <div>Something went wrong</div>;
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
        {data.map((movie) => (
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
  const { status, data } = useMovie(+id);
  if (status === "loading") return <div>Loading...</div>;
  if (status === "error") return <div>Something went wrong</div>;
  return (
    <article>
      <h1>{data.title}</h1>
    </article>
  );
}

function Search() {
  const location = useLocation();
  const search = new URLSearchParams(location.search);
  const query = search.get("query");
  const { status, data } = useSearchMovies(query);
  if (status === "loading") return <div>Loading...</div>;
  if (status === "error") return <div>Something went wrong</div>;
  return (
    <ul>
      {data.map((movie) => (
        <li key={movie.id}>
          <Link to={`/movie/${movie.id}`}>{movie.title}</Link>
        </li>
      ))}
    </ul>
  );
}

export default App;

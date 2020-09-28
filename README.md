# Learn React Router

Learn how to build a more complex React app using React Router.

## Setup

1. Clone this repo
1. `npm i`
1. `npm start`

We're going to use the React Router library to create a React app with multiple different views that are shown at different URLs.

The `src/api.js` file contains some helper methods that return mock API data. In a real app these would be fetching from an API server and would be asynchronous, but for simplicity these mock functions return data synchronously.

## Part one: basic routing

Open `src/App.js`. The `App` component currently just renders some fake navigation. There are `Home` and `AllMovies` components, but they aren't being used.

We want the `Home` component to show first (when the URL path is `"/"`) and the `AllMovies` component to show when the user navigates to `"/movies"`. We'll need to use a few React Router components to achieve this.

### Challenge one

Let's work through this together step-by-step.

First we need to wrap our entire app in `BrowserRouter`, which manages the URL state for us.

**Import `BrowserRouter` and replace the `div` inside `App`.**

Next we need to render `Route` components for each page we want. They need a `path` prop containing the URL pathname they should render at (i.e. `"/"` and `"/movies"` here). Put the component you want to render inside each `Route`.

**Import `Route` and render one for each page, with the component you want to show up inside.**

Finally we need to use `Link`s instead of normal anchor tags to ensure our app re-renders when the URL changes.

**Import `Link` and replace the anchor tags.**

It would also be nice to have a fallback "Not found" component render for any URL that doesn't match a route. A Route with no path will match _any_ route. However on its own that would mean the fallback would render on _every_ page. We need to combine this with another React Router component: the `Switch`.

`Switch` wraps around a set of `Route`s and will only ever render _one_—whichever matches the current URL first.

**Import `Switch` and wrap it around your Routes. Add a fallback Route.**

If everything worked you should now see the `Home` component rendered on the page. Clicking the "View all movies" link should show the `AllMovies` component. Visting a non-existent route should show your fallback.

**Note**: if you see the `Home` component showing on other paths you may need to add the `exact` prop to the `"/"` route. This tells the Route to match the entire exact URL. Without this `"/"` will match any path (since they all start with a slash).

<details>
<summary>Solution</summary>

```jsx
import { BrowserRouter, Route, Link } from "react-router-dom";

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
          <Route path="/movies">
            <AllMovies />
          </Route>
          <Route>
            <h1>Not found</h1>
          </Route>
        </Switch>
      </main>
    </BrowserRouter>
  );
}
```

</details>

## Part two: movie list

The `AllMovies` component needs to render a list of movie titles. Each title should be a link to that specific movie's details page. For example `/movies/9` would link to a page for the movie with ID 9.

First we need to get the movie data. The `api.getAllMovies()` method will return an array of movie objects containing ID and title properties. We can then map over this array to render a list item and a `Link` for each.

### Challenge two

1. Use the `api.getAllMovies()` method to get the array of movie objects
1. Map over the array to render a list item for each one
1. Each item should contain a link to `"/movies/{id}"`

<details>
<summary>Solution</summary>

```jsx
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
```

</details>

## Part three: movie details

We now have links to each specific movie page, but you should see a blank page when you click them. This is because we have no Route that matches any of these URLs.

We can't add a Route component for every possible ID—instead we need to use a placeholder to represent any value that might appear in the URL at that position. This is called a "URL param" and works just like in Express.

We represent a param in a path with a colon. E.g.

```jsx
<Route path="/some/path/:name">
  <Something />
</Route>
```

This Route will match `/some/path/` followed by anything. We can then access this placeholder value using React Router's `useParams` hook. This hook returns an object containing all of the matched params for the current route. For the example if we had the Route above and visited `"/some/path/oliver"`:

```jsx
import { useParams } from "react-router-dom";

function Something() {
  const params = useParams();
  // { name: "oliver" }
}
```

**Note**: params are always strings, since URLs are strings. If you're expecting another value (like a number) you need to convert it.

### Challenge three

You need to create a new `MovieDetails` component that is rendered for any of the `/movies/:id` routes. You can grab the ID from the URL params, then use the `api.getMovie(id)` method to fetch the details for that specific movie. Once you have the details render some of them to the page.

1. Add a Route that renders a new `MovieDetails` component at `"/movies/:id"`
1. Import `useParams` and use it to get the movie's ID
1. Use the ID to fetch the movie details from the API and render some of them

<details>
<summary>Solution</summary>

```jsx
function App() {
  return (
    //
    <Route path="/movies/:id">
      <MovieDetails />
    </Route>
    //
  );
}

function MovieDetails() {
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
```

</details>

## Part four: searching movies

Finally we want to add a way to search all the movies. We need a search form on the home page. When submitted this should navigate to a `/search` route and show a list of movies filtered by the search term.

### Navigating automatically

We need to import another hook from RR to navigate automatically (without the user clicking a `Link`). The `useHistory` hook returns a history object. We can use the `history.push("/somewhere")` method to navigate to any path we like.

### Passing state to routes

Each route in our app should be able to render correctly on its own. For example if a user is linked directly to a page (or refreshes a page). So your routes shouldn't be dependent on state values being passed in as props.

Instead we can store any information a route _needs_ in order to render **in the URL**. We can use URL searchParams to save user-entered information. For example `"/somewhere?thing=5"`.

#### Challenge four

1. Add a form with a search input to the home page
1. On submission prevent the default form request, then get the user-entered value from the input
1. Navigate to `/search?query=whatever-they-typed`

<details>
<summary>Solution</summary>

```jsx
function Home() {
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
```

</details>

### Retrieving state from the URL

We can access the current URL in our route components using the `useLocation` hook. This returns a location object, which includes a `location.search` property, which is just the part of the URL from the `"?"`.

We can then parse this string using the browser's built in `new URLSearchParams()` constructor, which returns an interface containing all of the values in the string. For example:

```js
const searchParams = new URLSearchParams("?thing=5&other=stuff");
searchParams.get("thing"); // "5"
```

#### Challenge five

1. Create a new `SearchMovies` component rendered at the `"/search"` route
1. Grab the user-entered `query` string from the location object
1. Use the `query` to fetch the filtered movie array from `api.searchMovies(string)`
1. Render the filtered list of movies

<details>
<summary>Solution</summary>

```jsx
function Search() {
  const location = useLocation();
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
```

</details>

That's it, you now know enough React Router to build a whole Single-Page App.

## Bonus: deployment

We can now deploy this app to a static host like Netlify. There is one gotcha however. Since this is still a _Single-Page_ App our server will only know about one route: the home route. It will correctly respond with the `index.html` file containing our app here, but for any other route it will respond with a `404`.

For example if we try to load `/movies` the server will look for a `movies.html` or `/movies/index.html` file. Since these don't exist the request will fail.

The solution is to configure your static host to _always_ serve the `index.html` file for every route. This [can be done for Netlify](https://docs.netlify.com/routing/redirects/rewrites-proxies/#history-pushstate-and-single-page-apps) by creating a file named `_redirects` inside the `public/` directory containing:

```
/* /index.html 200
```

This tells Netlify to redirect any unrecognised request to the `index.html` file with a 200 (success) status code.
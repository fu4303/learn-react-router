import React from 'react';
import * as api from "./api";

function App() {
  return (
    <div>
      <nav>
        <a href="/">Home</a>
        <a href="/movies">View all movies</a>
      </nav>
      <main>{/* routes go here */}</main>
    </div>
  );
}

function Home() {
  return (
    <div>
      <h1>Movie App</h1>
      <p>You can learn about movies and stuff</p>
    </div>
  );
}

function AllMovies() {
  return (
    <>
      <h1>All movies</h1>
      <ul>{/* list movies here */}</ul>
    </>
  );
}

export default App;

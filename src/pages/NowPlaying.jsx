import React, { useState, useEffect } from "react";
import Movie from "../components/Movie";
import { AppContainer } from "../style/Page.style";
import Loading from "../components/Loading";

export default function NowPlaying() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [isFetching, setFetching] = useState(false);
  const [hasNextPage, setNextPage] = useState(true);

  const fetchData = async (page) => {
    setFetching(true);

    try {
      const result = await fetch(
        `https://api.themoviedb.org/3/movie/now_playing?language=ko&page=${page}`,
        {
          headers: {
            Accept: "application/json",
            Authorization:
              "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxOWQwOGI0YzIzZWQ1NWQ0NWM5OTQzZTg1MmQ5OWE4ZSIsInN1YiI6IjY1MjM5OWI0ZWE4NGM3MDEwYzE4MWM4NiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.JOt6xCNHgNuBw2gnBkSgkMuER30G8kKGzjZmABeG-Aw",
          },
        }
      );

      if (!result.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await result.json();

      setMovies((prevMovies) => [...prevMovies, ...data.results]);
      setNextPage(data.page < 500);
      setFetching(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchData(page).then(() => setLoading(false));
  }, []);

  const handleScroll = () => {
    const scrollHeight = document.documentElement.scrollHeight - 50;
    const scrollTop = document.documentElement.scrollTop;
    const clientHeight = document.documentElement.clientHeight;

    if (scrollTop + clientHeight >= scrollHeight && !isFetching) {
      setFetching(true);
      setPage((prevPage) => prevPage + 1);
    }
  };

  useEffect(() => {
    if (isFetching && hasNextPage) {
      fetchData(page).then(() => {
        setFetching(false);
      });
    }
  }, [page, isFetching, hasNextPage]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <AppContainer>
      {loading ? (
        <Loading />
      ) : (
        <AppContainer>
          {/* Render movies here */}
          {movies.map((item) => (
            <Movie
              key={item.id}
              title={item.title}
              poster_path={item.poster_path}
              vote_average={item.vote_average}
              overview={item.overview}
              movieId={item.id}
            />
          ))}
        </AppContainer>
      )}
    </AppContainer>
  );
}

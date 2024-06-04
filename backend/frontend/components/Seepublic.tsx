import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Transition } from '@headlessui/react';
import { Link } from 'react-router-dom';

interface Playlist {
  id: string;
  playlistName: string;
  movies: Movie[];
  visibility: boolean;
  username: string;
}

interface Movie {
  Title: string;
  Year: string;
  imdbID: string;
  Type: string;
  Poster: string;
}

const Seepublic: React.FC = () => {
  const [publicPlaylists, setPublicPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);
  const apiUrl = 'https://movielibrary-hut1.onrender.com/api/movies/search/playlists';

  useEffect(() => {
    const fetchPublicPlaylists = async () => {
      try {
        const response = await axios.get(apiUrl);
        if (response.status === 200) {
          setPublicPlaylists(response.data.playlists);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching public playlists:', error);
        setLoading(false);
      }
    };

    fetchPublicPlaylists();
  }, []);

  const handlePlaylistClick = (playlistId: string) => {
    setPublicPlaylists((prevState) =>
      prevState.map((playlist) =>
        playlist.id === playlistId ? { ...playlist, showMovies: !playlist.showMovies } : playlist
      )
    );
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-white">Welcome to Public Playlists</h2>
        <Link to="/" className="text-blue-400 hover:text-blue-600">Go to Home</Link>
      </div>
      <Transition
        show={!loading}
        enter="transition-opacity duration-500"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-500"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {publicPlaylists.length > 0 ? (
            publicPlaylists.map((playlist) => (
              <div
                key={playlist.id}
                className="border border-gray-700 rounded-lg p-4 bg-gray-800 text-white shadow-lg transition duration-300 transform hover:scale-105"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-lg font-semibold">{playlist.playlistName}</span>
                  <span className="text-sm text-gray-400">by {playlist.username}</span>
                </div>
                <button
                  onClick={() => handlePlaylistClick(playlist.id)}
                  className="text-blue-400 hover:text-blue-600"
                >
                  {playlist.showMovies ? 'Hide Movies' : 'Show Movies'}
                </button>
                {playlist.showMovies && (
                  <div className="mt-4">
                    {playlist.movies.map((movie) => (
                      <div key={movie.imdbID} className="flex items-center gap-4 my-2">
                        <img
                          src={movie.Poster}
                          alt={`Poster for ${movie.Title}`}
                          className="w-16 h-24 object-cover rounded shadow-md"
                        />
                        <div className="flex flex-col">
                          <span className="text-lg font-semibold">{movie.Title}</span>
                          <span className="text-sm text-gray-400">{movie.Year}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="flex justify-center items-center text-center text-white h-96">
              <p className="text-4xl font-bold italic">No public playlists available.</p>
            </div>
          )}
        </div>
      </Transition>
    </div>
  );
};

export default Seepublic;

import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const TMDB_BEARER_TOKEN = process.env.TMDB_BEARER_TOKEN;
const DISCOVER_MOVIE_URL = `https://api.themoviedb.org/3/discover/movie?language=en-US&page=1&primary_release_year=`;
const MOVIE_CREDITS_URL = `https://api.themoviedb.org/3/movie/`;

interface CrewMember {
  known_for_department: string;
  name: string;
}

export class MovieService {
    async getMovies(year: string) {
    try {
        const response = await axios.get(`${DISCOVER_MOVIE_URL}${year}&sort_by=popularity.desc`, {
            headers: {
                Authorization: `Bearer ${TMDB_BEARER_TOKEN}`,
            },
        });
        return response.data.results; // Returns the movies array
    } catch (error) {
        console.error('Error fetching movies:', error);
        return [];
    }
  }

  async getEditors(movieId: number) {
    try {
        const response = await axios.get(`${MOVIE_CREDITS_URL}${movieId}/credits`, {
            headers: {
                Authorization: `Bearer ${TMDB_BEARER_TOKEN}`,
            },
        });
        // Check if the response has the crew array
        if (response.data && response.data.crew) {
            // Filter for editors and map their names
            const editors = response.data.crew
                .filter((person: CrewMember) => person.known_for_department === 'Editing')
                .map((person: CrewMember) => person.name);
            return editors;
        }
        // Return an empty array if there are no editors
        return [];
    } catch (error) {
        console.error('Error fetching movie credits:', error);
        return []; // Return an empty array in case of error
    }
}

}

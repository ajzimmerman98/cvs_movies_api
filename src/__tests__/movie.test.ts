import axios from 'axios';
import { MovieService } from '../movie.service';

jest.mock('axios');

describe('MovieService', () => {
    let movieService: MovieService;

    beforeEach(() => {
        movieService = new MovieService();
    });

    it('should fetch movies for a given year', async () => {
        const mockYear = '2019';
        const mockResponse = {
            data: {
                results: [
                    { id: 1, title: 'Joker', release_date: '2019-10-04', vote_average: 8.5 },
                ],
            },
        };

        (axios.get as jest.Mock).mockResolvedValue(mockResponse);

        const movies = await movieService.getMovies(mockYear);

        expect(movies).toEqual(mockResponse.data.results);
        expect(axios.get).toHaveBeenCalledWith(
            `https://api.themoviedb.org/3/discover/movie?language=en-US&page=1&primary_release_year=${mockYear}&sort_by=popularity.desc`,
            {
                headers: { Authorization: expect.stringContaining('Bearer') },
            }
        );
    });

    it('should return an empty array when fetching movies fails', async () => {
        const mockYear = '2019';
        (axios.get as jest.Mock).mockRejectedValue(new Error('Network Error'));

        const movies = await movieService.getMovies(mockYear);

        expect(movies).toEqual([]);
    });

    it('should fetch editors for a given movie ID', async () => {
        const mockMovieId = 1;
        const mockResponse = {
            data: {
                crew: [
                    { known_for_department: 'Editing', name: 'Editor One' },
                    { known_for_department: 'Directing', name: 'Director One' },
                ],
            },
        };

        (axios.get as jest.Mock).mockResolvedValue(mockResponse);

        const editors = await movieService.getEditors(mockMovieId);

        expect(editors).toEqual(['Editor One']);
        expect(axios.get).toHaveBeenCalledWith(
            `https://api.themoviedb.org/3/movie/${mockMovieId}/credits`,
            {
                headers: { Authorization: expect.stringContaining('Bearer') },
            }
        );
    });

    it('should return an empty array when fetching editors fails', async () => {
        const mockMovieId = 1;
        (axios.get as jest.Mock).mockRejectedValue(new Error('Network Error'));

        const editors = await movieService.getEditors(mockMovieId);

        expect(editors).toEqual([]);
    });
});

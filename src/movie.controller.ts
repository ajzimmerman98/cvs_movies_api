import { Request, Response } from 'express';
import { MovieService } from './movie.service';

export class MovieController {
    private movieService: MovieService;

    constructor() {
        this.movieService = new MovieService();
    }

    async getMoviesByYear(req: Request, res: Response) {
        const year = req.params.year;
        const movies = await this.movieService.getMovies(year);
        const movieDetails = await Promise.all(
            movies.map(async (movie: any) => {
                const editors = await this.movieService.getEditors(movie.id);
                return {
                    title: movie.title,
                    release_date: movie.release_date,
                    vote_average: movie.vote_average,
                    editors,
                };
            })
        );
        res.json(movieDetails);
    }
}

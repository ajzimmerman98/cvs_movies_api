import express from 'express';
import { MovieController } from './movie.controller';

const app = express();
const port = 3000;

const movieController = new MovieController();

app.get('/movies/:year', (req, res) => movieController.getMoviesByYear(req, res));

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

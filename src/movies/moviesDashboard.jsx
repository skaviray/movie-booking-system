import React, { Component } from 'react';

// import { getGenres,getMovies } from '../services/fakeGenreService';
import { getMovies,deleteMovie } from '../services/fakeMovieService';

class MoviesDashboard extends Component {
    state = { 
        movies: getMovies()
    }
    handleDelete = (movie) => {
        console.log("deleting movie", movie._id)
        const movies = this.state.movies.filter((item) => item._id !== movie._id)
        this.setState({movies: movies})
        console.log(deleteMovie(movie._id))
    }
    getTable = () => {
        return (
            <table class="table">
            <thead>
                <tr>
                {/* <th scope="col">#</th> */}
                <th scope="col">Title</th>
                <th scope="col">Genre</th>
                <th scope="col">InStock</th>
                <th scope="col">RentalRate</th>
                <th scope="col"></th>
                </tr>
            </thead>
            <tbody>
                { this.state.movies.map( movie => (
                    <tr key={movie._id}>
                        {/* <th scope="row">{movie._id}</th> */}
                        <td>{movie.title}</td>
                        <td>{movie.genre.name}</td>
                        <td>{movie.numberInStock}</td>
                        <td>{movie.dailyRentalRate}</td>
                        <td><button onClick={() => this.handleDelete(movie)  } className="btn btn-danger btn-sm">Delete</button></td>
                    </tr>))}

            </tbody>
            </table>
        )
    }
    render() { 
        if (this.state.movies.length === 0 ) return <p1>There are no movies in the database</p1>
        return (
        <React.Fragment>
            <p>Showing {this.state.movies.length} movies from the database</p>
            {this.getTable()}
        </React.Fragment>
    );
    }
}
 
export default MoviesDashboard;
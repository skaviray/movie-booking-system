import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Like from './common/like';
import Pagination from './common/pagination'
import { paginate } from '../utils/paginate';
// import Pagination from 'react-bootstrap/Pagination';
import { faHeart } from '@fortawesome/free-solid-svg-icons';


// import { getGenres,getMovies } from '../services/fakeGenreService';
import { getMovies,deleteMovie } from '../services/fakeMovieService';

class MoviesDashboard extends Component {
    state = { 
        movies: getMovies(),
        pageSize: 4,
        currentPage: 1,
        active: 1
    }
    handleDelete = (movie) => {
        console.log("deleting movie", movie._id)
        const movies = this.state.movies.filter((item) => item._id !== movie._id)
        this.setState({movies: movies})
        console.log(deleteMovie(movie._id))
    }
    handleLike = (movie) => {
        console.log("Like Clicked", movie)
        const movies = [...this.state.movies]
        const index = movies.indexOf(movie)
        movies[index] = { ...movies[index]}
        movies[index].liked = !movies[index].liked
        this.setState({movies})
    }
    handlePageChange = (page) => {
        this.setState({currentPage: page})
    }
    getTable = () => {
        const {length: count} = this.state.movies
        const { movies, pageSize, currentPage } = this.state
        const moviesPerPage = paginate(movies,currentPage,pageSize)
        return (
            <React.Fragment>
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
                { moviesPerPage.map( movie => (
                    <tr key={movie._id}>
                        {/* <th scope="row">{movie._id}</th> */}
                        <td>{movie.title}</td>
                        <td>{movie.genre.name}</td>
                        <td>{movie.numberInStock}</td>
                        <td>{movie.dailyRentalRate}</td>
                        <td><Like liked={movie.liked} onClick={() => this.handleLike(movie)}/></td>
                        <td><button onClick={() => this.handleDelete(movie)  } className="btn btn-danger btn-sm">Delete</button></td>
                    </tr>))}

            </tbody>
            </table>
            <Pagination itemsCount={count} pageSize={this.state.pageSize} onPageChange={this.handlePageChange} currentPage={this.state.currentPage} />
            </React.Fragment>
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
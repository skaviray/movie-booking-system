import React, { Component } from 'react';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Like from './common/like';
import Pagination from './common/pagination'
import { paginate } from '../utils/paginate';
import ListGroup from './common/listGroup';
// import { faHeart } from '@fortawesome/free-solid-svg-icons';


// import { getGenres,getMovies } from '../services/fakeGenreService';
import { getMovies,deleteMovie } from '../services/fakeMovieService';
import { genres, getGenres } from '../services/fakeGenreService';

class MoviesDashboard extends Component {
    state = { 
        movies: [],
        genres: [],
        pageSize: 4,
        currentPage: 1,
        currentGenre: "allGenres",
        active: 1
    }
    componentDidMount() {
        this.setState(
            {
                movies: getMovies(),
                genres: getGenres()
            }
        )
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
    handleGenreSelect = (genre) => {
        console.log(genre.name)
        this.setState(
            { currentGenre: genre.name}
        )
    }
    render() { 
        const {length: count} = this.state.movies
        const { movies: allMovies, pageSize, currentPage } = this.state
        const {genres: allGenres, currentGenre} = this.state
        const movies = paginate(allMovies,currentPage,pageSize)
        return (
            <div className='row'>
                <div className="col-2">
                    <ListGroup items={this.state.genres} currentGenre={this.state.currentGenre} onSelectGenre={this.handleGenreSelect}></ListGroup>
                </div>
                <div className="col">
                    <p1>Showing {count} movies from the database</p1>
                    <table className="table">
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
                            { movies.map( movie => (
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
                    <Pagination 
                    itemsCount={count} 
                    pageSize={this.state.pageSize} 
                    onPageChange={this.handlePageChange} 
                    currentPage={this.state.currentPage} 
                    />
                </div>
            </div>
        )
    }
}
 
export default MoviesDashboard;
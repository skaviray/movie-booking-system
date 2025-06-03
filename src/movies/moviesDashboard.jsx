import React, { Component } from 'react';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Like from './common/like';
import Pagination from './common/pagination'
import { paginate } from '../utils/paginate';
import ListGroup from './common/listGroup';
import MoviesTable from './movies';
// import { faHeart } from '@fortawesome/free-solid-svg-icons';


// import { getGenres,getMovies } from '../services/fakeGenreService';
import { getMovies,deleteMovie } from '../services/fakeMovieService';
import {  getGenres } from '../services/fakeGenreService';

class MoviesDashboard extends Component {
    state = { 
        movies: [],
        genres: [],
        pageSize: 7,
        currentPage: 1,
        selectedGenre: {},
        active: 1
    }
    componentDidMount() {
        const genres = [{"name": "All Genres"},...getGenres()]
        this.setState(
            {
                movies: getMovies(),
                genres: genres
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
        this.setState(
            { selectedGenre: genre, currentPage: 1}
        )
        console.log(genre)
    }
    render() { 
        const {length: count} = this.state.movies
        const { movies: allMovies, pageSize, currentPage, selectedGenre } = this.state
        const filtered = selectedGenre && selectedGenre._id ? allMovies.filter((movie) => movie.genre._id === selectedGenre._id) : allMovies
        const movies = paginate(filtered,currentPage,pageSize)
        return (
            <div className='row'>
                <div className="col-2">
                    <ListGroup 
                    items={this.state.genres} 
                    currentGenre={selectedGenre} 
                    onSelectGenre={this.handleGenreSelect}></ListGroup>
                </div>
                <div className="col">
                    <p1>Showing {count} movies from the database</p1>
                    <MoviesTable
                    movies={movies}
                    onLike={this.handleLike}
                    onDelete={this.handleDelete}
                    ></MoviesTable>
                    <Pagination 
                    itemsCount={filtered.length} 
                    pageSize={pageSize} 
                    onPageChange={this.handlePageChange} 
                    currentPage={currentPage} 
                    />
                </div>
            </div>
        )
    }
}
 
export default MoviesDashboard;
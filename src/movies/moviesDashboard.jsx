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
import _ from "lodash";

class MoviesDashboard extends Component {
    state = { 
        movies: [],
        genres: [],
        pageSize: 7,
        currentPage: 1,
        selectedGenre: {"name": "All Genres"},
        sortColumn: {path: 'title', order: 'asc'},
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
        const movies = this.state.movies.filter((item) => item._id !== movie._id)
        this.setState({movies: movies})
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
        // console.log(genre)
    }
    handleOnSort = (sortColumn) => {
        console.log(sortColumn)
        this.setState({sortColumn: sortColumn})
    }
    getPagedData = () => {
        const { movies: allMovies, pageSize, currentPage, selectedGenre,sortColumn } = this.state
        const filtered = selectedGenre && selectedGenre._id ? allMovies.filter((movie) => movie.genre._id === selectedGenre._id) : allMovies
        const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order])
        const movies = paginate(sorted,currentPage,pageSize)
        return {totalCount: filtered.length, data: movies}

    }
    render() { 
        const {length: count} = this.state.movies
        const { movies: allMovies, pageSize, currentPage, selectedGenre,sortColumn } = this.state
        // const filtered = selectedGenre && selectedGenre._id ? allMovies.filter((movie) => movie.genre._id === selectedGenre._id) : allMovies
        // const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order])
        // const movies = paginate(sorted,currentPage,pageSize)
        const {totalCount,data} = this.getPagedData()
        return (
            <div className='row'>
                <div className="col-2">
                    <ListGroup 
                    items={this.state.genres} 
                    currentGenre={selectedGenre} 
                    onSelectGenre={this.handleGenreSelect}></ListGroup>
                </div>
                <div className="col">
                    <p>Showing {data.length} movies from the database</p>
                    <MoviesTable
                    movies={data}
                    sortColumn={sortColumn}
                    onLike={this.handleLike}
                    onDelete={this.handleDelete}
                    onSort={this.handleOnSort}
                    ></MoviesTable>
                    <Pagination className="pagination"
                    itemsCount={totalCount} 
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
import React, { Component } from 'react';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Pagination from './common/pagination'
import { paginate } from '../utils/paginate';
import ListGroup from './common/listGroup';
import MoviesTable from './movies';
import withNavigation from './withNavigation';
// import { faHeart } from '@fortawesome/free-solid-svg-icons';


// import { getGenres,getMovies } from '../services/fakeGenreService';
// import { getMovies,deleteMovie } from '../services/fakeMovieService';
// import {  getGenres } from '../services/fakeGenreService';
import { fetchGenres } from '../services/genreService';
import { fetchMovies,deleteMovie } from '../services/movieService';
import _ from "lodash";
import { toast } from 'react-toastify';

class MoviesDashboard extends Component {
    state = { 
        movies: [],
        genres: [],
        pageSize: 7,
        currentPage: 1,
        selectedGenre: {"name": "All Genres"},
        sortColumn: {path: 'title', order: 'asc'},
        searchString: "",
        active: 1
    }
    async componentDidMount() {
        try {
            const genres = [{"name": "All Genres"},... await fetchGenres()]
            const movies = await fetchMovies()
            this.setState(
                {
                    movies: movies,
                    genres: genres
                }
            )
            
        } catch (ex) {
            if (ex.response && ex.response.status === 404) {
                toast.error(`/auth/genres endpoint doesn't exist`)
            }
            this.setState(
                {
                    movies: [],
                    genres: []
                }
            )
        }
    }
    handleDelete =  async (movie) => {
        const originalMovies = this.state.movies
        const updatedMovies = originalMovies.filter(m => m.id !== movie.id)
        this.setState({movies: updatedMovies})
        // const index = originalMovies.indexOf(deleteMovie)
        try{
            await deleteMovie(movie)
        } catch (ex){
            toast.error("Unexpected error occured...")
            this.setState({movies: originalMovies})
        }
        // const movies = this.state.movies.filter((item) => item._id !== movie._id)
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
        let filtered = allMovies
        if (this.state.searchString) {
            filtered = allMovies.filter((movie) =>
            movie.title.toLowerCase().includes(this.state.searchString.toLowerCase())
            )
        }
        else if (selectedGenre && selectedGenre._id){
            const filtered =  allMovies.filter((movie) => movie.genre._id === selectedGenre._id)
        }
        const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order])
        const movies = paginate(sorted,currentPage,pageSize)
        return {totalCount: filtered.length, data: movies}

    }
    handleNewMovie = () => {
        console.log("Adding new Movie")
        // console.log(this.props.navigate)
        this.props.navigate("/movies/new")
    }
    handleSearch = e => {
        console.log("searching")
       const {name, value} = e.target
        this.setState({ searchString: value})
       console.log(value)
    }
    render() { 
        console.log(this.props)
        const { user } = this.props
        const {length: count} = this.state.movies
        const { movies: allMovies, pageSize, currentPage, selectedGenre,sortColumn } = this.state
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
                    <button onClick={this.handleNewMovie} className="btn btn-primary btn-sm">New Movie</button>
                    <p>Showing {data.length} movies from the database</p>
                    {/* <label for="exampleFormControlInput1" className="form-label">Search</label> */}
                    <input 
                    autoFocus
                    type="text" 
                    className="form-control mb-3" 
                    placeholder="Search Movies ..." 
                    // name='search' 
                    value={this.state.searchString} 
                    onChange={this.handleSearch}/>
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
 
// export default MoviesDashboard;

export default withNavigation(MoviesDashboard)
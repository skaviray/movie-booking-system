import { useState,useEffect } from "react";
import { useNavigate } from "react-router";

import Pagination from './common/pagination'
import { paginate } from '../utils/paginate';
import ListGroup from './common/listGroup';
import MoviesTable from './movies';
// import withNavigation from './withNavigation';
import { fetchGenres } from '../services/genreService';
import { fetchMovies,deleteMovie } from '../services/movieService';
import _ from "lodash";
import { toast } from 'react-toastify';




export default function MoviesDashboard({user})  {
    const [movies, setMovies] = useState([])
    const [genres,setGenres] = useState([])
    const [pageSize,setPageSize] = useState(7)
    const [currentPage,setCurrentPage] = useState(1)
    const [selectedGenre,setSelectedGenre] = useState({"name": "All Genres"})
    const [sortColumn,setSortColumn] = useState({path: 'title', order: 'asc'})
    const [searchString,setSearchString] = useState("")
    const navigate = useNavigate()
    const [loading,setLoading] = useState(true)
    useEffect(() => {
        const fetchData = async () => {
        try {
            const fetchedMovies = await fetchMovies();
            const fetchedGenres = await fetchGenres();
            setMovies(fetchedMovies)
            setGenres([{"name": "All Genres"},...fetchedGenres])
            setLoading(false)
        }
        catch (ex) {
            if (ex.response && ex.response.status === 404) {
                toast.error(`/auth/genres endpoint doesn't exist`)
            }
            setMovies([])
            setGenres([])
        }
    } 
    fetchData()
}, [])
    const handleDelete =  async (movie) => {
        const originalMovies = [...movies]
        const updatedMovies = originalMovies.filter(m => m.id !== movie.id)
        setMovies(updatedMovies)
        try{
            await deleteMovie(movie)
        } catch (ex){
            toast.error("Unexpected error occured...")
            setMovies(originalMovies)
        }
    }
    const handleLike = (movie) => {
        // console.log("Like Clicked", movie)
        const updatedMovies = movies.map(m => m.id === movie.id ? { ...m, liked: !m.liked } : m);
        setMovies(updatedMovies)
    }
    const handlePageChange = (page) => {
        setCurrentPage(page)
    }
    const handleGenreSelect = (genre) => {
        setSelectedGenre(genre)
        setCurrentPage(1)
    }
    const handleOnSort = (sortColumn) => {
        // console.log(sortColumn)
        setSortColumn(sortColumn)
    }
    const getPagedData = () => {
        // let filtered = movies
        let filtered = movies
        console.log(movies)
        console.log(selectedGenre)
        if (searchString) {
            filtered = movies.filter((movie) =>
            movie.title.toLowerCase().includes(searchString.toLowerCase())
            )
        }
        else if (selectedGenre && selectedGenre.id) {
            console.log(selectedGenre.id)
            filtered = movies.filter((movie) => movie.genre_id === selectedGenre.id);
            console.log(filtered)
        }
        console.log(filtered)
        const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order])
        const paginatedMovies = paginate(sorted,currentPage,pageSize)
        console.log(paginatedMovies)
        return {totalCount: filtered.length, data: paginatedMovies}
    }
    const handleNewMovie = () => {
        console.log("Adding new Movie")
        navigate("/movies/new")
    }
    const handleSearch = e => {
        console.log("searching")
       const {name, value} = e.target
       setSearchString(value)
    }
    // const { user } = props
    const {length: count} = movies
    const {totalCount,data} = getPagedData()
    console.log(user)
    if (loading) return null
    return (
            <div className='row'>
                <div className="col-2">
                    <ListGroup 
                    items={genres} 
                    currentGenre={selectedGenre} 
                    onSelectGenre={handleGenreSelect}></ListGroup>
                </div>
                <div className="col">
                    {user && user.is_admin && <button onClick={handleNewMovie} className="btn btn-primary btn-sm">New Movie</button>}
                    <p>Showing {totalCount} movies from the database</p>
                    {/* <label for="exampleFormControlInput1" className="form-label">Search</label> */}
                    <input 
                    autoFocus
                    type="text" 
                    className="form-control mb-3" 
                    placeholder="Search Movies ..." 
                    // name='search' 
                    value={searchString} 
                    onChange={handleSearch}/>
                    <MoviesTable
                    movies={data}
                    sortColumn={sortColumn}
                    onLike={handleLike}
                    onDelete={handleDelete}
                    onSort={handleOnSort}
                    ></MoviesTable>
                    <Pagination className="pagination"
                    itemsCount={totalCount} 
                    pageSize={pageSize} 
                    onPageChange={handlePageChange} 
                    currentPage={currentPage} 
                    />
                </div>
            </div>
    );
}
 
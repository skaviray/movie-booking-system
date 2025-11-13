import { useState,useEffect } from "react";
import { useNavigate } from "react-router";
import Pagination from '../common/pagination'
import { paginate } from '../../utils/paginate';
import { fetchMovies,deleteMovie } from '../../services/movieService';
import _ from "lodash";
import { toast } from 'react-toastify';
import MoviesGridView from "../common/grid";
import LoginPopup from "../common/modal";
import Joi  from "joi-browser";
import { addMovie } from "../../services/movieService";
export default function MoviesDashboard({user})  {
    const [movies, setMovies] = useState([])
    // const [genres,setGenres] = useState([])
    const [pageSize,setPageSize] = useState(7)
    const [currentPage,setCurrentPage] = useState(1)
    const [selectedGenre,setSelectedGenre] = useState({"name": "All Genres"})
    const [sortColumn,setSortColumn] = useState({path: 'title', order: 'asc'})
    const [searchString,setSearchString] = useState("")
    const navigate = useNavigate()
    const [loading,setLoading] = useState(true)
    const [showAddMovie, setAddMovie] = useState(false);
    const handleAddMovie = () => setAddMovie(true);
    const schema = {
        title: Joi.string().required().label("Title"),
        description: Joi.string().required().label("Description"),
        poster: Joi.string().uri().required().label("Poster"),
        trailer: Joi.string().uri().required().label("Trailer"),
        runtime: Joi.number().integer().required().label("DurationMinutes"),
        language: Joi.string().required().label("Language"),
        release_date: Joi.date().min('now').required().label("Event Date")
    }
    // const updateSchema = {
    //     title: Joi.string().required().label("Title"),
    //     description: Joi.string().required().label("Description"),
    //     poster: Joi.string().uri().required().label("Poster"),
    //     trailer: Joi.string().uri().required().label("Trailer"),
    //     runtime: Joi.number().integer().required().label("DurationMinutes"),
    //     language: Joi.string().required().label("Language"),
    //     release_date: Joi.date().min('now').required().label("Event Date")
    // }
    // const updateComponents = [
    //   { type: "text", label: "Title", key: "title", placeholder: "Title", form_type: "control"},
    //   { type: "text",label: "Description",key: "description",placeholder: "Description", form_type: "control"},
    //   { type: "text", label: "Poster", key: "poster", placeholder: "Poster", form_type: "control"},
    //   { type: "text", label: "Trailer", key: "trailer", placeholder: "Trailer", form_type: "control"},
    //   { type: "text", label: "Runtime", key: "runtime", placeholder: "Runtime in minutes", form_type: "control"},
    //   { type: "text", label: "Language", key: "language", placeholder: "Language", form_type: "control"},
    //   { type: "date", label: "ReleaseDate", key: "release_date", placeholder: "Release Date", form_type: "control"},
    // ]
    const components = [
      { type: "text", label: "Title", key: "title", placeholder: "Title", form_type: "control"},
      { type: "text", label: "Poster", key: "poster", placeholder: "Poster", form_type: "control"},
      { type: "text", label: "Trailer", key: "trailer", placeholder: "Trailer", form_type: "control"},
      { type: "text", label: "Language", key: "language", placeholder: "Language", form_type: "control"},
      { type: "date", label: "ReleaseDate", key: "release_date", placeholder: "Release Date", form_type: "control"},
    ]
    const handleMovieCreation =  async (e, data, setErrors) => {
      try {
      const movie = {
        title: data.title,
        description: data.description,
        poster: data.poster,
        trailer: data.trailer,
        runtime: Number(data.runtime),
        language: data.language,
        release_date: new Date(data.release_date).toISOString()
      }
      console.log(movie)
      await addMovie(movie)
    //   navigate("/movies")
      }catch (ex) {
        if (ex.response && ex.response.status === 400){
          toast.error(ex.message)
        }
        else {
          toast.error("Unexpected error occured..")
        }
      }
    }
    useEffect(() => {
        const fetchData = async () => {
        try {
            const fetchedMovies = await fetchMovies();
            setMovies(fetchedMovies)
            setLoading(false)
        }
        catch (ex) {
            if (ex.response && ex.response.status === 404) {
                toast.error(`endpoints doesn't exist`)
            }
            setMovies([])
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
    const handleOnSort = (sortColumn) => {
        setSortColumn(sortColumn)
    }
    const handleBook = (movie) => {
        console.log("book", movie)
        navigate(`/movies/${movie.id}/showtimes`)
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
    const {length: count} = movies
    const {totalCount,data} = getPagedData()
    console.log(user)
    if (loading) return null
    return (
            <div className='row movies-dashboard'>
                <div className="col list-group movies-grid-layout">
                    <div className="d-flex align-items-center mb-3">
                    <input 
                    autoFocus
                    type="text" 
                    className="form-control me-2 searchbox" 
                    placeholder="Search Movies ..." 
                    value={searchString} 
                    onChange={handleSearch}/>
                    {user && user.is_admin && <button onClick={handleAddMovie} className="btn btn-primary me-2">Add</button>}
                    {user && user.is_admin && <LoginPopup modalLabel="Add New Location" buttonLabel="Add" setShow={setAddMovie} show={showAddMovie} componentSchema={schema} components={components} handleSubmit={handleMovieCreation}/>}
                    {/* {user && user.is_admin && <button onClick={handleNewMovie} className="btn btn-primary">DEL</button>} */}
                    </div>
                    <MoviesGridView
                    className=''
                    user={user}
                    movies={data}
                    sortColumn={sortColumn}
                    onLike={handleLike}
                    onDelete={handleDelete}
                    onSort={handleOnSort}
                    onBook={handleBook}
                    ></MoviesGridView>
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
 
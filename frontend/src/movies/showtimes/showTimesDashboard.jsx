import { useState,useEffect } from "react";
import { useNavigate } from "react-router";

import Pagination from '../common/pagination'
import { paginate } from '../../utils/paginate';
import _ from "lodash";
import { toast } from 'react-toastify';
import ShowTimeTable from './showtimes';
import { fetchShowTimes, deleteShowTime } from "../../services/showTimesService";
import { fetchMovies } from "../../services/movieService";
import { fetchScreens } from "../../services/screensService";
import { fetchTheatres } from "../../services/theatreService";




export default function ShowTimesDashboard({user})  {
    const [showTimes, setShowTimes] = useState([])
    const [genres,setGenres] = useState([])
    const [pageSize,setPageSize] = useState(7)
    const [currentPage,setCurrentPage] = useState(1)
    // const [selectedGenre,setSelectedGenre] = useState({"name": "All Genres"})
    const [sortColumn,setSortColumn] = useState({path: 'title', order: 'asc'})
    const [searchString,setSearchString] = useState("")
    const navigate = useNavigate()
    const [loading,setLoading] = useState(true)
    useEffect(() => {
        const fetchData = async () => {
        try {
            const fetchedShowTimes = await fetchShowTimes();
            const fetchedMovies = await fetchMovies()
            const fetchedScreens = await fetchScreens()
            const fetchedTheateres = await fetchTheatres()
            const data = fetchedShowTimes.map(show => {
                const movie = fetchedMovies.find(movie => movie.id === show.movie_id)
                const screen = fetchedScreens.find(screen => screen.id === show.screen_id)
                const theatre = fetchedTheateres.find(theatre => theatre.id === screen.theater_id)
                return {
                    ...show,
                    movie_name: movie ? movie.title : "NA",
                    screen_name: screen ? screen.name : "NA",
                    theatre_name: theatre ? theatre.name : "NA",
                    start_time: show ? new Date(show.start_time).toLocaleTimeString([]) : "NA"
                }
            })
            console.log(data)
            setShowTimes(data)
            setLoading(false)
        }
        catch (ex) {
            if (ex.response && ex.response.status === 404) {
                toast.error(`/auth/genres endpoint doesn't exist`)
            }
            setShowTimes([])
        }
    } 
    fetchData()
}, [])
    const handleDelete =  async (show) => {
        const originalShowTimes = [...showTimes]
        const updatedShowTimes = originalShowTimes.filter(s => s.id !== show.id)
        setShowTimes(updatedShowTimes)
        try{
            await deleteShowTime(show)
        } catch (ex){
            toast.error("Unexpected error occured...")
            setShowTimes(originalShowTimes)
        }
    }
    const handlePageChange = (page) => {
        setCurrentPage(page)
    }
    const handleOnSort = (sortColumn) => {
        setSortColumn(sortColumn)
    }
    const getPagedData = () => {
        // let filtered = movies
        let filtered = showTimes
        // if (searchString) {
        //     filtered = showTimes.filter((s) =>
        //     s.title.toLowerCase().includes(searchString.toLowerCase())
        //     )
        // }
        const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order])
        const paginatedShowTimes = paginate(sorted,currentPage,pageSize)
        console.log(paginatedShowTimes)
        return {totalCount: filtered.length, data: paginatedShowTimes}
    }
    const handleNewShow = () => {
        console.log("Adding new Movie")
        navigate("/showtimes/new")
    }
    const handleSearch = () => {
        console.log("Searching..")
    }
    // const handleSearch = e => {
    //     console.log("searching")
    //    const {name, value} = e.target
    //    setSearchString(value)
    // }
    // const { user } = props
    const {totalCount,data} = getPagedData()
    console.log(user)
    if (loading) return null
    return (
            <div className='row'>
                <div className="col">
                    <p>Showing {totalCount} Theatres from the database</p>
                    <div className="d-flex align-items-center mb-3">
                    <input 
                    autoFocus
                    type="text" 
                    className="form-control me-2" 
                    placeholder="Search ShowTimes ..." 
                    value={searchString} 
                    onChange={handleSearch}/>
                    {user && user.is_admin && <button onClick={handleNewShow} className="btn btn-primary me-2">Add</button>}
                    </div>
                    <ShowTimeTable
                    user={user}
                    showtimes={data}
                    sortColumn={sortColumn}
                    onDelete={handleDelete}
                    onSort={handleOnSort}
                    ></ShowTimeTable>
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
 
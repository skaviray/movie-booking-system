import { useState,useEffect } from "react";
import { useNavigate } from "react-router";

import Pagination from '../common/pagination'
import { paginate } from '../../utils/paginate';
import _ from "lodash";
import { toast } from 'react-toastify';
import ShowTimeTable from '../common/tables/showtimes';
import { fetchShowTimes, deleteShowTime, addShowTime } from "../../services/showTimesService";
import { fetchMovies } from "../../services/movieService";
import { fetchScreens } from "../../services/screensService";
import { fetchTheatres } from "../../services/theatreService";
import { fetchLocations, getTheatersByLocId } from "../../services/locations";
import Joi from "joi-browser";
import LoginPopup from "../common/modal";

export default function ShowTimesDashboard({user})  {
    const [showTimes, setShowTimes] = useState([])
    const [screens, setScreens] = useState([])
    const [theatres, setTheatres] = useState([])
    const [locations, setLocations] = useState([])
    const [movies, setMovies] = useState([])
    const [componentState,setComponentState] = useState({})
    const [pageSize,setPageSize] = useState(7)
    const [currentPage,setCurrentPage] = useState(1)
    const [sortColumn,setSortColumn] = useState({path: 'title', order: 'asc'})
    const [locationDropdownValues,setLocationDropdownValues] = useState([])
    const [selectedLocation, setSelectedLocation] = useState('')
    const [theatersDropdownValues,setTheatersDropdownValues] = useState([])
    const [selectedTheatre, setSelectedTheatre] = useState('')
    const [screensDropdownValues,setScreensDropdownValues] = useState([])
    const [selectedScreen, setSelectedScreen] = useState('')
    const [moviesDropdownValues,setMoviesDropdownValues] = useState([])
    const [selectedMovie, setSelectedMovie] = useState('')
    const [searchString,setSearchString] = useState("")
    const navigate = useNavigate()
    const [loading,setLoading] = useState(true)
    const [show, setShow] = useState(false);
    const handleShow = () => setShow(true);
    const schema = {
          name: Joi.string().required().label("Name"),
          location: Joi.string().required().label("Location"),
          theatre: Joi.string().required().label("Theatre"),
          screen: Joi.string().required().label("Screen"),
          movie: Joi.string().required().label("Movie"),
          startTime: Joi.string().required().label("start time"),
          endTime: Joi.string().required().label("end time"),
          price: Joi.number().integer().required().label("Price")
        }
    const components = [
      { type: "text", label: "name", key: "name", placeholder: "Name", form_type: "control"},
      { type: "text", label: "movie", key: "movie", placeholder: selectedMovie || "Movie", select_list: moviesDropdownValues},
      { type: "text", label: "location", key: "location", placeholder: selectedLocation || "Location", select_list: locationDropdownValues},
      { type: "text", label: "theatre", key: "theatre", placeholder: selectedTheatre || "Theatre", select_list: theatersDropdownValues},
      { type: "text", label: "screen", key: "screen", placeholder: selectedScreen || "Screen", select_list: screensDropdownValues},
      { type: "datetime-local", label: "start_time", key: "startTime", placeholder: "Start Time", form_type: "control"},
      { type: "datetime-local", label: "end_time", key: "endTime", placeholder: "Start Time", form_type: "control"},
      { type: "text", label: "price", key: "price", placeholder: "Price", form_type: "control"},
    ]
    // Get the initial data
    useEffect(() => {
        const fetchData = async () => {
        try {
            const [fetchedLocations,fetchedTheatres,fetchedScreens, fetchedMovies, fetchedShowTimes] = await Promise.all([
                fetchLocations(),
                fetchTheatres(),
                fetchScreens(),
                fetchMovies(),
                fetchShowTimes()

            ])
            setLocations(fetchedLocations)
            setTheatres(fetchedTheatres)
            setScreens(fetchedScreens)
            setShowTimes(fetchedShowTimes)
            setMovies(fetchedMovies)
            const moviesWithNames = fetchedMovies.map(m => m.title)
            const locationsWithName = fetchedLocations.map(l => l.city)
            setMoviesDropdownValues(moviesWithNames)
            setLocationDropdownValues(locationsWithName)
            const data = fetchedShowTimes.map(show => {
                const movie = fetchedMovies.find(movie => movie.id === show.movie_id)
                const screen = fetchedScreens.find(screen => screen.id === show.screen_id)
                const theatre = fetchedTheatres.find(theatre => theatre.id === screen.theater_id)
                return {
                    ...show,
                    movie_name: movie ? movie.title : "NA",
                    screen_name: screen ? screen.name : "NA",
                    theatre_name: theatre ? theatre.theatre_name : "NA",
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
    
    // Rerender Theatres everytime the location changes
    useEffect(() => {
    const fetchTheatersForLocation = async () => {
        console.log("loc changed")
        if (!componentState?.location) return;
        try {
            console.log(componentState.location)
        // const fetchedLocations = await fetchLocations();
        console.log(locations)
        const selectedLocation = locations.find(
            loc => loc.city.toLowerCase() === componentState.location.toLowerCase()
        );
        setSelectedTheatre('')
        if (!selectedLocation) return;
        setSelectedLocation(selectedLocation.city)
        const fetchedTheaters = await getTheatersByLocId(selectedLocation);                                                  
        const theaterNames = fetchedTheaters.map(t => t.theater_name.toLowerCase());
        setTheatersDropdownValues(theaterNames);
        } catch (ex) {
            console.log(ex)
        toast.error("Failed to load theaters for location");
        }
    };
    fetchTheatersForLocation();
    }, [componentState?.location]);

    // Rerender Screens everytime the Theatre changes
    useEffect(() => {
    const fetchScreensForTheatres = async () => {
        console.log("theatre changed")
        if (!componentState?.theatre) return;
        console.log(componentState.theatre)
        try {
        // const fetchedLocations = await fetchLocations();
        const loc = locations.find(l => l.city === selectedLocation)
        console.log(loc)
        const selected = theatres.find(
            t => t.location === loc.id
        );
        console.log(selected)
        setSelectedTheatre('')
        if (!selected) return;
        setSelectedTheatre(selected.theatre_name)
        const fetchedScreens = screens.filter(s => s.theater_id === selected.id) 
        console.log(fetchedScreens)                                                
        const screenNames = fetchedScreens.map(s => s.name.toLowerCase());
        console.log(screenNames)
        setScreensDropdownValues(screenNames);
        } catch (ex) {
            console.log(ex)
        toast.error("Failed to load theaters for location");
        }
    };
    fetchScreensForTheatres();
    }, [componentState?.theatre]);

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
        let filtered = showTimes
        const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order])
        const paginatedShowTimes = paginate(sorted,currentPage,pageSize)
        console.log(paginatedShowTimes)
        return {totalCount: filtered.length, data: paginatedShowTimes}
    }
    const handleNewShow = async (e, data, setErrors) => {
        console.log("Adding new Movie")
        console.log(data)
        const movie = movies.find(m => m.title.toLowerCase() === data.movie.toLowerCase())
        console.log(movie)
        const screen = screens.find(s => s.name.toLowerCase() === data.screen.toLowerCase())
        console.log(screen)
        const location = locations.find(l => l.city.toLowerCase() === data.location.toLowerCase())
        console.log(location) 
        const showBody = {
            screen_id: screen.id,
            movie_id: movie.id,
            start_time: new Date(data.startTime),
            end_time: new Date(data.endTime),
            price: Number(data.price)
        }
        const showtime = await addShowTime(showBody)
        const updatedShowTime = {...showtime, movie_name: data.movie, screen_name: data.screen,theatre_name: data.theatre }
        setShowTimes({...showTimes,updatedShowTime})
        // setShow(false)}
        // navigate("/showtimes/new")
    }
    const handleSearch = () => {
        console.log("Searching..")
    }

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
                    {user && user.is_admin && <button onClick={setShow} className="btn btn-primary me-2">Add</button>}
                    {user && user.is_admin && <LoginPopup 
                    setAppData={setComponentState} 
                    modalLabel="Add New Showtime" 
                    buttonLabel="Add" setShow={setShow} 
                    show={show} 
                    componentSchema={schema} 
                    components={components} 
                    handleSubmit={handleNewShow}/>}
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
 
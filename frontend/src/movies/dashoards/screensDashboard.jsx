import { useState,useEffect } from "react";
import { useNavigate } from "react-router";
import Pagination from '../common/pagination'
import { paginate } from '../../utils/paginate';
import ScreenTable from "../common/tables/screens";
import { fetchScreens,deleteScreen, addScreen } from "../../services/screensService";
import { fetchTheatres } from "../../services/theatreService";
import _ from "lodash";
import { toast } from 'react-toastify';
import Joi from "joi-browser";
import LoginPopup from "../common/modal";
import { fetchLocations, getTheatersByLocId } from "../../services/locations";


export default function ScreensDashboard({user})  {
    const [screens, setScreens] = useState([])
    const [theatres, setTheatres] = useState([])
    const [locations, setLocations] = useState([])
    const [pageSize,setPageSize] = useState(7)
    const [currentPage,setCurrentPage] = useState(1)
    const [locationDropdownValues,setLocationDropdownValues] = useState([])
    const [theatersDropdownValues,setTheatersDropdownValues] = useState([])
    const [selectedLocation, setSelectedLocation] = useState("")
    const [sortColumn,setSortColumn] = useState({path: 'title', order: 'asc'})
    const [searchString,setSearchString] = useState("")
    const navigate = useNavigate()
    const [loading,setLoading] = useState(true)
    const [show, setShow] = useState(false);
    const handleShow = () => setShow(true);
    const [componentState,setComponentState] = useState()
    const schema = {
          theatre: Joi.string().required().label("Theatre"),
          location: Joi.string().required().label("Location"),
          name: Joi.string().required().label("Name"),
          rows: Joi.number().required().label("Rows"),
          columns: Joi.number().required().label("Columns"),
        }
    const components = [
      { type: "text", label: "name", key: "name", placeholder: "Screen Name", form_type: "control"},
      { type: "text", label: "location", key: "location", placeholder: selectedLocation || "Location", select_list: locationDropdownValues},
      { type: "text", label: "theatre", key: "theatre", placeholder: "Theatre", select_list: theatersDropdownValues},
      { type: "text",label: "rows",key: "rows",placeholder: "Rows in the screen", form_type: "control"},
      { type: "text",label: "columns",key: "columns",placeholder: "Columns in the screen", form_type: "control"},
    ]
    useEffect(() => {
        const fetchData = async () => {
        try {
            const [fetchedScreens, fetchedTheatres, fetchedLocations] = await Promise.all([
                fetchScreens(),
                fetchTheatres(),
                fetchLocations()
            ])
            setTheatres(fetchedTheatres)
            setLocations(fetchedLocations)
            const locationsList = fetchedLocations.map(item => item.location_name.toLocaleLowerCase())
            setLocationDropdownValues(locationsList)
            setTheatres(fetchedTheatres)
            const screensWithTheatreNames = []
            fetchedScreens.forEach((item) => {
                const theatre_id = item.theater_id
                const theatre = fetchedTheatres.find(t => t.id === theatre_id)
                console.log(theatre)
                const loc = fetchedLocations.find(l => l.id === theatre.location)
                console.log(loc)
                const data = {...item,theatre_name: theatre.theatre_name, location: loc.city}
                screensWithTheatreNames.push(data)
            })
            console.log(screensWithTheatreNames)
            setScreens(screensWithTheatreNames)
            setLoading(false)
        }
        catch (ex) {
            if (ex.response && ex.response.status === 404) {
                toast.error(`/auth/genres endpoint doesn't exist`)
            }
            setScreens([])
        }
    } 
    fetchData()
}, [])
    useEffect(() => {
    const fetchTheatersForLocation = async () => {
        if (!componentState?.location) return;

        try {
        const fetchedLocations = await fetchLocations();
        const selected = fetchedLocations.find(
            loc => loc.location_name.toLowerCase() === componentState.location.toLowerCase()
        );
        setSelectedLocation('')
        if (!selected) return;
        setSelectedLocation(selected.location_name)
        const fetchedTheaters = await getTheatersByLocId(selected);                                                  
        const theaterNames = fetchedTheaters.map(t => t.theater_name.toLowerCase());
        setTheatersDropdownValues(theaterNames);
        } catch (ex) {
            console.log(ex)
        toast.error("Failed to load theaters for location");
        }
    };

    fetchTheatersForLocation();
    }, [componentState?.location]);
    const handleAddScreen =  async (e, data, setErrors) => {
      try {
        const theatre = theatres.find(t => t.theatre_name.toLowerCase() === data.theatre)
        console.log(theatre)
        const loc = locations.find(l => l.location_name.toLowerCase() === data.location)
        console.log(loc)
      const screenBody = {
        name: data.name,
        theater_id: theatre.id,
        rows: Number(data.rows),
        columns: Number(data.columns)
      }
      const screen = await addScreen(screenBody)
      const updatedScreen = {...screen,theatre_name: theatre.theatre_name, location: loc.city}
      setScreens({...screens,updatedScreen })
      }catch (ex) {
        if (ex.response && ex.response.status === 400){
          toast.error(ex.message)
        }
        else {
            console.log(ex)
          toast.error("Unexpected error occured..")
        }
      }
    }
    const handleDelete =  async (screen) => {
        const originalScreens = [...screens]
        const updatedScreens = originalScreens.filter(m => m.id !== screen.id)
        setScreens(updatedScreens)
        try{
            await deleteScreen(screen)
        } catch (ex){
            toast.error("Unexpected error occured...")
            setScreens(originalScreens)
        }
    }
    const handlePageChange = (page) => {
        setCurrentPage(page)
    }
    const handleOnSort = (sortColumn) => {
        setSortColumn(sortColumn)
    }
    const getPagedData = () => {
        let filtered = screens
        console.log(screens)
        if (searchString) {
            filtered = screens.filter((movie) =>
            movie.title.toLowerCase().includes(searchString.toLowerCase())
            )
        }
        const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order])
        const paginatedScreens = paginate(sorted,currentPage,pageSize)
        console.log(paginatedScreens)
        return {totalCount: filtered.length, data: paginatedScreens}
    }
    const handleSearch = e => {
        console.log("searching")
       const {name, value} = e.target
       setSearchString(value)
    }
    const {totalCount,data} = getPagedData()
    console.log(componentState)
    console.log(theatersDropdownValues)
    if (loading) return null
    return (
            <div className='row'>
                <p>Showing {totalCount} screens from the database</p>
                <div className="d-flex align-items-center mb-3">
                <input 
                autoFocus
                type="text" 
                className="form-control me-2" 
                placeholder="Search Screens ..." 
                // name='search' 
                value={searchString} 
                onChange={handleSearch}/>
                {user && user.is_admin && <button onClick={handleShow} className="btn btn-primary me-2">Add</button>}
                {user && user.is_admin && <LoginPopup setAppData={setComponentState} modalLabel="Add New Screen" buttonLabel="Add" setShow={setShow} show={show} componentSchema={schema} components={components} handleSubmit={handleAddScreen}/>}
                </div>
                <div className="col">
                    <ScreenTable
                    user={user}
                    screens={data}
                    sortColumn={sortColumn}
                    onDelete={handleDelete}
                    onSort={handleOnSort}
                    ></ScreenTable>
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
 
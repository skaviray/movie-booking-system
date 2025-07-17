import { useState,useEffect } from "react";
import { useNavigate } from "react-router";
import Pagination from '../common/pagination'
import { paginate } from '../../utils/paginate';
import ScreenTable from "./screens";
import { fetchScreens,deleteScreen } from "../../services/screensService";
import { fetchTheatres } from "../../services/theatreService";
import _ from "lodash";
import { toast } from 'react-toastify';




export default function ScreensDashboard({user})  {
    const [screens, setScreens] = useState([])
    const [theatres, setTheatres] = useState([])
    const [pageSize,setPageSize] = useState(7)
    const [currentPage,setCurrentPage] = useState(1)
    const [sortColumn,setSortColumn] = useState({path: 'title', order: 'asc'})
    const [searchString,setSearchString] = useState("")
    const navigate = useNavigate()
    const [loading,setLoading] = useState(true)
    useEffect(() => {
        const fetchData = async () => {
        try {
            const fetchedScreens = await fetchScreens();
            const fetchedTheatres = await fetchTheatres()
            setTheatres(fetchedTheatres)

            const screensWithTheatreNames = []
            fetchedScreens.forEach((item) => {
                const theatre_id = item.theater_id
                const theatre = fetchedTheatres.find(t => t.id === theatre_id)
                const data = {...item,theatre_name: theatre.name}
                screensWithTheatreNames.push(data)
            })
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
        // let filtered = movies
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
    const handleNewScreen = () => {
        navigate("/screens/new")
    }
    const handleSearch = e => {
        console.log("searching")
       const {name, value} = e.target
       setSearchString(value)
    }
    const {totalCount,data} = getPagedData()
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
                {user && user.is_admin && <button onClick={handleNewScreen} className="btn btn-primary me-2">Add</button>}
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
 
import { useState,useEffect } from "react";
import { useNavigate } from "react-router";

import Pagination from '../common/pagination'
import { paginate } from '../../utils/paginate';
import LocationsTable from './locations'
// import withNavigation from './withNavigation';
import { fetchLocations, deleteLocation} from '../../services/locations';
import _ from "lodash";
import { toast } from 'react-toastify';




export default function LocationsDashboard({user})  {
    const [locations, setLocations] = useState([])
    const [pageSize,setPageSize] = useState(7)
    const [currentPage,setCurrentPage] = useState(1)
    const [sortColumn,setSortColumn] = useState({path: 'title', order: 'asc'})
    const [searchString,setSearchString] = useState("")
    const navigate = useNavigate()
    const [loading,setLoading] = useState(true)
    useEffect(() => {
        const fetchData = async () => {
        try {
            const fetchedLocations = await fetchLocations();
            setLocations(fetchedLocations)
            setLoading(false)
        }
        catch (ex) {
            if (ex.response && ex.response.status === 404) {
                toast.error(`/api/locations endpoint doesn't exist`)
            }
            setLocations([])
        }
    } 
    fetchData()
}, [])
    const handleDelete =  async (location) => {
        const originalLocations = [...locations]
        const updatedLocations = originalLocations.filter(location => location.id !== location.id)
        setLocations(updatedLocations)
        try{
            await deleteLocation(location)
        } catch (ex){
            toast.error("Unexpected error occured...")
            setLocations(originalLocations)
        }
    }
    const handlePageChange = (page) => {
        setCurrentPage(page)
    }
    const handleOnSort = (sortColumn) => {
        setSortColumn(sortColumn)
    }

    const getPagedData = () => {
        let filtered = locations
        console.log(locations)
        if (searchString) {
            filtered = locations.filter((location) =>
            location.name.toLowerCase().includes(searchString.toLowerCase())
            )
        }
        const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order])
        const paginatedLocations = paginate(sorted,currentPage,pageSize)
        console.log(paginatedLocations)
        return {totalCount: filtered.length, data: paginatedLocations}
    }
    const handleNewLocation = () => {
        console.log("Adding new Location")
        navigate("/locations/new")
    }
    const handleSearch = e => {
        console.log("searching")
       const {name, value} = e.target
       setSearchString(value)
    }
    const {totalCount,data} = getPagedData()
    console.log(user)
    if (loading) return null
    return (
            <div className='row'>
                <p>Showing {totalCount} Locations from the database</p>
                <div className="d-flex align-items-center mb-3">
                <input 
                autoFocus
                type="text" 
                className="form-control me-2" 
                placeholder="Search Locations ..." 
                // name='search' 
                value={searchString} 
                onChange={handleSearch}/>
                {user && user.is_admin && <button onClick={handleNewLocation} className="btn btn-primary me-2">Add</button>}
                </div>
                <div className="col">
                    <LocationsTable
                    user={user}
                    locations={data}
                    sortColumn={sortColumn}
                    onDelete={handleDelete}
                    onSort={handleOnSort}
                    ></LocationsTable>
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
 
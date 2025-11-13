import { useState,useEffect } from "react";
import { useNavigate } from "react-router";
import Pagination from '../common/pagination'
import { paginate } from '../../utils/paginate';
import LocationsTable from '../common/tables/locations'
import { fetchLocations, deleteLocation} from '../../services/locations';
import _ from "lodash";
import { toast } from 'react-toastify';
import { addLocation } from '../../services/locations'
import Joi  from "joi-browser";
import LoginPopup from "../common/modal";

export default function LocationsDashboard({user})  {
    const [locations, setLocations] = useState([])
    const [pageSize,setPageSize] = useState(7)
    const [currentPage,setCurrentPage] = useState(1)
    const [sortColumn,setSortColumn] = useState({path: 'title', order: 'asc'})
    const [searchString,setSearchString] = useState("")
    const navigate = useNavigate()
    const [loading,setLoading] = useState(true)
    const [show, setShow] = useState(false);
    const handleShow = () => setShow(true);
    const schema = {
      location_name: Joi.string().required().label("name"),
      city: Joi.string().required().label("City"),
      address: Joi.string().required().label("Address"),
    }
    const components = [
      { type: "text", label: "location_name", key: "location_name", placeholder: "Jakobsberg", form_type: "control"},
      { type: "text",label: "city",key: "city",placeholder: "Goteborg", form_type: "control"},
      { type: "text", label: "address", key: "address", placeholder: "Vecovagen 4 1230 lgh Jokobsberg", form_type: "control"},
    ]
    const handleLocationCreation =  async (e, data, setErrors) => {
      try {
      const locationBody = {
        location_name: data.location_name,
        city: data.city,
        address: data.address
      }
      const location = await addLocation(locationBody)
      console.log(location)
      const updatedLocations = [...locations, location]
      setLocations(updatedLocations)
      toast.success("Successfully Added the location")
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
    const handleDelete =  async (loc) => {
        const originalLocations = [...locations]
        const updatedLocations = originalLocations.filter(location => location.id !== loc.id)
        try{
            await deleteLocation(loc)
            setLocations(updatedLocations)
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
        return {totalCount: filtered.length, data: paginatedLocations}
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
                {user && user.is_admin && <LoginPopup modalLabel="Add New Location" buttonLabel="Add" setShow={setShow} show={show} componentSchema={schema} components={components} handleSubmit={handleLocationCreation}/>}
                {user && user.is_admin && <button onClick={handleShow} className="btn btn-primary me-2">Add</button>}
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
 
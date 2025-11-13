import React from 'react'
import { useState,useEffect } from 'react'
import { useNavigate } from "react-router";
import TheatreTable from '../common/tables/theatres'
import { deleteTheatre, fetchTheatres, addTheatre } from '../../services/theatreService'
import { toast } from 'react-toastify';
import _ from 'lodash'
import { paginate } from '../../utils/paginate';
import Pagination from '../common/pagination';
import { fetchLocations } from '../../services/locations';
import Joi from 'joi-browser';
import LoginPopup from '../common/modal';

export default function TheatreDashboard({user}) {
    const [theatres, setTheatres] = useState([])
    const [selectedTheater, selectTheatre] = useState({})
    const [locations, setLocations] = useState([])
    const [dropdownValues,setDropdownValues] = useState([])
    const [pageSize,setPageSize] = useState(7)
    const [currentPage,setCurrentPage] = useState(1)
    const [loading,setLoading] = useState(true)
    const [searchString,setSearchString] = useState("")
    const [sortColumn,setSortColumn] = useState({path: 'name', order: 'asc'})
    const [show, setShow] = useState(false);
    const handleShow = () => setShow(true);
    const schema = {
        name: Joi.string().required().label("Name"),
        location: Joi.string().valid(...dropdownValues).required().label("Location"),
    }
    const components = [
      { type: "text", label: "name", key: "name", placeholder: "Theater Name", form_type: "control"},
      { type: "text",label: "location",key: "location",placeholder: "location", select_list: dropdownValues}
    ]
    const navigate = useNavigate()
    useEffect(() => {
        const fetchData = async () => {
        try {
            const fetchedTheatres = await fetchTheatres()
            const fetchedLocations = await fetchLocations()
            const locationsList  = fetchedLocations.map(item => item.location_name.toLocaleLowerCase())
            setLocations(fetchedLocations)
            setDropdownValues(locationsList)
            const theatresWithLocations = fetchedTheatres.map(item => {
                const location = fetchedLocations.find(l =>  l.id === item.location)
                return {
                    ...item,location_name: location ? location.city : "NA"
                }
            })
            setTheatres(theatresWithLocations)
            setLoading(false)
        }
        catch (ex) {
            if (ex.response && ex.response.status === 404) {
                toast.error(`/auth/theatres endpoint doesn't exist`)
            }
            setTheatres([])
        }
    } 
    fetchData()
}, [])
    const handleAddTheatere =  async (e,data,setErrors) => {
      try {
      const location = locations.find(l => l.location_name.toLowerCase() === data.location)
      console.log(location)
      const theatreBody = {
        name: data.name,
        location: location.id
      }
    //   console.log(theatre)
      const theatre = await addTheatre(theatreBody)
      const updatedTheater = {...theatre, location_name: location.city}
      const updatedTheaters = {...theatres,updatedTheater }
      setTheatres(updatedTheaters)
      }catch (ex) {
        if (ex.response && ex.response.status === 400){
          toast.error(ex.message)
        }
        else {
          toast.error("Unexpected error occured..")
        }
      }
    }
    const handleDelete =  async (theatre) => {
        const originalTheatres = [...theatres]
        const updatedTheatre= originalTheatres.filter(t => t.id !== theatre.id)
        try{
            console.log(theatre)
            await deleteTheatre(theatre)
            setTheatres(updatedTheatre)
            // await deleteMovie(movie)
        } catch (ex){
            toast.error("Unexpected error occured...")
            setTheatres(originalTheatres)
        }
    }
    const handleLike = (theatre) => {
        console.log("Like Clicked for ", theatre)
    }
    const handlePageChange = (page) => {
        setCurrentPage(page)
    }
    const handleOnSort = (sortColumn) => {
        setSortColumn(sortColumn)
    }
    const getPagedData = () => {
        let filtered = theatres
        if (searchString) {
            filtered = theatres.filter((theatre) =>
            theatre.name.toLowerCase().includes(searchString.toLowerCase())
            )
        }
        console.log("Filtered Theatres ",filtered)
        const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order])
        const paginatedTheatres = paginate(sorted,currentPage,pageSize)
        return {totalCount: filtered.length, data: paginatedTheatres}
    }
    const handleNewTheatre = () => {
        console.log("Adding new Theatre")
        navigate("/theatres/new")
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
        <div className="col">
        <p>Showing {totalCount} Theatres from the database</p>
        <div className="d-flex align-items-center mb-3">
        <input 
        autoFocus
        type="text" 
        className="form-control me-2" 
        placeholder="Search Theatres ..." 
        // name='search' 
        value={searchString} 
        onChange={handleSearch}/>
        {user && user.is_admin && <button onClick={handleShow} className="btn btn-primary me-2">Add</button>}
        {user && user.is_admin && <LoginPopup modalLabel="Add New Theatre" buttonLabel="Add" setShow={setShow} show={show} componentSchema={schema} components={components} handleSubmit={handleAddTheatere}/>}
        </div>
        <TheatreTable
        theatres={data}
        sortColumn={sortColumn}
        onLike={handleLike}
        onDelete={handleDelete}
        onSort={handleOnSort}
        ></TheatreTable>
        <Pagination className="pagination"
        itemsCount={totalCount} 
        pageSize={pageSize} 
        onPageChange={handlePageChange} 
        currentPage={currentPage} 
        />
    </div>
  )
}

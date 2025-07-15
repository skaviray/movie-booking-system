import React from 'react'
import { useState,useEffect } from 'react'
import { useNavigate } from "react-router";
import TheatreTable from './theatres'
import { fetchTheatres } from '../services/theatreService'
import { toast } from 'react-toastify';
import _ from 'lodash'
import { paginate } from '../utils/paginate';
import Pagination from './common/pagination';

export default function TheatreDashboard({user}) {
    const [theatres, setTheatres] = useState([])
    const [selectedTheater, selectTheatre] = useState({})
    const [pageSize,setPageSize] = useState(7)
    const [currentPage,setCurrentPage] = useState(1)
    const [loading,setLoading] = useState(true)
    const [searchString,setSearchString] = useState("")
    const [sortColumn,setSortColumn] = useState({path: 'name', order: 'asc'})
    const navigate = useNavigate()
    useEffect(() => {
        const fetchData = async () => {
        try {
            const fetchedTheatres = await fetchTheatres();
            // const fetchedGenres = await fetchGenres();
            setTheatres(fetchedTheatres)
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
    const handleDelete =  async (theatre) => {
        const originalTheatres = [...theatres]
        const updatedTheatre= originalTheatres.filter(t => t.id !== theatre.id)
        setTheatres(updatedTheatre)
        try{
            console.log(theatre)
            // await deleteMovie(movie)
        } catch (ex){
            toast.error("Unexpected error occured...")
            setTheatres(originalTheatres)
        }
    }
    const handleSelectTheatre =  async (theatre) => {
        console.log(theatre)
        selectTheatre(theatre)
        console.log("selected theatre ", selectTheatre)
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
        {user && user.is_admin && <button onClick={handleNewTheatre} className="btn btn-primary btn-sm">New Theatre</button>}
        <p>Showing {totalCount} Theatres from the database</p>
        {/* <label for="exampleFormControlInput1" className="form-label">Search</label> */}
        <input 
        autoFocus
        type="text" 
        className="form-control mb-3" 
        placeholder="Search Theatres ..." 
        // name='search' 
        value={searchString} 
        onChange={handleSearch}/>
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

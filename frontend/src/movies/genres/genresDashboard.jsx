import { useState,useEffect } from "react";
import { useNavigate } from "react-router";

import Pagination from '../common/pagination'
import { paginate } from '../../utils/paginate';
import GenreTable from "./genres";
import { fetchGenres,deleteGenre } from '../../services/genreService';
import _ from "lodash";
import { toast } from 'react-toastify';




export default function GenresDashboard({user})  {
    const [genres,setGenres] = useState([])
    const [pageSize,setPageSize] = useState(7)
    const [currentPage,setCurrentPage] = useState(1)
    const [sortColumn,setSortColumn] = useState({path: 'title', order: 'asc'})
    const [searchString,setSearchString] = useState("")
    const navigate = useNavigate()
    const [loading,setLoading] = useState(true)
    useEffect(() => {
        const fetchData = async () => {
        try {
            const fetchedGenres = await fetchGenres();
            setGenres(fetchedGenres)
            setLoading(false)
        }
        catch (ex) {
            if (ex.response && ex.response.status === 404) {
                toast.error(`/auth/genres endpoint doesn't exist`)
            }
            setGenres([])
        }
    } 
    fetchData()
}, [])
    const handleDelete =  async (genre) => {
        const originalGenres = [...genres]
        const updatedGenres = originalGenres.filter(g => g.id !== genre.id)
        setGenres(updatedGenres)
        try{
            await deleteGenre(genre)
        } catch (ex){
            toast.error("Unexpected error occured...")
            setGenres(originalGenres)
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
        let filtered = genres
        if (searchString) {
            filtered = genres.filter((genre) =>
            genre.name.toLowerCase().includes(searchString.toLowerCase())
            )
        }
        const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order])
        const paginatedGenres = paginate(sorted,currentPage,pageSize)
        return {totalCount: filtered.length, data: paginatedGenres}
    }
    const handleNewGenre = () => {
        navigate("/genres/new")
    }
    const handleSearch = e => {
        console.log("searching")
       const {name, value} = e.target
       setSearchString(value)
    }
    const {totalCount,data} = getPagedData()
    console.log(totalCount, data)
    if (loading) return null
    return (
            <div className='row'>
                <div className="col">
                    <p>Showing {totalCount} Genres from the database</p>
                    <div className="d-flex align-items-center mb-3">
                    <input 
                    autoFocus
                    type="text" 
                    className="form-control me-2" 
                    placeholder="Search Genre ..." 
                    // name='search' 
                    value={searchString} 
                    onChange={handleSearch}/>
                    {user && user.is_admin && <button onClick={handleNewGenre} className="btn btn-primary me-2">Add</button>}
                    {/* {user && user.is_admin && <button onClick={handleNewMovie} className="btn btn-primary">DEL</button>} */}
                    </div>
                    <GenreTable
                    user={user}
                    genres={data}
                    sortColumn={sortColumn}
                    onDelete={handleDelete}
                    onSort={handleOnSort}
                    ></GenreTable>
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
 
import _ from "lodash";
import Like from '../common/like'
import { Link } from "react-router";
export default function MoviesGridView({user,movies, onBook,onDelete, onLike}) {
    // const renderCell = (movie) => {
    //     let path = "/movies/" + _.get(movie, "id")
    //     return <Link to={path} >{movie.title}</Link>
        
    // }
  return (
    <div className="container mt-4">
    <div className="row">
        {movies.map(movie => (
        <div className="col-sm-6 col-md-4 col-lg-3 mb-4" key={movie.id}>
            <div className="card">
            <img src={movie.poster} className="card-img-top" alt={movie.title} style={{ height: '250px', objectFit: 'cover' }} onClick={() => onBook(movie)}/>
            <div className="card-body d-flex flex-column">
                {user && user.is_admin ? <Link to={"/movies/" + _.get(movie, "id")} >{movie.title}</Link> : <p>{movie.title}</p>}
                <Like liked={movie.liked} onClick={() => onLike(movie)}/>
                <div className="mt-auto d-flex justify-content-end gap-2">
                {user && user.is_admin && <button onClick={() => onDelete(movie)  } className="btn btn-danger btn-sm">Delete</button>}
                </div>
            </div>
            </div>
        </div>
        ))}
    </div>
    </div>
  )
}

import _ from "lodash";
import Like from '../common/like'
import { Link } from "react-router";
export default function MoviesGridView({user,movies, onBook,onDelete, onLike}) {
    const renderCell = (movie) => {
        let path = "/movies/" + _.get(movie, "id")
        return <Link to={path} >{movie.title}</Link>
        
    }
  return (
    <div className="container mt-4">
    <div className="row">
        {movies.map(movie => (
        <div className="col-sm-6 col-md-4 col-lg-3 mb-4" key={movie.id}>
            <div className="card">
            <img src={movie.poster} className="card-img-top" alt={movie.title} style={{ height: '400px', objectFit: 'cover' }}/>
            <div className="card-body">
                {renderCell(movie)}
                <p className="card-text">{movie.genre}</p>
                <Like liked={movie.liked} onClick={() => onLike(movie)}/>
                <button onClick={() => onBook(movie)  } className="btn btn-primary btn-sm">Book</button>
                {user && user.is_admin && <button onClick={() => onDelete(movie)  } className="btn btn-danger btn-sm">Delete</button>}
            </div>
            </div>
        </div>
        ))}
    </div>
    </div>
  )
}

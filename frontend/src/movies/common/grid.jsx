import _ from "lodash";
import Like from '../common/like'
import { Link } from "react-router";
export default function MoviesGridView({user,movies, onBook,onDelete, onLike}) {
    // const renderCell = (movie) => {
    //     let path = "/movies/" + _.get(movie, "id")
    //     return <Link to={path} >{movie.title}</Link>
        
    // }
  return (
    <div className="movies">
        {movies.map(movie => (
            <div className="movie">
              <img src={movie.poster} className="image" alt={movie.title} onClick={() => onBook(movie)}/>
              <div className="like">
                {user && user.is_admin ? <Link to={"/movies/" + _.get(movie, "id")} >{movie.title}</Link> : <p1>{movie.title}</p1>}
                <Like liked={movie.liked} onClick={() => onLike(movie)}/>
                {user && user.is_admin && <button onClick={() => onDelete(movie)  } className="btn btn-danger btn-sm">Delete</button>}
              </div>
            </div>
    ))}
    </div>

  )
}

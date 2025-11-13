import _ from "lodash";
import Like from '../common/like'
import { Link } from "react-router";
export default function MoviesGridView({user,movies, onBook,onDelete, onLike}) {
  const showMovie = (movie) => {
    console.log(movie)
  }
  return (
    <div className="movies">
        {movies.map(movie => (
            <div className="movie">
              <img src={movie.poster} className="image" alt={movie.title} onClick={() => showMovie(movie)}/>
              <div className="like">
                <p1>{movie.title}</p1>
                <Like liked={movie.liked} onClick={() => onLike(movie)}/>
                {user && user.is_admin && <button onClick={() => onDelete(movie)} className="btn btn-danger btn-sm">Delete</button>}
                {!user && <button onClick={() => onBook(movie)} className="btn btn-danger btn-sm">Book</button>}
              </div>
            </div>
    ))}
    </div>

  )
}

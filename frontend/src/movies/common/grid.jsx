import _ from "lodash";
import Like from '../common/like'
export default function MoviesGridView({user,movies, onBook,onDelete, onLike}) {
  return (
    <div className="container mt-4">
    <div className="row">
        {movies.map(movie => (
        <div className="col-sm-6 col-md-4 col-lg-3 mb-4" key={movie.id}>
            <div className="card">
            <img src={movie.poster} className="card-img-top" alt={movie.title} />
            <div className="card-body">
                <h5 className="card-title">{movie.title}</h5>
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

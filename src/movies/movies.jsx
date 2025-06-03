import React from 'react'

import Like from './common/like'
const MoviesTable = (props) => {
    const {movies, onLike, onDelete} = props
    return (
    <table className="table">
        <thead>
            <tr>
            <th scope="col">Title</th>
            <th scope="col">Genre</th>
            <th scope="col">InStock</th>
            <th scope="col">RentalRate</th>
            <th scope="col"></th>
            </tr>
        </thead>
        <tbody>
            { movies.map( movie => (
                <tr key={movie._id}>
                    {/* <th scope="row">{movie._id}</th> */}
                    <td>{movie.title}</td>
                    <td>{movie.genre.name}</td>
                    <td>{movie.numberInStock}</td>
                    <td>{movie.dailyRentalRate}</td>
                    <td><Like liked={movie.liked} onClick={() => onLike(movie)}/></td>
                    <td><button onClick={() => onDelete(movie)  } className="btn btn-danger btn-sm">Delete</button></td>
                </tr>))}

        </tbody>
    </table>

    )

}

export default MoviesTable
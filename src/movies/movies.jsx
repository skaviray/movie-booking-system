import React,{Component} from 'react'

import Like from './common/like'
import TableHeader from './common/tableHeader'

class MoviesTable extends Component {

    render() { 
        const {movies, onLike, onDelete, onSort, sortColumn } = this.props
        const columns = [
            {path: "title", label: "Title"},
            {path: "genre.name", label: "Genre"},
            {path: "numberInStock", label: "InStock"},
            {path: "dailyRentalRate", label: "RentalRate"},
            {key: "like"},
            {key: "action"}

        ]
        return (
            <table className="table">
                <TableHeader
                columns={columns}
                sortColumn={sortColumn}
                onSort={onSort}
                />
                {/* <thead>
                    <tr>
                    <th onClick={() => this.raiseOnSort('title')} style={{cursor: "pointer"}}>Title</th>
                    <th onClick={() => this.raiseOnSort('genre.name')} style={{cursor: "pointer"}}>Genre</th>
                    <th onClick={() => this.raiseOnSort('numberInStock')} style={{cursor: "pointer"}}>InStock</th>
                    <th onClick={() => this.raiseOnSort('dailyRentalRate')} style={{cursor: "pointer"}}>RentalRate</th>
                    <th></th>
                    </tr>
                </thead> */}
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
        );
    }
}
 
export default MoviesTable;
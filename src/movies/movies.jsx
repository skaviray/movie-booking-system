import React,{Component} from 'react'

import Like from './common/like'

class MoviesTable extends Component {
    raiseOnSort = path => {
        const sortColumn = {...this.props.sortColumn}
        if (sortColumn.path === path) {
            sortColumn.order = (sortColumn.order === 'asc') ? 'desc' : 'asc'
        } else {
            sortColumn.path = path
            sortColumn.order = "asc"
        }
        this.props.onSort(sortColumn)
    }
    render() { 
        const {movies, onLike, onDelete, onSort } = this.props
        return (
            <table className="table">
                <thead>
                    <tr>
                    <th onClick={() => this.raiseOnSort('title')} style={{cursor: "pointer"}}>Title</th>
                    <th onClick={() => this.raiseOnSort('genre.name')} style={{cursor: "pointer"}}>Genre</th>
                    <th onClick={() => this.raiseOnSort('numberInStock')} style={{cursor: "pointer"}}>InStock</th>
                    <th onClick={() => this.raiseOnSort('dailyRentalRate')} style={{cursor: "pointer"}}>RentalRate</th>
                    <th></th>
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
                            <td><Like liked={movie.liked} onClick={() => this.props.onLike(movie)}/></td>
                            <td><button onClick={() => this.props.onDelete(movie)  } className="btn btn-danger btn-sm">Delete</button></td>
                        </tr>))}

                </tbody>
            </table>
        );
    }
}
 
export default MoviesTable;
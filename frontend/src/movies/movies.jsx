import React,{Component} from 'react'

import Like from './common/like'
import TableHeader from './common/tableHeader'
import TableBody from './common/tableBody'
import Table from './common/table'

class MoviesTable extends Component {

    render() { 
        const {movies, onLike, onDelete, onSort, sortColumn } = this.props
        console.log(movies)
        const columns = [
            {path: "title", label: "Title"},
            {path: "genre_id", label: "Genre"},
            {path: "number_in_stock", label: "InStock"},
            {path: "daily_rental_rate", label: "RentalRate"},
            {key: "like", content: movie => <Like liked={movie.liked} onClick={() => onLike(movie)}/>},
            {key: "action", content: movie => <button onClick={() => onDelete(movie)  } className="btn btn-danger btn-sm">Delete</button>}

        ]
        return (
            <Table
            data={movies}
            columns={columns}
            sortColumn={sortColumn}
            onSort={onSort}
            onDelete={onDelete}
            />
        );
    }
}
 
export default MoviesTable;
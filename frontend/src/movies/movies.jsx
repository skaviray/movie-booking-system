import React,{Component} from 'react'

import Like from './common/like'
import TableHeader from './common/tableHeader'
import TableBody from './common/tableBody'
import Table from './common/table'

class MoviesTable extends Component {

    render() { 
        const {user,movies, onLike, onDelete, onSort, sortColumn, onBook } = this.props
        const columns = [
            {path: "title", label: "Title"},
            {path: "genre_id", label: "Genre"},
            {path: "duration_minutes", label: "Duration"},
            {path: "language", label: "Language"},
            {key: "like", content: movie => <Like liked={movie.liked} onClick={() => onLike(movie)}/>},
            {key: "book", content: movie => <button onClick={() => onBook(movie)  } className="btn btn-primary btn-sm">Book</button>}
        ]
        if (user && user.is_admin) columns.push({key: "action", content: movie => <button onClick={() => onDelete(movie)  } className="btn btn-danger btn-sm">Delete</button>})
        return (
            <Table
            user={user}
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
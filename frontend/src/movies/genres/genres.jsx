import React,{Component} from 'react'
import Table from '../common/table'

class GenreTable extends Component {

    render() { 
        const {user,genres, onDelete, onSort, sortColumn } = this.props
        const columns = [
            {path: "name", label: "Name"},
            {path: "created_at", label: "CreatedAt"},
        ]
        columns.push({key: "action", content: movie => <button onClick={() => onDelete(movie)  } className="btn btn-danger btn-sm">Delete</button>})
        console.log(genres)
        return (
            <Table
            user={user}
            data={genres}
            columns={columns}
            sortColumn={sortColumn}
            onSort={onSort}
            onDelete={onDelete}
            />
        );
    }
}
 
export default GenreTable;
import React,{Component} from 'react'
import Table from '../table'

class ScreenTable extends Component {

    render() { 
        const {user,screens, onDelete, onSort, sortColumn, onBook } = this.props
        const columns = [
            {path: "name", label: "Name"},
            {path: "theatre_name", label: "Theatre"},
            {path: "location", label: "Location"}
        ]
        columns.push({key: "action", content: screen => <button onClick={() => onDelete(screen)  } className="btn btn-danger btn-sm">Delete</button>})
        return (
            <Table
            user={user}
            data={screens}
            columns={columns}
            sortColumn={sortColumn}
            onSort={onSort}
            onDelete={onDelete}
            />
        );
    }
}
 
export default ScreenTable;
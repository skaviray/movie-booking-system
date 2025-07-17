import React,{Component} from 'react'
import Table from '../common/table'

class LocationsTable extends Component {

    render() { 
        const {user,locations, onDelete, onSort, sortColumn, onBook } = this.props
        const columns = [
            {path: "city", label: "City"},
            {path: "state", label: "State"},
            {path: "country", label: "Country"},
            {path: "address", label: "Address"},
        ]
        columns.push({key: "action", content: movie => <button onClick={() => onDelete(movie)  } className="btn btn-danger btn-sm">Delete</button>})
        return (
            <Table
            user={user}
            data={locations}
            columns={columns}
            sortColumn={sortColumn}
            onSort={onSort}
            onDelete={onDelete}
            />
        );
    }
}
 
export default LocationsTable;
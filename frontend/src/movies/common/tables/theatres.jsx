import Table from '../table'
import Like from '../like'

export default function TheatreTable({theatres, onLike, onDelete, onSort, sortColumn } ) {
    const columns = [
        {path: "theatre_name", label: "Name"},
        {path: "location_name", label: "Location"},
        {key: "like",label: "Likes", content: theatre => <Like liked={theatre.liked} onClick={() => onLike(theatre)}/>},
        {key: "action",label: "Action", content: theatre => <button onClick={() => onDelete(theatre)  } className="btn btn-danger btn-sm">Delete</button>}
    ]
  return (
        <Table
            data={theatres}
            columns={columns}
            sortColumn={sortColumn}
            onSort={onSort}
            onDelete={onDelete}
        />
  )
}

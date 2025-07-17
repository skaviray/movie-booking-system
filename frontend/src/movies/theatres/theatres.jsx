import Table from '../common/table'
import Like from '../common/like'

export default function TheatreTable({theatres, onLike, onDelete, onSort, sortColumn } ) {
    const columns = [
        {path: "name", label: "Theater"},
        {path: "location_name", label: "Location"},
        {key: "like", content: theatre => <Like liked={theatre.liked} onClick={() => onLike(theatre)}/>},
        {key: "action", content: theatre => <button onClick={() => onDelete(theatre)  } className="btn btn-danger btn-sm">Delete</button>}
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

import Table from '../common/table'
import Like from '../common/like'

export default function ShowTimeTable({showtimes, onDelete, onSort, sortColumn } ) {
    const columns = [
        {path: "movie_name", label: "Movie"},
        {path: "screen_name", label: "Screen"},
        {path: "theatre_name", label: "Theatre"},
        {path: "start_time", label: "StartTime"},
        {path: "price", label: "Price"},
        {key: "action", content: theatre => <button onClick={() => onDelete(theatre)  } className="btn btn-danger btn-sm">Delete</button>}
    ]
  return (
        <Table
            data={showtimes}
            columns={columns}
            sortColumn={sortColumn}
            onSort={onSort}
            onDelete={onDelete}
        />
  )
}

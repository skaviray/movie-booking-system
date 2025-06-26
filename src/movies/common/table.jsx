import React from 'react'
import TableBody from './tableBody';
import TableHeader from './tableHeader';

const Table = (props) => {
    const {data, columns, sortColumn, onSort, onDelete} = props
    return (
        <table className="table table-bordered table-stripe">
            <TableHeader
            columns={columns}
            sortColumn={sortColumn}
            onSort={onSort}
            />
            <TableBody 
            data={data}
            columns={columns}
            onDelete={onDelete}
            />
        </table>
    );
}
 
export default Table;
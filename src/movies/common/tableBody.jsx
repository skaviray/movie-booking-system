import React, { Component } from 'react'
import _ from 'lodash'
import { Link } from 'react-router'

// Data
// columns


class TableBody extends Component {
    renderCell = (item, column) => {
        if (column.content) return column.content(item)
        // console.log(item)
        if (column.path === "title") {
            let path = "/movies/" + _.get(item, "_id")
            return <Link to={path} >{_.get(item, column.path)}</Link>
        }
        return  _.get(item, column.path)
        
    }
    render() { 
        const {data,columns} = this.props
        // elements = columns.map(column => <td>movies[</td>)
        return (
            <tbody>
                {data.map(item => <tr key={item._id}>{columns.map(column =><td key={ item._id + (column.path || column.key)}>{this.renderCell(item,column)}</td>)}</tr>)}
            </tbody>
        );
    }
}
 
export default TableBody;
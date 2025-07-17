import React, { Component } from 'react'
import _ from 'lodash'
import { Link } from 'react-router'

// Data
// columns


class TableBody extends Component {
    renderCell = (item, column) => {
        if (column.content) return column.content(item)
        if (column.path === "title") {
            let path = "/movies/" + _.get(item, "id")
            return <Link to={path} >{_.get(item, column.path)}</Link>
        }
        return  _.get(item, column.path)
        
    }
    render() { 
        const {user,data,columns} = this.props
        console.log(data)
        return (
            <tbody>
                {data.map(item => <tr key={item.id}>{columns.map(column =><td key={ item.id + (column.path || column.key)}>{this.renderCell(item,column)}</td>)}</tr>)}
            </tbody>
        );
    }
}
 
export default TableBody;
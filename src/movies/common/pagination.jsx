import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
// import { propTypes } from 'react-bootstrap/esm/Image'
const Pagination = (props) => {
    const { itemsCount, pageSize,onPageChange, currentPage } = props
    // console.log(currentPage)
    const pageCount = Math.ceil(itemsCount / pageSize)
    const pages = _.range(1, pageCount + 1)
    if (pageCount === 1) return null
    return ( 
        <nav aria-label="Page navigation example">
        <ul className="pagination">
            {
                pages.map(page => <li key={page} className={ page === currentPage ? "page-item active" : "page-item"}><a className="page-link" onClick={() => onPageChange(page)} style={{cursor: "pointer"}}>{page}</a></li>)
            }
        </ul>
        </nav>
     );
}

Pagination.propTypes = {
    temsCount: PropTypes.number.isRequired, 
    pageSize: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired, 
    currentPage: PropTypes.number.isRequired
};
 
export default Pagination;
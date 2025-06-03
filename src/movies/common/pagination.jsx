import React from 'react'
import _ from 'lodash'
const Pagination = (props) => {
    const { itemsCount, pageSize,onPageChange, currentPage } = props
    console.log(currentPage)
    const pageCount = Math.ceil(itemsCount / pageSize)
    const pages = _.range(1, pageCount + 1)
    if (pageCount === 1) return null
    return ( 
        <nav aria-label="Page navigation example">
        <ul class="pagination">
            {
                pages.map(page => <li key={page} className={ page === currentPage ? "page-item active" : "page-item"}><a className="page-link" onClick={() => onPageChange(page)} style={{cursor: "pointer"}}>{page}</a></li>)
            }
            
            {/* <li class="page-item"><a class="page-link" href="#">1</a></li>
            <li class="page-item"><a class="page-link" href="#">2</a></li>
            <li class="page-item"><a class="page-link" href="#">3</a></li>
            <li class="page-item"><a class="page-link" href="#">Next</a></li> */}
        </ul>
        </nav>
     );
}
 
export default Pagination;
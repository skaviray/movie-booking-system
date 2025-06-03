import React from 'react'

const ListGroup = (props) => {
    const {items,currentGenre, onSelectGenre} = props
    return (
    <ul className="list-group">
        <li className={currentGenre === "allGenres" ? "list-group-item active" :  "list-group-item"} >AllGenres</li>
        { items.map(item => 
        <li 
        key={item.name} 
        className={currentGenre === item.name ? "list-group-item active" :  "list-group-item"} 
        // className='list-group-item'
        onClick={() => onSelectGenre(item)} 
        style={{cursor: "pointer"}}>{item.name}</li>)}
    </ul>
    );
}
 
export default ListGroup;


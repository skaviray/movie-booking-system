import React from 'react'

const ListGroup = (props) => {
    const {items,currentGenre, onSelectGenre, textProperty, valueProperty} = props
    return (
    <ul className="list-group">
        { items.map(item => 
        <li 
        key={item[textProperty || "name"]} 
        className={currentGenre[textProperty || "name"] === item[textProperty || "name"] ? "list-group-item active" :  "list-group-item"} 
        onClick={() => onSelectGenre(item)} 
        style={{cursor: "pointer"}}>{item[textProperty || "name"]}</li>)}
    </ul>
    );
}
export default ListGroup;


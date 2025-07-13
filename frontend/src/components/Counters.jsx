import React, { Component } from 'react';

import Counter from './counterComponent';


const Counters = ({onDelete,onReset,onIncrement,onDecrement,counters}) => {
    return ( 
            <div>
                <button onClick={onReset} className="btn btn-primary m-2">Reset</button>
                {counters.map(counter => 
                <Counter key={counter.id} onDecrement={counter => onDecrement(counter)} onDelete={id => onDelete(id)} onIncrement={counter => onIncrement(counter)} counter={counter} />)}
            </div>
     );
}
 
export default Counters;
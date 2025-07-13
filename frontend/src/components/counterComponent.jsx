import React, { Component } from 'react';


class Counter extends Component {
    state = {
        // count: this.props.value,
        imageUrl: "https://picsum.photos/200",
        tags: ["tag1", "tag2", "tag3"]
    }
    // constructor() {
    //     super()
    //     this.incrementHandler = this.incrementHandler.bind(this)
    // }
    renderTags() {
        if (this.state.tags.length === 0) return <p>There are no elements</p>
        return <ul>{this.state.tags.map(tag => <li key={tag}>{tag}</li>)}</ul>
    }
    // incrementHandler = () => {
    //     console.log("Increment is clicked", this.state.count)
    //     this.setState({count: this.state.count + 1})
    // }

    render() { 
        console.log('props', this.props)
        const classes = this.getBadgeClasses()
        console.log(classes)
        return ( 
        <div className='row'>
            <div className="col-1">
            <span style={this.getStyles()} className={classes}>{this.formatCount()}</span> 
            </div>
            <div className="col">
            <button onClick={() => this.props.onIncrement(this.props.counter)} className='btn btn-secondary btn-sm'>+</button>
            <button onClick={() => this.props.onDecrement(this.props.counter) } className={this.getBadgeClasses()} disabled={this.props.counter.value == 0}>-</button>
            <button onClick={() => this.props.onDelete(this.props.counter.id)} className="btn btn-danger btn-sm">x</button>
            </div>
            <div className="col"></div>
            {/* <img src={this.state.imageUrl} alt="" /> */}
            
            
            
            

            
            {/* {this.renderTags()} */}
        </div>)

    }
    getButtonClasses() {
        let classes = "btn btn-secondary m-2 "
        if (this.props.counter.value === 0 ) return classes += "disabled"
        // classes += (this.props.counter.value === 0 ?'disabled' : "" )
        return classes
    }
    getBadgeClasses() {
        let classes = "badge m-2 bg-"
        classes += (this.props.counter.value === 0 ? "warning" : "primary");
        return classes;
    }
    getStyles() {
        return {
            fontSize: 10,
            fontWeight: 'bold'
        }
    }
    formatCount() {
        const { value } = this.props.counter;
        return value === 0 ? 'Zero' : value;
    }
}
 
export default Counter;
import logo from './logo.svg';
import './App.css';
import MoviesDashboard from './movies/moviesDashboard';
import Sidebar from './front-end-components/sidebar';
import NavBar from './components/navbar';
import Counters from './components/Counters';
import ListGroup from './movies/common/listGroup';

import React, { Component } from 'react';

class App extends Component {
//   state = { 
//     counters: [
//         { id: 1, value: 4},
//         { id: 2, value: 0},
//         { id: 3, value: 3},
//         { id: 4, value: 0},
//         { id: 5, value: 0}
//     ]
//  } 
//   handleDelete = (counterId) => {
//       console.log("Event Handler called in Counters", counterId)
//       const newCounters = this.state.counters.filter(counter => counter.id !== counterId)
//       this.setState({counters: newCounters})
//   }
//   handleIncrement = (counter) => {
//       console.log(counter)
//       const counters = [...this.state.counters]
//       const index = counters.indexOf(counter)
//       counters[index] = {...counter}
//       counters[index].value++
//       this.setState({counters})
//   }
//   handleDecrement = counter => {
//     const counters = [...this.state.counters]
//     const index = counters.indexOf(counter)
//     counters[index] = {...counter}
//     counters[index].value--
//     this.setState({counters})
//   }
//   handleReset =() => {
//       const counters = this.state.counters.map(counter => {
//           counter.value = 0
//           return counter
//       })
//       this.setState({counters})
//   }
  render() { 
    return (
      // <React.Fragment>
      // <NavBar totalCounters={this.state.counters.filter(counter => counter.value > 0).length} />
      // {/* <Sidebar/> */}
      // <main className='container'>
      //   <Counters
      //   onDelete={this.handleDelete}
      //   onIncrement={this.handleIncrement}
      //   onReset={this.handleReset}
      //   onDecrement={this.handleDecrement}
      //   counters={this.state.counters}
      //   />
      // </main>
      // </React.Fragment>
      <MoviesDashboard></MoviesDashboard>
      // <ListGroup></ListGroup>
    );
  }
}
 
export default App;


// import React, { useState } from "react";
import { Tabs, Tab, Container } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { getMovies } from "../services/fakeMovieService";
import React, { Component } from 'react';

class Pannel extends Component {
    state = { 
        key: "Overview"
     } 
    handleTabSelection= (keyvalue) => {
        this.setState({key: keyvalue})
    }
    render() { 
        return (
            <Container className="mt-4">
            <Tabs
              id="controlled-tab"
              activeKey={this.state.key}
            //   onSelect={(k) => setKey(k)}
            onSelect={ (key) => this.handleTabSelection(key) }
              className="mb-3"  
            >
              <Tab eventKey="overview" title="Overview">
                <h3>Overview</h3>
                <p>This is the overview content.</p>
              </Tab>
              <Tab eventKey="subclouds" title="Subclouds">
                  {getSubcloudInformation()}
              </Tab>
              <Tab eventKey="link" title="Link">
                <h3>Link</h3>
                <p>Additional links or content.</p>
              </Tab>
              <Tab eventKey="dis" title="Disabled">
                <p>This tab is disabled.</p>
              </Tab>
            </Tabs>
          </Container>
        );
    }
}
 
// export default Sidebar;
// const Sidebar = () => {
//   const [key, setKey] = useState("overview");
  const getSubcloudInformation = () => {
    console.log(getMovies)
    const movies = getMovies()
    return (
        <table class="table">
            <thead>
                <tr>
                <th scope="col">Title</th>
                <th scope="col">Genre</th>
                <th scope="col">InStock</th>
                <th scope="col">Rate</th>
                </tr>
            </thead>
            <tbody>
             {movies.map(movie => (
                                <tr>
                                <td>{movie.title}</td>
                                <td>{movie.genre.name}</td>
                                <td>{movie.numberInStock}</td>
                                <td>{movie.numberInStock}</td>
                                <td><button className="btn btn-danger m-2" >Delete</button></td>
                            </tr>
             ))}

            </tbody>
        </table>
    )
  }
//   return (
//     <Container className="mt-4">
//       <Tabs
//         id="controlled-tab"
//         activeKey={key}
//         onSelect={(k) => setKey(k)}
//         className="mb-3"
//       >
//         <Tab eventKey="overview" title="Overview">
//           <h3>Overview</h3>
//           <p>This is the overview content.</p>
//         </Tab>
//         <Tab eventKey="subclouds" title="Subclouds">
//             {getSubcloudInformation()}
//         </Tab>
//         <Tab eventKey="link" title="Link">
//           <h3>Link</h3>
//           <p>Additional links or content.</p>
//         </Tab>
//         <Tab eventKey="disabled" title="Disabled" disabled>
//           <p>This tab is disabled.</p>
//         </Tab>
//       </Tabs>
//     </Container>
//   );
// };

export default Pannel;

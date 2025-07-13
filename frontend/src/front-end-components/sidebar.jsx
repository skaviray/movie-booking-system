import React, { Component } from 'react';


class Sidebar extends Component {
    state = {  } 
    render() { 
        return (
          <div>
              <aside >
                <nav>
                  <ul>
                    <li className="mb-2">Dashboard</li>
                    <li className="mb-2">Settings</li>
                    <li className="mb-2">Profile</li>
                  </ul>
                </nav>
              </aside>
          </div>

        );
    }
}
 
export default Sidebar;
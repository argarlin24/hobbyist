import React, { Component } from 'react';
import { BrowserRouter as Router, Route} from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Landing from "./components/layout/Landing";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import UpdateProfile from "./components/pages/UpdateProfile";
import Search from "./components/pages/Search";
import UserPage from "./components/pages/UserPage"

import './App.css';

{/* Redux store that holds complete state tree of app 
  [] empty array as root reducer
  {} initial state as empty object 
*/}



class App extends Component {

  constructor() {
    super();
      
  }

  render() {
    return (
      
      <Router>
        <div className="App">
          <Navbar />
          <Route exact path= "/" component={Landing} />
          <div className="container">
            <Route exact path="/register" component={Register} />
            <Route exact path="/search" component={Search} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/userpage" component={UserPage} />
            <Route exact path="/profile" component={UpdateProfile} />
          </div>
          <Footer />
        </div>
      </Router>
  
    );
  }
}

export default App;

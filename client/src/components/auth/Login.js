import React, { Component } from 'react';
import { Redirect } from "react-router-dom";
import axios from "axios";


class Login extends Component {
    constructor() {
        super();
        this.state = {
            userid:"", 
            email: "",
            password: "",
            errors: {},
            redirectTo: null
        }

        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    onChange(e) {
        this.setState({[e.target.name]: e.target.value});
    }

    onSubmit(e) {
        e.preventDefault();

        const user = {
            email: this.state.email,
            password: this.state.password,
        }

        axios.post('/api/users/login', user)
        .then(
          res => {
            localStorage.setItem("token", res.data.token)
            //another axios get request to see if profile exits
            axios.get("/api/profile", {
              headers: {
                  "Authorization": localStorage.getItem("token")
              }
            })
              .then(
                  res => {console.log(res.data);

                    console.log(res.data.user._id);


                  this.setState({redirectTo: "/userpage"})

                
              }
            )
            .catch(err => this.setState({redirectTo: "/profile"}))
        })
        .catch(err => console.log(err.response.data));
    //     .catch(err => this.setState({errors: err.response.data}));
    }

  render() {
    if (this.state.redirectTo) {
      return <Redirect to={{ pathname: this.state.redirectTo}} />
    } else {
      return (
          <div className="login">
          <div className="container">
            <div className="row">
              <div className="col-md-8 m-auto">
                <h1 className="display-4 text-center">Log In</h1>
                <p className="lead text-center">Sign in to your Hobbyist</p>
                <form onSubmit={this.onSubmit}>
                  <div className="form-group">
                    <input type="email" className="form-control form-control-lg" placeholder="Email Address" name="email" value={this.state.email} onChange={this.onChange}/>
                  </div>
                  <div className="form-group">
                    <input type="password" className="form-control form-control-lg" placeholder="Password" name="password" value={this.state.password} onChange={this.onChange}/>
                  </div>
                  <input type="submit" className="btn ojbtn btn-block mt-4" />
                </form>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }
}

export default Login;
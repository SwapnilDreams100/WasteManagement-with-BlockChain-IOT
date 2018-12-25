import React, { Component } from 'react'

import './css/roboto.css';
import './css/rubik.css';
import './css/milligram.min.css';
import './App.css';
import LinkButton from './components/LinkButton';


class Home extends Component {

    render() {
    return (
      <div className="App">
        <div className="top-bar">
          <a href="#" className="title-link">TATA Grand IOT Hackathon</a>
          <div className="notice-box">Working</div>
        </div>
        <main className="container">
          <h2>Garbage Management</h2>
          <h3>IOT BlockChain</h3>
          
          <LinkButton to='/App'>See Statistics</LinkButton>
          <LinkButton to='/Dap'>See Routing</LinkButton>
          <LinkButton to='/Eve'>See Events</LinkButton>


        </main>
      </div>
    );
  }
}

export default Home
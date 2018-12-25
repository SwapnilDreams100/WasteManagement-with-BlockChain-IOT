import React from 'react'
import ReactDOM from 'react-dom'
import {BrowserRouter,Route} from 'react-router-dom'
import App from './App'
import Home from './Home'
import Dap from './Dap'
import Eve from './Eve'

ReactDOM.render(
  <BrowserRouter>
  <div>
    <Route path="/" component={Home}/>
    <Route path="/App" component={App}/>
    <Route path="/Dap" component={Dap}/>
    <Route path="/Eve" component={Eve}/>
  </div>
  </BrowserRouter>,
  document.getElementById('root')
);
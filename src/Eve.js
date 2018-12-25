import React, { Component } from 'react'
import IOTDevContract from '../build/contracts/IOTDev.json'

import getWeb3 from './utils/getWeb3'

import Modal from './components/Modal';

import ResultsOutput from './components/ResultsOutput'
import './css/roboto.css';
import './css/rubik.css';
import './css/milligram.min.css';
import './App.css';

class Eve extends Component {
  constructor(props) {
    super(props)
    this.initModal = this.initModal.bind(this);

    this.state = {

      temp:"",
      no_of_devices:"",
      t2:false,
      l:'',

      message:[],
      
      assignment:[],

      contractAddress: "none",
      modal: 0,
      buffer:null,
      instance: null,
      web3: null
    }
  }

  componentWillMount() {

    getWeb3
    .then(results => {
      this.setState({
        web3: results.web3
      })

      // Instantiate contract once web3 provided.
      this.instantiateGetDoc()
      this.instantiateSetDoc()

    })
    .catch(() => {
      console.log('Error finding web3.')
    })
  }

  //Doc Area

  instantiateGetDoc() {
    
    const contract = require('truffle-contract')
    const docChain = contract(IOTDevContract)
    let docChainInstance
    docChain.setProvider(this.state.web3.currentProvider)

    docChain.deployed().then((instance) => {
      docChainInstance = instance
      this.setState({ instance: docChainInstance })

      this.setState({ contractAddress: docChainInstance.address })

    }).then((result) => {
      var l=[]

      return this.setState({ 
        bin_list:l,
        truc_list:l
      })
    })
  }
  
  async gReg(message) {
    var log_arr=[];
    var event1;
    message.get((error,logs) => {
        
        for (var i =0;i<logs.length;i++){
            console.log(logs[i].args);
        }
    })
    console.log(log_arr)
  }  

  //Modal
  initModal(value) {
    this.setState({
      modal: value
    })
  }
  
  render() {
    
    return (
      <div className="Eve">
          <div className="contract-status">
            <p>Contract address: <span className="contract-address">{this.state.contractAddress}</span></p>
          </div>
                  <ResultsOutput state={this.state} gReg={this.gReg} initModal={this.initModal} />             

        <Modal modal={this.state.modal} />
      </div>
    );
  }
}

export default Eve
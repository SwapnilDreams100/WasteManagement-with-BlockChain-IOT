import React, { Component } from 'react'
import IOTDevContract from '../build/contracts/IOTDev.json'

import getWeb3 from './utils/getWeb3'

import RegulatorOutput from './components/RegulatorOutput'
import RegulatorInput from './components/RegulatorInput'

import {Tabs} from './components/Tabs';
import {Tab} from './components/Tab';

import Modal from './components/Modal';
import AssignmentOutput from './components/AssignmentOutput'

import {Pie} from 'react-chartjs-2';
import geolib from 'geolib';

import './css/roboto.css';
import './css/rubik.css';
import './css/milligram.min.css';
import './App.css';
import axios from 'axios'

class Dap extends Component {
  constructor(props) {
    super(props)
    this.gReg = this.gReg.bind(this);
    this.sReg= this.sReg.bind(this);
    this.get_assignment = this.get_assignment.bind(this);
    this.initModal = this.initModal.bind(this);

    this.state = {
      temp:"",
      no_of_devices:"",
      t2:false,
      l:'',

      bin_list:[{
        'timestamp':'',
        'coords':{'latitude':0,'longitude':0},
        'weight':{'filled':0,'not-filled':0}  
      }],

      truc_list:[{
        'timestamp':'',
        'coords':{'latitude':0,'longitude':0},
      }],

      assignment:[],

      data: {
        labels: ['Filled','Non Filled'],
        datasets: [
            {   label:'',
                data: [30,70],
                backgroundColor: ["#F7464A", "#46BFBD"]
            }
        ]
      },

      options: {
        title: {
          display: true,
          text: "",
          fontFamily: "Roboto",
          fontSize: 20,
        },
        maintainAspectRatio:false,
      },
      
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
  
  instantiateSetDoc() { 
    const contract = require('truffle-contract')
    const docChain = contract(IOTDevContract)
    let docChainInstance
    docChain.setProvider(this.state.web3.currentProvider)

    docChain.deployed().then((instance) => {
      docChainInstance = instance
      this.setState({ instance: docChainInstance })
      this.setState({ contractAddress: docChainInstance.address })

    }).then((result) => {
      return this.setState({ 
        t2:result
    })
    })
  }

  async gReg(message) {
    var l_bin=[]
    var l_truck=[]
    console.log(message)
    for (var i =0; i<message.length;i++)
    { var response=await axios.get('http://127.0.0.1:8500/bzz:/'+message[i].toString(), { crossdomain: true })
      console.log(response.data['type'])

      //bin list
      if (response.data['type']===0)
      {
        var ob={
          'timestamp':response.data['timestamp'],
          'coords':{'latitude':response.data['lat'],'longitude':response.data['lng']},
          'weight':{'filled':response.data['weight_filled'],'not-filled':100-response.data['weight_filled']}  
          }
        l_bin.push(ob);
      }

      //truck list
      else{
        var ob={
          'timestamp':response.data['timestamp'],
          'coords':{'latitude':response.data['lat'],'longitude':response.data['lng']},
          }
        l_truck.push(ob); 
      }
    }
    this.setState({
      bin_list:l_bin,
      truc_list:l_truck
     })
     {this.get_assignment()}
  }

  sReg(message) {
    this.setState({ 
      t2: message
    })
  }
  get_assignment(){
    var truc_list=this.state.truc_list;
    var bin_list=this.state.bin_list;
    
    for(var i=0;i<(truc_list).length;i++)
    { var distances=[]
      for (var j =0;j<bin_list.length;j++)
      {  if (bin_list[j]['weight']['filled']>=50)
        {
          var dist =geolib.getDistance(truc_list[i]['coords'],bin_list[j]['coords']);
          // pushing {filled weight, dist(truc and bin), bin_index}
          distances.push([bin_list[j]['weight']['filled'],dist,j]);
        }          
      }
      
    
      distances.sort(compareSecondColumn);
    
      function compareSecondColumn(a, b) {
          if (a[1] === b[1]) {
              return 0;
          }
          else {
              return (a[1] < b[1]) ? -1 : 1;
          }
      }
      var new_assign=this.state.assignment.concat({'truck':i+1,'bin':distances[0][2]+1});
      this.state.assignment=new_assign;

      var removed_bin_list = bin_list.splice(distances[0][2],1);
      console.log(removed_bin_list.length)
      bin_list=removed_bin_list;
      this.state.bin_list=bin_list;

    }
  }
  //Modal
  initModal(value) {
    this.setState({
      modal: value
    })
  }
  
  render() {
    
    let assign=[]
    for (let i=0;i<this.state.assignment.length;i++)
    {
      assign.push(<AssignmentOutput assigndata={this.state.assignment[i]} />)
    }
    
    return (
      <div className="Dap">
          <div className="contract-status">
            <p>Contract address: <span className="contract-address">{this.state.contractAddress}</span></p>
          </div>
                
                  <RegulatorOutput state={this.state} gReg={this.gReg} initModal={this.initModal} />             
                  
                  <h4>Assignment Status</h4>
                  
                  <b>Truck</b> -> <b>Bin</b><br/>

                  {assign}
                  
        <Modal modal={this.state.modal} />
      </div>
    );
  }
}

export default Dap
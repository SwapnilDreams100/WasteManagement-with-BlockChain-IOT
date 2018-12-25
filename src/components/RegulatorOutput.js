import React from 'react';

class RegulatorOutput extends React.Component {
  submit(e) {
    e.preventDefault();
    const state = this.props.state;
    const instance = state.instance;

    const setDocRequest = async () => {
      const result = instance.get_device_timestamps('0x2d0f82a98d0dbca037b4d84212259e73ccbf0823',{ from: state.web3.eth.accounts[0]}).then((result) => {
        this.props.initModal(0);
        return result
      });
      return result
    }

    const setDocRequest2 = async (result_n) => {
        const result = instance.get_device_data('0x2d0f82a98d0dbca037b4d84212259e73ccbf0823',result_n,{ from: state.web3.eth.accounts[0]}).then((result) => {
          this.props.initModal(0);
          return result
        })
      return result
    }
    const getDocRequest = async () => {
      this.props.initModal(1);
      const result = await setDocRequest();
      var result_n=[]
      for (var i =0; i<result.length;i++)
      {
        result_n.push(result[i].c[0])
      }
      var result_data=[]
      for (var i =0; i<result_n.length;i++)
      { 
        const result_temp = await setDocRequest2(result_n[i]);
        result_data.push(result_temp)
      }
      this.props.gReg(result_data);
      console.log(result_data)
    }
    getDocRequest();
  }

  render() {
    return (
      <form className="Supplier-form" onSubmit={(e) => this.submit(e)}>
        <button type="submit" value="Submit" className="button-submit js-button-submit">Get Data</button>
      </form>
    )
  }
}

export default RegulatorOutput;
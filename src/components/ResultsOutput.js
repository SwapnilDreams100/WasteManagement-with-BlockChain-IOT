import React from 'react';

class ResultsOutput extends React.Component {
  submit(e) {
    e.preventDefault();
    const state = this.props.state;
    const instance = state.instance;

    const setDocRequest = async () => {
      const result = instance.log_action({},{fromBlock:0,toBlock:'latest'})
      return result
    }

    const getDocRequest = async () => {
      const result = await setDocRequest();
    
      this.props.gReg(result);
    }
    getDocRequest();
  }

  render() {
    return (
      <form className="Supplier-form" onSubmit={(e) => this.submit(e)}>
        <button type="submit" value="Submit" className="button-submit js-button-submit">Get Events</button>
      </form>
    )
  }
}

export default ResultsOutput;
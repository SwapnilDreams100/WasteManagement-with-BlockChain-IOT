import React from 'react';

class AssignmentOutput extends React.Component {
  render() {
    console.log(this.props.assigndata)
    return (
      <div>
      {this.props.assigndata['truck']} -> {this.props.assigndata['bin']}
      <br/>
    </div>
    )
  }
}

export default AssignmentOutput;

import React from 'react';
import { Context } from '../AgoraRTC/AgoraRTC';

console.log('Context > ', Context);
class Join extends React.Component {
  static contextType = Context;

  render() {
    console.log('this.context > ', this.context);
    return (
      <div>
        join
      </div>
    )
  }
}

export default Join;
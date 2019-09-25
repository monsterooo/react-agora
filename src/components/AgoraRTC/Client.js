import React from 'react';
import _ from 'lodash';
import Context from './Context';
import Display from './Display';

class Client extends React.Component {
  static contextType = Context;
  constructor(props) {
    super(props);
  }
  render() {
    const { clients } = this.context;

    console.log('clients > ', clients);
    return (
      <div>
        {_.map(clients, (v, k) => {
          return <Display key={k} stream={v} />
        })}
      </div>
    )
  }
}

export default Client;
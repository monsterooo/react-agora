import React from 'react';
import _ from 'lodash';
import Context from './Context';
import Display from './Display';

class Client extends React.Component {
  static contextType = Context;
  render() {
    const { clients } = this.context;
    const { width, height } = this.props;

    console.log('clients > ', clients);
    return (
      <div className="agora_client">
        {_.map(clients, (v, k) => {
          return <Display key={k} stream={v} width={width} height={height} />
        })}
      </div>
    )
  }
}

export default Client;
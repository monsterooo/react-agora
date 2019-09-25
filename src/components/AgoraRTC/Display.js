import React from 'react';
import Context from './Context';

const prefix = 'agora_dispaly_';

class Display extends React.Component {
  static contextType = Context;
  constructor(props) {
    super(props);
    this.init = false;
  }
  componentDidMount() {
    const { stream } = this.props;
    console.log('------------Dispaly > ', stream);
  }
  componentDidUpdate(prevProps) {
    const { stream } = this.props;
    const id = `${prefix}${stream.getId()}`;
    if (stream.displayState === 'play' && !this.init) {
      this.init = true;
      stream.play(id);
    }
  }
  render() {
    const { stream } = this.props;
    const id = `${prefix}${stream.getId()}`;

    return (
      <div id={id} style={{ opacity: 0.1 }}>
        {stream.getId()}
      </div>
    )
  }
}

export default Display;
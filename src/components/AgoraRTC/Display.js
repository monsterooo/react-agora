import React from 'react';
import Context from './Context';

const prefix = 'agora_dispaly_';

class Display extends React.Component {
  static contextType = Context;
  constructor(props) {
    super(props);
    this.init = false;
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
    const { stream, width, height } = this.props;
    const id = `${prefix}${stream.getId()}`;

    return (
      <div class="agora_display" id={id} style={{ width, height, opacity: 0.05 }}>
        {stream.getId()}
      </div>
    )
  }
}

export default Display;
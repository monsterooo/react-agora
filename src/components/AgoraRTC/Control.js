import React from 'react';
import Context from './Context';

class Control extends React.Component {
  static contextType = Context;
  constructor(props) {
    super(props);
    this.state = {
      video: true,
      audio: true,
    };
  }
  handleVideoControl = () => {
    const { video } = this.state;
    const { localStream } = this.context;

    if (video) {
      localStream.muteVideo();
    } else {
      localStream.unmuteVideo();
    }
    this.setState({ video: !video });
  }
  handleAudioControl = () => {
    const { audio } = this.state;
    const { localStream } = this.context;

    if (audio) {
      localStream.muteAudio();
    } else {
      localStream.unmuteAudio();
    }
    this.setState({ audio: !audio });
  }
  render() {
    const { video, audio } = this.state;

    return (
      <div className="agora_control">
        <button onClick={this.handleVideoControl}>{video ? '关闭' : '开启'}</button>
        <button onClick={this.handleAudioControl}>{audio ? '关闭' : '开启'}</button>
      </div>
    )
  }
}

export default Control;

import React from 'react';
import AgoraRTCSDK from 'agora-rtc-sdk';
import Context from './Context';

class Join extends React.Component {
  static contextType = Context;
  handleJoin = () => {
    const { client, tokenOrKey, uid, channel, defaultVideo, defaultAudio } = this.context;
    const {
      updateLocalStream,
      onClientJoinError,
    } = this.context;

    client.join(tokenOrKey, channel, uid, uid => {
      const localStream = AgoraRTCSDK.createStream({
        streamID: uid,
        audio: true,
        cameraId: defaultVideo.deviceId,
        microphoneId: defaultAudio.deviceId,
        video: true,                          // TODO ?
        screen: false
      });
      updateLocalStream(localStream);
    }, onClientJoinError);
  }
  render() {
    return (
      <button onClick={this.handleJoin}>加入</button>
    )
  }
}

export default Join;
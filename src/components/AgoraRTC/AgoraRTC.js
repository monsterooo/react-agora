import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import Context from './Context';
import AgoraRTCSDK from '../../utils/AgoraRTCSDK-2.9.0';

const playId = 'agora_rtc_localstream';

class AgoraRTC extends React.Component {
  constructor(props) {
    super(props);
    const { onRequirementError } = props;

    this.state = {
      client: null,
      devices: [],
      defaultVideo: null,
      defaultAudio: null,
      localStream: null,          // 本地视频流
      localStreamContainer: null, // 本地视频流容器
      clients: {},                // 其他加入的用户流
    };
    if(!AgoraRTCSDK.checkSystemRequirements()) return onRequirementError();
    let localStreamContainer = document.getElementById(playId);
    if (!localStreamContainer) {
      localStreamContainer = document.createElement('div');
      localStreamContainer.id = playId;
      document.body.appendChild(localStreamContainer);
    }
    AgoraRTCSDK.getDevices((devices) => {
      // 以下是获取默认第一个音视频设备
      const defaultAudio = _.head(_.filter(devices, v => {
        return v.kind === 'audioinput';
      }));
      const defaultVideo = _.head(_.filter(devices, v => {
        return v.kind === 'videoinput';
      }));

      console.log('设备 > ', defaultAudio, defaultVideo);
      this.setState({
        devices,
        defaultVideo,
        defaultAudio,
        localStreamContainer,
      })
    });
  }
  componentDidMount() {
    this.init();
  }
  init() {
    const { onClientInitError } = this.props;
    const { appId } = this.props;

    // 该方法用于创建客户端，在每次会话里仅调用一次
    const client = AgoraRTCSDK.createClient({mode: 'live'});
    // 根据appId初始化客户端对象
    client.init(appId, () => {}, error => {
      onClientInitError(error);
    });
    this.bindEvents(client);
    this.setState({ client });
  }
  bindEvents(client) {
    client.on('stream-added', e => {
      const { stream } = e;
      client.subscribe(stream, function (err) {
        console.log("Subscribe stream failed", err);
      });
      // 保存所有加入的用户流
      this.setState({
        clients: {
          ...this.state.clients,
          [stream.getId()]: stream,
        }
      });
    });
    client.on('stream-subscribed', e => {
      const { stream } = e;
      const subscribedStream = this.state.clients[stream.getId()];
      subscribedStream.displayState = 'play'; // 加入的用户状态为播放
      this.setState({
        clients: this.state.clients,
      });
    });
    // 用户离开
    const leave = e => {
      const { stream } = e;
      const { clients } = this.state;

      stream.stop();
      this.setState({ clients: _.omit(clients, stream.getId()) });
    }
    client.on('stream-removed', leave);
    client.on('peer-leave', leave);
  }
  updateLocalStream = localStream => {
    this.setState({ localStream });
  }
  getContext() {
    return {
      ...this.props,
      ...this.state,
      updateLocalStream: this.updateLocalStream,
    };
  }
  render() {
    const { children } = this.props;

    return (
      <Context.Provider value={this.getContext()}>
        <div>
          {children}
        </div>
      </Context.Provider>
    )
  }
}

AgoraRTC.defaultProps = {
  tokenOrKey: null,                             // 可设置为空或使用服务器返回的token
  channel: '',                                  // 标识通话频道的字符串
  uid: null,                                    // 指定用户的ID, 默认服务器会生成
  onClientStreamPublished: () => {},            // 本地视频流被发布后回调
  onRequirementError: () => {},                 // 环境监测失败
  onClientInitError: () => {},                  // 客户端初始化失败
  onClientJoinError: () => {},                  // 客户端加入是吧
  onClientPublishError: () => {},               // 客户端发布本地视频流错误
  onLocalStreamInitError: () => {},             // 本地流初始化失败
};
AgoraRTC.propTypes = {
  channel: PropTypes.any.isRequired,
  onClientStreamPublished: PropTypes.func,
  onRequirementError: PropTypes.func,
  onClientInitError: PropTypes.func,
  onClientJoinError: PropTypes.func,
  onClientPublishError: PropTypes.func,
  onLocalStreamInitError: PropTypes.func,
}

export default AgoraRTC;
export {
  Context,
};
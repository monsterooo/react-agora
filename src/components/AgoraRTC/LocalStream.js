import React from 'react';
import PropTypes from 'prop-types';
import Context from './Context';
import Control from './Control';

class LocalStream extends React.Component {
  static contextType = Context;
  constructor(props) {
    super(props);
    this.state = {
      init: false,
    }
    this.el = null;
  }
  componentDidMount() {
    const { localStream, localStreamContainer } = this.context;

    // 重新创建组件让本地流插入到正常的容器中
    if (localStream) {
      this.el.appendChild(localStreamContainer);
      localStreamContainer.style.display = 'block';
    }
  }
  componentDidUpdate() {
    const { localStreamPlayId, videoProfile } = this.props;
    const { client, localStream, localStreamContainer } = this.context;
    const { onClientPublishError, onClientStreamPublished, onLocalStreamInitError } = this.context;

    if (localStream && !this.state.init) {
      this.setState({ init: true });
      this.el.appendChild(localStreamContainer);
      localStreamContainer.style.display = 'block';
      localStream.setVideoProfile(videoProfile);
      // 本地流初始化
      localStream.init(function() {
        localStream.play(localStreamPlayId); // 播放视频
        // 该方法将本地音视频流发布至 SD-RTN。
        // 发布音视频流之后，本地会触发 Client.on("stream-published")
        // 回调；远端会触发 Client.on("stream-added") 回调。
        client.publish(localStream, onClientPublishError);

        client.on('stream-published', onClientStreamPublished);
      }, onLocalStreamInitError);
    }
  }
  componentWillUnmount() {
    const { localStreamContainer } = this.context;
    localStreamContainer.style.display = 'none';
    document.body.appendChild(localStreamContainer);
  }
  getEl = el => {
    this.el = el;
  }
  render() {
    const { control } = this.props;

    return (
      <div
        ref={this.getEl}
        style={{ opacity: 0.05 }}
      >
        {control && this.state.init && <Control />}
      </div>
    )
  }
}

LocalStream.defaultProps = {
  // https://docs.agora.io/cn/Video/API%20Reference/web/interfaces/agorartc.stream.html#setvideoprofile
  videoProfile: '360p',                         // 视频质量
  control: false,                               // 是否显示控制器
  localStreamPlayId: 'agora_rtc_localstream',   // 本地流播放元素
}

LocalStream.propTypes = {
  control: PropTypes.bool,
  videoProfile: PropTypes.string,
  localStreamPlayId: PropTypes.string,
}

export default LocalStream;

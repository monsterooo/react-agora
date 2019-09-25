import React from 'react';
import AgoraRTC from './components/AgoraRTC/AgoraRTC';
import Join from './components/AgoraRTC/Join';
import LocalStream from './components/AgoraRTC/LocalStream';
import Client from './components/AgoraRTC/Client';
import './App.css';

// import Join from './components/Video/Join';

const appId = '';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      move: false,
      name: '',
    };
  }
  componentDidMount() {
    // setTimeout(() => {
    //   this.setState({ move: true });
    // }, 8000);
  }
  handleNameChange = e => {
    this.setState({ name: e.target.value });
  }
  render() {
    const { name } = this.state;

    return (
      <div className="App">
        <input value={name} onChange={this.handleNameChange} />
        <AgoraRTC
          appId={appId}
          channel="coderlane.net"
          uid={name}
          onClientStreamPublished={e => {
            console.log('本地流被发布 > ', e)
          }}
        >
          <Join />
          <LocalStream videoProfile="360p" />
          <Client />
          {/* <div>
            <p>box1</p>
            {!move ? <LocalStream videoProfile="360p" /> : null}
          </div>
          <hr />
          <div>
            <p>box2</p>
            {move ? <LocalStream videoProfile="360p" /> : null}
          </div> */}
        </AgoraRTC>
      </div>
    )
  }
}
export default App;

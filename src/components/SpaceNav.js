import {Entity} from 'aframe-react';
import React, {PropTypes} from 'react';

import {Cursor} from 'react-cursor';
import WebSocket from 'ws';
// https://github.com/SocketCluster/socketcluster-client/issues/40  downgrade WS to 0.8.1

import _ from 'lodash';


class SpaceNav extends React.Component {
  static propTypes = {
    cursor: PropTypes.instanceOf(Cursor),
  };

  componentDidMount() {
    const WS_PORT = 8081;

    try {
      const ws = new WebSocket(`ws://localhost:${WS_PORT}`);

      console.log('opening web socket');

      // ws.on('error', console.log);
      // ws.on('open', () => console.log('open'));

      ws.addEventListener('message', (msg) => {
        const {translate, rotate} = JSON.parse(msg.data).spaceNav;

        if(translate) {
          const {x, y, z} = translate;
          this.props.cursor.refine('translate').set(V3(-x, y, -z));
        }

        if(rotate) {
          const {x, y, z} = rotate;
          this.props.cursor.refine('rotate').set(V3(x * -15, y * 15, z * -15));
        }
      });
    } catch (err) {
      console.log(err);
    }
  }

  render() {
    // const {} = this.props.cursor.value();
    return (
      <Entity >
      </Entity>
    );
  }
}

export default SpaceNav;

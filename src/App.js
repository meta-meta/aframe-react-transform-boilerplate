import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import 'aframe';
import './util/shorthand';
import {Scene, Entity} from 'aframe-react';
import Camera from './components/Camera';
import Image from './components/Image';
import Sky from './components/Sky';
import Text from './components/Text';
import Box from './components/Box';
import LeapMotion from './components/LeapMotion';
import SpaceNav from './components/SpaceNav';

import {Cursor} from 'react-cursor';

export class App extends Component {
  render() {
    const {cursor} = this.props;
    const leapCur = cursor.refine('leapMotion');
    const spaceNavCur = cursor.refine('spaceNav');

    const trans = spaceNavCur.refine('translate').value();
    const rot = spaceNavCur.refine('rotate').value();

    return (
      <Scene onTick={(t, dt) => cursor.refine('time').set({t, dt})}
             onEnterVR={() => {leapCur.refine('isVR').set(true);}}
             onExitVR={() => {leapCur.refine('isVR').set(false);}}
      >
        <SpaceNav cursor={spaceNavCur} />

        <Camera>
          <LeapMotion cursor={leapCur} />

          <Entity position="-3 -2 -5">
            <Box position={`${-trans.x} ${trans.y} ${-trans.z}`} rotation={`${rot.x * -90} ${rot.y * 90} ${rot.z * -90}`}/>
          </Entity>

        </Camera>




        <Sky/>

      </Scene>
    );
  }
}
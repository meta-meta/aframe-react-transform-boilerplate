import React, { Component } from 'react';
import 'aframe';
import './util/shorthand';
import {Scene, Entity} from 'aframe-react';
import Camera from './components/Camera';
import Sky from './components/Sky';
import Box from './components/Box';
import LeapMotion from './components/LeapMotion';
import SpaceNav from './components/SpaceNav';
import _ from 'lodash';
import {hslToHex} from './util/colorConversion';

const WORLD = 'WORLD';
const LOCAL = 'LOCAL';

export class App extends Component {
  onTick = (t, dt) => {
    const {cursor} = this.props;
    cursor.refine('time').set({t, dt});

    const {translate, rotate, translateMode} = cursor.refine('spaceNav').value();

    const boxCur = cursor.refine('box');
    const posCur = boxCur.refine('position');
    const rotCur = boxCur.refine('rotation');

    const boxObj = this.scene.getObjectById(boxCur.refine('object3DId').value());

    const nextBoxPos = {
      [LOCAL]: () => {
        boxObj.translateX(translate.x);
        boxObj.translateY(translate.y);
        boxObj.translateZ(translate.z);
        return boxObj.position.clone();
      },
      [WORLD]: () => posCur.value().clone().add(translate),
    }[translateMode]();

    posCur.set(nextBoxPos);
    rotCur.set(rotCur.value().clone().add(rotate));
  };

  render() {
    const {cursor} = this.props;
    const leapCur = cursor.refine('leapMotion');
    const spaceNavCur = cursor.refine('spaceNav');
    const wintabCur = cursor.refine('wintab');

    const trans = spaceNavCur.refine('translate').value();
    const rot = spaceNavCur.refine('rotate').value();

    const boxCur = cursor.refine('box');

    const {x, y, pressure, azimuth, altitude, isEraser} = wintabCur.value();

    return (
      <Scene onLoaded={evt => {this.scene = evt.target.sceneEl.object3D;}}
             onTick={this.onTick}
             onEnterVR={() => {leapCur.refine('isVR').set(true);}}
             onExitVR={() => {leapCur.refine('isVR').set(false);}}
      >
        <SpaceNav cursor={spaceNavCur} wintabCur={wintabCur}/>

        <Camera>
          <LeapMotion cursor={leapCur} />

          {/*SpaceNav*/}
          <Entity position="-3 -2 -5">
            <Box position={trans.toAframeString()} rotation={rot.toAframeString()}/>
          </Entity>

        </Camera>

        {/*Box*/}
        <Entity position="0 0 -10">
          <Box onLoaded={evt => boxCur.refine('object3DId').set(evt.target.object3D.id)}
               position={boxCur.refine('position').value().toAframeString()}
               rotation={boxCur.refine('rotation').value().toAframeString()}/>
        </Entity>

        {/*Stylus*/}
        <Entity position="0 0 -5">
          <Entity position={`${x / 600} 0 ${y / 600}`}
                  rotation={`${altitude - 90} ${-azimuth} 0`}>
            <Box position="0 0.5 0" width={0.04} height={1} depth={0.04}/>
            <Box width={0.05} height={0.05} depth={0.05} color={isEraser ? '#000' : hslToHex(0, pressure, 0.5 + pressure / 2)} />
          </Entity>

        </Entity>

        <Sky/>

      </Scene>
    );
  }
}
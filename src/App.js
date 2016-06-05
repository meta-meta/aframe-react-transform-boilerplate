import React, { Component } from 'react';
import 'aframe';
import './util/shorthand';
import {Scene, Entity} from 'aframe-react';
import Camera from './components/Camera';
import Sky from './components/Sky';
import ControlPanel from './components/ControlPanel';
import ComponentEditor from './components/ComponentEditor';
import ComponentList from './components/ComponentList';
import Box from './components/Box';
import LeapMotion from './components/LeapMotion';
import Image from './components/Image';
import Plane from './components/Plane';
import SpaceNav from './components/SpaceNav';
import _ from 'lodash';
import {hslToHex} from './util/colorConversion';

const WORLD = 'WORLD';
const LOCAL = 'LOCAL';

export class App extends Component {
  constructor() {
    super();

    window.registeredComponents = {
      Plane,
      Image
    };
  }

  onTick = (t, dt) => {
    const {cursor} = this.props;
    cursor.refine('time').set({t, dt});

    const {spaceNav} = cursor.value();
    const {translate, rotate, translateMode, speed} = spaceNav;

    const selectedObjCur = this.getSelectedCmpCursor();
    
    if(selectedObjCur) {      
      const posCur = selectedObjCur.refine('props', 'position');
      const rotCur = selectedObjCur.refine('props', 'rotation');

      const selectedObj = this.scene.getObjectById(selectedObjCur.refine('object3DId').value());

      const nextBoxPos = {
        [LOCAL]: () => {
          selectedObj.translateX(translate.x * speed);
          selectedObj.translateY(translate.y * speed);
          selectedObj.translateZ(translate.z * speed);
          return selectedObj.position.clone();
        },
        [WORLD]: () => posCur.value().clone().add(translate.clone().multiplyScalar(speed)),
      }[translateMode]();

      posCur.set(nextBoxPos);
      rotCur.set(rotCur.value().clone().add(rotate.clone().multiplyScalar(speed)));
    }

  };

  getSelectedCmpCursor = () => {
    const {selectedCursorPath} = this.props.cursor.value();
    return selectedCursorPath && this.props.cursor.refine.apply(null, selectedCursorPath);
  };

  render() {
    const {cursor} = this.props;
    const leapCur = cursor.refine('leapMotion');
    const spaceNavCur = cursor.refine('spaceNav');
    const wintabCur = cursor.refine('wintab');
    const {panel, listComponents, showControllers} = cursor.value();

    const trans = spaceNavCur.refine('translate').value();
    const rot = spaceNavCur.refine('rotate').value();

    const {x, y, pressure, azimuth, altitude, isEraser} = wintabCur.value();
    const selectedCmpCur = this.getSelectedCmpCursor();

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
          {
            showControllers ? <Entity position="-1.5 -1.5 -2">
              <Box position={trans.toAframeString()}
                   rotation={rot.toAframeString()}
                   width={0.2}
                   height={0.2}
                   depth={0.2}
              />
            </Entity> : null
          }


        </Camera>

        {/*Stylus*/}
        {
          showControllers ? <Entity position="0 0 -5">
            <Entity position={`${x / 600} 0 ${y / 600}`}
                    rotation={`${altitude - 90} ${-azimuth} 0`}>
              <Box position="0 0.5 0" width={0.04} height={1} depth={0.04}/>
              <Box width={0.05} height={0.05} depth={0.05} color={isEraser ? '#000' : hslToHex(0, pressure, 0.5 + pressure / 2)} />
            </Entity>
          </Entity> : null
        }


        {/*Panel from editor state*/}
        <Entity position="0 0 -5">
          {
            _.map(panel, (cmp, key) =>
              React.createElement(registeredComponents[cmp.type], _.assign({}, cmp.props, {key}))
            )
          }
        </Entity>

        <Sky/>

        <ControlPanel cursor={cursor}/>

        {
          selectedCmpCur ? <ComponentEditor selectedComponentCursor={selectedCmpCur}/> : null
        }

        {
          listComponents ? <ComponentList cursor={cursor}/> : null
        }

      </Scene>
    );
  }
}
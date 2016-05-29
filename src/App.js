import React, { Component } from 'react';
import 'aframe';
import './util/shorthand';
import {Scene, Entity} from 'aframe-react';
import Camera from './components/Camera';
import Sky from './components/Sky';
import ComponentEditor from './components/ComponentEditor';
import Box from './components/Box';
import Plane from './components/Plane';
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

  constructor() {
    super();
    window.registeredComponents = {
      Plane
    };
  }
  
  getSelectedCmpCursor = () => {
    const {selectedCursorPath} = this.props.cursor.value();
    return selectedCursorPath && this.props.cursor.refine.apply(null, selectedCursorPath);
  };

  loadPanelsFromJSON = json => this.props.cursor.refine('panel').set(JSON.parse(json, (key, val) => {
    if(key === 'position' || key === 'rotation') {
      return objToV3(val);
    }
    return val;
  }));

  storeComponentObject3DId = (evt, id) => this.props.cursor.refine('panel', id).merge({object3DId: evt.target.object3D.id});

  spawnComponent = (type) => {
    const id = _.uniqueId();

    this.props.cursor.refine('panel').merge({
      [id]: {
        id,
        type,
        props: {
          position: V3(),
          rotation: V3(),
          color: '#ffffff',
          onLoaded: evt => this.storeComponentObject3DId(evt, id),
        }
      }
    });

  };
  
  spawnPlane = () => this.spawnComponent('Plane');

  render() {
    const {cursor} = this.props;
    const leapCur = cursor.refine('leapMotion');
    const spaceNavCur = cursor.refine('spaceNav');
    const wintabCur = cursor.refine('wintab');
    const {panel} = cursor.value();

    const trans = spaceNavCur.refine('translate').value();
    const rot = spaceNavCur.refine('rotate').value();

    const boxCur = cursor.refine('box');

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

        {/*Panel from editor state*/}
        <Entity position="0 0 -5">
          {
            _.map(panel, (cmp, key) =>
              React.createElement(registeredComponents[cmp.type], _.extend({}, cmp.props, {key}))
            )
          }
        </Entity>

        <Sky/>

        <div style={{
          width: '100%',
          height: 50,
          background: '#666',
          position: 'absolute',
          bottom: 0,
          zIndex: 1,
        }}>
          <button onClick={this.spawnPlane} >Plane</button>
          <input type="text" placeholder="paste panel JSON" onChange={evt => this.loadPanelsFromJSON(evt.target.value)}></input>
        </div>

        {
          selectedCmpCur ? <ComponentEditor selectedComponentCursor={selectedCmpCur}/> : null
        }


      </Scene>
    );
  }
}
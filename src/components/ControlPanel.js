import React from 'react';
import _ from 'lodash';
import Plane from './Plane';

class ControlPanel extends React.Component {
  constructor() {
    super();

    window.registeredComponents = {
      Plane
    };
  }

  shouldComponentUpdate() {
    return false;
  }

  loadPanelsFromJSON = json => this.props.cursor.refine('panel').set(JSON.parse(json, (key, val) => {
    if (key === 'position' || key === 'rotation') {
      return objToV3(val);
    }
    return val;
  }));

  storeComponentObject3DId = (evt, id) => this.props.cursor.refine('panel', id).merge({object3DId: evt.target.object3D.id});

  spawnComponent = (type) => {
    const id = _.uniqueId();
    const {cursor} = this.props;

    cursor.refine('panel').merge({
      [id]: {
        id,
        type,
        name: `${id}-${type}`,
        props: {
          position: V3(),
          rotation: V3(),
          color: '#ffffff',
          onLoaded: evt => this.storeComponentObject3DId(evt, id),
        }
      }
    });

    cursor.refine('selectedCursorPath').set(['panel', id]);

  };

  spawnPlane = () => this.spawnComponent('Plane');

  toggleCmpList = () => this.props.cursor.refine('listComponents').swap(v => !v);

  printPanel = () => console.log(JSON.stringify(this.props.cursor.refine('panel').value()));

  render() {
    return (
      <div style={{
          width: '100%',
          height: 50,
          background: '#666',
          position: 'absolute',
          bottom: 0,
          zIndex: 1,
        }}>
        <button onClick={this.toggleCmpList}>List Cmps</button>
        <button onClick={this.printPanel}>Print Panel Cfg</button>
        <button onClick={this.spawnPlane}>Plane</button>
        <input type="text" placeholder="paste panel JSON" onChange={evt => this.loadPanelsFromJSON(evt.target.value)}/>
      </div>
    );
  }
}

export default ControlPanel;

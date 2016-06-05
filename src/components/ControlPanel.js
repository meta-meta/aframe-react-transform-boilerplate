import React from 'react';
import _ from 'lodash';

class ControlPanel extends React.Component {
  shouldComponentUpdate() {
    return false;
  }

  loadPanelsFromJSON = json => {
    const parsedData = JSON.parse(json, (key, val) => {
      if (key === 'position' || key === 'rotation') {
        return objToV3(val);
      }
      return val;
    });

    // hack to continue generating unique IDs where we left off
    const largestId = parseInt(_(parsedData).keys().orderBy().last());
    _.each(_.range(largestId), () => _.uniqueId());

    this.props.cursor.refine('panel').set(parsedData);
  };

  storeComponentObject3DId = (evt, id) => this.props.cursor.refine('panel', id).merge({object3DId: evt.target.object3D.id});

  spawnComponent = (type, props) => {
    const id = _.uniqueId();
    const {cursor} = this.props;

    cursor.refine('panel').merge({
      [id]: {
        id,
        type,
        name: `${id}-${type}`,
        props: _.assign({
          position: V3(),
          rotation: V3(),
          onLoaded: evt => this.storeComponentObject3DId(evt, id),
        }, props)
      }
    });

    cursor.refine('selectedCursorPath').set(['panel', id]);
  };

  spawnPlane = () => this.spawnComponent('Plane', {width: 1, height:1, color: '#ffffff'});
  
  spawnImage = () => this.spawnComponent('Image', {url: '', pixelsPerMeter: 1000});

  toggleCmpList = () => this.props.cursor.refine('listComponents').swap(v => !v);

  printPanel = () => console.log(JSON.stringify(this.props.cursor.refine('panel').value()));

  render() {
    return (
      <div style={{
          width: '100%',
          height: 20,
          background: '#666',
          position: 'absolute',
          bottom: 0,
          zIndex: 1,
        }}>
        <button onClick={this.toggleCmpList}>List Cmps</button>
        <button onClick={this.printPanel}>Print Panel Cfg</button>
        <button onClick={this.spawnPlane}>Plane</button>
        <button onClick={this.spawnImage}>Image</button>
        <input type="text" placeholder="paste panel JSON" onChange={evt => this.loadPanelsFromJSON(evt.target.value)}/>
      </div>
    );
  }
}

export default ControlPanel;

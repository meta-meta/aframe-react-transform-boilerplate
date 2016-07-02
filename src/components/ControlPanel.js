import React from 'react';
import _ from 'lodash';

class ControlPanel extends React.Component {
  shouldComponentUpdate(nextProps) {
    const nextCursor = nextProps.cursor;
    const nextCursorVal = nextCursor.value();

    const {recordStatePath, recordingName, isRecording, recordings, playback, playbackFrame} = nextCursorVal;
    const frameOfState = recordStatePath && this.props.cursor.refine.apply(null, recordStatePath).value();

    if(isRecording) {
      //TODO: diff state and save only the changes
      const recordingCur = nextProps.cursor.refine('recordings', recordingName, 'data');
      recordingCur.push([frameOfState]);
    }

    if(playback) {
      const {data, path} = recordings[playback];
      const frame = data[playbackFrame % data.length];
      nextCursor.refine.apply(null, path).set(frame);
      nextCursor.refine('playbackFrame').set(playbackFrame + 1);
    }

    const propsOfInterest = ['isRecording', 'recordStatePath', 'recordingName'];
    return !_.isEqual(_.pick(nextCursorVal, propsOfInterest), _.pick(this.props.cursor.value(), propsOfInterest));
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
  
  toggleInsp = () => this.props.cursor.refine('viewInspector').swap(v => !v);

  printPanel = () => console.log(JSON.stringify(this.props.cursor.refine('panel').value()));

  recState = () => {
    const {cursor} = this.props;
    const {isRecording, recordingName, recordStatePath} = cursor.value();

    if(!isRecording) {
      cursor.refine('recordings').merge({[recordingName]: {path: recordStatePath, data: []}});
    }

    this.props.cursor.refine('isRecording').swap(v => !v);
  };

  render() {
    const {cursor} = this.props;
    const {isRecording, recordings} = cursor.value();
    const recordStatePath = cursor.refine('recordStatePath');
    const recordingName = cursor.refine('recordingName');
    const playback = cursor.refine('playback');

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
        <button onClick={this.toggleInspector}>Insp</button>
        <button onClick={this.printPanel}>Print Panel Cfg</button>
        <button onClick={this.spawnPlane}>Plane</button>
        <button onClick={this.spawnImage}>Image</button>
        <input type="text" placeholder="paste panel JSON" onChange={evt => this.loadPanelsFromJSON(evt.target.value)}/>
        <input type="text" placeholder="recording name" onChange={evt => recordingName.set(evt.target.value)}/>
        <input type="text" placeholder="state.path"
               onChange={evt => recordStatePath.set(evt.target.value.split('.'))}
        />
        <button onClick={this.recState} disabled={!recordingName.value()}>{isRecording ? 'Stop' : 'Rec'}</button>
        <select value={playback.value()} onChange={evt => playback.set(evt.target.value)}>
          {[undefined].concat(_.keys(recordings)).map(recordingName => <option value={recordingName}>{recordingName}</option>)}
        </select>
      </div>
    );
  }
}

export default ControlPanel;

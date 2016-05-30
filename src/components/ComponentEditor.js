import React from 'react';
import _ from 'lodash';

class ComponentEditor extends React.Component {
  
  
  render() {
    const {selectedComponentCursor: cur} = this.props;
    const selectedCmp = cur.value();
    
    const propTypes = registeredComponents[selectedCmp.type].propTypes;

    const renderProp = (cur, prop, propName, propType) => {
      const objectProp = (cur, prop, propTypes) => (
        <ul>
          {_.map(prop, (val, key) =>
            <li>
              {key}: {renderProp(cur.refine(key), val, ''/*avoid nested propname false match*/, propTypes[key])}
            </li>
          )}
        </ul>
      );

      const onChange = evt => {
        let {value} = evt.target;

        if(React.PropTypes.number === propType) {
          value = parseFloat(evt.target.value);
        }

        if(value) {
          cur.set(value);
        }
      };

      const propRenderer = {
        color: () => <input type="color" value={prop} onChange={onChange}/>
      }[propName];

      const v3PropTypes = {
        x: React.PropTypes.number,
        y: React.PropTypes.number,
        z: React.PropTypes.number,
      };

      return propRenderer ? propRenderer()
        : _.isObject(prop) ? objectProp(cur, prop, window.v3Prop === propType ? v3PropTypes : {})
        : <input type="text" value={prop} onChange={onChange}/>
    };

    return (
      <div style={{
          width: 300,
          height: '100%',
          background: '#666',
          position: 'absolute',
          right: 0,
          zIndex: 1,
        }}>
        <h1>Component Id: {selectedCmp.id}</h1>
        <ul>
          {_.map(_.omit(selectedCmp.props, ['onLoaded']), (prop, propName) =>
            <li key={propName}>
              {propName}: {renderProp(cur.refine('props', propName), prop, propName, propTypes && propTypes[propName])}
            </li>
          )}
        </ul>
      </div>
    );
  }
}

export default ComponentEditor;

import React from 'react';
import _ from 'lodash';

class ComponentEditor extends React.Component {
  render() {
    const {selectedComponentCursor} = this.props;
    const selectedCmp = selectedComponentCursor && selectedComponentCursor.value() || {};

    const renderProp = (prop, propName) => {
      const objectProp = prop => (
        <ul>
          {_.map(prop, (val, key) => <li>{key}: {renderProp(val)}</li>)}
        </ul>
      );

      const propRenderer = {
        color: () => <input type="color" value={prop}/> //<ColorPicker prop={prop}/>,
      }[propName];

      return propRenderer ? propRenderer()
        : _.isObject(prop) ? objectProp(prop)
        : <input type="text" value={prop} />
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
          {_.map(_.omit(selectedCmp.props, ['onLoaded']), (prop, key) => <li>{key}: {renderProp(prop, key)}</li>)}
        </ul>
      </div>
    );
  }
}

export default ComponentEditor;

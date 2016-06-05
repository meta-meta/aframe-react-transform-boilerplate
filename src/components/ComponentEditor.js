import React from 'react';
import _ from 'lodash';
import {ImmutableOptimizations} from 'react-cursor';
import NumberInput from './NumberInput';

const v3Prop = React.PropTypes.shape({
  x: React.PropTypes.number,
  y: React.PropTypes.number,
  z: React.PropTypes.number,
});

class ComponentEditor extends React.Component {
  shouldComponentUpdate = ImmutableOptimizations(['selectedComponentCursor']).shouldComponentUpdate.bind(this);

  render() {
    const {selectedComponentCursor: cur} = this.props;
    const selectedCmp = cur.value();
    const nameCur = cur.refine('name');

    const propTypes = _.assign({}, registeredComponents[selectedCmp.type].propTypes, {
      position: v3Prop,
      rotation: v3Prop,
    });

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

        if (value) {
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
        : _.isObject(prop) ? objectProp(cur, prop, v3Prop === propType ? v3PropTypes : {})
        : React.PropTypes.number === propType ? <NumberInput cursor={cur}/>
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
        <input type="text" value={nameCur.value()} onChange={evt => nameCur.set(evt.target.value)}/>
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

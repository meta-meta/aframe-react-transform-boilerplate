import React from 'react';
import _ from 'lodash';

class ComponentList extends React.Component {
  shouldComponentUpdate(nextProps) {
    return !_.isEqual(
      _.keys(this.props.cursor.refine('panel').value()),
      _.keys(nextProps.cursor.refine('panel').value())
    );
  }

  selectCmp = (id) => {
    const {cursor} = this.props;
    cursor.refine('selectedCursorPath').set(['panel', id]);
    cursor.refine('listComponents').set(false);
  };

  deleteCmp = (id) => {
    const {cursor} = this.props;

    const selectedCur = cursor.refine('selectedCursorPath');
    const selected = selectedCur.value();
    if (selected && selected[1] === id) {
      selectedCur.set(undefined);
    }

    const panelCur = cursor.refine('panel');
    panelCur.set(_.omit(panelCur.value(), id));
  };

  cloneCmp = (sourceId) => {
    const {cursor} = this.props;
    const panelCur = cursor.refine('panel');
    const id = _.uniqueId();

    const source = panelCur.refine(sourceId).value();

    const newObj = _.assign(_.cloneDeep(source), {
      id,
      name: source.name + '(cloned)'
    });

    panelCur.merge({[id]: newObj});

    cursor.refine('selectedCursorPath').set(['panel', id]);
  };

  render() {
    const cur = this.props.cursor.refine('panel');
    return (
      <div style={{
          width: 300,
          height: '100%',
          background: '#666',
          position: 'absolute',
          right: 0,
          zIndex: 1,
        }}>
        <h1>Components</h1>
        <ul>
          {_.map(cur.value(), (cmp, id) =>
            <li key={id}>
              <span onClick={() => this.selectCmp(id)}>{cmp.name}</span>
              <button onClick={() => this.deleteCmp(id)}>delete</button>
              <button onClick={() => this.cloneCmp(id)}>clone</button>
            </li>
          )}
        </ul>
      </div>
    );
  }
}

export default ComponentList;

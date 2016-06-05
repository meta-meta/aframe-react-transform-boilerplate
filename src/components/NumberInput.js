import React from 'react';
import _ from 'lodash';

class NumberInput extends React.Component {
  constructor() {
    super();
    this.state = {value: undefined};
  }

  componentWillMount() {
    this.setState({value: this.props.cursor.value()});
  }

  componentWillReceiveProps(nextProps) {
    const nextVal = nextProps.cursor.value();
    if (nextVal !== this.props.cursor.value()) {
      this.setState({value: nextVal});
    }
  }

  onChange = evt => {
    const {value} = evt.target;
    this.setState({value});

    const parsedVal = parseFloat(value);
    if (!_.isNaN(parsedVal)) {
      this.props.cursor.set(parsedVal);
    }
  };

  render() {
    return (
      <input type="number" value={this.state.value} onChange={this.onChange}/>
    );
  }
}

export default NumberInput;
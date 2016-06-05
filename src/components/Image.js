import React, {PropTypes} from 'react';
import {Entity} from 'aframe-react';
import Plane from './Plane';

class Image extends React.Component {
  constructor() {
    super();

    this.state = {
      imgWidth: 0,
      imgHeight: 0,
    };

    this.getDimensions = (w, h) => {
      //TODO: if only width specified, size to that; if only height, ' '
      return {
        width: w / this.props.pixelsPerMeter,
        height: h / this.props.pixelsPerMeter,
      }
    }
  }

  loadImage = () => {
    let img = document.createElement('img');

    let wait = setInterval(() => {
      if(img.width) {
        this.setState({imgWidth: img.width, imgHeight: img.height});
        const {width, height} = this.getDimensions(img.width, img.height);
        this.props.onDimensionsLoaded(width, height);

        clearInterval(wait);
      }
    }, 100);

    img.setAttribute('src', this.props.url);
  };

  componentWillMount() {
    if(this.props.url) {
      this.loadImage();
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !_.isEqual(this.props, nextProps) || !_.isEqual(this.state, nextState);
  }

  componentDidUpdate(prevProps) {
    if(prevProps.url !== this.props.url) {
      this.loadImage();
    }
  }

  render() {
    const {imgWidth, imgHeight} = this.state;
    const {width, height} = this.getDimensions(imgWidth, imgHeight);

    return (
      <Plane {...this.props}
        width={this.props.width || width}
        height={this.props.height || height}
        material={{shader: 'flat', src: `url(${this.props.url})`, transparent: true, opacity: this.props.opacity}}
        class={this.props.ignoreRaycaster ? '' : 'clickable'}
      >
        {this.props.children}
      </Plane>
    );
  }
}

Image.propTypes = {
  onDimensionsLoaded: PropTypes.func,
  pixelsPerMeter: PropTypes.number,
  opacity: PropTypes.number,
  ignoreRaycaster: PropTypes.bool,
  url: PropTypes.string,
};

Image.defaultProps = {
  onDimensionsLoaded: (w, h) => {},
  pixelsPerMeter: 1000,
  opacity: 1,
  ignoreRaycaster: false,
};

export default Image;
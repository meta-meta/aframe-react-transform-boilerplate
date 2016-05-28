import {Entity} from 'aframe-react';
import React from 'react';

class Plane extends React.Component {
    static propTypes = {
        position: React.PropTypes.shape({
            x: React.PropTypes.number,
            y: React.PropTypes.number,
            z: React.PropTypes.number,
        }),
        width: React.PropTypes.number,
        height: React.PropTypes.number,
        color: React.PropTypes.string,
    };

    static defaultProps = {
        width: 1,
        height: 1,
        position: V3(),
        rotation: V3(),
        color: '#666',
    };

    render() {
        const {width, height, color, position, rotation, ...rest} = this.props;
        return (
            <Entity material={{color}}
                    position={position.toAframeString()}
                    rotation={rotation.toAframeString()}
                    {...rest}
                    geometry={{primitive: 'plane', width, height}}
            />
        );
    }
}

export default Plane;

import {Entity} from 'aframe-react';
import React, {PropTypes} from 'react';

class Plane extends React.Component {
    static propTypes = {
        width: PropTypes.number,
        height: PropTypes.number,
        color: PropTypes.string,
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

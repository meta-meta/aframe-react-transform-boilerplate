import {Entity} from 'aframe-react';
import React from 'react';

class Box extends React.Component {
    render() {
        const {width, height, depth, color, opacity} = this.props;
        return (
            <Entity material={{color, opacity, transparent: true}}
                {...this.props}
                    geometry={{primitive: 'box', width, height, depth}}
            />
        );
    }
}

Box.defaultProps = {
    width: 1,
    height: 1,
    depth: 1,
    color: "#666",
    opacity: 1,
};

export default Box;

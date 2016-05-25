export default {
  time: {},
  leapMotion: {
    isVR: false,
    left: {
      confidence: 0,
      fingers: [],
      palm: V3(),
      pitchYawRoll: V3(),
      grabStrength: 0,
      pinchStrength: 0,
    },
    right: {
      confidence: 0,
      fingers: [],
      palm: V3(),
      pitchYawRoll: V3(),
      grabStrength: 0,
      pinchStrength: 0,
    },
  },
  spaceNav: {
    translate: {
      x: 0,
      y: 0,
      z: 0
    },
    rotate: {
      x: 0,
      y: 0,
      z: 0
    }    
  }
};
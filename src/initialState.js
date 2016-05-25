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
    translate: V3(),
    rotate: V3(),    
    translateMode: 'WORLD',
  },
  box: {
    object3DId: undefined,
    position: V3(),
    rotation: V3(),
  }
};
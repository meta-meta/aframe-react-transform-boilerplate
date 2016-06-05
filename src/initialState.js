export default {
  time: {},
  showControllers: false,
  selectedCursorPath: undefined,
  listComponents: false,
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
    speed: 0.2,
  },
  wintab: {
    x: 0,
    y: 0,
    pressure: null,
    azimuth: 0,
    altitude: 0,
    isEraser: false,
  },
  box: {
    object3DId: undefined,
    position: V3(),
    rotation: V3(),
  },
  panel: {}
};

//{"1":{"id":"1","type":"Plane","name":"back-wall","props":{"position":{"x":0,"y":0,"z":-6},"rotation":{"x":0,"y":0,"z":0},"color":"#ffffc4","width":6,"height":6},"object3DId":34},"2":{"id":"2","type":"Plane","name":"left-wall","props":{"position":{"x":-3,"y":0,"z":-3},"rotation":{"x":0,"y":90,"z":0},"color":"#ffffc4","width":6,"height":6},"object3DId":36},"3":{"id":"3","type":"Plane","name":"floor","props":{"position":{"x":0,"y":-3,"z":-3},"rotation":{"x":-90,"y":0,"z":0},"color":"#800000","width":6,"height":6},"object3DId":38},"4":{"id":"4","type":"Plane","name":"back-moulding","props":{"position":{"x":0,"y":-2.75,"z":-5.96},"rotation":{"x":0,"y":0,"z":0},"color":"#be9745","width":6,"height":0.5},"object3DId":40},"5":{"id":"5","type":"Plane","name":"left-moulding","props":{"position":{"x":-2.96,"y":-2.75,"z":-3},"rotation":{"x":0,"y":90,"z":0},"color":"#be9745","width":6,"height":0.5},"object3DId":40},"6":{"id":"6","type":"Image","name":"bedframe","props":{"position":{"x":-1,"y":-0.9,"z":-3},"rotation":{"x":0,"y":0,"z":0},"url":"images/bed.png","pixelsPerMeter":397},"object3DId":44},"7":{"id":"7","type":"Image","name":"nemo","props":{"position":{"x":-1.045714285714285,"y":-1.2622857142857144,"z":-2.841142857142859},"rotation":{"x":-3.308571428571431,"y":-0.7028571428571411,"z":2.8200000000000003},"url":"images/nemo.png","pixelsPerMeter":397},"object3DId":37}}
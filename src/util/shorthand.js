THREE.Vector3.prototype.toAframeString = function() {return `${this.x} ${this.y} ${this.z}`};
window.V3 = (x, y, z) => new THREE.Vector3(x, y, z);
window.arrToV3 = arr => V3.apply(this, arr);
window.V3toStr = (x, y, z) => V3(x, y, z).toAframeString();
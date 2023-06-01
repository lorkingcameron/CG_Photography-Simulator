import * as THREE from 'three'

export default class Skybox {
    constructor(dir) {
        this.materialArray = this._getMaterialArray(dir);
        this.skyboxGeo = new THREE.BoxGeometry(1000, 1000, 1000);
        this.skybox = new THREE.Mesh(this.skyboxGeo, this.materialArray);

        return this.skybox;

    }

    _createPathStrings(dir) {
        const path = "textures/skyboxes/" + dir + "/";
        const sides = ["right", "left", "top", "bottom", "front", "back"];
        const pathStrings = sides.map(side => {
            return path + side + ".png";
        });
        
        return pathStrings;
    }

    _getMaterialArray(dir) {
        const skyboxImagepaths = this._createPathStrings(dir);

        var materialArray = skyboxImagepaths.map(image => {
            let texture = new THREE.TextureLoader().load(image);
            return new THREE.MeshBasicMaterial({
                map: texture,
                fog: false,
                side: THREE.DoubleSide
            });
        });
        return materialArray;
    }
}
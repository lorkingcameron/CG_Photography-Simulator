import * as THREE from 'three'

export default class Lighting {
    constructor (scene, camera) {
        this._createAmbient(scene);
        this._createPoint(scene);
        this._createCameraLight(camera);
    }
    
    _createAmbient(scene) {
        this.ambientlight = new THREE.AmbientLight(new THREE.Color(1, 1, 1), 1);
        scene.add(this.ambientlight);
    }

    _createPoint(scene) {
        this.light = new THREE.PointLight( new THREE.Color("#FFCB8E"), 1, 600);
        this.light.position.set(10, 30, 10);
        this.light.castShadow = true;
        this.light.shadow.mapSize.width = 512;
        this.light.shadow.mapSize.height = 512;
        this.light.shadow.camera.near = 0.5;
        this.light.shadow.camera.far = 500;
        scene.add(this.light);
    }

    _createCameraLight(camera) {
        this.cameralight = new THREE.PointLight(new THREE.Color(1, 1, 1), 20,10);
        this.cameralight.castShadow = true;
        camera.add(this.cameralight);
    }
}
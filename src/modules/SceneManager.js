import * as THREE from 'three'
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js'
import {TextureLoader} from 'TextureLoader'
import Graphics from '../utils/Graphics.js'

export default class SceneManager {
    constructor() {
        this.graphics = new Graphics();

        this._addShapes();
    }

    onWindowResize() {
        this.graphics.camera.aspect = window.innerWidth / window.innerHeight;
        this.graphics.camera.updateProjectionMatrix();
        this.graphics.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    _createObj(){
        const gltfLoader = new GLTFLoader();
        const textureLoader = new TextureLoader();

        gltfLoader.load("../../models/canon_at-1-2.glb", (file)=>{
        // gltfLoader.load("../../models/scene.gltf", (file)=>{
            this.graphics.scene.add(file.scene);
            file.scene.scale.set(100,100,100);
            file.scene.children.forEach(child=> {
                //child.castShadow = true;
                child.receiveShadow = true;
                if(child.name === ""){

                }
            });
        })
    }

    _addCube(w, h, d, r, g, b) {
        var material = new THREE.MeshBasicMaterial();
        material.color = new THREE.Color(r, g, b);
        material.wireframe = true;
        var geometry_cube = new THREE.BoxGeometry(w, h, d);
        var cube = new THREE.Mesh(geometry_cube, material);
        this.graphics.scene.add(cube);
    }


    _addLight() {
        this.cameralight = new THREE.PointLight(new THREE.Color(1, 1, 1), 20);
        this.cameralight.castShadow = true;
        this.ambientlight = new THREE.AmbientLight(new THREE.Color(1, 1, 1), 10);
        this.graphics.camera.add(this.cameralight);
    }    

    //Add all shapes to the scene
    _addShapes() {
        this._createObj();
        this._addCube(2, 2, 2, 0, 1, 0);
        this._addLight();
        this.graphics.scene.add(this.ambientlight);
    }

    _tick() {
        for(const object of animatedObjects) {
            object.tick();
        }
    }

    render() {
        this._tick();
        this.graphics.render();
    }
}

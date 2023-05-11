import * as THREE from 'three'
import {OrbitControls} from 'OrbitControls'
import {MTLLoader} from 'three/addons/loaders/MTLLoader.js'
import {OBJLoader} from 'three/addons/loaders/OBJLoader.js'
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js'

export default class SceneManager {
    constructor() {
        this._buildScene();
        this._buildCamera();
        this._buildRenderer();
        this._addShapes();
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    _buildScene() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color( 0x114444 );
    }

    _buildCamera() {
        var ratio = window.innerWidth/window.innerHeight;
        this.camera = new THREE.PerspectiveCamera(70, ratio, 1, 1000);
        this.camera.position.set(40,15,15);
        this.camera.lookAt(0,0,5);
    
        this.scene.add(this.camera);
    }

    _buildRenderer() {
        this.renderer = new THREE.WebGLRenderer({ antialias: true, logarithmicDepthBuffer: true });
        this.renderer.setSize(window.innerWidth,window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    
        const target = document.getElementById('target');
        target.appendChild(this.renderer.domElement);
        this.controls = new OrbitControls(this.camera,this.renderer.domElement);
        this.controls.target.set(0, 0, 0);
        this.controls.update();
    }

    _createObj(){
        const gltfLoader = new GLTFLoader();

        gltfLoader.load("../../models/canon_at-1.glb", (file)=>{
            this.scene.add(file.scene);
            file.scene.scale.set(100,100,100)
            file.scene.children.forEach(child=> {
                child.castShadow = true;
                child.receiveShadow = true;
            });
        })


    }

    _addCube(w, h, d, r, g, b) {
        var material = new THREE.MeshBasicMaterial();
        material.color = new THREE.Color(r, g, b);
        material.wireframe = true;
        var geometry_cube = new THREE.BoxGeometry(w, h, d);
        var cube = new THREE.Mesh(geometry_cube, material);
        this.scene.add(cube);
    }


    _addLight() {
        this.cameralight = new THREE.PointLight(new THREE.Color(1, 1, 1), 10);
        this.cameralight.castShadow = true;
        this.ambientlight = new THREE.AmbientLight(new THREE.Color(1, 1, 1), 0.5);
        this.camera.add(this.cameralight);
    }

    //Add all shapes to the scene
    _addShapes() {
        this._createObj();
        this._addCube(2, 2, 2, 0, 1, 0);
        this._addLight();
        this.scene.add(this.camera);
        this.scene.add(this.ambientlight);
    }

    _tick() {
        for(const object of animatedObjects) {
            object.tick();
        }
    }
    
    render() {
        this._tick();
        
        requestAnimationFrame(this.render.bind(this));
        this.renderer.render(this.scene, this.camera);
        this.controls.update();
    }
}

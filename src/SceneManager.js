import * as THREE from 'three'
import {OrbitControls} from 'OrbitControls'

export default class SceneManager {
    constructor(canvas) {
        this.canvas = canvas;
        this._buildScene();
        this._buildCamera();
        this._buildRenderer();
    }

    update() {
        for(const object of animatedObjects) {
            object.update();
        }
        this.renderer.render(this.scene, this.camera);
    }

    onWindowResize() {
        const { width, height } = canvas;
        screenDimensions.width = width;
        screenDimensions.height = height;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
    }

    _buildScene() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color( 0xfffffff );
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
    
        document.body.appendChild(this.renderer.domElement);
        this.controls = new OrbitControls(this.camera,this.renderer.domElement);
    }
}

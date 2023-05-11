import * as THREE from 'three'
import {OrbitControls} from 'OrbitControls'
import {MTLLoader} from 'three/addons/loaders/MTLLoader.js'
import {OBJLoader} from 'three/addons/loaders/OBJLoader.js'

export default class SceneManager {
    constructor(canvas) {
        this.canvas = canvas;
        this._buildScene();
        this._buildCamera();
        this._buildRenderer();
        this._addShapes();
        
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
    
        document.body.appendChild(this.renderer.domElement);
        this.controls = new OrbitControls(this.camera,this.renderer.domElement);
        this.controls.target.set(0, 0, 0);
        this.controls.update();
    }

    


    _loadTexture(loader,object){
        loader.load(object, (obj) => {
            this.objGeo = obj.children[0].geometry;
            this.ojbMat = obj.children[0].material;
            this.objMesh = new THREE.Mesh(this.objGeo, this.ojbMat);
            this.objMesh.castShadow = true;
            this.objMesh.receiveShadow = true;
            this.objMesh.position.x = 0;
            this.objMesh.position.y = 0;
            this.objMesh.position.z = 0;
            this.scene.add(this.objMesh);
        });
    }

    _createObj(){
        this.mtlLoader = new MTLLoader();
        // this.mtlLoader.setResourcePath("models/");
        // this.mtlLoader.setPath("models/");
        
        this.mtlLoader.load('../../models/Librarian.obj.mtl', (mtl) => {
            materials.preload();
            console.log(materials);
            this.objLoader = new OBJLoader();
            this.objLoader.setPath("models/");
            this.objLoader.setMaterials(materials);
            this._loadTexture(this.objLoader,"../../models/Librarian.obj");
        });
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
        this.cameralight = new THREE.PointLight(new THREE.Color(1, 1, 1), 0.5);
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
}

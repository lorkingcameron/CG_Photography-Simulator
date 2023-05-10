import * as THREE from 'three'
import {OrbitControls} from 'OrbitControls'
import {MTLLoader} from 'MTLLoader'
import {OBJLoader} from 'OBJLoader'

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

    


    _loadTexture(loader,object){
        loader.load(object, (mesh) => {
            this.center;
            this.size;
            console.log(mesh.child);
            mesh.traverse((child) => {
                if(child instanceof THREE.Mesh){
                    this.mygeometry = new THREE.BufferGeometry(child.geometry);
                    this.mygeometry.computeBoundingBox();
                    child.material.color = new THREE.Color(1,1,1);
                    this.center = this.mygeometry.boundingBox.getCenter();
                    this.size = this.mygeometry.boundingBox.getSize();
                }
            });
            this.scene.add(mesh);
            this.sca = new Matrix4();
            this.tra = new Matrix4();
            this.combined = new THREE.Matrix4();
            this.sca.makeScale(10/this.size.length(), 10/this.size.length(),10/this.size.length());
            this.tra.makeTranslation(-this.center.x, -this.center.y, -this.center.z);
            this.combined.multiply(this.sca);
            this.combined.multiply(this.tra);
            mesh.applyMatrix(this.combined);
        });
    }

    _createObj(){
        this.mtlLoader = new MTLLoader();
        this.mtlLoader.setResourcePath("models/");
        this.mtlLoader.setPath("models/");
        
        this.mtlLoader.load("Canon_AT-1.mtl", (materials) => {
            materials.preload();
            console.log(materials);
            this.objLoader = new OBJLoader();
            this.objLoader.setPath("models/");
            this.objLoader.setMaterials(materials);
            this._loadTexture(this.objLoader,"Canon_AT-1.obj");
        });
    }

    



    _addLight() {
        this.cameralight = new THREE.PointLight(new THREE.Color(1, 1, 1), 0.5);
        this.cameralight.castShadow = true;
        this.ambientlight = new THREE.AmbientLight(new THREE.Color(1, 1, 1), 0.2);
        this.camera.add(this.cameralight);
    }

//Add all shapes to the scene
    _addShapes() {
        this._createObj();
        this._addLight();
        this.scene.add(this.camera);
        this.scene.add(this.ambientlight);
    }
}

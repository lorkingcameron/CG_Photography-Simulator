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

    

    _createObj(){
        this.mtlLoader = new MTLLoader();
        this.mtlLoader.setResourcePath("models/");
        this.mtlLoader.setPath("models/");
        
        this.mtlLoader.load("Canon_AT-1.mtl", (materials) => {
            materials.preload();
            this.objLoader = new OBJLoader();
            this.objLoader.setPath("models/");
            this.objLoader.setMaterials(materials);
            this._loadTexture(this.objLoader,"Canon_AT-1.obj");
        });
    }

    _loadTexture(loader,object){
        loader.load(object,function(mesh){
            var center;
            var size;
            mesh.traverse(function(child){
                if(child instanceof THREE.Mesh){
                    console.log(child.geometry);
                    var mygeometry = new THREE.BufferGeometry(child.geometry);
                    mygeometry.computeBoundingBox();
                    child.material.color = new THREE.Color(1,1,1);
                    center = mygeometry.boundingBox.getCenter();
                    size = mygeometry.boundingBox.getSize();
                }
            });
            scene.add(mesh);
            var sca = new Matrix4();
            var tra = new Matrix4();
            var combined = new THREE.Matrix4();
            sca.makeScale(10/size.length(), 10/size.length(),10/size.length());
            tra.makeTranslation(-center.x, -center.y, -center.z);
            combined.multiply(sca);
            combined.multiply(tra);
            mesh.applyMatrix(combined);
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

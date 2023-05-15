import * as THREE from 'three'
import {OrbitControls} from 'OrbitControls'
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js'
import {TextureLoader} from 'TextureLoader'
// import { createNoise2D } from 'simplex-noise'

export default class SceneManager {
    constructor() {
        this._buildScene();
        this._buildCamera();
        this._buildRenderer();
        this._addShapes();
        this._addLight();
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    _buildScene() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color( 0x000000 );
    }

    _buildCamera() {
        var ratio = window.innerWidth/window.innerHeight;
        this.camera = new THREE.PerspectiveCamera(70, ratio, 1, 1000);
        this.camera.filmGauge = 100.0;
        this.camera.position.set(0, 60, 140);
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
        const textureLoader = new TextureLoader();

        gltfLoader.load("../../models/canon_at-1-2.glb", (file)=>{
        // gltfLoader.load("../../models/scene.gltf", (file)=>{
            this.scene.add(file.scene);
            file.scene.scale.set(100,100,100);
            console.log(file.scene)
            file.scene.children.forEach(child=> {
                child.castShadow = true;
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
        this.scene.add(cube);
    }

    _addBetterCube(size, colour, x, y, z) {
        var material = new THREE.MeshBasicMaterial();
        material.color = new THREE.Color(colour);
        material.wireframe = true;
        var geometry_cube = new THREE.BoxGeometry(size, size, size);
        var cube = new THREE.Mesh(geometry_cube, material);
        this.scene.add(cube);
        cube.position.set(x,y,z);
    }

    _addPlane(size, detail, colour, x, y, z) {
        var plane_geometry = new THREE.PlaneGeometry(size, size, detail, detail);
        var plane_material = new THREE.MeshBasicMaterial({ wireframe: true, color: colour });
        var plane_mesh = new THREE.Mesh(plane_geometry, plane_material);
        
        this.scene.add(plane_mesh);
        plane_mesh.position.set(x,y,z);
        plane_mesh.rotateX(Math.PI/2);
    }

    _addMappedPlane(size, detail, amp, colour, x, y, z) {
        const textureLoader = new THREE.TextureLoader();
        const displacementMapTexture = textureLoader.load('src/assets/noise2.png');

        var plane_geometry = new THREE.PlaneGeometry(size, size, detail, detail);
        var plane_material = new THREE.MeshStandardMaterial({
            wireframe: true,
            color: colour,
            displacementMap: displacementMapTexture,
            displacementScale: amp, // Adjust the scale as needed
          });
        var plane_mesh = new THREE.Mesh(plane_geometry, plane_material);
        
        this.scene.add(plane_mesh);
        plane_mesh.position.set(x,y,z);
        plane_mesh.rotateX(-Math.PI/2);
    }

    


    _addLight() {
        // this.cameralight = new THREE.PointLight(new THREE.Color(1, 1, 1), 10);
        // this.cameralight.castShadow = true;
        // this.camera.add(this.cameralight);

        this.ambientlight = new THREE.AmbientLight(new THREE.Color(1, 1, 1), 0.05);
        this.scene.add(this.ambientlight);

        const light = new THREE.PointLight( new THREE.Color("#FFCB8E"), 1, 600);
        light.position.set(10, 30, 10);
        light.castShadow = true;
        light.shadow.mapSize.width = 512;
        light.shadow.mapSize.height = 512;
        light.shadow.camera.near = 0.5;
        light.shadow.camera.far = 500;
        this.scene.add(light);
    }

    //Add all shapes to the scene
    _addShapes() {
        let red = new THREE.Color(0xff3333);
        let green = new THREE.Color(0x33ff33);
        let blue = new THREE.Color(0x0000ff);
        let white = new THREE.Color(0xffffff);

        this._createObj();
        this._addBetterCube(10, blue, 0, 0, 0);
        this._addBetterCube(4, blue, 0, 0, 0);
        this._addBetterCube(10, green, 35, 0, 0);
        this._addBetterCube(10, green, -35, 0, 0);
        this._addBetterCube(10, red, 0, 35, 0);
        this._addBetterCube(10, red, 0, -35, 0);

        // this._addPlane(60, 10, white, 0, 0, 0);
        this._addMappedPlane(500, 200, 55, white, 0, -50, 0);
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

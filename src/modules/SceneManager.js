import * as THREE from 'three'
import {OrbitControls} from 'OrbitControls'
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js'
import {TextureLoader} from 'TextureLoader'
import Physics from '../utils/Physics.js'
import PhysObjCreator from './PhysObjCreator.js'
import Lighting from '../utils/Lighting.js'
// import { createNoise2D } from 'simplex-noise'

export default class SceneManager {
    constructor() {
        this._buildScene();
        this._buildCamera();
        this._buildRenderer();

        this.physics = new Physics(this.scene);
        animatedObjects.push(this.physics);

        this.lights = new Lighting(this.scene);

        this._addObjects();
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    _buildScene() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color( 0x000000 );
        const axesIndicator = new THREE.AxesHelper(15);
        this.scene.add(axesIndicator);
    }

    _buildCamera() {
        var ratio = window.innerWidth/window.innerHeight;
        this.camera = new THREE.PerspectiveCamera(70, ratio, 1, 1000);
        this.camera.filmGauge = 100.0;
        this.camera.position.set(0, 5, 15);
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

    _addCube(size, colour, x, y, z) {
        var material = new THREE.MeshBasicMaterial();
        material.color = new THREE.Color(colour);
        material.wireframe = true;
        var geometry_cube = new THREE.BoxGeometry(size, size, size);
        var cube = new THREE.Mesh(geometry_cube, material);
        this.scene.add(cube);
        cube.position.set(x,y,z);
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

    //Add all shapes to the scene
    _addObjects() {
        let red = new THREE.Color(0xff3333);
        let green = new THREE.Color(0x33ff33);
        let blue = new THREE.Color(0x0000ff);
        let white = new THREE.Color(0xffffff);

        // this._createObj();
        // this._addCube(10, blue, 0, 0, 0);
        // this._addCube(4, blue, 0, 0, 0);
        this._addCube(10, green, 35, 0, 0);
        this._addCube(10, green, -35, 0, 0);
        this._addCube(10, red, 0, 35, 0);
        this._addCube(10, red, 0, -35, 0);

        this._addMappedPlane(300, 100, 30, white, 0, -50, 0);

        const physObjCreator = new PhysObjCreator(this.scene, this.physics.world, this.physics.physicsBodies);
        physObjCreator._createCube();
        physObjCreator._createSphere();
    }

    _tick() {
        for(const object of animatedObjects) {
            object.tick();
        }
    }

    
    
    render() {
        this._tick();
        
        this.physics.updatePhysicsBodies();

        requestAnimationFrame(this.render.bind(this));
        this.renderer.render(this.scene, this.camera);
        this.controls.update();
    }
}

import * as THREE from 'three'
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js'
import {TextureLoader} from 'TextureLoader'
import Graphics from '../utils/Graphics.js'
import Physics from '../utils/Physics.js'
import PhysObjCreator from './PhysObjCreator.js'
import Lighting from '../utils/Lighting.js'
// import { createNoise2D } from 'simplex-noise'

export default class SceneManager {
    constructor() {
        this.graphics = new Graphics();

        this.physics = new Physics(this.graphics.scene);

        this.lights = new Lighting(this.graphics.scene, this.graphics.camera);

        this._addObjects();

        this._controls();

        this.cameraModel;

        this.cameraGroup = new THREE.Group();

        this.cameraLock;
    }

    _createObj(){
        const gltfLoader = new GLTFLoader();
        const textureLoader = new TextureLoader();

        gltfLoader.load("../../models/canon_at-1-2.glb", (file)=>{
        // gltfLoader.load("../../models/scene.gltf", (file)=>{
            this.cameraModel = file.scene;
            this.cameraGroup.add(this.cameraModel);
            this.graphics.scene.add(this.cameraGroup);
            //this.graphics.camera.position.set(0,0,0);
            this.cameraGroup.add(this.graphics.camera);
            console.log(this.cameraModel.position);
            file.scene.scale.set(10,10,10);
            file.scene.children.forEach(child=> {
                //child.castShadow = true;
                child.receiveShadow = true;
                if(child.name === ""){

                }
            });
        })
    }

    _addCube(size, colour, x, y, z) {
        var material = new THREE.MeshBasicMaterial();
        material.color = new THREE.Color(colour);
        material.wireframe = false;
        var geometry_cube = new THREE.BoxGeometry(size, size, size);
        var cube = new THREE.Mesh(geometry_cube, material);
        cube.position.set(x,y,z);
        this.graphics.scene.add(cube);
    }

    _addMappedPlane(size, detail, amp, colour, x, y, z) {
        const textureLoader = new THREE.TextureLoader();
        const displacementMapTexture = textureLoader.load('src/assets/noise2.png');

        var plane_geometry = new THREE.PlaneGeometry(size, size, detail, detail);
        var plane_material = new THREE.MeshStandardMaterial({
            wireframe: false,
            color: colour,
            displacementMap: displacementMapTexture,
            displacementScale: amp, // Adjust the scale as needed
          });
        var plane_mesh = new THREE.Mesh(plane_geometry, plane_material);
        
        this.graphics.scene.add(plane_mesh);
        plane_mesh.position.set(x,y,z);
        plane_mesh.rotateX(-Math.PI/2);
    }

    //Add all shapes to the scene
    _addObjects() {
        let red = new THREE.Color(0xff3333);
        let green = new THREE.Color(0x33ff33);
        let blue = new THREE.Color(0x0000ff);
        let white = new THREE.Color(0xffffff);

        this._createObj();
        
        
        // this._addCube(10, blue, 0, 0, 0);
        // this._addCube(4, blue, 0, 0, 0);
        this._addCube(10, green, 35, 0, 0);
        this._addCube(10, green, -35, 0, 0);
        this._addCube(10, red, 0, 35, 0);
        this._addCube(10, red, 0, -35, 0);

        this._addMappedPlane(300, 100, 30, white, 0, -50, 0);

        const physObjCreator = new PhysObjCreator(this.graphics.scene, this.physics.world, this.physics.physicsBodies);
        // physObjCreator._createCube();
        // physObjCreator._createSphere();
    }

    _controls() {
        window.addEventListener("keydown", (e) =>{
            var name = e.key;
            if (name === "p"){
                console.log("P");
                this.graphics.postprocessing.bokeh.uniforms[ 'focus' ].value+=10;
                console.log(this.graphics.postprocessing.bokeh.uniforms[ 'focus' ]);
                this.cameraModel.children.forEach(child=>{
                    child.children.forEach(child=>{
                        console.log(child.name);
                        if(child.name === "#CAM0001_Shutter_Speed"){
                            child.rotation.y += Math.PI /8;
                        }
                    })
                })
            }
            if (name === "l"){
                console.log("L");
                this.graphics.postprocessing.bokeh.uniforms[ 'focus' ].value-=10;
                console.log(this.graphics.postprocessing.bokeh.uniforms[ 'focus' ]);
                this.cameraModel.children.forEach(child=>{
                    child.children.forEach(child=>{
                        console.log(child.name);
                        if(child.name === "#CAM0001_Shutter_Speed"){
                            child.rotation.y -= Math.PI /8;
                        }
                    })
                })
            }
            if (name === "o"){
                console.log("O");
                this.graphics.postprocessing.bokeh.uniforms[ 'aperture' ].value+=0.1;
                console.log(this.graphics.postprocessing.bokeh.uniforms[ 'aperture' ]);
            }
            if (name === "k"){
                console.log("K");
                this.graphics.postprocessing.bokeh.uniforms[ 'aperture' ].value-=0.1;
                console.log(this.graphics.postprocessing.bokeh.uniforms[ 'aperture' ]);
            }
            if (name === "i"){
                console.log("I");
                this.graphics.postprocessing.bokeh.uniforms[ 'maxblur' ].value+=0.0001;
                console.log(this.graphics.postprocessing.bokeh.uniforms[ 'maxblur' ]);
            }
            if (name === "j"){
                console.log("J");
                this.graphics.postprocessing.bokeh.uniforms[ 'maxblur' ].value-=0.0001;
                console.log(this.graphics.postprocessing.bokeh.uniforms[ 'maxblur' ]);
            }
            if  (name === "w"){
                console.log("W");
                this.cameraGroup.position.x+=1;
            }
            if  (name === "s"){
                console.log("S");
                this.cameraGroup.position.x-=1;
            }
            if  (name === "a"){
                console.log("A");
                this.cameraGroup.position.z+=1;
            }
            if  (name === "d"){
                console.log("D");
                this.cameraGroup.position.z-=1;
            }
            if (name === "e"){
                console.log("E");
                if (this.graphics.cameraLock === true){
                    this.graphics.cameraLock = false;
                } else {
                    this.graphics.cameraLock = true;
                }
                
            }
        });
    }

    _tick() {
        for(const object of animatedObjects) {
            object.tick();
        }
    }

    render() {
        this._tick();
        this.physics.updatePhysics();
        this.graphics.render();
        requestAnimationFrame(this.render.bind(this));
    }
}

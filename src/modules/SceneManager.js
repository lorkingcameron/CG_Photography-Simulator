import * as THREE from 'three'
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js'
import {TextureLoader} from 'TextureLoader'
import Graphics from '../utils/Graphics.js'
import Physics from '../utils/Physics.js'
import { CharacterControls } from '../utils/CharacterControls.js'
import PhysObjCreator from './PhysObjCreator.js'
import Lighting from '../utils/Lighting.js'
import Terrain from './Terrain.js'
import Stats from 'stats'


export default class SceneManager {
    constructor() {
        this.clock = new THREE.Clock();
        this.keysPressed = {};

        this.graphics = new Graphics();

        this.physics = new Physics(this.graphics.scene);
        this.physObjCreator = new PhysObjCreator(this.graphics.scene, this.physics.world, this.physics.physicsBodies);

        this.lights = new Lighting(this.graphics.scene, this.graphics.camera);

        this.terrainParams = {width: 300, amp: 15, freq: 15, res: 50};
        this.terrain = new Terrain(this.graphics.scene, this.physics, this.terrainParams);

        this._addObjects();

        this._controls();

        this.cameraModel;
        this.cameraGroup = new THREE.Group();


        this.cameraLock;

        this.filterMesh;

        this.filterMaterial;

        this.stats = new Stats()
        this.stats.showPanel(0) // 0: fps, 1: ms, 2: mb, 3+: custom
        document.body.appendChild(this.stats.dom)
        

        this._createCharacter();

        this.mousedown = 0;

    }

    _createObj(){
        const gltfLoader = new GLTFLoader();
        const textureLoader = new TextureLoader();

        gltfLoader.load("../../models/canon_AT-1-2.glb", (file)=>{
            this.cameraModel = file.scene;
            this.cameraModel.position.set(0,40,0);
            this.cameraGroup.add(this.cameraModel);
            this.graphics.scene.add(this.cameraGroup);
            this.cameraGroup.add(this.graphics.camera);
            this.cameraGroup.add(this.graphics.viewfinderCamera);
            this._createFilter();
            file.scene.scale.set(10,10,10);
            file.scene.children.forEach(child=> {
                child.receiveShadow = true;
                if(child.name === ""){

                }
            });
        })
        
    }

    _createFilter(){
        this.filterGeometry = new THREE.SphereGeometry(0.2, 32, 16); 
        this.filterMaterial = new THREE.MeshBasicMaterial(
            {
                color: new THREE.Color("#FFCB8E"),
                transparent: true,
                opacity: 0.7,
                side: THREE.DoubleSide
            }
        ); 
        this.filterMesh = new THREE.Mesh(this.filterGeometry, this.filterMaterial);
        this.filterMesh.visible = false;
        console.log(this.filterMesh.position);
        this.filterMesh.position.set(0, 25, 0);
        console.log(this.filterMesh.position);
        this.graphics.scene.add(this.filterMesh);
        
    }

    //Add all shapes to the scene
    _addObjects() {
        this._createObj();
        this.physObjCreator._createCube();
        this.physObjCreator._createSphere();
    }


    _createCharacter() {
        new GLTFLoader().load("../../models/Soldier.glb", (gltf) => {
            var model = gltf.scene;
            model.traverse(function(object) {
                if (object.isMesh) object.castShadow = true;
            });
            this.graphics.scene.add(model);

            const gltfAnimations = gltf.animations;
            const mixer = new THREE.AnimationMixer(model);
            const animationsMap = new Map();
            gltfAnimations.filter(a => a.name != 'TPose').forEach((a) => {
                animationsMap.set(a.name, mixer.clipAction(a));
            });

            this.characterControls = new CharacterControls(this.graphics.scene, this.physics,
                model, mixer, animationsMap, this.graphics.controls, this.graphics.camera, this.graphics.viewfinderCamera, 'Idle', this.terrain);
        });
    }

    _controls() {
        window.addEventListener("keydown", (e) =>{
            var name = e.key;
            if (name === "c"){
                this.cameraHRotation = this.graphics.controls.getAzimuthalAngle();
                this.cameraVRotation = this.graphics.controls.getPolarAngle();
                this.graphics.viewfinderCamera.rotation.y=this.cameraHRotation - Math.PI;
                this.graphics.viewfinderCamera.rotation.x=this.cameraVRotation + Math.PI/2;
                this.graphics._changeCamera();
                if (this.characterControls.model.visible === true){
                    this.characterControls.model.visible = false;
                } else{
                    this.characterControls.model.visible = true;
                }
                
                
                if (this.filterMesh.visible === true ){
                    this.filterMesh.visible = false;
                } else {
                    this.filterMesh.visible = true;
                }
                
            }
            if (name === "p"){
                console.log("Focus Up");
                this.graphics.postprocessing.bokeh.uniforms[ 'focus' ].value+=10;
                console.log(this.graphics.postprocessing.bokeh.uniforms[ 'focus' ]);
                this.cameraModel.children.forEach(child=>{
                    child.children.forEach(child=>{
                        if(child.name === "#CAM0001_Shutter_Speed"){
                            child.rotation.y += Math.PI /8;
                        }
                    })
                })
            }
            if (name === "l"){
                console.log("Focus Down");
                this.graphics.postprocessing.bokeh.uniforms[ 'focus' ].value-=10;
                console.log(this.graphics.postprocessing.bokeh.uniforms[ 'focus' ]);
                this.cameraModel.children.forEach(child=>{
                    child.children.forEach(child=>{
                        if(child.name === "#CAM0001_Shutter_Speed"){
                            child.rotation.y -= Math.PI /8;
                        }
                    })
                })
            }
            if (name === "o"){
                console.log("Aperture Up");
                this.graphics.postprocessing.bokeh.uniforms[ 'aperture' ].value+=0.1;
                console.log(this.graphics.postprocessing.bokeh.uniforms[ 'aperture' ]);
            }
            if (name === "k"){
                console.log("Aperture Down");
                this.graphics.postprocessing.bokeh.uniforms[ 'aperture' ].value-=0.1;
                console.log(this.graphics.postprocessing.bokeh.uniforms[ 'aperture' ]);
            }
            if (name === "i"){
                console.log("MaxBlur up");
                this.graphics.postprocessing.bokeh.uniforms[ 'maxblur' ].value+=0.0001;
                console.log(this.graphics.postprocessing.bokeh.uniforms[ 'maxblur' ]);
            }
            if (name === "j"){
                console.log("MaxBlur down");
                this.graphics.postprocessing.bokeh.uniforms[ 'maxblur' ].value-=0.0001;
                console.log(this.graphics.postprocessing.bokeh.uniforms[ 'maxblur' ]);
            }
            // if  (name === "w"){
            //     console.log("W");
            //     this.cameraGroup.position.x+=1;
            // }
            // if  (name === "s"){
            //     console.log("S");
            //     this.cameraGroup.position.x-=1;
            // }
            // if  (name === "a"){
            //     console.log("A");
            //     this.cameraGroup.position.z+=1;
            // }
            // if  (name === "d"){
            //     console.log("D");
            //     this.cameraGroup.position.z-=1;
            // }
            if (name === "e"){
                if (this.graphics.cameraLock === true){
                    this.graphics.cameraLock = false;
                } else {
                    this.graphics.cameraLock = true;
                }
                console.log(this.graphics.cameraLock);
                
            }
            if (name === "="){
                console.log("zoom in");
                this.graphics._zoomCamera();
            }
            if(name === "-"){
                this.graphics._zoomOutCamera();
            }
            if(name === "q"){
                console.log(this.characterControls.model.position);
            }
            if(name === "x"){
                console.log(this.filterMesh.position);
            }
        });
    }

    _updateFilter(){
        if(this.filterMesh != null){
           this.filterMesh.position.copy(this.characterControls.model.position);
           this.filterMesh.position.y += 2;
        }
        if(this.filterMaterial != null){
            this.filterMaterial.color = this.graphics.filterColor;
            this.filterMaterial.opacity = this.graphics.filterIntensity;
        }

    }

    _tick() {
        this.stats.begin();
        for(const object of animatedObjects) {
            object.tick();
        }
        this.stats.end();
    }

    render() {
        this._tick();
        this._updateFilter();
        this.physics.updatePhysics();
        this.graphics.render();


        requestAnimationFrame(this.render.bind(this));

        document.addEventListener('keydown', (event) => {
            this.keysPressed[event.key.toLowerCase()] = true;
        }, false);
        document.addEventListener('keyup', (event) => {
            this.keysPressed[event.key.toLowerCase()] = false;
        }, false);

        document.addEventListener("mousedown", (event) => {
            this.mousedown = 1;
        });
        document.addEventListener("mouseup", (event) => {
            this.mousedown = 0;
        });

        // Update Character
        let mixerUpdateData = this.clock.getDelta();
        if (this.characterControls) {
            this.characterControls.update(mixerUpdateData, this.keysPressed, this.mousedown);
        }

    }
}

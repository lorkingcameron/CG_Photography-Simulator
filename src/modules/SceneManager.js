import * as THREE from 'three'
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js'
import {TextureLoader} from 'TextureLoader'
import Graphics from '../utils/Graphics.js'
import Physics from '../utils/Physics.js'
import PhysObjCreator from './PhysObjCreator.js'
import Lighting from '../utils/Lighting.js'
import Terrain from './Terrain.js'
import Stats from 'stats'

export default class SceneManager {
    constructor() {
        this.graphics = new Graphics();

        this.physics = new Physics(this.graphics.scene);

        this.lights = new Lighting(this.graphics.scene, this.graphics.activeCamera);

        this.terrainParams = {width: 300, amp: 15, freq: 15, res: 50};
        this.terrain = new Terrain(this.graphics.scene, this.physics, this.terrainParams);

        this._addObjects();

        this._controls();

        this.cameraModel;

        this.cameraGroup = new THREE.Group();

        this.cameraLock;

        this.stats = new Stats()
        this.stats.showPanel(0) // 0: fps, 1: ms, 2: mb, 3+: custom
        document.body.appendChild(this.stats.dom)
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
            file.scene.scale.set(10,10,10);
            file.scene.children.forEach(child=> {
                child.receiveShadow = true;
                if(child.name === ""){

                }
            });
        })
    }

    //Add all shapes to the scene
    _addObjects() {
        this._createObj();

        const physObjCreator = new PhysObjCreator(this.graphics.scene, this.physics.world, this.physics.physicsBodies);
        // physObjCreator._createCube();
        // physObjCreator._createSphere();
    }

    _controls() {
        window.addEventListener("keydown", (e) =>{
            var name = e.key;
            if (name === "c"){
                this.graphics._changeCamera();
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
        this.stats.begin();
        for(const object of animatedObjects) {
            object.tick();
        }
        this.stats.end();
    }

    render() {
        this._tick();
        this.physics.updatePhysics();
        this.graphics.render();
        requestAnimationFrame(this.render.bind(this));
    }
}

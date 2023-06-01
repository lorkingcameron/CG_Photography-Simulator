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

        this.lights = new Lighting(this.graphics.scene, this.graphics.activeCamera);

        this.terrainParams = {width: 300, amp: 15, freq: 15, res: 50};
        this.terrain = new Terrain(this.graphics.scene, this.physics, this.terrainParams);

        this._addObjects();

        // this._controls();

        this.cameraModel;

        this.cameraGroup = new THREE.Group();

        this.cameraLock;

        this.stats = new Stats()
        this.stats.showPanel(0) // 0: fps, 1: ms, 2: mb, 3+: custom
        document.body.appendChild(this.stats.dom)
        this.physObjCreator = new PhysObjCreator(this.graphics.scene, this.physics.world, this.physics.physicsBodies);

        this._addObjects();
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
        // this.physObjCreator._createCube();
        // this.physObjCreator._createSphere();
    }

    _createCharacter() {
        new GLTFLoader().load("../../models/Soldier.glb", (gltf) => {
            var model = gltf.scene;
            console.log(model);
            model.traverse(function(object) {
                if (object.isMesh) object.castShadow = true;
            });
            this.graphics.scene.add(model);

            const gltfAnimations = gltf.animations;
            const mixer = new THREE.AnimationMixer(model);
            const animationsMap = new Map();
            gltfAnimations.filter(a => a.name != 'TPose').forEach((a) => {
                animationsMap.set(a.name, mixer.clipAction(a));
                console.log(a.name, mixer.clipAction(a));
            });

            this.characterControls = new CharacterControls(this.graphics.scene, this.physics.world, this.physics.physicsBodies,
                model, mixer, animationsMap, this.graphics.controls, this.graphics.camera, 'Idle');
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

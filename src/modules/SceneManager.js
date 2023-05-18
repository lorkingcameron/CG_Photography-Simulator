import * as THREE from 'three'
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js'
import {TextureLoader} from 'TextureLoader'
import Graphics from '../utils/Graphics.js'
import Physics from '../utils/Physics.js'
import { CharacterControls } from '../utils/CharacterControls.js'
import PhysObjCreator from './PhysObjCreator.js'
import Lighting from '../utils/Lighting.js'
import Terrain from './Terrain.js'
// import { createNoise2D } from 'simplex-noise'


export default class SceneManager {
    constructor() {
        this.clock = new THREE.Clock();
        this.keysPressed = {};

        this.graphics = new Graphics();

        this.physics = new Physics(this.graphics.scene);

        this.physObjCreator = new PhysObjCreator(this.graphics.scene, this.physics.world, this.physics.physicsBodies);

        this.lights = new Lighting(this.graphics.scene, this.graphics.camera);

        this.terrainParams = {width: 100, length: 100, amp: 10, freq: 2, res: 1}
        this.terrain = new Terrain(this.graphics.scene, this.physics, this.terrainParams);

        this._addObjects();
        this._createCharacter();
    }

    _createObj(){
        const gltfLoader = new GLTFLoader();
        const textureLoader = new TextureLoader();

        gltfLoader.load("../../models/canon_at-1-2.glb", (file)=>{
        // gltfLoader.load("../../models/scene.gltf", (file)=>{
            this.graphics.scene.add(file.scene);
            file.scene.scale.set(100,100,100);
            file.scene.children.forEach(child=> {
                //child.castShadow = true;
                child.receiveShadow = true;
                if(child.name === ""){

                }
            });
        })
    }

    //Add all shapes to the scene
    _addObjects() {
        // this._createObj();

        
        this.physObjCreator._createCube();
        this.physObjCreator._createSphere();
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
        for(const object of animatedObjects) {
            object.tick();
        }
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

        // Update Character
        let mixerUpdateData = this.clock.getDelta();
        if (this.characterControls) {
            this.characterControls.update(mixerUpdateData, this.keysPressed);
        }

    }
}

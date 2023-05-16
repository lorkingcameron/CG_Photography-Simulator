import * as THREE from 'three'
import {OrbitControls} from 'OrbitControls'
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js'
import {BokehPass} from 'three/addons/postprocessing/BokehPass.js'
import {RenderPass} from 'three/addons/postprocessing/RenderPass.js'
import {EffectComposer} from 'three/addons/postprocessing/EffectComposer.js'
import {GUI} from 'three/addons/libs/lil-gui.module.min.js'
import {TextureLoader} from 'TextureLoader'

export default class SceneManager {
    constructor() {
        this._buildScene();
        this._buildCamera();
        this._buildRenderer();
        this._addShapes();
        this._initPostprocessing();
        this._GUITest();
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    _buildScene() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color( 0x114444 );
        

        
        
    }


    

    

    _buildCamera() {
        var ratio = window.innerWidth/window.innerHeight;
        this.camera = new THREE.PerspectiveCamera(70, ratio, 1, 1000);
        this.camera.filmGauge =100.0;
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
            file.scene.children.forEach(child=> {
                //child.castShadow = true;
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


    _addLight() {
        this.cameralight = new THREE.PointLight(new THREE.Color(1, 1, 1), 20);
        this.cameralight.castShadow = true;
        this.ambientlight = new THREE.AmbientLight(new THREE.Color(1, 1, 1), 10);
        this.camera.add(this.cameralight);
    }



    _initPostprocessing() {
        this.postprocessing = {};
        this.renderPass = new RenderPass( this.scene, this.camera );

        this.bokehPass = new BokehPass( this.scene, this.camera, {
            focus: 7.0,
            aperture: 0.01,
            maxblur: 0.00
        } );

        this.composer = new EffectComposer( this.renderer );

        this.composer.addPass( this.renderPass );
        this.composer.addPass( this.bokehPass );

        this.postprocessing.composer = this.composer;
        this.postprocessing.bokeh = this.bokehPass;
        console.log(this.postprocessing);
    }

    _GUITest() {
        this.effectController = {

            focus: 500.0,
            aperture: 5,
            maxblur: 0.01
        };

        const gui = new GUI();
            gui.add( this.effectController, 'focus', 10.0, 3000.0, 10 ).onFinishChange( () => {this._updatePost()} );
            gui.add( this.effectController, 'aperture', 0, 10, 0.1 ).onFinishChange( () => {this._updatePost()}  );
            gui.add( this.effectController, 'maxblur', 0.0, 0.01, 0.001 ).onFinishChange( () => {this._updatePost()} );
            gui.close();

        //matChanger();
    }

    _updatePost() {
        console.log(this.effectController);
        this.postprocessing.bokeh.uniforms[ 'focus' ].value = this.effectController.focus;
        this.postprocessing.bokeh.uniforms[ 'aperture' ].value = this.effectController.aperture;
        this.postprocessing.bokeh.uniforms[ 'maxblur' ].value = this.effectController.maxblur;
    }

    

    //Add all shapes to the scene
    _addShapes() {
        this._createObj();
        this._addCube(2, 2, 2, 0, 1, 0);
        this._addLight();
        this.scene.add(this.camera);
        this.scene.add(this.ambientlight);
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
        this.postprocessing.composer.render(0.1);
    }
}

import * as THREE from 'three'
import {BokehPass} from 'three/addons/postprocessing/BokehPass.js'
import {RenderPass} from 'three/addons/postprocessing/RenderPass.js'
import {EffectComposer} from 'three/addons/postprocessing/EffectComposer.js'
import {GUI} from 'three/addons/libs/lil-gui.module.min.js'
import {OrbitControls} from 'OrbitControls'

export default class Graphics {
    constructor() {
        this._buildScene();
        this._buildCamera();
        this._buildRenderer();
        this._initPostProcessing();
        this._addGUI();
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

    _initPostProcessing() {
        this.postprocessing = {};
        this.renderPass = new RenderPass( this.scene, this.camera );

        this.bokehPass = new BokehPass(this.scene, this.camera, {
            focus: 7.0,
            aperture: 0.01,
            maxblur: 0.00
        } );

        this.composer = new EffectComposer( this.renderer );

        this.composer.addPass( this.renderPass );
        this.composer.addPass( this.bokehPass );

        this.postprocessing.composer = this.composer;
        this.postprocessing.bokeh = this.bokehPass;
    }

    _updatePost() {
        this.postprocessing.bokeh.uniforms[ 'focus' ].value = this.effectController.focus;
        this.postprocessing.bokeh.uniforms[ 'aperture' ].value = this.effectController.aperture;
        this.postprocessing.bokeh.uniforms[ 'maxblur' ].value = this.effectController.maxblur;
    }

    _addGUI() {
        this.effectController = {
            focus: 500.0,
            aperture: 5,
            maxblur: 0.01
        };

        const gui = new GUI();
            gui.add( this.effectController, 'focus', 10.0, 3000.0, 10 ).onChange( () => {this._updatePost()} );
            gui.add( this.effectController, 'aperture', 0, 10, 0.1 ).onChange( () => {this._updatePost()}  );
            gui.add( this.effectController, 'maxblur', 0.0, 0.01, 0.001 ).onChange( () => {this._updatePost()} );
            gui.close();
    }

    render() {
        this.renderer.render(this.scene, this.camera);
        this.controls.update();
        this.postprocessing.composer.render(0.1);
    }
}
import * as THREE from 'three'
import {BokehPass} from 'three/addons/postprocessing/BokehPass.js'
import {RenderPass} from 'three/addons/postprocessing/RenderPass.js'
import {EffectComposer} from 'three/addons/postprocessing/EffectComposer.js'
import {GUI} from 'three/addons/libs/lil-gui.module.min.js'
import {OrbitControls} from 'OrbitControls'
import {PointerLockControls} from 'PointerLockControls'

export default class Graphics {
    constructor() {
        this._buildScene();
        this._buildCamera();
        this._buildViewfinderCamera()
        this._buildRenderer();
        this._initPostProcessing();
        this._addGUI();
        this.cameraLock = false;
        this.activeCamera;
        this.saveLink = document.createElement('div');
        this.saveLink.style.position = 'absolute';
        this.saveLink.style.bottom = '30px';
        this.saveLink.style.width = '100%';
        this.saveLink.style.textAlign = 'center';
        this.saveLink.innerHTML = '<a href="#" id="saveLink">Take Photo</a>';
        document.body.appendChild(this.saveLink);
        document.getElementById("saveLink").addEventListener('click', () => {this._saveAsImage()});

    }
    
    onWindowResize() {
        this.activeCamera.aspect = window.innerWidth / window.innerHeight;
        this.activeCamera.updateProjectionMatrix();
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
        this.camera.position.set(0, 40, 0);
        
        this.scene.add(this.camera);
    }

   
    _buildViewfinderCamera() {
        var ratio = window.innerWidth/window.innerHeight;
        this.viewfinderCamera = new THREE.PerspectiveCamera(70, ratio, 1, 1000);
        this.viewfinderCamera.position.set(0,41.5,-1);
        this.viewfinderCamera.filmGauge =100.0;
        this.viewfinderCamera.lookAt(0,40,0);


        this.scene.add(this.viewfinderCamera);
        this.activeCamera = this.viewfinderCamera;
    }
    

    _buildRenderer() {
        this.renderer = new THREE.WebGLRenderer({ antialias: true, logarithmicDepthBuffer: true, preserveDrawingBuffer: true });
        this.renderer.setSize(window.innerWidth,window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    
        const target = document.getElementById('target');
        target.appendChild(this.renderer.domElement);
        this.controls = new PointerLockControls(this.activeCamera,this.renderer.domElement);
        
        
    }

    _initPostProcessing() {
        this.postprocessing = {};
        this.renderPass = new RenderPass( this.scene, this.activeCamera );

        this.bokehPass = new BokehPass(this.scene, this.activeCamera, {
            focus: 7.0,
            aperture: 0.01,
            maxblur: 0.001
        } );

        this.composer = new EffectComposer( this.renderer );

        this.composer.addPass( this.renderPass );
        this.composer.addPass( this.bokehPass );

        this.postprocessing.composer = this.composer;
        this.postprocessing.bokeh = this.bokehPass;
    }

    _updatePost() {
        this.postprocessing.bokeh.uniforms[ 'focus' ].value = this.effectController.focus *0.1;
        this.postprocessing.bokeh.uniforms[ 'aperture' ].value = this.effectController.aperture *0.00001;
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
            gui.add( this.effectController, 'maxblur', 0.0, 0.5, 0.001 ).onChange( () => {this._updatePost()} );
            gui.close();
    }

    _changeCamera(){
        if (this.activeCamera === this.camera){
            console.log("change camera");
            this.renderer.resetState();
            this.activeCamera = this.viewfinderCamera;
            this._initPostProcessing();
            this.controls = new PointerLockControls(this.activeCamera,this.renderer.domElement);
            
        } else {
            console.log("change camera");
            this.renderer.resetState();    
            this.activeCamera = this.camera;
            this._initPostProcessing();
            this.controls = new PointerLockControls(this.activeCamera,this.renderer.domElement);
            

        }
        console.log(this.activeCamera);
    }


    _saveAsImage() {
        this.imgData
        this.imgNode;
        console.log("click");
    
        try {
            this.strMime = "image/jpeg";
            this.strDownloadMime = "image/octet-stream";
            console.log(this.renderer);
            this.imgData = this.renderer.domElement.toDataURL(this.strMime);
            console.log(this.renderer.domElement);
    
            this._saveFile(this.imgData.replace(this.strMime, this.strDownloadMime), "Photo.jpg");
    
        } catch (e) {
            console.log(e);
            return;
        }
    }

    _saveFile(strData, filename) {
        this.link = document.createElement('a');
        if (typeof this.link.download === 'string') {
            document.body.appendChild(this.link); //Firefox requires the link to be in the body
            this.link.download = filename;
            this.link.href = strData;
            this.link.click();
            document.body.removeChild(this.link); //remove the link when done
        } else {
            location.replace(uri);
        }
    }
    



    render() {
        this.renderer.render(this.scene, this.camera);
        
        this.postprocessing.composer.render(0.1);
        if (this.cameraLock === true){
            this.controls.lock()
        } else if (this.cameraLock===false){
            this.controls.unlock();
        }

    }
}
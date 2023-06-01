import * as THREE from 'three'
import Skybox from '../modules/Skybox.js'
import {BokehPass} from 'three/addons/postprocessing/BokehPass.js'
import {RenderPass} from 'three/addons/postprocessing/RenderPass.js'
import {EffectComposer} from 'three/addons/postprocessing/EffectComposer.js'
import {GUI} from 'three/addons/libs/lil-gui.module.min.js'
import {OrbitControls} from 'OrbitControls'
import {PointerLockControls} from 'PointerLockControls'
import {FirstPersonControls} from 'three/addons/controls/FirstPersonControls.js'

export default class Graphics {
    constructor() {
        this._buildScene();
        this._buildCamera();
        this._buildViewfinderCamera()
        this._buildRenderer();
        this._initPostProcessing();
        

        this.day_skybox = new Skybox("day");
        this.day_skybox.name = "day_skybox_entity";
        this.scene.add(this.day_skybox);
        this.day_skybox.visible = true;

        this.night_skybox = new Skybox("night");
        this.night_skybox.name = "night_skybox_entity";
        this.scene.add(this.night_skybox);
        this.night_skybox.visible = false;

        this.currentSkybox = this.day_skybox;
        

        this._addGUI();

        this.scene.fog = new THREE.Fog( 0xcce0ff, 100, 150 );
        this.renderer.setClearColor(this.scene.fog.color);
        // this.scene.background = this.scene.fog.color;

        this.filterColor;

        this.cameraLock = false;
        this.activeCamera;

        this.camera;
        this.viewfinderCamera;
        this.saveLink = document.createElement('div');
        this.saveLink.style.position = 'absolute';
        this.saveLink.style.bottom = '30px';
        this.saveLink.style.width = '100%';
        this.saveLink.style.textAlign = 'center';
        this.saveLink.innerHTML = '<a href="#" id="saveLink">Take Photo</a>';
        document.body.appendChild(this.saveLink);
        document.getElementById("saveLink").addEventListener('click', () => {this._saveAsImage()});
        this.controls;


        this._buildSaveLink();
    }
    
    onWindowResize() {
        this.activeCamera.aspect = window.innerWidth / window.innerHeight;
        this.activeCamera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        if (window.uniforms.u_resolution !== undefined){
            window.uniforms.u_resolution.value.x = window.innerWidth;
            window.uniforms.u_resolution.value.y = window.innerHeight;
        }
    }

    _buildScene() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color( 0x114444 );
        const axesIndicator = new THREE.AxesHelper(10);
        this.scene.add(axesIndicator);
    }

    _buildCamera() {
        var ratio = window.innerWidth/window.innerHeight;
        this.camera = new THREE.PerspectiveCamera(70, ratio, 0.1, 1000);
        
        this.camera.filmGauge =100.0;

        this.camera.position.set(0,0,0);
    
        this.scene.add(this.camera);
        this.activeCamera = this.camera;
    }

    _buildViewfinderCamera() {
        var ratio = window.innerWidth/window.innerHeight;
        this.viewfinderCamera = new THREE.PerspectiveCamera(70, ratio, 0.1, 1000);
        this.viewfinderCamera.zoom = 1;
        this.viewfinderCamera.position.set(0,40.3,1);
        this.viewfinderCamera.filmGauge =100.0;
        this.viewfinderCamera.lookAt(0,40.3,2);

        this.scene.add(this.viewfinderCamera);
    }

    _buildRenderer() {
        this.renderer = new THREE.WebGLRenderer({ antialias: true, logarithmicDepthBuffer: true, preserveDrawingBuffer: true });
        this.renderer.setSize(window.innerWidth,window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    
        const target = document.getElementById('target');
        target.appendChild(this.renderer.domElement);

        this.orbControls = new OrbitControls(this.camera,this.renderer.domElement);
        this.orbControls.target.set(0, 0, 0);
        this.orbControls.enablePan = false;
        this.orbControls.enableZoom = false;

        this.controls = this.orbControls;
        this.controls.update();

    }

    _initPostProcessing() {
        this.postprocessing = {};
        this.renderPass = new RenderPass( this.scene, this.activeCamera );

        this.bokehPass = new BokehPass(this.scene, this.activeCamera, {
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
        this.postprocessing.bokeh.uniforms[ 'focus' ].value = this.effectController.focus *0.1;
        this.postprocessing.bokeh.uniforms[ 'aperture' ].value = this.effectController.aperture *0.00001;
        this.postprocessing.bokeh.uniforms[ 'maxblur' ].value = this.effectController.maxblur;
        this.filterColor = this.effectController.color;
        this.filterIntensity = this.effectController.intensity;
    }

    _toggleSkyBox() {
        
    }

    _addGUI() {
        this.effectController = {
            focus: 500.0,
            aperture: 5,
            maxblur: 0.01,
            color: new THREE.Color("#FFCB8E"),
            intensity: 0.7
        };
        this.actions = {
            Toggle_Skybox: () => {
                if (this.currentSkybox == this.day_skybox) {
                    this.currentSkybox = this.night_skybox;
                    this.day_skybox.visible = false;
                    this.night_skybox.visible = true;
                } else {
                    this.currentSkybox = this.day_skybox;
                    this.day_skybox.visible = true;
                    this.night_skybox.visible = false;
                }
            },
        }



        const gui = new GUI();

        const cameraFolder = gui.addFolder("Camera");
        cameraFolder.add( this.effectController, 'focus', 10.0, 3000.0, 10 ).onChange( () => {this._updatePost()} );
        cameraFolder.add( this.effectController, 'aperture', 0, 10, 0.1 ).onChange( () => {this._updatePost()}  );
        cameraFolder.add( this.effectController, 'maxblur', 0.0, 0.5, 0.001 ).onChange( () => {this._updatePost()} );
        cameraFolder.addColor( this.effectController, 'color').onChange( () => {this._updatePost()});
        cameraFolder.add( this.effectController, 'intensity',0,1,0.01).onChange( () => {this._updatePost()});
        cameraFolder.close();

        const skyboxFolder = gui.addFolder("Skybox");
        skyboxFolder.add(this.actions, "Toggle_Skybox");
        skyboxFolder.open();

    }

    _changeCamera(){
        console.log("change camera");
        this.renderer.resetState();

        if (this.activeCamera === this.camera){
            var elements = document.querySelectorAll('[id="saveLink"]');
            elements.forEach((e) => {
                e.style.display = "initial";
            })
            this.activeCamera = this.viewfinderCamera;
           
        } else {
            var elements = document.querySelectorAll('[id="saveLink"]');
            elements.forEach((e) => {
                e.style.display = "none";
            })
            this.activeCamera = this.camera;
            this.controls = this.orbControls;
        }

        this._initPostProcessing();
        console.log(this.activeCamera);
        console.log(this.controls);
    }


    _zoomCamera() {
        if(this.viewfinderCamera.fov > 10 ){
            this.viewfinderCamera.fov -= 1;
            console.log(this.viewfinderCamera.fov);
            this.activeCamera.updateProjectionMatrix();
        }
    }

    _zoomOutCamera() {
        if(this.viewfinderCamera.fov < 100){
            this.viewfinderCamera.fov += 1;
            console.log(this.viewfinderCamera.fov);
            this.activeCamera.updateProjectionMatrix();
        }
    }



    _saveAsImage() {
        this.imgData
        this.imgNode;
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

    _buildSaveLink() {
        this.saveLink = document.createElement('div');
        this.saveLink.style.position = 'absolute';
        this.saveLink.style.bottom = '30px';
        this.saveLink.style.width = '100%';
        this.saveLink.style.textAlign = 'center';
        this.saveLink.innerHTML = '<a href="#" id="saveLink">Take Photo</a>';
        document.body.appendChild(this.saveLink);
        document.getElementById("saveLink").addEventListener('click', () => {this._saveAsImage()});
        var elements = document.querySelectorAll('[id="saveLink"]');
        elements.forEach((e) => {
            e.style.display = "none";
        })
    }

    render() {

        this.renderer.render(this.scene, this.camera);
        if (this.controls == this.orbControls) {
            this.controls.update();
        }
        this.postprocessing.composer.render(0.1);
    }
}
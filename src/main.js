import SceneManager from "./modules/SceneManager.js"
import * as THREE from 'three'

window.animatedObjects = [];
window.clock = new THREE.Clock();
const sceneManager = new SceneManager();

sceneManager.render();

bindEventListeners();

function bindEventListeners() {
    window.addEventListener('resize', () => {
        sceneManager.graphics.onWindowResize();
      }, false);
}



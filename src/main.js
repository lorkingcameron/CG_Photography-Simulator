import SceneManager from "./modules/SceneManager.js"
import * as THREE from 'three'

window.animatedObjects = [];
window.clock = new THREE.Clock();
window.uniforms = {
  u_resolution: {
    type: 'v2',
    value: new THREE.Vector2()
  },
  u_time: { value: 0.0 },
  u_mouse: { value: { x: null, y: null } },
}
const sceneManager = new SceneManager();

sceneManager.render();

bindEventListeners();

function bindEventListeners() {
    window.addEventListener('resize', () => {
        sceneManager.graphics.onWindowResize();
      }, false);

    document.addEventListener('mousemove', (e) =>{
      window.uniforms.u_mouse.value.x = e.clientX;
      window.uniforms.u_mouse.value.y = e.clientY;
    });
}



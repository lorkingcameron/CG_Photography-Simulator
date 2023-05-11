import SceneManager from "./modules/SceneManager.js";

const canvas = document.getElementById('canvas');
const sceneManager = new SceneManager(canvas);
window.animatedObjects = [];

bindEventListeners();
render();

function bindEventListeners() {
    window.addEventListener('resize',sceneManager.onWindowResize);
}

function render() {
    requestAnimationFrame(render);
    sceneManager.update();
}

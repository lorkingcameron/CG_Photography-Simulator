import SceneManager from "./modules/SceneManager.js";

const sceneManager = new SceneManager();
window.animatedObjects = [];

sceneManager.render();

bindEventListeners();

function bindEventListeners() {
    window.addEventListener('resize', () => {
        sceneManager.onWindowResize();
      }, false);
}
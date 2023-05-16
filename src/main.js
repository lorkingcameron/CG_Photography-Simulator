import SceneManager from "./modules/SceneManager.js"

window.animatedObjects = [];
const sceneManager = new SceneManager();

sceneManager.render();

bindEventListeners();

function bindEventListeners() {
    window.addEventListener('resize', () => {
        sceneManager.onWindowResize();
      }, false);
}



import SceneManager from "./modules/SceneManager.js";


import('@dimforge/rapier3d').then(RAPIER => {
  const sceneManager = new SceneManager();
  window.animatedObjects = [];
  
  sceneManager.render();
  
  bindEventListeners();
  
  function bindEventListeners() {
      window.addEventListener('resize', () => {
          sceneManager.onWindowResize();
        }, false);
  }
})


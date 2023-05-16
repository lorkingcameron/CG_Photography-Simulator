import * as CANNON from 'cannon-es'
import CannonDebugger from 'cannon-es-debugger'
import * as THREE from 'three'

export default class Physics {
    constructor (scene) {
        this._buildPhysics();
        this._buildDebugger(scene);
    }

    tick() {
        this.world.fixedStep();
        this.CannonDebugger.update();
    }

    _buildDebugger(scene) {
        this.CannonDebugger = new CannonDebugger(scene, this.world, {
            color: new THREE.Color(0xffffff), // Debugger wireframe colour
        });
    }

    _buildPhysics() {
        this.physicsBodies = [];

        console.log(CANNON.World);
        var world = new CANNON.World({
            gravity: new CANNON.Vec3(0, -10, 0) // m/s²
        });
        this.world = world;

        this._createGroundPlane();
    }

    _createGroundPlane() {
        const groundBody = new CANNON.Body({
            type: CANNON.Body.STATIC,
            shape: new CANNON.Plane(),
        });
        groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
        groundBody.position.set(0, 0, 0);
        this.world.addBody(groundBody);
    }
}
import * as CANNON from 'cannon-es'
import CannonDebugger from 'cannon-es-debugger'
import * as THREE from 'three'

export default class Physics {
    constructor (scene) {
        this._buildPhysics();
        this._buildContactMaterials();
        this._buildDebugger(scene);
    }

    updatePhysics(){
        this.world.fixedStep();
        this.CannonDebugger.update();

        for (var i = 0; i < this.physicsBodies.length; i++) {
            let body = this.physicsBodies[i][0];
            let mesh = this.physicsBodies[i][1];

            mesh.position.copy(body.position);
            mesh.quaternion.copy(body.quaternion);
        }
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
            gravity: new CANNON.Vec3(0, -30, 0) // m/s²
        });
        this.world = world;
    }

    _buildContactMaterials() {
        this.materials = {
            groundMat: new CANNON.Material("groundMat")
        }

        this.materials.treeMat = new CANNON.Material("treeMat");

        var treeGroundCM = new CANNON.ContactMaterial(
            this.materials.treeMat,
            this.materials.groundMat,
            {
                friction: 1,
                restitution: 0
            }
        )
        this.world.addContactMaterial(treeGroundCM);
    }
}
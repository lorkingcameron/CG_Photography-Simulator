import * as CANNON from 'cannon-es'
import CannonDebugger from 'cannon-es-debugger'
import * as THREE from 'three'

export default class Physics {
    constructor (scene) {
        this._buildPhysics();
        this._buildContactMaterials();
    }

    updatePhysics(){
        this.world.fixedStep();

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

        var world = new CANNON.World({
            gravity: new CANNON.Vec3(0, -30, 0) // m/s²
        });
        this.world = world;
    }

    _buildContactMaterials() {
        this.materials = {
            groundMat: new CANNON.Material("groundMat"),
            treeMat: new CANNON.Material("treeMat"),
            playerMat: new CANNON.Material("playerMat")
        }

        var treeGroundCM = new CANNON.ContactMaterial(
            this.materials.treeMat,
            this.materials.groundMat,
            {
                friction: 1,
                restitution: 0
            }
        )
        this.world.addContactMaterial(treeGroundCM);

        var playerGroundCM = new CANNON.ContactMaterial(
            this.materials.playerMat,
            this.materials.groundMat,
            {
                friction: 1e10,
                restitution: 0
            }
        )
        this.world.addContactMaterial(playerGroundCM);
    }
}
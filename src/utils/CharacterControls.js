import * as THREE from 'three'
import * as CANNON from 'cannon-es'

export class CharacterControls {
    
    constructor(scene, physics, model, mixer, animationsMap, orbitControl, camera, viewfinderCamera, currentAction, terrain) {
        this.scene = scene;
        this.world = physics.world;
        this.physicsBodies = physics.physicsBodies;
        this.materials = physics.materials;
        this.terrain = terrain;

        this.DIRECTIONS = ['w', 'a', 's', 'd']; // should be constant instead of a property
        this.model = model;
        this.mixer = mixer;
        this.orbitControl = orbitControl;
        this.camera = camera;
        this.viewfinderCamera = viewfinderCamera;
        this.currentAction = currentAction;

        this.animationsMap = animationsMap;
        this.animationsMap.forEach((value, key) => {
            if (key == currentAction) {
                value.play();
            }
        });

        // Constants
        this.fadeDuration = 0.2;
        this.runVelocity = 8;
        this.walkVelocity = 5;

        // Variables
        this.walkDir = new THREE.Vector3();
        this.rotateAngle = new THREE.Vector3(0, 1, 0);
        this.rotateQuaternion = new THREE.Quaternion();
        this.cameraTarget = new THREE.Vector3();

        this.model.position.set(0, 0, 0);
        this.camera.position.set(0, 2, 7);
        this.viewfinderCamera.position.set(0,1.8,-0.4);

        this._bindCharacter();
        var height = this.terrain.data[this.terrain.res / 2][this.terrain.res / 2] + 10;
        this.hitbox.position.set(0,height + 1,0); // CHARACTER STARTING POSITION
        this._updateCamera();
        console.log("Setup Complete");
    }


    update(delta, keysPressed, mouseDown) {
        // Get current command
        const directionPressed = this.DIRECTIONS.some(key => keysPressed[key] == true);
        var play = '';
        var running = keysPressed['shift'];
        if (directionPressed && running) {
            play = 'Run';
        } else if (directionPressed) {
            play = 'Walk';
        } else {
            play = 'Idle';
        }

        // Handle transition if new action
        if (this.currentAction != play) {
            const toPlay = this.animationsMap.get(play);
            const current = this.animationsMap.get(this.currentAction);

            current.fadeOut(this.fadeDuration);
            toPlay.reset().fadeIn(this.fadeDuration).play();

            this.currentAction = play;
        }

        this.mixer.update(delta);

        if (this.currentAction == 'Run' || this.currentAction == 'Walk') {
            this.hitbox.wakeUp();

            // Find angle toward camera direction
            var angleYCameraDirection = Math.atan2(
                (this.camera.position.x - this.model.position.x),
                (this.camera.position.z - this.model.position.z)
            )
            var directionOffset = this._directionOffset(keysPressed);

            // Rotate model toward modified angle.
            this.rotateQuaternion.setFromAxisAngle(this.rotateAngle, angleYCameraDirection + directionOffset);
            this.model.quaternion.rotateTowards(this.rotateQuaternion, 0.2);

            // Calculate direction
            this.camera.getWorldDirection(this.walkDir);
            this.walkDir.y = 0;
            this.walkDir.normalize();
            this.walkDir.applyAxisAngle(this.rotateAngle, directionOffset);

            // Run/Walk velocity
            const velocity = this.currentAction == 'Run' ? this.runVelocity : this.walkVelocity;
            this.hitbox.velocity.x = this.walkDir.x * velocity;
            this.hitbox.velocity.z = this.walkDir.z * velocity;


        } else {
            for (var i = 0; i < this.world.contacts.length; i++) {
                if (this.world.contacts[i].bi.id == this.hitbox.id) {
                    this.hitbox.sleep();
                    break;
                }
            }
        }

        if (mouseDown) {
            this._updateCamera();
        }

        // Handle hitbox binding
        this.model.position.x = this.hitbox.position.x;
        this.model.position.y = this.hitbox.position.y - 1;
        this.model.position.z = this.hitbox.position.z;
       
        // Bind camera position
        this.camera.position.x = this.model.position.x - this.cameraAngle.x;
        this.camera.position.y = this.model.position.y - this.cameraAngle.y;
        this.camera.position.z = this.model.position.z - this.cameraAngle.z;

        this.cameraTarget.x = this.model.position.x
        this.cameraTarget.y = this.model.position.y + 2
        this.cameraTarget.z = this.model.position.z
        this.orbitControl.target = this.cameraTarget

        this.viewfinderCamera.position.x = this.model.position.x;
        this.viewfinderCamera.position.y = this.model.position.y + 2;
        this.viewfinderCamera.position.z = this.model.position.z;

        var newVec = new THREE.Vector3(this.model.position.x - this.camera.position.x, (this.model.position.y + 2) - this.camera.position.y, this.model.position.z - this.camera.position.z);
        var vecDiv = Math.sqrt(Math.pow(newVec.x, 2) + Math.pow(newVec.y, 2) + Math.pow(newVec.z, 2));
        var unitVec = new THREE.Vector3(newVec.x / vecDiv, newVec.y / vecDiv, newVec.z / vecDiv);
        var vecSameDir = new THREE.Vector3(2 * unitVec.x, 2 * unitVec.y, 2 * unitVec.z);
        var thirdPoint = new THREE.Vector3(this.model.position.x + vecSameDir.x, this.model.position.y + 2 + vecSameDir.y, this.model.position.z + vecSameDir.z);

        this.viewfinderCamera.lookAt(thirdPoint.x, thirdPoint.y, thirdPoint.z);
    }

    _updateCamera() {
        // Update the offset vector that the camera is bound to
        this.cameraAngle = new THREE.Vector3(
            this.model.position.x - this.camera.position.x,
            this.model.position.y - this.camera.position.y,
            this.model.position.z - this.camera.position.z,
        );
        this.viewfinderAngle = new THREE.Vector3(
            this.model.position.x - this.viewfinderCamera.position.x,
            this.model.position.y - this.viewfinderCamera.position.y,
            this.model.position.z - this.viewfinderCamera.position.z,
        );
    }


    _directionOffset(keysPressed) {
        var directionOffset = 0 // For w key

        if (keysPressed['w']) {
            if (keysPressed['a']) {
                directionOffset = Math.PI / 4 // w+a
            } else if (keysPressed['d']) {
                directionOffset = - Math.PI / 4 // w+d
            }
            
        } else if (keysPressed['s']) {
            if (keysPressed['a']) {
                directionOffset = Math.PI / 4 + Math.PI / 2 // s+a
            } else if (keysPressed['d']) {
                directionOffset = -Math.PI / 4 - Math.PI / 2 // s+d
            } else {
                directionOffset = Math.PI // s
            }

        } else if (keysPressed['a']) {
            directionOffset = Math.PI / 2 // a
        } else if (keysPressed['d']) {
            directionOffset = - Math.PI / 2 // d
        }

        return directionOffset
    }

    _bindCharacter() {
        const sphereBody = new CANNON.Body({
            mass: 1000,
            shape: new CANNON.Sphere(1),
            material: this.materials.playerMaterial
        });
        this.world.addBody(sphereBody);
        this.hitbox = sphereBody;
    }
}
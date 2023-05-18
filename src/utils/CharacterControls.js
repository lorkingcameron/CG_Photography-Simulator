import * as THREE from 'three'
import * as CANNON from 'cannon-es'

export class CharacterControls {
    
    constructor(scene, world, physicsBodies, model, mixer, animationsMap, orbitControl, camera, currentAction) {
        this.scene = scene;
        this.world = world;
        this.physicsBodies = physicsBodies;

        this.DIRECTIONS = ['w', 'a', 's', 'd']; // should be constant instead of a property
        this.model = model;
        this.mixer = mixer;
        this.orbitControl = orbitControl;
        this.camera = camera;
        this.currentAction = currentAction;

        this.animationsMap = animationsMap;
        this.animationsMap.forEach((value, key) => {
            if (key == currentAction) {
                value.play();
            }
        });

        // Constants
        this.fadeDuration = 0.2;
        this.runVelocity = 5;
        this.walkVelocity = 2;

        // Variables
        this.walkDir = new THREE.Vector3();
        this.rotateAngle = new THREE.Vector3(0, 1, 0);
        this.rotateQuaternion = new THREE.Quaternion();
        this.cameraTarget = new THREE.Vector3();

        this.model.position.set(0, 4, 0);
        this.camera.position.set(0,9,-5);
        this._updateCameraTarget(0,0);
        this._bindCharacter();

        this.cameraAngle = new THREE.Vector3(
            this.model.position.x - this.camera.position.x,
            this.model.position.y - this.camera.position.y,
            this.model.position.z - this.camera.position.z,
        );
    }


    update(delta, keysPressed) {
        

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

            // Move the model & camera (TODO SHOULD BE DONE WITH PHYSICS)
            const moveX = this.walkDir.x * velocity * delta;
            const moveZ = this.walkDir.z * velocity * delta;
            // this.model.position.x += moveX;
            // this.model.position.z += moveZ;
            // this._updateCameraTarget(moveX, moveZ);
        } else {
            // this._updateCameraTarget(0, 0);w
        }

        // Handle hitbox binding
        this.model.position.x = this.hitbox.position.x;
        this.model.position.y = this.hitbox.position.y - 1;
        this.model.position.z = this.hitbox.position.z;
       

        this.camera.position.x = this.model.position.x - this.cameraAngle.x;
        this.camera.position.y = this.model.position.y - this.cameraAngle.y;
        this.camera.position.z = this.model.position.z - this.cameraAngle.z;

        this.cameraTarget.x = this.model.position.x
        this.cameraTarget.y = this.model.position.y + 1
        this.cameraTarget.z = this.model.position.z
        this.orbitControl.target = this.cameraTarget

        console.log("===============================");
        console.log(Math.floor(this.model.position.x), Math.floor(this.model.position.y), Math.floor(this.model.position.z), "Char");
        console.log(Math.floor(this.camera.position.x), Math.floor(this.camera.position.y), Math.floor(this.camera.position.z), "Camera");
        console.log(Math.floor(this.cameraAngle.x), Math.floor(this.cameraAngle.y), Math.floor(this.cameraAngle.z));
        
    }

    _updateCameraTarget(moveX, moveZ) {
        // move camera
        this.camera.position.x += moveX
        this.camera.position.z += moveZ

        // update camera target
        this.cameraTarget.x = this.model.position.x
        this.cameraTarget.y = this.model.position.y + 1
        this.cameraTarget.z = this.model.position.z
        this.orbitControl.target = this.cameraTarget
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
            mass: 500,
            shape: new CANNON.Sphere(1),
        });
        sphereBody.position.set(5, 7, 0);
        this.world.addBody(sphereBody);
        this.hitbox = sphereBody;

        // this.physicsBodies.push([sphereBody, this.model]);
    }
}
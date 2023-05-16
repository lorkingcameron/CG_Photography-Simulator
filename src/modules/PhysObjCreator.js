import * as CANNON from 'cannon-es'
import * as THREE from 'three'

export default class PhysObjCreator {
    constructor(scene, world, physicsBodies) {
        this.scene = scene;
        this.world = world;
        this.physicsBodies = physicsBodies;
    }

    _createSphere() {
        //create basic sphere
        const sphereBody = new CANNON.Body({
            mass: 5,
            shape: new CANNON.Sphere(1),
        });
        sphereBody.position.set(0, 7, 0);
        this.world.addBody(sphereBody);

        const sphereGeometry = new THREE.SphereGeometry();
        const sphereMaterial = new THREE.MeshNormalMaterial();
        const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
        this.scene.add(sphereMesh);
        this.physicsBodies.push([sphereBody, sphereMesh]);
    }

    _createCube() {
        //create basic cube
        const boxBody = new CANNON.Body({
            mass: 5,
            shape: new CANNON.Box(new CANNON.Vec3(1,1,1)),
        });
        boxBody.position.set(1, 12, 0);
        this.world.addBody(boxBody);

        const boxGeometry = new THREE.BoxGeometry(2,2,2);
        const boxMaterial = new THREE.MeshNormalMaterial();
        const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
        this.scene.add(boxMesh);
        this.physicsBodies.push([boxBody, boxMesh]);
    }
}
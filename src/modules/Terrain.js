import * as CANNON from 'cannon-es'
import * as THREE from 'three'

export default class Terrain {
    constructor(physics) {
        // this._addMappedPlane(300, 100, 30, 0xffffff, 0, -50, 0);
        this._createGroundPlane(physics);
    }

    _createGroundPlane(physics) {
        var noise = new Noise(Math.random());

        var x = 300;
        var y = 300;
        var a = 20; // amplitude
        var f = 2; // frequency

        var data = Array.from(Array(x), () => new Array(y));
        for(var i = 0; i < x; i++){
            for(var j = 0; j < y; j++){
                data[i][j] = noise.perlin2((i * f) / 100, (j * f) / 100) * a;
            }
        }

        const groundBody = new CANNON.Body({
            shape: new CANNON.Heightfield(data, {
                elementSize: 1, // Distance between the data points in X and Y directions
            }),
        });
        groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
        groundBody.position.set(-(x/2), 0, (y/2));
        physics.world.addBody(groundBody);
    }

    // _addMappedPlane(size, detail, amp, color, x, y, z) {
    //     const textureLoader = new THREE.TextureLoader();
    //     const displacementMapTexture = textureLoader.load('src/assets/noise.png');

    //     var plane_geometry = new THREE.PlaneGeometry(size, size, detail, detail);
    //     var plane_material = new THREE.MeshStandardMaterial({
    //         wireframe: true,
    //         color: color,
    //         displacementMap: displacementMapTexture,
    //         displacementScale: amp, // Adjust the scale as needed
    //       });

    //     this.terrain_mesh = new THREE.Mesh(plane_geometry, plane_material);
        
    //     this.terrain_mesh.position.set(x,y,z);
    //     this.terrain_mesh.rotateX(-Math.PI/2);
    // }

    // _createGroundPlane(physics) {
    //     const groundBody = new CANNON.Body({
    //         // type: CANNON.Body.STATIC,
    //         shape: new CANNON.Plane(),
    //     });
    //     groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
    //     groundBody.position.set(0, 0, 0);
    //     physics.world.addBody(groundBody);
    // }
}
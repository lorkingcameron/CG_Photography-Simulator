import * as CANNON from 'cannon-es'
import * as THREE from 'three'

export default class Terrain {
    constructor(scene, physics, terrainParams) {
        this.scene = scene;
        Object.assign(this, terrainParams);

        this._buildTerrainData();
        this._createGroundPlane(physics);
        // this._buildMesh(this._buildGeometry(), this._buildMaterial());
    }

    _buildTerrainData() {
        var noise = new Noise(Math.random());

        var a = this.amp; // amplitude
        var f = this.freq; // frequency
        var v = 0; // value

        this.data = Array.from(Array(this.width), () => new Array(this.length));
        for(var x = 0; x < this.width; x++){
            for(var y = 0; y < this.length; y++){
                console.log(v)
                v = (noise.perlin2((x * f) / 100, (y * f) / 100) + 1) / 2;
                // this.data[x][y] = this._createIsland(v, x, y) * a;
                this.data[x][y] = v * a;
            }
        }
    }

    // Function to reduce value (height) further from center to create an island
    _createIsland(v, x, y) {
        var x_dist = 2 * x / this.width - 1; // finds the percentage distance from the center
        var y_dist = 2 * y / this.length - 1;
    
        var dist = Math.sqrt(x_dist**2 + y_dist**2);
        console.log(dist, (10/(x - 3.25) + 4))

        if (dist < 0.75) {
            return v * (10/(dist - 3.25) + 4);
        } else {
            return v * (3/(dist) - 4);
        }
    }

    _createGroundPlane(physics) {
        const groundBody = new CANNON.Body({
            shape: new CANNON.Heightfield(this.data, {
                elementSize: this.res, // Distance between the data points in X and Y directions
            }),
        });
        groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
        groundBody.position.set(-(this.width/2), 0, (this.length/2));
        physics.world.addBody(groundBody);
    }

    _buildMaterial() {    
        // this.material = new THREE.MeshStandardMaterial({ roughness: 1.0, metalness: 0.0, map: texture });
        var mat = new THREE.MeshPhongMaterial();
        // mat.wireframe = true;
        return mat;
    }
    
    _buildGeometry() {
        var w = this.width - 1;
        var l = this.length - 1;
        var geo = new THREE.PlaneGeometry(w, l, w/this.res, l/this.res);
        geo.rotateX(- Math.PI / 2);

        for (var x = 0; x <= w/this.res; x++)  {
            for (var y = 0; y <= l/this.res; y++)  {
            var ind = (x + (w + 1)/this.res * y) * 3 + 1;

            geo.attributes.position.array[ind] = this.data[x][l/this.res - y];
            }
        }

        return geo;
    }

    _buildMesh(geo, mat) {
        var mesh = new THREE.Mesh(geo, mat);
        mesh.position.set(-0.5, 0, 0.5); // Account for rounding error

    
        mesh.receiveShadow = true;
        mesh.castShadow = true;
    
        this.scene.add(mesh);
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
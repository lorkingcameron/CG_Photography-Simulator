import * as CANNON from 'cannon-es'
import * as THREE from 'three'
import TerrainTexture from '../utils/TerrainTexture.js'
import Trees from './Trees.js'

export default class Terrain {
    constructor(scene, physics, terrainParams) {
        this.scene = scene;
        Object.assign(this, terrainParams);

        this._buildTerrainData();
        this._createGroundPlane(physics);
        this._buildWater();
        this._buildMesh(this._buildGeometry(), this._buildMaterial());
        this.trees = new Trees(this.scene, physics, this.data, terrainParams);
    }

    _buildTerrainData() {
        var noise = new Noise(Math.random());

        var a = this.amp; // amplitude
        var f = this.freq; // frequency
        var v = 0; // value

        this.data = Array.from(Array(this.res), () => new Array(this.res));
        for(var x = 0; x < this.res; x++){
            for(var y = 0; y < this.res; y++){
                v = (noise.perlin2((x * f) / 100, (y * f) / 100) + 1) / 2;
                this.data[x][y] = this._createIsland(v, x, y) * a;
                // this.data[x][y] = v * a;
            }
        }
        console.log(this.data)
    }

    // Function to reduce value (height) further from center to create an island
    _createIsland(v, x, y) {
        var x_dist = 2 * x / this.res - 1; // finds the percentage distance from the center
        var y_dist = 2 * y / this.res - 1;
    
        var dist = Math.sqrt(x_dist**2 + y_dist**2);

        if (dist < 0.75) {
            return v * (3/(dist - 1.5) + 4);
        } else {
            return v * (3/(dist) - 4);
        }
    }

    _createGroundPlane(physics) {
        const groundBody = new CANNON.Body({
            shape: new CANNON.Heightfield(this.data, {
                elementSize: this.width/(this.res - 1), // Distance between the data points in X and Y directions
            }),
            material: physics.materials.groundMat,
        });
        groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
        groundBody.position.set(-(this.width/2), 0, (this.width/2));
        physics.world.addBody(groundBody);
    }

    _buildMaterial() {    
        // this.material = new THREE.MeshStandardMaterial({ roughness: 1.0, metalness: 0.0, map: texture });
        var terrainTexture = new TerrainTexture(this.data, this.res);
        var texture = new THREE.CanvasTexture(terrainTexture.canvas);
        var mat = new THREE.MeshStandardMaterial({ roughness: 1.0, metalness: 0.0, map: texture });
        mat.flatShading = true;
        // mat.color = new THREE.Color(0x1c5917);
        // mat.wireframe = true;
        return mat;
    }
    
    _buildGeometry() {
        var w = this.width - 1;
        var geo = new THREE.PlaneGeometry(this.width, this.width, this.res - 1, this.res - 1);
        geo.rotateX(- Math.PI / 2);

        for (var x = 0; x < this.res; x++)  {
            for (var y = 0; y < this.res; y++)  {
            var ind = (x + this.res * y) * 3 + 1;

            geo.attributes.position.array[ind] = this.data[x][this.res - y - 1];
            }
        }

        return geo;
    }

    _buildMesh(geo, mat) {
        var mesh = new THREE.Mesh(geo, mat);
        mesh.position.set(0,0,0); // Account for rounding error
        // mesh.position.set(-0.5, 0, 0.5); // Account for rounding error

    
        mesh.receiveShadow = true;
        mesh.castShadow = true;
    
        this.scene.add(mesh);
    }

    _buildWater() {
        this.scene.remove(this.water);
        this.scene.remove(this.deepWater);

        this.waveHeight = 2;
        this.waterLevel = 0;
    
        let waterGeometry = new THREE.PlaneBufferGeometry(this.width * 2, this.width * 2, (this.res - 1) * 2, (this.res - 1) * 2);
        waterGeometry.rotateX(-Math.PI * 0.5);
        let vertData = [];
        let v3 = new THREE.Vector3(); // for re-use
        for (let i = 0; i < waterGeometry.attributes.position.count; i++) {
          v3.fromBufferAttribute(waterGeometry.attributes.position, i);
          vertData.push({
            initH: v3.y,
            amplitude: THREE.MathUtils.randFloatSpread(this.waveHeight),
            phase: THREE.MathUtils.randFloat(0, Math.PI)
          })
        }
        waterGeometry.computeVertexNormals();
    
        let waterMaterial = new THREE.MeshLambertMaterial({
          color: 0x1c82c8, opacity: 0.8
        });
        // waterMaterial.transparent = true;
        waterMaterial.flatShading = true;
        // waterMaterial.wireframe = true;
    
        this.water = new THREE.Mesh(waterGeometry, waterMaterial);
    
        this.water.receiveShadow = true;
        this.water.castShadow = true;
        this.water.position.set((this.width/this.res) / 2, this.waterLevel, (this.width/this.res) / 2);
        
        this.water.tick = () => {
            let time = clock.getElapsedTime();
    
            vertData.forEach((vd, idx) => {
                let y = vd.initH + Math.sin(time + vd.phase) * vd.amplitude;
                waterGeometry.attributes.position.setY(idx, y);
            })
            waterGeometry.attributes.position.needsUpdate = true;
            waterGeometry.computeVertexNormals();
        }
        animatedObjects.push(this.water);
    
        this.scene.add(this.water);
    }
}
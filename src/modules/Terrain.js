import * as CANNON from 'cannon-es'
import * as THREE from 'three'
import TerrainTexture from '../utils/TerrainTexture.js';

export default class Terrain {
    constructor(scene, physics, terrainParams) {
        this.scene = scene;
        Object.assign(this, terrainParams);

        this._buildTerrainData();
        this._createGroundPlane(physics);
        this._buildWater();
        this._buildMesh(this._buildGeometry(), this._buildMaterial());
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
                this.data[x][y] = this._createIsland(v, x, y) * a;
                // this.data[x][y] = v * a;
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
            return v * (3/(dist - 1.5) + 4);
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
        var terrainTexture = new TerrainTexture(this.data, this.width, this.length);
        var texture = new THREE.CanvasTexture(terrainTexture.canvas);
        var mat = new THREE.MeshStandardMaterial({ roughness: 1.0, metalness: 0.0, map: texture });
        // mat.color = new THREE.Color(0x1c5917);
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

    _buildWater() {
        this.scene.remove(this.water);
        this.scene.remove(this.deepWater);

        this.waveHeight = 1;
        this.waterLevel = 0;
    
        let waterGeometry = new THREE.PlaneBufferGeometry(300, 300, 50, 50);
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
    
        let waterMaterial = new THREE.MeshLambertMaterial({
          color: 0x1c82c8, opacity: 0.8
        });
        waterMaterial.transparent = true;
    
        this.water = new THREE.Mesh(waterGeometry, waterMaterial);
    
        this.water.receiveShadow = true;
        this.water.castShadow = true;
        this.water.position.y = this.waterLevel;
        
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
    
        let deepWaterGeometry = new THREE.PlaneGeometry(300, 300, 1, 1);
        deepWaterGeometry.rotateX(-Math.PI * 0.5);
        let deepWaterMaterial = new THREE.MeshLambertMaterial({
          color: 0x1c82c8, opacity: 0.8
        });
        deepWaterMaterial.transparent = true;
    
        this.deepWater = new THREE.Mesh(deepWaterGeometry, deepWaterMaterial);    
    
        this.deepWater.receiveShadow = true;
        this.deepWater.castShadow = true;
        this.deepWater.position.y = this.waterLevel - (7/16 * this.waveHeight + 0.0225);
    
        this.scene.add(this.water);
        this.scene.add(this.deepWater);
      }
}
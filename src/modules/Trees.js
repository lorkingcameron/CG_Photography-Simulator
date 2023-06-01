import * as CANNON from 'cannon-es'
import * as THREE from 'three'
import { threeToCannon, ShapeType } from 'three-to-cannon'
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js'

export default class Trees {
    constructor (scene, physics, data, terrainParams) {
        this.scene = scene;
        this.physics = physics;
        this.data = data;
        this.terrainParams = terrainParams;
        this.gltfLoader = new GLTFLoader();

        this.placedDots = [] // dots represent trees of coordinates [x, y]

        this._buildTrees(scene, terrainParams, data);
    }

    _buildTrees(scene, terrainParams, data) {
        var numTrees = 100;
        var treeScale = 10;
        var dots = [];

        for (var i = 0; i < numTrees; i++) {
            dots.push(this._placeNewDot());
        }

        this.gltfLoader.load("../../models/low_poly_tree.glb", (file)=>{
            file.scene.traverse(function ( child ) {
                const dummy = new THREE.Object3D();

				if ( child.isMesh ) {
					var treeInstancedMesh = new THREE.InstancedMesh( child.geometry, child.material, numTrees );
                    scene.add( treeInstancedMesh );

                    dummy.rotateX(- Math.PI / 2);
                    for (var i = 0; i < dots.length; i++) {
                        // Move Tree Instances
                        dummy.scale.set(treeScale/10, treeScale/10, treeScale/10);
                        dummy.position.set(dots[i][0]*terrainParams.width/(terrainParams.res - 1) - terrainParams.width/2,
                            data[dots[i][0]][terrainParams.res - dots[i][1] - 1],
                            dots[i][1]*terrainParams.width/(terrainParams.res - 1) - terrainParams.width/2);
                        dummy.rotateZ(Math.random());
                        dummy.updateMatrix();
                        treeInstancedMesh.setMatrixAt(i, dummy.matrix);
                    }
				}
			});

            file.scene.scale.set(treeScale/7.5, treeScale/2, treeScale/7.5);
            for (var i = 0; i < this.placedDots.length; i++) {
                // Build Physics Meshes for Trees
                var {shape} = threeToCannon(file.scene, {type: ShapeType.CYLINDER})
                var treeBody = new CANNON.Body({
                    mass: 0,
                    material: this.physics.materials.treeMat
                });
                treeBody.addShape(shape, {x: 0, y: treeScale, z: 0});

                treeBody.position.set(this.placedDots[i][0]*this.terrainParams.width/(this.terrainParams.res - 1) - this.terrainParams.width/2,
                this.data[this.placedDots[i][0]][this.terrainParams.res - this.placedDots[i][1] - 1],
                this.placedDots[i][1]*this.terrainParams.width/(this.terrainParams.res - 1) - this.terrainParams.width/2);

                this.physics.world.addBody(treeBody);
                this.physics.physicsBodies.push([treeBody, file.scene]);
            }
        })
    }

    _generateRandomPosition() {
        return [
        Math.round(Math.random() * this.terrainParams.res / 2 + this.terrainParams.res / 4),
        Math.round(Math.random() * this.terrainParams.res / 2 + this.terrainParams.res / 4)];
    }

    _getDistanceToNearestDot(dot) {
        var shortest;
        for (var i = this.placedDots.length - 1; i >= 0; i--) {
            var distance = this._getDistance(this.placedDots[i], dot);
            if (!shortest || distance < shortest) shortest = distance;
        }
        return shortest;
    }

    _getDistance(dot1, dot2) {
        var xDistance = Math.abs(dot1[0] - dot2[0]),
            yDistance = Math.abs(dot1[1] - dot2[1]),
            distance = Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));
        return Math.floor(distance);
    }

    _alreadyPlaced(dot) {
        for (var i = 0; i < this.placedDots.length; i++) {
            if (this.placedDots[i][0] == dot[0] && this.placedDots[i][1] == dot[1]) {
                return true;
            }
        }
        return false;
    }

    _generateBestDot() {
        var bestDot, bestDotDistance;
        var samples = 50;
        for (var i = 0; i < samples; i++) {
            var distance;
            var candidateDot = this._generateRandomPosition();
            while (this._alreadyPlaced(candidateDot)) {
                candidateDot = this._generateRandomPosition();
            }

            if (!this.placedDots.length) return candidateDot;
            distance = this._getDistanceToNearestDot(candidateDot);
            if (!bestDot || distance > bestDotDistance) {
                bestDot = candidateDot;
                bestDotDistance = distance;
            }
        }
        return bestDot;
    }

    _placeNewDot() {
        var dot = this._generateBestDot();
        this.placedDots.push(dot);
        return dot;
    }
}
import { ConvexGeometry } from 'three/addons/geometries/ConvexGeometry.js'
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

        this._buildTrees();
        // this._buildTree([160, 175]);
        // this._buildTree([200, 100]);
        // this._buildTree([100, 200]);
        // this._buildTree([150, 150]);
        // this._buildTree([200, 200]);
    }

    _buildTrees() {
        var numTrees = 4;

        for (var i = 0; i < numTrees; i++) {
            this._placeNewDot();
        }
        for (var t = 0; t < this.placedDots.length; t++) {
            this._buildTree(this.placedDots[t]);
            console.log(this.placedDots[t]);
        }

    }

    _buildTree(pos) {
        this.gltfLoader.load("../../models/low_poly_tree.glb", (file)=>{
            file.scene.scale.set(1, 1, 1);
            file.scene.children.forEach(child=> {
                child.castShadow = true;
                child.receiveShadow = true;
            });

            var {shape, offset, quaternion} = threeToCannon(file.scene,  {type: ShapeType.BOX})
            var treeBody = new CANNON.Body({
                mass: 0,
                material: this.physics.materials.treeMat
            });
            treeBody.addShape(shape, offset)
            treeBody.position.set(pos[1] - this.terrainParams.width/2, this.data[pos[1]][pos[0]], pos[0] - this.terrainParams.length/2);
            this.scene.add(file.scene);
            this.physics.world.addBody(treeBody);
            this.physics.physicsBodies.push([treeBody, file.scene]);
        })
    }

    _generateRandomPosition() {
        return [
        Math.round(Math.random() * 0.5 * this.terrainParams.width) + this.terrainParams.width/4,
        Math.round(Math.random() * 0.5 * this.terrainParams.length) + this.terrainParams.length/4];
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

    _generateBestDot() {
        var bestDot, bestDotDistance;
        var samples = 50;
        for (var i = 0; i < samples; i++) {
            var candidateDot = this._generateRandomPosition(),
                distance;
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
    }
}
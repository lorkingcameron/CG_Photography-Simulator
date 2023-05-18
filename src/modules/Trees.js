import { ConvexGeometry } from 'three/addons/geometries/ConvexGeometry.js'
import * as CANNON from 'cannon-es'
import * as THREE from 'three'
import { threeToCannon, ShapeType } from 'three-to-cannon'
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js'

export default class Trees {
    constructor (scene, physics) {
        this.scene = scene;
        this.physics = physics;
        this.gltfLoader = new GLTFLoader();

        this._buildTree();
    }

    _buildTrees() {
        var numTrees = 4;

    }

    _buildTree() {
        this.gltfLoader.load("../../models/low_poly_tree.glb", (file)=>{
            // gltfLoader.load("../../models/scene.gltf", (file)=>{
                file.scene.scale.set(1, 1, 1);
                file.scene.children.forEach(child=> {
                    //child.castShadow = true;
                    child.receiveShadow = true;
                    if(child.name === ""){
    
                    }
                });

                var {shape, offset, quaternion} = threeToCannon(file.scene,  {type: ShapeType.BOX})
                var treeBody = new CANNON.Body({
                    mass: 0,
                    material: this.physics.materials.treeMat
                });
                treeBody.addShape(shape, offset)
                treeBody.position.set(0, 30, 0);
                this.scene.add(file.scene);
                this.physics.world.addBody(treeBody);
                this.physics.physicsBodies.push([treeBody, file.scene]);
            })
    }
}
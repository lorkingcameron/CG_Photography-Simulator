export default `
    precision mediump float;

    varying vec3 vcolor;

    void main() {

        vec3 terrainColor = vcolor;
        terrainColor.x = 0.0;
        terrainColor.y = 0.1;
        terrainColor.z += 0.6;

        gl_FragColor = vec4(terrainColor, 1.0);
    }
`;
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 500);
camera.position.set(0, -25, 80);

var renderer = new THREE.WebGLRenderer({ antialias: true, canvas: document.getElementById('bgCanvas') });
renderer.setClearColor(0x0F0A03);
renderer.setSize(window.innerWidth, window.innerHeight);

var controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.maxDistance = 150;
controls.enableDamping = true;

let geoms = [];
let pts = [
    new THREE.Vector2(0, 1.0),
    new THREE.Vector2(0.25, 1.0),
    new THREE.Vector2(0.25, 0.875),
    new THREE.Vector2(0.45, 0.875),
    new THREE.Vector2(0.45, 0.05)
];
var geom = new THREE.LatheBufferGeometry(pts, 20);
geoms.push(geom);

var geomLight = new THREE.CylinderBufferGeometry(0.1, 0.1, 0.05, 20);
geoms.push(geomLight);

var fullGeom = THREE.BufferGeometryUtils.mergeBufferGeometries(geoms);
var instGeom = new THREE.InstancedBufferGeometry().copy(fullGeom);

var num = 500;
let instPos = [];
let instSpeed = [];
let instLight = [];
for (let i = 0; i < num; i++) {
    instPos.push(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5);
    instSpeed.push(Math.random() * 0.25 + 1);
    instLight.push(Math.PI + (Math.PI * Math.random()), Math.random() + 5);
}
instGeom.setAttribute("instPos", new THREE.InstancedBufferAttribute(new Float32Array(instPos), 3));
instGeom.setAttribute("instSpeed", new THREE.InstancedBufferAttribute(new Float32Array(instSpeed), 1));
instGeom.setAttribute("instLight", new THREE.InstancedBufferAttribute(new Float32Array(instLight), 2));

var mat = new THREE.ShaderMaterial({
    uniforms: {
        uTime: { value: 0 },
        uLight: { value: new THREE.Color("red").multiplyScalar(1.5) },
        uColor: { value: new THREE.Color("gold").multiplyScalar(1) },
        uFire: { value: new THREE.Color(255, 223, 0) }
    },
    vertexShader: `
        uniform float uTime;

        attribute vec3 instPos;
        attribute float instSpeed;
        attribute vec2 instLight;

        varying vec2 vInstLight;
        varying float vY;

        void main() {
            vInstLight = instLight;
            vY = position.y;

            vec3 pos = vec3(position) * 2.;
            vec3 iPos = instPos * 200.;

            iPos.xz += vec2(
                cos(instLight.x + instLight.y * uTime),
                sin(instLight.x + instLight.y * uTime * fract(sin(instLight.x)))
            );

            iPos.y = mod(iPos.y + 100. + (uTime * instSpeed), 200.) - 100.;
            pos += iPos;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos,1.0);
        }
    `,
    fragmentShader: `
        uniform float uTime;
        uniform vec3 uLight;
        uniform vec3 uColor;
        uniform vec3 uFire;

        varying vec2 vInstLight;
        varying float vY;

        void main() {
            vec3 col = vec3(0);
            float t = vInstLight.x + (vInstLight.y * uTime * 10.);
            float ts = sin(t * 3.14) * 0.5 + 0.5;
            float tc = cos(t * 2.7) * 0.5 + 0.5;
            float f = smoothstep(0.12, 0.12 + (ts + tc) * 0.25, vY);
            float li = (0.5 + smoothstep(0., 1., ts * ts + tc * tc) * 0.5);
            col = mix(uLight * li, uColor * (0.75 + li * 0.25), f);

            col = mix(col, uFire, step(vY, 0.05) * (0.75 + li * 0.25));

            gl_FragColor = vec4(col, 1);
        }
    `,
    side: THREE.DoubleSide
});

var lantern = new THREE.Mesh(instGeom, mat);
scene.add(lantern);

let oUs = [];

let loader = new THREE.STLLoader();
loader.load("#", objGeom => {
    console.log(objGeom);

    let baseVector = new THREE.Vector3(40, 0, 0);
    let axis = new THREE.Vector3(0, 1, 0);
    let cPts = [];
    let cSegments = 6;
    let cStep = Math.PI * 2 / cSegments;
    for (let i = 0; i < cSegments; i++) {
        cPts.push(
            new THREE.Vector3().copy(baseVector)
            .applyAxisAngle(axis, cStep * i).setY(THREE.MathUtils.randFloat(-10, 10))
        );
    }
    let curve = new THREE.CatmullRomCurve3(cPts);
    curve.closed = true;

    let numPoints = 511;
    let cPoints = curve.getSpacedPoints(numPoints);
    let cObjects = curve.computeFrenetFrames(numPoints, true);
    let pGeom = new THREE.BufferGeometry().setFromPoints(cPoints);
    let pMat = new THREE.LineBasicMaterial({ color: "yellow" });
    let pathLine = new THREE.Line(pGeom, pMat);

    let data = [];
    cPoints.forEach(v => { data.push(v.x, v.y, v.z); });
    cObjects.binormals.forEach(v => { data.push(v.x, v.y, v.z); });
    cObjects.normals.forEach(v => { data.push(v.x, v.y, v.z); });
    cObjects.tangents.forEach(v => { data.push(v.x, v.y, v.z); });

    let dataArray = new Float32Array(data);

    let tex = new THREE.DataTexture(dataArray, numPoints + 1, 4, THREE.RGBFormat, THREE.FloatType);
    tex.magFilter = THREE.NearestFilter;

    objGeom.center();
    objGeom.rotateX(-Math.PI * 0.5);
    objGeom.scale(0.5, 0.5, 0.5);
    let objBox = new THREE.Box3().setFromBufferAttribute(objGeom.getAttribute("position"));
    let objSize = new THREE.Vector3();
    objBox.getSize(objSize);

    objUniforms = {
        uSpatialTexture: { value: tex },
        uTextureSize: { value: new THREE.Vector2(numPoints + 1, 4) },
        uTime: { value: 0 },
        uLengthRatio: { value: objSize.z / curve.cacheArcLengths[200] },
        uObjSize: { value: objSize }
    }
    oUs.push(objUniforms);

    let objMat = new THREE.MeshBasicMaterial({ color: 0xFF4500, wireframe: true });
    objMat.onBeforeCompile = shader => {
        shader.uniforms.uSpatialTexture = objUniforms.uSpatialTexture;
        shader.uniforms.uTextureSize = objUniforms.uTextureSize;
        shader.uniforms.uTime = objUniforms.uTime;
        shader.uniforms.uLengthRatio = objUniforms.uLengthRatio;
        shader.uniforms.uObjSize = objUniforms.uObjSize;

        shader.vertexShader = `
            uniform sampler2D uSpatialTexture;
            uniform vec2 uTextureSize;
            uniform float uTime;
            uniform float uLengthRatio;
            uniform vec3 uObjSize;

            struct splineData {
                vec3 point;
                vec3 binormal;
                vec3 normal;
            };

            splineData getSplineData(float t){
                float step = 1. / uTextureSize.y;
                float halfStep = step * 0.5;
                splineData sd;
                sd.point    = texture2D(uSpatialTexture, vec2(t, step * 0. + halfStep)).rgb;
                sd.binormal = texture2D(uSpatialTexture, vec2(t, step * 1. + halfStep)).rgb;
                sd.normal   = texture2D(uSpatialTexture, vec2(t, step * 2. + halfStep)).rgb;
                return sd;
            }
        ` + shader.vertexShader;
        shader.vertexShader = shader.vertexShader.replace(
            `#include <begin_vertex>`,
            `#include <begin_vertex>

            vec3 pos = position;

            float wStep = 1. / uTextureSize.x;
            float hWStep = wStep * 0.5;

            float d = pos.z / uObjSize.z;
            float t = fract((uTime * 0.1) + (d * uLengthRatio));
            float numPrev = floor(t / wStep);
            float numNext = numPrev + 1.;
            float tPrev = numPrev * wStep + hWStep;
            float tNext = numNext * wStep + hWStep;
            splineData splinePrev = getSplineData(tPrev);
            splineData splineNext = getSplineData(tNext);

            float f = (t - tPrev) / wStep;
            vec3 P = mix(splinePrev.point, splineNext.point, f);
            vec3 B = mix(splinePrev.binormal, splineNext.binormal, f);
            vec3 N = mix(splinePrev.normal, splineNext.normal, f);

            transformed = P + (N * pos.x) + (B * pos.y);
        `
        );
    }
    let obj = new THREE.Mesh(objGeom, objMat);
    scene.add(obj);
});

var clock = new THREE.Clock();

document.addEventListener("DOMContentLoaded", function () {
    const projectList = document.getElementById("project-list");
    const searchInput = document.getElementById("searchInput");
    const searchButton = document.getElementById("searchButton");

    const projects = [
        { name: "Project Alpha", link: "#alpha" },
        { name: "Project Beta", link: "#beta" },
        { name: "Project Gamma", link: "#gamma" }
    ];

    function renderProjects() {
        projectList.innerHTML = "";
        projects.forEach(project => {
            const projectElement = document.createElement("div");
            projectElement.className = "project";
            projectElement.innerHTML = `<h2>${project.name}</h2><a href="${project.link}">View Project</a>`;
            projectList.appendChild(projectElement);
        });
    }

    function searchProjects(query) {
        const project = projects.find(p => p.name.toLowerCase().includes(query.toLowerCase()));
        if (project) {
            window.location.href = project.link;
        } else {
            alert("Project not found!");
        }
    }

    searchButton.addEventListener("click", function () {
        const query = searchInput.value;
        searchProjects(query);
    });

    renderProjects();
});
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener('resize', onWindowResize, false);

renderer.setAnimationLoop(() => {
    controls.update();
    let t = clock.getElapsedTime();
    mat.uniforms.uTime.value = t;
    oUs.forEach(ou => { ou.uTime.value = t; });
    renderer.render(scene, camera);
});


// adding function search bar to search projects..
function search_project() {
    let input = document.getElementById('searchbar').value
    input = input.toLowerCase();
    let projectLists = document.getElementsByClassName('projects-list');

    for (i = 0; i < projectLists.length; i++) {
        if (!projectLists[i].innerHTML.toLowerCase().includes(input)) {
            projectLists[i].style.display = "none";
        }
        else {
            projectLists[i].style.display = "list-item";
        }
    }
}
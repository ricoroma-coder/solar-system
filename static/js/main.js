import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.js'


let scene = new THREE.Scene()
let isDragging = false
let previousMousePosition = {
    x: 0,
    y: 0
}

document.addEventListener('mousedown', function (event) {
    isDragging = true
    previousMousePosition = {
        x: event.clientX,
        y: event.clientY
    }
})

document.addEventListener('mouseup', function () {
    isDragging = false
})

document.addEventListener('mousemove', function (event) {
    if (!isDragging) return

    let deltaMove = {
        x: event.clientX - previousMousePosition.x,
        y: event.clientY - previousMousePosition.y
    }

    scene.rotation.x += deltaMove.y * 0.005
    scene.rotation.y += deltaMove.x * 0.005
    previousMousePosition = {
        x: event.clientX,
        y: event.clientY
    }
})

document.addEventListener('wheel', function (event) {
    let zoomFactor = 1;
    let zoomDirection = event.deltaY > 0 ? 1 : -1

    camera.position.z += zoomDirection * zoomFactor
    if (camera.position.z < 1)
        camera.position.z = 1

    if (camera.position.z > 67)
        camera.position.z = 67
})

let backgroundGeometry = new THREE.SphereGeometry(100, 32, 32)
let backgroundMaterial = new THREE.MeshBasicMaterial({
    map: new THREE.TextureLoader().load('/static/img/space.jpg'),
    side: THREE.DoubleSide,
})

backgroundMaterial.map.wrapS = THREE.RepeatWrapping
backgroundMaterial.map.wrapT = THREE.RepeatWrapping
backgroundMaterial.map.repeat.set(20, 20)
let background = new THREE.Mesh(backgroundGeometry, backgroundMaterial)
scene.add(background)
background.position.set(32,0,0)

let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.z = 25

let renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

let sunGeometry = new THREE.SphereGeometry(10, 32, 32)
let sunMaterial = new THREE.MeshBasicMaterial({ color: 0xffd700 })
let sun = new THREE.Mesh(sunGeometry, sunMaterial)
scene.add(sun)

let sunTexture = new THREE.TextureLoader().load('/static/img/sun.png')
sunMaterial.map = sunTexture

let planets = []
let planetData = [
    { name: 'Mercury', scale: 0.05, inclination: 7, distance: 10.5935, speed: 0.5, texture: '/static/img/mercury.png' },
    { name: 'Venus', scale: 0.12, inclination: 3.39, distance: 11.0039, speed: 0.35, texture: '/static/img/venus.png' },
    { name: 'Earth', scale: 0.1, inclination: 0, distance: 11.3029, speed: 0.3, texture: '/static/img/earth.png' },
    { name: 'Mars', scale: 0.07, inclination: 1.85, distance: 12.1107, speed: 0.25, texture: '/static/img/mars.png' },
    { name: 'Jupiter', scale: 2, inclination: 1.305, distance: 16.2107, speed: 0.2, texture: '/static/img/jupiter.png' },
    { name: 'Saturn', scale: 1.7, inclination: 2.484, distance: 25.7477, speed: 0.15, texture: '/static/img/saturn.png' },
    { name: 'Uranus', scale: 0.8, inclination: 0.769, distance: 50.8597, speed: 0.1, texture: '/static/img/uranus.png' },
    { name: 'Neptune', scale: 0.75, inclination: 1.769, distance: 62.7997, speed: 0.08, texture: '/static/img/neptune.png' }
]

//let scaleFactors = { // dados reais no comentário, porém planetas menores ficam quase invisiveis
//    Mercury: 0.05,   // 0.05 vezes o diâmetro da Terra
//    Venus: 0.12,     // 0.12 vezes o diâmetro da Terra
//    Earth: 0.1,      // 0.1 Diâmetro da Terra (referência)
//    Mars: 0.07,      // 0.07 vezes o diâmetro da Terra
//    Jupiter: 1,      // 2 vezes o diâmetro da Terra
//    Saturn: 0.65,     // 1.7 vezes o diâmetro da Terra
//    Uranus: 0.3,     // 0.8 vezes o diâmetro da Terra
//    Neptune: 0.25    // 0.75 vezes o diâmetro da Terra
//}

planetData.forEach(function(planetInfo) {
    // Crie uma órbita inclinada
    var orbitGeometry = new THREE.CircleGeometry(planetInfo.distance, 128);
    var orbitMaterial = new THREE.LineBasicMaterial({ color: 0xffffff, opacity: 0.3, transparent: true });

    // Ajuste a inclinação da órbita
    var inclinationMatrix = new THREE.Matrix4().makeRotationX(THREE.MathUtils.degToRad(planetInfo.inclination));
    orbitGeometry.applyMatrix4(inclinationMatrix);

//    var orbit = new THREE.Line(orbitGeometry, orbitMaterial);
//    scene.add(orbit);

    // Crie um planeta
    var planetGeometry = new THREE.SphereGeometry(planetInfo.scale, 32, 32);
    var planetTexture = new THREE.TextureLoader().load(planetInfo.texture);
    var planetMaterial = new THREE.MeshBasicMaterial({ map: planetTexture });
    var planet = new THREE.Mesh(planetGeometry, planetMaterial);

    planet.distance = planetInfo.distance;
    planet.speed = planetInfo.speed;

    // Ajuste a posição do planeta na órbita
    planet.position.x = planetInfo.distance * Math.cos(THREE.MathUtils.degToRad(planetInfo.inclination));
    planet.position.y = planetInfo.distance * Math.sin(THREE.MathUtils.degToRad(planetInfo.inclination));

    scene.add(planet);
//    let planetGeometry = new THREE.SphereGeometry(scaleFactors[`${planetInfo.name}`], 32, 32)
//    let planetTexture = new THREE.TextureLoader().load(planetInfo.texture)
//    let planetMaterial = new THREE.MeshBasicMaterial({ map: planetTexture })
//    let planet = new THREE.Mesh(planetGeometry, planetMaterial)
//
//    planet.distance = planetInfo.distance
//    planet.speed = planetInfo.speed
//    scene.add(planet)

    if (planetInfo.name == 'Saturn') {
        let ringGeometry = new THREE.RingGeometry(3.3, 2, 32)
        let ringMaterial = new THREE.MeshBasicMaterial({ color: 0xbbbbbb, side: THREE.DoubleSide })
        let ring = new THREE.Mesh(ringGeometry, ringMaterial)
        planet.add(ring)
        ring.rotation.x = Math.PI / 2
    }

    if (planetInfo.name === 'Uranus') {
        let ringGeometry = new THREE.RingGeometry(1, 0.9, 32)
        let ringMaterial = new THREE.MeshBasicMaterial({ color: 0xbbbbbb, side: THREE.DoubleSide })
        let ring = new THREE.Mesh(ringGeometry, ringMaterial)

        ring.rotation.z = Math.PI / 8
        planet.add(ring)
    }

    planets.push(planet)
})

camera.lookAt(scene.position)

function animate() {
    requestAnimationFrame(animate)

    planets.forEach(function(planet) {
        planet.position.x = planet.distance * Math.sin(Date.now() * 0.001 * planet.speed)
        planet.position.z = planet.distance * Math.cos(Date.now() * 0.001 * planet.speed)
    })

    renderer.render(scene, camera)
}

window.addEventListener('resize', function() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
})

animate()
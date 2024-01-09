import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.js'


let scene = new THREE.Scene()

let backgroundGeometry = new THREE.PlaneGeometry(100, 100, 100)
let backgroundMaterial = new THREE.MeshBasicMaterial({
    map: new THREE.TextureLoader().load('/static/img/space.jpg'),
    side: THREE.DoubleSide,
})

backgroundMaterial.map.wrapS = THREE.RepeatWrapping
backgroundMaterial.map.wrapT = THREE.RepeatWrapping
backgroundMaterial.map.repeat.set(10, 10)
let background = new THREE.Mesh(backgroundGeometry, backgroundMaterial)
background.position.z = -10
scene.add(background)

let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.z = 10
camera.position.y = 2

let renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

let sunGeometry = new THREE.SphereGeometry(2.5, 32, 32)
let sunMaterial = new THREE.MeshBasicMaterial({ color: 0xffd700 })
let sun = new THREE.Mesh(sunGeometry, sunMaterial)
scene.add(sun)

let sunTexture = new THREE.TextureLoader().load('/static/img/sun.png')
sunMaterial.map = sunTexture

let planets = []
let planetData = [
    { name: 'Mercury', distance: 2.6, speed: 0.5, texture: '/static/img/mercury.png' },
    { name: 'Venus', distance: 3, speed: 0.35, texture: '/static/img/venus.png' },
    { name: 'Earth', distance: 3.5, speed: 0.3, texture: '/static/img/earth.png' },
    { name: 'Mars', distance: 4.3, speed: 0.25, texture: '/static/img/mars.png' },
    { name: 'Jupiter', distance: 5.5, speed: 0.2, texture: '/static/img/jupiter.png' },
    { name: 'Saturn', distance: 8, speed: 0.15, texture: '/static/img/saturn.png' },
    { name: 'Uranus', distance: 10, speed: 0.1, texture: '/static/img/uranus.png' },
    { name: 'Neptune', distance: 12, speed: 0.08, texture: '/static/img/neptune.png' }
]

let scaleFactors = { // dados reais no comentário, porém planetas menores ficam quase invisiveis
    Mercury: 0.05,   // 0.05 vezes o diâmetro da Terra
    Venus: 0.12,     // 0.12 vezes o diâmetro da Terra
    Earth: 0.1,      // 0.1 Diâmetro da Terra (referência)
    Mars: 0.07,      // 0.07 vezes o diâmetro da Terra
    Jupiter: 1,      // 2 vezes o diâmetro da Terra
    Saturn: 0.8,     // 1.7 vezes o diâmetro da Terra
    Uranus: 0.3,     // 0.8 vezes o diâmetro da Terra
    Neptune: 0.25    // 0.75 vezes o diâmetro da Terra
}

planetData.forEach(function(planetInfo) {
    let planetGeometry = new THREE.SphereGeometry(scaleFactors[`${planetInfo.name}`], 32, 32)
    let planetTexture = new THREE.TextureLoader().load(planetInfo.texture)
    let planetMaterial = new THREE.MeshBasicMaterial({ map: planetTexture })
    let planet = new THREE.Mesh(planetGeometry, planetMaterial)

    planet.distance = planetInfo.distance
    planet.speed = planetInfo.speed
    scene.add(planet)

    if (planetInfo.name == 'Saturn') {
        let ringGeometry = new THREE.RingGeometry(1.5, 1, 32)
        let ringMaterial = new THREE.MeshBasicMaterial({ color: 0xbbbbbb, side: THREE.DoubleSide })
        let ring = new THREE.Mesh(ringGeometry, ringMaterial)
        planet.add(ring)
        ring.rotation.x = Math.PI / 2
    }

    if (planetInfo.name === 'Uranus') {
        let ringGeometry = new THREE.RingGeometry(0.35, 0.33, 32)
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
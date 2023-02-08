function animation(data) {

    let rotationPeriodScale = {value: .001};// 1 - real, 365 times/year (if orbitPeriodScale = 1)
    let orbitPeriodScale = {orbit_SPEED: 1};

    const gui = new dat.GUI();
    const cameraFolder = gui.addFolder('Rotation');
    cameraFolder.add(rotationPeriodScale, 'value', 0.0001, 1);
    cameraFolder.add(orbitPeriodScale, 'orbit_SPEED', 0.01, 50);
    cameraFolder.open();

    render();


    function render() {

        // planets self rotate
        data.Earth.mesh.rotateY(rotationPeriodScale.value / data.Earth.rotationPeriod);
        data.Mercury.mesh.rotateY(rotationPeriodScale.value / data.Mercury.rotationPeriod);
        data.Venus.mesh.rotateY(rotationPeriodScale.value / data.Venus.rotationPeriod);
        data.Mars.mesh.rotateY(rotationPeriodScale.value / data.Mars.rotationPeriod);
        data.Jupiter.mesh.rotateY(rotationPeriodScale.value / data.Jupiter.rotationPeriod);
        data.Saturn.mesh.rotateY(rotationPeriodScale.value / data.Saturn.rotationPeriod);
        data.Uranus.mesh.rotateY(rotationPeriodScale.value / data.Uranus.rotationPeriod);
        data.Neptune.mesh.rotateY(rotationPeriodScale.value / data.Neptune.rotationPeriod);
        data.Pluto.mesh.rotateY(rotationPeriodScale.value / data.Pluto.rotationPeriod);
        // data.Sun.rotation.y += rotationPeriodScale.value / 2500;

        //planets rotate around the Sun
        function movePlanet(bodyName) {
            let t = bodyName.time;
            t += 1 / (bodyName.orbitPeriod / orbitPeriodScale.orbit_SPEED);
            if (t >= 1) t = 0;
            bodyName.mesh.position.x = bodyName.orbitPath.getPoint(t).x;
            bodyName.mesh.position.z = -bodyName.orbitPath.getPoint(t).y;
            // bodyName.mesh.position.y = 0;

            bodyName.time = t;
        }

        console.log(`x of planet = ${data.Saturn.mesh.position.x}`)
        console.log(`y of planet = ${data.Saturn.mesh.position.y}`)
        console.log(`z of planet = ${data.Saturn.mesh.position.z}`)

        movePlanet(data.Mercury)
        movePlanet(data.Venus)
        movePlanet(data.Earth)
        movePlanet(data.Mars)
        movePlanet(data.Jupiter)
        movePlanet(data.Saturn)
        movePlanet(data.Uranus)
        movePlanet(data.Neptune)
        movePlanet(data.Pluto)


        // moons
        function moveMoon(moon, parent) {
            moon.obj.position.x = parent.mesh.position.x;
            // moon.obj.position.y = parent.mesh.position.y;
            // moon.obj.position.y = 0;
            moon.obj.position.z = parent.mesh.position.z;
            // moon.mesh.position.y = 0;
            moon.obj.rotateY(0.2 / moon.period);
        }

        // console.log(data.Saturn.mesh.position.x, data.Saturn.mesh.position.y, data.Saturn.mesh.position.z)
        // console.log(data.Saturn.obj.position.x, data.Saturn.obj.position.y, data.Saturn.obj.position.z)
        // console.log(data.Titan.mesh.position.x, data.Titan.mesh.position.y, data.Titan.mesh.position.z)
        // console.log(data.Titan.obj.position.x, data.Titan.obj.position.y, data.Titan.obj.position.z)
        moveMoon(data.Moon, data.Earth);
        moveMoon(data.Ganymede, data.Jupiter);
        moveMoon(data.Callisto, data.Jupiter);
        moveMoon(data.Io, data.Jupiter);
        moveMoon(data.Europa, data.Jupiter);
        moveMoon(data.Dione, data.Saturn);
        moveMoon(data.Titan, data.Saturn);
        moveMoon(data.Rhea, data.Saturn);
        moveMoon(data.Iapetus, data.Saturn);
        moveMoon(data.Titania, data.Uranus);
        moveMoon(data.Oberon, data.Uranus);
        moveMoon(data.Umbriel, data.Uranus);
        moveMoon(data.Ariel, data.Uranus);
        moveMoon(data.Triton, data.Neptune);
        moveMoon(data.Charon, data.Pluto);
        //moons


        // camera.lookAt(data.Saturn.mesh.position);
        // camera.position.x = data.Saturn.mesh.position.x;
        // camera.position.z = data.Saturn.mesh.position.z + 2500;


        requestAnimationFrame(render);
        renderer.render(scene, camera);
    }
}



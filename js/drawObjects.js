function drawObjects(data) {

    const objects = {};
    let scale = 1;
    let planetRadiusScale = .01;    // 1 - real radius in km  .005
    let orbitRadiusScale = 1500;    // 149 000 000 - real radius in km. Database in AU, 1AU = 149 000 000 km
    let sunRadius = 200;            // 200 is not real scale, just for animation, real is 1009.3
    let sizeSkySphere = 1000000;    // radius of Sky sphere box


// Add sky sphere
    function drawSky() {
        var skyGeometry = new THREE.SphereGeometry(scale * sizeSkySphere, 32, 32);
        var skyMaterial = new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load('res/sky/stars.jpg')});
        var sky = new THREE.Mesh(skyGeometry, skyMaterial);
        sky.material.side = THREE.BackSide;
        scene.add(sky);
    }
    drawSky();

// Create a Sun
    function drawSun(customMaterial) {
        const light = new THREE.PointLight(0xffffff, 1);
        light.position.set(0, 0, 0);                    // Set the position of the light to simulate the sun's position
        scene.add(light);                                       // Add the light to the scene

        // // Create a sphere to represent the sun
        const sunGeometry = new THREE.SphereGeometry(sunRadius, 64, 64); // у 100 разів менше від реального
        const sunMaterial = new THREE.MeshStandardMaterial({
            emissive: 0xffd700,
            emissiveMap: new THREE.TextureLoader().load('res/sun/diffuse.jpg'),
            emissiveIntensity: 1
        });

        const sun = new THREE.Mesh(sunGeometry, sunMaterial);   // Set the position of the sphere to match the light
        sun.position.copy(light.position);                      // Add the sphere to the scene
        scene.add(sun);
        return sun;
    }
    objects["Sun"] = drawSun();


// Create planets, moons, and orbits
    function drawPlanets(solarBodies) {
        let data = solarBodies.filter(item => (item.parent === "Sun" && item.name !== "Sun"));

        data.forEach(body => {
            const geo = new THREE.SphereGeometry(body.radius * planetRadiusScale, 64, 64);
            const mat = new THREE.MeshPhongMaterial({
                map: new THREE.TextureLoader().load(body.material.diffuse.map),
            })
            const mesh = new THREE.Mesh(geo, mat);
            const obj = new THREE.Object3D();
            obj.add(mesh);
            scene.add(obj);

            let semiMajor = body.orbit.semiMajorAxis * orbitRadiusScale;
            const a = semiMajor * (1 + (body.orbit.eccentricity))
            const p = semiMajor * (1 - (body.orbit.eccentricity))
            const ax = (a - p) / 2;
            mesh.position.x = (body.orbit.semiMajorAxis * orbitRadiusScale) + ax;

            // set planet inclination of rotation
            mesh.rotation.z = body.rotation.inclination * (Math.PI / 180);

            // set planet inclination of orbit
            obj.rotation.x = body.orbit.inclination * (Math.PI / 180);

            // add rings
            if (body.name === "Saturn") {
                const ringGeometry = new THREE.RingGeometry(
                    body.ring.lower * planetRadiusScale,
                    body.ring.higher * planetRadiusScale,
                    128);

                const ringMaterial = new THREE.MeshLambertMaterial({
                    map: new THREE.TextureLoader().load(body.ring.map),
                    side: THREE.DoubleSide,
                    transparent: true,
                    color: 0xffffff,
                })
                const ringMesh = new THREE.Mesh(ringGeometry, ringMaterial);
                mesh.add(ringMesh);
                ringMesh.rotation.x = -0.5 * Math.PI;
            }

            // draw orbits
            const orbitPath = createOrbit(body);

            // add data to objects
            const orbitPeriod = body.orbit.period;
            const rotationPeriod = body.rotation.period;
            let time = 0;                                   // for count current position
            let rotationInclination = body.rotation.inclination;
            let planetRadius  = body.radius;
            objects[`${body.name}`] = {mesh, obj, orbitPeriod, rotationPeriod, orbitPath, time, rotationInclination, planetRadius};
        })
    }
    drawPlanets(solarBodies);


    // create the elliptical curve/orbits
    function createOrbit(body) {

        let semiMajor = body.orbit.semiMajorAxis * orbitRadiusScale;
            let semiMinor = semiMajor * Math.sqrt(1 - Math.pow(body.orbit.eccentricity, 2));
            const a = semiMajor * (1 + (body.orbit.eccentricity))
            const p = semiMajor * (1 - (body.orbit.eccentricity))
            const ax = (a - p) / 2;

        var curve = new THREE.EllipseCurve(ax, 0, semiMajor, semiMinor, 0, 2 * Math.PI, false, 0);

        // create the path from the curve
        var path = new THREE.Path( curve.getPoints( 100 ) );
        var geometry = path.createPointsGeometry( 100 );
        var material = new THREE.LineBasicMaterial({
            color : 0x74a0ae,
            // color : getRandomColor(),
            transparent: true,
            opacity:.5
        });

        // create the ellipse/orbit shape
        var ellipse = new THREE.Line( geometry, material );
        ellipse.position.set(0, 0, 0);
        ellipse.rotation.x = -0.5 * Math.PI + body.orbit.inclination * (Math.PI / 180);

        // add the ellipse/orbit to the scene
        scene.add( ellipse );

        return path
    }

// moons
    function drawMoons() {
        let data = solarBodies.filter(item => item.type === "moon");

        data.forEach(body => {
            const parent = objects[`${body.parent}`];

            const geo = new THREE.SphereGeometry(body.radius * planetRadiusScale, 32, 32);
            const mat = new THREE.MeshPhongMaterial({
                map: new THREE.TextureLoader().load(body.material.diffuse.map)
            });
            const mesh = new THREE.Mesh(geo, mat);

            const obj = new THREE.Object3D();
            obj.position = parent.mesh.position;

            obj.add(mesh);
            scene.add(obj);
            mesh.position.x = body.orbit.semiMajorAxis;

            const period = body.orbit.period;
            objects[`${body.name}`] = { mesh, obj, parent, period};
        });
    }

    drawMoons();

    function getRandomColor() {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) color += letters[Math.floor(Math.random() * 16)];
        return color;
    }
    return objects;
}


function control() {

    // Add mouse and scroll event listeners to change camera position
    let isMouseDown = false;
// listeners
    window.addEventListener('resize', function () {
        // Update the camera's aspect ratio
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
    canvas.addEventListener('mousedown', onMouseDown);
    canvas.addEventListener('mousemove', onMouseMove, false);
    canvas.addEventListener('mouseup', () => {
        isMouseDown = false;
    });
    canvas.addEventListener('mousewheel', onMouseWheel);
    canvas.addEventListener('keypress', onKeyPress);
    let previousMouseX;
    let previousMouseY;
    let cameraRotationX = 0;
    let cameraRotationY = 0;
    let isRunning = true;                                   // Space to stop/start animation
    let earthRotationSpeed = .01;


    // onMouseDown
    function onMouseDown(event) {
        previousMouseX = event.clientX;
        previousMouseY = event.clientY;
        isMouseDown = true;
    }

    // onMouseMove
    function onMouseMove(event) {
        if (isMouseDown) {
            let deltaX = event.clientX - previousMouseX;
            let deltaY = event.clientY - previousMouseY;
            cameraRotationY += deltaX * 0.01;
            cameraRotationX -= deltaY * 0.01;
            // update
            updateCameraPosition();

            previousMouseX = event.clientX;
            previousMouseY = event.clientY;
        }
    }

    // zoom on/off
    function onMouseWheel(event) {
        let delta = event.deltaY;
        if (delta < 0) {
            cameraDistance = Math.max(cameraDistance - Math.pow(cameraDistance, 0.5), 15);
        } else if (delta > 0) {
            cameraDistance = Math.min(cameraDistance + Math.pow(cameraDistance, 0.5), 120000);
        }
        updateCameraPosition();
    }


    function updateCameraPosition() {
        camera.position.x = (cameraDistance * Math.sin(cameraRotationY) * Math.cos(cameraRotationX));
        camera.position.y = cameraDistance * Math.sin(cameraRotationX);
        camera.position.z = cameraDistance * Math.cos(cameraRotationY) * Math.cos(cameraRotationX);
        camera.lookAt(0, 0, 0);
    }

// stop/start animation
    function onKeyPress(e) {
        if (e.code === 'Space') {
            if (isRunning) {
                earthRotationSpeed = 0
                // pause rendering

                isRunning = false;
            } else {
                earthRotationSpeed = 0.10;
                // run rendering
                isRunning = true;
            }
        }
    }

}


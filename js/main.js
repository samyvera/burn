window.onload = () => {

    var mouse = null;

    var app = new App();

    document.addEventListener("mousemove", event => {
        mouse = new Vector2D(event.clientX, event.clientY);
    });

    document.addEventListener("mouseout", event => {
        mouse = null;
    });

    document.body.addEventListener('wheel', event => {
        app.flame.spread += (event.wheelDelta ? event.wheelDelta > 0 : event.deltaY < 0) ? 8 : app.flame.spread ? -8 : 0;
    });

    var display = new Display();

    var frame = () => {
        app.update(mouse);
        display.update(app);
        requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
}
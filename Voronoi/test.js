let points = [
    new Point(146,180.125),
    new Point(235,200.125),
    new Point(215,68.125),
    new Point(152,110.125),
    new Point(192,110.125),
    new Point(160,30.125),
    new Point(140,86.125)
];

let vor, gr, _svg_; 


$(document).ready(function () {
	_svg_ = document.getElementById("voronoi_svg");

    vor = new VoronoiDiagram(points, _svg_.width.baseVal.value, _svg_.height.baseVal.value);    
    gr = new SVG_Graphics(_svg_);
    vor.update();

    gr.draw(points,vor.voronoi_vertex,vor.edges);
});


$("#reset-btn").on("click", function () {
    vor.point_list = [];
    points = [];
    _svg_.textContent = '';

});

$("svg").on("click", function (event) {
    let x = event.pageX - $(this).offset().left;
    let y = event.pageY - $(this).offset().top;

    /* Add point */
    let add = true;
    for(const p of points){
        let d = Math.sqrt((x-p.x)**2+(y-p.y)**2);
        if(d<3) add = false;
    }
    if(add)points.push(new Point(x, y));
    vor.point_list = points;


    let t0 = performance.now();

    vor.update();

    let t1 = performance.now();

    gr.draw(points,vor.voronoi_vertex,vor.edges);

    $("#timer p").text((t1 - t0).toFixed(2) + " ms");

});



let points = [
    new Point(91,168.125),
    new Point(255,228.125),
    new Point(412,225.125),
    // new Point(171,116.125),
    // new Point(389,98.125),
    // new Point(356,196.125),
    // new Point(370,256.125)
];

let vor, gr, _svg_; 


$(document).ready(function () {
	_svg_ = $("svg");
    
    gr = new SVG_Graphics(_svg_);
    vor = new VoronoiDiagram(points);
    vor.update();

    draw();
});


$("#reset-btn").on("click", function () {
    vor.point_list = [];
    points = [];
    _svg_.empty();

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
    
    draw();

    $("#timer p").text((t1 - t0).toFixed(2) + " ms");

});

function draw(){
    _svg_.empty();
    gr.draw_points(vor.voronoi_vertex, "vertex_svg");
    gr.draw_points(points,"point_svg");
    gr.draw_lines(vor.edges);
}

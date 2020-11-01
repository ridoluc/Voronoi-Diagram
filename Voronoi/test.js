let points = [
    new Point(464,166.125),
    new Point(395,52.125),
    new Point(345,183.125),
    new Point(220,165.125),
    new Point(277,83.125),
    new Point(127,242.125),
    new Point(370,256.125)
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
    points.push(new Point(x, y));
    vor.point_list = points;
    vor.update();
    draw();
});

function draw(){
    _svg_.empty();
    gr.draw_points(vor.voronoi_vertex, "vertex_svg");
    gr.draw_points(points,"point_svg");
    gr.draw_lines(vor.edges);
}

let points = [
    new Point(151,60.125),
    new Point(359,85.125),
    new Point(316,183.125)
];


$(document).ready(function () {
	_svg_ = $("svg");
    
    gr = new SVG_Graphics(_svg_);
    gr.draw_points(points,"point_svg");

    vor = new VoronoiDiagram(points);
    vor.update();
    let edges = vor.edges;
    // gr.draw_lines(edges);
    gr.draw_points(vor.voronoi_vertex, "vertex_svg");

});
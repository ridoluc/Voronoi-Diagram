let points = [
    new Point(146,180.125),
    new Point(235,200.125),
    new Point(215,68.125),
    new Point(152,110.125),
    new Point(192,110.125),
    new Point(160,30.125),
    new Point(140,86.125),
    new Point(450,200.125)

];

let vor, gr, _svg_; 
let moving_point 

(function () {
	_svg_ = document.getElementById("voronoi_svg");

    vor = new VoronoiDiagram(points, _svg_.width.baseVal.value, _svg_.height.baseVal.value);    
    gr = new SVG_Graphics(_svg_);
    vor.update();

    gr.draw(points,vor.voronoi_vertex,vor.edges);

    document.getElementById("voronoi_svg").onclick = addPoint;
    document.getElementById("voronoi_svg").onmousemove = update;
	document.getElementById("reset-btn").onclick = reset;
	document.getElementById("generate-btn").onclick = generate;
})();


function reset() {
    vor.point_list = [];
    points = [];
    _svg_.textContent = '';

};

function addPoint(event) {
    let x = event.offsetX;
    let y = event.offsetY;

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

    document.getElementById("timer").innerText= (t1 - t0).toFixed(2) + " ms";

};

function update(event) {
    let x = event.offsetX;
    let y = event.offsetY;

    if(moving_point === points[points.length-1])points.pop(); 

    /* Add point */
    let add = true;
    for(const p of points){
        let d = Math.sqrt((x-p.x)**2+(y-p.y)**2);
        if(d<3) add = false;
    }
    if(add){
        moving_point = new Point(x, y)
        points.push(moving_point);
    }
    vor.point_list = points;


    let t0 = performance.now();

    vor.update();

    let t1 = performance.now();

    gr.draw(points,vor.voronoi_vertex,vor.edges);

    document.getElementById("timer").innerText = (t1 - t0).toFixed(2) + " ms";


};


function generate() {
	let N = parseInt(document.getElementById("generate-text").value);
    points= generatePoints(N);
    vor.point_list = points;
    let t0 = performance.now();
    vor.update();
    let t1 = performance.now();

    gr.draw(vor.point_list,vor.voronoi_vertex,vor.edges);
    document.getElementById("timer").innerText = (t1 - t0).toFixed(2) + " ms";

    
}

function generatePoints(N) {
	let W = _svg_.width.baseVal.value * 0.99;
	let H = _svg_.height.baseVal.value * 0.99;

	let points = [];
	for (i = 0; i < N; i++) {
		var pt = new Point(Math.random() * W, Math.random() * H, 2);
		var good = true;
		for (const p of points) {
			let dist = Math.sqrt((pt.x - p.x) ** 2 + (pt.y - p.y) ** 2);
			if (dist < 3) {
				good = false;
				break;
			}
		}
		good ? points.push(pt) : i--;
	}

	return points;
}
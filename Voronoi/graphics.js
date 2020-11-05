class SVG_Graphics {
	constructor(svg_context) {
		this._svg_ = svg_context;

		this.point_style = {};
		this.line_style = {};
		this.vertex_style = {
			"stroke": "black",
			"stroke-width": "0.2",
			"fill": "transparent",
		};
	}


	draw_points(points, cl) {

        let r = 2;
        let txt = "";

		for (const p of points) {
			txt += "<circle cx=" + p.x + " cy=" + p.y +" r=" + r +"></circle>";
        }


        let point_group = document.createElementNS(
			"http://www.w3.org/2000/svg",
			"g"
		);
		point_group.setAttribute("class", cl);
		point_group.innerHTML = txt;
		this._svg_[0].appendChild(point_group);

	}

	draw_lines(edges) {

		let linesSVG = "";

		for (const e of edges) {
            if(e && e.end && e.start){
			linesSVG += "<line x1=" + e.end.x + " y1=" +e.end.y +" x2=" + e.start.x + " y2=" +e.start.y+"></line>";}
		}

		let line_group = document.createElementNS(
			"http://www.w3.org/2000/svg",
			"g"
		);
		line_group.setAttribute("class", "segment_svg");
		line_group.innerHTML = linesSVG;
		this._svg_[0].appendChild(line_group);
	
	}
}

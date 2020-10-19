class VoronoiDiagram {
	constructor(svg_context, debug = false) {
		this.beach_line = new BTStruct(Parabola.minor, Parabola.equal);
		this.line_list = [];
		this.point_list = [];
		this.event_list = new BTStruct(VoronoiEvent.minor, VoronoiEvent.equal);
		this._svg_;
		this.debug = debug;
		this.d = 0;
		this.svgHeight;

		this._svg_ = svg_context;
		this.svgHeight = this._svg_.height();
		this.svgWidth = this._svg_.width();
		this.svg_context_attach_events();

		//Setting the SVG context
		Parabola.svg_context = _svg_;
		Parabola.svgWidth = this.svgWidth;
		Segment.svg_context = this._svg_;

		if (this.debug) this.addDirectrix();
	}

	set_points(points) {
		this.point_list = points;
	}

	/* =================================== */
	/* ------- EXECUTE POINT EVENT ------- */
	/* =================================== */

	/*
  Point event is when the sweep line reaches a new point and a new parable needs to be added in the beach line
  - A new parabola object is created
  - Find where this should be located in the beach line and which existing parabola is directly above
  - if the old parabola exists split it in two, add two segmentws whe the split occurred, add two circle events

*/

	pointEvent(x, y) {
		let new_par = new Parabola(this.beach_line.latestID, x, y, y);
		let search = this.beach_line.find(new_par); //array with parabola found and position in the list
		let old_par = search[0];

		if (old_par) {
			let edge_r = old_par.edge_right;

			old_par.edge_right = x;
			let par_r = old_par.copy(2, x, edge_r);

			if (this.debug) par_r.appendToSVG();
			this.beach_line.add(par_r);

			//Set left and right parabolas
			new_par.parab.left = old_par;
			old_par.parab.right
				? (old_par.parab.right.parab.left = par_r)
				: null;
			par_r.parab.right = old_par.parab.right;
			old_par.parab.right = new_par;
			new_par.parab.right = par_r;
			par_r.parab.left = new_par;

			//Create the two new segments
			let segment_start_y = old_par.calcF(x);
			this.addLine(new_par, x, segment_start_y);
			this.addLine(par_r, x, segment_start_y);

			this.addCircleEvent(par_r, y);
			if (old_par.circle_event) old_par.circle_event.valid = false;
			this.addCircleEvent(old_par, y);
		} else if (search[1] > 0) {
			// Adding a parabola on the right

			//Set left and right parabolas
			new_par.parab.left = this.beach_line.last;
			new_par.parab.left.parab.right = new_par;

			let segment_start_y = new_par.parab.left.calcF(x);

			this.addLine(new_par, x, segment_start_y);
		} else if (this.beach_line._list.length > 0 && search[1] == 0) {
			// Adding a parabola on the left of the first one and checking it's not the first one

			//Set left and right parabolas
			new_par.parab.right = this.beach_line._list[0];
			new_par.parab.right.parab.left = new_par;

			let segment_start_y = this.beach_line._list[0].calcF(x);
			this.addLine(this.beach_line._list[0], x, segment_start_y);
		}

		//Add the new parabola

		this.beach_line.add(new_par);
		// Add circle event
		//addCircleEvent(new_par);

		return new_par;
	}

	/* ==================================== */
	/* ------- EXECUTE CIRCLE EVENT ------- */
	/* ==================================== */

	/*
    A circle event is when a parabola shrinks to 0 squeezed between two and needs to be removed.
    the event takes place when the sweep line is tangent to a cirle defined by three points
  
  */

	circleEvent(ev) {
		let par_deleting = ev.element.par2;
		if (this.debug) par_deleting.removeFromSVG();
		//console.log((par_deleting.segment.left && par_deleting.segment.right) ? true:false)

		//Unlink the segment
		if (par_deleting.segment.left) {
			par_deleting.segment.left.unlink(ev.element.cx, ev.element.cy);
		}
		if (par_deleting.segment.right) {
			par_deleting.segment.right.unlink(ev.element.cx, ev.element.cy);
		}

		// to adjust linked parabolas
		par_deleting.remove();

		//if (ev.element.par2.parab.left.circle_event) ev.element.par2.parab.left.valid = false;
		this.addCircleEvent(ev.element.par2.parab.left, ev.position);
		//if (ev.element.par2.parab.right.circle_event) ev.element.par2.parab.right.circle_event.valid = false;
		this.addCircleEvent(ev.element.par2.parab.right, ev.position);

		this.beach_line.remove(par_deleting);

		this.addLine(ev.element.par2.parab.right, ev.element.cx, ev.element.cy);
	}

	/* ================================ */
	/* ------- ADD CIRCLE EVENT ------- */
	/* ================================ */

	addCircleEvent(arc, dir) {
		//new method
		if (arc.parab.left && arc.parab.right) {
			let a = { x: arc.parab.left.fx, y: arc.parab.left.fy };
			let b = { x: arc.fx, y: arc.fy };
			let c = { x: arc.parab.right.fx, y: arc.parab.right.fy };

			if ((b.x - a.x) * (c.y - a.y) - (c.x - a.x) * (b.y - a.y) > 0) {
				let cir = new Circle(arc);

				// side  right and left is wrong

				if (cir.cy <= this.svgHeight && cir.bottom > dir) {
					let e = new VoronoiEvent("circle", cir.bottom, cir);

					arc.circle_event = e;
					this.event_list.add(e);
				}
			}
		}
	}

	// Add line

	addLine(parabola, x, y) {
		let line = new Segment(parabola, x, y, x, y);

		// Adjust the segments reference in the parabolas
		parabola.segment.left = line;
		parabola.parab.left.segment.right = line;

		if (this.debug) line.appendToSVG();
		this.line_list.push(line);
	}

	/* =========================== */
	/* -------  MAIN LOOP  ------- */
	/* =========================== */

	update(points) {
		/*
      for (i of test_point) {
        let pt = new Point(i.x, i.y, 2);
        point_list.push(pt);
      }
      */
		if (points != null) this.point_list = points;
		//Create the queue

		let txt = "";

		for (const p of this.point_list) {
			//p.appendToSVG(_svg_);
			txt += p.SVGtagText();
			this.event_list.add(new VoronoiEvent("point", p._y, p));
		}

		let point_group = document.createElementNS(
			"http://www.w3.org/2000/svg",
			"g"
		);
		point_group.setAttribute("class", "point_svg");
		point_group.innerHTML = txt;
		this._svg_[0].appendChild(point_group);

		let d = 0;

		while (this.event_list._list.length > 0) {
			//Extract the event
			let e = this.event_list.removeFirst();

			// set dirctrix
			d = e.position;

			// Update Geometry
			for (const elm of this.beach_line._list) {
				elm.updateGeometry(d);
			}

			for (const line of this.line_list) {
				line.updateEnd(); // Update point boundary
			}

			if (e.type == "point") {
				//Execute point event
				this.pointEvent(e.element._x, e.element._y);
			} else if (
				e.type == "circle" &&
				e.valid ==
					true /*&& ((e.element.par2.edge_right - e.element.par2.edge_left) < 0.1)*/
			) {
				this.circleEvent(e);
			}
		}

		// Update Geometry
		for (const elm of this.beach_line) {
			elm[1].updateGeometry(d);
		}

		for (const line of this.line_list) {
			line.updateEnd(); // Update point boundary
		}

		//Complete the segments
		if (d < this.svgHeight) {
			d = this.svgHeight;
			// Update Geometry
			for (const elm of this.beach_line) {
				elm[1].updateGeometry(d);
			}

			for (const line of this.line_list) {
				line.updateEnd(); // Update point boundary
			}
		}

		//graphics

		let linesSVG = "";

		for (const line of this.line_list) {
			if (line.connected) line.interpolateY(this.svgHeight);
			linesSVG += line.SVGtagText(); // add line svg txt tag
		}

		let line_group = document.createElementNS(
			"http://www.w3.org/2000/svg",
			"g"
		);
		line_group.setAttribute("class", "segment_svg");
		line_group.innerHTML = linesSVG;
		this._svg_[0].appendChild(line_group);
	}


    add_point(pt){
        this.point_list.push(pt);

        /* Add parabola */

        if (this.debug) {
            pt.appendToSVG(this._svg_);
            this.pointEvent(pt._x, pt._y).appendToSVG();
        } else {
            this.reset();
            this.update();
        }
    }

	// On click
	svg_context_attach_events(obj = this) {
        // let add_point_func = this.add_point;
		this._svg_.on("click", function (event) {
			let x = event.pageX - $(this).offset().left;
			let y = event.pageY - $(this).offset().top;

			/* Add point */
			var pt = new Point(x, y, 2);
            var t0 = performance.now();

            obj.add_point(pt);

            var t1 = performance.now();
            $("#timer p").text((t1 - t0).toFixed(2) + " ms");
            

		});

		this._svg_.on("mousemove", function (event) {
			//let parentOffset = $(this).parent().offset();
			if (obj.debug) {
				let d = event.pageY - $(this).offset().top;
				$("#directrix").attr("y1", d).attr("y2", d);

				// Check next event
				if (
					obj.event_list._list.length > 0 &&
					obj.event_list._list[0].position <= d
				) {
					let e = obj.event_list.removeFirst();
					if (e.type == "circle" && e.valid == true) {
						obj.circleEvent(e);
					}
				}

				// Update Geometry
				for (const elm of obj.beach_line) {
					//if(elm[1].edge_right >0 && elm[1].edge_left < _svg_.width() ){
					elm[1].updateGeometry(d);
					//}else{ this.beach_line.remove(elm[1]);}
				}
				for (const line of obj.line_list) {
					line.updateEnd(); // Update point boundary
				}

				// Update Graphics
				for (const elm of obj.beach_line) {
					elm[1].updateSVG(elm[0]);
				}
				for (const line of obj.line_list) {
					line.updateSVG(); // Update point boundary
				}
			}
		});
	}

	reset() {
		// this.point_list = [];
		this.beach_line.empty();
		this.line_list = [];
		this.event_list.empty();
		$("#parab-list").empty();
		this._svg_.empty();
		if (this.debug) {
			this.addDirectrix();
		}
		//MainLoop();
	}

	addDirectrix() {
		// Create the directrix
        let obj = this; 
		$(document.createElementNS("http://www.w3.org/2000/svg", "line"))
			.attr({
				y1: 0,
				y2: 0,
				x1: 0,
				x2: obj._svg_.width(),
				stroke: "rgb(200,200,50)",
				"stroke-width": 0.5,
				fill: "transparent",
			})
			.attr("id", "directrix")
			.appendTo(obj._svg_);
	}
}

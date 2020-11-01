class VoronoiDiagram {
	constructor(points) {
		this.point_list = points;
		this.event_list = new SortedQueue();
		this.beachline_root = null;
		this.voronoi_vertex = [];
		this.edges = [];
	}

	update() {
		let points = [];
		for (const p of this.point_list) points.push(new Event("point", p));
		this.event_list.points = points;

		while (this.event_list.length > 0) {
			const e = this.event_list.extract_first();
			if (e.type == "point") this.point_event(e.position);
			else if (e.active) this.circle_event(e);
		}
	}

	// Input: Point
	point_event(p) {
		let q = this.beachline_root;
		if (q == null) this.beachline_root = new Arc(null, null, p, null, null);
		else {
			while (
				q.right != null &&
				this.parabola_intersection(p.y, q.focus, q.right.focus) < p.x
			) {
				q = q.right;
			}

			let e_qp = new Edge(q.focus, p);
			let e_pq = new Edge(p, q.focus);

			let arc_p = new Arc(q, null, p, e_qp, e_pq);
			let arc_qr = new Arc(arc_p, q.right, q.focus, e_pq, q.edge.right);
			arc_p.right = arc_qr;
			q.right = arc_p;
			q.edge.right = e_qp;
			if (q.right) q.right.left = arc_qr;

			// Disable old event
			if (q.event) q.event.active = false;

			// Check edges intersection
			this.add_circle_event(p, q);
			this.add_circle_event(p, arc_qr);

			// this.edges.push(e_qp);
			// this.edges.push(e_pq);
		}
	}

	// Input: Circle Event
	circle_event(e) {
		let arc = e.caller;
		let p = e.position;
		let edge_new = new Edge(arc.left.focus, arc.right.focus);

		// Disable events
		if (arc.left.event) arc.left.event.active = false;
		if (arc.right.event) arc.right.event.active = false;

		// Adjust beachline
		arc.left.edge.right = edge_new;
		arc.right.edge.left = edge_new;
		arc.left.right = arc.right;
		arc.right.left = arc.left;

		this.add_circle_event(p, arc.left);
		this.add_circle_event(p, arc.right);

		this.voronoi_vertex.push(e.vertex);
		this.edges.push(edge_new);
	}

	add_circle_event(p, arc) {
		if (arc.left && arc.right){
			let a = arc.focus;
			let b = arc.left.focus;
			let c = arc.right.focus;

			//Compute sine of angle between focii. if positive then edges intersect  
			if ((b.x - a.x) * (c.y - a.y) - (c.x - a.x) * (b.y - a.y) > 0){
				let new_inters = this.edge_intersection(arc.edge.left, arc.edge.right);
				let circle_radius = Math.sqrt((new_inters.x - arc.focus.x) ** 2 + (new_inters.y - arc.focus.y) ** 2)
				let event_pos = circle_radius + new_inters.y;
				if (event_pos > p.y) {
					let e = new Event(
						"circle",
						new Point(new_inters.x, event_pos),
						arc,
						new_inters
					);
					arc.event = e;
					this.event_list.insert(e);
				}
			}
		}
	}

	// Input: Point
	// Returns the arc it falls on
	find_arc(p) {
		let n = this.beachline_root;
		while (
			n.right != null &&
			this.parabola_intersection(p.y, n.focus, n.right.focus) < p.x
		) {
			n = n.right;
		}
		return n;
	}

	// Input: float, Point, Point
	parabola_intersection(y, f1, f2) {
		let fyDiff = f1.y - f2.y;
		if (fyDiff == 0) return (f1.x + f2.x) / 2;
		let fxDiff = f1.x - f2.x;
		let b1md = f1.y - y; //Difference btw parabola 1 fy and directrix
		let b2md = f2.y - y; //Difference btw parabola 2 fy and directrix
		let h1 = (-f1.x * b2md + f2.x * b1md) / fyDiff;
		let h2 = Math.sqrt(b1md * b2md * (fxDiff ** 2 + fyDiff ** 2)) / fyDiff;

		return h1 + h2; //Returning the left x coord of intersection
	}

	edge_intersection(e1, e2) {
		let mdif = e1.m - e2.m;
		if (mdif == 0) return null;
		let x = (e2.q - e1.q) / mdif;
		let y = e1.m * x + e1.q;
		return new Point(x, y);
	}
}

class Arc {
	constructor(l, r, f, el, er) {
		this.left = l;
		this.right = r;
		this.focus = f; // Point
		this.edge = { left: el, right: er }; // Edge
		this.event = null;
	}
}

class Point {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}
}

class Edge {
	constructor(p1, p2) {
		this.m = -(p1.x - p2.x) / (p1.y - p2.y);
		this.q =
			(0.5 * (p1.x ** 2 - p2.x ** 2 + p1.y ** 2 - p2.y ** 2)) /
			(p1.y - p2.y);
		this.arc = { left: p1, right: p2 };
		this.end1 = null;
		this.end2 = null;
	}
}

class Event {
	constructor(type, position, caller, vertex) {
		this.type = type;
		this.caller = caller;
		this.position = position;
		this.vertex = vertex;
		this.active = true;
	}
}

class SortedQueue {
	constructor(events) {
		this.list = [];
		if (events) this.list = events;
		this.sort();
	}

	get length() {
		return this.list.length;
	}

	extract_first() {
		if (this.list.length > 0) {
			let elm = this.list[0];
			this.list.splice(0, 1);
			return elm;
		}
		return null;
	}

	insert(event) {
		this.list.push(event);
		this.sort();
	}

	set points(events) {
		this.list = events;
		this.sort();
	}

	sort() {
		this.list.sort(function (a, b) {
			let diff = a.position.y - b.position.y;
			if (diff == 0) return a.position.x - b.position.x; // If events are at the same height the one on the left should be first
			return diff;
		});
	}
}

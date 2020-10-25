class VoronoiDiagram {
	constructor(points) {
		this.point_list = points;
		this.beach_line = [];
		this.event_list = [];
	}

	update() {
		for (const p of this.point_list)
			this.event_list.add(new Event("point", p));

		while(this.event_list.length>0) {
            const e = this.event_list.extract_first();
			if (e.type == "point") this.point_event(e.point);
			else this.circle_event(e.parabola);
		}
	}

	point_event(po) {}
    circle_event(pb) {}
    
	add_parabola() {}
	add_event() {}

}

class Parabola {
	constructor(f) {
		this.focus = f;
		this.boundary = { left: f.x, right: f.x }; //Initaly the parabola is a segment pointing upwardstarting from the focus
		this.sibling = { left: null, right: null };
	}

	/* Computes the value of the parabola at X */
	get_y(x, dir) {
		let c1 = (x - this.focus.x) ** 2;
		let c2 = 2 * (this.focus.y - dir);
		let c3 = this.focus.y ** 2 - dir ** 2;
		return (c1 + c3) / c2;
	}

	/* Computes the zeros of the parabola and returns an array with the zero on the left and the one on the right */
	// get_zeros(dir) {
	// 	let zeroL = this.fx - Math.sqrt(dir ** 2 - this.fy ** 2);
	// 	let zeroR = this.fx + Math.sqrt(dir ** 2 - this.fy ** 2);
	// 	return { left: zeroL, right: zeroR };
	// }

	/*Computes intersection points between this and another Parabola and returns an array with two values left and right*/
	compute_intersection(/*Parabola*/ P2, dir) {
		let fyDiff = this.focus.y - P2.focus.y;
		if (fyDiff == 0) return [(this.fx + P2.focus.x) / 2, 0];
		let fxDiff = this.focus.x - P2.focus.x;
		let b1md = this.focus.y - dir; //Difference btw parabola 1 fy and directrix
		let b2md = P2.focus.y - dir; //Difference btw parabola 2 fy and directrix
		let h1 = (-this.focus.x * b2md + P2.focus.x * b1md) / fyDiff;
		let h2 = Math.sqrt(b1md * b2md * (fxDiff ** 2 + fyDiff ** 2)) / fyDiff;

		return [h1 - h2, h1 + h2]; //Returning the two x coord of intersection
	}

	update_boundaries(dir, canvas_width) {
		//  Updates the left and right edges of the parabola

		let zeros = {};
		zeros.left = this.fx - Math.sqrt(dir ** 2 - this.fy ** 2);
		zeros.right = this.fx + Math.sqrt(dir ** 2 - this.fy ** 2);

        /* 
            Update left boundary
            Each parabola updates the right boundary of the sibling on the left
        */
		if (this.sibling.left == null) this.edge_left = Math.max(zeros.left, 0);
		else {
			let interc = this.compute_intersection(this.sibling.left); //x coordinates of the intersection with the parabola on the left

			this.boundary.left = Math.max(0, Math.min(interc[0], canvas_width)); // Left boundary of the parabola
			this.sibling.left.edge_right = this.boundary.left; //Right boundary of the parabola on the left
		}

		// If there is no parabola on the right it means that it's the last parabola
		if (this.sibling.right == null)
			this.boundary.right = Math.min(zeros.right, canvas_width);
	}
}

class Point {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}
}

class Event {
	constructor(type, elm) {
		this.type = type;
		this.point = null;
		this.parabola = null;
        this.type == "point" ? (this.point = elm) : (this.parabola = elm);
	}
}

class SortedQueue{
    constructor(){
        this.list = [];
        
    }
    
    get length(){ return this.list.length}
    
    extract_first(){
        if (this.list.length >0) {
            elm = this.list[0];
            this.list.splice(0,1);
            return elm;
        }
        return null;
    }
    
    add(elm, position){

    }

    find(elm){

    }
}

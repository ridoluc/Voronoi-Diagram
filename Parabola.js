class Parabola {

  constructor(id, focusX, focusY, c) {
    this._ID = id;

    // GEOMETRIC VARIABLES
    this.fx = focusX;   // Focus x
    this.fy = focusY;   // Focus y
    this._d = c;    // Directrix

    this.edge_left = focusX;
    this.edge_right = focusX;

    this.interseption_point = null;
    this.parab = {left : null, right : null};  
    this.segment = {left : null, right : null}; 
    this.circle_event = null


    // GRAPHIC VARIABLES
    this.svg_element = null;
    
    this.style = {
    };
  }


  /*===================================================== */
  /*----------------  GEOMETRIC METHODS  -----------------*/
  /*===================================================== */


  /* Computes the value of the function at X */
  calcF(x) {
    let c1 = (x - this.fx) ** 2;
    let c2 = 2 * (this.fy - this._d);
    let c3 = this.fy ** 2 - this._d ** 2;
    return ((c1 + c3) / c2);
  }

  /* Computes the value of the derivative at X */
  calcFprime(x) {
    return ((x - this.fx) / (this.fy - this._d));
  }

  /* Updates the left and right edges of the parabola */
  computeEdges() {

    let zeros = this.computeZeros();

    if (this.parab.left == null) {
      this.edge_left = Math.max(zeros[0], 0);
    } else {
      let interc = this.computeParabolaInterseption(this.parab.left); //x coordinates of the interseption with the parabola on the left
      this.interseption_point = { x: interc[0], y:this.calcF(interc[0])}; // Coordinates of the interseption to be saved
      this.edge_left = Math.max(/*zeros[0],*/ 0, Math.min(interc[0], Parabola.svgWidth)); // Left boundary of the parabola
      this.parab.left.edge_right = this.edge_left //Right boundary of the parabola on the left
    }

    // If there is no parabola on the right it means that it's the last parabola
    if (this.parab.right == null) {
      this.edge_right = Math.min(zeros[1], Parabola.svgWidth);
    }

  }

  /* Computes the zeros of the parabola and returns an array with the zero on the left and the one on the right */
  computeZeros() {
    let zeroL = this.fx - Math.sqrt(this._d ** 2 - this.fy ** 2);
    let zeroR = this.fx + Math.sqrt(this._d ** 2 - this.fy ** 2);
    return ([zeroL, zeroR]);
  }

  /*Computes the points of interseption between this and another Parabola and returns an array with two values left and right*/
  computeParabolaInterseption(/*Parabola*/P2) {
    let fyDiff = (this.fy - P2.fy);
    if(fyDiff == 0) return ([(this.fx + P2.fx)/2, 0]);
    let fxDiff = (this.fx - P2.fx)
    let b1md = (this.fy - this._d); //Difference btw parabola 1 fy and directrix
    let b2md = (P2.fy - this._d); //Difference btw parabola 2 fy and directrix
    let h1 = (-this.fx * b2md + P2.fx * b1md) / fyDiff;
    let h2 = Math.sqrt(b1md * b2md * (fxDiff ** 2 + fyDiff ** 2)) / fyDiff;

    return ([h1 - h2, h1 + h2]); //Returning the two x coord of interseption
  }

  updateGeometry(d = this._d) {
    this._d = d;
    this.computeEdges();
  }


  copy(id, el, er) {

    let np = new Parabola(this._ID + "-" + id, this.fx, this.fy, this._d);
    np.edge_left = el;
    np.edge_right = er;

    np.segment.right = this.segment.right;

    return (np);

  }

  remove(){

    this.circle_event.valid = false;
    
    //Adjusting linked parabolas
    if(this.parab.left){
      this.parab.left.parab.right = this.parab.right;
      if(this.parab.left.circle_event) this.parab.left.circle_event.valid = false;
    }
    
    if(this.parab.right){
      this.parab.right.parab.left = this.parab.left;
      if(this.parab.right.circle_event)this.parab.right.circle_event.valid = false;
    }


  }

  /*=================================================== */
  /*----------------  GRAPHIC METHODS  -----------------*/
  /*=================================================== */


  /* Computes the value of the function at X */
  pathParameters(x1, x2) {
    if (this._d == this.fy) {
      return ("M " + this.fx + " " + this.fy + " L " + this.fx + " 0"); // to be checked
    } else {
      let controlx = 0.5 * (x1 + x2);
      let y1 = this.calcF(x1)
      let y2 = this.calcF(x2)
      let deriv = this.calcFprime(x1);
      let controly = y1 + deriv * 0.5 * (x2 - x1);

      return ("M " + x1 + " " + y1 + " Q " + controlx + " " + controly + " " + x2 + " " + y2);
    }
  }

  /* Creates an SVG path element */
  toSVG(x1, x2) {
    this.svg_element = $(document.createElementNS("http://www.w3.org/2000/svg", 'path')).attr("d", this.pathParameters(x1, x2)).addClass("parabola_svg")
      .attr(this.style);
    return (this.svg_element);
  }

  /* Creates a new SVG element and append it to the SVG */
  appendToSVG(val) {
    //Parabola.svg_context = val;
    this.svg_element = this.toSVG(this.fx, this.fy).appendTo(Parabola.svg_context);

    $("#parab-list").append($(document.createElement("p")).attr("id", "par" + this._ID));
    this.updateSVG();
  }

  removeFromSVG() {
    this.svg_element.remove();
    $("#parab-list #par" + this._ID).remove();
  }

  /* Updates the SVG element with the new path */
  updateSVG(ind) {
    this.svg_element.attr("d", this.pathParameters(this.edge_left, this.edge_right));

    //Get parabola left and right IDs
    let pl = this.parab.left ? this.parab.left._ID : "n/a";
    let pr = this.parab.right ? this.parab.right._ID : "n/a";

    $("#parab-list #par" + this._ID).text("Parabola ID: " + this._ID + ", domain: [" + Math.round(this.edge_left) + ", " + Math.round(this.edge_right) + "], index: " + ind + " -- L: "+pl+" R: "+ pr);
  }


  /*================================================== */
  /*----------------  STATIC METHODS  -----------------*/
  /*================================================== */

  static equal(pA, pB) {
    if (pA != null && pA.edge_left <= pB.edge_left && pA.edge_right >= pB.edge_right) return true;
    return false;
  }

  static minor(pA, pB) {
    if (pA != null && pA.edge_left < pB.edge_left && pA.edge_right <= pB.edge_right) return true;
    return false;
  }



}




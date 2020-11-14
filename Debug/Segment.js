class Segment {
  constructor(par, x1, y1, x2, y2) {
    // GEOMETRIC VARIABLES
    this._x1 = x1;
    this._y1 = y1;
    this._x2 = x2;
    this._y2 = y2;
    this.parabola = par; //parabola on the right
    this.connected = true;

    // GRAPHIC VARIABLES
    this.svg_element = null;

    this.style = {};
  }



  /*===================================================== */
  /*----------------  GEOMETRIC METHODS  -----------------*/
  /*===================================================== */

  updateEnd(x, y) {
    
    if (this.connected && this.parabola) {
      let point = this.parabola.interseption_point;
      this._x2 = point.x;
      this._y2 = point.y;
    } else if (x != null && y != null) {
      this._x2 = x;
      this._y2 = y;
    }

  }

  //returns x coordinate
  interpolateY(y) {
    if(this._y1 < this._y2){
      this._x2 = this._x1 + (y - this._y1) * (this._x2 - this._x1) / (this._y2 - this._y1);
      this._y2 = y;
    }
  }


  unlink(x, y) {
    this.connected = false;
    this.parabola = null;
    this.updateEnd(x, y)
  }

  intersect(seg){
    let N = (this._x1 - seg._x1)*(seg._y1-seg._y2)-(this._y1-seg._y1)*(seg._x1-seg._x2)
    let D = (this._x1 - this._x2)*(seg._y1-seg._y2)-(this._y1-this._y2)*(seg._x1-seg._x2)

    if(D==0) return false;
    return( N/D > 0 ? true : false);
  }

  /*===================================================== */
  /*----------------  GRAPHIC METHODS  -----------------*/
  /*===================================================== */

  appendToSVG() {
    this.svg_element = this.toSVG().appendTo(Segment.svg_context);
  }

  toSVG() {
    let element = $(document.createElementNS("http://www.w3.org/2000/svg", 'line'))
      .attr({
        x1: this._x1,
        y1: this._y1,
        x2: this._x2,
        y2: this._y2
      })
      .addClass("segment_svg")
      .attr(this.style);

    return (element)
  }

  SVGtagText(){
    let element = "<line x1=" + this._x1 + " y1=" +this._y1 +" x2=" + this._x2 + " y2=" +this._y2+"></line>";

    return (element)
  }
  /* Updates the SVG element with the new end coordinates */
  updateSVG() {
    this.svg_element
      .attr({
        x2: this._x2,
        y2: this._y2
      });
  }
}
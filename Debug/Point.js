class Point{
  constructor(cx, cy, radius){
    this._x = cx;
    this._y = cy;
    this._r = radius;
    this.svg_context= null;
    this.svg_element = null;

    this.style = {};
  }
  
  distanceToPoint(pt){
    return Math.sqrt( (this._x - pt._x)**2 + (this._y - pt._y)**2);
  }

  appendToSVG(val){
    this.svg_context = val;
    this.toSVG().appendTo(this.svg_context);
  }

  toSVG(x, y) {
    let element = $(document.createElementNS("http://www.w3.org/2000/svg",'circle')).attr({
      r:this._r,
      cx:this._x,
      cy:this._y
    })
    .addClass("point_svg")
    .attr(this.style);
    
    return (element)
  }

  SVGtagText() {

    let element = "<circle cx=" + this._x + " cy=" +this._y +" r=" +this._r +"></circle>";

    return (element)
  }
}
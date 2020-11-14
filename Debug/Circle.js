class Circle{
  
  constructor(p){
    this.par1 = p.parab.left;
    this.par2 = p; // parabola to bedeleted
    this.par3 = p.parab.right;

    this.A = {x : this.par1.fx, y : this.par1.fy};
    this.B = {x : this.par2.fx, y : this.par2.fy};
    this.C = {x : this.par3.fx, y : this.par3.fy};


    this.cx = null;
    this.cy = null;
    this.r = null;
    this.bottom = null;

    this.calcParams();
  }

  calcParams(){
    
    let a = this.A.y - this.C.y, 
        b = this.B.y - this.A.y,
        c = this.C.y - this.B.y,
        d = this.B.x - this.A.x,
        e = this.A.x - this.C.x,
        g = this.C.x - this.B.x,
        sq1 = this.A.x**2 + this.A.y**2,
        sq2 = this.B.x**2 + this.B.y**2,
        sq3 = this.C.x**2 + this.C.y**2;

    let DEN = 2*(c*d - b*g);


    this.cx = -(c * sq1 + a * sq2 + b * sq3)/DEN;
    this.cy = (g * sq1 + e * sq2 + d * sq3)/DEN;



    /*let yDelta_a = this.B.y - this.A.y;
    let xDelta_a = this.B.x - this.A.x;
    let yDelta_b = this.C.y - this.B.y;
    let xDelta_b = this.C.x - this.B.x;


    let aSlope = yDelta_a / xDelta_a;
    let bSlope = yDelta_b / xDelta_b;

    this.cx = (aSlope*bSlope*(this.A.y - this.C.y) + bSlope*(this.A.x + this.B.x) - aSlope*(this.B.x+this.C.x) )/(2* (bSlope-aSlope) );
    this.cy = -1*(this.cx - (this.A.x+this.B.x)/2)/aSlope +  (this.A.y+this.B.y)/2;
    */
    this.r = Math.sqrt((this.cx - this.A.x)**2+(this.cy - this.A.y)**2);

    this.bottom = this.cy + this.r;
  }


  appendToSVG(val){
    Segment.svg_context = val;
    this.svg_element = this.toSVG(this._x, this._y).appendTo(this.svg_context);
  }

  toSVG(x, y) {
    let element = $(document.createElementNS("http://www.w3.org/2000/svg",'circle'))
    .attr({
      r:this._r,
      cx:this._x,
      cy:this._y
    })
    .addClass("segment_svg")
    .attr(this.style);

    return (element)
  }
}
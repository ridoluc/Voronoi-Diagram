var beach_line = new BTStruct(Parabola.minor, Parabola.equal);
var line_list = [];
var point_list = [];
var event_list = new BTStruct(VoronoiEvent.minor, VoronoiEvent.equal);
var _svg_;
var debug = false;
var d = 0;
var svgHeight;

$(document).ready(function () {

  _svg_ = $("svg")
  svgHeight = _svg_.height();
  var svgWidth = _svg_.width();

  //Setting the SVG context
  Parabola.svg_context = _svg_;
  Parabola.svgWidth = svgWidth;
  Segment.svg_context = _svg_;

  debug = $("#check-one").attr("checked");

  if (debug) addDirectrix();

  $("#reset-btn").on("click", function () {
    reset();
    point_list = [];

  });

  $("#check-one").on("click", function () {
    debug = this.checked;
  });

  $("#generate-btn").on("click", function () {
    let N = parseInt($("#generate-text").val())
    generate(N)
  });

  // On click

  _svg_.on("click", function (event) {
    x = event.pageX - $(this).offset().left;
    y = event.pageY - $(this).offset().top;

    /* Add point */
    var pt = new Point(x, y, 2);
    point_list.push(pt);


    /* Add parabola */

    if (debug) {
      pt.appendToSVG(_svg_);
      pointEvent(x, y).appendToSVG();
    } else {
      reset();
      MainLoop();
    }


  });




  _svg_.on("mousemove", function (event) {
    //let parentOffset = $(this).parent().offset();
    if (debug) {
      d = event.pageY - $(this).offset().top;
      $("#directrix").attr("y1", d).attr("y2", d);

      // Check next event
      if (event_list._list.length > 0 && event_list._list[0].position <= d) {
        e = event_list.removeFirst();
        if (e.type == "circle" && e.valid == true) {
          circleEvent(e);
        }
      }

      // Update Geometry
      for (elm of beach_line) {
        //if(elm[1].edge_right >0 && elm[1].edge_left < _svg_.width() ){
        elm[1].updateGeometry(d);
        //}else{ beach_line.remove(elm[1]);}
      };
      for (line of line_list) {
        line.updateEnd(); // Update point boundary
      }

      // Update Graphics
      for (elm of beach_line) {
        elm[1].updateSVG(elm[0]);
      };
      for (line of line_list) {
        line.updateSVG(); // Update point boundary
      }
    }
  });


})

/* =================================== */
/* ------- EXECUTE POINT EVENT ------- */
/* =================================== */

function pointEvent(x, y) {
  let new_par = new Parabola(beach_line.latestID, x, y, y);
  let search = beach_line.find(new_par); //array with parabola found and position in the list
  let old_par = search[0];

  if (old_par) {
    let edge_r = old_par.edge_right;

    old_par.edge_right = x;
    let par_r = old_par.copy(2, x, edge_r);



    if (debug) par_r.appendToSVG();
    beach_line.add(par_r);

    //Set left and right parabolas
    new_par.parab.left = old_par;
    old_par.parab.right ? old_par.parab.right.parab.left = par_r : null;
    par_r.parab.right = old_par.parab.right;
    old_par.parab.right = new_par;
    new_par.parab.right = par_r;
    par_r.parab.left = new_par;

    //Create the two new segments
    let segment_start_y = old_par.calcF(x);
    addLine(new_par, x, segment_start_y);
    addLine(par_r, x, segment_start_y);

    addCircleEvent(par_r, y);
    if (old_par.circle_event) old_par.circle_event.valid = false;
    addCircleEvent(old_par, y);

  } else if (search[1] > 0) { // Adding a parabola on the right

    //Set left and right parabolas
    new_par.parab.left = beach_line.last;
    new_par.parab.left.parab.right = new_par;

    let segment_start_y = new_par.parab.left.calcF(x);

    addLine(new_par, x, segment_start_y)

  } else if (beach_line._list.length > 0 && search[1] == 0) { // Adding a parabola on the left of the first one and checking it's not the first one

    //Set left and right parabolas
    new_par.parab.right = beach_line._list[0];
    new_par.parab.right.parab.left = new_par;

    let segment_start_y = beach_line._list[0].calcF(x);
    addLine(beach_line._list[0], x, segment_start_y)

  }

  //Add the new parabola

  beach_line.add(new_par);
  // Add circle event
  //addCircleEvent(new_par);

  return (new_par);
}


/* ==================================== */
/* ------- EXECUTE CIRCLE EVENT ------- */
/* ==================================== */

function circleEvent(ev) {
  let par_deleting = ev.element.par2;
  if (debug) par_deleting.removeFromSVG();
  //console.log((par_deleting.segment.left && par_deleting.segment.right) ? true:false)

  //Unlink the segment
  if (par_deleting.segment.left) { par_deleting.segment.left.unlink(ev.element.cx, ev.element.cy) }
  if (par_deleting.segment.right) { par_deleting.segment.right.unlink(ev.element.cx, ev.element.cy) }

  // to adjust linked parabolas
  par_deleting.remove();

  //if (ev.element.par2.parab.left.circle_event) ev.element.par2.parab.left.valid = false;
  addCircleEvent(ev.element.par2.parab.left, ev.position);
  //if (ev.element.par2.parab.right.circle_event) ev.element.par2.parab.right.circle_event.valid = false;
  addCircleEvent(ev.element.par2.parab.right, ev.position);

  beach_line.remove(par_deleting);

  addLine(ev.element.par2.parab.right, ev.element.cx, ev.element.cy);
}

/* ================================ */
/* ------- ADD CIRCLE EVENT ------- */
/* ================================ */

function addCircleEvent(arc, dir) {

  //new method
  if (arc.parab.left && arc.parab.right) {

    let a = { x: arc.parab.left.fx, y: arc.parab.left.fy }
    let b = { x: arc.fx, y: arc.fy }
    let c = { x: arc.parab.right.fx, y: arc.parab.right.fy }

    if ((b.x - a.x) * (c.y - a.y) - (c.x - a.x) * (b.y - a.y) > 0) {
      let cir = new Circle(arc);

      // side  right and left is wrong

      if (cir.cy <= svgHeight && cir.bottom > dir) {
        let e = new VoronoiEvent("circle", cir.bottom, cir);

        arc.circle_event = e;
        event_list.add(e);

      }
    }
  }

}



// Add line

function addLine(parabola, x, y) {
  let line = new Segment(parabola, x, y, x, y);

  // Adjust the segments reference in the parabolas
  parabola.segment.left = line;
  parabola.parab.left.segment.right = line;


  if (debug) line.appendToSVG();
  line_list.push(line);
}



/* ====================== */
/* -------  LOOP  ------- */
/* ====================== */

function MainLoop() {

  var t0 = performance.now();
  /*
    for (i of test_point) {
      let pt = new Point(i.x, i.y, 2);
      point_list.push(pt);
    }
    */

  //Create the queue


  let txt = "";

  for (p of point_list) {
    //p.appendToSVG(_svg_);
    txt += p.SVGtagText();
    event_list.add(new VoronoiEvent("point", p._y, p));
  }

  point_group = document.createElementNS("http://www.w3.org/2000/svg", 'g');
  point_group.setAttribute("class", "point_svg")
  point_group.innerHTML = txt;
  _svg_[0].appendChild(point_group)

  let d = 0;

  while (event_list._list.length > 0) {
    //Extract the event
    let e = event_list.removeFirst();

    // set dirctrix
    d = e.position;

    // Update Geometry
    for (elm of beach_line._list) {
      elm.updateGeometry(d);
    }

    for (line of line_list) {
      line.updateEnd(); // Update point boundary
    }

    if (e.type == "point") {

      //Execute point event
      pointEvent(e.element._x, e.element._y)

    } else if (e.type == "circle" && e.valid == true /*&& ((e.element.par2.edge_right - e.element.par2.edge_left) < 0.1)*/) {
      circleEvent(e);
    }




  }

  // Update Geometry
  for (elm of beach_line) {
    elm[1].updateGeometry(d);
  }

  for (line of line_list) {
    line.updateEnd(); // Update point boundary
  }

  //Complete the segments
  if (d < svgHeight) {
    d = svgHeight;
    // Update Geometry
    for (elm of beach_line) {
      elm[1].updateGeometry(d);
    }

    for (line of line_list) {
      line.updateEnd(); // Update point boundary
    }

  }

  //graphics

  let linesSVG = ""

  for (line of line_list) {
    if (line.connected) line.interpolateY(svgHeight);
    linesSVG += line.SVGtagText(); // add line svg txt tag
  }

  line_group = document.createElementNS("http://www.w3.org/2000/svg", 'g');
  line_group.setAttribute("class", "segment_svg")
  line_group.innerHTML = linesSVG;
  _svg_[0].appendChild(line_group)

  var t1 = performance.now();
  $("#timer p").text((t1 - t0).toFixed(2) + " ms");

}


function reset() {
  //point_list = [];
  beach_line.empty();
  line_list = [];
  event_list.empty();
  $("#parab-list").empty();
  _svg_.empty();
  if (debug) { addDirectrix() }
  //MainLoop();
}

function addDirectrix() {
  // Create the directrix

  $(document.createElementNS("http://www.w3.org/2000/svg", 'line'))
    .attr(
      {
        y1: 0,
        y2: 0,
        x1: 0,
        x2: _svg_.width(),
        stroke: "rgb(200,200,50)",
        "stroke-width": 0.5,
        fill: "transparent"
      })
    .attr("id", "directrix")
    .appendTo(_svg_);

}

function generatePoints(N) {

  let W = _svg_.width();
  let H = _svg_.height();

  let points = []
  for (i = 0; i < N; i++) {
    var pt = new Point(Math.random() * W, Math.random() * H, 2);
    points.push(pt);
  }

  return points;
}

function generate(N) {
  reset();
  point_list = generatePoints(N);
  MainLoop();
}

function testPerformances(iter, points) {
  let mean = 0;
  for (k = 0; k < iter; k++) {
    mean -= performance.now();
    generate(points);
    mean += performance.now();
    //if(Math.floor(k/iter*100)%10==0){console.log((k/iter*100).toFixed(0)+"%")}
  }
  mean = mean / iter
  console.log("The mean is: " + mean.toFixed(0) + "ms, " + points + "points")
  return mean;
}

var test_point = [
  { x: 166, y: 228.125 },
  { x: 224, y: 195.125 },
  { x: 92, y: 167.125 },
  { x: 151, y: 80.125 },
  { x: 243, y: 138.125 },
  { x: 141, y: 122.125 },
  { x: 63, y: 84.125 }

]
function auto_test(ver) {
  max = 20
  dat = []
  let test_output = { version: ver, data: [] }
  for (u = 0; u <= max; u++) {
    mean = testPerformances(50, u * 10)
    test_output.data.push({
      points: u * 10,
      time: Math.floor(mean),
      machine: "PCLuca"
    })
  }
  console.log(JSON.stringify(test_output));
}

var test_times = [
  {
    version: 1,
    data: [
      {
        points: 100,
        time: 510, //millisec
        machine: "PCLuca"
      },
      {
        points: 50,
        time: 184, //millisec
        machine: "PCLuca"
      },
      {
        points: 20,
        time: 48, //millisec
        machine: "PCLuca"
      }
    ]
  },
  {
    version: 2,
    data: [
      {
        points: 0,
        time: 0, //millisec
        machine: "PCLuca"
      },
      {
        points: 10,
        time: 11, //millisec
        machine: "PCLuca"
      },
      {
        points: 20,
        time: 18, //millisec
        machine: "PCLuca"
      },
      {
        points: 30,
        time: 23, //millisec
        machine: "PCLuca"
      },
      {
        points: 40,
        time: 33, //millisec
        machine: "PCLuca"
      },
      {
        points: 50,
        time: 38, //millisec
        machine: "PCLuca"
      }, {
        points: 60,
        time: 47, //millisec
        machine: "PCLuca"
      },
      {
        points: 70,
        time: 55, //millisec
        machine: "PCLuca"
      },
      {
        points: 80,
        time: 64, //millisec
        machine: "PCLuca"
      }, {
        points: 90,
        time: 74, //millisec
        machine: "PCLuca"
      },
      {
        points: 100,
        time: 84, //millisec
        machine: "PCLuca"
      },
      {
        points: 110,
        time: 97, //millisec
        machine: "PCLuca"
      }, {
        points: 120,
        time: 103, //millisec
        machine: "PCLuca"
      },
      {
        points: 130,
        time: 119, //millisec
        machine: "PCLuca"
      },
      {
        points: 140,
        time: 123, //millisec
        machine: "PCLuca"
      }, {
        points: 150,
        time: 134, //millisec
        machine: "PCLuca"
      },
      {
        points: 160,
        time: 152, //millisec
        machine: "PCLuca"
      },
      {
        points: 170,
        time: 156, //millisec
        machine: "PCLuca"
      }, {
        points: 180,
        time: 168, //millisec
        machine: "PCLuca"
      },
      {
        points: 190,
        time: 177, //millisec
        machine: "PCLuca"
      },
      {
        points: 200,
        time: 189, //millisec
        machine: "PCLuca"
      }
    ]
  },
  { "version": 3, "data": [{ "points": 0, "time": 0.5519999982789159, "machine": "PCLuca" }, { "points": 10, "time": 6.959999997634441, "machine": "PCLuca" }, { "points": 20, "time": 11.606000000610948, "machine": "PCLuca" }, { "points": 30, "time": 19.518000001553446, "machine": "PCLuca" }, { "points": 40, "time": 23.478000001050532, "machine": "PCLuca" }, { "points": 50, "time": 28.749999997671694, "machine": "PCLuca" }, { "points": 60, "time": 36.06400000164285, "machine": "PCLuca" }, { "points": 70, "time": 43.26800000388175, "machine": "PCLuca" }, { "points": 80, "time": 51.77799999946728, "machine": "PCLuca" }, { "points": 90, "time": 65.56799999903888, "machine": "PCLuca" }, { "points": 100, "time": 67.55999999819323, "machine": "PCLuca" }, { "points": 110, "time": 73.27999999979511, "machine": "PCLuca" }, { "points": 120, "time": 84.04200000222772, "machine": "PCLuca" }, { "points": 130, "time": 91.78599999519065, "machine": "PCLuca" }, { "points": 140, "time": 101.81999999564141, "machine": "PCLuca" }, { "points": 150, "time": 111.30999999819323, "machine": "PCLuca" }, { "points": 160, "time": 120.0719999987632, "machine": "PCLuca" }, { "points": 170, "time": 127.79000000096858, "machine": "PCLuca" }, { "points": 180, "time": 140.93199999304488, "machine": "PCLuca" }, { "points": 190, "time": 151.589999999851, "machine": "PCLuca" }, { "points": 200, "time": 157.0439999969676, "machine": "PCLuca" }] },
  { "version": 4, "data": [{ "points": 0, "time": 0, "machine": "PCLuca" }, { "points": 10, "time": 6, "machine": "PCLuca" }, { "points": 20, "time": 12, "machine": "PCLuca" }, { "points": 30, "time": 16, "machine": "PCLuca" }, { "points": 40, "time": 23, "machine": "PCLuca" }, { "points": 50, "time": 31, "machine": "PCLuca" }, { "points": 60, "time": 33, "machine": "PCLuca" }, { "points": 70, "time": 42, "machine": "PCLuca" }, { "points": 80, "time": 46, "machine": "PCLuca" }, { "points": 90, "time": 55, "machine": "PCLuca" }, { "points": 100, "time": 61, "machine": "PCLuca" }, { "points": 110, "time": 66, "machine": "PCLuca" }, { "points": 120, "time": 72, "machine": "PCLuca" }, { "points": 130, "time": 80, "machine": "PCLuca" }, { "points": 140, "time": 84, "machine": "PCLuca" }, { "points": 150, "time": 94, "machine": "PCLuca" }, { "points": 160, "time": 100, "machine": "PCLuca" }, { "points": 170, "time": 106, "machine": "PCLuca" }, { "points": 180, "time": 114, "machine": "PCLuca" }, { "points": 190, "time": 126, "machine": "PCLuca" }, { "points": 200, "time": 137, "machine": "PCLuca" }] },
  {"version":5,"data":[{"points":0,"time":0,"machine":"PCLuca"},{"points":10,"time":2,"machine":"PCLuca"},{"points":20,"time":2,"machine":"PCLuca"},{"points":30,"time":4,"machine":"PCLuca"},{"points":40,"time":7,"machine":"PCLuca"},{"points":50,"time":8,"machine":"PCLuca"},{"points":60,"time":10,"machine":"PCLuca"},{"points":70,"time":13,"machine":"PCLuca"},{"points":80,"time":13,"machine":"PCLuca"},{"points":90,"time":16,"machine":"PCLuca"},{"points":100,"time":19,"machine":"PCLuca"},{"points":110,"time":21,"machine":"PCLuca"},{"points":120,"time":23,"machine":"PCLuca"},{"points":130,"time":27,"machine":"PCLuca"},{"points":140,"time":29,"machine":"PCLuca"},{"points":150,"time":32,"machine":"PCLuca"},{"points":160,"time":34,"machine":"PCLuca"},{"points":170,"time":37,"machine":"PCLuca"},{"points":180,"time":42,"machine":"PCLuca"},{"points":190,"time":43,"machine":"PCLuca"},{"points":200,"time":46,"machine":"PCLuca"}]}

]
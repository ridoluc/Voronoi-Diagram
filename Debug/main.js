var voronoi;

$(document).ready(function () {
	_svg_ = $("svg");
	debug = $("#check-one").attr("checked");

	voronoi = new VoronoiDiagram(_svg_, debug);
});

$("#reset-btn").on("click", function () {
	voronoi.set_points([]);
	voronoi.reset();
});

$("#check-one").on("click", function () {
	voronoi.debug = this.checked;
});

$("#generate-btn").on("click", function () {
	let N = parseInt($("#generate-text").val());
	generate(N);
});

function generatePoints(N) {
	let W = _svg_.width();
	let H = _svg_.height();

	let points = [];
	for (i = 0; i < N; i++) {
		var pt = new Point(Math.random() * W, Math.random() * H, 2);
		var good = true;
		for (const p of points) {
      let dist = pt.distanceToPoint(p);
			if (dist < 3) {
				good = false;
				break;
			}
		}
		good ? points.push(pt) : i--;
	}

	return points;
}

function generate(N) {
	voronoi.reset();
	point_list = generatePoints(N);
	voronoi.update(point_list);
}

function testPerformances(iter, points) {
	let mean = 0;
	for (k = 0; k < iter; k++) {
		mean -= performance.now();
		generate(points);
		mean += performance.now();
		//if(Math.floor(k/iter*100)%10==0){console.log((k/iter*100).toFixed(0)+"%")}
	}
	mean = mean / iter;
	console.log("The mean is: " + mean.toFixed(0) + "ms, " + points + "points");
	return mean;
}

var test_point = [
	{ x: 166, y: 228.125 },
	{ x: 224, y: 195.125 },
	{ x: 92, y: 167.125 },
	{ x: 151, y: 80.125 },
	{ x: 243, y: 138.125 },
	{ x: 141, y: 122.125 },
	{ x: 63, y: 84.125 },
];
function auto_test(ver) {
	max = 20;
	dat = [];
	let test_output = { version: ver, data: [] };
	for (u = 0; u <= max; u++) {
		mean = testPerformances(50, u * 10);
		test_output.data.push({
			points: u * 10,
			time: Math.floor(mean),
			machine: "PCLuca",
		});
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
				machine: "PCLuca",
			},
			{
				points: 50,
				time: 184, //millisec
				machine: "PCLuca",
			},
			{
				points: 20,
				time: 48, //millisec
				machine: "PCLuca",
			},
		],
	},
	{
		version: 2,
		data: [
			{
				points: 0,
				time: 0, //millisec
				machine: "PCLuca",
			},
			{
				points: 10,
				time: 11, //millisec
				machine: "PCLuca",
			},
			{
				points: 20,
				time: 18, //millisec
				machine: "PCLuca",
			},
			{
				points: 30,
				time: 23, //millisec
				machine: "PCLuca",
			},
			{
				points: 40,
				time: 33, //millisec
				machine: "PCLuca",
			},
			{
				points: 50,
				time: 38, //millisec
				machine: "PCLuca",
			},
			{
				points: 60,
				time: 47, //millisec
				machine: "PCLuca",
			},
			{
				points: 70,
				time: 55, //millisec
				machine: "PCLuca",
			},
			{
				points: 80,
				time: 64, //millisec
				machine: "PCLuca",
			},
			{
				points: 90,
				time: 74, //millisec
				machine: "PCLuca",
			},
			{
				points: 100,
				time: 84, //millisec
				machine: "PCLuca",
			},
			{
				points: 110,
				time: 97, //millisec
				machine: "PCLuca",
			},
			{
				points: 120,
				time: 103, //millisec
				machine: "PCLuca",
			},
			{
				points: 130,
				time: 119, //millisec
				machine: "PCLuca",
			},
			{
				points: 140,
				time: 123, //millisec
				machine: "PCLuca",
			},
			{
				points: 150,
				time: 134, //millisec
				machine: "PCLuca",
			},
			{
				points: 160,
				time: 152, //millisec
				machine: "PCLuca",
			},
			{
				points: 170,
				time: 156, //millisec
				machine: "PCLuca",
			},
			{
				points: 180,
				time: 168, //millisec
				machine: "PCLuca",
			},
			{
				points: 190,
				time: 177, //millisec
				machine: "PCLuca",
			},
			{
				points: 200,
				time: 189, //millisec
				machine: "PCLuca",
			},
		],
	},
	{
		version: 3,
		data: [
			{ points: 0, time: 0.5519999982789159, machine: "PCLuca" },
			{ points: 10, time: 6.959999997634441, machine: "PCLuca" },
			{ points: 20, time: 11.606000000610948, machine: "PCLuca" },
			{ points: 30, time: 19.518000001553446, machine: "PCLuca" },
			{ points: 40, time: 23.478000001050532, machine: "PCLuca" },
			{ points: 50, time: 28.749999997671694, machine: "PCLuca" },
			{ points: 60, time: 36.06400000164285, machine: "PCLuca" },
			{ points: 70, time: 43.26800000388175, machine: "PCLuca" },
			{ points: 80, time: 51.77799999946728, machine: "PCLuca" },
			{ points: 90, time: 65.56799999903888, machine: "PCLuca" },
			{ points: 100, time: 67.55999999819323, machine: "PCLuca" },
			{ points: 110, time: 73.27999999979511, machine: "PCLuca" },
			{ points: 120, time: 84.04200000222772, machine: "PCLuca" },
			{ points: 130, time: 91.78599999519065, machine: "PCLuca" },
			{ points: 140, time: 101.81999999564141, machine: "PCLuca" },
			{ points: 150, time: 111.30999999819323, machine: "PCLuca" },
			{ points: 160, time: 120.0719999987632, machine: "PCLuca" },
			{ points: 170, time: 127.79000000096858, machine: "PCLuca" },
			{ points: 180, time: 140.93199999304488, machine: "PCLuca" },
			{ points: 190, time: 151.589999999851, machine: "PCLuca" },
			{ points: 200, time: 157.0439999969676, machine: "PCLuca" },
		],
	},
	{
		version: 4,
		data: [
			{ points: 0, time: 0, machine: "PCLuca" },
			{ points: 10, time: 6, machine: "PCLuca" },
			{ points: 20, time: 12, machine: "PCLuca" },
			{ points: 30, time: 16, machine: "PCLuca" },
			{ points: 40, time: 23, machine: "PCLuca" },
			{ points: 50, time: 31, machine: "PCLuca" },
			{ points: 60, time: 33, machine: "PCLuca" },
			{ points: 70, time: 42, machine: "PCLuca" },
			{ points: 80, time: 46, machine: "PCLuca" },
			{ points: 90, time: 55, machine: "PCLuca" },
			{ points: 100, time: 61, machine: "PCLuca" },
			{ points: 110, time: 66, machine: "PCLuca" },
			{ points: 120, time: 72, machine: "PCLuca" },
			{ points: 130, time: 80, machine: "PCLuca" },
			{ points: 140, time: 84, machine: "PCLuca" },
			{ points: 150, time: 94, machine: "PCLuca" },
			{ points: 160, time: 100, machine: "PCLuca" },
			{ points: 170, time: 106, machine: "PCLuca" },
			{ points: 180, time: 114, machine: "PCLuca" },
			{ points: 190, time: 126, machine: "PCLuca" },
			{ points: 200, time: 137, machine: "PCLuca" },
		],
	},
	{
		version: 5,
		data: [
			{ points: 0, time: 0, machine: "PCLuca" },
			{ points: 10, time: 2, machine: "PCLuca" },
			{ points: 20, time: 2, machine: "PCLuca" },
			{ points: 30, time: 4, machine: "PCLuca" },
			{ points: 40, time: 7, machine: "PCLuca" },
			{ points: 50, time: 8, machine: "PCLuca" },
			{ points: 60, time: 10, machine: "PCLuca" },
			{ points: 70, time: 13, machine: "PCLuca" },
			{ points: 80, time: 13, machine: "PCLuca" },
			{ points: 90, time: 16, machine: "PCLuca" },
			{ points: 100, time: 19, machine: "PCLuca" },
			{ points: 110, time: 21, machine: "PCLuca" },
			{ points: 120, time: 23, machine: "PCLuca" },
			{ points: 130, time: 27, machine: "PCLuca" },
			{ points: 140, time: 29, machine: "PCLuca" },
			{ points: 150, time: 32, machine: "PCLuca" },
			{ points: 160, time: 34, machine: "PCLuca" },
			{ points: 170, time: 37, machine: "PCLuca" },
			{ points: 180, time: 42, machine: "PCLuca" },
			{ points: 190, time: 43, machine: "PCLuca" },
			{ points: 200, time: 46, machine: "PCLuca" },
		],
	},
];

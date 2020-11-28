# Voronoi diagram builder

Fast and simple implementation of Fortune's Algorithm for building Voronoi diagrams.

## Usage
Just create an instance of the `VoronoiDiagram` class providing a list of points and width and height of the canvas 

```javascript
    let points = [  
                    new Point(140,180),
                    new Point(230,200),
                    new Point(210,60)
                    ];

    let height = 300;
    let width = 300;

    // Create a new object
    let vor = new VoronoiDiagram(points, width, height);    
    
    // Build the diagram
    vor.update();

    // Edges of the Voronoi diagram
    let e = vor.edges;
    // Vertices of the Voronoi diagram
    let v = vor.voronoi_vertex;
```


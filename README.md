# Voronoi diagram builder

Fast and simple implementation of Fortune's Algorithm for building Voronoi diagrams.

## Usage
Just create an instance of the `VoronoiDiagram` class providing a list of points and width and height of the canvas 

```javascript
    let points = [  new Point(146,180.125),
                    new Point(235,200.125),
                    new Point(215,68.125)];
                    
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


const colorData = [
    {
      max: 2,
      color: [220, 186, 150]
    },
    {
      max: 12,
      color: [75, 186, 80]
    },
    {
      max: 16,
      color: [68, 178, 72]
    },
    {
      max: 18,
      color: [111, 106, 96]
    },
    {
      max: 100,
      color: [100, 90, 85]
    }
]

export default class TerrainTexture {
    constructor(noiseData, width) {
      this.noiseData = noiseData;
      this.width = width;
      this.height = width;
      this.colorData = colorData || [];
  
      this._buildCanvas();
      this._renderCanvas()
    }
  
    updateNoise(noiseData) {
      this.noiseData = noiseData;
  
      this._renderCanvas();
    }
  
    _buildCanvas() {
      this.canvas = document.createElement('canvas');
  
      this.canvas.width = this.width;
      this.canvas.height = this.height;
      document.body.appendChild(this.canvas);
    }
  
    // Map the height of a rectangle on the canvas to a color
    _mapColor(value) {
      if (this.colorData) {
        for (var i = 0; i < this.colorData.length; i++) {
          if (value <= this.colorData[i].max) {
            return this.colorData[i].color;
          }
        }
      } else {
        return [
          value * 256,
          value * 256,
          value * 256
        ]
      }
      return value;
    }
  
    _renderCanvas() {
      var context = this.canvas.getContext('2d');
  
      context.clearRect(0, 0, this.width, this.height);
      var image = context.createImageData(this.width, this.height);
  
      for (var i = 0; i < image.data.length; i+=4) {
        // Find coordinates corresponding to index
        var x = i/4 % this.width;
        var y = Math.floor(i/4 / this.width);
  
        // Find color from height at those coordinates
        var color = this._mapColor(this.noiseData[x][y]);
  
        // Save color into image data
        image.data[i + 0] = color[0];
        image.data[i + 1] = color[1];
        image.data[i + 2] = color[2];
        image.data[i + 3] = 255;
      }
  
      context.putImageData(image, 0, 0);
    }
  }
  
class Rules {

  constructor () {
    this.scaleConst = 1; // Número da escala atual

    this.canvas = null; // Canvas
    this.ctx = null; // Contexto do canvas
  }

  setCanvas(element) { // Define qual o canvas a ser usado
    this.canvas = document.getElementById(element);
    this.ctx = this.canvas.getContext("2d");
  }

  plotPoint(x, y) { // Plotagem de pontos de acordo com a escala (sem dimensão)
    this.scalePoint = 0;
    
    if (this.scaleConst <= 1)
      this.scalePoint = 1
    else 
      this.scalePoint = 1/this.scaleConst

    this.ctx.arc(x/this.scaleConst, y/this.scaleConst, this.scalePoint, 0, 2 * Math.PI);
    this.ctx.stroke();
  }

  pointsToAngle(x1, y1, x2, y2) { // Retorna o arco entre dois pontos em radianos
    return Math.atan2(y2 - y1, x2 - x1);
  }

  zoomIn() { // Aumenta o zoom do canvas
    if (this.scaleConst < 10) {
      this.ctx.scale(2,2);
      this.scaleConst *= 2;
    }

    this.ctx.lineWidth=1/this.scaleConst;
  }

  zoomOut() { // Diminui o zoom do canvas
    if (this.scaleConst > 1/8) {
      this.this.ctx.scale(1/2,1/2);
      this.scaleConst /= 2;
    }

    this.ctx.lineWidth=1/this.scaleConst;
  }

  compass(circle, x, y) { // Desenha o circulo com centro no ponto dado
    if (circle instanceof Circle) {
      let startTime = Date.now();

      let interval = setInterval(function() {
        let portion = clamp((Date.now() - startTime) / 400);

        this.ctx.beginPath();
        this.ctx.arc(x, y, circle.radius, circle.startAngle, circle.finalAngle*portion);
        this.ctx.stroke();

        if (portion === 1)
          clearInterval(interval);

      }, 10);
    }
  }

  ruler(line) { // Traça ma reta entre dois pontos (respeitando a direção de desenho)
    if (line instanceof Line) {
      let startTime = Date.now();

      let interval = setInterval(function() {
        let portion = clamp((Date.now() - startTime) / 400);

        this.ctx.beginPath();
        this.ctx.moveTo(line.startX, line.startY);

        if (line.startY < line.endY) {
          if (line.startX < line.endX)
            this.ctx.lineTo(line.startX + (line.endX * portion), line.startY + (line.endY * portion));
          else
            this.ctx.lineTo(line.startX - (line.startX * portion), line.startY + (line.endY * portion))
        }

        if (line.startY > line.endY) {
          if (line.startX < line.endX)
            this.ctx.lineTo(line.startX + (line.endX * portion), line.startY - (line.startY * portion));
          else
            this.ctx.lineTo(line.startX - (line.startX * portion), line.startY - (line.startY * portion))
        }

        if (line.startY === line.endY) {
          if (line.startX < line.endX)
            this.ctx.lineTo(line.startX + (line.endX * portion), line.startY);
          else
            this.ctx.lineTo(line.startX - (line.startX * portion), line.startY);
        }

        if (line.startX === line.endX) {
          if (line.startY < line.endY)
            this.ctx.lineTo(line.startX, line.startY + (line.endY * portion));
          else
            this.ctx.lineTo(line.startX, line.startY - (line.startY * portion));
        }

        this.ctx.stroke();

        if (portion === 1)
          clearInterval(interval);

      }, 10);
    }
  }
}

class Circle { // Classe que implementa um circulo
  constructor(radius, startAngle, finalAngle) {
    this.radius = radius;
    this.startAngle = startAngle;
    this.finalAngle = finalAngle;
  }
}

class Line { // Classe que implementa uma linha
  constructor(startX, endX, startY, endY) {
    this.startX = startX;
    this.endX = endX;
    this.startY = startY;
    this.endY = endY;
  }
}

function clamp(v) { // Retorna a porção a ser preenchida na animação de acordo com o tempo
  if (v < 0) return 0; // Determina o inicio da animacao
  if (v > 1) return 1; // Determina o fim da animacao
  return v;
}
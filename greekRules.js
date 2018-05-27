let scaleConst = 1; // Número da escala atual

let canvas = null; // Canvas
let ctx = null; // Contexto do canvas

function setCanvas(element) { // Define qual o canvas a ser usado
  canvas = document.getElementById(element);
  ctx = canvas.getContext("2d");
}

function plotPoint(x, y) { // Plotagem de pontos de acordo com a escala (sem dimensão)
  let scalePoint = 0;
  
  if (scaleConst <= 1)
    scalePoint = 1
  else 
    scalePoint = 1/scaleConst

  ctx.arc(x/scaleConst, y/scaleConst, scalePoint, 0, 2 * Math.PI);
  ctx.stroke();
}

function pointsToAngle(x1, y1, x2, y2) { // Retorna o arco entre dois pontos em radianos
  return Math.atan2(y2 - y1, x2 - x1);
}

function zoomIn() { // Aumenta o zoom do canvas
  if (scaleConst < 10) {
    ctx.scale(2,2);
    scaleConst *= 2;
  }

  ctx.lineWidth=1/scaleConst;
}

function zoomOut() { // Diminui o zoom do canvas
  if (scaleConst > 1/8) {
    ctx.scale(1/2,1/2);
    scaleConst /= 2;
  }

  ctx.lineWidth=1/scaleConst;
}

function compass(circle, x, y) { // Desenha o circulo com centro no ponto dado
  if (circle instanceof Circle) {
    let startTime = Date.now();

    let interval = setInterval(function() {
      let portion = clamp((Date.now() - startTime) / 400);

      ctx.beginPath();
      ctx.arc(x, y, circle.radius, circle.startAngle, circle.finalAngle*portion);
      ctx.stroke();

      if (portion === 1)
        clearInterval(interval);

    }, 10);
  }
}

function ruler(line) { // Traça ma reta entre dois pontos (respeitando a direção de desenho)
  if (line instanceof Line) {
    let startTime = Date.now();

    let interval = setInterval(function() {
      let portion = clamp((Date.now() - startTime) / 400);

      ctx.beginPath();
      ctx.moveTo(line.startX, line.startY);

      if (line.startY < line.endY) {
        if (line.startX < line.endX)
          ctx.lineTo(line.startX + (line.endX * portion), line.startY + (line.endY * portion));
        else
          ctx.lineTo(line.startX - (line.startX * portion), line.startY + (line.endY * portion))
      }

      if (line.startY > line.endY) {
        if (line.startX < line.endX)
          ctx.lineTo(line.startX + (line.endX * portion), line.startY - (line.startY * portion));
        else
          ctx.lineTo(line.startX - (line.startX * portion), line.startY - (line.startY * portion))
      }

      if (line.startY === line.endY) {
        if (line.startX < line.endX)
          ctx.lineTo(line.startX + (line.endX * portion), line.startY);
        else
          ctx.lineTo(line.startX - (line.startX * portion), line.startY);
      }

      if (line.startX === line.endX) {
        if (line.startY < line.endY)
          ctx.lineTo(line.startX, line.startY + (line.endY * portion));
        else
          ctx.lineTo(line.startX, line.startY - (line.startY * portion));
      }

      ctx.stroke();

      if (portion === 1)
        clearInterval(interval);

    }, 10);
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
class Rules {

	constructor() {
		this.scaleConst = 1; // Número da escala atual

		this.canvas = null; // Canvas
		this.ctx = null; // Contexto do canvas
	}

	setCanvas(element)  { // Define qual o canvas a ser usado
		this.canvas = document.getElementById(element);
		this.ctx = this.canvas.getContext("2d");
	}

	plotPoint(x, y) { // Plotagem de pontos de acordo com a escala (sem dimensão)
		this.scalePoint = 0;

		if (this.scaleConst <= 1)
			this.scalePoint = 1
		else
			this.scalePoint = 1 / this.scaleConst

		this.ctx.arc(x / this.scaleConst, y / this.scaleConst, this.scalePoint, 0, 2 * Math.PI);
		this.ctx.stroke();
	}

	pointsToAngle(x1, y1, x2, y2) { // Retorna o arco entre dois pontos em radianos
		return Math.atan2(y2 - y1, x2 - x1);
	}

	zoomIn() { // Aumenta o zoom do canvas
		if (this.scaleConst < 10) {
			this.ctx.scale(2, 2);
			this.scaleConst *= 2;
		}

		this.ctx.lineWidth = 1 / this.scaleConst;
	}

	zoomOut() { // Diminui o zoom do canvas
		if (this.scaleConst > 1 / 8) {
			this.this.ctx.scale(1 / 2, 1 / 2);
			this.scaleConst /= 2;
		}

		this.ctx.lineWidth = 1 / this.scaleConst;
	}

	compass(circle, reference) { // Desenha o circulo com centro no ponto dado
		if (circle instanceof Circle) {

			if (!reference) reference = {
				x: this.canvas.width / 8,
				y: this.canvas.height / 1.5,
			};

			this.ctx.beginPath();
				
			if (circle.startAngle < circle.finalAngle) {
				this.ctx.arc(reference.x, reference.y, circle.radius, circle.startAngle, circle.finalAngle);
			} else {
				this.ctx.arc(reference.x, reference.y, circle.radius, circle.finalAngle, circle.startAngle);
			}

			this.ctx.stroke();

			return reference;
		}
	}

	async ruler(line, reference) { // Traça uma reta entre dois pontos (respeitando a direção de desenho)
		if (line instanceof Line) {
			if (reference) {
				line.sumXY(reference.x, reference.y);
			}

			this.ctx.beginPath();
			this.ctx.moveTo(line.startX, line.startY);

			this.ctx.lineTo(line.startX + line.variation().x, line.startY + line.variation().y);

			this.ctx.stroke();
		}
	}
}

class Circle { // Classe que implementa um circulo
	constructor({ radius, startAngle, finalAngle }) {
		this.radius = radius;
		this.startAngle = startAngle;
		this.finalAngle = finalAngle;

		if (!this.radius) this.radius = 10;
		if (!this.startAngle) this.startAngle = 0;
		if (!this.finalAngle) this.finalAngle = 2 * Math.PI;
	}

	size () {
		const aVariation = Math.abs(this.startAngle - this.finalAngle);
		return this.radius * aVariation;
	}
}

class Line { // Classe que implementa uma linha
	constructor({ startX, endX, startY, endY }) {
		this.startX = startX;
		this.endX = endX;
		this.startY = startY;
		this.endY = endY;
	}

	size () {
		const xVariation = Math.abs(this.startX - this.endX);
		const yVariation = Math.abs(this.startY - this.endY);

		return Math.sqrt(Math.pow(xVariation, 2) + Math.pow(yVariation, 2));
	}

	variation () {
		return {
			x: this.endX - this.startX,
			y: this.endY - this.startY,
		}
	}

	sumXY (x, y) {
		this.endX = this.endX + (x - this.startX);
		this.startX = x;
		
		this.endY = this.endY + (y - this.startY);
		this.startY = y;
	}
}

class Draw {
	constructor(elements) {
		this.elements = elements;
	}

	async init (rules) {
		let lastELement = {
			x: 0,
			y: 0,
		}
		
		this.elements.forEach((element, index) => {
			if (element instanceof Line) {
				if (index === 0) {
					rules.ruler(element);

					const variations = this.elements[index].variation();
					lastELement.x = this.elements[index].startX + variations.x;
					lastELement.y = this.elements[index].startY + variations.y;
				} else {
					 rules.ruler(element, lastELement);

					const variations = this.elements[index].variation();
					lastELement.x = this.elements[index].startX + variations.x;
					lastELement.y = this.elements[index].startY + variations.y;
				}
			}

			if (element instanceof Circle) {
				if (index === 0) {
					const center = rules.compass(element);
					lastELement = center;
				} else {
					const center = rules.compass(element, lastELement);
					lastELement = center;
				}
			}
		});
	}
}

function clamp(v) { // Retorna a porção a ser preenchida na animação de acordo com o tempo
	if (v < 0) return 0; // Determina o inicio da animacao
	if (v > 1) return 1; // Determina o fim da animacao
	return v;
}
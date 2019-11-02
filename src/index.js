import './styles.scss';

const canvas = document.getElementById("canvas");
const context = canvas.getContext('2d');

const hex2rgba = (hex, alpha = 1) => {
	const [r, g, b] = hex.match(/\w\w/g).map(x => parseInt(x, 16));
	return `rgba(${r},${g},${b},${alpha})`;
};

function drawPixel(canvas, startX, startY, sizePixel, color) {
	if (color.length === 6) {
		canvas.fillStyle = hex2rgba(color);
	} else {
		canvas.fillStyle = `rgba(${color})`;
	}
	canvas.fillRect(startX, startY, sizePixel, sizePixel);
}

function drawImage(canvas, dataArray) {
	let sizePixel = 0;
	let x = 0;
	let y = 0;

	sizePixel = 512 / dataArray.length;

	for (let row of dataArray) {
		for (let cell of row) {
			drawPixel(canvas, x, y, sizePixel, cell);
			x += sizePixel;
		}
		y += sizePixel;
		x = 0;
	}
}

document.querySelectorAll('.actions__item').forEach(item => {
	item.addEventListener('click', () => {

		const { type, url } = item.dataset;

		switch (type) {
			case 'pixels':
				fetch(url).then(response => response.json()).then(data => drawImage(context, data));
				break;

			case 'image':
				const img = new Image();
				img.onload = function () {
					context.drawImage(img, 0, 0, 512, 512);
				}
				img.src = url;
				break;

			default:
				break;
		}
	});
});

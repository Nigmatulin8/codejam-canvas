import './styles.scss';

const canvas = document.getElementById("canvas");
const context = canvas.getContext('2d');

const resolution = document.getElementsByClassName('resolution')[0];

//From HTMLCollection to Array
const buttons =  [...document.getElementsByClassName('item')];

const sizeEl = {
	'4x4': 128,
	'32x32': 16 
};

const URL = {
	json_1: './src/data/4x4.json',
	json_2: './src/data/32x32.json',
	img_1: './src/data/image.png'
};

getData(URL).then(data => {
	resolution.addEventListener('click', e => {
		if (e.target.dataset.size) {
			let size = e.target.dataset.size; //4x4 | 32x32 | 256x256
		
			buttons.forEach(item =>  item.classList.remove('active'));

			e.target.classList.add('active');

			if(size == '256x256') {
				const pic = new Image();
				pic.src = URL.img_1;
				
				pic.onload = () => {
					context.drawImage(pic, 0, 0, 512, 512);
				};
			}

			else { draw(data[size], sizeEl[size]); }
		}
	});
});

async function getData (url) {
	const data = {};

	for (let key in url) {
		if(url.hasOwnProperty(key) && key.match(/json/)) {
			const response = await fetch(url[key]);

			/* 
			Создание объекта data типа:
			obj {
				4x4: array,
				32x32: array
			}

			url[key].match(/\d[x]\d/g) => 4x4 or 32x32
			*/

			data[url[key].match(/\d{1,6}[x]\d{1,6}/g)] = await response.json();
		}
	}

	return data;
}

function draw(imgColors, size){
	imgColors.forEach(function(row, indexRow) {
		row.forEach( function(column, indexColumn) {
			if(Array.isArray(column)){
				context.fillStyle = `rgba(${column[0]}, ${column[1]}, ${column[2]}, ${column[3]})`;
			} 
			else {
				context.fillStyle = `#${column}`;
			}

			context.fillRect(indexColumn * size, indexRow * size, size, (indexColumn + 1) * size);
		});        
	});
}

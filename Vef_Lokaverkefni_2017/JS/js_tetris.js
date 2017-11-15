//defin-ar canvas sem við vinnum með
const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');
//Teiknar canvas-inn í browser og gefir honum list
context.fillstyle = '#000';
context.fillRect(0, 0, canvas.width, canvas.height);

//geymir einn af kubbunum í matrix, array inni í array, nota til að kanna virkni
const matrix = [

[0, 0, 0],
[1, 1, 1],
[0, 1, 0],

];
//keyra til að teikna kassa
function drawMatrix(matrix, offset)
{
	matrix.forEach(row, y) => 
	{
		row.forEach(value, x) =>
		{
			if (value !== 0) 
			{
				context.fillstyle = 'red';
				context.fillRect(x + offset.x, y + offset.y, 1, 1);
			}
		});
	});
}

drawMatrix(matrix, {x: 5, y: 5});
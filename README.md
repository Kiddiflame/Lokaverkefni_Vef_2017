# Lokaverkefni_Vef_2017

Þetta verkefni gengur út á að búa til algjörlega javascript keyrða útgáfu af leiknum tetris. 
Í leiknum á user-inn auðvitað að geta spilað leikinn eins og hann á að vera, gefa ákveðna stigagjöf fyrir hversu margar línur notandi eyðir í einu

<br> Notað er javascript til að teikna bakgrunninn og kubbanna sem notandinn raðar upp
Ef notandi tapar, það er, er ekki hægt að birta nýjan kubb í borðið endurstillist leikurinn og getur notandinn ákveðið hvort að leikurinn byrjar aftur. Stig núllstillast við það

<br>Notað er canvas til að keyra upp og teikna allt upp í browser-num.
<br>Notað er matrix til að geyma alla kubbana sem eru teiknaðir
<br>Held í boolean til að ákveða hvenær leikurinn er búinn eða ekki

Link: http://tsuts.tskoli.is/2t/1211992469/Vef_Lokaverkefni_2017/index.html

<html>
	<head>
		<title>Tetris game</title>
		<link rel="stylesheet" href="CSS/stylesheet.css">
	</head>
	<body>
		<div id="Start_btn">
			<p>Start</p>
		</div>
		<div id="Music_btn">
			<p>Music</p>
		</div>
		
		<div id="score"></div>
		
		<canvas id = "tetris" width = "240" height = "400"></canvas>

	</body>
		<script src = "JS/js_tetris.js"></script>
		<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>

	<audio id="Music_track">
		<source src="Resources/Tetris_theme.mp3">
	</audio>
<html>

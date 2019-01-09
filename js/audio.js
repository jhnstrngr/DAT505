// get audio context depending on browser
const AudioContext = window.AudioContext || window.webkitAudioContext;

// instanciate context
const audioCtx = new AudioContext();

// find and select audio HTML element
const audioElement = document.querySelector("audio");

// load sound from audio element
const source = audioCtx.createMediaElementSource(audioElement);
// There are also possibilities to use the microphone or loads
// an online file.

// create analyzer
const analyzer = audioCtx.createAnalyser();

// Track has two connections, one into analyzer
// and other into 'destination' to provide sound
source.connect(analyzer);
source.connect(audioCtx.destination);

// Analyzer uses Fast Fourier Transform (google that)
analyzer.fftSize = 2048; // default value

var bufferLength = analyzer.frequencyBinCount;
// As we are getting byte data we need an unsigned 8 bit integer array
// For getFloatTimeDomainData you need a Float32Array instead
var dataArray = new Uint8Array(bufferLength);
analyzer.getByteTimeDomainData(dataArray);

console.log({ bufferLength });

$(document).ready(function () {
	init();
	function init(){
		var current = 0;
		var audio = $('#audio');
		var playlist = $('#playlist');
		var tracks = playlist.find('li a');
		var len = tracks.length - 1;
		audio[0].volume = .10;
		audio[0].play();
		playlist.on('click','a', function(e){
			e.preventDefault();
			link = $(this);
			current = link.parent().index();
			run(link, audio[0]);
		});
		audio[0].addEventListener('ended',function(e){
			current++;
			if(current == len){
				current = 0;
				link = playlist.find('a')[0];
			}else{
				link = playlist.find('a')[current];
			}
			run($(link),audio[0]);
		});
	}
	function run(link, player){
			player.src = link.attr('href');
			par = link.parent();
			par.addClass('active').siblings().removeClass('active');
			player.load();
			player.play();
	}
});


// function loop() {
//   requestAnimationFrame(loop);
//   analyzer.getByteTimeDomainData(dataArray);
//   console.log(
//     dataArray[100] / 128,
//     dataArray[200] / 128,
//     dataArray[300] / 128,
//     dataArray[400] / 128,
//     dataArray[500] / 128,
//     dataArray[600] / 128,
//     dataArray[700] / 128,
//     dataArray[800] / 128,
//     dataArray[900] / 128,
//     dataArray[1000] / 128
//   )
// }
// loop();

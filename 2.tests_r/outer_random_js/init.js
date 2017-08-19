//https://github.com/davidbau/seedrandom
var randomArray = [];
var randoms = 1;

if (localStorage.getItem("randoms")) {
	randoms = localStorage.getItem("randoms");
	randomArray = JSON.parse(localStorage.getItem("randomArray"));
} else {
	var seed = Math.seedrandom(); // Use prng with an automatic seed.
	var rand = Math.random();
	randomArray.push(rand);
	$('#rand').html(rand);
}


$('#randoms').html(randoms);

function reseed(event, count) {      // Define a custom entropy collector.
  var t = [];
  function w(e) {
    t.push([e.pageX, e.pageY, +new Date]);
	$('#moves').html(t.length);
    if (t.length < count) { return; }
    document.removeEventListener(event, w);
    Math.seedrandom(t, { entropy: true });
	var rand = Math.random();
	randomArray.push(rand);
	randoms++;
	$('#rand').html(rand);
	$('#randoms').html(randoms);
	console.log(randomArray);
	reseed('mousemove', 100);
	localStorage.setItem("randomArray", JSON.stringify(randomArray));
	localStorage.setItem("randoms", randoms);
  }
  document.addEventListener(event, w);
}
reseed('mousemove', 100);            // Reseed after 100 mouse moves.

function save() {
	$.ajax({
		type: 'POST',
		cache: false,
		url: './save_data.php',
		data : {'data' : randomArray},
		//other settings
		success: function(json) {
			alert('done');
		}
	});
}
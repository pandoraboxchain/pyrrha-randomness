
var cryptoObj = window.crypto || window.msCrypto; // для IE 11
var randomArray = new Uint32Array(1000);
cryptoObj.getRandomValues(randomArray);
save();

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
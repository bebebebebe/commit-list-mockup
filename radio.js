$(document).ready(function(){

// stuff that would be determied on back end in node version



	var source = $("#revisions-template").html();
	var template = Handlebars.compile(source);



	Handlebars.registerHelper('formatHash', function(hash){
		return hash.slice(0,10);
	});

	Handlebars.registerHelper('formatDate', function(timestamp){
		return timestamp.slice(4,21);
	});

	Handlebars.registerHelper('checked', function(index){
		return index === 1 ? "checked='checked'" : null;
	});

	var rows = [{commitHash: '7c66af17c773bfcebe32583b9e9b1e03b9232dc8', timestamp: 'Fri Jan 31 2014 23:54:34 GMT+0000 (UTC)', numtests: 159385},
				{commitHash: '023ac3f0f4fa91a86d932189f771a7eda2c6093e', timestamp: 'Wed Jan 29 2014 17:57:29 GMT+0000 (UTC)', numtests: 159388},
				{commitHash: '344bf6593bb6624d7cf62673f7b861ab0fb5bfb5', timestamp: 'Fri Jan 17 2014 22:14:46 GMT+0000 (UTC)', numtests: 159407},
				{commitHash: '42396f8c977169641f76e0c23e0d84e0fad780c0', timestamp: 'Fri Jan 17 2014 00:17:55 GMT+0000 (UTC)', numtests: 159408},
				{commitHash: 'cd85d32280f63e14e95fd303d2f47eba3e9f1987', timestamp: 'Thu Jan 16 2014 02:26:56 GMT+0000 (UTC)', numtests: 159411},
				{commitHash: '5db8e91b576174f3c107a95bfe18e699ede87e61', timestamp: 'Wed Jan 08 2014 18:36:34 GMT+0000 (UTC)', numtests: 159383}
	];

	var revisions = [];
	for (var i=0; i<rows.length; i++) {
		var row = rows[i];
		var revision = {hash: row.commitHash, date: row.timestamp, tests: row.numtests};
		if (i+1 < rows.length) {
			revision.regUrl = {url: '/regressions/between/' + rows[i+1].commitHash + '/' + row.commitHash, name: '-'};
			revision.fixUrl = {url: '/fixes/between/' + rows[i+1].commitHash + '/' + row.commitHash, name: '+'};
		} else {
			revision.regUrl = '';
			revision.fixUrl = '';
		}
		revisions.push(revision);
	}

	var data = {
		heading: 'List of all commits',
		header: ['Commit hash', 'Timestamp', 'Tests', '-', '+'],
		row: revisions
	};
	var html = template(data);
	$('body').append(html);

// "front end"

// add links for comparing regressions and fixes
var setCompareLinks = function(oldHash, newHash) {
	$('#compare-reg').attr('href', '/regressions/between' + '/' + oldHash + '/' + newHash);
	$('#compare-fix').attr('href', '/fixes/between' + '/' + oldHash + '/' + newHash);
};

var numRows = $('table tr').length;
var oldHash = $('tr:eq(1) > :first-child').text();
var newHash = $('tr:eq(2) > :first-child').text();
setCompareLinks(oldHash, newHash);

// select radio buttons; hide irrelevant ones
var latestButton = $('tr:eq(1)').find('input[name="new"]');
var prevButton = $('tr:eq(2)').find('input[name="old"]');
latestButton.attr('checked', 'checked');
prevButton.attr('checked', 'checked');
$('tr:eq(1)').find('input[name="old"]').css('visibility', 'hidden');
for (var i=2; i<numRows; i++) {
	$('tr:eq(' + i + ')').find('input[name="new"]').css('visibility', 'hidden');
}

// update regression/fixes links when radio buttons are checked
$('input[name="old"]').on('click', function(){
	oldHash = this.value;
	setCompareLinks(oldHash, newHash);
	var index = $(this).closest('tr').index();
	for (var i=1; i < numRows; i++) {
		if (i < index){
			$('tr:eq(' + i + ') td input[name="new"]').css('visibility', 'visible');
		} else {
			$('tr:eq(' + i + ') td input[name="new"]').css('visibility', 'hidden');
		}
	}
});

$('input[name="new"]').on('click', function(){
	newHash = this.value;
	setCompareLinks(oldHash, newHash);
	var index = $(this).closest('tr').index();
	for (var i=1; i < numRows; i++) {
		if (i > index) {
			$('tr:eq(' + i + ') td input[name="old"]').css('visibility', 'visible');
		} else {
			$('tr:eq(' + i + ') td input[name="old"]').css('visibility', 'hidden');
		}
	}
});


	// var buttonStatus = function(){
	// 	var newIndex = $('input.button[name="new"].chosen').closest('tr').index();
	// 	var oldIndex = $('input.button[name="old"].chosen').closest('tr').index();
	// 	var rows = $('table tr').length;
	// 	for (var i=1; i<rows; i++){
	// 		if (i >= oldIndex) {
	// 			$('tr:eq(' + i + ') td input[name="new"]').css('visibility', 'hidden');
	// 		} else if (i <= newIndex) {
	// 			$('tr:eq(' + i + ') td input[name="old"]').css('visibility', 'hidden');
	// 		} else {
	// 			$('tr:eq(' + i + ') td input').css('visibility', 'visible');
	// 		}
	// 	}
	// };

	// $("input.button[name='new']").on('click', function(){
	// 	//$('tr').removeClass('selected');
	// 	//$(this).closest('tr').addClass('selected');
	// 	$("input.button[name='new']").removeClass('chosen');
	// 	$(this).addClass('chosen');
	// 	buttonStatus();
	// });

	// $("input.button[name='old']").on('click', function(){
	// 	$("input.button[name='old']").removeClass('chosen');
	// 	$(this).addClass('chosen');
	// 	buttonStatus();
	// });

});
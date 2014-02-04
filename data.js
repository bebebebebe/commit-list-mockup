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
			revision.regUrl = '/regressions/between/' + rows[i+1].commitHash + '/' + row.commitHash;
			revision.fixUrl = '/fixes/between/' + rows[i+1].commitHash + '/' + row.commitHash;
		};
		revisions.push(revision);
	}

	var data = {
		cutoff: '8 January 2014',
		revision: revisions
	};
	var html = template(data);

	$('body').append(html);


// "front end"

	$('li').last().find('.compare').hide();

	var selected = {hash: null, index: null};

	$('li').on('click', function(){
		var hash = $(this).attr('commit');
		if (selected.hash === hash) {
			selected = {hash: null, index: null};
			$(this).find('.compare').show();
			$(this).children('.hash').css('color', '');
			$(this).css('background', '');
			$('li').last().find('.compare').hide();
			$('li').each(function(){
				$(this).find('.otherRev').text('previous revision');
				var nextHash = $(this).next().attr('commit');
				var thisHash = $(this).attr('commit');
				$(this).find('.reg').children('a').attr('href', '/regressions/between/' + nextHash + '/' + thisHash);
				$(this).find('.fix').children('a').attr('href', '/fixes/between/' + nextHash + '/' + thisHash);
			});
		} else {
			selected = {hash: hash, index: $(this).index()};
			$('li').last().find('.compare').show();
			$('li').each(function(){
				var afterSelected = (selected.index > $(this).index());
				var oldHash = afterSelected ? selected.hash : $(this).attr('commit');
				var newHash = afterSelected ? $(this).attr('commit') : selected.hash;
				$(this).find('.reg').children('a').attr('href', '/regressions/between/' + oldHash + '/' + newHash);
				$(this).find('.fix').children('a').attr('href', '/fixes/between/' + oldHash + '/' + newHash);
				$(this).css('background', '');
				$(this).find('.compare').show();
				$(this).find('.otherRev').html('revision <span class=hash>' + selected.hash.slice(0,10) + '</span>');
				$(this).children('.hash').css('color', '');
			});
			$(this).css('background', 'rgba(252, 252, 226, 1)');
			$(this).children('.hash').css('color', 'rgb(65,131,196)');
			$(this).find('.compare').hide();
		}
	});

});


$(document).ready(function(){

// stuff that would be determied on back end in node version
	var source = $("#revisions-template").html();
	var template = Handlebars.compile(source);

	var rows = [{commitHash: '58sl384jd', timestamp: '3 January 2014', numtests: 1203},
				{commitHash: 's9d8dks7e', timestamp: '12 January 2014', numtests: 2938},
				{commitHash: 'sldf8293m', timestamp: '18 December 1013', numtests: 120392},
				{commitHash: 'b39clskd9', timestamp: '15 December 1013', numtests: 130293}
	];

	var revisions = [];
	for (var i=0; i<rows.length; i++) {
		var row = rows[i];
		var revision = {hash: row.commitHash, date: row.timestamp, tests: row.numtests};
		if (i+1 < rows.length) {
			revision.regUrl = '/regressions/between/' + rows[i+1].commitHash + '/' + row.commitHash;
			revision.regName = '-';
			revision.fixUrl = '/fixes/between/' + rows[i+1].commitHash + '/' + row.commitHash;
			revision.fixName = '+';
		};
		revisions.push(revision);
	}

	var data = {
		cutoff: '15 December, 2013',
		revision: revisions
	};
	var html = template(data);

	$('body').append(html);


// "front end"

	var selected = {hash: null, index: null};

	$('li').on('click', function(){
		var hash = $(this).attr('commit');
		if (selected.hash === hash) {
			selected = {hash: null, index: null};

			$(this).css('background', '');
			$('li').each(function(){
				var nextHash = $(this).next().attr('commit');
				var thisHash = $(this).attr('commit');
				$(this).find('.reg').children('a').attr('href', '/regressions/between/' + nextHash + '/' + thisHash);
			});
		} else {
			selected = {hash: hash, index: $(this).index()};

			console.log(selected);
			$('li').each(function(){
				var afterSelected = (selected.index > $(this).index());
				var oldHash = afterSelected ? selected.hash : $(this).attr('commit');
				var newHash = afterSelected ? $(this).attr('commit') : selected.hash;
				$(this).find('.reg').children('a').attr('href', '/regressions/between/' + oldHash + '/' + newHash);
				$(this).css('background', '');
				$(this).find('.reg').show();
			});
			$(this).css('background', 'rgba(65,131,196,0.5)');
			$(this).find('.reg').hide();
		}
	});

	$('li').each(function(){

		if (selected) {
			$(this).find('.reg').children('a').attr('href', selected)
		}
	});

});


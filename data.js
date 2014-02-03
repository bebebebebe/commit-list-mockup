$(document).ready(function(){
	var source = $("#revisions-template").html();
	var template = Handlebars.compile(source);

	var rows = [{commitHash: '58sl384jd', timestamp: '3 January 2014', numtests: 1203},
				{commitHash: 's9d8dks7e', timestamp: '12 January 2014', numtests: 2938},
				{commitHash: 'sldf8293m', timestamp: '15 December 1013', numtests: 120392}
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


	// $('li').hover(
 //       function(){ $(this).addClass('hover') },
 //       function(){ $(this).removeClass('hover') }
	// );
	// $('li').on('click', function(){$(this).addClass('selected')});

});


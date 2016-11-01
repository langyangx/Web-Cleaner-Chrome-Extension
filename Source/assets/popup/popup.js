document.addEventListener('DOMContentLoaded', function() {
	var milestones = chrome.extension.getBackgroundPage().milestones;
	var stats = chrome.extension.getBackgroundPage().stats;
	document.getElementById('button-more').addEventListener('click', function() {
		chrome.extension.getBackgroundPage().openProgress();
	}, false);
	document.getElementById('button-reset').addEventListener('click', function() {
		stats.dbg.reset();
	}, false);
	document.getElementById('button-fake').addEventListener('click', function() {
		stats.dbg.fake();
	}, false);

	stats.listen(['installed', 'milestone', 'cummed', 'milked', 'ruined'], displayEvents);
	addEventListener('unload', function() {
		stats.unlisten(['installed', 'milestone', 'cummed', 'milked', 'ruined'], displayEvents);
	});

	displayEvents(stats.getEvents(['milestone', 'cummed', 'milked', 'ruined']));

	function displayEvents(events) {
		var installed, orgasm, milestone;
		events.forEach(function(e) {
			if (e.type === 'milestone') {
				milestone = e;
			} else if (e.type === 'installed') {
				installed = e;
			} else {
				orgasm = e;
			}
		});
		[installed, orgasm, milestone].filter(Boolean).sort(function(a, b) {
			return a.time - b.time;
		}).forEach(function(e) {
			if (e.type === 'installed') {
				$('#container').find('[data-type]').remove();
				return;
			}
			var $item = $('<div><div class="inline"><img align="top" /> <span></span></div><div class="time inline"></span></div></div>')
			var type, $img = $item.find('img'), $msg = $item.find('span').first(), $time = $item.find('.time');
			if (e.type === 'milestone') {
				type = 'milestone';
				$img.attr('src', '../img/silk/award_star_bronze_2.png');
				$msg.text(milestones.name(e.value.stage, e.value.index) + ' Achieved');
			} else {
				type = 'orgasm';
				$img.attr('src', '../img/silk/lock_break.png');
				$msg.text('You ' + e.type);
			}
			var d = new Date(e.time);
			$time.attr('title', d.toDateString()).text(formatTime(d));
			$('#container').find('[data-type="' + type + '"]').remove();
			$item.attr('data-type', type);
			$('#container').append($item);
		});
	}

	function updateMS() {
		var msItem = document.getElementById('item-milestone');
		var msLabel = document.getElementById('milestone-text');
		var msTime = document.getElementById('milestone-time');
		var ms = milestones.getLast();
		console.log(ms);
		if (ms && Date.now() - ms.time < 24*60*60*1000) {
			msLabel.textContent = ms.name;
			msTime.textContent = formatTime(new Date(ms.time));
			msItem.style.display = 'block';
		} else {
			msItem.style.display = 'none';
		}


	}

		function formatTime(d) {
			var hours = d.getHours();
			var minutes = d.getMinutes();
			var ampm = 'AM';
			if (hours >= 12) {
				ampm = 'PM';
				hours -= 12;
			}
			if (hours === 0) {
				hours = 12;
			}
			var time = ('0' + hours).slice(-2) + ':' + ('0' + minutes).slice(-2) + ' ' + ampm;
			var now = new Date();
			if (Math.abs(now.getTime() - d.getTime()) >= 12*60*60*1000 || d.getDate() !== now.getDate() || d.getMonth() !== now.getMonth() || d.getFullYear() !== now.getFullYear()) {
				time = 'Sun, Mon,Tue,Wed,Thu,Fri,Sat'.split(',')[d.getDay()] + ' @ ' + time;
			}
			return time;
		}
}, false);
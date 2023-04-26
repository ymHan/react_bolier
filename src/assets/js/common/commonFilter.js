/********************************************************************************************************************
 * commonFilter Util
 ********************************************************************************************************************/
var commonFilter = {
	daterangepicker : {
		init : function() {
			$('#cal-btn').daterangepicker({
				showShortcuts: false,
				startDate: '20211101',
				endDate: moment().subtract(1, 'weeks').endOf('week'),
				maxDate: moment().add("2","y"),
				locale: {
					format: 'YYYY.MM.DD',
				}
			});
			$(".searchDateBtn").click(function(){
				var searchDateType = $(this).attr('data-search-type');
				if( 'CUSTOM' != searchDateType) {
					$(".searchDateBtn").removeClass("color_red");
					$(this).addClass("color_red");
					if( 'DATE_ALL' === searchDateType) {
						dataList.startDate = '20211101';
						dataList.endDate = moment().add("1","M").format('YYYYMMDD');
					}
					else if( 'M1' === searchDateType) {
						dataList.startDate = moment().add('-1', 'M').format('YYYYMMDD');
						dataList.endDate = moment().format('YYYYMMDD');
					}
					else if( 'M3' === searchDateType) {
						dataList.startDate = moment().add('-3', 'M').format('YYYYMMDD');
						dataList.endDate = moment().format('YYYYMMDD');
					}
					else if( 'M6' === searchDateType) {
						dataList.startDate = moment().add('-6', 'M').format('YYYYMMDD');
						dataList.endDate = moment().format('YYYYMMDD');
					}
					else if( 'Y1' === searchDateType) {
						dataList.startDate = moment().add('-1', 'y').format('YYYYMMDD');
						dataList.endDate = moment().format('YYYYMMDD');
					}
					
					$('#cal-btn').data('daterangepicker').setStartDate(dataList.startDate);
					$('#cal-btn').data('daterangepicker').setEndDate(dataList.endDate);
					dataList.reDrawTable(searchDateType);
				}
			});
			$('#cal-btn').on('apply.daterangepicker', function(ev, picker) {
				$(".searchDateBtn").removeClass("color_red");
				$(this).addClass("color_red");
				dataList.startDate = picker.startDate.format('YYYYMMDD');
				dataList.endDate = picker.endDate.format('YYYYMMDD');
				dataList.reDrawTable('CUSTOM');
			});
			
			$(".searchFilterBtnAll").click(function(){
				$(".searchDateBtn").removeClass("color_red");
				$(".searchSelectBox").removeClass("color_red");
				commonFilter.setDefaultFilterParameterInit();
				dataList.reDrawTable('ALL');
			});
		}
	},
	defaultRedrawTable : function(type) {
		var url = dataList.actionUrl;
		if( type != 'ALL') {
			url = dataList.getFilterParameter(url);
		}
		else {
		}
		setTimeout(function(){
			dataList.table.ajax.url(url).load();
		}, 100);
	},
	defaultRedrawTable : function(type, target) {
		var url = target.actionUrl;
		if( type != 'ALL') {
			url = target.getFilterParameter(url);
		}
		else {
		}
		setTimeout(function(){
			target.table.ajax.url(url).load();
		}, 100);
	},
	getDefaultFilterParameter : function(url){
		if( $('#searchFilterTable').hasClass('act') && dataList.searchString != '') {
			url = commonUrl.appendParameter( url, 'searchString', dataList.searchString);
		}
		url = commonUrl.appendParameter( url, 'start_date', dataList.startDate);
		url = commonUrl.appendParameter( url, 'end_date', dataList.endDate);
		
		return url;
	},
	getDefaultFilterParameter : function(url, target){
		if( $('#searchFilterTable').hasClass('act') && target.searchString != '') {
			url = commonUrl.appendParameter( url, 'searchString', target.searchString);
		}
		url = commonUrl.appendParameter( url, 'start_date', target.startDate);
		url = commonUrl.appendParameter( url, 'end_date', target.endDate);
		
		return url;
	},
	setDefaultFilterParameterInit : function() {
		dataList.startDate = '20211101';
		dataList.endDate = moment().format('YYYYMMDD');
		$('#cal-btn').data('daterangepicker').setStartDate(dataList.startDate);
		$('#cal-btn').data('daterangepicker').setEndDate(dataList.endDate);
		dataList.searchString = '';
		$('#searchFilterTable input').val('');
		$(".searchSelectBox").each(function() {
			$(this).val('');
		});

		dataList.setCustomFilterParameterInit();
	},
	venuePageEvent : function(venue_id, system_id) {
		$(".filterBtn").click(function(){
			$(".filterBtn").removeClass("color_red");
			$(this).addClass("color_red");
			
			var searchDateType = $(this).attr('data-search-type');
			if( 'NODE' == searchDateType) {
				document.location = "/mng/page/node?venue_id=" + venue_id + "&system_id=" + system_id;
			}
			else if( 'RULE' == searchDateType) {
				document.location = "/mng/page/rule?venue_id=" + venue_id + "&system_id=" + system_id;
			}
			else if( 'SCALE' == searchDateType) {
				document.location = "/mng/page/scale?venue_id=" + venue_id + "&system_id=" + system_id;
			}
			else if( 'PRC' == searchDateType) {
				document.location = "/mng/page/monit?venue_id=" + venue_id + "&system_id=" + system_id;
			}
			else if( 'GROUP' == searchDateType) {
				document.location = "/mng/page/group?venue_id=" + venue_id + "&system_id=" + system_id;
			}
			else if( 'CHANNEL' == searchDateType) {
				document.location = "/mng/page/channel?venue_id=" + venue_id + "&system_id=" + system_id;
			}
			else if( 'EVENT' == searchDateType) {
				document.location = "/mng/page/event?venue_id=" + venue_id + "&system_id=" + system_id;
			}
		});
	}
};
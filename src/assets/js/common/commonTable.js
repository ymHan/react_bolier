/********************************************************************************************************************
 * Datatable custom
 * HTML : <table id="dataTable" class="table table-striped ver_mid datatable" width="100%"></table>
 * script : var dataTableConfig = {...}
 * 			commonTable.drawTable(dataTableConfig);
 * configs
 * 	- selector : table id (include '#')
 *  - sAjaxSource : data get url (include param and return type is JSON(List<map>)
 *  - columns
 *  	. data : column key
 *  	. title : display header name (enable HTML)
 *  	. className : css style
 *  	. type : column cell value rendering(enable function) ex)number comma date time date_time 
 *  	. preFix : 'preFix' + column cell value
 *  	. postFix : column cell value + 'postFix'
 *  	. width : set column cell width (%, px) ex)100px 50%
 *  	. align : set column cell align. default left. ex)left center right
 *  	. link : set action link(String type).  ex)callBackFunction
 *  	. link_title : set link title
 *  - order : sort order (column index[0,1,2,...], sort type[asc,desc]) 
 ********************************************************************************************************************/
commonTable = function() {
};

commonTable.prototype = {
	table: null,
	columnsTypeSeperator : ' ',
	config : {
		destroy : true,
		selector : '',
		dom : 'Bfrtipl',
		paging : true,
		ordering : true,
		info : true,
		filter : true,
		lengthChange : true,
//		scrollY : 200,
//		scrollX : true,
		bAutoWidth : true,
		order : [],
		sAjaxSource : '',
		fnDrawCallback : function(oSettings) {
			//console.log(oSettings.json);
			//oSettings.json.data.content
		},
		sServerMethod : 'POST',
		serverSide : true,
		listTitle : '',
		exportColumns : [],
		columns : [],
		useButtons : true,
		buttons : [
			{
	            extend: 'excel',
	            text: '<i class="common-document-file-xls"></i>',
	            title : '', 
	            exportOptions: {},
	            className: 'btn btn-trans wid_33 datatableBtn excelBtn'
	        },
	    	{
	    		extend: 'pdf',
	    		text: '<i class="common-document-file-pdf"></i>',
	    		 title : '', 
		            exportOptions: {},
	    		className: 'btn btn-trans wid_33 datatableBtn pdfBtn'
	    	},
	    	{
	    		extend: 'print',
	    		text: '<i class="common-print"></i>',
	    		 title : '', 
		            exportOptions: {},
	    		className: 'btn btn-trans wid_33 datatableBtn printBtn'
	    	},
		],
		lengthMenu : [ [10, 20, 50, 100, 9999999], [10, 20, 50, 100,'All'] ],
		pageLength: 20,
//		select: {
//			style: 'multi+shift'
//		},
		language: {
			"lengthMenu": "_MENU_",
			"search": "",
			"searchPlaceholder": "검색",
			//"info": "About <span> _TOTAL_ </span> shown results",		
			//"info": "About <span> "+app_user_list.totalLength+" </span> shown results",		
			"paginate": {
				"previous": "<i class='common-chevron-left'></i>",
				"next": "<i class='common-chevron-right'></i>"
			},
			"info": "총 _TOTAL_ 건",
			"infoEmpty" : "총 0 건",
			"infoFiltered" : ""
		}
	},
	drawTable : function(customConfig) {
		this._setConfig(customConfig);
		this._setColumnRender();
		this._setButtons();
		this.table = this._draw();
		this._setEvent();
		return this.table;
	},
	_setConfig : function(config) {
		this.config = $.extend(true, {}, this.config, config);
	},
	_setColumnRender : function() {
		var _self = this;
		var option = this.config;
		$(option.columns).each(function() {
			var $columnObj = $(this)[0];
			$columnObj.render = function(data, type, full) {
				if(commonObject.isNotNull($columnObj.type)) {
					data = _self._setColumnsType($columnObj, data);
				}
				if(commonObject.isNotNull($columnObj.preFix)) {
					data = _self._setColumnsPreFix($columnObj, data);
				}
				if(commonObject.isNotNull($columnObj.postFix)) {
					data = _self._setColumnsPostFix($columnObj, data);
				}
				if(commonObject.isNotNull($columnObj.link)) {
					data = _self._setColumnsLink($columnObj, data, full);
				}
				return data;
			}
			if(commonObject.isNotNull($columnObj.align)) {
				_self._setColumnsAlign($columnObj);
			}
		});
	},
	_setColumnsType : function($columnObj, data) {
		if( typeof $columnObj.type === 'string') {
			var columnsTypeList = $columnObj.type.split(this.columnsTypeSeperator);
			$(columnsTypeList).each(function() {
				var columnsType = this.toString();
				switch( columnsType){
					case 'number': 			data = data.toString();break;
					case 'comma': 			data = commonString.comma(data);break;
					case 'date': 			data = commonDate.dateFormat(data);break;
					case 'time': 			data = commonDate.timeFormat(data);break;
					case 'date_time': 		data = commonDate.dateTimeFormat(data);break;
					case 'date_time_br': 	data = commonDate.dateTimeBRFormat(data);break;
					case 'date_time_2': 	data = commonDate.dateTimeFormat2(data);break;
					case 'date_time_2br': 	data = commonDate.dateTimeFormat2BR(data);break;
					case 'comma_2_br': 		data = commonString.comma2Br(data);break;
				}
			});
		}
		else if( typeof $columnObj.type === 'function') {
			data = $columnObj.type(data);
		}
		return data;
	},
	_setColumnsPreFix : function($columnObj, data) {
		return $columnObj.preFix + data;
	},
	_setColumnsPostFix : function($columnObj, data) {
		return data + $columnObj.postFix;
	},
	_setColumnsLink : function($columnObj, data, full) {
		var linkText = data;
		if( linkText==null || linkText==''){
			return '-';
		}
		if(commonObject.isNotNull($columnObj.link_title)) {
			linkText = $columnObj.link_title;
		}
		data = '<a href="javascript:void(0);" class="reportLink pointer" onclick="javascript:' + $columnObj.link + '(\'' + commonObject.changeObj2String(full) + '\');">' + linkText + '</a>';
		return data;
	},
	_setColumnsAlign : function($columnObj) {
		var align = $columnObj.align;
		if(commonObject.isNull($columnObj.className)) {
			$columnObj.className = 'text-' + align;
		}
		else {
			$columnObj.className += ' text-' + align;
		}
	},
	_setButtons : function() {
		if( this.config.useButtons === true) {
			var listTitle = this.config.listTitle;
			var exportColumns = this.config.exportColumns;
			$(this.config.buttons).each(function() {
				this.title = listTitle;
				this.exportOptions = {columns: exportColumns};
			});
		}
		else {
			this.config.buttons = [];
		}
	},
	_draw : function() {
		return $(this.config.selector).DataTable(this.config);
	},
	_setEvent : function() {
		// 상단 통합 검색
		$('#searchFilterTable input').keypress(function (e) {
	        if (e.which == 13){
	        	dataList.searchString = $(this).val();
				dataList.reDrawTable("SEARCH");
	        }
		});
		
		
		// 테이블 전체 선택 클릭 이벤트
		/*$('#checkAllMyData').off().click ( function () {
			if ( $('#checkAllMyData').is(':checked')) {
				table.rows( { search: 'applied' } ).select();
			}
			else {
				table.rows( { search: 'applied' } ).deselect();
			}
		});*/
		
		/*table.on('click', 'tr', function() {
			if( $(this).hasClass('selected') === true) {
				table.rows(this).deselect();
			}
			else {
				table.rows(this).select();
			}
		});*/
	}
};
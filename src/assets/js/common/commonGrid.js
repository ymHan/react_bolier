/********************************************************************************************************************
 * 
 ********************************************************************************************************************/
commonGrid = function() {
};

commonGrid.prototype = {
	grid: null,
	columnsTypeSeperator : ' ',
	config : {
		selector : '',
		fields: [],
	    data: [],
	 
	    autoload: true,
	    controller: {
	        loadData: $.noop,
	        insertItem: $.noop,
	        updateItem: $.noop,
	        deleteItem: $.noop
	    },
	    
	    height: "100%",
        width: "100%",
	 
	    heading: true,
	    filtering: false,
	    inserting: true,
	    editing: true,
	    selecting: true,
	    sorting: true,
	    paging: true,
	    pageLoading: false,
	 
	    rowClass: function(item, itemIndex) {
		},
	    rowClick: function(args) {
			//console.log(args.item);
		},
	    rowDoubleClick: function(args) {
			if(this.editing) {
                this.editItem($(args.event.target).closest("tr"));
            }
	  	},
	 
	    noDataContent: "Not found",
	 
	    confirmDeleting: true,
	    deleteConfirm: function(item) {
			console.log(item);
            return "\"["+item.id + "]" + item.name+"\""+ "을 삭제 하시겠습니까?";
        },
	 
	    pagerContainer: null,
	    pageIndex: 1,
	    pageSize: 9999,
	    pageButtonCount: 15,
	    pagerFormat: "{pages}",
	    pagePrevText: "",
	    pageNextText: "",
	    pageFirstText: "",
	    pageLastText: "",
	    pageNavigatorNextText: "...",
	    pageNavigatorPrevText: "...",
	    
	    onItemInserted: function(item) {
			console.log(item);
		},
	 
	    invalidNotify: function(args) {
		
		},
	    invalidMessage: "Invalid data entered!",
	 
	    loadIndication: true,
	    loadIndicationDelay: 500,
	    loadMessage: "Please, wait...",
	    loadShading: true,
	 
	    updateOnResize: true,
	 
	    rowRenderer: null,
	    headerRowRenderer: null,
	    filterRowRenderer: null,
	    insertRowRenderer: null,
	    editRowRenderer: null
	},
	drawGrid : function(customConfig) {
		this._setConfig(customConfig);
		this.grid = this._draw();
		this._setEvent();
		return this.grid;
	},
	_setConfig : function(config) {
		this.config = $.extend(true, {}, this.config, config);
	},
	_draw : function() {
		return $(this.config.selector).jsGrid(this.config);
	},
	_setEvent : function() {
	}
};






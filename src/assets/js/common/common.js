/********************************************************************************************************************
 * Ajax Util
 * call	: ajax call
 ********************************************************************************************************************/
var commonAjax = {
	call : function(method, url, data) {
		var result;
		$.ajax({
			method : method,
			url : url,
			data : data,
			async : false,
			success : function(data) {
				if( typeof data === 'string') {
					document.location.href = '/mng/page/main';
				}
				else if( typeof data === 'object') {
					if(data.result == 'ok'){
						if (data.data) {
							result = data.data;
						} else {
							result = data;
						}
					} else {
						commonMsg.alert("SERVER ERROR!!!</br>code : " + data.code + "</br>message : 담당자에게 문의 주세요.", "error", 'small');
					}
				}
			},
			fail : function(err) {
				common.errorMsg(err);
			},
			error : function(err) {
				common.errorMsg(err);
			}
		});
		return result;
	},
	callAsync : function(method, url, data, callBackFunction) {
		var result;
		$.ajax({
			method : method,
			url : url,
			data : data,
			async : true,
			success : function(data) {
				if( typeof data === 'string') {
					document.location.href = '/mng/page/main';
				}
				else if( typeof data === 'object') {
					if(data.result == 'ok'){
						if (data.data) {
							result = data.data;
						} else {
							result = 'NONE';
						}
						callBackFunction(result);
					} else {
						commonMsg.alert("SERVER ERROR!!!</br>code : " + data.code + "</br>message : 담당자에게 문의 주세요.", "error", 'small');
					}
				}
			},
			fail : function(err) {
				common.errorMsg(err);
			},
			error : function(err) {
				common.errorMsg(err);
			}
		});
		return result;
	},
	callAll : function(method, url, data) {
		var result;
		$.ajax({
			method : method,
			url : url,
			data : data,
			async : false,
			success : function(data) {
				if( data.result == 'fail' && data.code=='9999'){
					alert('ERROR 발생');
				} else{
					result=data;
				}
			},
			fail : function(err) {
				common.errorMsg(err);
			},
			error : function(err) {
				common.errorMsg(err);
			}
		});
		return result;
	}
};

/********************************************************************************************************************
 * Object Util
 ********************************************************************************************************************/
var commonObject = {
	objReplaceDelimiter : '!%@$#',
	isNull : function(value) {
		if (typeof value === 'undefined' || value == null || value == 'null' || value == 'NULL' || value == '') { return true; }
		return false;
	},
	isNotNull : function(value) {
		return !this.isNull(value);
	},
	changeObj2String : function(obj) {
//		return JSON.stringify(obj).replaceAll('"', this.objReplaceDelimiter);
		
		return encodeURIComponent(JSON.stringify(obj));
	},
	changeString2Obj : function(value) {
//		value = value.replace(/(\n|\r\n)/g, '\\n');
//		return JSON.parse(value.replaceAll(this.objReplaceDelimiter, '"'));
		
		return JSON.parse(decodeURIComponent(value));
	}
};

/********************************************************************************************************************
 * Message Util
 * alert	: 메세지 창
 * confirm	: 확인 창
 ********************************************************************************************************************/
var commonMsg = {
	alert : function(message, title, size) {
		if ( ! size ) {
			if ( message.length < 20 ) size = 'small';
			else if ( message.length > 50 ) size = 'large';
			else size = 'medium';
		}
		bootbox.alert({
			title: title,
			message: message,
			size: size,
			backdrop: true
		});
		//$('.bootbox-alert .modal-content').draggable({
		//	handle: '.modal-header'
	    //});
	},
	confirm : function(message, callback, callerParam, size, title) {
		if ( ! size ) {
			if ( message.length < 20 ) size = 'small';
			else if ( message.length > 50 ) size = 'large';
			else size = 'medium';
		}
		if (typeof title === 'undefined' || title.length == 0){
			title = 'Info';						
		}
		bootbox.confirm({
			 message: message
			,title: '<i class="fa fa-info-circle"></i> ' + title
			,buttons: {
				 cancel: {
					label: '취소'
				 }
				,confirm: {
					label: '확인'
				}
			}
			,callback: function(result) {
				if( jQuery.isFunction(callback)) {
					callback(result, callerParam);
				}
			}
			,size: size
			,backdrop: true
		});
		//$('.bootbox-alert .modal-content').draggable({
		//	handle: '.modal-header'
	    //});
	}
	
	/*commonMsg.confirm('삭제하시겠습니까?', function(result, callerParam){
		if( result === true) {
			//commonMsg.alert('확인을 클릭하셨네요.', '삭제');
			commonMsg.alert('확인을 클릭하셨네요.');
		}
	});*/
};

/********************************************************************************************************************
 * Param Util
 * appendParameter : url뒤에 key=value 파라미터 붙인다.
 ********************************************************************************************************************/
var commonUrl = {
	appendParameter : function(url, key, value) {
		var delimiter = url.indexOf('?') > -1 ? '&' : '?';
		url += delimiter + key + '=' + value;
		return url;
	}
};

/********************************************************************************************************************
 * SelectBox Util
 * selectBox 데이터를 변경한다.
 ********************************************************************************************************************/
var commonSelect = {
	setListData : function(selector, listData, includeAll) {
		var selectBox =  $(selector);
		selectBox.children().remove();
		if ( typeof includeAll === 'undefined' || includeAll == true) {
			selectBox.append("<option value=''></option>");
			selectBox.append("<option value=''>전체</option>");
		}
		for(var key in listData){
			var listObj = listData[key];
			var styleCss = '';
			if( typeof listObj.level != 'undefined' && listObj.level == 1) {
				styleCss = "class='parentGroupLv1'";
			}
			selectBox.append("<option " + styleCss + " value='"+listObj.code+"'>"+listObj.name+"</option>");
		}
	}
};

/********************************************************************************************************************
 * String Util
 * comma : 숫자 3자리마다 콤마(,) 출력
 * null2Dash : null 값을 - 로 표현
 ********************************************************************************************************************/
var commonString = {
	comma : function(value) {
		if( commonObject.isNull(value)) {
			return value;
		}
		if ( value.toString().length < 3) {
			return value;
		}
		value = value.toString();
		var sign = '';
		if( value.indexOf('-') == 0) {
			sign = '-';
			value = value.substring(1, value.length);
		}
		var pointValue = '';
		if( value.indexOf('.') > -1) {
			pointValue = value.substring(value.indexOf('.'), value.indexOf('.') + 2);
			value = value.substring(0, value.indexOf('.'));
		}
	    var len, point, str;  
	    value = value + '';  
	    point = value.length % 3 ;
	    len = value.length;  
	   
	    str = value.substring(0, point);  
	    while (point < len) {  
	        if (str != '') str += ',';  
	        str += value.substring(point, point + 3);  
	        point += 3;  
	    }
	    return sign + str + pointValue;
	},
	null2Dash : function(value) {
		if( commonObject.isNull(value)) {
			return '-';
		}
		return value;
	},
	comma2Br : function(value) {
		if( commonObject.isNull(value)) {
			return value;
		}
		
		value = value.replaceAll(',', '<br>');
		return value;
	}
};

/********************************************************************************************************************
 * Number Util
 * intVal : String 값을 number로 형변환(숫자타입이 아니면 0 리턴)
 ********************************************************************************************************************/
var commonNumber = {
	intVal : function(value) {
		if( commonObject.isNull(value)) {
			return 0;
		}
		value = value.replaceAll(',', '');
		if( !$.isNumeric(value)) {
			return 0;
		}
	    return Number(value);
	}
};

/********************************************************************************************************************
 * Date Util
 * dateFormat 		: 날짜 포멧으로 변경 		ex)commonDate.dateFormat('20200225');			==> 2020-02-25
 * timeFormat 		: 시간 포멧으로 변경 		ex)commonDate.timeFormat('160853');				==> 16:08:53
 * dateTimeFormat 	: 날짜와 시간 포멧으로 변경	ex)commonDate.dateTimeFormat('20200225160853')	==> 2020-02-25 16:08:53
 ********************************************************************************************************************/
var commonDate = {
	dateFormater : 'yyyy-MM-dd',
	timeFormater : 'HH:mm:ss',
	dateSeperator : '/',
	timeSeperator : ':',
	dateFormat : function(value) {
		if(value === null) { return '-'; }
		if(!value) { return ''; }
	   	var date = new Date(this._getDateString(value));
		return date.format(this.dateFormater);
	},
	timeFormat : function(value) {
		if(value === null) { return '-'; }
		if(!value) { return ''; }
		var date = new Date(this._getDateString('19700101') + ' ' + this._getTimeString(value));
		return date.format(this.timeFormater);
	},
	dateTimeFormat : function(value) {
		if(value === null) { return '-'; }
		if(!value) { return ''; }
		var date = new Date(this._getDateTimeString(value));
		return date.format(this.dateFormater + ' ' + this.timeFormater);
	},
	dateTimeBRFormat : function(value) {
		if(value === null) { return '-'; }
		if(!value) { return ''; }
		var date = new Date(this._getDateTimeString(value));
		return date.format(this.dateFormater + '<br>' + this.timeFormater);
	},
	_getDateString : function(value) {
		var y = value.substr(0,4),
        m = value.substr(4,2),
        d = value.substr(6,2);
		return y + this.dateSeperator + m + this.dateSeperator + d
	},
	_getTimeString : function(value) {
		var h = value.substr(0,2),
	    m = value.substr(2,2),
	    s = value.substr(4,2);
		return h + this.timeSeperator + m + this.timeSeperator + s;
	},
	_getDateTimeString : function(value) {
		var date = value.substr(0, 8);
		var time = value.substr(8, 6);
		return this._getDateString(date) + ' ' + this._getTimeString(time);
	},
	getToday : function() {
		var now = new Date();
	    var year = now.getFullYear();
	    var month = now.getMonth() + 1;    //1월이 0으로 되기때문에 +1을 함.
	    var date = now.getDate();

	    if((month + "").length < 2){        //2자리가 아니면 0을 붙여줌.
	        month = "0" + month;
	    }
	     // ""을 빼면 year + month (숫자+숫자) 됨.. ex) 2018 + 12 = 2030이 리턴됨.
	    return today = ""+year + month + date; 
	},
	dateTimeFormat2 : function(value) {
		if(value === null) { return '-'; }
		var d1 = new Date(value);
		return d1.format("yyyy-MM-dd HH:mm:ss");
		
		
	},
	dateTimeFormat2BR : function(value) {
		if(value === null) { return '-'; }
		var d1 = new Date(value);
		return d1.format("yyyy-MM-dd<br>HH:mm:ss");
	}
};

/********************************************************************************************************************
 * date format
 ********************************************************************************************************************/
Date.prototype.format = function(f) {
	if (!this.valueOf()) return ' ';
    var d = this;
     
    return f.replace(/(yyyy|yy|MM|dd|E|hh|mm|ss)/gi, function($1) {
        switch ($1) {
            case 'yyyy': return d.getFullYear();
            case 'yy': return (d.getFullYear() % 1000).zf(2);
            case 'MM': return (d.getMonth() + 1).zf(2);
            case 'dd': return d.getDate().zf(2);
            case 'HH': return d.getHours().zf(2);
            case 'hh': return ((h = d.getHours() % 12) ? h : 12).zf(2);
            case 'mm': return d.getMinutes().zf(2);
            case 'ss': return d.getSeconds().zf(2);
            default: return $1;
        }
    });
};
String.prototype.string = function(len){var s = '', i = 0; while (i++ < len) { s += this; } return s;};
String.prototype.zf = function(len){return '0'.string(len - this.length) + this;};
Number.prototype.zf = function(len){return this.toString().zf(len);};

/********************************************************************************************************************
 * String replaceAll
 ********************************************************************************************************************/
String.prototype.replaceAll = function(rgExp, replaceText) {
	var strOri = this;
	while ( strOri.indexOf(rgExp) > -1) {
		strOri = strOri.replace(rgExp, replaceText);
	}
	return strOri;
};

/********************************************************************************************************************
 * 원하는 형식만 사용하는 정규식
 ********************************************************************************************************************/
var commonOnly = {
	regex : '',
	result : '',
	number : function(str) {                                                  // 숫자만
		regex= /[^0-9]/g;
		result = str.replace(regex, '');
		return result;
	},
	korean : function(str) {                                                  // 한글만
		regex= /[a-z0-9]|[ \[\]{}()<>?|`~!@#$%^&*-_+=,.;:\"'\\]/g;
		result = str.replace(regex, '');
		return result;
	},
	email : function(str) {                                                  // 이메일
		regex= /^[-A-Za-z0-9_]+[-A-Za-z0-9_.]*[@]{1}[-A-Za-z0-9_]+[-A-Za-z0-9_.]*[.]{1}[A-Za-z]{1,5}$/;
		if( !regex.test(str) ) {
			alert("이메일 형식이 아닙니다.");
			return false;
		}
		return true;
	}
};




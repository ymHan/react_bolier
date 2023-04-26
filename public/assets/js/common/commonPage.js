/********************************************************************************************************************
 * commonPage Util
 ********************************************************************************************************************/
var commonPage = {
	excelButton : {
		
	},
	aaa : {
		
	}
};

/********************************************************************************************************************
 * 공통코드명 가져오기
 ********************************************************************************************************************/
function getCommonCode(gCode, cCode){
	var listData = commonCode[gCode];
	console.log(listData);
	for(var key in listData){
		var listObj = listData[key];
		if(listObj.code == cCode){
			console.log(listObj.code+" : "+listObj.name+"");
			return listObj.name;
		}
	}
	return '등록되지않은 코드입니다.';
}

/********************************************************************************************************************
 * 쇼핑몰 주문상세보기
 ********************************************************************************************************************/
function getProductDetail(no){
	var url = '/admin/shop/order/getOrder.do';
	var orderNo = no;
	var data = { "no" : orderNo };
	var resultData = commonAjax.call("POST", url, data, "");
	
	// 주문상세 세팅
	$("#o_no").text(resultData.no);
	//주문자
	$("#o_sender_name").text(resultData.sender_name);
	//$("#o_sender_zipCode").text(resultData.sender_zipCode);
	//$("#o_sender_address").text(resultData.sender_address);
	//$("#o_sender_addressDetail").text(resultData.sender_addressDetail);
	$("#o_sender_mobile").text(resultData.sender_mobile);
	$("#o_sender_phone").text(resultData.sender_phone);
	//인수자
	$("#o_receiver_name").text(resultData.receiver_name);
	$("#o_receiver_zipCode").text(resultData.receiver_zipCode);
	$("#o_receiver_address").text(resultData.receiver_address);
	$("#o_receiver_addressDetail").text(resultData.receiver_addressDetail);
	$("#o_receiver_mobile").text(resultData.receiver_mobile);
	$("#o_receiver_phone").text(resultData.receiver_phone);
	// 메모
	$("#o_adminMemo").text(resultData.adminMemo);
	$("#o_orderMemo").text(resultData.orderMemo);
	// 결제내역
	$("#o_productPrice").text(commonString.comma(resultData.productPrice));
	$("#o_discount").text(commonString.comma(resultData.discount));
	$("#o_deliveryCharge").text(commonString.comma(resultData.deliveryCharge));
	$("#o_paymentPrice").text(commonString.comma(resultData.paymentPrice));
	$("#o_paymentTypeName").text(resultData.paymentTypeName);

	// 주문리스트
	$("#productOrderListTbl").empty();
	for(var key in resultData.productList){
		var listObj = resultData.productList[key];
		var trStr = '<tr>';
		trStr += '<td>' + listObj.productNo + '</td>';
		trStr += '<td>' + listObj.productCode + '</td>';
		trStr += '<td>' + listObj.productName + '</td>';
		trStr += '<td>' + commonString.comma(listObj.orderCount) + '</td>';
		trStr += '<td>' + commonString.comma(listObj.consumerPrice) + '</td>';
		trStr += '<td>' + listObj.orderStateName + '</td>';
		trStr += '<td>' + commonString.null2Dash(listObj.deliveryCodeName) + '</td>';
		var deliveryInvoice = commonString.null2Dash(listObj.deliveryInvoice);
		trStr += '<td><a class="deliveryInvoiceLink" href="javascript:void(0);" onclick="javascript:deliveryView(\'' + deliveryInvoice + '\');">' + deliveryInvoice + '</a></td>';
		var refundLinkText = '-';
		var refundLinkUrl = '';
		if( listObj.refundInfo != null && listObj.refundInfo.fileList != null && listObj.refundInfo.fileList.length > 0) {
			refundLinkUrl = listObj.refundInfo.fileList[0].downloadUrl;
			refundLinkText = '조회';
		}
		trStr += '<td><a class="fileLink" href="javascript:void(0);" onclick="javascript:imageView(\'' + refundLinkUrl + '\');">' + refundLinkText + '</a></td>';
		
		trStr += '</tr>';
		$("#productOrderListTbl").append(trStr);
	}
}

function deliveryView(deliveryInvoice) {
	if( deliveryInvoice != '' && deliveryInvoice.length > 1) {
		//var location = '/page/delivery/view.do?deliveryInvoice=' + deliveryInvoice;
		//var location = 'http://nplus.doortodoor.co.kr/web/detail.jsp?slipno=' + deliveryInvoice;
		var location = 'https://www.doortodoor.co.kr/parcel/doortodoor.do?fsp_action=PARC_ACT_002&fsp_cmd=retrieveInvNoACT&invc_no=' + deliveryInvoice;
		
		var features = 'width=800,height=800,toolbar=no';
		window.open(location, '배송조회', features);
	}
}

function imageView(url) {
	$("#img_form_url").attr("src", url);
	$("#imageViewModal").modal('show');
}

/*******************************************************************************
 * 교환주문등록
 ******************************************************************************/
function insertOrderAjax(){
	// 주문등록
	var url = '/admin/shop/order/insertOrder.do';
	var orderNo = $("#i_no").val();
	var parentProductNo = $("#i_parentProductNo").val();
	var orderType = $("#i_orderType").val();
	// 전화번호 셋팅
	if($("#i_mobile1").val() != "")	$("#i_mobile").val($("#i_mobile1").val()+"-"+$("#i_mobile2").val()+"-"+$("#i_mobile3").val());
	if($("#i_phone1").val() != "")	$("#i_phone").val($("#i_phone1").val()+"-"+$("#i_phone2").val()+"-"+$("#i_phone3").val());
	if($("#take_mobile1").val() != "")	$("#take_mobile").val($("#take_mobile1").val()+"-"+$("#take_mobile2").val()+"-"+$("#take_mobile3").val());
	if($("#take_phone1").val() != "")	$("#take_phone").val($("#take_phone1").val()+"-"+$("#take_phone2").val()+"-"+$("#take_phone3").val());
	
	var orderInfo = $("#insertForm").serializeObject();
//	console.log("orderInfo :", orderInfo);
	var data = { "parentOrderNo" : orderNo, "parentProductNo" : parentProductNo, "orderType" : orderType, "orderInfo" : JSON.stringify(orderInfo).replaceAll('null,', '') };
//	console.log("data : ", data);
	return orderData = commonAjax.call("POST", url, data, "");
}

/*******************************************************************************
 * 상품목록selectbox 생성
 ******************************************************************************/
function getProductListAjax(){
	var prodUrl = '/admin/shop/product/listProduct.do';
	var prodResultData = commonAjax.call("POST", prodUrl, null, "");
//	console.log(prodResultData);
	
	var selectBox = $("#productType");
	selectBox.empty();
	
	for(var key in prodResultData){
		var listObj = prodResultData[key];
		
		if(myRole == "ROLE_SELLER_APPLE"){
			// 껍사
			if(listObj.productCode == "P20001"){
				selectBox.append("<option value='"+listObj.no+"' data-productcode='"+listObj.productCode+"' data-consumerprice='"+listObj.consumerPrice+"'>"+listObj.name+"</option>");
			}
			
		} else if(myRole == "ROLE_SELLER_CHALONG") {
			// 차롱
			if(listObj.productCode == "P20002"){
				selectBox.append("<option value='"+listObj.no+"' data-productcode='"+listObj.productCode+"' data-consumerprice='"+listObj.consumerPrice+"'>"+listObj.name+"</option>");
			}
			
		} else {
			selectBox.append("<option value='"+listObj.no+"' data-productcode='"+listObj.productCode+"' data-consumerprice='"+listObj.consumerPrice+"'>"+listObj.name+"</option>");
		}
	}
	$("#productPrice").val($("#productType option:selected").data("consumerprice"));
}


/* ############################################################################################  */
/*                                         주문등록 제어                                                                              */
/* ############################################################################################  */
var productSize = 0; // 상품리스트 갯수(전역변수)
$(function() {
	var moveFocusCheck = function(selector, length, nextSelector) {
		if( $('#' + selector).val().length === length ) {
			$('#' + nextSelector).focus();
		}
	}
	
	// 휴대전화번호 입력시 focus 처리
	$("#i_mobile1").on('keyup', function() { moveFocusCheck('i_mobile1', 3, 'i_mobile2'); });
	$("#i_mobile2").on('keyup', function() { moveFocusCheck('i_mobile2', 4, 'i_mobile3'); });
	$("#i_mobile3").on('keyup', function() { moveFocusCheck('i_mobile3', 4, 'i_phone1'); });
	
	$("#i_phone1").on('keyup', function() { moveFocusCheck('i_phone1', 4, 'i_phone2'); });
	$("#i_phone2").on('keyup', function() { moveFocusCheck('i_phone2', 4, 'i_phone3'); });
	$("#i_phone3").on('keyup', function() { moveFocusCheck('i_phone3', 4, 'jusoCapyChk'); });

	$("#take_mobile1").on('keyup', function() { moveFocusCheck('take_mobile1', 3, 'take_mobile2'); });
	$("#take_mobile2").on('keyup', function() { moveFocusCheck('take_mobile2', 4, 'take_mobile3'); });
	$("#take_mobile3").on('keyup', function() { moveFocusCheck('take_mobile3', 4, 'take_phone1'); });
	
	$("#take_phone1").on('keyup', function() { moveFocusCheck('take_phone1', 4, 'take_phone2'); });
	$("#take_phone2").on('keyup', function() { moveFocusCheck('take_phone2', 4, 'take_phone3'); });
	$("#take_phone3").on('keyup', function() { moveFocusCheck('take_phone3', 4, 'i_adminMemo'); });
	
	
	// 주문자와 동일 주소 처리
	$("#jusoCapyChk").click(function(){
		if($(this).is(":checked")){
			// copy
			$("#take_userName").val($("#i_userName").val());
			$("#take_postcode").val($("#i_postcode").val());
			$("#take_address").val($("#i_address").val());
			$("#take_addressDetail").val($("#i_addressDetail").val());
			$("#take_mobile1").val($("#i_mobile1").val());
			$("#take_mobile2").val($("#i_mobile2").val());
			$("#take_mobile3").val($("#i_mobile3").val());
			$("#take_phone1").val($("#i_phone1").val());
			$("#take_phone2").val($("#i_phone2").val());
			$("#take_phone3").val($("#i_phone3").val());
		}
	});
	// 상품변경시
	$("#productType").on('change', function(){
		$("#productAmount").val("1");
		$("#productPrice").val($("#productType option:selected").data("consumerprice"));
	});
	// 수량변경시
	$("#productAmount").on('change', function(){
		var consumerPrice = parseInt($("#productType option:selected").data("consumerprice"));
		var orderCount = parseInt($("#productAmount").val());
		$("#productPrice").val((orderCount * consumerPrice));
	});
	// 할인금액, 배송금액 입력시
	$("#i_discount, #i_deliveryCharge").keypress(function(){
		// 상품금액 변경 fn call
		if(event.keyCode<48 || event.keyCode>57){
			event.returnValue = false;
		}
	});
	// 할인금액, 배송금액 입력시
	$("#i_discount, #i_deliveryCharge").keyup(function(){
		settotalProdSumary();
	});
	// modal 상품 추가 클릭
	$("#productPlus").on('click', function(){
//		alert(productSize);
		if(parseInt($("#productPrice").val()) <= 0){
			commonMsg.alert("상품가격을 입력해주세요.", "INFO", 'small');
		} else {
			var productNo = $("#productType").val();
			var productName = $("#productType option:selected").text();
			var orderCount = $("#productAmount").val();
			var consumerPrice = $("#productType option:selected").data("consumerprice");
			var productCode = $("#productType option:selected").data("productcode");
			var sumPrice = (orderCount * consumerPrice);
			var productSeq = 1;
			var trStr = '<tr>';
			trStr += '<td><input type="checkbox" class="prodChk"><input type="hidden" name="items['+productSize+'][prod_seq]" value="'+productSeq+'"></td>';
			trStr += '<td>'+productNo+'<input type="hidden" name="items['+productSize+'][prod_no]" value="'+productNo+'"></td>';
			trStr += '<td>'+productCode+'<input type="hidden" name="items['+productSize+'][prod_cd]" value="'+productCode+'"></td>';
			trStr += '<td>'+productName+'<input type="hidden" name="items['+productSize+'][name]" value="'+productName+'"></td>';
			trStr += '<td>'+orderCount+'<input type="hidden" name="items['+productSize+'][amount]" value="'+orderCount+'"></td>';
			trStr += '<td>'+consumerPrice+'<input type="hidden" name="items['+productSize+'][unit_price]" value="'+consumerPrice+'"></td>';
			trStr += '<td>'+sumPrice+'<input type="hidden" class="totalProdPrice" name="items['+productSize+'][sum]" value="'+sumPrice+'"></td>';
			trStr += '</tr>';
			$("#productTblBody").append(trStr);

			productSize++; // 상품갯수 증가
			// 상품금액 변경 fn call
			settotalProdSumary();
		}
	});
	// modal 상품 제거 클릭
	$("#productMinus").on('click', function(){
		if($("#allSelect").is(":checked")){
			$("#productTblBody").empty();
		} else {
			$("input:checkbox[class=prodChk]").each(function() {
				if(this.checked){
					$(this).parent().parent().remove();
					// 상품금액 변경 fn call
					settotalProdSumary();
				}
			});
		}
	});

	// 주문등록 확인버튼
	$(".insertOrder").on('click', function(){
		commonMsg.confirm('등록 하시겠습니까?', function(result, callerParam){
			if( result === true) {
				var returnData = insertOrderAjax();
				if(returnData){
					commonMsg.alert("등록 처리가 완료 되었습니다.", "INFO", 'medium');
					//RELORD
					//if(typeof exchange_wait_list != "undefined"){
					//	dataList.drawTable( '/admin/shop/refund/listExchangeProcess.do');
					//} else {
					//	dataList.drawTable( '/admin/shop/order/listOrder.do' );
					//}
					
					dataList.reDrawTable("SEARCH");
					$("#insertModal").modal('hide');
				}
			}
		});
	});
});
// 상품리스트 합산
function settotalProdSumary(){
	// 상품총액 - 할인총액 + 배송비
	var totalPrice = 0;
	var i_productPrice = $("#i_productPrice");
	var i_discount = $("#i_discount").val() == "" ? 0 : $("#i_discount").val();
	var i_deliveryCharge = $("#i_deliveryCharge").val() == "" ? 0 : $("#i_deliveryCharge").val();
	var i_paymentPrice = $("#i_paymentPrice");
	$("input:hidden[class=totalProdPrice]").each(function() {
		totalPrice += parseInt($(this).val());
	});
	i_productPrice.val(totalPrice); //상품총액
	i_paymentPrice.val(totalPrice - parseInt(i_discount) + parseInt(i_deliveryCharge)); // 주문총액
	
}
/* ############################################################################################  */
/*                                         주문등록 제어                                                                              */
/* ############################################################################################  */


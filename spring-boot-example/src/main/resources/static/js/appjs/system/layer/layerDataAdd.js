$().ready(function() {
	validateRule();
	
	if(layName=='layer_gonganju'){
		$(".gongan").css('display','block');
	}
});

$.validator.setDefaults({
	submitHandler : function() {
		save();
	}
});
var featureNS=this.parent.gisFeatureNS;
var wfsUrl=this.parent.gisServiceUrl;
var featurePrefix=this.parent.gisFeaturePrefix;
var layName=this.parent.document.getElementById("layerName").value;
/**
 *通过wfs插入一条记录
 *
 * @param 
 * @returns {}
 */
function save() {
    	var formatWFS = new ol.format.WFS();  
		var options = {
				featureNS: featureNS,
				featurePrefix:featurePrefix,
				featureType: layName
		};
		var feature = new ol.Feature();
		var point=new ol.geom.Point();
		var coordstr=document.getElementById("rangeCoordinate").value;
		coordstr=coordstr.replace('[','');
		coordstr=coordstr.replace(']','');
		var coordArr=coordstr.split(',');
		var coord=new Array();
		coord[0]=parseFloat(coordArr[0]);
		coord[1]=parseFloat(coordArr[1]);
		if( isNaN(coord[0]) || isNaN(coord[1])){
			console.log("无坐标或格式不对");
			feature.setGeometryName("geom");
			feature.setGeometry(null);
		}else{
			point.setCoordinates(coord);
			feature.setGeometryName("geom");
			feature.setGeometry(point);
		}
		
		var pro=new Object();
		pro.id=document.getElementById("id").value;
		pro.name=document.getElementById("name").value;
		
		pro.purpose=document.getElementById("purpose").value;
		pro.factory=document.getElementById("factory").value;
		pro.type=document.getElementById("type").value;
		pro.pdate=document.getElementById("pdate").value;
		pro.udate=document.getElementById("udate").value;
		pro.resolution=document.getElementById("resolution").value;
		pro.shape=document.getElementById("shape").value;
		pro.ip=document.getElementById("ip").value;
		pro.port=document.getElementById("port").value;
		pro.encode_format=document.getElementById("encode_format").value;
		pro.encode_level=document.getElementById("encode_level").value;
		pro.decode_format=document.getElementById("decode_format").value;
		pro.decode_number=document.getElementById("decode_number").value;
		pro.protocol=document.getElementById("protocol").value;
		pro.trans_speed=document.getElementById("trans_speed").value;
		pro.control_radius=document.getElementById("control_radius").value;
		pro.addr=document.getElementById("addr").value;
		pro.remark=document.getElementById("remark").value;
		
		
		if(layName=='layer_gonganju'){
			pro.region=document.getElementById("region").value;
			pro.common_name=document.getElementById("common_name").value;
			pro.ptype=document.getElementById("ptype").value;
			pro.direction=document.getElementById("direction").value;
			pro.region_police=document.getElementById("region_police").value;
			pro.manage_dept=document.getElementById("manage_dept").value;
			pro.manage_phone=document.getElementById("manage_phone").value;
			pro.saveday=document.getElementById("saveday").value;
		}
		
		feature.setProperties(pro);
		
    	var arr=new Array();
    	arr.push(feature);
    	var node = formatWFS.writeTransaction(arr, null, null, options);  
        
        var str = new XMLSerializer().serializeToString(node);  
        console.log(str);  
/*        $.ajax(wfsUrl,{  
            type: 'POST',  
            dataType: 'xml',  
            processData: false,  
            contentType:'text/plain;charset=UTF-8',
            data: str  
        }).done(function(data,status,xhr){
        	console.log(data);  
        	var res=formatWFS.readTransactionResponse(data);
        	if(res.transactionSummary.totalInserted==1){
        		parent.layer.msg("操作成功");
				parent.reLoad();
				var index = parent.layer.getFrameIndex(window.name); // 获取窗口索引
				parent.layer.close(index);
        	}
        	else
        		parent.layer.msg("操作成功");
        }).fail(function(data,status,xhr){
        	console.log(data);  
        	parent.layer.msg("操作失败");
        });*/ 
        
        
        $.ajax(wfsUrl,{  
            type: 'POST',  
            dataType: 'xml',  
            contentType:'text/plain;charset=UTF-8',
            data: str,
            success: function(data){
            	console.log(data);  
            	var res=formatWFS.readTransactionResponse(data);
            	if(res.transactionSummary.totalInserted==1){
            		parent.layer.msg("操作成功");
    				parent.reLoad();
    				var index = parent.layer.getFrameIndex(window.name); // 获取窗口索引
    				parent.layer.close(index);
            	}
            	else
            		parent.layer.msg("操作成功");
            }
        });

}
function validateRule() {
	var icon = "<i class='fa fa-times-circle'></i> ";
	$("#signupForm").validate({
		rules : {
			id : {
				required : true
			},
			name : {
				required : true
			}
		},
		messages : {
			id : {
				required : icon + "请输入编号"
			},
			name : {
				required : icon + "请输入姓名"
			}
		}
	})
}

function editPoint() {
	layer.open({
		type : 2,
		title : '地图编辑点',
		maxmin : true,
		shadeClose : false, // 点击遮罩关闭层
		area : [ '750px', '480px' ],
		content : '/system/layer/editPoint/'+layName
	});
}
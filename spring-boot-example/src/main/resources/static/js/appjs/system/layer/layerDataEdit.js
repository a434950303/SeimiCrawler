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

$(function() {
	load();
});

var oId;
var feat;
/**
 *加载从父页面获取的feature点数据
 *
 * @param 
 * @returns {}
 */
function load() {
	oId=document.getElementById("oId").value;
	var result=this.parent.result;
	for(var i=0;i<result.length;i++){
    	var obj=result[i];
    	if(obj.id==oId)
    		feat=obj;
    }
	
//	var featureStr=new ol.format.GeoJSON().writeFeature(evt.feature);
//    var feature=JSON.parse(featureStr);
//    var geo=feature.geometry.coordinates;
//    geoResult=JSON.stringify(geo);
	
	
	var feature=new ol.format.GeoJSON().readFeature(feat);
	var prop=feature.getProperties();
	document.getElementById("id").value=prop.id;
	document.getElementById("name").value=prop.name;
	
	document.getElementById("purpose").value=prop.purpose;
	document.getElementById("factory").value=prop.factory;
	document.getElementById("type").value=prop.type;
	document.getElementById("pdate").value=prop.pdate;
	document.getElementById("udate").value=prop.udate;
	document.getElementById("resolution").value=prop.resolution;
	document.getElementById("shape").value=prop.shape;
	document.getElementById("ip").value=prop.ip;
	document.getElementById("port").value=prop.port;
	document.getElementById("encode_format").value=prop.encode_format;
	document.getElementById("encode_level").value=prop.encode_level;
	document.getElementById("decode_format").value=prop.decode_format;
	document.getElementById("decode_number").value=prop.decode_number;
	document.getElementById("protocol").value=prop.protocol;
	document.getElementById("trans_speed").value=prop.trans_speed;
	document.getElementById("control_radius").value=prop.control_radius;
	document.getElementById("addr").value=prop.addr;
	document.getElementById("remark").value=prop.remark;
	
	
	if(layName=='layer_gonganju'){
		
		document.getElementById("region").value=prop.region;
		document.getElementById("common_name").value=prop.common_name;
		document.getElementById("ptype").value=prop.ptype;
		document.getElementById("direction").value=prop.direction;
		document.getElementById("region_police").value=prop.region_police;
		document.getElementById("manage_dept").value=prop.manage_dept;
		document.getElementById("manage_phone").value=prop.manage_phone;
		document.getElementById("saveday").value=prop.saveday;
	}
	
	document.getElementById("rangeCoordinate").value=feature.getGeometry().getCoordinates();
}
var featureNS=this.parent.gisFeatureNS;
var wfsUrl=this.parent.gisServiceUrl;
var featurePrefix=this.parent.gisFeaturePrefix;
var layName=this.parent.document.getElementById("layerName").value;
/**
 *通过wfs更新一条记录
 *
 * @param 
 * @returns {}
 */
function save() {
    	var layName=this.parent.document.getElementById("layerName").value;
    	var formatWFS = new ol.format.WFS();  
		var options = {
				featureNS: featureNS,
				featurePrefix:featurePrefix,
				featureType: layName,
				srsName: "urn:x-ogc:def:crs:EPSG:4326",
			    gmlOptions: {srsName: "urn:x-ogc:def:crs:EPSG:4326"}
		};
		var feature = new ol.Feature();
		feature.setId(oId);
		var point=new ol.geom.Point();
		var coordstr=document.getElementById("rangeCoordinate").value;
		coordstr=coordstr.replace('[','');
		coordstr=coordstr.replace(']','');
		var coordArr=coordstr.split(',');
		
		//console.log("coordArr:"+coordArr);
		
		var coord=new Array();
		coord[0]=parseFloat(coordArr[0]);
		coord[1]=parseFloat(coordArr[1]);
		
		//console.log("coord:"+coord);
		
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
    	var node = formatWFS.writeTransaction(null, arr, null, options);  
        
        var str = new XMLSerializer().serializeToString(node);  
        console.log(str);  
        /*$.ajax(wfsUrl,{  
            type: 'POST',  
            dataType: 'xml',  
            processData: false,  
            contentType:'text/plain;charset=UTF-8',
            data: str  
        }).done(function(data,status,xhr){
        	console.log(data);  
        	var res=formatWFS.readTransactionResponse(data);
        	if(res.transactionSummary.totalUpdated==1){
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
            	if(res.transactionSummary.totalUpdated==1){
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
				required : icon + "请输入名称"
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
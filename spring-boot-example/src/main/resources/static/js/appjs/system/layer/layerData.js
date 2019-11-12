
var prefix = "/system/layer"
$(function() {
//	load();
});

var layId;
var layName;
/**
 *通过wfs获取全部数据
 *
 * @param 
 * @returns {}
 */
function load() {
	layId=document.getElementById("layerId").value;
	layName=document.getElementById("layerName").value;
	getWfsData("");
}


var result;
/**
 *通过wfs获取数据 按照name进行匹配过滤
 *
 * @param name
 * @returns {}
 */
function getWfsData(name){
	
	var featureRequest = new ol.format.WFS().writeGetFeature({
        srsName: 'urn:x-ogc:def:crs:EPSG:4326',
        featureNS: gisFeatureNS,
        featurePrefix: gisFeaturePrefix,
        featureTypes: [layName],
        outputFormat: 'application/json',
        startIndex:0,
        maxFeatures: 100000,
        filter: ol.format.filter.like('name', '*'+name+'*')
    });

    // then post the request and add the received features to a layer
//    fetch(gisServiceUrl, {
//        method: 'POST',
//        body: new XMLSerializer().serializeToString(featureRequest)
//    }).then(function(response) {
//        return response.json();
//    }).then(function(json) {
//        var features = json.features;
//
//        features.forEach(function(value, index, array) {
//            value.name=value.properties.name;
//        });
//        
//        result = features;
//        initTable();
//        
//        $('#exampleTable').bootstrapTable('load', result);
//    });
    
    $.ajax(gisServiceUrl,{  
        type: 'POST',  
        contentType:'text/plain;charset=UTF-8',
        data: new XMLSerializer().serializeToString(featureRequest),
        success: function(response){
        	var json=response;
        	var features = json.features;

            features.forEach(function(value, index, array) {
                value.name=value.properties.name;
                value.proId=value.properties.id;
            });
            
            result = features;
            initTable();
            
            $('#exampleTable').bootstrapTable('load', result);
        }
    });

}
/**
 *初始化表格
 *
 * @param 
 * @returns {}
 */
function initTable() {
	
	$('#exampleTable')
			.bootstrapTable(
					{
						data : result,
					//	showRefresh : true,
					//	showToggle : true,
					//	showColumns : true,
						iconSize : 'outline',
						toolbar : '#exampleToolbar',
						striped : true, // 设置为true会有隔行变色效果
						dataType : "json", // 服务器返回的数据类型
						pagination : true, // 设置为true会在底部显示分页条
						// queryParamsType : "limit",
						// //设置为limit则会发送符合RESTFull格式的参数
						singleSelect : false, // 设置为true将禁止多选
						// contentType : "application/x-www-form-urlencoded",
						// //发送到服务器的数据编码类型
						pageSize : 10, // 如果设置了分页，每页数据条数
						pageNumber : 1, // 如果设置了分布，首页页码
						//search : true, // 是否显示搜索框
						showColumns : false, // 是否显示内容下拉框（选择显示的列）
						sidePagination : "client", // 设置在哪里进行分页，可选值为"client" 或者 "server"
						// //请求服务器数据时，你可以通过重写参数的方式添加一些额外的参数，例如 toolbar 中的参数 如果
						// queryParamsType = 'limit' ,返回参数必须包含
						// limit, offset, search, sort, order 否则, 需要包含:
						// pageSize, pageNumber, searchText, sortName,
						// sortOrder.
						// 返回false将会终止请求
						columns : [
								{
									checkbox : true
								},
								{
                                    formatter : function (value,row,index) {
										return index+1;
                                    },
									title : '序号'
								},
								{
									field : 'name',
									title : '名称'
								},
								{
									field : 'proId',
									title : '编号'
								},
								{
                                    formatter : function (value,row,index) {
                                    	var str='<span class="label label-primary">有</span>';
                                    	if(row.geometry==null)
                                    		str='<span class="label label-danger">无</span>';
										return str;
                                    },
									title : '有无坐标'
								},
																{
									title : '操作',
									field : 'id',
									align : 'center',
                                    width : 88 ,
									formatter : function(value, row, index) {
										var e = '<a class="btn btn-primary btn-sm '+s_edit_h+'" href="#" mce_href="#" title="编辑" onclick="edit(\''
												+ row.id
												+ '\')"><i class="fa fa-edit"></i></a> ';
										var d = '<a class="btn btn-warning btn-sm '+s_remove_h+'" href="#" title="删除"  mce_href="#" onclick="remove(\''
												+ row.id
												+ '\')"><i class="fa fa-remove"></i></a> ';
										return e + d ;
									}
								} ]
					});
}
/**
 *重新加载wfs请求数据
 *
 * @param 
 * @returns {}
 */
function reLoad() {
	var keyWord=$('#searchName').val();
		getWfsData(keyWord);
}
function add() {
	layer.open({
		type : 2,
		title : '增加',
		maxmin : true,
		shadeClose : false, // 点击遮罩关闭层
		area : [ '800px', '520px' ],
		content : prefix + '/layerDataAdd' // iframe的url
	});
}
function edit(id) {
	layer.open({
		type : 2,
		title : '编辑',
		maxmin : true,
		shadeClose : false, // 点击遮罩关闭层
		area : [ '800px', '520px' ],
		content : prefix + '/layerDataEdit/' + id // iframe的url
	});
}
/**
 *根据id删除一条记录
 *
 * @param id
 * @returns {}
 */
function remove(id) {
	layer.confirm('确定要删除选中的记录？', {
		btn : [ '确定', '取消' ]
	}, function() {
		
        var feat=null;
        
        for(var i=0;i<result.length;i++){
        	var obj=result[i];
        	if(obj.id==id)
        		feat=obj;
        }
        if(feat!=null){
        	
        	var formatWFS = new ol.format.WFS();  
    		var options = {
    				featureNS: gisFeatureNS,
    				featurePrefix:gisFeaturePrefix,
    				featureType: layName
    		};
    		
    		var feature=new ol.format.GeoJSON().readFeature(feat);
    		
        	var arr=new Array();
        	arr.push(feature);
        	var node = formatWFS.writeTransaction(null, null, arr, options);  
            
            var str = new XMLSerializer().serializeToString(node);  
            console.log(str);  
            /*$.ajax(gisServiceUrl,{  
                type: 'POST',  
                dataType: 'xml',  
                processData: false,  
                contentType:'text/plain;charset=UTF-8',
                data: str  
            }).done(function(data,status,xhr){
            	console.log(data);  
            	var res=formatWFS.readTransactionResponse(data);
            	if(res.transactionSummary.totalDeleted==1)
            		layer.msg("删除成功");
            	else
            		layer.msg("删除失败");
            	reLoad();
            }).fail(function(data,status,xhr){
            	console.log(data);  
            	layer.msg("删除失败");
            }); */
            
            
            $.ajax(gisServiceUrl,{  
                type: 'POST',  
                dataType: 'xml',  
                contentType:'text/plain;charset=UTF-8',
                data: str,
                success: function(data){
                	console.log(data);  
                	var res=formatWFS.readTransactionResponse(data);
                	if(res.transactionSummary.totalDeleted==1)
                		layer.msg("删除成功");
                	else
                		layer.msg("删除失败");
                	reLoad();
                }
            });
        }
	})
}

function resetPwd(id) {
}
/**
 *批量删除
 *
 * @param 
 * @returns {}
 */
function batchRemove() {
	var rows = $('#exampleTable').bootstrapTable('getSelections'); // 返回所有选择的行，当没有选择的记录时，返回一个空数组
	if (rows.length == 0) {
		layer.msg("请选择要删除的数据");
		return;
	}
	layer.confirm("确认要删除选中的'" + rows.length + "'条数据吗?", {
		btn : [ '确定', '取消' ]
	// 按钮
	}, function() {
		var ids = new Array();
		// 遍历所有选择的行数据，取每条数据对应的ID
		$.each(rows, function(i, row) {
			ids[i] = row['id'];
		});
		
    	var arr=new Array();
        for(var i=0;i<ids.length;i++){
        	var oid=ids[i];
        	for(var m=0;m<result.length;m++){
        		if(result[m].id==oid)
            	{
        			var feature=new ol.format.GeoJSON().readFeature(result[m]);
        			arr.push(feature);
            	}
        	}
        }
        if(arr.length>0){
        	
        	var formatWFS = new ol.format.WFS();  
    		var options = {
    				featureNS: gisFeatureNS,
    				featurePrefix:gisFeaturePrefix,
    				featureType: layName
    		};
    		
    		
        	var node = formatWFS.writeTransaction(null, null, arr, options);  
            
            var str = new XMLSerializer().serializeToString(node);  
            console.log(str);  
            /*$.ajax(gisServiceUrl,{  
                type: 'POST',  
                dataType: 'xml',  
                processData: false,  
                contentType: 'text/xml',  
                data: str  
            }).done(function(data,status,xhr){
            	console.log(data);  
            	var res=formatWFS.readTransactionResponse(data);
            	layer.msg("删除成功:"+res.transactionSummary.totalDeleted+"条记录");
            	reLoad();
            }).fail(function(data,status,xhr){
            	console.log(data);  
            	layer.msg("删除失败");
            }); */
            
            $.ajax(gisServiceUrl,{  
                type: 'POST',  
                dataType: 'xml',  
                contentType:'text/plain;charset=UTF-8',
                data: str,
                success: function(data){
                	console.log(data);  
                	var res=formatWFS.readTransactionResponse(data);
                	layer.msg("删除成功:"+res.transactionSummary.totalDeleted+"条记录");
                	reLoad();
                }
            });
        }
		
	}, function() {

	});
}

var insertcount = 0;

/**
 *批量插入100次
 *
 * @param 
 * @returns {}
 */
function batchInsert100() {
	var keyWord=$('#searchName').val();
	if(keyWord==""){
		layer.msg("名称前缀不可为空");return;
	}
	insertcount = 0;
	for(var i=0;i<100;i++){
		batchInsert();
	}
}
/**
 *批量插入100条记录
 *
 * @param 
 * @returns {}
 */
function batchInsert() {
	
		var keyWord=$('#searchName').val();
		if(keyWord==""){
			layer.msg("名称前缀不可为空");return;
		}
	
    	var layName=this.document.getElementById("layerName").value;
    	var formatWFS = new ol.format.WFS();  
		var options = {
				featureNS: gisFeatureNS,
				featurePrefix:gisFeaturePrefix,
				featureType: layName
		};
		
		var arr=new Array();
		for(var i=0;i<100;i++){
			var feature = new ol.Feature();
			var point=new ol.geom.Point();
			var coord=new Array();
			
			var maxX=115.23864557;
			var minX=113.89348447;
			var maxY=35.0135357;
			var minY=34.2276139;
			coord[0]=Math.random()*(maxX-minX)+minX;
			coord[1]=Math.random()*(maxY-minY)+minY;
			point.setCoordinates(coord);
			feature.setGeometryName("geom");
			feature.setGeometry(point);
			
			var pro=new Object();
			pro.id=uuid(6, 10);
			
			pro.name=keyWord+uuid(8, 16);
			feature.setProperties(pro);
			arr.push(feature);
		}
    	
    	
    	var node = formatWFS.writeTransaction(arr, null, null, options);  
        
        var str = new XMLSerializer().serializeToString(node);  
        console.log(str);  
        $.ajax(gisServiceUrl,{  
            type: 'POST',  
            dataType: 'xml',  
            processData: false,  
            contentType: 'text/xml',  
            data: str  
        }).done(function(data,status,xhr){
        	console.log(data);  
        	var res=formatWFS.readTransactionResponse(data);
        	if(res.transactionSummary.totalInserted==100){
        		insertcount += 100;
        		layer.msg("插入" + insertcount + "条记录成功");
				reLoad();
        	}
        	else
        		layer.msg("操作失败");
        }).fail(function(data,status,xhr){
        	console.log(data);  
        	layer.msg("操作失败");
        }); 

}
/**
 *生成uuid
 *
 * @param len 返回uuid长度
 * @param radix 2进制 10进制 16进制
 * @returns {uuid}
 */
function uuid(len, radix) {
	  var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
	  var uuid = [], i;
	  radix = radix || chars.length;
	 
	  if (len) {
	   // Compact form
	   for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random()*radix];
	  } else {
	   // rfc4122, version 4 form
	   var r;
	 
	   // rfc4122 requires these characters
	   uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
	   uuid[14] = '4';
	 
	   // Fill in random data. At i==19 set the high bits of clock sequence as
	   // per rfc4122, sec. 4.1.5
	   for (i = 0; i < 36; i++) {
	    if (!uuid[i]) {
	     r = 0 | Math.random()*16;
	     uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
	    }
	   }
	  }
	 
	  return uuid.join('');
}
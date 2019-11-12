
var prefix = "/system/layer"
$(function() {
	load();
});

function load() {
	$('#exampleTable')
			.bootstrapTable(
					{
						method : 'get', // 服务器数据的请求方式 get or post
						cache : false,
						url : prefix + "/list", // 服务器数据的加载地址
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
						sidePagination : "server", // 设置在哪里进行分页，可选值为"client" 或者 "server"
						queryParams : function(params) {
							return {
								//说明：传入后台的参数包括offset开始索引，limit步长，sort排序列，order：desc或者,以及所有列的键值对
								limit: params.limit,
								offset:params.offset,
                                layerNameC:$('#searchName').val()
					           // username:$('#searchName').val()
							};
						},
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
									field : 'layerName', 
									title : '图层名称'
								},
																{
									field : 'orderNum',
									title : '排序'
								},
																{
									field : 'layerNameC',
									title : '图层名称（中文）'
								},
																{
									field : 'layerType', 
									title : '图层类型',
									align : 'center',
									formatter : function(value, row, index) {
										if (value == '1') {
											return '<span class="label label-danger">WMTS</span>';
										} else if (value == '2') {
											return '<span class="label label-primary">WFS</span>';
										}else if (value == '3') {
                                            return '<span class="label label-success">GEOJSON</span>';
                                        }
									}
								},
																{
									field : 'layerUrl', 
									title : '图层链接'
								},
																{
									field : 'layerProjection',
									title : '图层坐标系' 
								},
																{
									field : 'layerWmtsFormat', 
									title : '图片格式'
								},
																{
									field : 'layerWfsVersion', 
									title : '版本号' 
								},
																{
									field : 'layerWfsRequest', 
									title : '请求服务方式' 
								},
								{
									field : 'layerWfsTypename', 
									title : 'TYPENAME' 
								},
								{
									field : 'layerWfsMaxfeatures', 
									title : '获取feature最大数目' 
								},
								{
									field : 'layerWfsOutputformat', 
									title : '获取格式' 
								},
								{
									field : 'layerGeojsonStr', 
									title : '直接存储geojson' 
								},
								{
									field : 'layerGeojsonUrl', 
									title : '获取geojson地址' 
								},
								{
									field : 'layerImage', 
									title : '图层样式' ,
									align : 'center',
									formatter : function(value, row, index) {
										return '<img src="/gis/image/video_'+value+'.png" >';
									}
								},
								
																/*{
									field : 'creator', 
									title : '创建人' 
								},
																{
									field : 'updater', 
									title : '修改人' ,
									visible:false
								},
																{
									field : 'createTime', 
									title : '创建日期' ,
									visible:false
								},
																{
									field : 'updateTime', 
									title : '修改时间' ,
									visible:false
								},*/
																{
									title : '操作',
									field : 'id',
									align : 'center',
                                    width : 188 ,
									formatter : function(value, row, index) {
										
										var flag=false;
										for(var i=0;i<sessionLayers.length;i++){
											if(row.layerName==sessionLayers[i].layername)
												flag=true;
										}
										if(flag){
											var e = '<a class="btn btn-primary btn-sm '+s_edit_h+'" href="#" mce_href="#" title="编辑" onclick="edit(\''
													+ row.layerId
													+ '\')"><i class="fa fa-edit"></i></a> ';
											var d = '<a class="btn btn-warning btn-sm '+s_remove_h+'" href="#" title="删除"  mce_href="#" onclick="remove(\''
													+ row.layerId
													+ '\')"><i class="fa fa-remove"></i></a> ';
											var f = '<a class="btn btn-success btn-sm" href="#" title="数据"  mce_href="#" onclick="layerData(\''
													+ row.layerId
													+ '\')"><i class="fa fa-key"></i></a> ';
											return e + d + f;
										}else{
											var e = '<a disabled="true" class="btn btn-primary btn-sm '+s_edit_h+'" href="#" mce_href="#" title="编辑" ><i class="fa fa-edit"></i></a> ';
											var d = '<a disabled="true" class="btn btn-warning btn-sm '+s_remove_h+'" href="#" title="删除"  mce_href="#" ><i class="fa fa-remove"></i></a> ';
											var f = '<a disabled="true" class="btn btn-success btn-sm" href="#" title="数据"  mce_href="#" ><i class="fa fa-key"></i></a> ';
											return e + d + f;
										}
										
									}
								} ]
					});
}
function reLoad() {
	$('#exampleTable').bootstrapTable('refresh');
}
function layerData(layerId) {
	layer.open({
		type : 2,
		title : '图层数据',
		maxmin : true,
		shadeClose : false, // 点击遮罩关闭层
		area : [ '800px', '600px' ],
		content : prefix + '/layerData/'+layerId // iframe的url
	});
}
function add() {
	layer.open({
		type : 2,
		title : '增加',
		maxmin : true,
		shadeClose : false, // 点击遮罩关闭层
		area : [ '800px', '520px' ],
		content : prefix + '/add' // iframe的url
	});
}
function edit(id) {
	layer.open({
		type : 2,
		title : '编辑',
		maxmin : true,
		shadeClose : false, // 点击遮罩关闭层
		area : [ '800px', '520px' ],
		content : prefix + '/edit/' + id // iframe的url
	});
}
function remove(id) {
	layer.confirm('确定要删除选中的记录？', {
		btn : [ '确定', '取消' ]
	}, function() {
		$.ajax({
			url : prefix+"/remove",
			type : "post",
			data : {
				'layerId' : id
			},
			success : function(r) {
				if (r.code==0) {
					layer.msg(r.msg);
					reLoad();
				}else{
					layer.msg(r.msg);
				}
			}
		});
	})
}

function resetPwd(id) {
}
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
			ids[i] = row['layerId'];
		});
		$.ajax({
			type : 'POST',
			data : {
				"ids" : ids
			},
			url : prefix + '/batchRemove',
			success : function(r) {
				if (r.code == 0) {
					layer.msg(r.msg);
					reLoad();
				} else {
					layer.msg(r.msg);
				}
			}
		});
	}, function() {

	});
}
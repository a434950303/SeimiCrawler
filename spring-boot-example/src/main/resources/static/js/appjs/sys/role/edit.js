
$(function() {
	getMenuTreeData();
    getLayerTreeData();
    getRangeTreeData();
	validateRule();
});
$.validator.setDefaults({
	submitHandler : function() {
		getAllSelectNodes();
		update();
	}
});
function loadMenuTree(menuTree) {
	$('#menuTree').jstree({
		"plugins" : [ "wholerow", "checkbox" ],
		'core' : {
			'data' : menuTree
		},
		"checkbox" : {
			//"keep_selected_style" : false,
			//"undetermined" : true
			//"three_state" : false,
			//"cascade" : ' up'
		}
	});
	$('#menuTree').jstree('open_all');
}

function loadLayerTree(layerTree) {
	$('#layerTree').jstree({
		"plugins" : [ "wholerow", "checkbox" ],
		'core' : {
			'data' : layerTree
		},
		"checkbox" : {
			//"keep_selected_style" : false,
			//"undetermined" : true
			//"three_state" : false,
			//"cascade" : ' up'
		}
	});
	$('#layerTree').jstree('open_all');
}

function loadRangeTree(rangeTree) {
	$('#rangeTree').jstree({
		"plugins" : [ "wholerow", "checkbox" ],
		'core' : {
            'multiple':false,
			'data' : rangeTree
		},
		"checkbox" : {
			// "keep_selected_style" : true,
			//"undetermined" : true
			"three_state" : false,
			//"cascade" : ' up'
		}
	});
	$('#rangeTree').jstree('open_all');
}

function getAllSelectNodes() {
	var menuTree_ = $('#menuTree').jstree(true); // 菜单树
	var layerTree_ = $('#layerTree').jstree(true); // 图层树
	var rangeTree_ = $('#rangeTree').jstree(true); // 空间树
	menuIds_ = menuTree_.get_selected(); // 获得所有选中节点的，返回值为数组
	layerIds_ = layerTree_.get_selected(); // 获得所有选中节点的，返回值为数组
	rangeIds_ = rangeTree_.get_selected(); // 获得所有选中节点的，返回值为数组

	$("#menuTree").find(".jstree-undetermined").each(function(i, element) {
        menuIds_.push($(element).closest('.jstree-node').attr("id"));
	});
	/*
    $("#layerTree").find(".jstree-undetermined").each(function(i, element) {
        layerIds_.push($(element).closest('.jstree-node').attr("id"));
    });
    $("#rangeTree").find(".jstree-undetermined").each(function(i, element) {
    // $("#rangeTree").find(".jstree-clicked").each(function(i, element) {
    	debugger
        // var id_ = $(element).closest('.jstree-node').attr("id");
        // rangeIds_.push(id_);
        rangeIds_.push($(element).closest('.jstree-node').attr("id"));
    });*/
}
function getMenuTreeData() {
	var roleId = $('#roleId').val();
	$.ajax({
		type : "GET",
		url : "/sys/menu/tree/" + roleId,
		success : function(data) {
			loadMenuTree(data);
		}
	});
}

function getLayerTreeData() {
    var roleId = $('#roleId').val();
    $.ajax({
        type : "GET",
        url : "/system/layer/tree/" + roleId,
        success : function(data) {
            loadLayerTree(data);
        }
    });
}

function getRangeTreeData() {
    var roleId = $('#roleId').val();
    $.ajax({
        type : "GET",
        url : "/system/range/trees/" + roleId,
        success : function(data) {
            loadRangeTree(data);
        }
    });
}

function update() {
	$('#menuIds').val(menuIds_);
	$('#layerIds').val(layerIds_);
	$('#rangeIds').val(rangeIds_);
	var role = $('#signupForm').serialize();
	$.ajax({
		cache : true,
		type : "POST",
		url : "/sys/role/update",
		data : role, // 你的formid
		async : false,
		error : function(request) {
			alert("Connection error");
		},
		success : function(r) {
			if (r.code == 0) {
				parent.layer.msg(r.msg);
				parent.reLoad();
				var index = parent.layer.getFrameIndex(window.name); // 获取窗口索引
				parent.layer.close(index);

			} else {
				parent.layer.msg(r.msg);
			}

		}
	});
}
function validateRule() {
	var icon = "<i class='fa fa-times-circle'></i> ";
	$("#signupForm").validate({
		rules : {
			roleName : {
				required : true
			}
		},
		messages : {
			roleName : {
				required : icon + "请输入角色名"
			}
		}
	});
}
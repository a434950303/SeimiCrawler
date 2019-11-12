//var menuTree;

var menuIds;
$(function() {
	getMenuTreeData();
    getLayerTreeData();
    getRangeTreeData();
	validateRule();
});
$.validator.setDefaults({
	submitHandler : function() {
		getAllSelectNodes();
		save();
	}
});

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
        rangeIds_.push($(element).closest('.jstree-node').attr("id"));
    });*/
}
function getMenuTreeData() {
	$.ajax({
		type : "GET",
		url : "/sys/menu/tree",
		success : function(menuTree) {
			loadMenuTree(menuTree);
		}
	});
}

function getLayerTreeData() {
    $.ajax({
        type : "GET",
        url : "/system/layer/tree",
        success : function(data) {
            loadLayerTree(data);
        }
    });
}

function getRangeTreeData() {
    $.ajax({
        type : "GET",
        url : "/system/range/trees",
        success : function(data) {
//        	debugger
            loadRangeTree(data);
        }
    });
}
function loadMenuTree(menuTree) {
	$('#menuTree').jstree({
		'core' : {
			'data' : menuTree
		},
		"checkbox" : {
			"three_state" : true,
		},
		"plugins" : [ "wholerow", "checkbox" ]
	});
	$('#menuTree').jstree("open_all");

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

function loadRangeTree(layerTree) {
    $('#rangeTree').jstree({
        "plugins" : [ "wholerow", "checkbox" ],
        'core' : {
        	'multiple':false,
            'data' : layerTree
        },
        "checkbox" : {
            //"keep_selected_style" : false,
            //"undetermined" : true
            "three_state" : false,
            //"cascade" : ' up'
        }
    });
    $('#rangeTree').jstree('open_all');
}

function save() {
    $('#menuIds').val(menuIds_);
    $('#layerIds').val(layerIds_);
    $('#rangeIds').val(rangeIds_);
	var role = $('#signupForm').serialize();
	$.ajax({
		cache : true,
		type : "POST",
		url : "/sys/role/save",
		data : role, // 你的formid

		async : false,
		error : function(request) {
			alert("Connection error");
		},
		success : function(data) {
			if (data.code == 0) {
				parent.layer.msg("操作成功");
				parent.reLoad();
				var index = parent.layer.getFrameIndex(window.name); // 获取窗口索引

				parent.layer.close(index);

			} else {
				parent.layer.msg(data.msg);
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
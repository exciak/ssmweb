/**
 * Created by zlx on 2015/8/3.
 */

/* 修改和删除操作的索引值 */
var dbOpRowIndex = 0;
var curPageNumber = 0;
var preventDefaultFlag = false;
var preventDefaultFlag2 = false;

$(document).ready(function () {

    var defaultData = [
        {
            code: '0000',
            text: '主题类目',
            description: '根节点',
            level: '0',
            parent_code: '0000',
            nodes: [
                {
                    code: '1000',
                    text: '父节点1',
                    description: '父节点1',
                    level: '1',
                    parent_code: '0000',
                    nodes: [
                        {
                            code: '1100',
                            text: '子节点1100',
                            description: '子节点1100',
                            level: '2',
                            parent_code: '1000'
                        },
                        {
                            code: '1200',
                            text: '子节点1200',
                            description: '子节点1200',
                            level: '2',
                            parent_code: '1000'
                        },
                        {
                            code: '1300',
                            text: '子节点1300',
                            description: '子节点1300',
                            level: '2',
                            parent_code: '1000'
                        },
                        {
                            code: '1400',
                            text: '子节点1400',
                            description: '子节点1400',
                            level: '2',
                            parent_code: '1000'
                        }
                    ]
                },
                {
                    code: '2000',
                    text: '父节点2',
                    description: '父节点2',
                    level: '1',
                    parent_code: '0000',
                    nodes: [
                        {
                            code: '2100',
                            text: '子节点2100',
                            description: '子节点2100',
                            level: '2',
                            parent_code: '2000'
                        },
                        {
                            code: '2200',
                            text: '子节点2200',
                            description: '子节点2200',
                            level: '2',
                            parent_code: '2000'
                        },
                        {
                            code: '2300',
                            text: '子节点2300',
                            description: '子节点1300',
                            level: '2',
                            parent_code: '2000'
                        },
                        {
                            code: '2400',
                            text: '子节点2400',
                            description: '子节点2400',
                            level: '2',
                            parent_code: '2000'
                        }
                    ]
                },
                {
                    code: '3000',
                    text: '父节点3',
                    description: '父节点3',
                    level: '1',
                    parent_code: '0000'
                },
                {
                    code: '4000',
                    text: '父节点4',
                    description: '父节点4',
                    level: '1',
                    parent_code: '0000'
                }
            ]
        }
    ];

    var subjectTreeData = [];
    var rootNode = {};

    getTreeDataInit();

    function getTreeDataInit() {
        //初始化根节点
        rootNode.id = 0;
        rootNode.code = "00000";
        rootNode.text = "主题类目";
        rootNode.description = "根节点";
        rootNode.level = 0;
        rootNode.parent_code = "00000";

        //去后端获取treedata
        $.ajax({
            type: 'GET',
            url: "../subject/tree",
            async: false,
            success: function (data) {
                if(data.length != 0){
                    rootNode.nodes = [];
                    for(var i=0; i< data.length; i++){
                        rootNode.nodes[i] = data[i] ;
                    }

                    subjectTreeData[0] = rootNode;
                }
            },
            error: function () {
                dmallAjaxError();
            }
        });
    };

    var $subjectTreeView = createTreeView(subjectTreeData);
    var selectNode = {};

    function createTreeView(treeData) {
        var subjectTreeView = $('#subjectTreeView').treeview({
            data: treeData,
            color: "#428bca",
            expandIcon: 'glyphicon glyphicon-folder-close',
            collapseIcon: 'glyphicon glyphicon-folder-open',
            nodeIcon: 'glyphicon glyphicon-list-alt',
            onNodeSelected: function (event, node) {
                //$('#outputInfo').prepend('<p>' + node.text + ' was selected</p>');
                selectNode.code = node.code;
                selectNode.text = node.text;
                selectNode.description = node.description;

                $('#inputSubjectName').val(node.text);
                $('#inputSubjectCode').val(node.code);
                $('#inputSubjectDescription').val(node.description);
            }
        });

        return subjectTreeView;
    }


    /*    主题类目的搜索*/
    var searchSubjectTreeView = function (e) {
        var string = $('#inputSearchSubject').val();
        var pattern = toEscStr(string);
        var options = {
            revealResults: true
        };
        var results = $subjectTreeView.treeview('search', [pattern, options]);

        var output = '<p>' + results.length + ' matches found</p>';
        $.each(results, function (index, result) {
            output += '<p>- ' + result.text + '</p>';
        });
        $('#outputInfo').html(output);
    }

    $('#inputSearchSubject').on('keyup', searchSubjectTreeView);

    /* 搜索节点并高亮*/
    var searchAndSelectNode = function (node) {
        var pattern = toEscStr(node.text);
        var options = {
            revealResults: true
        };
        var results = $subjectTreeView.treeview('search', [pattern, options]);
    }

    /*    修改主题*/
    var subjectModefy = function () {
        //用递归方法查找节点
        var updateNode = {};
        scanNodeForModify(subjectTreeData[0])

        //遍历节点递归函数
        function scanNodeForModify(node) {
            //检查本节点是否符合节点编码
            if (node.code == selectNode.code) {
                return node;
            }

            //本节点有子节点
            if (node.nodes != undefined) {
                //检查本节点下的所有子节点编码
                for (var i = 0; i < node.nodes.length; i++) {
                    //递归检查某个子节点或者该子节点下的所有孙子节点是否符合编码，
                    var nodeTemp = scanNodeForModify(node.nodes[i]);
                    if (null != nodeTemp) {
                        //找到符合编码的节点递归结束，返回null就继续递归检查
                        updateNode = nodeTemp;
                    }
                }
            }//本节点有子节点无子节点
            else {
                return null;
            }
        }

        if (null != updateNode) {
            updateNode.description = $('#inputSubjectDescription').val();
            updateNode.text = $('#inputSubjectName').val();

            //去服务端修改节点
            $.ajax({
                url:"../subject/edit",
                type:"POST",
                data:{
                    id: updateNode.id,
                    code: updateNode.code,
                    name:updateNode.text,
                    description: updateNode.description
                },
                dataType:"json",
                success:function(data){
                    if (data.result === "success") {
                        ;
                    } else {
                        dmallError(data.result);
                    }
                },
                error: function () {
                    dmallAjaxError();
                }
            });
        }

        var $updateTreeView = createTreeView(subjectTreeData);

        //实现创建后定位到创建节点
        searchAndSelectNode(updateNode);

    }
    $('#btnSubjectModify').on('click', subjectModefy);


    /*    新增同级主题*/
    var subjectAddBrother = function () {

        var createNode = {};
        var parentNode = {};
        var createNodeArray = [];

        //用递归方法查找节点
        scanNodeForAddBrother(subjectTreeData[0])

        //遍历节点递归函数
        function scanNodeForAddBrother(node) {
            //检查本节点是否符合节点编码
            if (node.code == selectNode.code) {
                return node;
            }

            //本节点有子节点
            if (node.nodes != undefined) {
                //检查本节点下的所有子节点编码
                for (var i = 0; i < node.nodes.length; i++) {
                    //递归检查某个子节点或者该子节点下的所有孙子节点是否符合编码，
                    var nodeTemp = scanNodeForAddBrother(node.nodes[i]);
                    if (null != nodeTemp) {
                        //找到符合编码的节点递归结束，返回null就继续递归检查
                        createNode.code = "新增主题编码";
                        createNode.text = "新增主题名称";
                        createNode.description = "新增主题描述";
                        //获取父节点和兄弟节点数组
                        parentNode = node;
                        createNodeArray = node.nodes;
                    }
                }
            }//本节点有子节点无子节点
            else {
                return null;
            }
        }

        if (null != createNode) {
            $('#inputSubjectName').val(createNode.text);
            $('#inputSubjectCode').val(createNode.code);
            $('#inputSubjectDescription').val(createNode.description)

            //填充节点信息
            createNode.id = 0;
            createNode.level = parentNode.level +1;

            //将待创建节点加到最后
            createNodeArray.push(createNode);

            //去服务端新增主题
            $.ajax({
                url:"../subject/create",
                type:"POST",
                data:{
                    code: createNode.code,
                    name:createNode.text,
                    parentId: parentNode.id,
                    description: createNode.description,
                    level:createNode.level
                },
                dataType:"json",
                success:function(data){
                    if (data.result === "success") {
                        ;
                    } else {
                        dmallError(data.result);
                    }
                },
                error: function () {
                    dmallAjaxError();
                }
            });
        }

        //刷新主题树
        var $updateTreeView = createTreeView(subjectTreeData);

        //实现创建后定位到创建节点
        searchAndSelectNode(createNode);
    }
    $('#btnSubjectAddBrother').on('click', subjectAddBrother);

    /*    新增子级主题*/
    var subjectAddSon = function () {

        var createNode = {};
        var parentNode = {};
        var createNodeArray = [];

        //用递归方法查找节点
        scanNodeForAddSon(subjectTreeData[0])

        //遍历节点递归函数
        function scanNodeForAddSon(node) {
            //检查本节点是否符合节点编码
            if (node.code == selectNode.code) {
                return node;
            }

            //本节点有子节点
            if (node.nodes != undefined) {
                //检查本节点下的所有子节点编码
                for (var i = 0; i < node.nodes.length; i++) {
                    //递归检查某个子节点或者该子节点下的所有孙子节点是否符合编码，
                    var nodeTemp = scanNodeForAddSon(node.nodes[i]);
                    if (null != nodeTemp) {
                        //找到符合编码的节点递归结束，返回null就继续递归检查
                        createNode.code = "新增主题编码";
                        createNode.text = "新增主题名称";
                        createNode.description = "新增主题描述";
                        //获取父节点和兄弟节点数组
                        parentNode = nodeTemp;
                        createNodeArray = nodeTemp.nodes;
                    }
                }
            }//本节点有子节点无子节点
            else {
                return null;
            }
        }

        if (null != createNode) {
            $('#inputSubjectName').val(createNode.text);
            $('#inputSubjectCode').val(createNode.code);
            $('#inputSubjectDescription').val(createNode.description)

            //填充节点信息
            createNode.id = 0;
            createNode.level = parentNode.level +1;
            createNode.parent_code = parentNode.code;

            //将待创建节点加到最后
            //createNodeArray.push(createNode);

            //去服务端新增主题
            $.ajax({
                url:"../subject/create",
                type:"POST",
                data:{
                    id: createNode.id,
                    code: createNode.code,
                    name:createNode.text,
                    description: createNode.description,
                    level:createNode.level
                },
                dataType:"json",
                success:function(data){
                    if (data.result === "success") {
                        ;
                    } else {
                        dmallError(data.result);
                    }
                },
                error: function () {
                    dmallAjaxError();
                }
            });
        }

        //从后端获取树结构并初始化
        getTreeDataInit();

        //刷新主题树
        var $updateTreeView = createTreeView(subjectTreeData);

        //实现创建后定位到创建节点
        searchAndSelectNode(createNode);
    }
    $('#btnSubjectAddSon').on('click', subjectAddSon);

    /*    删除主题*/
    var subjectDelete = function () {
        var delNode = {};
        var parentNode = {};
        var delNodeArray = [];

        //用递归方法查找节点
        scanNodeForDel(subjectTreeData[0])

        //遍历节点递归函数
        function scanNodeForDel(node) {
            //检查本节点是否符合节点编码
            if (node.code == selectNode.code) {
                return node;
            }

            //本节点有子节点
            if (node.nodes != undefined) {
                //检查本节点下的所有子节点编码
                for (var i = 0; i < node.nodes.length; i++) {
                    //递归检查某个子节点或者该子节点下的所有孙子节点是否符合编码，
                    var nodeTemp = scanNodeForDel(node.nodes[i]);
                    if (null != nodeTemp) {
                        //找到符合编码的节点递归结束，返回null就继续递归检查
                        delNode = nodeTemp;
                        parentNode = node;
                        delNodeArray = node.nodes;
                    }
                }
            }//本节点有子节点无子节点
            else {
                return null;
            }
        }

        if (null != delNode) {
            //先将待删除节点与数组第一个元素对调位置
            var tmpNode = {};

            for (var i = 0; i < delNodeArray.length; i++) {
                if (delNodeArray[i].code == delNode.code) {
                    tmpNode = delNodeArray[0];
                    delNodeArray[0] = delNodeArray[i];
                    delNodeArray[i] = tmpNode;
                    break;
                }
            }
            //删除数组第一个元素
            delNodeArray.shift();
            //对数组进行排序
            delNodeArray.sort();


            //去服务端删除节点
            $.ajax({
                url:"../subject/delete",
                type:"POST",
                data:{
                    id: delNode.id
                },
                dataType:"json",
                success:function(data){
                    if (data.result === "success") {
                        ;
                    } else {
                        dmallError(data.result);
                    }
                },
                error: function () {
                    dmallAjaxError();
                }
            });
        }

        //刷新主题树
        var $updateTreeView = createTreeView(subjectTreeData);

        //实现创建后定位到创建节点
        searchAndSelectNode(parentNode);
    }
    $('#btnSubjectDelete').on('click', subjectDelete);

});

//管理主题类目弹出框
function manageSubject(obj, pageNumber) {
    curPageNumber = pageNumber;
    $('#createSubjectModal').modal({backdrop: 'static', keyboard: false});
}




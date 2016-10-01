/*
*  Altair Admin
*  @version v2.3.0
*  @author tzd
*  @license http://themeforest.net/licenses
*  plugins_tree.js - plugins_tree.html
*/

$(function() {
    // simple
    $('#tree_a').easytree();

    // large
    var easyTree = $('#tree_b').easytree({
        enableDnd: true,
        dataUrl: 'assets/js/custom/easytree/demo_data.json'
    });

    function openAllNodes() {
        var nodes = easyTree.getAllNodes();
        toggleNodes(nodes, 'open');
        easyTree.rebuildTree(nodes);
    }

    function closeAllNodes() {
        var nodes = easyTree.getAllNodes();
        toggleNodes(nodes, 'close');
        easyTree.rebuildTree(nodes);
    }

    function toggleNodes(nodes, openOrClose){
        var i = 0;
        for (i = 0; i < nodes.length; i++) {
            nodes[i].isExpanded = openOrClose == "open"; // either expand node or don't

            // if has children open/close those as well
            if (nodes[i].children && nodes[i].children.length > 0) {
                toggleNodes(nodes[i].children, openOrClose);
            }
        }
    }

    // tree to tree drag&drop
    function dropped1(event, nodes, isSourceNode, source, isTargetNode, target) {
        if (isSourceNode && !isTargetNode) { // left to right drop
            easyTree2.addNode(source, target.id);
            easyTree1.removeNode(source.id);
            easyTree2.rebuildTree(); // rebuild 'other' tree
        }
    }
    function dropped2(event, nodes, isSourceNode, source, isTargetNode, target) {
        if (isSourceNode && !isTargetNode) { // Right to left drop
            easyTree2.removeNode(source.id);
            easyTree1.addNode(source, target.id);
            easyTree1.rebuildTree(); // rebuild 'other' tree
        }
    }
    var easyTree1 = $('#tree_dnd_a').easytree({
        enableDnd: true,
        dropped: dropped1
    });
    var easyTree2 = $('#tree_dnd_b').easytree({
        enableDnd: true,
        dropped: dropped2
    });

});
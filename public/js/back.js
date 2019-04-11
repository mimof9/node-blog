$(function() {

    // 退出
    $('#logout').on('click', function() {
        $.ajax({
            url: '/api/user/logout',
            success: function(result) {
                if (result.code === 0) {
                    window.location.href = '/'
                }
            }
        })
    })

    // 删除分类事件的回调
    function deleteCategory(e) {
        // 注意区分dom元素和jquery元素
        // domele = jqele[0]    jquery对象转dom对象
        // jqele = $(domele)    dom对象转jquery对象
        let tr = e.target.parentNode.parentNode
        let cid = tr.getElementsByClassName('cid')[0].innerHTML
        $.ajax({
            url: '/api/category/delete?id=' + cid,
            success: function(result) {
                $('.colWarning').html(result.message)
                $(tr).unbind()
                $(tr).remove()
            }
        })
    }

    // 修改分类事件的回调
    function editCategory(e) {
        var tr = e.target.parentNode.parentNode
        var cid = tr.getElementsByClassName('cid')[0].innerHTML
        var newName = tr.getElementsByTagName('input')[0].value
        $.ajax({
            type: 'POST',
            url: '/api/category/edit?id=' + cid,
            data: {
                name: newName
            },
            success: function(result) {
                $('.colWarning').html(result.message)
            }
        })
    }

    // 添加分类
    $('#addCategory').on('click', function() {
        $.ajax({
            type: 'POST',
            url: '/api/category/add',
            data: {
                name: $('#name').val()
            },
            success: function(result) {
                $('.colWarning').html(result.message)
                if (result.code === 0) {
                    let category = result.data
                    let tr = `
    <tr>
        <td class="cid">${category._id.toString()}</td>
        <td><input type="text" value="${category.name}" autocomplete="off"></td>
        <td>
            <a href="javascript:;" class="editCategory">修改</a>
            <a href="javascript:;" class="deleteCategory">删除</a>
        </td>
    </tr>`
                    // 重点是除了添加dom节点外 还要添加响应事件
                    var newEle = $('.table tr:first').after(tr).next()
                    console.log(newEle)
                    $(newEle[0].getElementsByClassName('deleteCategory')[0]).on('click', deleteCategory)
                    $(newEle[0].getElementsByClassName('editCategory')[0]).on('click', editCategory)
                    // 重置
                    $('#name').val('')
                }
            }
        })
    })

    // 删除分类
    $('.deleteCategory').on('click', deleteCategory)

    // 修改分类
    $('.editCategory').on('click', editCategory)
})
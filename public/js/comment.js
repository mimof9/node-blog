var perpage = 10,
    page = 1,
    comments = []       // 理解这些东西为啥要搞成全局

// var html = xss('<script>alert("xss");</script>');
// console.log(html);

// 页面加载的时候，重新获取评论
$.ajax({
    url: '/api/comment',
    data: {
        contentid: $('#contentId').val()
    },
    success: function(responseData) {
        comments = responseData.data.reverse()
        renderComment()
    }
})


// 提交评论
$('#messageBtn').on('click', function() {
    $.ajax({
        type: 'post',
        url: '/api/comment/post',
        data: {
            contentid: $('#contentId').val(),
            content: $('#messageContent').val()
        },
        success: function(responseData) {
            $('#messageContent').val('')
            comments = responseData.data.comments.reverse()
            renderComment()
        }
    })
})

// 点击上下页 用一下事件委托 美滋滋
$('.pager').delegate('a', 'click', function() {
    if ($(this).parent().hasClass('previous')) {
        page--
    } else {
        page++
    }
    renderComment()
})

// 渲染评论
function renderComment() {
    $('#messageCount').html(comments.length)    //评论数

    // 分页
    var pages = Math.ceil(comments.length / perpage),
        start = Math.max((page-1) * perpage, 0),
        end = Math.min(page * perpage, comments.length)

    // 处理没有评论时的情况
    if (pages <= 0) {
        pages = 1
    }

    var $lis = $('.pager li')
    $lis.eq(1).html(page + '/' + pages)

    // 处理上下页边界
    if (page <= 1) {
        $lis.eq(0).html('<span>没有上一页了</span>')
    } else {
        $lis.eq(0).html('<a href="#">上一页</a>')
    }
    if (page >= pages) {
        $lis.eq(2).html('<span>没有下一页了</span>')
    } else {
        $lis.eq(2).html('<a href="#">下一页</a>')
    }

    if (!comments.length) {
        $('.messageList').html('<div class="messageBox"><p>还没有评论</p></div>')
    } else {
        var html = ''
        for (var i=start; i<end; i++) {
            let xssContent = filterXSS(comments[i].content)
            html += `
<div class="messageBox">
    <p class="name clear">
        <span class="fl">${comments[i].username}</span>
        <span class="fr">${formDate(comments[i].postTime)}</span>
    </p>
    <p>${xssContent}</p>
</div>`
        }
        $('.messageList').html(html)
    }


}

// 处理时间
function formDate(d) {
    var d = new Date(d)
    return d.getFullYear() + '年' + (d.getMonth()+1) + '月' + d.getDate() + '日'
        + d.getHours() + '时' + d.getMinutes() + '分' + d.getSeconds() + '秒'
}

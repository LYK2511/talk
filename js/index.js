// 验证登录 如果没有登录，跳转至登录页，有登录则获取登录信息
(async function () {
    const resp = await API.profile();
    const user = resp.data
    if (!user) {
        // 未登录
        alert('未登录或登录已过期，请重新登录')
        location.href = './login.html'
        return;
    }
    const doms = {
        aside: {
            nickname: $('#nickname'),
            loginId: $('#loginId')
        },
        close: $('.close'),
        chatContainer: $('.chat-container'),
        txtMsg: $('#txtMsg'),
        messageContainer: $('.msg-container')
    }
    // 下面的代码环境一定是登录状态
    setUserInfo();
    // 注销事件
    doms.close.onclick = function () {
        API.loginOut();
        location.href = './login.html';
        alert('退出登录')
    }
    loadHistory()
    // 加载历史记录
    async function loadHistory() {
        const resp = await API.getHistory()
        for (const item of resp.data) {
            addChat(item);
        }
        scrollBottom();
    }

    // 设置用户信息
    function setUserInfo() {
        // 用innerHTML会有安全隐患（例如昵称名为html格式或标记）
        doms.aside.nickname.innerText = user.nickname
        doms.aside.loginId.innerText = user.loginId
    }
    // 根据消息对象，将其添加到页面中
    /**
     * description
     */
    function addChat(chatInfo) {
        // 消息容器
        const div = $$$('div')
        div.classList.add('chat-item');
        if (chatInfo.from) {
            div.classList.add('me');
        }
        // 图片
        const img = $$$('img')
        img.className = 'chat-avatar'
        img.src = chatInfo.from ? "./asset/avatar.png" : "./asset/robot-avatar.jpg"
        // 内容
        const content = $$$('div');
        content.className = 'chat-content'
        content.innerText = chatInfo.content
        // 日期
        const date = $$$('div')
        date.className = 'chat-date';
        date.innerText = formatDate(chatInfo.createdAt, 'yyyy-MM-dd HH-mm-ss')
        // 添加至div
        div.appendChild(img)
        div.appendChild(content)
        div.appendChild(date)
        // 添加至dom
        doms.chatContainer.appendChild(div)
    }
    // 事件日期格式化
    function formatDate(timestamp, format) {
        const date = new Date(timestamp)
        //padStart(n,'0') 不足n位填充0
        var year = date.getFullYear().toString().padStart(4, '0');
        var month = (date.getMonth() + 1).toString().padStart(2, '0');
        var day = date.getDate().toString().padStart(2, '0');

        var hour = date.getHours().toString().padStart(2, '0');
        var minute = date.getMinutes().toString().padStart(2, '0');
        var second = date.getSeconds().toString().padStart(2, '0');
        var millisecond = date.getMilliseconds();
        return format
            .replace('yyyy', year)
            .replace('MM', month)
            .replace('dd', day)
            .replace('HH', hour)
            .replace('mm', minute)
            .replace('ss', second)
            .replace('ms', millisecond);
    }
    // 滚动条滚动到最后
    function scrollBottom() {
        doms.chatContainer.scrollTop = doms.chatContainer.scrollHeight
    }
    // 发送消息事件
    doms.messageContainer.onsubmit = function (e) {
        e.preventDefault();
        sendMessage();
    }
    // 发送消息
    async function sendMessage() {
        const content = doms.txtMsg.value.trim()
        if (!content) {
            return
        }
        // 要先将消息显示出来
        addChat({
            from: user.loginId,
            to: null,
            createAt: Date.now(),
            content

        })
        // 清空input里的消息内容并滚动到底部
        doms.txtMsg.value = ''
        scrollBottom()
        // 接取回复消息
        const resp = await API.sendChat(content)
        addChat({
            from: null,
            to: user.loginId,
            ...resp.data
        })
        // 滚动到底部
        scrollBottom()
    }

})();

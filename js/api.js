
var API = (function () {
    //接口封装
    const BASE_URL = 'https://study.duyiedu.com'
    const TOKEN_KEY = 'token'
    // 封装GET
    function get(path) {
        const headers = {}
        const token = localStorage.getItem(TOKEN_KEY)
        if (token) {
            headers.authorization = `Bearer ${token}`
        }
        return fetch(BASE_URL + path, { headers })
    }
    // 封装POST
    async function post(path, bodyObj) {
        const headers = {
            'Content-Type': 'application/json',
        }
        const token = localStorage.getItem(TOKEN_KEY)
        if (token) {
            headers.authorization = `Bearer ${token}`
        }
        return fetch(BASE_URL + path, { headers, method: 'POST', body: JSON.stringify(bodyObj) })
    }
    /**
     * 注册
     */
    async function reg(userInfo) {
        const resp = await post('/api/user/reg', userInfo)
        return await resp.json()
    }
    /**
     * 登录
     */
    async function login(loginInfo) {
        const resp = await post('/api/user/login', loginInfo)
        const result = await resp.json();
        if (result.code === 0) {
            // 将响应头中的token保存起来
            const token = resp.headers.get('authorization')
            localStorage.setItem(TOKEN_KEY, token)
        }
        return result
    }
    /**
     * 验证
     */
    async function exists(loginId) {
        const resp = await get('/api/user/exists?loginId=' + loginId)
        return await resp.json();
    }
    /**
     * 当前账号信息
     */
    async function profile() {
        const resp = await get('/api/user/profile')
        return await resp.json();
    }
    /**
     * 发送信息
     */
    async function sendChat(content) {
        const resp = await post('/api/chat', { content, });
        return await resp.json()
    }
    /**
     * 获取聊天记录
     */
    async function getHistory() {
        const resp = await get('/api/chat/history')
        return await resp.json()
    }
    /**
     * 登出
     */
    function loginOut() {
        localStorage.removeItem(TOKEN_KEY)
    }

    return {
        reg,
        login,
        exists,
        profile,
        getHistory,
        loginOut,
        sendChat
    }
})()



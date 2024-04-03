
// 登录 
const loginIdValidator = new FieldValidator('txtLoginId', async function (val) {
    if (!val) {
        return '请填写账号'
    }
})

// 密码
const loginPswValidator = new FieldValidator('txtLoginPwd', function (val) {
    if (!val) {
        return '请填写密码'
    }
})

// 获取form元素
const form = $('.user-form');

form.addEventListener('submit', async function (e) {
    // 阻止表单提交事件
    e.preventDefault()
    const result = await FieldValidator.validate(loginIdValidator, loginPswValidator);
    // 验证通过后
    if (!result) return
    // const data = {
    //     loginId: loginIdValidator.input.value,
    //     loginPwd: loginPswValidator.input.value,
    //     nickname: nicknameValidator.input.value,
    // }
    // console.log(data);
    const formData = new FormData(form) //传入form得到表单数据对象
    const data = Object.fromEntries(formData.entries());
    const resp = await API.login(data);
    if (resp.code === 0) {
        alert('登录成功,点击确定跳转至首页')
        location.href = './index.html'
    } else {
        loginIdValidator.p.innerText = '账号或密码错误'
        // // 清空密码
        // loginPswValidator.input.value = '';

    }

})
const loginIdValidator = new FieldValidator('txtLoginId', async function (val) {
    if (!val) {
        return '请填写账号'
    }
    const resp = await API.exists(val);
    if (resp.data) {
        return '该账号已被占用，请重新选择'
    }
})

const nicknameValidator = new FieldValidator('txtNickname', function (val) {
    if (!val) {
        return '请填写昵称'
    }
})

const loginPswValidator = new FieldValidator('txtLoginPwd', function (val) {
    if (!val) {
        return '请填写密码'
    }
})

const loginPswConfirmValidator = new FieldValidator('txtLoginPwdConfirm', function (val) {
    if (!val) {
        return '请填写确认密码'
    }
    if (val !== loginPswValidator.input.value) {
        return '密码不一致'
    }
})
// 获取form元素
const form = $('.user-form');

form.addEventListener('submit', async function (e) {
    // 阻止表单提交事件
    e.preventDefault()
    const result = await FieldValidator.validate(loginIdValidator, nicknameValidator, loginPswValidator, loginPswConfirmValidator);
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
    const resp = await API.reg(data);
    if (resp.code === 0) {
        alert('注册成功,点击确定跳转至登录页')
        location.href = './login.html'
    }
})
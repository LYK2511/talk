// 根据业务用户登录和注册的表单项验证的通用代码
/**
 * 对某一个表单项进行验证的构造函数
 */
class FieldValidator {
    /**
     * 构造器
     * @param {String} txtId - 文本框Id
     * @param {Function} validatorFn - 验证规则函数，需要验证时调用该函数，函数的参数为当前文本框的值，函数的返回值为验证的消息错误，若没有返回值，则表示无错误
     */
    constructor(txtId, validatorFn) {
        // input
        this.input = $('#' + txtId);
        // p-err元素
        this.p = this.input.nextElementSibling;
        // 接取函数参数
        this.validatorFn = validatorFn
        // 添加失去焦点事件
        this.input.addEventListener('blur', () => {
            //利用箭头函数无this指向的特性来指向constructor（外部）
            this.validate()
        })
    }
    /**
     * 验证，成功true，失败false
     * 可能会有异步操作，所以都视为异步处理
     */
    async validate() {
        const err = await this.validatorFn(this.input.value);
        if (err) {
            // 有错误
            this.p.innerText = err
            return false
        } else {
            this.p.innerText = ''
            return true
        }
    }
    /**
     * 静态方法
     * 对传入的所有验证其进行统一的验证,所有验证通过则返回true
     * @param {FieldValidator[]} validators - validators
     */
    static async validate(...validators) {
        const proms = validators.map(v => v.validate());
        const results = await Promise.all(proms)
        return results.every(r => r)
    }
}

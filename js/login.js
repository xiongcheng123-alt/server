;
(() => {
    "use strict";
    var a = getCookie("iNowUser");
    if (a) {
        location.href = "http://localhost/MyProject/index.html";
    }
    class Login {
        constructor() {
            this.username = $("#username");
            this.password = $("#password");
            this.verification = $("#verification");
            this.canvas = document.getElementById("myCanvas");
            this.loginBtn = $("#login-btn");
            this.init();
        }
        init() {

            this.render();
            this.bindEvent();
        }
        render() {
            this.renderVerification();
            this.renderNotice();
        }
        renderNotice() {
            this.noticeBox = $("<div id='notice'>");
            this.noticeBox.css({
                background: "rgba(0, 0, 0, 0.8)",
                padding: "5px 20px",
                lineHeight: "20px",
                position: "fixed",
                left: "50%",
                transform: "scale(0.3)",
                color: "#eee",
                top: "50%",
                transition: ".15s linear transform"
            });
        }
        renderVerification() {
            this.verificationCode = createCode(this.canvas, 4);
        }
        bindEvent() {

            this.canvas.onclick = () => {
                this.renderVerification();
            }
            this.loginBtn.click(() => {
                // console.log(this.password.val());
                // console.log(this.repassword.val());
                // console.log(this.verificationCode.toLowerCase());
                // console.log(this.verification);
                if (this.verification.val().toLowerCase() != this.verificationCode.toLowerCase()) {
                    // console.log(this.noticeEve);
                    this.noticeEve("验证码错误");
                    return;
                } else if (!this.username.val()) {
                    this.noticeEve("请输入用户名");
                    return;
                } else if (!this.password.val()) {
                    this.noticeEve("请输入密码");
                    return;
                }
                this.loginEve();
            })
        }
        loginEve() {
            this.userInfo = JSON.parse(localStorage.getItem("userInfo")) || [];
            let isBeing = false;
            for (let i = 0; i < this.userInfo.length; i++) {
                if (this.userInfo[i].username == this.username.val() && this.userInfo[i].password == this.password.val()) {
                    this.noticeEve("登录成功，即将跳转到 <a style='color:red' href='index.html'>首页</a>");
                    setCookie("iNowUser", this.username.val())
                    setTimeout(() => {
                        location.href = "http://localhost/MyProject/index.html";
                    }, 1000);
                    isBeing = true;
                    break;
                } else if (this.userInfo[i].username == this.username.val() && this.userInfo[i].password != this.password.val()) {
                    this.noticeEve("密码错误，请核对后再登录");
                    isBeing = true;
                    break;
                }
            }
            if (!isBeing) {
                this.noticeEve("用户名不存在，<a  style='color:red' href='register.html'>去注册</a>");
            }
        }
        noticeEve(msg) {
            this.noticeBox.css({
                display: "none",
            });
            clearTimeout(this.timer);
            this.noticeBox.css({
                transform: "scale(0.3)",
                display: "block"
            })
            this.noticeBox.html(msg);
            setTimeout(() => {
                this.noticeBox.css({
                    transform: "scale(1.5)"
                })
            }, 0);
            $("main").append(this.noticeBox);
            this.timer = setTimeout(() => {
                this.noticeBox.css({
                    display: "none",
                });
            }, 3000);
            this.renderVerification();
        }
    }
    new Login;


    function createCode(ele, length) {
        var code = "";
        var codeLength = length; //验证码的长度，可变
        var canvas = ele; //获取画布
        var selectChar = new Array(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'); //所有候选组成验证码的字符

        for (var i = 0; i < codeLength; i++) {
            var charIndex = Math.floor(Math.random() * 36);
            code += selectChar[charIndex];
        }
        if (canvas) {
            var ctx = canvas.getContext('2d');
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, 70, 27);
            ctx.font = "20px arial";
            // 创建渐变
            var gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
            gradient.addColorStop("0", "magenta");
            gradient.addColorStop("0.5", "blue");
            gradient.addColorStop("1.0", "red");
            // 用渐变填色
            ctx.strokeStyle = gradient;
            ctx.strokeText(code, 5, 20); //画布上添加验证码
        }
        return code;
    }
})();
;
(() => {
    "use strict";
    window.onload = function () {

        var iNowUser = getCookie("iNowUser");
        if (iNowUser) {
            $(".top-login-box").html("<span>" + iNowUser + "</span><a class='global-link' style='margin-left:5px ' id='logout'>退出登录</a>");
            $("#personalInfo").children("figure").css({
                height: "157px",
            }).children("span").html(`Hi~, ${iNowUser},欢迎来到1919`).parent().siblings(".btn-group").css({
                display: "none"
            })
            $("#logout").click(() => {
                setCookie("iNowUser", "");
                location.href = "http://localhost/MyProject/index.html";
            })
            var shopCarRes = JSON.parse(localStorage.getItem("shopCar")) || [];
            var num = 0;
            for (let i = 0; i < shopCarRes.length; i++) {
                if (shopCarRes[i].userName == iNowUser) {
                    for (let j = 0; j < shopCarRes[i].myShopCar.length; j++) {
                        num += +shopCarRes[i].myShopCar[j].num;
                    }
                    break;
                }
            }
            console.log($(".carNum"));
            $(".carNum").html(num);
        }
    }
})();
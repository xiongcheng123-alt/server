//页面大致有3个方法
// 1、从json中拿到所有数据，并加载到页面中
// 2、放大镜
// 3、向购物车中添加数据

//因为商品详情页的ID是从地址栏带过来的，所以从网上找了一个获取地址栏中携带信息的方法
function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] == variable) {
            return pair[1];
        }
    }
}


// 渲染页面
class ProductInfo {
    constructor(container, url) {
        this.container = container;
        this.url = url;
        this.init();
        this.id = getQueryVariable("id");
    }
    init() {
        this.load();
    }
    load() {
        ajaxGet(this.url, (res) => {
            this.res = JSON.parse(res);
            this.render();
        })
    }
    // 需要从json中拿到所有的数据，并且循环这些数据，通过判断json中的id与地址栏中获取到的id是否相等， 来确定当前是哪件商品，进而确定需要加载的内容。
    render() {
        for (let i = 0; i < this.res.length; i++) {
            if (this.res[i].id == this.id) {
                $("title").html(this.res[i].name);
                // 循环获取所有图片列表中的图片（放大镜下面的）
                let picListStr = '';
                for (let j = 0; j < this.res[i].picList.length; j++) {
                    picListStr += `
                    <li><img src="${this.res[i].picList[j]}" alt=""></li>
                    `
                }
                // 商品的详细信息是通过数张图片拼接而成的，这里循环获取这些图片。
                let goodsPicStr = '';
                for (let j = 0; j < this.res[i].goodsPic.length; j++) {
                    goodsPicStr += `
                    <img src="${this.res[i].goodsPic[j]}" alt="">
                    `
                }
                var str =
                    `
                <div id="product-intro">
                    <div class="product-content-left">
                        <div class="bigImg">
                            <img src="${this.res[i].picList[0]}" alt="">
                            <div class="glass">
                            </div>
                            <div class="right-view">
                                <img src="${this.res[i].picList[0]}" alt="">
                            </div>
                        </div>
                        <div class="smallImg">
                            <ul>
                                ${picListStr}
                            </ul>
                        </div>
                    </div>
                    <div class="product-content-right">
                        <div class="productName">
                            <p>${this.res[i].name}</p>
                        </div>
                        <div class="productPrice">
                            <div class="marketPrice">
                                <p>市场价</p>
                                <span class="price-icon">￥</span><span class="price-num">${this.res[i].marketPrice}</span>
                            </div>
                            <div class="nowPrice">
                                <p>1919售价</p>
                                <span class="price-icon">￥</span><span class="price-num">${this.res[i].price}</span>
                            </div>
                        </div>
                        <div class="oprate">
                            <div class="shopCarNum clear">
                                <div class="dt dt-color">
                                    <span class="dt-specing">数量：</span>
                                </div>
                                <div class="dt dt-number">
                                    <span class="tb-stock">
                                        <a id="decNum"></a>
                                        <input id="pushNum" type="text"  value="1" title="请输入购买量">
                                        <a id="addNum"></a>
                                    </span>
                                    <p class="last">
                                        库存(<span class="lastNum">${this.res[i].stock}</span>)
                                    </p>
                                </div>
                            </div>
                            <div class="addShopCar">
                                <a class="addCar">
                                    <i class="shopCar-icon"></i>
                                    <span>加入购物车</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="product-information" class="clear">
                    <div class="storeInfo">
                        <div class="myStore">
                            <div class="storeImg">
                                <a><img src="${this.res[i].storePic}" alt=""></a>
                            </div>
                            <p class="storeName">
                                <span class="storeNameText">${this.res[i].storeName}<i class="storeIcon"></i></span>
                            </p>
                        </div>
                        <div class="store-oprate">
                            <a class="addStore">收藏店铺</a>
                            <a class="toStore">进入店铺</a>
                        </div>
                    </div>
                    <div class="productAllInfo">
                        <div class="information-title">
                            <ul>
                                <li><a class="global-link active" href="">商品介绍</a></li>
                                <li><a class="global-link" href="">参数规格</a></li>
                                <li><a class="global-link" href="">售后保障</a></li>
                                <li><a class="global-link" href="">商品评价</a></li>
                            </ul>
                        </div>
                        <div id="information-img">
                            ${goodsPicStr}
                        </div>
                        <div id="after-sale">
                            <div class="after-sale-title">
                                <p>售后保障</p>
                            </div>
                            <img src="./images/shuoming2.jpg" alt="">
                        </div>
                    </div>
                </div>
                `
                this.container.html(str);

                // 异步的原因，这里需要页面渲染完毕后再添加放大镜及修改购物车的功能
                new Fangdajing($(".smallImg"), $(".bigImg"), $(".glass"), $(".right-view"));
                new AddShopCar($("#addNum"), $("#decNum"), $(".addShopCar").children(".addCar"), $("#pushNum"), this.res[i].stock);
            }
        }
    }
}
new ProductInfo($("#main").children(".global-center"), "http://localhost/MyProject/libs/goods.json")



class Fangdajing {
    constructor(picList, smallPic, glass, bigPic) {
        this.picList = picList;
        this.smallPic = smallPic;
        this.glass = glass;
        this.bigPic = bigPic;
        this.init();
    }
    init() {
        this.bindEvent();
    }
    bindEvent() {
        this.changeImg();
        this.move();
    }
    // 改变图片
    changeImg() {
        this.picList.on("click", "li", (e) => {
            if (e.target.tagName == "IMG") {
                $(e.target).parent().addClass("active").siblings().removeClass("active");
            }
            this.smallPic.children("img").attr({
                src: e.target.src
            });
            this.bigPic.children("img").attr({
                src: e.target.src
            })
        })
    }
    // 大图移动
    move() {
        this.smallPic.mousemove((e) => {
            let glassLeft = e.pageX - this.smallPic.offset().left - this.glass.width() / 2;
            let glassTop = e.pageY - this.smallPic.offset().top - this.glass.height() / 2;
            if (glassLeft < 0) {
                glassLeft = 0;
            }
            if (glassLeft > this.smallPic.width() - this.glass.width()) {
                glassLeft = this.smallPic.width() - this.glass.width()
            }
            if (glassTop < 0) {
                glassTop = 0;
            }
            if (glassTop > this.smallPic.height() - this.glass.height()) {
                glassTop = this.smallPic.height() - this.glass.height()
            }
            this.glass.css({
                left: glassLeft,
                top: glassTop
            })
            this.bigPic.children("img").css({
                left: -parseInt(this.glass.css("left")) / this.glass.width() * this.bigPic.width(),
                top: -parseInt(this.glass.css("top")) / this.glass.height() * this.bigPic.height()
            })
        })
    }
}


class AddShopCar {
    constructor(addBtn, decBtn, pushBtn, pushNum, maxNum) {
        this.addBtn = addBtn;
        this.decBtn = decBtn;
        this.pushBtn = pushBtn;
        this.pushNum = pushNum;
        this.maxNum = maxNum;
        this.nowUser = getCookie("iNowUser");
        this.id = getQueryVariable("id");
        this.init();
    }
    init() {
        this.bindEvent();
    }
    bindEvent() {
        // +按钮事件
        this.addBtn.click(() => {
            if (parseInt(this.pushNum.val()) + 1 > $(".lastNum").html()) {
                this.pushNum.val($(".lastNum").html());
            } else {
                this.pushNum.val(parseInt(this.pushNum.val()) + 1);
            }
        })
        // -按钮事件
        this.decBtn.click(() => {
            if (parseInt(this.pushNum.val()) - 1 < 1) {
                this.pushNum.val(1);
            } else {
                this.pushNum.val(parseInt(this.pushNum.val()) - 1);
            }
        })
        // input的change事件
        this.pushNum.change(() => {
            if (parseInt(this.pushNum.val()) < 1) {
                this.pushNum.val(1);
            }
            if (parseInt(this.pushNum.val()) > $(".lastNum").html()) {
                this.pushNum.val($(".lastNum").html());
            }
        })
        // 加入购物车按钮事件
        this.pushBtn.click(() => {
            if (!this.nowUser) {
                alert("请先登录!");
                location.href = "login.html";
                return;
            }
            let obj = {
                id: this.id,
                num: this.pushNum.val()
            }
            let userShopCar = {
                userName: this.nowUser,
                myShopCar: [obj]
            }
            // localStorage.setItem("shopCar", JSON.stringify(obj));
            var shopCarInfo = JSON.parse(localStorage.getItem("shopCar")) || [];
            let userIsBeing = false;
            let goodsIsBeing = false;

            for (let i = 0; i < shopCarInfo.length; i++) {
                if (shopCarInfo[i].userName == this.nowUser) {
                    userIsBeing = true;
                    for (let j = 0; j < shopCarInfo[i].myShopCar.length; j++) {
                        if (shopCarInfo[i].myShopCar[j].id == this.id) {
                            goodsIsBeing = true;
                            shopCarInfo[i].myShopCar[j].num = parseInt(shopCarInfo[i].myShopCar[j].num) + parseInt(this.pushNum.val())
                            if (shopCarInfo[i].myShopCar[j].num > this.maxNum) {
                                shopCarInfo[i].myShopCar[j].num = this.maxNum;
                                alert("超出库存！");
                            }
                            break;
                        }
                    }
                    if (!goodsIsBeing) {
                        shopCarInfo[i].myShopCar.push(obj);
                    }
                    break;
                }
            }
            if (!userIsBeing) {
                shopCarInfo.push(userShopCar);
            }
            localStorage.setItem("shopCar", JSON.stringify(shopCarInfo));
        })
    }
}
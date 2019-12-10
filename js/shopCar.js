class RenderShopCar {
    constructor(goodsUrl, table) {
        this.goodsUrl = goodsUrl;
        this.table = table;
        this.nowUser = getCookie("iNowUser");
        if (!this.nowUser) {
            location.href = "login.html"
        }
        this.init();
    }
    init() {
        this.load();
    }
    // 异步从json中通过ajax获取商品信息
    load() {
        ajaxGet(this.goodsUrl, (res) => {
            this.goodsRes = JSON.parse(res);
            this.render();
        })
    }
    // 上面已经从json中获取商品数据，这里再从localstorage中获取购物车数据，二者结合可以得到购物车的所有数据，并将数据加载到页面中
    render() {
        this.shopCarRes = JSON.parse(localStorage.getItem("shopCar")) || [];
        var str = "";
        for (let i = 0; i < this.shopCarRes.length; i++) {
            // console.log(this.shopCarRes[i].userName);
            // console.log(this.nowUser);
            // console.log(this.shopCarRes[i].userName == this.nowUser);
            if (this.shopCarRes[i].userName == this.nowUser) {
                for (let j = 0; j < this.shopCarRes[i].myShopCar.length; j++) {
                    for (let k = 0; k < this.goodsRes.length; k++) {
                        if (this.shopCarRes[i].myShopCar[j].id == this.goodsRes[k].id) {
                            str += `
                            <li idx= "${this.shopCarRes[i].myShopCar[j].id}">
                                <dl>
                                    <dd class="check">
                                        <input type="checkbox" class="checkThis">
                                    </dd>
                                    <dd class="image">
                                        <a href="http://localhost/MyProject/productInfo.html?id=${this.shopCarRes[i].myShopCar[j].id}"><img src="${this.goodsRes[k].picList[0]}" alt=""></a>
                                    </dd>
                                    <dd class="information">
                                        <p><a href="http://localhost/MyProject/productInfo.html?id=${this.shopCarRes[i].myShopCar[j].id}" class="global-link">${this.goodsRes[k].name}</a></p>
                                    </dd>
                                    <dd class="price"><span>￥</span><span class="inline-price">${this.goodsRes[k].price}</span></dd>
                                    <dd class="number">
                                        <span class="tb-stock">
                                            <a class="decNum"></a>
                                            <input class="pushNum" type="text" max="${this.goodsRes[k].stock}" value="${this.shopCarRes[i].myShopCar[j].num}" title="请输入购买量">
                                            <a class="addNum"></a>
                                        </span>
                                    </dd>
                                    <dd class="totalnum">
                                        <span><i class="price-icon">￥</i><i class="price-num">${(this.shopCarRes[i].myShopCar[j].num * this.goodsRes[k].price).toFixed(1)}</i></span>
                                    </dd>
                                    <dd class="oprate">
                                        <span class="global-link deleteThis">删除</span>
                                    </dd>
                                </dl>
                            </li>
                            `
                            break;
                        }
                    }
                }
                break;
            }
        }
        this.table.html(str);
        new shopCarOprate($(".addNum"), $(".decNum"), $(".pushNum"), $(".deleteThis"), $(".tf-delSel"), $(".lastNum"));
    }
}
new RenderShopCar("http://localhost/MyProject/libs/goods.json", $("#shopCar-list").children("ul"));


class shopCarOprate {
    constructor(addBtns, decBtns, numbers, deleteThis, deleteSel, lastNum) {
        this.addBtns = addBtns;
        this.decBtns = decBtns;
        this.numbers = numbers;
        this.deleteThis = deleteThis;
        this.deleteSel = deleteSel;
        this.lastNum = lastNum;
        this.nowUser = getCookie("iNowUser");
        this.init();
    }
    init() {
        this.changeNum();
        this.deleteEle();
        this.changeCheck();
        this.changeCount();
    }
    // 这里写了三个事件,都是用来控制购物车页面中单行商品的数量.分别为+按钮、-按钮的点击事件和input的input时间。
    changeNum() {
        for (let i = 0; i < this.addBtns.length; i++) {
            this.addBtns.eq(i).click(() => {
                if (parseInt(this.numbers.eq(i).val()) + 1 > $(".pushNum").eq(i).attr("max")) {
                    alert("超出库存!");
                    this.numbers.eq(i).val($(".pushNum").eq(i).attr("max"));
                } else {
                    this.numbers.eq(i).val(parseInt(this.numbers.eq(i).val()) + 1);
                }
                this.changeLoc(i);

            })
        }
        for (let i = 0; i < this.decBtns.length; i++) {
            this.decBtns.eq(i).click(() => {
                if (parseInt(this.numbers.eq(i).val()) - 1 < 1) {
                    this.numbers.eq(i).val(1)
                } else {
                    this.numbers.eq(i).val(parseInt(this.numbers.eq(i).val()) - 1);
                }
                this.changeLoc(i);
            })
        }
        for (let i = 0; i < this.numbers.length; i++) {
            this.numbers.eq(i).on("blur", () => {
                if (!/^[0-9]+$/.test(this.numbers.eq(i).val()) || this.numbers.eq(i).val() < 1) {
                    this.numbers.eq(i).val(1);
                    this.changeLoc(i);
                }
                if (+this.numbers.eq(i).val() > +$(".pushNum").eq(i).attr("max")) {
                    console.log(11);
                    alert("超出库存!");
                    this.numbers.eq(i).val($(".pushNum").eq(i).attr("max"));
                    this.changeLoc(i);
                }
            })
            this.numbers.eq(i).on("input", () => {
                this.changeLoc(i);
            })
        }
    }
    //改变localstorage，idx为信号量，指的是当前购物车页面第几行，isDelete用于判断是否是删除操作，默认值为false
    changeLoc(idx, isDelete) {
        isDelete = isDelete ? isDelete : false;
        var locs = JSON.parse(localStorage.getItem("shopCar"));
        // console.log(locs);
        for (let i = 0; i < locs.length; i++) {
            // console.log(locs[i].userName)
            // console.log(this.nowUser)
            if (locs[i].userName == this.nowUser) {
                for (let j = 0; j < locs[i].myShopCar.length; j++) {
                    if (locs[i].myShopCar[j].id == this.deleteThis.eq(idx).parent().parent().parent().attr("idx")) {
                        if (isDelete) {
                            locs[i].myShopCar.splice(j, 1);
                        } else {
                            locs[i].myShopCar[j].num = this.numbers.eq(idx).val();
                        }
                        localStorage.setItem("shopCar", JSON.stringify(locs))
                        break;
                    }
                }
                break;
            }
        }
        this.changePrice(idx);
        this.changeCount();
    }
    //删除页面元素，即在购物车点击删除时，删除这一行。
    deleteEle() {
        for (let i = 0; i < this.deleteThis.length; i++) {
            this.deleteThis.eq(i).click(() => {
                this.deleteThis.eq(i).parent().parent().parent().remove();
                this.changeLoc(i, true);
            })
        }
    }
    // 改变单行中商品小计的价格，每次点击都会执行这个方法，实时更新价格。
    changePrice(idx) {
        $(".price-num").eq(idx).html(($(".inline-price").eq(idx).html() * this.numbers.eq(idx).val()).toFixed(1));
    }
    // 复选框事件，因为页面中出现了2个全选框，单独的复选框数量不定，所以循环用的比较多，箭头函数中this指向class，无法通过this获取触发事件的元素，所以需要循环绑定事件。
    changeCheck() {
        this.checkAll = $(".checkAll");
        this.checks = $(".checkThis");
        for (let i = 0; i < this.checkAll.length; i++) {
            this.checkAll.eq(i).click(() => {
                if (this.checkAll[i].checked) {
                    for (let j = 0; j < this.checks.length; j++) {
                        this.checks[j].checked = true;
                    }
                    for (let j = 0; j < this.checkAll.length; j++) {
                        this.checkAll[j].checked = true;
                    }
                } else {
                    for (let j = 0; j < this.checks.length; j++) {
                        this.checks[j].checked = false;
                    }
                    for (let j = 0; j < this.checkAll.length; j++) {
                        this.checkAll[j].checked = false;
                    }
                }
                this.changeCount();
            })
        }
        for (let i = 0; i < this.checks.length; i++) {
            this.checks.eq(i).click(() => {
                let isAllChecked = true;
                for (let j = 0; j < this.checks.length; j++) {
                    if (this.checks[j].checked == false) {
                        isAllChecked = false;
                    }
                }
                if (isAllChecked) {
                    for (let j = 0; j < this.checkAll.length; j++) {
                        this.checkAll[j].checked = true;
                    }
                } else {
                    for (let j = 0; j < this.checkAll.length; j++) {
                        this.checkAll[j].checked = false;
                    }
                }
                this.changeCount();
            })
        }
    }
    // 改变最后一行的总数量和总价格。
    changeCount() {
        let countNum = 0;
        let countPri = 0;
        this.checks = $(".checkThis");
        this.numbers = $(".pushNum");

        for (let i = 0; i < this.checks.length; i++) {
            if (this.checks[i].checked) {
                countNum += parseInt(this.numbers.eq(i).val())
                countPri += Number($(".price-num").eq(i).html());
            }
        }
        $(".totalNumber").html(countNum);
        $(".totalPrice").html(countPri);
    }
}
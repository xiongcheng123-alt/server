// 轮播图方法
class Banner {
    constructor(imgs, cirLists, leftBtn, rightBtn) {
        this.imgs = imgs;
        this.cirLists = cirLists;
        this.leftBtn = leftBtn;
        this.rightBtn = rightBtn;
        this.nowPic = 0;
        this.init();
    }
    init() {
        this.bindEvent();
        // 让第1张图片显示,其余图片全部绝对定位到右边,隐藏起来.
        this.imgs.css({
            left: this.imgs.eq(0).width()
        }).eq(0).css({
            left: 0
        })
    }
    bindEvent() {
        this.bindRightEvent();
        this.bindLeftEvent();
        this.autoPlay();
        this.bindCirEvent();
    }
    // 右按钮事件,
    bindRightEvent() {
        this.rightBtn.click(()=>{
            this.prevPic = this.nowPic;
            this.nowPic++;
            if (this.nowPic >= this.imgs.length) {
                this.nowPic = 0;
            }
            this.move(-1);
        })
    }
    // 左按钮事件，
    bindLeftEvent() {
        this.leftBtn.click(()=>{
            this.prevPic = this.nowPic;
            this.nowPic--;
            if (this.nowPic < 0) {
                this.nowPic = this.imgs.length - 1;
            }
            this.move(1);
        })
    }
    // 小圆点事件
    bindCirEvent() {
        for (let i = 0; i < this.imgs.length; i++) {
            this.cirLists.eq(i).click(()=>{
                // console.log(i);
                this.prevPic = this.nowPic;
                this.nowPic = i;
                if (this.prevPic < this.nowPic) {
                    this.move(-1);
                } else if (this.prevPic > this.nowPic) {
                    this.move(1);
                }
            })
        }
    }
    // 图片的移动方法,上面所有的事件都确定了事件触发后移出的图片和进入的图片,只需确定方向就可以实现轮播图的动画效果,所以这里传了一个参数,用于确定不同的方向.1为图片右移,-1为图片左移
    move(target) {
        this.change();
        this.imgs.eq(this.prevPic).css({
            left: 0
        }).stop().animate({
            left: this.imgs.eq(0).width() * target
        })
        this.imgs.eq(this.nowPic).css({
            left: -this.imgs.eq(0).width() * target
        }).stop().animate({
            left: 0
        })
    }
    // 自动播放
    autoPlay() {
        this.timer = setInterval(() => {
            this.prevPic = this.nowPic;
            this.nowPic++;
            if (this.nowPic >= this.imgs.length) {
                this.nowPic = 0;
            }
            this.move(-1);
        }, 5000);

        this.imgs.parent().parent().hover(()=>{
            clearInterval(this.timer);
        }, ()=>{
            this.timer = setInterval(() => {
                this.prevPic = this.nowPic;
                this.nowPic++;
                if (this.nowPic >= this.imgs.length) {
                    this.nowPic = 0;
                }
                this.move(-1);
            }, 5000);
        })
    }
    // 改变固定小圆点的样式
    change() {
        this.cirLists.eq(this.nowPic).addClass("active").siblings().removeClass("active");
    }

}
new Banner($("#homeFlexslider").children(".slides").children("li"), $("#homeFlexslider").children(".slideCir").children("li"), $("#slide-leftBtn"), $("#slide-rightBtn"));


// 选项卡方法
class Tab {
    constructor(titles, bodys, isAuto) {
        this.titles = titles;
        this.bodys = bodys;
        this.isAuto = isAuto;
        this.init();
    }
    init() {
        this.bindEvent();
    }
    bindEvent() {
        this.changeClass();
        this.changePage();
        if (this.isAuto) {
            this.autoPlay();
        }
    }
    // 改变选项卡标签的样式
    changeClass() {
        var _this = this;
        for (let i = 0; i < this.titles.length; i++) {
            this.titles.eq(i).click( function (){
                $(this).addClass("active").siblings().removeClass("active");
                _this.changePage();
            })
        }
    }
    // 通过选项卡标签的class决定选项卡body显示第几页
    changePage() {
        for (let i = 0; i < this.titles.length; i++) {
            if (this.titles.eq(i).hasClass("active")) {
                this.bodys.eq(i).css({
                    display: "block"
                }).siblings().css({
                    display: "none"
                })
            }
        }
    }
    // 自动切换选项卡
    autoPlay() {
        this.timer = setInterval(() => {
            for (let i = 0; i < this.titles.length; i++) {
                if (this.titles.eq(i).hasClass("active")) {
                    if (i == this.titles.length - 1) {
                        this.titles.eq(i).removeClass("active");
                        this.titles.eq(0).addClass("active");
                        break;
                    }
                    this.titles.eq(i).removeClass("active").next().addClass("active");
                    break;
                }
            }
            this.changePage();
        }, 3000);
        // 当鼠标进入时，停止自动切换功能
        this.bodys.hover(()=>{
            clearInterval(this.timer);
        }, ()=>{
            this.timer = setInterval(() => {
                for (let i = 0; i < this.titles.length; i++) {
                    if (this.titles.eq(i).hasClass("active")) {
                        if (i == this.titles.length - 1) {
                            this.titles.eq(i).removeClass("active");
                            this.titles.eq(0).addClass("active");
                            break;
                        }
                        this.titles.eq(i).removeClass("active").next().addClass("active");
                        break;
                    }
                }
                this.changePage();
            }, 3000);
        })
    }
}
new Tab($("#hotBrand").children(".hotBrand-title").children(".hotList").children("li"), $("#hotBrand").children(".hotBrand-container").children(".container-train").children("li"), true)



// 把数据渲染到选项卡中
class RenderTab {
    constructor(options) {
        this.titles = options.titles;
        this.bodys = options.bodys;
        this.url = options.url;
        this.init();
    }
    init() {
        this.load();
    }
    load() {
        ajaxGet(this.url, (res)=>{
            this.res = JSON.parse(res).wine;
            this.renderTitle();
            this.renderPage();
        })
    }
    renderTitle() {
        for (let i = 0; i < this.res.length; i++) {
            this.titles.children("li").eq(i).html(this.res[i].type);
        }
    }
    renderPage() {
        for (let i = 0; i < this.res.length; i++) {
            this.bodys.children("li").eq(i).children(".hotBrand-container-titlePic").children("a").children("img").attr("src", this.res[i].titlePic);
            var str = "";
            for (let j = 0; j < this.res[i].hotBrand.length; j++) {
                str += `
                <li class="hotBrand-container-smPic">
                    <div class="smPic-bg">
                        <img src="${this.res[i].hotBrand[j].brandPic}" alt="">
                    </div>
                    <div class="smPic-prev">
                        <div class="toShopBox">
                            <div class="toShopName"><span>${this.res[i].hotBrand[j].name}</span></div>
                            <div class="toShopBtn"><span>进店看看</span></div>
                        </div>
                    </div>
                </li>
                `
            }
            this.bodys.children("li").eq(i).children(".hotBrand-container-smList").html(str);
        }
    }
}

new RenderTab({
    titles: $("#hotBrand").children(".hotBrand-title").children(".hotList"),
    bodys: $("#hotBrand").children(".hotBrand-container").children(".container-train"),
    url: "http://localhost/MyProject/libs/hotBrand.json"
})






// 渲染快讯
class RenderNews {
    constructor(newsBox, url) {
        this.newsBox = newsBox;
        this.url = url;
        this.init();
    }
    init() {
        this.load();
    }
    load() {
        ajaxGet(this.url, (res) => {
            this.res = JSON.parse(res).kuaixun;
            this.bindEvent();
        })
    }
    bindEvent() {
        var str = "";
        for (let i = 0; i < this.res.length; i++) {
            str += `
            <p><a class="global-link news" href="${this.res[i].link}">${this.res[i].title}</a>
            </p>
            `
        }
        this.newsBox.html(str);
    }
}

new RenderNews($("#personalInfo").children(".newsBox"), "http://localhost/MyProject/libs/hotBrand.json");



// 楼层的选项卡功能可以通过上面Tab方法实现,但RenderTab方法的功能设计有点单一,不太容易改动,所以重写了一个渲染楼层的方法.
class RenderFloors {
    constructor(building, url) {
        this.building = building;
        this.url = url;
        this.init();
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
    // 楼层所用到的数据量过于庞大， 所以代码冗长，但逻辑性不强， 易懂
    render() {
        var str = "";
        // 这里是循环楼层的层数，这里有4层楼，所以会循环4次，每次循环，str中会增加一层楼中的所有数据。
        for (let i = 0; i < this.res.length; i++) {
            // 循环添加title中的小链接
            var asideStr = "";
            for (let j = 0; j < this.res[i].aside.length; j++) {
                asideStr += `<li><a class="global-link" href="">${this.res[i].aside[j]}</a></li>`
            }
            // 循环添加楼层中的选项卡的标签
            var allTypeStr = `<li class="active">热推</li>`;
            for (let j = 1; j < this.res[i].allType.length; j++) {
                allTypeStr += `
                <li>${this.res[i].allType[j]}</li>
                `
            }
            // 循环添加选项卡中左侧的图片
            var mainPicStr = "";
            for (let j = 0; j < this.res[i].mainPic.length; j++) {
                mainPicStr += `
                <a href="${this.res[i].mainPic[j].url}">
                    <img src="${this.res[i].mainPic[j].pic}" alt="${this.res[i].mainPic[j].name}">
                </a>
                `
            }
            // 循环添加选项卡中左侧的图片的名字,即标签
            var mainPicListStr = "";
            for (let j = 0; j < this.res[i].mainPic.length; j++) {
                mainPicListStr += `
                <li class="global-link">${this.res[i].mainPic[j].name}</li>
                `
            }
            // 循环添加选项卡第一页,即每个热推页,中的商品列表
            var mainListStr = "";
            for (let j = 0; j < this.res[i].mainList.length; j++) {
                mainListStr += `
                <li>
                    <div class="hot-list-img">
                        <a href="">
                            <img src="${this.res[i].mainList[j].imgs}" alt="${this.res[i].mainList[j].name}">
                        </a>
                    </div>
                    <p class="list-name"><a class="global-link" href="">${this.res[i].mainList[j].name}</a></p>
                    <p class="list-price"><span class="price-icon">￥</span><span
                            class="price-num">${this.res[i].mainList[j].price}</span></p>
                </li>
                `;
            }
            // 渲染热推页中HOT5的数据，因为1、2与3、4、5的样式不一样，所以进行了判断
            var top5ListStr = "";
            // 长度小于2
            if (this.res[i].mainTop5.top5List.length <= 2) {
                // 直接循环
                for (let j = 0; j < this.res[i].mainTop5.top5List.length; j++) {
                    top5ListStr += `
                    <li class="top5-top2 clear">
                        <div class="top-index">${this.res[i].mainTop5.top5List[j].rank}</div>
                        <div class="top-info">
                            <div class="top2-img">
                                <img src="${this.res[i].mainTop5.top5List[j].img}" alt="${this.res[i].mainTop5.top5List[j].name}">
                            </div>
                            <div class="top2-info">
                                <p class="top2-name">
                                    <a href="" class="global-link">${this.res[i].mainTop5.top5List[j].name}</a>
                                </p>
                                <p class="top2-price">
                                    <span class="top2-price-icon price-icon">￥</span><span
                                        class="top2-price-num">${this.res[i].mainTop5.top5List[j].price}</span>
                                </p>
                            </div>
                        </div>
                    </li>
                    `
                }
            }
            // 长度大于2
            if (this.res[i].mainTop5.top5List.length > 2) {
                // 先渲染前2个
                for (let j = 0; j < 2; j++) {
                    top5ListStr += `
                    <li class="top5-top2 clear">
                        <div class="top-index">${this.res[i].mainTop5.top5List[j].rank}</div>
                        <div class="top-info">
                            <div class="top2-img">
                                <img src="${this.res[i].mainTop5.top5List[j].img}" alt="${this.res[i].mainTop5.top5List[j].name}">
                            </div>
                            <div class="top2-info">
                                <p class="top2-name">
                                    <a href="" class="global-link">${this.res[i].mainTop5.top5List[j].name}</a>
                                </p>
                                <p class="top2-price">
                                    <span class="top2-price-icon price-icon">￥</span><span
                                        class="top2-price-num">${this.res[i].mainTop5.top5List[j].price}</span>
                                </p>
                            </div>
                        </div>
                    </li>
                    `
                }
                // 再渲染后3个
                for (let j = 2; j < this.res[i].mainTop5.top5List.length; j++) {
                    top5ListStr += `
                    <li class="top5-later3 clear">
                        <div class="top-index">${this.res[i].mainTop5.top5List[j].rank}</div>
                        <div class="later3-name">
                            <a href="" class="global-link">${this.res[i].mainTop5.top5List[j].name}</a>
                        </div>
                    </li>
                    `;
                }
            }
            // 循环添加非热推页中商品的列表
            var listImgsStr = "";
            for (let j = 0; j < this.res[i].listImgs.length; j++) {
                var listImgsListsStr = "";
                for (let k = 0; k < this.res[i].listImgs[j].lists.length; k++) {
                    listImgsListsStr += `
                            <li>
                                <div class="list-img">
                                    <a href=""><img src="${this.res[i].listImgs[j].lists[k].imgs}" alt="第${this.res[i].listImgs[j].type}页"></a>
                                </div>
                                <div class="list-info">
                                    <p class="list-name"><a class="global-link" href="">${this.res[i].listImgs[j].lists[k].name}</a></p>
                                    <p class="list-price"><span class="price-icon">￥</span><span class="price-num">${this.res[i].listImgs[j].lists[k].price}</span></p>
                                </div>
                            </li>
                            `;
                }
                listImgsStr += `
                            <div class="floor-right-box">
                                <ul class="floor-right-list">${listImgsListsStr}</ul>
                            </div>`
            }
            //讲上面通过循环获取到的所有信息进行整合,加载到楼层中.
            str += `
            <div id="floor${i+1}" class="floor" floor="${i+1}">
                <div class="floor-title">
                    <div class="floor-title-left clear">
                        <span class="floor-index">${i+1}L</span>
                        <h3><a href="" class="global-link">${this.res[i].name}专区</a></h3>
                        <ul class="title-aside">${asideStr}</ul>
                    </div>
                    <div class="floor-title-right">
                        <ul class="floor-tab-title">${allTypeStr} </ul>
                    </div>
                </div>
                <div class="floor-body clear">
                    <div class="floor-main">
                        <div class="floor-main-img">${mainPicStr}</div>
                        <div class="floor-main-button">
                            <ul class="clear">${mainPicListStr}</ul>
                        </div>
                    </div>
                    <div class="floor-right">
                        <div class="floor-right-box hotTop active">
                            <div class="floor-hot-list">
                                <ul>${mainListStr}</ul>
                            </div>
                            <div class="floor-hot5">
                                <div class="hot5-title">${this.res[i].name}TOP5</div>
                                <div class="hot-img">
                                    <a href=""><img src="${this.res[i].mainTop5.topPic}" alt="${this.res[i].name}"></a>
                                </div>
                                <div class="hot5-list"><ul>${top5ListStr}</ul></div>
                            </div>
                        </div>
                        ${listImgsStr}
                    </div>
                </div>
            </div>`
        }
        this.building.html(str);
        // 循环给所有的楼层添加选项卡功能
        for (let i = 0; i < this.res.length; i++) {
            new Tab($(`#floor${i+1}`).children(".floor-title").children(".floor-title-right").children(".floor-tab-title").children("li"), $(`#floor${i+1}`).children(".floor-body").children(".floor-right").children(".floor-right-box"), false);
        }

        new mainPic($(".floor-main"));
        new FloorTrain($("#building").children(".floor"), $("#floorTrain"));
    }
}

new RenderFloors($("#building"), "http://localhost/MyProject/libs/floors.json")

// 楼层中左侧图片的功能略微复杂,所以单独拿出来写了功能,
class mainPic {
    constructor(boxs) {
        this.boxs = boxs;
        this.init();
    }
    init() {
        this.bindEvent();
    }
    bindEvent() {
        this.changeClass();
    }
    changeClass() {
        for (let i = 0; i < this.boxs.length; i++) {
            $(this.boxs[i]).children(".floor-main-button").children("ul").children("li").eq(0).addClass("active");
            $(this.boxs[i]).children(".floor-main-img").children("a").eq(0).addClass("active");
            var _this = this;
            $(this.boxs[i]).children(".floor-main-button").children("ul").children("li").hover(function(){
                $(this).addClass("active").siblings().removeClass("active");
                _this.changeImg();
            })
        }
    }
    changeImg() {
        for (let i = 0; i < this.boxs.length; i++) {
            for (let j = 0; j < $(this.boxs[i]).children(".floor-main-img").children("a").length; j++) {
                if ($(this.boxs[i]).children(".floor-main-button").children("ul").children("li").eq(j).hasClass("active")) {
                    $(this.boxs[i]).children(".floor-main-img").children("a").eq(j).addClass("active").siblings().removeClass("active");
                }
            }
        }

    }
}

// 楼层的点击事件
class FloorTrain {
    constructor(floors, train) {
        this.floors = floors;
        this.train = train;
        this.isVisiable = false;
        this.init();
    }
    init() {
        this.bindEvent();
    }
    bindEvent() {
        this.renderTrain();
        this.displayTrain();
        this.moveFloors();
        this.changeTrain();
    }
    renderTrain() {
        var str = "";
        for (let i = 0; i < this.floors.length; i++) {
            str += `
                <li id="toFloor${i}"><i></i><span>${$(this.floors.eq(i)).children(".floor-title").children(".floor-title-left").children("h3").children("a").html()}
                </span></li>
            `
        }
        this.train.children(".toFloors").html(str);
    }
    displayTrain() {
        this.train.stop().fadeOut(0);
        $(document).scroll (() => {
            if ($("html").scrollTop() > this.floors.eq(0).offset().top - 20) {
                if (!this.isVisiable) {
                    this.train.stop().fadeIn(100);
                    this.isVisiable = true
                }
            } else {
                if (this.isVisiable) {
                    this.train.stop().fadeOut(100);
                    this.isVisiable = false;
                }
            }
        })
    }
    moveFloors() {
        for (let i = 0; i < this.floors.length; i++) {
            this.train.children(".toFloors").children("li").eq(i).click(() => {
                $("html").stop().animate({
                    scrollTop: this.floors.eq(i).offset().top
                })
            })
        }
        // 移动到顶部
        this.train.children(".toTop").click(() => {
            $("html").stop().animate({
                scrollTop: 0
            })
        })
    }
    // 改变样式
    changeTrain() {
        $(document).scroll(() => {
            for (let i = 0; i < this.floors.length - 1; i++) {
                if ($("html").scrollTop() > this.floors.eq(i).offset().top - 200 && $("html").scrollTop() < this.floors.eq(i + 1).offset().top - 200) {
                    this.train.children(".toFloors").children("li").eq(i).addClass("active").siblings().removeClass("active");
                }
            }
            if ($("html").scrollTop() > this.floors.eq(this.floors.length - 1).offset().top - 200) {
                this.train.children(".toFloors").children("li").eq(this.floors.length - 1).addClass("active").siblings().removeClass("active")

            }
        })
    }
}
class GoodsList{
    constructor(list, url ){
        this.list = list;
        this.url = url;
        this.init();
    }
    init(){
        this.bindEvent();
    }
    bindEvent(){
        this.load();
    }
    // ajax从json中获取所有商品的全部信息。
    load(){
        ajaxGet(this.url, (res) =>{
            this.res = JSON.parse(res);
            // 因为涉及到异步，需要在获取完毕之后再执行渲染
            this.render();
        });
    }
    // 渲染所有的商品信息.
    render(){
        var str = "";
        for(let i = 0; i < this.res.length; i++){
            str+=`
            <li index="${this.res[i].id}">
                <div class="mainPic">
                    <a href="http://localhost/MyProject/productInfo.html?id=${this.res[i].id}"><img src="${this.res[i].picList[0]}" alt=""></a>
                </div>
                <div class="price">
                    <span class="nowPrice">
                        <i class="price-icon">￥</i>
                        <i class="price-num">${this.res[i].price}</i>
                    </span>
                    <span class="marketPrice">
                        <i class="price-icon">￥</i>
                        <i class="price-num">${this.res[i].marketPrice}</i>
                    </span>
                </div>
                <p class="goodsName">
                    <a class="global-link" href="">${this.res[i].name}</a>
                </p>
            </li>
            `;
        }
        this.list.children(".productLists").html(str);
    }
}

new GoodsList($("#goodsList"), "http://localhost/MyProject/libs/goods.json");
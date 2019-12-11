function ajaxGet(url,cb,data){
    data = data || {};
    var str = "";
    for(var i in data){
        str += `${i}=${data[i]}&`;
    }
    var d = new Date();
    url = url + "?" + str + "__qft="+d.getTime();
    
    var xhr = new XMLHttpRequest();
    xhr.open("get",url,true);
    xhr.onreadystatechange = function(){
        if(xhr.readyState == 4 && xhr.status == 200){
            cb(xhr.responseText)
        }
    }
    xhr.send();
}



function ajaxPost(url,callBack,data){
    data = data || {};
    var str = "";
    for(var i in data){
         str += `${i}=${data[i]}&`;
    }
    var d = new Date();
    str = str + "_____time=" + d.getMilliseconds();
    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.onreadystatechange = function(){
        if(xhr.readyState == 4 && xhr.status == 200){
            callBack(xhr.responseText);
        }
    }
    xhr.setRequestHeader("content-type","aplication/x-www-form-urlencoded");
    xhr.open(str);
}



function jsonp(url, callBack, data){
    var str = "";
    for(var i in data){
        str += `${i}=${data[i]}&`;
    }
    url = url + "?" +str.slice(0, str.length - 1);
    var scri = document.createElement("script");
    scri.src = url;
    document.body.appendChild(scri);
    window[data[data.clumnName]] = function(res){
        callBack(res);
    }
}
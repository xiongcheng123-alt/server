function getCookie(key){
	var arr = document.cookie.split("; ");
	for(var i=0;i<arr.length;i++){
		if(arr[i].split("=")[0] == key){
			return arr[i].split("=")[1];
		}
	}
	return "";
}


function removeCookie(key,options){
	options = options || {};
	setCookie(key,null,{
		expires:-1,
		path:options.path
	})
}


function setCookie(key,val,options){
	options = options || {};
	var p = options.path ? ";path="+options.path : "";
	var e = "";
	if(options.expires){
		var d = new Date();
		d.setDate(d.getDate()+options.expires)
		e = ";expires="+d;
	}
	document.cookie = key+"="+ val + e + p;
}
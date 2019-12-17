/**
 * NumCul
 */

;window.NumCul = (function(){

  // 実行済みの場合は、処理追加をしない。
  if(typeof window.NumCul !== "undefined"){return;}

  // options
  var __options = {
    
  };


  // ----------
  // Ajax
  var AJAX = function(options){
    if(!options){return}
		var httpoj = this.createHttpRequest();
		if(!httpoj){return;}
		// open メソッド;
		var option = this.setOption(options);

		// queryデータ
		var data = this.setQuery(option);
		if(!data.length){
			option.method = "get";
		}

		// 実行
		httpoj.open( option.method , option.url , option.async );
		// type
		if(option.type){
			httpoj.setRequestHeader('Content-Type', option.type);
		}
		
		// onload-check
		httpoj.onreadystatechange = function(){
			//readyState値は4で受信完了;
			if (this.readyState==4 && httpoj.status == 200){
				//コールバック
				option.onSuccess(this.responseText);
			}
		};

		// FormData 送信用
		if(typeof option.form === "object" && Object.keys(option.form).length){
			httpoj.send(option.form);
		}
		// query整形後 送信
		else{
			//send メソッド
			if(data.length){
				httpoj.send(data.join("&"));
			}
			else{
				httpoj.send();
			}
		}
		
  };
	AJAX.prototype.dataOption = {
		url:"",
		query:{},
		querys:[],
		data:{},
		form:{},
		async:"true",
		method:"POST",
		type:"application/x-www-form-urlencoded",
		onSuccess:function(res){},
		onError:function(res){}
	};
	AJAX.prototype.option = {};
	AJAX.prototype.createHttpRequest = function(){
		//Win ie用
		if(window.ActiveXObject){
			//MSXML2以降用;
			try{return new ActiveXObject("Msxml2.XMLHTTP")}
			catch(e){
				//旧MSXML用;
				try{return new ActiveXObject("Microsoft.XMLHTTP")}
				catch(e2){return null}
			}
		}
		//Win ie以外のXMLHttpRequestオブジェクト実装ブラウザ用;
		else if(window.XMLHttpRequest){return new XMLHttpRequest()}
		else{return null}
	};
	AJAX.prototype.setOption = function(options){
		var option = {};
		for(var i in this.dataOption){
			if(typeof options[i] != "undefined"){
				option[i] = options[i];
			}
			else{
				option[i] = this.dataOption[i];
			}
		}
		return option;
	};
	AJAX.prototype.setQuery = function(option){
		var data = [];
		if(typeof option.datas !== "undefined"){

			// data = option.data;
			for(var key of option.datas.keys()){
				data.push(key + "=" + option.datas.get(key));
			}
		}
		if(typeof option.query !== "undefined"){
			for(var i in option.query){
				data.push(i+"="+encodeURIComponent(option.query[i]));
			}
		}
		if(typeof option.querys !== "undefined"){
			for(var i=0;i<option.querys.length;i++){
				if(typeof option.querys[i] == "Array"){
					data.push(option.querys[i][0]+"="+encodeURIComponent(option.querys[i][1]));
				}
				else{
					var sp = option.querys[i].split("=");
					data.push(sp[0]+"="+encodeURIComponent(sp[1]));
				}
			}
		}
		return data;
	};

	AJAX.prototype.loadHTML = function(filePath , selector , callback){
		var url = (filePath.indexOf("?") === -1) ? filePath+"?"+(+new Date()) : filePath+"&"+(+new Date());
		new AJAX({
      url:url,
      method:"GET",
      async:true,
      onSuccess:(function(selector,res){

        var target = document.querySelector(selector);
				if(!target){return;}

				// resをelementに変換
				var div1 = document.createElement("div");
				var div2 = document.createElement("div");
				div1.innerHTML = res;

				// script抜き出し
				var scripts = div1.getElementsByTagName("script");
				while(scripts.length){
					div2.appendChild(scripts[0]);
				}

				// script以外
				target.innerHTML = div1.innerHTML;

				// script
				this.orderScripts(div2 , target);

				// callback
				if(callback){
					callback();
				}

      }).bind(this,selector)
    });
	};

	AJAX.prototype.orderScripts = function(scripts , target){
		if(!scripts.childNodes.length){return;}
		
		var trash = document.createElement("div");
		var newScript = document.createElement("script");
		if(scripts.childNodes[0].innerHTML){newScript.innerHTML = scripts.childNodes[0].innerHTML;}

		// Attributes
		var attrs = scripts.childNodes[0].attributes;
		for(var i=0; i<attrs.length; i++){
			newScript.setAttribute(attrs[i].name , attrs[i].value);
		}

		// script実行（読み込み）
		target.appendChild(newScript);
		trash.appendChild(scripts.childNodes[0]);
		this.orderScripts(scripts , target);

	};

	AJAX.prototype.addHTML = function(filePath , selector , callback){
		var url = (filePath.indexOf("?") === -1) ? filePath+"?"+(+new Date()) : filePath+"&"+(+new Date());
		new AJAX({
      url:url,
      method:"GET",
      async:true,
      onSuccess:(function(selector,res){

        var target = document.querySelector(selector);
				if(!target){return;}

				// resをelementに変換
				var div1 = document.createElement("div");
				var div2 = document.createElement("div");
				div1.innerHTML = res;

				// script抜き出し
				var scripts = div1.getElementsByTagName("script");
				while(scripts.length){
					div2.appendChild(scripts[0]);
				}

				// script以外
				target.innerHTML += div1.innerHTML;

				// script
				this.orderScripts(div2 , target);

				// callback
				if(callback){
					callback();
				}

      }).bind(this,selector)
    });
	};

	AJAX.prototype.lastModified = function(path , callback){
		if(!path || !callback){return}
		var httpoj = this.createHttpRequest();
		if(!httpoj){return}

		httpoj.open("get" , path);
		httpoj.onreadystatechange = (function(callback){
			if (httpoj.readyState == 4 && httpoj.status == 200) {
				var date = new Date(httpoj.getResponseHeader("last-modified"));
				var res = {
					date : date,
					y : date.getFullYear(),
					m : date.getMonth() + 1,
					d : date.getDate(),
					h : date.getHours(),
					i : date.getMinutes(),
					s : date.getSeconds()
				};
				callback(res);
			}
		}).bind(this,callback);
		httpoj.send(null);
  };
  



  // ----------
  // Library
  var LIB   = function (){};
 
  LIB.prototype.event = function(target, mode, func){
		if (target.addEventListener){target.addEventListener(mode, func, false)}
		else{target.attachEvent('on' + mode, function(){func.call(target , window.event)})}
  };

  // 起動scriptタグを選択
  LIB.prototype.currentScriptTag = (function(){
    var scripts = document.getElementsByTagName("script");
    return this.currentScriptTag = scripts[scripts.length-1].src;
  })();

  // [共通関数] URL情報分解
	LIB.prototype.urlinfo = function(uri){
    uri = (uri) ? uri : location.href;
    var data={};
    var urls_hash  = uri.split("#");
    var urls_query = urls_hash[0].split("?");
		var sp   = urls_query[0].split("/");
		var data = {
      uri      : uri
		,	url      : sp.join("/")
    , dir      : sp.slice(0 , sp.length-1).join("/") +"/"
    , file     : sp.pop()
		,	domain   : sp[2]
    , protocol : sp[0].replace(":","")
    , hash     : (urls_hash[1]) ? urls_hash[1] : ""
		,	query    : (urls_query[1])?(function(urls_query){
				var data = {};
				var sp   = urls_query.split("#")[0].split("&");
				for(var i=0;i<sp .length;i++){
					var kv = sp[i].split("=");
					if(!kv[0]){continue}
					data[kv[0]]=kv[1];
				}
				return data;
			})(urls_query[1]):[]
		};
		return data;
  };

  //指定したエレメントの座標を取得
	LIB.prototype.pos = function(e,t){

		//エレメント確認処理
		if(!e){return null;}

		//途中指定のエレメントチェック（指定がない場合はbody）
		if(typeof(t)=='undefined' || t==null){
			t = document.body;
		}

		//デフォルト座標
		var pos={x:0,y:0};
		do{
			//指定エレメントでストップする。
			if(e == t){break}

			//対象エレメントが存在しない場合はその辞典で終了
			if(typeof(e)=='undefined' || e==null){return pos;}

			//座標を足し込む
			pos.x += e.offsetLeft;
			pos.y += e.offsetTop;
		}

		//上位エレメントを参照する
		while(e = e.offsetParent);

		//最終座標を返す
		return pos;
  };
  
  // 配列（連想配列）のソート
  LIB.prototype.hash_sort = function(val){
    // json化して戻すことで、元データの書き換えを防ぐ
    var hash = JSON.parse(JSON.stringify(val));
    
    // 連想配列処理
    if(typeof hash === "object"){
      var flg = 0;
      for(var i in hash){
        if(typeof hash[i] === "object"){
          hash[i] = JSON.stringify(hashSort(hash[i]));
        }
        flg++;
      }
      if(flg <= 1){console.log(hash);
        return JSON.stringify(hash)}
      if(typeof hash.length === "undefined"){
        var keys = Object.keys(hash).sort();
        var newHash = {};
        for(var i=0; i<keys.length; i++){
          newHash[keys[i]] = hash[keys[i]];
        }
        return newHash;
      }
      else{
        hash.sort(function(a,b){
          if( a < b ) return -1;
          if( a > b ) return 1;
          return 0;
        });
        return hash;
      }
    }
    // その他タイプはそのまま返す
   else{
      return hash;
    }
  }
  // ２つのハッシュデータの同一比較
  LIB.prototype.hash_compare = function(data1 , data2){
    data1 = this.hash_sort(data1);
    data2 = this.hash_sort(data2);
    if(JSON.stringify(data1) === JSON.stringify(data2)){
      return true;
    }
    else{
      return false;
    }
  };
  LIB.prototype.upperSelector = function(elm , selectors) {
    selectors = (typeof selectors === "object") ? selectors : [selectors];
    if(!elm || !selectors){return;}
    var flg = null;
    for(var i=0; i<selectors.length; i++){
      for (var cur=elm; cur; cur=cur.parentElement) {
        if (cur.matches(selectors[i])) {
          flg = true;
          break;
        }
      }
      if(flg){
        break;
      }
    }
    return cur;
  }

  LIB.prototype.numberFormat3_integer = function(num){
    num = String(num);
    var tmpStr = "";
    while (num != (tmpStr = num.replace(/^([+-]?\d+)(\d\d\d)/,"$1,$2"))){num = tmpStr;}
    return num;
  };



  

  // // イベントライブラリ
  // var $$event = function(target, mode, func){
	// 	//other Browser
	// 	if (typeof target.addEventListener !== "undefined"){
  //     target.addEventListener(mode, func, false);
  //   }
  //   else if(typeof target.attachEvent !== "undefined"){
  //     target.attachEvent('on' + mode, function(){func.call(target , window.event)});
  //   }
  // };

  // check-onload
  var MAIN = function(options){
    // if(!options){return;}
    this.options = this.setOptions(options);
    var lib  = new LIB();
    switch(document.readyState){
      case "complete"    : this.set();break;
      case "interactive" : lib.event(window , "DOMContentLoaded" , (function(e){this.set(e)}).bind(this));break;
      default            : lib.event(window , "load" , (function(e){this.set(e)}).bind(this));break;
    }
  };

  // optionsセット
  MAIN.prototype.setOptions = function(options){
    var lib = new LIB();

    var op = JSON.parse(JSON.stringify(__options));
    for(var i in options){
      op[i] = options[i];
    }

    // 起動プログラムを保持
    var src = lib.currentScriptTag;
    if(typeof src === "string"){
      var urlinfo = lib.urlinfo(src);
      op.dir  = urlinfo.dir;
      op.src  = src;
      op.file = urlinfo.file
    }
    else{return}

    return op;
  };



  // loaded initial-setting
  MAIN.prototype.set = function(){

    this.getTemplate();
    this.setCss();
    this.setEvent();

    // // set stylesheet
    // var style = document.createElement("style");
    // style.rel = "stylesheet";
    // style.innerHTML = "*[data-numcul='1']{background-color:#FCC;}";
    // document.getElementsByTagName("head")[0].appendChild(style);

    // window-click
    // $$event(window , "click" , (function(e){this.clickWindow(e)}).bind(this));
    // $$event(window , "mouseup" , (function(e){this.culcElements(e)}).bind(this));
  };

  MAIN.prototype.getTemplate = function(){
    if(!this.options.dir){return}
    var path = this.options.dir+"template.html";
    new AJAX({
      url : path,
      onSuccess : (function(res){
        if(!res){
          console.log("Error : input_cache : not-template-file. ("+ path +")");
          return;
        }
        this.options.template = res;
      }).bind(this)
    });
  };

  MAIN.prototype.setCss = function(){
    if(!this.options.dir || !this.options.file){return}
    var file = this.options.file.replace(".js" , ".css");
    var head = document.querySelector("head");
    if(!head){return}
    var link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = this.options.dir + file +"?"+ (+new Date());
    head.appendChild(link);
  };

  MAIN.prototype.setEvent = function(){
    // new LIB().event(window , "click" , (function(e){this.clickWindow(e)}).bind(this));
    new LIB().event(window , "mousedown"  , (function(e){this.clickWindow_down(e)}).bind(this));
    new LIB().event(window , "mousemove"  , (function(e){this.clickWindow_move(e)}).bind(this));
    new LIB().event(window , "mouseup"    , (function(e){this.clickWindow_up(e)}).bind(this));
    new LIB().event(window , "toushctart" , (function(e){this.clickWindow_down(e)}).bind(this));
    new LIB().event(window , "touchmove"  , (function(e){this.clickWindow_move(e)}).bind(this));
    new LIB().event(window , "touchend"   , (function(e){this.clickWindow_up(e)}).bind(this));
    // new LIB().event(window , "scroll"     , (function(e){this.clickWindow_scroll(e)}).bind(this));
  };






  // click-window : only table-cell
  MAIN.prototype.calc = function(e){
    var target = e.target;

    // check element
    if(target.tagName !== "TD"){return;}

    // toggle element -del
    if(target.getAttribute("data-numcul") === "1"){
      target.removeAttribute("data-numcul");
    }

    // toggle element -add
    else{
      // set element
      target.setAttribute("data-numcul" , "1");
    }

    this.culcElements();

  };

  MAIN.prototype.view = function(str){
    this.view_remove();

    var div = document.createElement("div");
    div.className = "table-numcal";
    document.body.appendChild(div);

    div.textContent = "total : "+ str;
  };
  MAIN.prototype.view_remove = function(){
    var elms = document.getElementsByClassName("table-numcal");
    for(var i=elms.length-1; i>=0; i--){
      elms[i].parentNode.removeChild(elms[i]);
    }
  };


  MAIN.prototype.culcElements = function(){
    var targets = document.querySelectorAll("*[data-numcul='1']");
    var num = 0;
    for(var i=0; i<targets.length; i++){
      num += this.changeNumeric(targets[i].textContent);
    }
// console.log(num);
    this.view(new LIB().numberFormat3_integer(num));
  };

  MAIN.prototype.changeNumeric = function(str){
    str = str.replace(/[^0-9\.]/g,"");
    return Number(str);
  };


  // clear
  MAIN.prototype.clearCell = function(){
    var tables = document.getElementsByTagName("table");
    for(var i=0; i<tables.length; i++){
      var tds = tables[i].querySelectorAll("td[data-numcul='1']");
      for(var j=0; j<tds.length; j++){
        tds[j].removeAttribute("data-numcul")
      }
    }
    this.view_remove();
  };



  MAIN.prototype.clickWindow_down = function(e){
    var cell = e.target;
    if(!cell){return;}

    // check element-tag
    if(cell.tagName !== "TD"){
      this.clearCell();
      return;
    }

    this.flg_target = cell;
    // var currentTable = new LIB().upperSelector(cell , "table");
    var currentTable = cell.parentNode.parentNode;
    if(this.flg_table){
      if(this.flg_table !== currentTable){
        e.preventDefault();
        this.flg_pos = false;
        this.clearCell();
      }
    }
    this.flg_table = currentTable;

    // // shift-key
    // this.key_shift =  (e.shiftKey === true) ? true : false;
    // // control-key
    // this.key_ctrl =  (e.ctrlKey === true) ? true : false;
    // // alt-key
    // this.key_alt = (e.altKey === true) ? true : false;

    // mode [shift / ctrl / drag]
    if(e.shiftKey === true && this.flg_pos){
      e.preventDefault();
      // this.flg_mode = "shift";

      // draws
      this.drawCells(this.flg_pos , this.getTablePosition(cell));

      // this.flg_pos  = false;
    }
    // else if(e.ctrlKey === true){
    //   // this.flg_mode = "control";
      
    //   e.preventDefault();
    //   event.returnValue = false;

    //   this.flg_pos    = this.getTablePosition(cell);

    //   this.view({target:cell});

    //   // event.returnValue = false;
    //   return false;
    // }
    else{
      this.flg_mode = "normal";

      // clear
      this.clearCell();

      // draw
      this.calc({target:cell});

      // flg
      // 
      this.flg_pos    = this.getTablePosition(cell);
    }

    
  };

  MAIN.prototype.clickWindow_move = function(e){
    if(this.flg_mode !== "normal"){return;}
    e.preventDefault();
    var cell = e.target;
    if(!cell || cell.tagName !== "TD"){return;}

    // var currentTable = new LIB().upperSelector(cell , "table");
    var currentTable = cell.parentNode.parentNode;
    if(currentTable !== this.flg_table){return;}

    // draws
    this.drawCells(this.flg_pos , this.getTablePosition(cell));
  };
  MAIN.prototype.clickWindow_up = function(e){

    this.flg_mode = false;
    this.flg_target = false;
  };


  MAIN.prototype.getTablePosition = function(cell){
    if(!cell){return  {x:null,y:null}};
    var tr = cell.parentNode;
    var tds = tr.querySelectorAll(":scope > td");
    var x = null;
    for(var i=0; i<tds.length; i++){
      if(tds[i] !== cell){continue;}
      x = i;
      break;
    }
    var tbody = tr.parentNode;
    var trs = tbody.querySelectorAll(":scope > tr");
    var y = null;
    for(var i=0; i<trs.length; i++){
      if(trs[i] !== tr){continue;}
      y = i;
      break;
    }
    return {x:x,y:y};
  };

  MAIN.prototype.drawCells = function(pos1 , pos2){
    if(pos1 === pos2){return;}

    // clear
    this.clearCell();

    var tbody = this.flg_target.parentNode.parentNode;
    var trs = tbody.querySelectorAll(":scope > tr");

    var y1 = (pos1.y < pos2.y) ? pos1.y : pos2.y;
    var y2 = (pos1.y < pos2.y) ? pos2.y : pos1.y;
    var x1 = (pos1.x < pos2.x) ? pos1.x : pos2.x;
    var x2 = (pos1.x < pos2.x) ? pos2.x : pos1.x;

    // make square
    for(var y=y1; y<=y2; y++){
      var tr = trs[y];
      var tds = tr.querySelectorAll(":scope > td");
      for(var x=x1; x<=x2; x++){
        var td = tds[x];
        this.calc({target:td});
      }
    }
  };




  new MAIN();
})();
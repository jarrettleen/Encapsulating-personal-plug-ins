var lby = {}; //初始化
lby.tools = {}; //工具
lby.ui = {}; //公用方法
lby.app = {}; //功能

/**
 * 初始化添加内容*
 * */

/**
 * 初始化添加内容end
 * **/

/**
 * 工具添加内容*
 * */

/**
 * dom ready执行
 * **/

lby.tools.ready = function(fn){
    if(document.addEventListener){
        document.addEventListener('DOMContentLoaded',function(){
            document.removeEventListener('DOMContentLoaded',arguments.callee);
            fn();
        });
    }else if(document.attachEvent){
        document.attachEvent('onreadystatechange',function(){
            if(document.readystate =='complete'){
                document.dispatchEvent('onreadystatechange',arguments.callee);
                fn();
            }
        });
    }
};

/**
 * 事件绑定
 * 1.oTarget需要绑定的元素     数据为元素变量
 * 2.sEventType需要绑定的时间    数据类型为string
 * 3.fnHandler为回调函数    回调内容为event
 * **/

lby.tools.addEventHandler = function (oTarget, sEventType, fnHandler) {
    if (oTarget.addEventListener) {   //监听IE9，谷歌和火狐
        oTarget.addEventListener(sEventType, fnHandler, false);
    } else if (oTarget.attachEvent) {  //IE
        oTarget.attachEvent("on" + sEventType, fnHandler);
    } else {
        oTarget["on" + sEventType] = fnHandler;
    }
};

/**
 * 查询某元素样式
 * 1.obj要获取元素的节点名称    数据类型为变量
 * 2.name为获取样式名称     数据类型为string
 * **/

lby.tools.getStyle = function(obj,name) {
    return (obj.currentStyle || getComputedStyle(obj,false))[name];
};

lby.tools.addStyle = function (obj,json) {
    for (var name in json) {
        for(var i = 0; i < obj.length; i++){
            obj[i].style[name] = json[name];
        }
    }
};

lby.tools.hasClass = function (obj, cls) {
    return obj.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
};

lby.tools.addClass = function (obj, cls) {
    if (!this.hasClass(obj, cls)) {
        obj.className += " " + cls;
    }
};

lby.tools.removeClass = function (obj, cls) {
    if (lby.tools.hasClass(obj, cls)) {
        var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
        obj.className = obj.className.replace(reg, ' ');
    }
};

lby.tools.toggleClass = function (obj,cls){
    if(lby.tools.hasClass(obj,cls)){
        lby.tools.removeClass(obj, cls);
    } else {
        lby.tools.addClass(obj, cls);
    }
};

/**
 * 动画插件 move
 * 1.obj要运动的物体    数据类型为变量
 * 2.json -> 存放要改变的属性以及终点位置
 * 3.options -> duration -> 总时间
 *            easing -> 运动形式
 * 			  complete -> 回调函数
 * **/

lby.tools.move = function(obj,json,options) {
    // 准备默认值
    options = options || {};
    options.duration = options.duration || 700;
    options.easing = options.easing || 'ease-out';

    var start = {}; // 起点
    var dis = {}; // 总距离
    for (var name in json) {
        start[name] = parseFloat(lby.tools.getStyle(obj,name));
        dis[name] = json[name] - start[name];
    }
    var count = Math.floor(options.duration/30);// 总次数
    var n = 0; // 当前走的次数
    // 先关后开定时器
    clearInterval(obj.timer);
    obj.timer = setInterval(function(){
        n++;
        // 循环改变样式
        for (var name in json) {
            switch(options.easing) {
                case 'linear': // 匀速
                    var a = n/count;
                    var cur = start[name] + dis[name]*a;
                    break;
                case 'ease-in': // 加速
                    var a = n/count;
                    var cur = start[name] + dis[name]*Math.pow(a,3);
                    break;
                case 'ease-out': // 缓冲
                    var a =  1 - n/count;
                    var cur = start[name] + dis[name]*(1-Math.pow(a,3));
                    break;
            }
            if (name == 'opacity') {
                obj.style.opacity = cur;
                obj.style.filter = 'alpha(opacity:'+cur*100+')';
            } else {
                obj.style[name] = cur + 'px';
            }
        }
        if (n == count) {
            clearInterval(obj.timer);
            // 执行回调
            options.complete && options.complete();
        }
    },30);
};



/**
 * 工具添加内容end
 * **/

/**
 * 公用方法添加内容*
 * */

/**
 * 公用方法添加内容end
 * **/

/**
 * 功能添加内容*
 * */

/**
 * 选项卡效果 参数为json结构
 * 1.name为想做选项卡的dom 数据类型为string,需传元素名称 class或 id
 * 2.oBtn为按钮父元素 类名 数据类型为string
 * 3.adClass为Btn点击后效果的class 数据类型为string
 * 4.oTab为选项卡父元素 类名 数据类型为string
 * 5.oText为oBtn名称,可加可不加
 * 6.结构要严格按照规定来,否则无效
 * **/

lby.app.tab = function(json){
    if($(json.Name + ' ul').size()<=1){
        var oLi = '';
        for(var i = 0; i < $(json.Name + ' .lby_tab_bottom li').size(); i++){
            if(json.hasOwnProperty("Text")){
                oLi += '<li><a href="javascript:;">'+ json.Text[i] +'</a></li>';
            } else {
                oLi += '<li><a href="javascript:;">选项' + i + '</a></li>';
            }
        }
        $(json.Name).prepend('<ul class="lby_tab_btn clearfix">' + oLi + '</ul>');
        $('.lby_tab_btn li').css({width:($('body').width() - $(json.Name + ' .lby_tab_bottom li').size() * 20)/$(json.Name + ' .lby_tab_bottom li').size() + 'px'}).eq(0).addClass(json.AdClass);
        $(json.Tab).each(function(){
            $(this).children().eq(0).show();
        });
        $(json.Btn).each(function(){
            $(this).children().eq(0).addClass(json.AdClass);
        });
        $(json.Btn).children().click(function(){
            $(this).addClass(json.AdClass).siblings().removeClass(json.AdClass);
            var index = $(json.Btn).children().index(this);
            $(json.Tab).children().eq(index).show().siblings().hide();
        });
    }
};


/**
 * banner效果  参数为json结构
 * 1.Name为想做轮播图的dom  数据类型为string,需传元素名称 class 或 id
 * 2.Face为轮播图的默认轮播方向  数据类型为string,需传  Left  Right  Bottom  Top
 * 3.Vision为轮播的默认视觉  数据类型为string  可选参数  默认2d  参数为2d  3d
 * 4.Air为轮播默认下面的点显示隐藏   数据类型为boolean  默认为false  可选为  true   false
 * 5.AirMode为轮播默认点的显示方式有两种   1.圆点    2.长方形     默认为圆形    可传参数    circular    rectangle
 * 6.Arrow为轮播默认显示   参数为  true  显示   false   隐藏   hide   已入显示  移出隐藏
 * **/

lby.app.banner = function (json) {
    /**
     * banner默认参数设置
     * **/
    json.Air = json.Air || true;
    json.Arrow = json.Arrow || 'hide';
    json.AirMode = json.AirMode || 'circular';
    json.Face = json.Face || 'left';
    json.Timer = json.Timer || 1500;
    json.Vision = json.Vision || '3d';
    /**
     * banner默认参数设置END
     * **/

    /**
     * 默认变量设置
     * **/
    var Name = document.querySelector(json.Name);
    lby.tools.addClass(Name,'lby_banner');
    var BanUl = Name.children[0];
    var BanUlLi = BanUl.children;
    var BanBgSize = BanUlLi.length;
    var BanSize = 0;
    var lbyTime = null;
    var ParentWidth = Name.parentNode.clientWidth;
    var ParentHeight = Name.parentNode.clientHeight;
    var jsonSize3D = {};
    var NameSin = false;
    for(var i = 0; i < BanUlLi.length; i++){
        jsonSize3D[i] = lby.tools.getStyle(BanUlLi[i].children[0],'background');
    }
    /**
     * 默认变量设置END
     * **/

    /**
     * banner默认样式设置
     * **/
    Name.style.height = ParentHeight + 'px';
    BanUl.style.height = ParentHeight + 'px';
    lby.tools.addStyle(BanUlLi,{height:ParentHeight + 'px'});
    /**
     * banner默认样式设置END
     * **/

    /***
     * banner切换箭头设置
     * */
    if(json.Arrow === 'true'){
        BannerCir('true');
    } else if (json.Arrow === 'hide'){
        BannerCir('hide');
    }

    function BannerCir(bon) {
        var oDivPrNe = document.createElement("div");
        oDivPrNe.innerHTML = '<a class="lby_prev" href="javascript:;"><</a><a class="lby_next" href="javascript:;">></a>'
        Name.appendChild(oDivPrNe);
        var BtnPrev = Name.querySelector('.lby_prev');
        var BtnNext = Name.querySelector('.lby_next');
        if(bon === 'hide'){
            BtnPrev.style.opacity = 0;
            BtnNext.style.opacity = 0;
            Name.onmouseenter = function(){
                lby.tools.move(BtnPrev,{opacity:1});
                lby.tools.move(BtnNext,{opacity:1});
                clearInterval(lbyTime);
                return false;
            };

            Name.onmouseleave = function(){
                lby.tools.move(BtnPrev,{opacity:0});
                lby.tools.move(BtnNext,{opacity:0});
                timeFace(json.Face);
                return false;
            };
        } else {
            Name.onmouseenter = function(){
                clearInterval(lbyTime);
                return false;
            };

            Name.onmouseleave = function(){
                timeFace(json.Face);
                return false;
            };
        }
        BtnPrev.onclick = function () {
            if (NameSin) return;
            NameSin = true;
            lbyPrev();
            setTimeout(function () {
                NameSin = false;
            },700);
        };

        BtnNext.onclick = function () {
            if (NameSin) return;
            NameSin = true;
            lbyNext();
            setTimeout(function () {
                NameSin = false;
            },700);
        };
    }

    function lbyNext() {
        BanSize++;
        if(BanSize === BanBgSize){
            BanSize = 0;
        }
        banVision(json.Vision);
    }

    function lbyPrev() {
        if(BanSize <= 0){
            BanSize = BanBgSize;
        }
        BanSize--;
        banVision(json.Vision);
    }
    /***
     * banner切换箭头设置END
     * */

    /***
     * banner移动方向
     * BannerSize 左右移动
     * BannerTop  上下移动
     * */
    function BannerSize(Size){
        BanUl.style.width = ParentWidth * BanBgSize + 'px';
        lby.tools.addStyle(BanUlLi,{width:ParentWidth + 'px'});
        lby.tools.move(BanUl,{left:'-' + Size * ParentWidth});
    }

    function BannerTop(Size){
        lby.tools.addStyle(BanUlLi,{float:'none'});
        BanUl.style.width = ParentWidth + 'px';
        lby.tools.move(BanUl,{top:'-' + Size * ParentHeight });
    }

    function BannerTop3D(Size) {
        BanUl.className = 'lby_banner_nr d3';
        Name.style.overflow = 'visible'
        BanUl.style.transform = 'perspective(800px) translateZ(-' + ParentHeight/2 + 'px);';
        for(var i = 0; i < BanUlLi.length; i++){
            switch(i) {
                case 0:
                    BanUlLi[i].style.transform = 'translateZ('+ ParentHeight/2 +'px)';
                    break;
                case 1:
                    BanUlLi[i].style.transform = 'rotateX(90deg) translateZ('+ ParentHeight/2 +'px)';
                    break;
                case 2:
                    BanUlLi[i].style.transform = 'translateZ(-'+ ParentHeight/2 +'px)';
                    break;
                case 3:
                    BanUlLi[i].style.transform = 'rotateX(90deg) translateZ(-'+ ParentHeight/2 +'px)';
                    break;
            }
        }
        BanUl.style.width = ParentWidth + 'px';
        lby.tools.addStyle(BanUlLi,{width:ParentHeight + 'px'});
        BanUl.style.transform = 'rotateX(-' + 90 * Size + 'deg' + ')';
        BanUlLi[Size%4].children[0].style.background = jsonSize3D[Size];
    }

    function BannerSize3D(Size) {
        lby.tools.addClass(BanUl,'d3');
        Name.style.overflow = 'visible';
        BanUl.style.transform = 'perspective(800px) translateZ(-' + ParentWidth/2 + 'px);';
        for(var i = 0; i < BanUlLi.length; i++){
            switch(i) {
                case 0:
                    BanUlLi[i].style.transform = 'translateZ('+ ParentWidth/2 +'px)';
                    break;
                case 1:
                    BanUlLi[i].style.transform = 'rotateY(90deg) translateZ('+ ParentWidth/2 +'px)';
                    break;
                case 2:
                    BanUlLi[i].style.transform = 'translateZ(-'+ ParentWidth/2 +'px)';
                    break;
                case 3:
                    BanUlLi[i].style.transform = 'rotateY(90deg) translateZ(-'+ ParentWidth/2 +'px)';
                    break;
            }
        }
        BanUl.style.width = ParentWidth + 'px';
        lby.tools.addStyle(BanUlLi,{width:ParentWidth + 'px'});
        BanUl.style.transform = 'rotateY(-' + 90 * Size + 'deg' + ')';
        BanUlLi[Size%4].children[0].style.background = jsonSize3D[Size];

    }

    function BannerTopTilt(Size) {

    }

    function BannerSizeTilt(Size) {

    }
    /***
     * banner移动方向END
     * */

    /**
     * banner下方点的控制
     * **/
    if(json.Air){
        var oUl = document.createElement("ul");
        var oUlCon = '';
        for (var i = 0; i < BanBgSize; i++){
            oUlCon += '<li><a href="javascript:;"></a></li>';
        }
        oUl.innerHTML = oUlCon;
        Name.appendChild(oUl);

        var BanBtnLi = oUl.children;
        switch(json.AirMode) {
            case 'circular':
                oUl.className = 'lby_cir';
                oUl.style.marginLeft = -(BanBtnLi.length * 20)/2 + 'px';
                break;
            case 'rectangle':
                oUl.className = 'lby_cir rectangle';
                oUl.style.marginLeft = -(BanBtnLi.length * 60)/2 + 'px';
                break;
        }

        oUl.onclick = function(ev){
            var ev = ev || window.event;
            var target = ev.target || ev.srcElement;
            if(target.nodeName.toLowerCase() === "a"){
                var index;
                for(var i = 0; i < BanBtnLi.length; i++)if(BanBtnLi[i]===target.parentNode)index = i;
                BanSize = index;
                banVision(json.Vision);
            }
        };
    }

    function banVision(Vision){
        switch(Vision) {
            case '2d':
                if(json.Face === 'top' || json.Face === 'bottom'){
                    BannerTop(BanSize);
                } else {
                    BannerSize(BanSize);
                }
                BannerBtn(BanSize);
                break;
            case '3d':
                if(json.Face === 'top' || json.Face === 'bottom'){
                    BannerTop3D(BanSize);
                } else {
                    BannerSize3D(BanSize);
                }
                BannerBtn(BanSize);
                break;
            case 'tilt':
                if(json.Face === 'top' || json.Face === 'bottom'){
                    BannerTopTilt(BanSize);
                } else {
                    BannerSizeTilt(BanSize);
                }
                BannerBtn(BanSize);
                break;
        }
    }

    function BannerBtn(Size) {
        for(var i = 0; i < BanBtnLi.length; i++){
            BanBtnLi[i].className = '';
        }
        BanBtnLi[Size].className = 'active';
    }
    /**
     * banner下方点的控制END
     * **/

    /**
     * banner默认轮播方向控制和默认时间控制
     * **/
    function timeFace(face) {
        switch(face) {
            case 'left':
                lbyTime = setInterval(lbyNext,json.Timer);
                banVision(json.Vision);
                break;
            case 'right':
                lbyTime = setInterval(lbyPrev,json.Timer);
                banVision(json.Vision);
                break;
            case 'top':
                lbyTime = setInterval(lbyNext,json.Timer);
                banVision(json.Vision);
                break;
            case 'bottom':
                lbyTime = setInterval(lbyPrev,json.Timer);
                banVision(json.Vision);
                break;
        }
    }
    /**
     * banner默认轮播方向控制和默认时间控制END
     * **/

    /**
     * 执行插件默认调用方法
     * **/
    timeFace(json.Face);
    /**
     * 执行插件默认调用方法END
     * **/

    /**
     * 浏览器失去焦点定时器问题
     * **/
    window.onfocus = function(){
        timeFace(json.Face);
        return false;
    };

    window.onblur=function(){
        clearInterval(lbyTime);
        return false;
    };
    /**
     * 浏览器失去焦点定时器问题END
     * **/

};

/**
 * 模糊匹配  参数为json结构
 * 1.Name为模糊匹配的dom  数据类型为string,需传元素名称 class 或 id
 * 2.Arr为模糊匹配的匹配数据 数据类型为Arr,需传元素名称为数组
 * 3.bBtn为是否有按钮  数据类型为boolean,需传   true  false
 * 4.fn为回调，回调接受参数为最后input.value   input最后的的value
 * **/

lby.app.matching = function (json) {
    json.bBtn = json.bBtn || false;
    var aMat = document.querySelector(json.Name);

    if(aMat.children.length === 0){
        var oDiv = document.createElement("div");
        var oUl = document.createElement("ul");
        oDiv.className = 'lby_matching_t clearfix';
        if(json.bBtn){
            oDiv.innerHTML ='<input class="lby_matching_input" type="text">\n' +
                '        <a href="javascript:;" class="lby_matching_input_btn">\n' +
                '            <svg style="margin: 5px 0 0 5px;" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2221" width="25" height="25">\n' +
                '                <path d="M946.176 879.488l-206.912-206.912c49.664-63.872 79.232-144.128 79.232-231.296C818.496 232.96 649.6 64 441.216 64 232.896 64 64 232.96 64 441.28c0 208.384 168.896 377.28 377.216 377.28 87.168 0 167.488-29.568 231.36-79.232l206.912 206.848C888.64 955.392 900.736 960 912.832 960c12.096 0 24.128-4.608 33.344-13.888C964.608 927.744 964.608 897.856 946.176 879.488L946.176 879.488zM158.336 441.28c0-156.032 126.848-282.944 282.88-282.944 156.096 0 282.944 126.912 282.944 282.944 0 156.032-126.848 282.944-282.944 282.944C285.184 724.16 158.336 597.312 158.336 441.28L158.336 441.28zM158.336 441.28" p-id="2222" fill="#cdcdcd"></path>\n' +
                '            </svg>\n' +
                '        </a>';
        }else {
            oDiv.innerHTML ='<input class="lby_matching_input" type="text">';
        }
        oUl.className = 'lby_matching_ul';
        oUl.style.display = 'none';
        aMat.innerHTML = '';
        aMat.appendChild(oDiv);
        aMat.appendChild(oUl);
    }else if (aMat.children.length === 1){
        var oUl = document.createElement("ul");
        oUl.className = 'lby_matching_ul';
        oUl.style.display = 'none';
        aMat.appendChild(oUl);
    }

    var aMatTop = aMat.children[0];
    var aMatInput = aMatTop.children[0];
    var aMatBtn = aMatTop.children[1];
    if(!json.bBtn){
        aMatInput.className = 'lby_matching_input false';
    } else {
        lby.tools.addEventHandler(aMatBtn, 'click', fnMatBtn);
    }
    var aMatUl = aMat.children[1];
    lby.tools.addEventHandler(aMatInput, 'input', fnInput);
    lby.tools.addEventHandler(aMatUl, 'click', fnHandle);


    function fnHandle(event) {
        event = event || window.event; 　//IE window.event
        var t = event.target || event.srcElement; //目标对象
        aMatInput.value = t.innerHTML;
    }

    function fnInput(event) {
        event = event || window.event; 　//IE window.event
        var t = event.target || event.srcElement; //目标对象
        aMatUl.innerHTML = '';
        aMatUl.style.display = 'block';
        for(var i = 0;i < json.Arr.length;i++){
            if(aMatInput.value !== "" && json.Arr[i].match(aMatInput.value+".*") !== null){
                var aMatLi = document.createElement("li");
                aMatLi.innerHTML = '<a href="javascript:;">'+ json.Arr[i] +'</a>';
                t.parentNode.parentNode.children[1].appendChild(aMatLi);
            }
        }
    }

    document.onclick = function () {
        oUl.style.display = 'none';
    };

    function fnMatBtn(event){
        event = event || window.event; 　//IE window.event
        var t = event.target || event.srcElement; //目标对象
        json.fn && json.fn(aMatInput.value);
    }
};

/**
 * 功能添加内容end
 * **/

















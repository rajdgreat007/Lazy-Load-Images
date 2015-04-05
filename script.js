var lazyLoad = (function () {
    var imageLinks = [];
    var instagramUrl = "https://api.instagram.com/v1/media/popular?access_token=1808767920.1fb234f.b2a5d0922e264ead8b32463012d585f5";
    var cachedReferences = {
        images : document.getElementsByClassName('images')[0]
    };
    function bindEvent(element, type, handler) {
        if(element.addEventListener) {
            element.addEventListener(type, handler, false);
        } else {
            element.attachEvent('on'+type, handler);
        }
    }

    processImages = function(data){
        for(var x=0;x<data.data.length;x++) imageLinks.push(data.data[x]['images']['standard_resolution']['url']);
        var totalImagesCount = imageLinks.length;
        var li, img;
        for(var i=0;i<totalImagesCount;i++){
            li = document.createElement('li'); li.className='imgLi';
            img = document.createElement('img');
            img.setAttribute('data-original',imageLinks[i]);
            img.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAANSURBVBhXYzh8+PB/AAffA0nNPuCLAAAAAElFTkSuQmCC";
            img.width='640'; img.height='480'; img.className='imgLink';
            li.appendChild(img);
            cachedReferences.images.appendChild(li);
        }
        updateImages();
    };

    function updateImages(){
        var imgLis = document.getElementsByClassName('imgLi');
        for(var i=0;i<imgLis.length;i++){
            if(isElementVisible(imgLis[i])){
                if(imgLis[i].childNodes[0].src.indexOf('data:image')!==-1) imgLis[i].childNodes[0].src = imgLis[i].childNodes[0].getAttribute('data-original');
            }else return;
        }
    }

    function jsonpCall(scriptSrc){
        var script = document.createElement('script');
        script.src = scriptSrc;
        document.getElementsByTagName('head')[0].appendChild(script);
    }

    function getWindowHeight() {
        var height = 0;
        if( typeof( window.innerWidth ) == 'number' ) {
            height = window.innerHeight;
        } else if( document.documentElement && ( document.documentElement.clientWidth || document.documentElement.clientHeight ) ) {
            height = document.documentElement.clientHeight;
        } else if( document.body && ( document.body.clientWidth || document.body.clientHeight ) ) {
            height = document.body.clientHeight;
        }
        return height;
    }

    function isElementVisible(el){
        var rect = el.getBoundingClientRect();
        return rect.top < getWindowHeight();
    }
    return {
        init : function(){
            jsonpCall(instagramUrl+'&callback=processImages');
        },
        bindEvents : function(){
            bindEvent(window, 'scroll', function(e){
                var event = e||window.event;
                updateImages();
            });
        }
    }
})();

window.onload  = function(){
    lazyLoad.init();
    lazyLoad.bindEvents();
};
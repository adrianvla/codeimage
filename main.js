$(document).ready(()=>{
    $(".content > textarea").each(function () {
        this.setAttribute("style", "height:" + (this.scrollHeight) + "px;overflow-y:hidden;");
    });
    $(".content > textarea").on("input", function () {
        refreshCode(this);
    });
    document.querySelectorAll(".content > textarea").forEach(el=>{refreshCode(el)});
    // refreshCode(document.querySelector(".content > textarea"));
    // refreshCode(document.querySelector(".content > textarea"));
    // setTimeout(()=>refreshCode(document.querySelector(".content > textarea")),1);
});
let LANG = "js";

function refreshCode(e){
    e.style.height = 0;
    e.style.height = (e.scrollHeight) + "px";
    $(e).siblings(".code")[0].style.height = (e.scrollHeight) + "px";
    e.value = e.value.replaceAll(" ", " ");
    let c = hljs.highlight(e.value,{
        language: LANG
    });
    c.value = Object.values($(`<div>${c.value}</div>`).contents()).map(el=>{
        if(el.nodeType!=3) return el;
        return $(`<span class="hljs-text">${el.data}</span>`)[0];
    }).map(el=>el.outerHTML);
    $(e).siblings(".code").html(c.value);
}

var currentMousePos = { x: -1, y: -1 };
var ISDRAGGING = false;
var window_area_width = 500;
var currentDelta = 0;
var whichOne = 1;
$(document).mousemove(function(event) {
    currentMousePos.x = event.pageX;
    currentMousePos.y = event.pageY;
    if(ISDRAGGING){
        // console.log({x:currentMousePos.x-mousePosDrag.x,y:currentMousePos.y-mousePosDrag.y});
        currentDelta = (currentMousePos.x-mousePosDrag.x) * whichOne;
        $("body").get(0).style.setProperty("--window-area-width", `${window_area_width+currentDelta}px`);
        document.querySelectorAll(".content > textarea").forEach(el=>{refreshCode(el)});   
    }
});
var mousePosDrag = {x:-1,y:-1};

$(document).ready(()=>{
    $(".resize-c").on("mousedown",e=>{
        mousePosDrag.x = currentMousePos.x;
        mousePosDrag.y = currentMousePos.y;
        // console.log("mouse down");
        ISDRAGGING = true;
    });

    $(".resize-c.l").on("mousedown",e=>{whichOne=-1});
    $(".resize-c.r").on("mousedown",e=>{whichOne=1});

    $(document).on("mouseup",e=>{
        if(ISDRAGGING){
            ISDRAGGING = false;
            window_area_width += currentDelta;
            console.log(window_area_width)
        }
    });
});
function uuidv4() {
    return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
      (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
  }

function animate(w,txt){
    let c = hljs.highlight(txt,{
        language: LANG
    });
    let Q = "";
    txt = Object.values($(`<div>${c.value}</div>`).contents()).map(el=>{
        if(el.nodeType!=3) return el;
        return $(`<span class="hljs-text">${el.data}</span>`)[0];
    }).map(el=>el.outerHTML).join('');
    $(w).find(".code").contents().each(function(){
        this.classList.add("_"+uuidv4());
    });
    let tempinnerw = "";
    $(w).find(".code").contents().each(function(){
        let O = "<span class=\""+this.classList+"\">";
        O+= this.innerHTML.replaceAll("\n","</span>"+"<span>\n</span><span class=\""+this.classList+"\">");
        O+="</span>";
        tempinnerw += O;
    });
    $(w).find(".code").html(tempinnerw);
    $(w).find(".code").contents().each(function(){
        if(this.innerHTML == "\n" || this.innerHTML == "") {this.classList=""}
    });
    let td = $(`<div class="transitioncode">${$(w).find(".code").html()}</div>`);
    $("body").append(td[0]);
    
    
    function getPos(EL){
        // return {x: $(EL).offset().left - $(window).scrollLeft(),y: $(EL).offset().top - $(window).scrollTop()};
        return {x: EL.getBoundingClientRect().left, y: EL.getBoundingClientRect().top};
    
        // return {x: pos.left, y: pos.top};;
    }
    
    let elms = td.contents();
    let elms2 = $(`<div>${txt}</div>`).contents();

    // $(w).find(".code").contents().each(function(){
    //     let P = getPos(this);
    //     let EL = $(this.outerHTML);
    //     // EL.text(EL.text().replaceAll("\n",""));
    //     EL.css("position","absolute");
    //     EL.css("left",`${P.x}px`);
    //     EL.css("top",`${P.y}px`);
    //     td.append(EL);
    // });
    // /*

    
    elms.each(function(){
        try{
            console.log(Array.from(this.classList).filter(p=>(p[0]=="_"))[0]);
            let P = getPos($(w).find(".code ."+Array.from(this.classList).filter(p=>(p[0]=="_"))[0])[0]);
            console.log(P);
            $(this).css("left",`${P.x}`);
            $(this).css("top",`${P.y}`);
            $(this).css("position","absolute");
        }catch(e){
            console.log(e)
        }
    });

    let tl = gsap.timeline();

    console.log(elms);
    console.log(elms2);
    let pairs = [];
    elms.each(function(){
        let el1 = this;
        let el2 = null;
        let nostop = true;
        elms2.each(function(){
            if(nostop)
            if(!$(this).attr("visited")){
                if(this.innerText == el1.innerText){
                    console.log(this,el1);
                    $(this).attr("visited","true");
                    el2 = this;
                    pairs.push([el1,el2]);
                    nostop = false;
                }
            }
        });
    });
    console.log(pairs);
    pairs.forEach(el=>{
        // tl.to(el[0], {x: });
    });

    
    // $(w).find(".code").html(txt);

    // */


    

}
setTimeout(()=>{animate($(".window"),`module.exports = leftpad;

function leftpad(str, len, ch) {
    str = String(

    if (!ch && ch !== 0) ch = ' ';

    return str;
}`)},500);
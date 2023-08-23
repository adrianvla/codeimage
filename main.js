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

async function refreshCode(e){
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
    globalTextHeight = $($(e).siblings(".code").children().get(0)).height();
}

var currentMousePos = { x: -1, y: -1 };
var ISDRAGGING = false;
var window_area_width = 500;
var currentDelta = 0;
var whichOne = 1;
var globalTextHeight = 20;
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

let windowAnimations = {};

function animate(W,txt){
    try{windowAnimations[W].kill();}catch(e){}
    // gsap.to($(W).find('.code')[0],{
    //     opacity:0,
    //     duration:0.5
    // });
    let oldCodeContentHeight = String($(W).find(".code").height());
    function processToElements(w){
        let tempinnerw = "";
        $(w).find(".code").contents().each(function(){
            let O = "<span class=\""+this.classList+"\">";
            O+= this.innerHTML.replaceAll("\n","</span>"+"<span>\n</span><span class=\""+this.classList+"\">");
            O+="</span>";
            tempinnerw += O;
        });
        $(w).find(".code").html(tempinnerw);
        tempinnerw = "";
        $(w).find(".code").contents().each(function(){
            if($(this).height()>(globalTextHeight)){
                let O = "<span class=\""+this.classList+"\">";
                O+= this.innerHTML.split('').join("</span>"+"<span class=\""+this.classList+"\">");
                O+="</span>";
                tempinnerw += O;
            }else{
                tempinnerw += this.outerHTML;
            }
        });
        $(w).find(".code").html(tempinnerw);
        tempinnerw = "";
        $(w).find(".code").contents().each(function(){
            let O = "<span class=\""+this.classList+"\">";
            O+= this.innerHTML.replaceAll(" ","</span>"+"<span> </span><span class=\""+this.classList+"\">");
            O+="</span>";
            tempinnerw += O;
        });
        $(w).find(".code").html(tempinnerw);
    
        $(w).find(".code").contents().each(function(){
            if(this.innerHTML == "\n" || this.innerHTML == "") {this.classList=""}
        });
        $(w).find(".code").contents().each(function(){
            this.classList.add("_"+uuidv4());
        });
    }
    // let c = hljs.highlight(txt,{
    //     language: LANG
    // });
    let Q = "";
    // txt = Object.values($(`<div>${c.value}</div>`).contents()).map(el=>{
    //     if(el.nodeType!=3) return el;
    //     return $(`<span class="hljs-text">${el.data}</span>`)[0];
    // }).map(el=>el.outerHTML).join('');
    processToElements(W);
    
    let td = $(`<div class="transitioncode">${$(W).find(".code").html()}</div>`);
    $("body").append(td[0]);

    
    td.contents().each(function(){
        if(this.innerHTML == "\n" || this.innerHTML == "" || this.innerHTML == " " || this.innerHTML == " ") this.remove();
    });
    
    function getPos(EL){
        // return {x: $(EL).offset().left - $(window).scrollLeft(),y: $(EL).offset().top - $(window).scrollTop()};
        return {x: EL.getBoundingClientRect().left, y: EL.getBoundingClientRect().top};
    
        // return {x: pos.left, y: pos.top};;
    }
    
    let elms = td.contents();
    elms.each(function(){
        try{
            let E = $(W).find(".code ."+Array.from(this.classList).filter(p=>(p[0]=="_"))[0])[0];
            let P = getPos(E);
            // console.log("Positions: ",this,E,P,Array.from(this.classList).filter(p=>(p[0]=="_"))[0]);
            $(this).css("left",`${P.x}px`);
            $(this).css("top",`${P.y}px`);
        }catch(e){
            // console.log(e)
        }
    });
    console.log(elms)
    $(W).find("textarea")[0].value = txt;
    refreshCode($(W).find("textarea")[0]);
    processToElements(W);
    let newCodeContentHeight = String($(W).find(".code").height());
    let elms2 = $(W).find(".code").contents();
    console.log($(W).find(".code"),elms2);


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

    
    let duration = 1.5;
    let EASE = "power4.inOut";

    let tl = gsap.timeline();
    tl.to($(W).find(".code"),{
        opacity:0,
        duration:0
    });
    let pairs = [];
    elms.each(function(){
        let el1 = this;
        let el2 = null;
        let nostop = true;
        elms2.each(function(){
            if(nostop)
            if(!$(this).attr("visited")){
                if(this.innerText == el1.innerText){
                    // console.log(this,el1);
                    $(this).attr("visited","true");
                    el2 = this;
                    pairs.push([el1,el2]);
                    nostop = false; 
                }
            }
        });
        if(nostop)
            tl.to(this,{
                opacity:0,
                duration:1
            },"<");
    });
    tl.pause();
    setTimeout(()=>{td[0].remove()},(duration*1000)+500);


    pairs.forEach(el=>{
        tl.to(el[0], {
            left: el[1].getBoundingClientRect().x,
            top: el[1].getBoundingClientRect().y,
            duration:duration,
            ease : EASE
            }, "<");
        gsap.set(el[1],{opacity:0});
    });
    $(W).find(".code").css("height",`${oldCodeContentHeight}px`);
    tl.to($(W).find(".code"),{
        height: newCodeContentHeight,
        duration:duration,
        ease: EASE
    },"<");
    tl.to($(W).find(".code"),{
        opacity:1,
        duration:duration
    },"<");
    tl.to(td[0],{
        opacity:0,
        duration:0.5
    },"<90%");
    pairs.forEach(el=>{
        // tl.fromTo(el[1],{opacity:0}, {
        //     opacity:1,
        //     duration:0.2
        // },"<");
        tl.fromTo(el[1],{opacity:0}, {
            opacity:1,
            duration:0.2,
            ease: "power2.out"
        },"<");
    });

    windowAnimations[W] = tl;
    tl.play();
    

    

    // $(w).find(".code").html(txt);

    // */


    

}
setTimeout(()=>{animate($(".window")[0],`module.exports = leftpad;

function leftpad(str, len, ch) {
    str = String(

    if (!ch && ch !== 0) ch = ' ';

    return str;
}`)},500);

setTimeout(()=>{animate($(".window")[0],`module.exports = leftpad;

function leftpad(str, len, ch) {
    str = String(str);
    var i = -1;

    if (!ch && ch !== 0) ch = ' ';

    len = len - str.length;

    while (i++ < len) {
        str = ch + str;
    }
    return str;
}
}`)},3000);


setTimeout(()=>{animate($(".window")[0],`// Define an array to store tasks
const tasks = [];

// Function to add a task
function addTask(task) {
  tasks.push(task);
  console.log(\`Task "{task}" has been added.\`);
}

// Function to remove a task
function removeTask(task) {
  const index = tasks.indexOf(task);
  if (index !== -1) {
    tasks.splice(index, 1);
    console.log(\`Task "{task}" has been removed.\`);
  } else {
    console.log(\`Task "{task}" not found.\`);
  }
}`)},5500);
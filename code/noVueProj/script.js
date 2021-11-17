const ele_Main = document.getElementById('main');
const ele_Home = document.getElementById('home');
const ele_images = document.getElementsByClassName('zImage');


const data = {
    "1": {
        text : "",
        coord : {x:0,y:0,z:0},
        nav : {lon:0,lat:0},
        images : ["https://www.pngall.com/wp-content/uploads/2016/03/Tree-Download-Free-PNG.png"],},
}



let scrollIndex = 1;
let scrollVal = 1;
let mousePosX = 0;
let mousePosY = 0;
let mouseXMap,mouseYMap = 0;


ele_Main.onwheel = scrollToWin;

ele_Main.addEventListener('mousemove', function() {
    mousePosX = event.screenX;
    if (mousePosX > 1920) mousePosX -= 1920;
    mousePosY = event.screenY;
    mouseXMap = mapRange(mousePosX,0,1920,20,-20);
    mouseYMap = mapRange(mousePosY,0,1080,0,4);
    //console.log("- --> document.addEventListener --> mouseMap", mouseXMap, " / ", mouseYMap);
    ele_Home.style.transform = `rotate3d(1,0,0, ${90+mouseYMap}deg) skewX(${mouseXMap}deg)`;
    
    update();
})

displayContent();






function displayContent() {
    let currentData = data[scrollIndex];
    Array.from(ele_images).forEach(ele => {
        ele.src = currentData.images[0];
        ele.style.left = Math.random()*1500+"px";
        ele.style.top = Math.random()*150+"px";
    });
}






/**
 * Count scroll up
 * @param {event} event 
 */
function scrollToWin(event) {
    event.preventDefault();

    scrollVal += event.deltaY * -0.1;
    console.log("- --> scrollToWin --> scrollVal", scrollVal);

    update();
}



function update() {
    Array.from(ele_images).forEach(ele => {
        ele.style.transform = `translateX(${mouseXMap}px) translateY(${mouseYMap}px) translateZ(${scrollVal}px)`;
    })
}




// Map n to range of start1, stop1 to start2, stop2
function mapRange(n, start1, stop1, start2, stop2) {const newval = (n - start1) / (stop1 - start1) * (stop2 - start2) + start2;if (newval) {return newval;}if (start2 < stop2) {return limit(newval, start2, stop2);} else {return limit(newval, stop2, start2);}}

// Keep n between low and high
function limit(n, low, high) {return Math.max(Math.min(n, high), low);}

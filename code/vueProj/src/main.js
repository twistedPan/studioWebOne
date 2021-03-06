import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
/* import MagicScroll from "/node_modules/magic-scroll.js/src/MagicScroll.js";

let magicScroll = new MagicScroll({
    target: document.querySelector("#scenes"),
    speed: 10,
    smooth: 10,
    current: 0 // position
});
 */
/* let yellowChild = document.createElement('div');
yellowChild.classList.add('yellow');
document.body.appendChild(yellowChild) */

// Scroll index Varaible
Window.ScrollValue = 0;
Window.ClickIndex = 0;
Window.ScrollIndex = 0;
Window.Content = [];
Window.Images = [];


createApp(App).use(router).mount('#app')

// size of scroll steps 
Window.ScrollSpeed = 4;
// scroll step in each scene // one scene * scene count
Window.ScrollChange = 250 * 8;
Window.SceneScroll = 250;
// Funtions

// Global Functions
Window.Util = {
    // Map n to range of start1, stop1 to start2, stop2
    mapRange(n, start1, stop1, start2, stop2) {
        const newval = ((n - start1) / (stop1 - start1)) * (stop2 - start2) + start2;
        if (newval) {
            return newval;
        }
        if (start2 < stop2) {
            return limit(newval, start2, stop2);
        } else {
            return limit(newval, stop2, start2);
        }
    },
};


// Keep n between low and high
function limit(n, low, high) {
    return Math.max(Math.min(n, high), low);
}




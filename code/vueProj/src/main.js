import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// Scroll index Varaible
Window.ScrollValue = 0;

Window.Content = [];

createApp(App).use(router).mount('#app')


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
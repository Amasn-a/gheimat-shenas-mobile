// Play starts immediately. Self-hosted font loading must never block the game indefinitely.
import { init, boot } from './game.js?v=e3889d140bf3';
import { gate, nextBoot } from './launch.js?v=e3889d140bf3';
document.documentElement.setAttribute('data-theme','light');
document.documentElement.classList.add('fonts-ready');
const app = document.getElementById('app');
const firstBoot = nextBoot(app);   // listen before init() starts the real boot
init(app);
gate(app, firstBoot, boot);
if (document.fonts) document.fonts.load('700 16px Digikala').catch(()=>{});

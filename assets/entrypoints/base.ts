import '../bootstrap';
import "../styles/base.sass";
import {initFlowbite} from 'flowbite';

document.addEventListener('turbo:render', () => {
    initFlowbite();
});
document.addEventListener('turbo:frame-render', () => {
    initFlowbite();
});

document.addEventListener('turbo:load', () => {
    initFlowbite();
})
import '../bootstrap';
import "../styles/base.css";
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
import '../bootstrap';
import "../styles/base.sass";
import {initFlowbite} from 'flowbite';
import CustomElementsDefiner from '@/scripts/elements';

document.addEventListener('turbo:render', () => {
    initFlowbite();
});
document.addEventListener('turbo:frame-render', () => {
    initFlowbite();
});

document.addEventListener('turbo:load', () => {
    initFlowbite();
})

await CustomElementsDefiner.instantiate().registerElements();
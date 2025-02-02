import { Controller } from '@hotwired/stimulus';

/*
* The following line makes this controller "lazy": it won't be downloaded until needed
* See https://github.com/symfony/stimulus-bridge#lazy-controllers
*/
/* stimulusFetch: 'lazy' */
export default class extends Controller<HTMLDivElement> {

    static values = {
        separator: {
            type: String,
            default: '→'
        }
    }
    static targets = ['linksContainer'];
    declare separatorValue: string;
    declare linksContainerTarget: HTMLElement;

    connect() {
        super.connect();
        this.changeContent();
    }

    changeContent() {
        const links = (new URL(document.location.href)).pathname.substring(1).split('/').filter(s => s !== '');

        const transformText = (val: string): string => {
            return String(val)
                .split('-')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');
        }

        if (links.length === 0) {
            this.createLink('Home', '/');
        }

        for (let i = 0; i < links.length; i++) {
            const template = this.createLink(
                transformText(links[i]),
                '/' + links.slice(0, i + 1).join('/'),
                i !== links.length - 1
            );

            if (i !== 0)
                template.insertAdjacentText('beforebegin', ` ${this.separatorValue} `);
        }
    }

    createLink(text: string, href: string, underline: boolean = false): HTMLAnchorElement {
        const link = document.createElement('a');

        link.classList.add('cursor-pointer', 'text-3xl', 'md:text-4xl', 'lg:text-5xl');
        if (underline)
            link.classList.add('hover:underline', 'underline-offset-4');

        link.href = href;
        link.textContent = text;
        this.linksContainerTarget.appendChild(link);

        return link;
    }
}

import { Controller } from '@hotwired/stimulus';

/*
* The following line makes this controller "lazy": it won't be downloaded until needed
* See https://github.com/symfony/stimulus-bridge#lazy-controllers
*/
/* stimulusFetch: 'lazy' */
export default class extends Controller {
    static targets = ['username', 'password']
    declare usernameTarget: HTMLInputElement
    declare passwordTargets: HTMLInputElement[]

    connect() {
        super.connect();
        this.generateUsername();
    }

    generatePassword() {
        fetch("https://www.psswrd.net/api/v1/password/")
            .then(response => response.json())
            .then(data => {
                this.passwordTargets.forEach((passwordTarget) => {
                    passwordTarget.value = data.password;
                    passwordTarget.dispatchEvent(new Event('change', { bubbles: true }));
                });
            })
            .catch(error => console.error(error));
    }

    generateUsername() {
        fetch('https://usernameapiv1.vercel.app/api/random-usernames')
            .then(response => response.json())
            .then(data => {
                this.usernameTarget.value = data.usernames[0];
                this.usernameTarget.dispatchEvent(new Event('change', { bubbles: true }));
            })
            .catch(error => console.error(error));
    }
}

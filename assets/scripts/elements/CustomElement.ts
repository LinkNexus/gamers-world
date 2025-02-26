import { toDashCase } from "../utils";

export default abstract class CustomElement extends HTMLElement {
    protected static observedAttributes: string[] = ["id"];
    protected customProperties(): Record<string, Function|Record<string, any>> {
        return {};
    }
    protected customTargets(): string[] {
        return [];
    }
    protected customActions(): string[] {
        return [];
    }

    private readonly properties: Record<string, Function|Record<string, any>>;

    public mutationObserver: MutationObserver;

    protected constructor() {
        super();
        this.properties = this.customProperties();
        this.initializeProps();
        this.initializeTargets();
        this.registerActions();
        this.mutationObserver = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    if ((this as any)['childListChanged']) {
                        (this as any)['childListChanged']();
                    }
                }
            });
        });
        this.watchMutations();
    }

    private initializeProps() {
        for (const [key, value] of Object.entries(this.properties)) {
            if (key in this) continue;

            if (typeof value === 'object') {
                // if (typeof value.type() === 'boolean') {
                //      this.toggleAttribute(toDashCase(key), value.default);
                // } else {
                //     this.setAttribute(toDashCase(key), JSON.stringify(value.default()));
                // }
                this.addProp(key, value.type(), toDashCase(key));
            } else {
                this.addProp(key, value(), toDashCase(key));
            }
        }
    }

    attributeChangedCallback(name: string, oldValue: any, newValue: any) {
        if (name === "id") {
            this.registerActions();
        }

        for (const key of Object.keys(this.properties)) {
            const normalizedKey = toDashCase(key);

            const watcher = (this as any)[`${key}ValueChanged`];
            if ((normalizedKey === name) && watcher) {
                if (typeof (this as any)[key] === 'boolean') {
                    newValue = this.hasAttribute(normalizedKey)
                } else if (typeof (this as any)[key] === 'object') {
                    const value = this.getAttribute(normalizedKey);
                    if (value?.startsWith('{')) {
                        newValue = JSON.parse(value);
                    } else {
                        newValue = value?.split(' ');
                    }
                }

                // if (typeof (this as any)[key] === 'object') {
                //     newValue = JSON.parse(newValue);
                // }
                watcher.bind(this)(newValue, oldValue);
            }
        }
    }

    private addProp(name: string, value: any, normalizedKey: string) {
        Object.defineProperty(this, name, {
            configurable: true,
            set: function (val) {
                if (typeof val === 'boolean') {
                    this.toggleAttribute(normalizedKey, val);
                } else {
                    this.setAttribute(normalizedKey, val);
                }
            },
            get: function () {
                switch (typeof value) {
                    case 'boolean':
                        return this.hasAttribute(normalizedKey);
                    case 'object':
                        if (null === this.getAttribute(normalizedKey)) {
                            return value;
                        }

                        if (this.getAttribute(normalizedKey).startsWith('{')) {
                            return JSON.parse(this.getAttribute(normalizedKey) || '{}');
                        } else {
                            return this.getAttribute(normalizedKey).split(' ');
                        }
                    default:
                        return this.getAttribute(normalizedKey);
                }
            }
        })
    }

    private addTarget(targetName: string) {
        const normalizedTarget = toDashCase(targetName);
        Object.defineProperties(this, {
            [`$${targetName}Target`]: {
                configurable: true,
                get: function () {
                    return this[`$${targetName}Targets`][0] || null;
                }
            },
            [`${targetName}TargetsCount`]: {
                configurable: true,
                get: function () {
                    return this[`$${targetName}Targets`].length;
                }
            },
            [`$${targetName}Targets`]: {
                configurable: true,
                get: function () {
                    const $targets = Array.from(document.querySelectorAll(`[data-targeted-as*="${this.id}:${normalizedTarget}"]`));

                    this.querySelectorAll(`[data-targeted-as*="${this.tagName.toLowerCase()}:${normalizedTarget}"]`).forEach(($target: Element) => {
                        if ($target.closest(this.tagName.toLowerCase()) === this) {
                            $targets.push($target);
                        }
                    })

                    return $targets;
                }
            },
            [`has${targetName}Target`]: {
                configurable: true,
                get: function () {
                    return this[`$${targetName}TargetsCount`] > 0;
                }
            }
        })
    }

    private initializeTargets() {
        const targets = this.customTargets();
        targets.forEach(target => {
            this.addTarget(target);
        })
    }

    private registerActions() {
        const actions = this.customActions();
        actions.forEach(action => {
            if (!this.id) return;
            document.addEventListener(`${this.id}.${action}`, (this as any)[action].bind(this));
        })
    }
    
    private watchMutations() {
        this.mutationObserver.observe(this, {
            childList: true,
            subtree: true,
            characterData: true
        });
    }

    disconnectedCallback() {
        const actions = this.customActions();
        actions.forEach(action => {
            document.removeEventListener(`${this.id}.${action}`, (this as any)[action].bind(this));
        })
        this.mutationObserver.disconnect();
    }
}
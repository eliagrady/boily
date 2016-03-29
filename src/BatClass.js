/* eslint-disable no-trailing-spaces */

import BazClass from './BazClass';

export default class BatClass {

    constructor() {
        this.myWord = 'there!';
        this.myBaz = new BazClass();
    }

    static hello() {
        return `hello ${this.world()}`;
    }

    static world() {
        return 'world!';
    }

    baz(word) {
        return `${word} ${this.qux(word)}`;
    }

    qux(word) {
        return word ? this.myWord : 'nope!';
    }
}

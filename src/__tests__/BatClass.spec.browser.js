/* global sinon expect */
/* eslint padded-blocks: 0 */
/* eslint no-unused-expressions: 0 */
/* eslint max-nested-callbacks: 0 */
/* eslint-disable no-trailing-spaces */
import BatClass from '../BatClass';

describe('BatClass - server and browser tests', () => {

    describe('BatClass', () => {

        describe('static hello function', () => {

            it('should say "hello world!"', () => {
                expect(BatClass.hello()).to.eql('hello world!');
            });

            it('should be able to use Sinon to mock out the world function', () => {
                const mock = sinon.mock(BatClass);
                mock.expects('world').once().returns('there!');
                expect(BatClass.hello()).to.eql('hello there!');
                mock.verify();
            });
        });

        describe('baz', () => {

            it('should return a phrase with the word', () => {
                const bat = new BatClass();
                expect(bat.baz('Hi')).to.eql('Hi there!');
            });

            it('should be able to use Sinon to spy on the qux function', () => {
                const bat = new BatClass();
                const spy = sinon.spy(bat, 'qux');
                expect(bat.baz('')).to.eql(' nope!');
                expect(spy.calledWith(''));
            });
        });

        describe('the myBaz BazClass instance', () => {

            it("should have access to the normal BazClass", () => {
                const bat = new BatClass();
                expect(bat.myBaz.desc).to.eql('complicated');
            });

            /*it('should be able to replace BazClass via Rewire', () => {
                BatClass.__Rewire__('BazClass', class {
                    constructor() {
                        this.desc = 'simple';
                    }
                });
                const bat = new BatClass();
                expect(bat.myBaz.desc).to.eql('simple');
            });*/
        });
    });
});

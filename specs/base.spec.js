var expect = require('chai').expect;

var zoo = require('../examples/inheritance');
var Animal = zoo.Animal;
var TwoLegged = zoo.TwoLegged;
var FourLegged = zoo.FourLegged;
var FurryDog = zoo.FurryDog;

describe("base class", function() {
    it("inherits properties", function() {
        var a = new Animal();

        expect(a.classname).to.equal("Animal");
        expect(a.classname).equal("Animal");
    });

    it("calls the constructor", function() {
        var a = new Animal();
        expect(a.ident()).equal("I am an Animal");
    });

    it("supports polymorphism", function() {
        var twolegs = new TwoLegged();
        var fourlegs = new FourLegged();

        expect(twolegs.legs()).equal("I have 2 legs");
        expect(fourlegs.legs()).equal("I have 4 legs");
    });

    it("enables mixins", function() {
        var dog = new FurryDog("brown");
        expect(dog.legs()).equal("I have 4 legs");
        expect(dog.fur()).equal("I have brown fur");
    });

    it("initializers are called in order of inheritance", function() {
        var dog = new FurryDog("brown");
        expect(dog.chain).equal("Animal->FourLegged->Furry->FurryDog");
    });

    it('handles instanceof', function() {
        var a = new Animal();
        var twolegs = new TwoLegged();
        var fourlegs = new FourLegged();
        var dog = new FurryDog('brown');

        expect(a instanceof Animal).equal(true);

        expect(twolegs instanceof Animal).equal(true);
        expect(twolegs instanceof TwoLegged).equal(true);

        expect(fourlegs instanceof Animal).equal(true);
        expect(fourlegs instanceof FourLegged).equal(true);

        expect(dog instanceof Animal).equal(true);
        expect(dog instanceof FourLegged).equal(true);
        expect(dog instanceof FurryDog).equal(true);
    });
});

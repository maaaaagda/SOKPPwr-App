/*

//working good
'use strict';
require('chai').should();

const {Builder, By, Key, until} = require('selenium-webdriver');
var driver = new Builder()
    .forBrowser('chrome')
    .build();

describe('Chrome title', function() {
  it('Title should be correct', function(done) {
    driver.get('http://www.google.com/ncr')
    .then(() => driver.findElement(By.name('q')).sendKeys('webdriver', Key.RETURN))
    .then(_ => driver.wait(until.titleIs('webdriver - Google Search'), 1000))
    .then (() => driver.getTitle())
    .then(title =>  title.should.equal('Google'))
    .then(() => driver.quit())
    .then(() => done())
    .catch(error => done(error))
    ;
  });
});

*/

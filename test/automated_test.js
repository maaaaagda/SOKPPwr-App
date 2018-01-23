'use strict';
require('chai').should();
var assert = require('assert');
var request = require('supertest');

const {Builder, By, Key, until} = require('selenium-webdriver');
var driver = new Builder()
    .forBrowser('chrome')
    .build();

describe('Join Application', function() {
  it('It should add student to application', function(done) {
    driver.get('http://localhost:3000')
    .then(() => driver.findElement(By.id('joinApplicationButton')).click())
    .then(() => driver.findElement(By.id('inputSearch')).sendKeys('bazy', Key.RETURN))
    .then(() => driver.findElement(By.id('button5')).click())
    .then(() => driver.findElement(By.id('goToHomePageFromJoin')).click())
    .then(() => driver.quit())
    .then(() => done())
    .catch(error => done(error))
    ;
  });
});

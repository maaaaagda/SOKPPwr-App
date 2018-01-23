var assert = require('assert');
var request = require('supertest')
  ,app = require('../app.js');

//integration tests - working good

describe('Homepage', function (){
  it('Welcome the user', function (done) {
    request(app).get('/')
      .expect(200, done)
  })
})

describe('Page doesnt exist', function (){
  it('Expecting status 404', function (done) {
    request(app).get('/dntexist')
      .expect(404, done)
  })
})

describe('Post second page of form Create Application', function (){
  it('Expecting status 404', function (done) {
    request(app).post('/create_app_1')
      .expect(200, done)
  })
})

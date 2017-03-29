'use strict';

var _ = require('lodash');  /* jshint ignore:line */
var Holodeck = require('../../../../holodeck');  /* jshint ignore:line */
var Request = require(
    '../../../../../../lib/http/request');  /* jshint ignore:line */
var Response = require(
    '../../../../../../lib/http/response');  /* jshint ignore:line */
var RestException = require(
    '../../../../../../lib/base/RestException');  /* jshint ignore:line */
var Twilio = require('../../../../../../lib');  /* jshint ignore:line */


var client;
var holodeck;

describe('Token', function() {
  beforeEach(function() {
    holodeck = new Holodeck();
    client = new Twilio('ACaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', 'AUTHTOKEN', {
      httpClient: holodeck
    });
  });
  it('should generate valid create request',
    function() {
      holodeck.mock(new Response(500, '{}'));

      var promise = client.api.v2010.accounts('ACaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')
                                    .tokens.create();
      promise = promise.then(function() {
        throw new Error('failed');
      }, function(error) {
        expect(error.constructor).toBe(RestException.prototype.constructor);
      });
      promise.done();

      var solution = {
        accountSid: 'ACaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
      };
      var url = _.template('https://api.twilio.com/2010-04-01/Accounts/<%= accountSid %>/Tokens.json')(solution);

      holodeck.assertHasRequest(new Request({
        method: 'POST',
        url: url
      }));
    }
  );
  it('should generate valid create response',
    function() {
      var body = JSON.stringify({
          'account_sid': 'ACaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
          'date_created': 'Fri, 24 Jul 2015 18:43:58 +0000',
          'date_updated': 'Fri, 24 Jul 2015 18:43:58 +0000',
          'ice_servers': [
              {
                  'url': 'stun:global.stun:3478?transport=udp'
              },
              {
                  'credential': '5SR2x8mZK1lTFJW3NVgLGw6UM9C0dja4jI/Hdw3xr+w=',
                  'url': 'turn:global.turn:3478?transport=udp',
                  'username': 'cda92e5006c7810494639fc466ecc80182cef8183fdf400f84c4126f3b59d0bb'
              }
          ],
          'password': '5SR2x8mZK1lTFJW3NVgLGw6UM9C0dja4jI/Hdw3xr+w=',
          'ttl': '86400',
          'username': 'cda92e5006c7810494639fc466ecc80182cef8183fdf400f84c4126f3b59d0bb'
      });

      holodeck.mock(new Response(201, body));

      var promise = client.api.v2010.accounts('ACaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')
                                    .tokens.create();
      promise = promise.then(function(response) {
        expect(response).toBeDefined();
      }, function() {
        throw new Error('failed');
      });

      promise.done();
    }
  );
});


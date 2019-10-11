const agent = require('superagent');
const { expect } = require('chai').use(require('chai-json-schema'));
const { listPublicEventsSchema } = require('./schema/ListPublicEvents.schema');


const urlBase = 'https://api.github.com';

describe('Given an event Github API resources', () => {
  describe('When wanna verify the List public events', () => {
    let response;

    before(async () => {
      response = await agent
        .get(`${urlBase}/events`)
        .set('User-Agent', 'agent')
        .auth('token', process.env.ACCESS_TOKEN);
    });

    it('then the body should have a schema', () => {
      expect(response).to.be.jsonSchema(listPublicEventsSchema);
    });
  });
});

const agent = require('superagent');
const statusCode = require('http-status-codes');
const { expect } = require('chai');

const baseUrl = 'https://github.com';
const userName = 'aperdomob';

describe('Github HEAD and redirect test', () => {
  describe('When I get an old link', () => {
    let redirectTestResponse;

    before(async () => {
      try {
        await agent.head(`${baseUrl}/${userName}/redirect-test`)
          .auth('token', process.env.ACCESS_TOKEN)
          .set('User-Agent', 'agent');
      } catch (response) {
        redirectTestResponse = response;
      }
    });

    it('Then I should be redirected and get the redirect information', () => {
      expect(redirectTestResponse.status).to.equal(statusCode.MOVED_PERMANENTLY);
      expect(redirectTestResponse.response.headers.location).to.equal(`${baseUrl}/${userName}/new-redirect-test`);
    });

    describe('When I consume the link with redirect', () => {
      let newRedirectResponse;

      before(async () => {
        newRedirectResponse = await agent.get(`${baseUrl}/${userName}/redirect-test`);
      });

      it('Then the url should be redirected', () => expect(newRedirectResponse.status).to.equal(statusCode.OK));
    });
  });
});

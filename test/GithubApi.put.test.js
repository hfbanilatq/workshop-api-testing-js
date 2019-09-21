const agent = require('superagent');
const statusCode = require('http-status-codes');
const { expect, assert } = require('chai');

describe('Github api tes put request', () => {
  const baseUrl = 'https://api.github.com';
  const userName = 'salorrego';

  describe(`When I wanna follow to ${userName}`, async () => {
    let followResponse;
    before(async () => {
      followResponse = await agent.put(`${baseUrl}/user/following/${userName}`)
        .set('User-Agent', 'agent')
        .auth('toen', process.env.ACCESS_TOKEN);
    });
    it(`Then I should follow to ${userName}`, () => {
      expect(followResponse.status).to.equal(statusCode.NO_CONTENT);
      expect(followResponse.body).to.eql({});
    });

    describe('When I wanna know who I follow', () => {
      let user;
      before(async () => {
        const userResponse = await agent.get(`${baseUrl}/user/following`)
          .set('User-Agent', 'agent')
          .auth('token', process.env.ACCESS_TOKEN);
        user = userResponse.body.find((usersList) => usersList.login === userName);
      });

      it(`Then I should be follow to ${userName}`, () => assert.exists(user));
    });

    describe(`When I wanna follow to ${userName} again`, () => {
      let followAgainResponse;
      before(async () => {
        followAgainResponse = await agent.put(`${baseUrl}/user/following/${userName}`)
          .set('User-Agent', 'agent')
          .auth('token', process.env.ACCESS_TOKEN);
      });
      it('Then the put method should be idempotent', () => {
        expect(followAgainResponse.status).to.equal(statusCode.NO_CONTENT);
        expect(followAgainResponse.body).to.eql({});
      });
    });
  });
});

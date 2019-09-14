const agent = require('superagent');
const { expect } = require('chai');
const statusCode = require('http-status-codes');

describe('Github Api test', () => {
  const urlBase = 'https://api.github.com';
  const githubUserName = 'hfbanilatq';
  const repository = 'workshop-api-testing-js';

  describe('Authentication', () => {
    it('Via OAuth2 Tokens by Header', async () => {
      const response = await agent.get(`${urlBase}/repos/${githubUserName}/${repository}`)
        .auth('token', process.env.ACCESS_TOKEN)
        .set('User-Agent', 'agent');

      expect(response.status).to.equal(statusCode.OK);
      expect(response.body.description).to.equal('Este es un workshop para realizar un api testing en javascript');
    });

    it('Via OAuth Tokens by parameter', async () => {
      const response = await agent.get(`${urlBase}/repos/${githubUserName}/${repository}`)
        .query(`access_token=${process.env.ACCESS_TOKEN}`);

      expect(response.status).to.equal(statusCode.OK);
      expect(response.body.description).to.equal('Este es un workshop para realizar un api testing en javascript');
    });
  });
});

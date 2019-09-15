const agent = require('superagent');
const { expect } = require('chai');
const statusCode = require('http-status-codes');

const urlBase = 'https://api.github.com';
const githubUserName = 'hfbanilatq';
const repository = 'workshop-api-testing-js';

describe('Github Api test', () => {
  describe('Authentication', () => {
    it('Via OAuth2 Tokens by Header', async () => {
      const response = await agent.get(`${urlBase}/repos/${githubUserName}/${repository}`)
        .auth('token', process.env.ACCESS_TOKEN)
        .set('User-Agent', 'agent');

      expect(response.status).to.equal(statusCode.OK);
      expect(response.body.description).to.equal('Este es un workshop para realizar un api testing en javascript');
    });

    it('Via OAuth2 Tokens by parameter', async () => {
      const response = await agent.get(`${urlBase}/repos/${githubUserName}/${repository}`)
        .set('User-Agent', 'agent')
        .query(`access_token=${process.env.ACCESS_TOKEN}`);

      expect(response.status).to.equal(statusCode.OK);
      expect(response.body.description).equal('Este es un workshop para realizar un api testing en javascript');
    });
  });
});

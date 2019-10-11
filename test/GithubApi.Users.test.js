const agent = require('superagent');
const responseTime = require('superagent-response-time');
const { expect } = require('chai');

const baseUrl = 'https://api.github.com';

describe('When I get all users from github api', () => {
  let usersResponse;
  let usersResponseTime;

  before(async () => {
    usersResponse = await agent.get(`${baseUrl}/users`)
      .set('User-Agent', 'agent')
      .auth('token', process.env.ACCESS_TOKEN)
      .use(responseTime((resquest, time) => {
        usersResponseTime = time;
      }));
  });

  it('Then the response time should be smaller than 5 seconds', () => expect(usersResponseTime).to.be.below(5000));
  it('and it should contain thirty users by default pagination', () => expect(usersResponse.body.length).to.equal(30));

  describe('When I filter the number of users to 10', () => {
    let tenUsers;

    before(async () => {
      const filterTenUsersResponse = await agent.get(`${baseUrl}/users`)
        .set('User-Agent', 'agent')
        .auth('token', process.env.ACCESS_TOKEN)
        .query({ per_page: 10 });
      tenUsers = filterTenUsersResponse.body;
    });

    it('Then the number of user filtered should be iqual to 10', () => expect(tenUsers.length).to.equal(10));

    describe('When I filer the number of users to 50', () => {
      let fiftyUsers;

      before(async () => {
        const filerFiftyUsersResponse = await agent.get(`${baseUrl}/users`)
          .set('User-Agent', 'agent')
          .auth('token', process.env.ACCESS_TOKEN)
          .query({ per_page: 50 });

        fiftyUsers = filerFiftyUsersResponse.body;
      });

      it('Then the number of users filtered should be to equal to 50', () => expect(fiftyUsers.length).to.equal(50));
    });
  });
});

const agent = require('superagent');
const { expect, assert } = require('chai');

const baseUrl = 'https://api.github.com';

describe('Given an authenticate user', () => {
  let user;
  before(async () => {
    const userLoginResponse = await agent.get(`${baseUrl}/user`)
      .set('User-Agent', 'agent')
      .auth('token', process.env.ACCESS_TOKEN);
    user = userLoginResponse.body;
  });

  it('Then should have any public repository', () => {
    expect(user.public_repos).not.to.equal(0);
  });

  describe('When I get the user repositories', () => {
    let repositories;
    let lastRepositoy;

    before(async () => {
      const repositoriesResponse = await agent.get(user.repos_url)
        .set('User-Agent', 'agent')
        .auth('token', process.env.ACCESS_TOKEN);

      repositories = repositoriesResponse.body;
      lastRepositoy = repositories.pop();
    });

    it('Then I should have one repository', () => {
      assert.exists(lastRepositoy);

      expect(lastRepositoy).not.to.equal(undefined);
    });

    describe('When I wanna create an issue in the repository', () => {
      const newIssue = { title: 'this is a test to create a issue' };

      let issue;
      before(async () => {
        const issuePostResponse = await agent.post(`${baseUrl}/repos/${user.login}/${lastRepositoy.name}/issues`, newIssue)
          .set('User-Agent', 'agent')
          .auth('token', process.env.ACCESS_TOKEN);
        issue = issuePostResponse.body;
      });

      it('Then it should have the tittle', () => {
        expect(issue.body).to.equal(null);
        expect(issue.title).to.equal(newIssue.title);
      });

      describe('When I wanna modified an issue', () => {
        const updateIssue = { body: 'issue body' };
        let modifiedIssue;

        before(async () => {
          const issuePatchResponse = await agent.patch(`${baseUrl}/repos/${user.login}/${lastRepositoy.name}/issues/${issue.number}`, updateIssue)
            .set('User-Agent', 'agent')
            .auth('token', process.env.ACCESS_TOKEN);
          modifiedIssue = issuePatchResponse.body;
        });

        it('Then the issue should be updated', () => {
          expect(modifiedIssue.title).to.equal(newIssue.title);
          expect(modifiedIssue.body).to.equal(updateIssue.body);
        });
      });
    });
  });
});

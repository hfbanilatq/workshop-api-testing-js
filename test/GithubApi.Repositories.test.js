const agent = require('superagent');
const { expect, assert } = require('chai').use(require('chai-subset'));
const md5 = require('md5');

const urlBase = 'https://api.github.com';

describe('Github api test repositories', () => {
  const userName = 'aperdomob';

  describe(`When I get the ${userName} user information`, () => {
    let user;

    before(async () => {
      const userResponse = await agent.get(`${urlBase}/users/${userName}`)
        .set('User-Agent', 'agent')
        .auth('token', process.env.ACCESS_TOKEN);
      user = userResponse.body;
    });

    it('Then I should get the expected information', () => {
      expect(user.name).to.equal('Alejandro Perdomo');
      expect(user.company).to.equal('PSL');
      expect(user.location).to.equal('Colombia');
    });

    describe(`When I get ${userName}'s repository`, () => {
      let repositories;
      let repository;
      const repositoryNeeded = 'jasmine-awesome-report';

      before(async () => {
        const repositoriesResponse = await agent.get(user.repos_url)
          .set('User-Agent', 'agent')
          .auth('token', process.env.ACCESS_TOKEN);

        repositories = repositoriesResponse.body;
        repository = repositories.find((repo) => repo.name === repositoryNeeded);
      });

      it(`Then I should get ${repositoryNeeded} repository`, () => {
        assert.exists(repository);

        expect(repository.full_name).to.equal(`${userName}/${repositoryNeeded}`);
        expect(repository.private).to.equal(false);
        expect(repository.description).to.equal('An awesome html report for Jasmine');
      });

      describe('When I download the default repository branch', () => {
        let zipArchive;
        const expectedDownloadMd5 = 'cb1d5ff786ef7e075c8cd67018ba7a74';

        before(async () => {
          const downloadRespose = await agent.get(`${repository.svn_url}/archive/${repository.default_branch}.zip`)
            .set('User-Agent', 'agent')
            .auth('token', process.env.ACCESS_TOKEN)
            .buffer(true);

          zipArchive = downloadRespose.text;
        });

        it('Then I should have downloaded the default branch', () => {
          expect(md5(zipArchive)).to.equal(expectedDownloadMd5);
        });

        describe('When I get repository file list', () => {
          const format = {
            name: 'README.md',
            path: 'README.md',
            sha: 'b9900ca9b34077fe6a8f2aaa37a173824fa9751d'
          };
          let filesList;
          let readme;

          before(async () => {
            const fileResponse = await agent.get(`${repository.url}/contents`)
              .set('User-Agent', 'agent')
              .auth('token', process.env.ACCESS_TOKEN);

            filesList = fileResponse.body;
            readme = filesList.find((file) => file.name === 'README.md');
          });

          it('Then it should have README.md file', () => {
            assert.exists(readme);
            expect(readme).containSubset(format);
          });

          describe('When I download README.md file', () => {
            const expectedReadmeMd5 = '0e62b07144b4fa997eedb864ff93e26b';
            let fileContent;

            before(async () => {
              const readmeDownloadRespose = await agent.get(readme.download_url)
                .set('User-Agent', 'agent')
                .auth('token', process.env.ACCESS_TOKEN)
                .buffer(true);

              fileContent = readmeDownloadRespose.text;
            });

            it('Then the README.md file should be downloaded', () => {
              expect(md5(fileContent)).to.equal(expectedReadmeMd5);
            });
          });
        });
      });
    });
  });
});

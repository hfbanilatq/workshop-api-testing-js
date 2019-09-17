const agent = require('superagent');
const { expect, assert } = require('chai').use(require('chai-subset'));
const md5 = require('md5');

const urlBase = 'https://api.github.com';

describe('Github api test repositories', () => {
  const userName = 'aperdomob';

  describe(`Wheng get ${userName} user`, async () => {
    let user;

    before(async () => {
      const userResponse = await agent.get(`${urlBase}/users/${userName}`)
        .set('User-Agent', 'agent')
        .auth('token', process.env.ACCESS_TOKEN);
      user = userResponse.body;
    });

    it('then getted the user', () => {
      expect(user.name).to.equal('Alejandro Perdomo');
      expect(user.company).to.equal('PSL');
      expect(user.location).to.equal('Colombia');
    });

    describe(`When get ${userName}'s repositories`, () => {
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

      it(`Then getted the ${repositoryNeeded} repository`, () => {
        assert.exists(repository);

        expect(repository.full_name).to.equal(`${userName}/${repositoryNeeded}`);
        expect(repository.private).to.equal(false);
        expect(repository.description).to.equal('An awesome html report for Jasmine');
      });

      describe('when donwload default branch', () => {
        let zipArchive;
        const expectedDownloadMd5 = 'cb1d5ff786ef7e075c8cd67018ba7a74';

        before(async () => {
          const downloadRespose = await agent.get(`${repository.svn_url}/archive/${repository.default_branch}.zip`)
            .set('User-Agent', 'agent')
            .auth('token', process.env.ACCESS_TOKEN)
            .buffer(true);

          zipArchive = downloadRespose.text;
        });

        it('then the file has been downloaded', () => {
          expect(md5(zipArchive)).to.equal(expectedDownloadMd5);
        });

        describe('When get repository file list', () => {
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

          it('then shoul have README.md file', () => {
            assert.exists(readme);
            expect(readme).containSubset(format);
          });

          describe('When dowload README.md file', () => {
            const expectedReadmeMd5 = '0e62b07144b4fa997eedb864ff93e26b';
            let fileContent;

            before(async () => {
              const readmeDownloadRespose = await agent.get(readme.download_url)
                .set('User-Agent', 'agent')
                .auth('token', process.env.ACCESS_TOKEN)
                .buffer(true);

              fileContent = readmeDownloadRespose.text;
            });

            it('then should be downloaded README.md file', () => {
              expect(md5(fileContent)).to.equal(expectedReadmeMd5);
            });
          });
        });
      });
    });
  });
});

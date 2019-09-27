const agent = require('superagent');
const statusCode = require('http-status-codes');
const { expect } = require('chai').use(require('chai-subset'));

const baseUrl = 'https://api.github.com';
const codigoJs = 'const mensaje = \'mensaje para imprimir\'; ';

describe('Create and Delete a Gist in github', () => {
  describe('When I wanna create a Gist in Github', () => {
    const createGist = {
      description: 'este es un gist creado por medio del test mocha',
      public: true,
      files: {
        'createGistTest.js': {
          content: codigoJs
        }
      }
    };
    let newGistResponse;
    let gist;

    before(async () => {
      newGistResponse = await agent.post(`${baseUrl}/gists`, createGist)
        .set('User-Agent', 'agente')
        .auth('token', process.env.ACCESS_TOKEN);
      gist = newGistResponse.body;
    });

    it('Then the Gist should be created', () => {
      expect(newGistResponse.status).to.equal(statusCode.CREATED);
      expect(gist).containSubset(createGist);
    });

    describe('When I wanna get the gist', () => {
      let gistResponse;

      before(async () => {
        gistResponse = await agent.get(gist.url)
          .set('User-Agent', 'agent')
          .auth('token', process.env.ACCESS_TOKEN);
      });

      it('Then the gist should be accesible', () => expect(gistResponse.status).to.equal(statusCode.OK));

      describe('When I delete a Gist', () => {
        let deleteGistRespose;

        before(async () => {
          deleteGistRespose = await agent.del(gist.url)
            .set('User-Agent', 'agent')
            .auth('token', process.env.ACCESS_TOKEN);
        });

        it('then the gist should be deleted', () => expect(deleteGistRespose.status).to.equal(statusCode.NO_CONTENT));

        describe('When I try obtain the Gist deleted', () => {
          let responseStatus;
          before(async () => {
            try {
              await agent.get(gist.url)
                .set('User-Agent', 'agent')
                .auth('token', process.env.ACCESS_TOKEN);
            } catch (response) {
              responseStatus = response.status;
            }
          });

          it('Then the Gist should not exist', () => expect(responseStatus).to.equal(statusCode.NOT_FOUND));
        });
      });
    });
  });
});

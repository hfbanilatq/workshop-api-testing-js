const agent = require('superagent');
const statusCode = require('http-status-codes');
const { expect } = require('chai');

describe('first api test', () => {
  it('Consume GET Service', async () => {
    const response = await agent.get('https://httpbin.org/ip');

    expect(response.status).to.equal(statusCode.OK);
    expect(response.body).to.have.property('origin');
  });

  it('Consume GET Service with query parameters', async () => {
    const query = {
      name: 'Jhon',
      age: '31',
      city: 'New York'
    };
    const response = await agent.get('https://httpbin.org/get').query(query);

    expect(response.status).to.equal(statusCode.OK);
    expect(response.body.args).to.eql(query);
  });

  it('Consume HEAD service', async () => {
    const query = {
      name: 'Jhon',
      age: '31',
      city: 'New York'

    };
    const response = await agent.head('https://httpbin.org/headers').query(query);
    const todayDate = new Date();

    expect(response.status).to.equal(statusCode.OK);

    const serverDate = new Date(response.header.date);

    expect(response.header['content-length']).to.equal('49');
    expect(serverDate.getDate()).to.equal(todayDate.getDate());
    expect(response.body).to.eql({});
  });

  it('Consume PATCH service ', async () => {
    const query = {
      name: 'Jhon',
      age: '31'
    };
    const response = await agent.patch('https://httpbin.org/patch').send(query);

    expect(response.status).to.equal(statusCode.OK);
    expect(response.body.json).to.eql(query);
    expect(response.body.files).to.eql({});
  });

  it('Consume DELETE service ', async () => {
    const query = {
      name: 'Hector',
      age: 21,
      city: 'Medellin'
    };
    const response = await agent
      .delete('https://httpbin.org/delete')
      .send(query);

    expect(response.status).to.equal(statusCode.OK);
    expect(response.body.json).to.eql(query);
  });

  it('Consume POST service', async () => {
    const query = {
      name: 'Hector',
      age: 21,
      city: 'Medellin'
    };
    const response = await agent
      .post('https://httpbin.org/post')
      .send(query);

    expect(response.status).to.equal(statusCode.OK);
    expect(response.body.json).to.eql(query);
  });

  it('Consume PUT service ', async () => {
    const query = {
      name: 'Jhonatan',
      age: 24,
      city: 'Medellin'
    };
    const response = await agent
      .put('https://httpbin.org/put')
      .send(query);
    expect(response.status).to.equal(statusCode.OK);
    expect(response.body.json).to.eql(query);
  });
});

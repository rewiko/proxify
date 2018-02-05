const request = require('supertest')(process.env.URI);
describe('Test /private/ready path', () => {

  test('It should response the GET method', () => {
    return request.get("/private/ready").then(response => {
      expect(response.statusCode).toBe(200)
    })
  });

});
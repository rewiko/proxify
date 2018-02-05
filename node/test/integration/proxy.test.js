const request = require('supertest')(process.env.URI);
const _ = require('lodash');

let authToken = null;

describe('Test auth component', () => {

  beforeAll(() => {
    authToken = global.authToken;
    return request.post("/admin/auth/login").send({ login: 'admin', password: 'admin' }).then(response => {
      return authToken = response.body.token;
    });
  });

  test('It should be able to get applications token', () => {
    //curl -XGET "http://localhost:1337/comp/private/status?tokenapp=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBsaWNhdGlvbklkIjozLCJwZXJtaXNzaW9uSWQiOjMsInVybEFwcGxpY2F0aW9uIjoibW9ja3M6ODA4MC9jb21wL3ByaXZhdGUvc3RhdHVzIiwicG9ydGFsb25seSI6ZmFsc2UsImlhdCI6MTUzMTU4ODY3NX0.2w1jtm7MttwynCgKIXRKxFe1FqOKzAcOA3CiOXScFt8"  -H "Content-Type: application/json"

    return request.get("/proxy/applications").send()
      .set('Authorization', 'Bearer ' + authToken)
      .then(response => {
        expect(response.body.data).toBeDefined();
        expect(response.body.meta).toBeDefined();
        expect(response.statusCode).toBe(200);
      });
  });

  test('It should be able to proxy to a mock app', () => {
    return request.get("/proxy/applications?limit=100").send()
      .set('Authorization', 'Bearer ' + authToken)
      .then(response => {
        var tokenProxy = _.result(_.find(response.body.data, function (obj) {
          return obj.name === "user-mock";
        }), 'token');
        return request.get("/comp/private/status?tokenapp=" + tokenProxy).then(responseProxy => {
          expect(response.body.data).toBeDefined();
          expect(response.body.meta).toBeDefined();
          expect(response.statusCode).toBe(200);
          expect(responseProxy.text).toEqual("OK");
          expect(responseProxy.statusCode).toBe(200);
        });
      });
  });

});

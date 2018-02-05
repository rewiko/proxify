const request = require('supertest')(process.env.URI);
const _ = require('lodash');

let authToken = null;

describe('Test referer component', () => {

  // TODO test
  // test search get referers

  beforeAll(() => {
    authToken = global.authToken;
    return request.post("/admin/auth/login").send({ login: 'admin', password: 'admin' }).then(response => {
      return authToken = response.body.token;
    });
  });

  test('It shouldnt be able to get referer - nested order pagination', () => {
    return request.get("/admin/referers/?order=wrongAssication.name|ASC,name|DESC").send()
      .set('Authorization', 'Bearer ' + authToken)
      .then(responseOffset => {
        expect(responseOffset.statusCode).toBe(500);
        expect(responseOffset.body).toEqual({ "error": "Can't fetch data" });
      });
  });

  test('It should be able to get referer - nested order pagination', () => {
    return request.get("/admin/referers/?order=permissions.name|ASC,name|DESC").send()
      .set('Authorization', 'Bearer ' + authToken)
      .then(responseOffset => {
        return request.get("/admin/referers/?order=permissions.name|DESC,name|ASC").send()
          .set('Authorization', 'Bearer ' + authToken)
          .then(response => {
            expect(responseOffset.statusCode).toBe(200);
            expect(response.statusCode).toBe(200);
            expect(response.body.data[0].name).not.toEqual(responseOffset.body.data[0].name);
          });
      });
  });

  test('It should be able to get referer - order pagination', () => {
    return request.get("/admin/referers/?order=name|ASC,url|DESC").send()
      .set('Authorization', 'Bearer ' + authToken)
      .then(responseOffset => {
        return request.get("/admin/referers/?order=name|DESC,url|ASC").send()
          .set('Authorization', 'Bearer ' + authToken)
          .then(response => {
            expect(responseOffset.statusCode).toBe(200);
            expect(response.statusCode).toBe(200);
            expect(response.body.data[0].name).not.toEqual(responseOffset.body.data[0].name);
          });
      });
  });

  test('It should be able to get referer - order pagination', () => {
    return request.get("/admin/referers/?order=name|ASC").send()
      .set('Authorization', 'Bearer ' + authToken)
      .then(responseOffset => {
        return request.get("/admin/referers/?order=name|DESC").send()
          .set('Authorization', 'Bearer ' + authToken)
          .then(response => {
            expect(responseOffset.statusCode).toBe(200);
            expect(response.statusCode).toBe(200);
            expect(response.body.data[0].name).not.toEqual(responseOffset.body.data[0].name);
          });
      });
  });

  test('It should be able to get referer - limit/offset pagination', () => {
    return request.get("/admin/referers/?limit=1&offset=0").send()
      .set('Authorization', 'Bearer ' + authToken)
      .then(responseOffset => {
        return request.get("/admin/referers/?limit=1&offset=1").send()
          .set('Authorization', 'Bearer ' + authToken)
          .then(response => {
            expect(responseOffset.statusCode).toBe(200);
            expect(responseOffset.body.data.length).toEqual(1);
            expect(response.statusCode).toBe(200);
            expect(response.body.data.length).toEqual(1);
            expect(response.body.data[0].name).not.toEqual(responseOffset.body.data[0].name);
          });
      });
  });

  test('It should be able to get referer - limit pagination', () => {
    return request.get("/admin/referers/?limit=1").send()
      .set('Authorization', 'Bearer ' + authToken)
      .then(response => {
        expect(response.statusCode).toBe(200);
        expect(response.body.data.length).toEqual(1);
      });
  });

  test('It should be able to update referer - name', () => {
    return request.post("/admin/referer/").send(
      { data: { name: 'updatetestReferer', url: 'desc' } })
      .set('Authorization', 'Bearer ' + authToken)
      .then(responseCreate => {
        return request.put("/admin/referer/" + responseCreate.body.data.id)
          .send({ "data": { "name": "hasbeenupdatedtestReferer" } })
          .set('Authorization', 'Bearer ' + authToken)
          .then(response => {
            return request.get("/admin/referer/" + responseCreate.body.data.id).send()
              .set('Authorization', 'Bearer ' + authToken)
              .then(responseGet => {
                expect(responseCreate.statusCode).toBe(200);
                expect(response.statusCode).toBe(200);
                expect(responseGet.statusCode).toBe(200);
                expect(responseGet.body.data.name).toEqual("hasbeenupdatedtestReferer");
              });
          });
      });
  });

  test('It shouldnt be able to update referer - id doesnt exist', () => {
    return request.put("/admin/referer/999999999").send()
      .set('Authorization', 'Bearer ' + authToken)
      .then(response => {
        expect(response.statusCode).toBe(500);
        expect(response.body).toEqual({ "error": "Missing Payload" });
      });
  });

  test('It shouldnt be able to get referer - get id doesnt exist', () => {
    return request.get("/admin/referer/999999999").send()
      .set('Authorization', 'Bearer ' + authToken)
      .then(response => {
        expect(response.statusCode).toBe(500);
        expect(response.body).toEqual({ "error": "Resource not found" });
      });
  });

  test('It shouldnt be able to get referer - missing payload', () => {
    return request.post("/admin/referer/").send()
      .set('Authorization', 'Bearer ' + authToken)
      .then(response => {
        expect(response.statusCode).toBe(500);
        expect(response.body).toEqual({ "error": "Missing Payload" });
      });
  });

  test('It shouldnt be able to get referer - missing id', () => {
    return request.get("/admin/referer/").send()
      .set('Authorization', 'Bearer ' + authToken)
      .then(response => {
        expect(response.statusCode).toBe(404);
      });
  });

  test('It should be able to create referer', () => {
    return request.post("/admin/referer/").send(
      { data: { name: 'testRefererCreate', url: 'testUrlReferer' } })
      .set('Authorization', 'Bearer ' + authToken)
      .then(response => {
        expect(response.statusCode).toBe(200);
        expect(response.body.data.name).toEqual('testRefererCreate');
      });
  });

  test('It shouldnt be able to create referer - name missing', () => {
    return request.post("/admin/referer/").send(
      { data: { url: 'testNameMissing' } })
      .set('Authorization', 'Bearer ' + authToken)
      .then(response => {
        expect(response.statusCode).toBe(500);
        expect(response.body).toEqual({ "error": "Missing Name field" });
      });
  });

  test('It shouldnt be able to create referer - duplicate name', () => {
    return request.post("/admin/referer/").send(
      { data: { name: 'testrefererduplicate', url: 'testrefererduplicateDescription' } })
      .set('Authorization', 'Bearer ' + authToken)
      .then(response => {
        return request.post("/admin/referer/").send(
          { data: { name: 'testrefererduplicate', url: 'testrefererduplicateDescription' } })
          .set('Authorization', 'Bearer ' + authToken)
          .then(responseSecond => {
            expect(response.statusCode).toBe(200);
            expect(response.body.data.name).toEqual('testrefererduplicate');
            expect(responseSecond.statusCode).toBe(500);
            expect(responseSecond.body).toEqual({ "error": "Error: url must be unique" });
          });
      });
  });

});
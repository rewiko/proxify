const request = require('supertest')(process.env.URI);
const _ = require('lodash');

let authToken = null;

describe('Test application component', () => {

  // TODO test
  // test search get applications

  beforeAll(() => {
    authToken = global.authToken;
    return request.post("/admin/auth/login").send({ login: 'admin', password: 'admin' }).then(response => {
      return authToken = response.body.token;
    });
  });

  test('It shouldnt be able to get application - nested order pagination', () => {
    return request.get("/proxy/applications/?order=wrongAssication.name|ASC,name|DESC").send()
      .set('Authorization', 'Bearer ' + authToken)
      .then(responseOffset => {
        expect(responseOffset.statusCode).toBe(500);
        expect(responseOffset.body).toEqual({ "error": "Can't fetch data" });
      });
  });

  test('It should be able to get application - nested order pagination', () => {
    return request.get("/proxy/applications/?order=permission.name|ASC,name|DESC").send()
      .set('Authorization', 'Bearer ' + authToken)
      .then(responseOffset => {
        return request.get("/proxy/applications/?order=permission.name|DESC,name|ASC").send()
          .set('Authorization', 'Bearer ' + authToken)
          .then(response => {
            expect(responseOffset.statusCode).toBe(200);
            expect(response.statusCode).toBe(200);
            expect(response.body.data[0].name).not.toEqual(responseOffset.body.data[0].name);
          });
      });
  });

  test('It should be able to get application - order pagination', () => {
    return request.get("/proxy/applications/?order=name|ASC,url|DESC").send()
      .set('Authorization', 'Bearer ' + authToken)
      .then(responseOffset => {
        return request.get("/proxy/applications/?order=name|DESC,url|ASC").send()
          .set('Authorization', 'Bearer ' + authToken)
          .then(response => {
            expect(responseOffset.statusCode).toBe(200);
            expect(response.statusCode).toBe(200);
            expect(response.body.data[0].name).not.toEqual(responseOffset.body.data[0].name);
          });
      });
  });

  test('It should be able to get application - order pagination', () => {
    return request.get("/proxy/applications/?order=name|ASC").send()
      .set('Authorization', 'Bearer ' + authToken)
      .then(responseOffset => {
        return request.get("/proxy/applications/?order=name|DESC").send()
          .set('Authorization', 'Bearer ' + authToken)
          .then(response => {
            expect(responseOffset.statusCode).toBe(200);
            expect(response.statusCode).toBe(200);
            expect(response.body.data[0].name).not.toEqual(responseOffset.body.data[0].name);
          });
      });
  });

  test('It should be able to get application - limit/offset pagination', () => {
    return request.get("/proxy/applications/?limit=1&offset=0").send()
      .set('Authorization', 'Bearer ' + authToken)
      .then(responseOffset => {
        return request.get("/proxy/applications/?limit=1&offset=1").send()
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

  test('It should be able to get application - limit pagination', () => {
    return request.get("/proxy/applications/?limit=1").send()
      .set('Authorization', 'Bearer ' + authToken)
      .then(response => {
        expect(response.statusCode).toBe(200);
        expect(response.body.data.length).toEqual(1);
      });
  });

  test('It should be able to update application - name', () => {
    return request.post("/proxy/application/").send(
      { data: { name: 'updatetestApplication', url: 'desc', permissions: [{ id: 1 }] } })
      .set('Authorization', 'Bearer ' + authToken)
      .then(responseCreate => {
        return request.put("/proxy/application/" + responseCreate.body.data.id)
          .send({ "data": { "name": "hasbeenupdatedtestApplication" } })
          .set('Authorization', 'Bearer ' + authToken)
          .then(response => {
            return request.get("/proxy/application/" + responseCreate.body.data.id).send()
              .set('Authorization', 'Bearer ' + authToken)
              .then(responseGet => {
                expect(responseCreate.statusCode).toBe(200);
                expect(response.statusCode).toBe(200);
                expect(responseGet.statusCode).toBe(200);
                expect(responseGet.body.data.name).toEqual("hasbeenupdatedtestApplication");
              });
          });
      });
  });

  test('It shouldnt be able to update application - id doesnt exist', () => {
    return request.put("/proxy/application/999999999").send()
      .set('Authorization', 'Bearer ' + authToken)
      .then(response => {
        expect(response.statusCode).toBe(500);
        expect(response.body).toEqual({ "error": "Missing Payload" });
      });
  });

  test('It shouldnt be able to get application - get id doesnt exist', () => {
    return request.get("/proxy/application/999999999").send()
      .set('Authorization', 'Bearer ' + authToken)
      .then(response => {
        expect(response.statusCode).toBe(500);
        expect(response.body).toEqual({ "error": "Resource not found" });
      });
  });

  test('It shouldnt be able to get application - missing payload', () => {
    return request.post("/proxy/application/").send()
      .set('Authorization', 'Bearer ' + authToken)
      .then(response => {
        expect(response.statusCode).toBe(500);
        expect(response.body).toEqual({ "error": "Missing Payload" });
      });
  });

  test('It shouldnt be able to get application - missing id', () => {
    return request.get("/proxy/application/").send()
      .set('Authorization', 'Bearer ' + authToken)
      .then(response => {
        expect(response.statusCode).toBe(404);
      });
  });

  test('It should be able to create application', () => {
    return request.post("/proxy/application/").send(
      { data: { name: 'testApplicationCreate', url: 'testUri' } })
      .set('Authorization', 'Bearer ' + authToken)
      .then(response => {
        expect(response.statusCode).toBe(200);
        expect(response.body.data.name).toEqual('testApplicationCreate');
      });
  });

  test('It shouldnt be able to create application - name missing', () => {
    return request.post("/proxy/application/").send(
      { data: { url: 'testNameMissing' } })
      .set('Authorization', 'Bearer ' + authToken)
      .then(response => {
        expect(response.statusCode).toBe(500);
        expect(response.body).toEqual({ "error": "Missing Name field" });
      });
  });

  test('It shouldnt be able to create application - duplicate name', () => {
    return request.post("/proxy/application/").send(
      { data: { name: 'testapplicationduplicate', url: 'testapplicationduplicateDescription' } })
      .set('Authorization', 'Bearer ' + authToken)
      .then(response => {
        return request.post("/proxy/application/").send(
          { data: { name: 'testapplicationduplicate', url: 'testapplicationduplicateDescription' } })
          .set('Authorization', 'Bearer ' + authToken)
          .then(responseSecond => {
            expect(response.statusCode).toBe(200);
            expect(response.body.data.name).toEqual('testapplicationduplicate');
            expect(responseSecond.statusCode).toBe(500);
            expect(responseSecond.body).toEqual({ "error": "Error: name must be unique" });
          });
      });
  });

});
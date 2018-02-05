const request = require('supertest')(process.env.URI);
const _ = require('lodash');

let authToken = null;

describe('Test role component', () => {

  // TODO test
  // test search get roles

  beforeAll(() => {
    authToken = global.authToken;
    return request.post("/admin/auth/login").send({ login: 'admin', password: 'admin' }).then(response => {
      return authToken = response.body.token;
    });
  });

  test('It shouldnt be able to get role - nested order pagination', () => {
    return request.get("/admin/roles/?order=wrongAssication.name|ASC,name|DESC").send()
      .set('Authorization', 'Bearer ' + authToken)
      .then(responseOffset => {
        expect(responseOffset.statusCode).toBe(500);
        expect(responseOffset.body).toEqual({ "error": "Can't fetch data" });
      });
  });

  test('It should be able to get role - nested order pagination', () => {
    return request.get("/admin/roles/?order=permissions.name|ASC,name|DESC").send()
      .set('Authorization', 'Bearer ' + authToken)
      .then(responseOffset => {
        return request.get("/admin/roles/?order=permissions.name|DESC,name|ASC").send()
          .set('Authorization', 'Bearer ' + authToken)
          .then(response => {
            expect(responseOffset.statusCode).toBe(200);
            expect(response.statusCode).toBe(200);
            expect(response.body.data[0].name).not.toEqual(responseOffset.body.data[0].name);
          });
      });
  });

  test('It should be able to get role - order pagination', () => {
    return request.get("/admin/roles/?order=name|ASC,description|DESC").send()
      .set('Authorization', 'Bearer ' + authToken)
      .then(responseOffset => {
        return request.get("/admin/roles/?order=name|DESC,description|ASC").send()
          .set('Authorization', 'Bearer ' + authToken)
          .then(response => {
            expect(responseOffset.statusCode).toBe(200);
            expect(response.statusCode).toBe(200);
            expect(response.body.data[0].name).not.toEqual(responseOffset.body.data[0].name);
          });
      });
  });

  test('It should be able to get role - order pagination', () => {
    return request.get("/admin/roles/?order=name|ASC").send()
      .set('Authorization', 'Bearer ' + authToken)
      .then(responseOffset => {
        return request.get("/admin/roles/?order=name|DESC").send()
          .set('Authorization', 'Bearer ' + authToken)
          .then(response => {
            expect(responseOffset.statusCode).toBe(200);
            expect(response.statusCode).toBe(200);
            expect(response.body.data[0].name).not.toEqual(responseOffset.body.data[0].name);
          });
      });
  });

  test('It should be able to get role - limit/offset pagination', () => {
    return request.get("/admin/roles/?limit=1&offset=0").send()
      .set('Authorization', 'Bearer ' + authToken)
      .then(responseOffset => {
        return request.get("/admin/roles/?limit=1&offset=1").send()
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

  test('It should be able to get role - limit pagination', () => {
    return request.get("/admin/roles/?limit=1").send()
      .set('Authorization', 'Bearer ' + authToken)
      .then(response => {
        expect(response.statusCode).toBe(200);
        expect(response.body.data.length).toEqual(1);
      });
  });

  test('It should be able to update role - name', () => {
    return request.post("/admin/role/").send(
      { data: { name: 'updatetestRole', description: 'desc' } })
      .set('Authorization', 'Bearer ' + authToken)
      .then(responseCreate => {
        return request.put("/admin/role/" + responseCreate.body.data.id)
          .send({ "data": { "name": "hasbeenupdatedtestRole" } })
          .set('Authorization', 'Bearer ' + authToken)
          .then(response => {
            return request.get("/admin/role/" + responseCreate.body.data.id).send()
              .set('Authorization', 'Bearer ' + authToken)
              .then(responseGet => {
                expect(responseCreate.statusCode).toBe(200);
                expect(response.statusCode).toBe(200);
                expect(responseGet.statusCode).toBe(200);
                expect(responseGet.body.data.name).toEqual("hasbeenupdatedtestRole");
              });
          });
      });
  });

  test('It shouldnt be able to update role - id doesnt exist', () => {
    return request.put("/admin/role/999999999").send()
      .set('Authorization', 'Bearer ' + authToken)
      .then(response => {
        expect(response.statusCode).toBe(500);
        expect(response.body).toEqual({ "error": "Missing Payload" });
      });
  });

  test('It shouldnt be able to get role - get id doesnt exist', () => {
    return request.get("/admin/role/999999999").send()
      .set('Authorization', 'Bearer ' + authToken)
      .then(response => {
        expect(response.statusCode).toBe(500);
        expect(response.body).toEqual({ "error": "Resource not found" });
      });
  });

  test('It shouldnt be able to get role - missing payload', () => {
    return request.post("/admin/role/").send()
      .set('Authorization', 'Bearer ' + authToken)
      .then(response => {
        expect(response.statusCode).toBe(500);
        expect(response.body).toEqual({ "error": "Missing Payload" });
      });
  });

  test('It shouldnt be able to get role - missing id', () => {
    return request.get("/admin/role/").send()
      .set('Authorization', 'Bearer ' + authToken)
      .then(response => {
        expect(response.statusCode).toBe(404);
      });
  });

  test('It should be able to create role', () => {
    return request.post("/admin/role/").send(
      { data: { name: 'testRoleCreate' } })
      .set('Authorization', 'Bearer ' + authToken)
      .then(response => {
        expect(response.statusCode).toBe(200);
        expect(response.body.data.name).toEqual('testRoleCreate');
      });
  });

  test('It shouldnt be able to create role - name missing', () => {
    return request.post("/admin/role/").send(
      { data: { description: 'testNameMissing' } })
      .set('Authorization', 'Bearer ' + authToken)
      .then(response => {
        expect(response.statusCode).toBe(500);
        expect(response.body).toEqual({ "error": "Missing Name field" });
      });
  });

  test('It shouldnt be able to create role - duplicate name', () => {
    return request.post("/admin/role/").send(
      { data: { name: 'testroleduplicate', description: 'testroleduplicateDescription' } })
      .set('Authorization', 'Bearer ' + authToken)
      .then(response => {
        return request.post("/admin/role/").send(
          { data: { name: 'testroleduplicate', description: 'testroleduplicateDescription' } })
          .set('Authorization', 'Bearer ' + authToken)
          .then(responseSecond => {
            expect(response.statusCode).toBe(200);
            expect(response.body.data.name).toEqual('testroleduplicate');
            expect(responseSecond.statusCode).toBe(500);
            expect(responseSecond.body).toEqual({ "error": "Error: name must be unique" });
          });
      });
  });

});
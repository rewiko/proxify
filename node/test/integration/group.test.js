const request = require('supertest')(process.env.URI);
const _ = require('lodash');

let authToken = null;

describe('Test group component', () => {

  // TODO test
  // test search get groups

  beforeAll(() => {
    authToken = global.authToken;
    return request.post("/admin/auth/login").send({ login: 'admin', password: 'admin' }).then(response => {
      return authToken = response.body.token;
    });
  });

  test('It shouldnt be able to get group - nested order pagination', () => {
    return request.get("/admin/groups/?order=wrongAssication.username|ASC,name|DESC").send()
      .set('Authorization', 'Bearer ' + authToken)
      .then(responseOffset => {
        expect(responseOffset.statusCode).toBe(500);
        expect(responseOffset.body).toEqual({ "error": "Can't fetch data" });
      });
  });

  test('It should be able to get group - nested order pagination', () => {
    return request.get("/admin/groups/?order=users.username|ASC,name|DESC").send()
      .set('Authorization', 'Bearer ' + authToken)
      .then(responseOffset => {
        return request.get("/admin/groups/?order=users.username|DESC,name|ASC").send()
          .set('Authorization', 'Bearer ' + authToken)
          .then(response => {
            expect(responseOffset.statusCode).toBe(200);
            expect(response.statusCode).toBe(200);
            expect(response.body.data[0].name).not.toEqual(responseOffset.body.data[0].name);
          });
      });
  });

  test('It should be able to get group - order pagination', () => {
    return request.get("/admin/groups/?order=name|ASC,description|DESC").send()
      .set('Authorization', 'Bearer ' + authToken)
      .then(responseOffset => {
        return request.get("/admin/groups/?order=name|DESC,description|ASC").send()
          .set('Authorization', 'Bearer ' + authToken)
          .then(response => {
            expect(responseOffset.statusCode).toBe(200);
            expect(response.statusCode).toBe(200);
            expect(response.body.data[0].name).not.toEqual(responseOffset.body.data[0].name);
          });
      });
  });

  test('It should be able to get group - order pagination', () => {
    return request.get("/admin/groups/?order=name|ASC").send()
      .set('Authorization', 'Bearer ' + authToken)
      .then(responseOffset => {
        return request.get("/admin/groups/?order=name|DESC").send()
          .set('Authorization', 'Bearer ' + authToken)
          .then(response => {
            expect(responseOffset.statusCode).toBe(200);
            expect(response.statusCode).toBe(200);
            expect(response.body.data[0].name).not.toEqual(responseOffset.body.data[0].name);
          });
      });
  });

  test('It should be able to get group - limit/offset pagination', () => {
    return request.get("/admin/groups/?limit=1&offset=0").send()
      .set('Authorization', 'Bearer ' + authToken)
      .then(responseOffset => {
        return request.get("/admin/groups/?limit=1&offset=1").send()
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

  test('It should be able to get group - limit pagination', () => {
    return request.get("/admin/groups/?limit=1").send()
      .set('Authorization', 'Bearer ' + authToken)
      .then(response => {
        expect(response.statusCode).toBe(200);
        expect(response.body.data.length).toEqual(1);
      });
  });

  test('It should be able to update group - name', () => {
    return request.post("/admin/group/").send(
      { data: { name: 'updatetestGroup', description: 'desc' } })
      .set('Authorization', 'Bearer ' + authToken)
      .then(responseCreate => {
        return request.put("/admin/group/" + responseCreate.body.data.id)
          .send({ "data": { "name": "hasbeenupdatedtestGroup" } })
          .set('Authorization', 'Bearer ' + authToken)
          .then(response => {
            return request.get("/admin/group/" + responseCreate.body.data.id).send()
              .set('Authorization', 'Bearer ' + authToken)
              .then(responseGet => {
                expect(responseCreate.statusCode).toBe(200);
                expect(response.statusCode).toBe(200);
                expect(responseGet.statusCode).toBe(200);
                expect(responseGet.body.data.name).toEqual("hasbeenupdatedtestGroup");
              });
          });
      });
  });

  test('It shouldnt be able to update group - id doesnt exist', () => {
    return request.put("/admin/group/999999999").send()
      .set('Authorization', 'Bearer ' + authToken)
      .then(response => {
        expect(response.statusCode).toBe(500);
        expect(response.body).toEqual({ "error": "Missing Payload" });
      });
  });

  test('It shouldnt be able to get group - get id doesnt exist', () => {
    return request.get("/admin/group/999999999").send()
      .set('Authorization', 'Bearer ' + authToken)
      .then(response => {
        expect(response.statusCode).toBe(500);
        expect(response.body).toEqual({ "error": "Resource not found" });
      });
  });

  test('It shouldnt be able to get group - missing payload', () => {
    return request.post("/admin/group/").send()
      .set('Authorization', 'Bearer ' + authToken)
      .then(response => {
        expect(response.statusCode).toBe(500);
        expect(response.body).toEqual({ "error": "Missing Payload" });
      });
  });

  test('It shouldnt be able to get group - missing id', () => {
    return request.get("/admin/group/").send()
      .set('Authorization', 'Bearer ' + authToken)
      .then(response => {
        expect(response.statusCode).toBe(404);
      });
  });

  test('It should be able to create group', () => {
    return request.post("/admin/group/").send(
      { data: { name: 'testGroupCreate' } })
      .set('Authorization', 'Bearer ' + authToken)
      .then(response => {
        expect(response.statusCode).toBe(200);
        expect(response.body.data.name).toEqual('testGroupCreate');
      });
  });

  test('It shouldnt be able to create group - name missing', () => {
    return request.post("/admin/group/").send(
      { data: { description: 'testNameMissing' } })
      .set('Authorization', 'Bearer ' + authToken)
      .then(response => {
        expect(response.statusCode).toBe(500);
        expect(response.body).toEqual({ "error": "Missing Name field" });
      });
  });

  test('It shouldnt be able to create group - duplicate name', () => {
    return request.post("/admin/group/").send(
      { data: { name: 'testgroupduplicate', description: 'testgroupduplicateDescription' } })
      .set('Authorization', 'Bearer ' + authToken)
      .then(response => {
        return request.post("/admin/group/").send(
          { data: { name: 'testgroupduplicate', description: 'testgroupduplicateDescription' } })
          .set('Authorization', 'Bearer ' + authToken)
          .then(responseSecond => {
            expect(response.statusCode).toBe(200);
            expect(response.body.data.name).toEqual('testgroupduplicate');
            expect(responseSecond.statusCode).toBe(500);
            expect(responseSecond.body).toEqual({ "error": "Error: name must be unique" });
          });
      });
  });

});
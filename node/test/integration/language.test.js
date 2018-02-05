const request = require('supertest')(process.env.URI);
const _ = require('lodash');

let authToken = null;

describe('Test language component', () => {

  // TODO test
  // test search get languages

  beforeAll(() => {
    authToken = global.authToken;
    return request.post("/admin/auth/login").send({ login: 'admin', password: 'admin' }).then(response => {
      return authToken = response.body.token;
    });
  });

  test('It shouldnt be able to get language - nested order pagination', () => {
    return request.get("/admin/languages/?order=wrongAssication.name|ASC,name|DESC").send()
      .set('Authorization', 'Bearer ' + authToken)
      .then(responseOffset => {
        expect(responseOffset.statusCode).toBe(500);
        expect(responseOffset.body).toEqual({ "error": "Can't fetch data" });
      });
  });

  test('It should be able to get language - order pagination', () => {
    return request.get("/admin/languages/?order=name|ASC,description|DESC").send()
      .set('Authorization', 'Bearer ' + authToken)
      .then(responseOffset => {
        return request.get("/admin/languages/?order=name|DESC,description|ASC").send()
          .set('Authorization', 'Bearer ' + authToken)
          .then(response => {
            expect(responseOffset.statusCode).toBe(200);
            expect(response.statusCode).toBe(200);
            expect(response.body.data[0].name).not.toEqual(responseOffset.body.data[0].name);
          });
      });
  });

  test('It should be able to get language - order pagination', () => {
    return request.get("/admin/languages/?order=name|ASC").send()
      .set('Authorization', 'Bearer ' + authToken)
      .then(responseOffset => {
        return request.get("/admin/languages/?order=name|DESC").send()
          .set('Authorization', 'Bearer ' + authToken)
          .then(response => {
            expect(responseOffset.statusCode).toBe(200);
            expect(response.statusCode).toBe(200);
            expect(response.body.data[0].name).not.toEqual(responseOffset.body.data[0].name);
          });
      });
  });

  test('It should be able to get language - limit/offset pagination', () => {
    return request.get("/admin/languages/?limit=1&offset=0").send()
      .set('Authorization', 'Bearer ' + authToken)
      .then(responseOffset => {
        return request.get("/admin/languages/?limit=1&offset=1").send()
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

  test('It should be able to get language - limit pagination', () => {
    return request.get("/admin/languages/?limit=1").send()
      .set('Authorization', 'Bearer ' + authToken)
      .then(response => {
        expect(response.statusCode).toBe(200);
        expect(response.body.data.length).toEqual(1);
      });
  });

  test('It should be able to update language - name', () => {
    return request.post("/admin/language/").send(
      { data: { name: 'updatetestLanguage', description: 'desc' } })
      .set('Authorization', 'Bearer ' + authToken)
      .then(responseCreate => {
        return request.put("/admin/language/" + responseCreate.body.data.id)
          .send({ "data": { "name": "hasbeenupdatedtestLanguage" } })
          .set('Authorization', 'Bearer ' + authToken)
          .then(response => {
            return request.get("/admin/language/" + responseCreate.body.data.id).send()
              .set('Authorization', 'Bearer ' + authToken)
              .then(responseGet => {
                expect(responseCreate.statusCode).toBe(200);
                expect(response.statusCode).toBe(200);
                expect(responseGet.statusCode).toBe(200);
                expect(responseGet.body.data.name).toEqual("hasbeenupdatedtestLanguage");
              });
          });
      });
  });

  test('It shouldnt be able to update language - id doesnt exist', () => {
    return request.put("/admin/language/999999999").send()
      .set('Authorization', 'Bearer ' + authToken)
      .then(response => {
        expect(response.statusCode).toBe(500);
        expect(response.body).toEqual({ "error": "Missing Payload" });
      });
  });

  test('It shouldnt be able to get language - get id doesnt exist', () => {
    return request.get("/admin/language/999999999").send()
      .set('Authorization', 'Bearer ' + authToken)
      .then(response => {
        expect(response.statusCode).toBe(500);
        expect(response.body).toEqual({ "error": "Resource not found" });
      });
  });

  test('It shouldnt be able to get language - missing payload', () => {
    return request.post("/admin/language/").send()
      .set('Authorization', 'Bearer ' + authToken)
      .then(response => {
        expect(response.statusCode).toBe(500);
        expect(response.body).toEqual({ "error": "Missing Payload" });
      });
  });

  test('It shouldnt be able to get language - missing id', () => {
    return request.get("/admin/language/").send()
      .set('Authorization', 'Bearer ' + authToken)
      .then(response => {
        expect(response.statusCode).toBe(404);
      });
  });

  test('It should be able to create language', () => {
    return request.post("/admin/language/").send(
      { data: { name: 'testLanguageCreate' } })
      .set('Authorization', 'Bearer ' + authToken)
      .then(response => {
        expect(response.statusCode).toBe(200);
        expect(response.body.data.name).toEqual('testLanguageCreate');
      });
  });

  test('It shouldnt be able to create language - name missing', () => {
    return request.post("/admin/language/").send(
      { data: { description: 'testNameMissing' } })
      .set('Authorization', 'Bearer ' + authToken)
      .then(response => {
        expect(response.statusCode).toBe(500);
        expect(response.body).toEqual({ "error": "Missing Name field" });
      });
  });

  test('It shouldnt be able to create language - duplicate name', () => {
    return request.post("/admin/language/").send(
      { data: { name: 'testlanguageduplicate', description: 'testlanguageduplicateDescription' } })
      .set('Authorization', 'Bearer ' + authToken)
      .then(response => {
        return request.post("/admin/language/").send(
          { data: { name: 'testlanguageduplicate', description: 'testlanguageduplicateDescription' } })
          .set('Authorization', 'Bearer ' + authToken)
          .then(responseSecond => {
            expect(response.statusCode).toBe(200);
            expect(response.body.data.name).toEqual('testlanguageduplicate');
            expect(responseSecond.statusCode).toBe(500);
            expect(responseSecond.body).toEqual({ "error": "Error: name must be unique" });
          });
      });
  });

});
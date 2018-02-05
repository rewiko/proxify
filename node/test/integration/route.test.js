const request = require('supertest')(process.env.URI);
const _ = require('lodash');

let authToken = null;

describe('Test route component', () => {

  // TODO test
  // test search get routes

  beforeAll(() => {
    authToken = global.authToken;
    return request.post("/admin/auth/login").send({ login: 'admin', password: 'admin' }).then(response => {
      return authToken = response.body.token;
    });
  });

  test('It shouldnt be able to get route - nested order pagination', () => {
    return request.get("/admin/routes/?order=wrongAssication.name|ASC,path|DESC").send()
      .set('Authorization', 'Bearer ' + authToken)
      .then(responseOffset => {
        expect(responseOffset.statusCode).toBe(500);
        expect(responseOffset.body).toEqual({ "error": "Can't fetch data" });
      });
  });

  test('It should be able to get route - nested order pagination', () => {
    return request.get("/admin/routes/?order=permissions.name|ASC,path|DESC").send()
      .set('Authorization', 'Bearer ' + authToken)
      .then(responseOffset => {
        return request.get("/admin/routes/?order=permissions.name|DESC,path|ASC").send()
          .set('Authorization', 'Bearer ' + authToken)
          .then(response => {
            expect(responseOffset.statusCode).toBe(200);
            expect(response.statusCode).toBe(200);
            expect(response.body.data[0].uniqpathmethod).not.toEqual(responseOffset.body.data[0].uniqpathmethod);
          });
      });
  });

  test('It should be able to get route - order pagination', () => {
    return request.get("/admin/routes/?order=path|ASC,method|DESC").send()
      .set('Authorization', 'Bearer ' + authToken)
      .then(responseOffset => {
        return request.get("/admin/routes/?order=path|DESC,method|ASC").send()
          .set('Authorization', 'Bearer ' + authToken)
          .then(response => {
            expect(responseOffset.statusCode).toBe(200);
            expect(response.statusCode).toBe(200);
            expect(response.body.data[0].uniqpathmethod).not.toEqual(responseOffset.body.data[0].uniqpathmethod);
          });
      });
  });

  test('It should be able to get route - order pagination', () => {
    return request.get("/admin/routes/?order=path|ASC").send()
      .set('Authorization', 'Bearer ' + authToken)
      .then(responseOffset => {
        return request.get("/admin/routes/?order=path|DESC").send()
          .set('Authorization', 'Bearer ' + authToken)
          .then(response => {
            expect(responseOffset.statusCode).toBe(200);
            expect(response.statusCode).toBe(200);
            expect(response.body.data[0].uniqpathmethod).not.toEqual(responseOffset.body.data[0].uniqpathmethod);
          });
      });
  });

  test('It should be able to get route - limit/offset pagination', () => {
    return request.get("/admin/routes/?limit=1&offset=0").send()
      .set('Authorization', 'Bearer ' + authToken)
      .then(responseOffset => {
        return request.get("/admin/routes/?limit=1&offset=1").send()
          .set('Authorization', 'Bearer ' + authToken)
          .then(response => {
            expect(responseOffset.statusCode).toBe(200);
            expect(responseOffset.body.data.length).toEqual(1);
            expect(response.statusCode).toBe(200);
            expect(response.body.data.length).toEqual(1);
            expect(response.body.data[0].uniqpathmethod).not.toEqual(responseOffset.body.data[0].uniqpathmethod);
          });
      });
  });

  test('It should be able to get route - limit pagination', () => {
    return request.get("/admin/routes/?limit=1").send()
      .set('Authorization', 'Bearer ' + authToken)
      .then(response => {
        expect(response.statusCode).toBe(200);
        expect(response.body.data.length).toEqual(1);
      });
  });

  test('It should be able to update route - name', () => {
    return request.post("/admin/route/").send(
      { data: { path: 'updatetestPath', method: 'testMethod', uniqpathmethod: 'testMethodRoute' } })
      .set('Authorization', 'Bearer ' + authToken)
      .then(responseCreate => {
        return request.put("/admin/route/" + responseCreate.body.data.id)
          .send({ "data": { "path": "hasbeenupdatedtestRoute" } })
          .set('Authorization', 'Bearer ' + authToken)
          .then(response => {
            return request.get("/admin/route/" + responseCreate.body.data.id).send()
              .set('Authorization', 'Bearer ' + authToken)
              .then(responseGet => {
                expect(responseCreate.statusCode).toBe(200);
                expect(response.statusCode).toBe(200);
                expect(responseGet.statusCode).toBe(200);
                expect(responseGet.body.data.path).toEqual("hasbeenupdatedtestRoute");
              });
          });
      });
  });

  test('It shouldnt be able to update route - id doesnt exist', () => {
    return request.put("/admin/route/999999999").send()
      .set('Authorization', 'Bearer ' + authToken)
      .then(response => {
        expect(response.statusCode).toBe(500);
        expect(response.body).toEqual({ "error": "Missing Payload" });
      });
  });

  test('It shouldnt be able to get route - get id doesnt exist', () => {
    return request.get("/admin/route/999999999").send()
      .set('Authorization', 'Bearer ' + authToken)
      .then(response => {
        expect(response.statusCode).toBe(500);
        expect(response.body).toEqual({ "error": "Resource not found" });
      });
  });

  test('It shouldnt be able to get route - missing payload', () => {
    return request.post("/admin/route/").send()
      .set('Authorization', 'Bearer ' + authToken)
      .then(response => {
        expect(response.statusCode).toBe(500);
        expect(response.body).toEqual({ "error": "Missing Payload" });
      });
  });

  test('It shouldnt be able to get route - missing id', () => {
    return request.get("/admin/route/").send()
      .set('Authorization', 'Bearer ' + authToken)
      .then(response => {
        expect(response.statusCode).toBe(404);
      });
  });

  test('It should be able to create route', () => {
    return request.post("/admin/route/").send(
      { data: { method: 'testMethodRouteC', path: 'testPathRouteC', uniqpathmethod: 'testMethodRouteCtestPathRouteC' } })
      .set('Authorization', 'Bearer ' + authToken)
      .then(response => {
        expect(response.statusCode).toBe(200);
      });
  });

  test('It shouldnt be able to create route - name missing', () => {
    return request.post("/admin/route/").send(
      { data: { method: 'testMethodRoute' } })
      .set('Authorization', 'Bearer ' + authToken)
      .then(response => {
        expect(response.statusCode).toBe(500);
        expect(response.body).toEqual({ "error": "Missing Path field" });
      });
  });

  test('It shouldnt be able to create route - duplicate name', () => {
    return request.post("/admin/route/").send(
      { data: { method: 'testMethodRoute', path: 'testPathRoute', uniqpathmethod: 'testMethodRoutetestPathRoute' } })
      .set('Authorization', 'Bearer ' + authToken)
      .then(response => {
        return request.post("/admin/route/").send(
          { data: { method: 'testMethodRoute', path: 'testPathRoute', uniqpathmethod: 'testMethodRoutetestPathRoute' } })
          .set('Authorization', 'Bearer ' + authToken)
          .then(responseSecond => {
            expect(response.statusCode).toBe(200);
            expect(response.body.data.method).toEqual('testMethodRoute');
            expect(responseSecond.statusCode).toBe(500);
            expect(responseSecond.body).toEqual({ "error": "Error: uniqpathmethod must be unique" });
          });
      });
  });

});
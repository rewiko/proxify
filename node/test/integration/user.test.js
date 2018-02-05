const request = require('supertest')(process.env.URI);
const _ = require('lodash');

let authToken = null;

describe('Test user component', () => {

  // TODO test
  // test search get users

  beforeAll(() => {
    authToken = global.authToken;
    return request.post("/admin/auth/login").send({ login: 'admin', password: 'admin' }).then(response => {
      return authToken = response.body.token;
    });
  });

  // TODO might introduce flaky test because we update the password of testing user
  test('It should be able to update his profile - password', () => {
    return request.put("/admin/user/me")
      .send({ "data": { "password": "myUpdatedPassword" } })
      .set('Authorization', 'Bearer ' + authToken)
      .then(responseUser => {
        return request.post("/admin/auth/login").send({ login: 'admin', password: "myUpdatedPassword" })
          .then(responseLogin => {
            return request.put("/admin/user/me")
              .send({ "data": { "password": "admin" } })
              .set('Authorization', 'Bearer ' + authToken)
              .then(responseEnd => {
                expect(responseUser.statusCode).toBe(200);
                expect(responseLogin.statusCode).toBe(200);
                expect(responseEnd.statusCode).toBe(200);
                expect(responseLogin.body.username).toEqual('admin');
              });
          });
      });
  });

  test('It shouldnt be able to get info from himself', () => {
    return request.get("/admin/user/me").send()
      .set('Authorization', 'Bearer ' + authToken)
      .then(responseOffset => {
        expect(responseOffset.statusCode).toBe(200);
      });
  });

  test('It shouldnt be able to get user - nested order pagination', () => {
    return request.get("/admin/users/?order=wrongAssication.name|ASC,name|DESC").send()
      .set('Authorization', 'Bearer ' + authToken)
      .then(responseOffset => {
        expect(responseOffset.statusCode).toBe(500);
        expect(responseOffset.body).toEqual({ "error": "Can't fetch data" });
      });
  });

  test('It should be able to get user - nested order pagination', () => {
    return request.get("/admin/users/?order=groups.name|ASC,username|DESC").send()
      .set('Authorization', 'Bearer ' + authToken)
      .then(responseOffset => {
        return request.get("/admin/users/?order=groups.name|DESC,username|ASC").send()
          .set('Authorization', 'Bearer ' + authToken)
          .then(responseUser => {
            expect(responseOffset.statusCode).toBe(200);
            expect(responseUser.statusCode).toBe(200);
            expect(responseUser.body.data[0].username).not.toEqual(responseOffset.body.data[0].username);
          });
      });
  });

  test('It should be able to get user - order pagination', () => {
    return request.get("/admin/users/?order=username|ASC,email|DESC").send()
      .set('Authorization', 'Bearer ' + authToken)
      .then(responseOffset => {
        return request.get("/admin/users/?order=username|DESC,email|ASC").send()
          .set('Authorization', 'Bearer ' + authToken)
          .then(responseUser => {
            expect(responseOffset.statusCode).toBe(200);
            expect(responseUser.statusCode).toBe(200);
            expect(responseUser.body.data[0].username).not.toEqual(responseOffset.body.data[0].username);
          });
      });
  });

  test('It should be able to get user - limit/offset pagination', () => {
    return request.get("/admin/users/?limit=1&offset=0").send()
      .set('Authorization', 'Bearer ' + authToken)
      .then(responseOffset => {
        return request.get("/admin/users/?limit=1&offset=1").send()
          .set('Authorization', 'Bearer ' + authToken)
          .then(responseUser => {
            expect(responseOffset.statusCode).toBe(200);
            expect(responseOffset.body.data.length).toEqual(1);
            expect(responseUser.statusCode).toBe(200);
            expect(responseUser.body.data.length).toEqual(1);
            expect(responseUser.body.data[0].username).not.toEqual(responseOffset.body.data[0].username);
          });
      });
  });

  test('It should be able to get user - limit pagination', () => {
    return request.get("/admin/users/?limit=1").send()
      .set('Authorization', 'Bearer ' + authToken)
      .then(responseUser => {
        expect(responseUser.statusCode).toBe(200);
        expect(responseUser.body.data.length).toEqual(1);
      });
  });

  test('It should be able to update user - password', () => {
    return request.post("/admin/user/").send(
      { data: { username: 'updatetestPasswordUser', password: 'updatetestUser', email: 'updatetestPassrword@localhost.com' } })
      .set('Authorization', 'Bearer ' + authToken)
      .then(responseCreate => {
        return request.put("/admin/user/" + responseCreate.body.data.id)
          .send({ "data": { "password": "myUpdatedPassword" } })
          .set('Authorization', 'Bearer ' + authToken)
          .then(responseUser => {
            return request.post("/admin/auth/login").send({ login: 'updatetestPasswordUser', password: "myUpdatedPassword" })
              .then(responseLogin => {
                expect(responseCreate.statusCode).toBe(200);
                expect(responseCreate.body.data.username).toEqual("updatetestPasswordUser");
                expect(responseUser.statusCode).toBe(200);
                expect(responseUser.body.data.id).toEqual("" + responseCreate.body.data.id);
                expect(responseLogin.statusCode).toBe(200);
                expect(responseLogin.body.username).toEqual('updatetestPasswordUser');
              });
          });
      });
  });

  test('It should be able to update user - username', () => {
    return request.post("/admin/user/").send(
      { data: { username: 'updatetestUser', password: 'updatetestUser', email: 'updatetest@localhost.com' } })
      .set('Authorization', 'Bearer ' + authToken)
      .then(responseCreate => {
        return request.put("/admin/user/" + responseCreate.body.data.id).send({ "data": { "username": "hasbeenupdatedtestUser" } })
          .set('Authorization', 'Bearer ' + authToken)
          .then(responseUser => {
            return request.get("/admin/user/" + responseCreate.body.data.id).send()
              .set('Authorization', 'Bearer ' + authToken)
              .then(responseGetUser => {
                expect(responseCreate.statusCode).toBe(200);
                expect(responseCreate.body.data.username).toEqual("updatetestUser");
                expect(responseUser.statusCode).toBe(200);
                expect(responseUser.body.data.id).toEqual("" + responseCreate.body.data.id);
                expect(responseGetUser.statusCode).toBe(200);
                expect(responseGetUser.body.data.username).toEqual("hasbeenupdatedtestUser");
              });
          });
      });
  });

  test('It shouldnt be able to update user - id doesnt exist', () => {
    return request.put("/admin/user/999999999").send()
      .set('Authorization', 'Bearer ' + authToken)
      .then(responseUser => {
        expect(responseUser.statusCode).toBe(500);
        expect(responseUser.body).toEqual({ "error": "Missing Payload" });
      });
  });

  test('It shouldnt be able to get user - get id doesnt exist', () => {
    return request.get("/admin/user/999999999").send()
      .set('Authorization', 'Bearer ' + authToken)
      .then(responseUser => {
        expect(responseUser.statusCode).toBe(500);
        expect(responseUser.body).toEqual({ "error": "Resource not found" });
      });
  });

  test('It shouldnt be able to get user - missing payload', () => {
    return request.post("/admin/user/").send()
      .set('Authorization', 'Bearer ' + authToken)
      .then(responseUser => {
        expect(responseUser.statusCode).toBe(500);
        expect(responseUser.body).toEqual({ "error": "Missing Payload" });
      });
  });

  test('It shouldnt be able to get user - missing id', () => {
    return request.get("/admin/user/").send()
      .set('Authorization', 'Bearer ' + authToken)
      .then(responseUser => {
        expect(responseUser.statusCode).toBe(404);
      });
  });

  test('It should be able to create user', () => {
    return request.post("/admin/user/").send(
      { data: { username: 'testUser', password: 'testUser', email: 'test@localhost.com' } })
      .set('Authorization', 'Bearer ' + authToken)
      .then(responseUser => {
        expect(responseUser.statusCode).toBe(200);
        expect(responseUser.body.data.username).toEqual('testUser');
        expect(responseUser.body.data.email).toEqual('test@localhost.com');
      });
  });

  test('It shouldnt be able to create user - password missing', () => {
    return request.post("/admin/user/").send(
      { data: { username: 'testUserPassword', email: 'testPassword@localhost.com' } })
      .set('Authorization', 'Bearer ' + authToken)
      .then(responseUser => {
        expect(responseUser.statusCode).toBe(500);
        expect(responseUser.body).toEqual({ "error": "Missing Password field" });
      });
  });

  test('It shouldnt be able to create user - password too short', () => {
    return request.post("/admin/user/").send(
      { data: { username: 'testUserPasswordShort', email: 'testPasswordShort@localhost.com', password: 'test' } })
      .set('Authorization', 'Bearer ' + authToken)
      .then(responseUser => {
        expect(responseUser.statusCode).toBe(500);
        expect(responseUser.body).toEqual({ "error": "Password field to short" });
      });
  });

  test('It shouldnt be able to create user - email missing', () => {
    return request.post("/admin/user/").send(
      { data: { username: 'testUserEmail', password: 'testEmail' } })
      .set('Authorization', 'Bearer ' + authToken)
      .then(responseUser => {
        expect(responseUser.statusCode).toBe(500);
        expect(responseUser.body).toEqual({ "error": "Missing Email field" });
      });
  });

  test('It shouldnt be able to create user - email wrong format', () => {
    return request.post("/admin/user/").send(
      { data: { username: 'testUserEmail', email: 'testWrongFormat', password: 'testEmail' } })
      .set('Authorization', 'Bearer ' + authToken)
      .then(responseUser => {
        expect(responseUser.statusCode).toBe(500);
        expect(responseUser.body).toEqual({ "error": "Email field has a wrong format" });
      });
  });

  test('It shouldnt be able to create user - username missing', () => {
    return request.post("/admin/user/").send(
      { data: { email: 'testUserEmail@localhost.com', password: 'testEmail' } })
      .set('Authorization', 'Bearer ' + authToken)
      .then(responseUser => {
        expect(responseUser.statusCode).toBe(500);
        expect(responseUser.body).toEqual({ "error": "Missing Username field" });
      });
  });

  test('It shouldnt be able to create user - duplicate email', () => {
    return request.post("/admin/user/").send(
      { data: { username: 'testuserpasswordduplicate', email: 'testpasswordduplicate@localhost.com', password: 'testpassword' } })
      .set('Authorization', 'Bearer ' + authToken)
      .then(responseUser => {
        return request.post("/admin/user/").send(
          { data: { username: 'testuserduplicate', email: 'testpasswordduplicate@localhost.com', password: 'testpassword' } })
          .set('Authorization', 'Bearer ' + authToken)
          .then(responseSecondUser => {
            expect(responseUser.statusCode).toBe(200);
            expect(responseUser.body.data.username).toEqual('testuserpasswordduplicate');
            expect(responseSecondUser.statusCode).toBe(500);
            expect(responseSecondUser.body).toEqual({ "error": "Error: email must be unique" });
          });
      });
  });

  test('It shouldnt be able to create user - duplicate username', () => {
    return request.post("/admin/user/").send(
      { data: { username: 'userduplicate', email: 'testpasswordfirt@localhost.com', password: 'testpassword' } })
      .set('Authorization', 'Bearer ' + authToken)
      .then(responseUser => {
        return request.post("/admin/user/").send(
          { data: { username: 'userduplicate', email: 'testpasswordsecond@localhost.com', password: 'testpassword' } })
          .set('Authorization', 'Bearer ' + authToken)
          .then(responseSecondUser => {
            expect(responseUser.statusCode).toBe(200);
            expect(responseUser.body.data.username).toEqual('userduplicate');
            expect(responseSecondUser.statusCode).toBe(500);
            expect(responseSecondUser.body).toEqual({ "error": "Error: username must be unique" });
          });
      });
  });

});

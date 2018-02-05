const request = require('supertest')(process.env.URI);

describe('Test auth component', () => {

  test('It should be able to login', () => {
    return request.post("/admin/auth/login").send({ login: 'admin', password: 'admin' }).then(response => {
      expect(response.body.password).toBeUndefined();
      expect(response.body.token).toBeDefined();
      expect(response.statusCode).toBe(200);
    });
  });

  test('It should be able to signup', () => {
    return request.post("/admin/auth/signup").send({ "email": "usertest@localhost.com", "username": "userTest", "password": "userPassword" }).then(response => {
      expect(response.body.password).toBeUndefined();
      expect(response.body.token).toBeDefined();
      expect(response.statusCode).toBe(200);
    });
  });

  test('It shouldnt be able to signup without password', () => {
    return request.post("/admin/auth/signup").send({ "email": "usertest@localhost.com", "username": "userTest" }).then(response => {
      expect(response.statusCode).toBe(500);
      expect(response.body).toEqual({ "error": "Missing Password field" });
    });
  });

  test('It shouldnt be able to signup without username', () => {
    return request.post("/admin/auth/signup").send({ "email": "usertest@localhost.com", "password": "passwordTest" }).then(response => {
      expect(response.statusCode).toBe(500);
      expect(response.body).toEqual({ "error": "Missing Username field" });
    });
  });

  test('It shouldnt be able to signup without email', () => {
    return request.post("/admin/auth/signup").send({ "username": "usertest", "password": "passwordTest" }).then(response => {
      expect(response.statusCode).toBe(500);
      expect(response.body).toEqual({ "error": "Missing Email field" });
    });
  });

  test('It should be able to authenticate user', () => {
    return request.post("/admin/auth/login").send({ login: 'user', password: 'user' }).then(response => {
      return request.get("/private/authenticate")
        .set('Authorization', 'Bearer ' + response.body.token)
        .then(responseAuth => {
          expect(response.body.password).toBeUndefined();
          expect(response.body.token).toBeDefined();
          expect(response.statusCode).toBe(200);
          expect(responseAuth.statusCode).toBe(200);
          expect(responseAuth.body).toEqual({ "authenticate": true });
        });
    });
  });

  test('It should not be able to authenticate user', () => {
    return request.get("/private/authenticate")
      .then(responseAuth => {
        expect(responseAuth.statusCode).toBe(401);
        expect(responseAuth.body).toEqual({ "error": "No authorization header was found" });
      });
  });

  test('It should not be able to use policies middleware without authenticated', () => {
    return request.get("/private/policies")
      .then(responseAuth => {
        expect(responseAuth.statusCode).toBe(500);
        expect(responseAuth.body).toEqual({ "Router policies -  User not defined": true });
      });
  });

  test('It should be able to use policies and authenticated middleware', () => {
    return request.post("/admin/auth/login").send({ login: 'user', password: 'user' }).then(response => {
      return request.get("/private/authpolicies")
        .set('Authorization', 'Bearer ' + response.body.token)
        .then(responseAuth => {
          expect(response.body.password).toBeUndefined();
          expect(response.body.token).toBeDefined();
          expect(response.statusCode).toBe(200);
          expect(responseAuth.statusCode).toBe(200);
          expect(responseAuth.body).toEqual({ "authpolicies": true });
        });
    });
  });

  test('It shouldnt be able to use policies and authenticated middleware', () => {
    return request.post("/admin/auth/login").send({ login: 'user', password: 'user' }).then(response => {
      return request.get("/private/authpoliciesfailure")
        .set('Authorization', 'Bearer ' + response.body.token)
        .then(responseAuth => {
          expect(response.body.password).toBeUndefined();
          expect(response.body.token).toBeDefined();
          expect(response.statusCode).toBe(200);
          expect(responseAuth.statusCode).toBe(403);
          expect(responseAuth.body).toEqual({ "error": "access denied" });
        });
    });
  });
});

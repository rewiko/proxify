package actions

import io.gatling.core.Predef._
import io.gatling.core.body.StringBody
import io.gatling.http.Predef.{http, status}

object ReqAuthEndpoint {

  val loginEndpoint = exec(
    http("loginPage")
      .post("/admin/auth/login")
      .header("Content-Type", "application/json")
      .body(new StringBody(
        """{
                 "login":"user",
                 "password":"user"
           }"""))
      .check(status.is(200))
  )

  val signupEndpoint = exec(
    http("signupPage")
      .post("/admin/auth/signup")
      .header("Content-Type", "application/json")
      .body(new StringBody(
        """{
                "email":"${randstring}@localhost.com",
                "username": "${randstring}",
                "password": "${randstring}"
           }"""))
      .check(status.is(200))
  )
}

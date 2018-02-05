package actions

import io.gatling.core.Predef._
import io.gatling.core.body.StringBody
import io.gatling.http.Predef.{http, status}

object ReqMockProxyEndpoint {

  val mockProxyEndpoint = exec(
    http("MockProxyPage")
      // .get("/comp/private/status?tokenapp=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBsaWNhdGlvbklkIjozLCJwZXJtaXNzaW9uSWQiOjMsInVybEFwcGxpY2F0aW9uIjoibW9ja3M6ODA4MC9jb21wL3ByaXZhdGUvc3RhdHVzIiwicG9ydGFsb25seSI6ZmFsc2UsImlhdCI6MTUzMTU4ODY3NX0.2w1jtm7MttwynCgKIXRKxFe1FqOKzAcOA3CiOXScFt8")
      .get("/private/echo?tokenapp=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBsaWNhdGlvbklkIjoyLCJwZXJtaXNzaW9uSWQiOjIsInVybEFwcGxpY2F0aW9uIjoibm9kZXRlc3Q6MTMzNyIsInBvcnRhbG9ubHkiOmZhbHNlLCJpYXQiOjE1MzM0ODE2Njd9.FjYTqlxKskHT269HAsM1Fy2f4xGCMxwQtEbd_qyhbL8")
      // .get("/comp/private/status")
      .header("Content-Type", "application/json")
      .check(status.is(200))
  )

}

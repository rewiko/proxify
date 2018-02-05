package actions

import io.gatling.core.Predef._
import io.gatling.core.body.StringBody
import io.gatling.http.Predef.{http, status}

object ReqPrivateEndpoint {

  val privateEchoEndpoint = exec(
    http("getPrivateEcho")
      .get("/private/echo?minDelay=50&maxDelay=100")
      .header("Content-Type", "application/json")
      .check(status.is(200))
  )
}

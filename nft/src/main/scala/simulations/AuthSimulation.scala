package simulations

import actions.{ ReqAuthEndpoint, ReqPrivateEndpoint, ReqMockProxyEndpoint}
import com.typesafe.scalalogging.StrictLogging
import io.gatling.core.Predef._
import _root_.scenario.ScenarioBuilder

class AuthSimulation extends Simulation with StrictLogging {

//   val DurationInSeconds: Int = 900
  val DurationInSeconds: Int = 1 * 60

  setUp(
    // login endpoint is limited by bcrypt library need lot's of compute to be secure - 10 hashes per sec 
    // use a pool ex: https://github.com/auth0/node-baas 
    // ScenarioBuilder.simpleScenario("loginEndpoint", List(ReqAuthEndpoint.loginEndpoint), 10, DurationInSeconds),
    // ScenarioBuilder.simpleScenario("signupEndpoint", List(ReqAuthEndpoint.signupEndpoint), 5, DurationInSeconds),
    // ScenarioBuilder.simpleScenario("privateEchoEndpoint", List(ReqPrivateEndpoint.privateEchoEndpoint), 3, DurationInSeconds),
    ScenarioBuilder.simpleScenario("MockProxyEndpoint", List(ReqMockProxyEndpoint.mockProxyEndpoint), 600, DurationInSeconds),
  ).assertions(
    forAll.successfulRequests.percent.gt(99.99),
    forAll.failedRequests.percent.lte(1), // ensure two nines success rate
    forAll.responseTime.percentile4.lt(300), // measured p99 is 25-35m
    // details("loginPage").responseTime.percentile4.lt(800),
    // details("signupPage").responseTime.percentile4.lt(800),
    // details("getPrivateEcho").responseTime.percentile4.lt(400),
    details("MockProxyPage").responseTime.percentile4.lt(400),
  )
}

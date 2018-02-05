package scenario
import io.gatling.core.Predef._
import io.gatling.core.structure.ChainBuilder
import scala.util.Random

object ScenarioBuilder {

 def simpleScenario(scnName: String, requestName: List[ChainBuilder], TPS: Double, DurationInSecond: Integer) = {
   var randomString = Iterator.continually(
     Map("randstring" -> ( Random.alphanumeric.take(14).mkString ))
     )

   scenario(scnName)
      .feed(randomString)
      .exec(requestName)
      .inject(
        rampUsersPerSec(TPS/5) to (TPS) during (5),
        constantUsersPerSec(TPS) during (DurationInSecond seconds)
      )
      .protocols(config.HttpConfig.HttpConf)
  }

}
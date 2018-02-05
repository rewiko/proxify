package config

import io.gatling.http.Predef.http
import io.gatling.core.Predef._


object HttpConfig {

  val targetServerUrl = scala.util.Properties
      .envOrElse("UriTarget", "http://localhost:1337")

  val HttpConf = http
    .baseURL(targetServerUrl)
    .disableFollowRedirect
    .shareConnections
}

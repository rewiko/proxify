package runner

import java.nio.file.FileSystems

object TestRunner extends App {
  // We need to do this to avoid a deadlock that we often see when Gatling tries to scan the classpath for simulations.
  // There's no way to turn that scanning off, even though we always explicitly specify a simulation to run.
  FileSystems.getDefault

  io.gatling.app.Gatling.main(args)
}

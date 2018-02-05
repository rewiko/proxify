#!/bin/bash -e

DEFAULT_JAVA_OPTS="-server"
DEFAULT_JAVA_OPTS="${DEFAULT_JAVA_OPTS} $GATLING_JAVA_OPTS"
DEFAULT_JAVA_OPTS="${DEFAULT_JAVA_OPTS} -Dlogger=console-json"
DEFAULT_JAVA_OPTS="${DEFAULT_JAVA_OPTS} -XX:+UseG1GC -XX:MaxGCPauseMillis=30 -XX:G1HeapRegionSize=2m -XX:InitiatingHeapOccupancyPercent=50 -XX:+ParallelRefProcEnabled"
DEFAULT_JAVA_OPTS="${DEFAULT_JAVA_OPTS} -XX:+PerfDisableSharedMem -XX:+AggressiveOpts -XX:+OptimizeStringConcat"
DEFAULT_JAVA_OPTS="${DEFAULT_JAVA_OPTS} -XX:+HeapDumpOnOutOfMemoryError"
DEFAULT_JAVA_OPTS="${DEFAULT_JAVA_OPTS} -Djava.net.preferIPv4Stack=true -Djava.net.preferIPv6Addresses=false"

java $DEFAULT_JAVA_OPTS -cp "/opt/gatling/conf/:/opt/gatling/lib/*" io.gatling.app.Gatling -m -bf /opt/gatling/user-files -s $SIMULATION_CLASS

#!/bin/bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

cd $DIR
#export UriTarget=http://localhost:1337
mkdir -p gatling-log
runningDate=$(date +%Y-%m-%d.%H:%M:%S)
echo "Running Load test - log gatling-log/gatling-log-${runningDate}"

./gradlew runGatling > gatling-log/gatling-log-${runningDate}
head -n 12 gatling-log/gatling-log-${runningDate}
tail -n 30 gatling-log/gatling-log-${runningDate}

while true; do sleep 2000; done

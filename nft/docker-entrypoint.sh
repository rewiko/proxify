#!/bin/bash -e

chmod 755 /src/buildArtefact.sh ;
sync;
/src/buildArtefact.sh

mkdir -p /opt/gatling/conf/
mkdir -p /opt/gatling/user-files/
mkdir -p /opt/gatling/lib/
sleep 1;
cp -r /src/build/classes/scala/main/* /opt/gatling/user-files/
cp -r /src/build/resources/main/* /opt/gatling/conf/
cp /src/build/libs/src-dependencies.jar /opt/gatling/lib/
cp /src/scripts/runGatlingTest.sh /opt/gatling/

function finish {
  echo "Sync folder before exiting"
  cp -r /results/* /src/build/results/
  sync;
  sleep 1;
}
trap finish EXIT

chmod 755 /src/scripts/runGatlingTest.sh
sync;
export UriTarget=${UriTarget:-http://localhost:1337}

counter=0
until [ "$(curl -s -o /dev/null -I -w '%{http_code}' $UriTarget)" != "000" ]; do
  if [ "$counter" -lt 1000 ]; then
    echo "Try again to reach the endpoint $UriTarget"
    sleep 1; echo $counter; counter=$(expr $counter + 1)
  else
    echo "Cannot reach the endpoint $UriTarget"
    exit 1
  fi
done

SIMULATION_CLASS=simulations.AuthSimulation /src/scripts/runGatlingTest.sh

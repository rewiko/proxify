#!/bin/bash -e

cd /src

rootDir="/data/"
MOCK_OPTS+=" --root-dir=$rootDir"

mkdir -p $rootDir
cp -r /src/src/main/resources/* $rootDir

echo "Starting mocks with options $MOCK_OPTS"

./gradlew build

java $JAVA_OPTS -jar /src/build/libs/mocks.jar $MOCK_OPTS

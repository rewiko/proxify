# Docker Compose Usage

## Starting
Building the image, which will use the artifacts generated from above:
```
docker-compose build
```

Launching the services in background based on services defined in docker-compose:

```
docker-compose up -d
```

Building images and lauching the services in background based on services defined in docker-compose:

```
docker-compose up -d --build
```

## Shutting down
The following command will stop and remove all the containers:
```
docker-compose down
```

The following command will stop and remove all the containers and delete all the images:
```
docker-compose down --rmi all
```

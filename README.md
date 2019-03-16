# Proxify

Proxify gives you the ability to proxy any application inside web application by using iframe and JWT token.

Uses case could be :
- exposing private application to specific users, by giving them access through the proxy
- building a api gateway to load your application on different website through iframe + JWT token

## Development

Start all components :
```
docker-compose -f docker-compose-vue.yml up --force-recreate
```

Web UI available on http://localhost:8086

API available on http://localhost:8087

Start only server components :
```
docker-compose -f docker-compose-node.yml up --force-recreate
```



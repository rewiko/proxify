# Backend App
## Express + Sequelize

## Starting App

```
cd ..
docker-compose -f docker-compose-node.yml up
```

**Without Migrations**

```
npm install
npm start
```

**With Migrations**

```
npm install
node_modules/.bin/sequelize db:migrate
npm start
```

## Running Tests

`make test` or `make jest`

# DEBUG node and express 
DEBUG=express* node server.js

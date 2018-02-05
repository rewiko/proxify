.PHONY: all format test build vet lint copy checkformat check clean

all : format check build
check : lint test

setup:
	@echo "== setup"

format :
	@echo "== format"
	@sync

build :
	@echo "== build"

clean :
	@echo "== clean"

checkformat :
	@echo "== check formatting"

lint :
	@echo "== lint"

node :
	@echo "== run node and docker associated"
	cd .. ; docker-compose -f docker-compose-node.yml up

test :
	@echo "== run tests"
	cd .. ; docker-compose -f docker-compose-node.yml exec node npm run test

jest :
	@echo "== run tests - jest"
	cd .. ; docker-compose -f docker-compose-node.yml exec node npm run jest


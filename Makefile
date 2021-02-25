APPS=
APP=.

up:
	docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d

restart:
	docker-compose -f docker-compose.yml -f docker-compose.dev.yml restart $(APPS)

rebuild:
	docker-compose -f docker-compose.yml -f docker-compose.dev.yml build --parallel --progress tty
	make up

reload:
	docker-compose -f docker-compose.yml -f docker-compose.dev.yml exec routing caddy reload -config /etc/caddy/Caddyfile

install:
	ls apps | grep ${APP} | xargs -P 4 -I {} sh -c 'cd apps/{}; npm install'

bash: 
	docker-compose -f docker-compose.yml -f docker-compose.dev.yml exec $(APP) bash

logs:
	docker-compose -f docker-compose.yml -f docker-compose.dev.yml logs -f --tail 10

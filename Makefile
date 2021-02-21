up:
	docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d

rebuild:
	docker-compose -f docker-compose.yml -f docker-compose.dev.yml build --parallel --progress tty
	make up

reload:
	docker-compose -f docker-compose.yml -f docker-compose.dev.yml exec routing caddy reload -config /etc/caddy/Caddyfile

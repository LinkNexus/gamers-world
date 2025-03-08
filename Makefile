base := docker exec -it gamersworld-php-1
symfony := docker compose exec php bin/console

test-file:
	@echo $(vars)

cache-clear:
	$(symfony) cache:clear

composer-install:
	$(base) composer install

fixtures-load:
	$(symfony) doctrine:fixtures:load

controller:
	$(symfony) make:controller

stimulus:
	$(symfony) make:stimulus-controller
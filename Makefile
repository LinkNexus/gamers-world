base = docker exec -it gamersworld-php-1 /bin/bash

de:
	$(base)

cache-clear:
	$(base) -c "bin/console cache:clear"

composer-install:
	$(base) -c "composer install"

fixtures-load:
	$(base) -c "bin/console doctrine:fixtures:load"

controller:
	$(base) -c "bin/console make:controller"

stimulus:
	$(base) -c "bin/console make:stimulus-controller"

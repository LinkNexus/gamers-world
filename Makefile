base = docker exec -it gamersworld-php-1 /bin/bash

de:
	$(base) -c '$(CMD)'

cache-clear:
	$(base) -c "bin/console cache:clear"
	exit

fixtures-load:
	symfony_command doctrine:fixtures:load

controller:
	symfony_command make:controller

stimulus:
	symfony_command make:stimulus-controller

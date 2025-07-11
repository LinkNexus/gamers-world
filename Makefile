base := docker compose exec php
symfony := docker compose exec php bin/console

cache-clear:
	$(symfony) cache:clear

composer-install: vendor/autoload.php
	$(base) composer install
	touch vendor/autoload.php

fixtures-load:
	$(symfony) doctrine:fixtures:load

controller:
	$(symfony) make:controller

stimulus:
	$(symfony) make:stimulus-controller

deploy:
	ansible-playbook -i tools/ansible/hosts.yml tools/ansible/playbook.yml -vvvv
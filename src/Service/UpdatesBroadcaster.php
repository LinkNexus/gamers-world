<?php

namespace App\Service;

use Symfony\Component\Mercure\HubInterface;

readonly final class UpdatesPublisher
{
    public function __construct(private readonly HubInterface $hub)
    {}

    public function publish(string $topic, $data): void
    {
        $this->hub->publish(
            new Update(
                $topic,
                $data
            )
        );
    }
}
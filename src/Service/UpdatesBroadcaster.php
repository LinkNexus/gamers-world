<?php

namespace App\Service;

use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Mercure\HubInterface;
use Symfony\Component\Mercure\Update;

readonly final class UpdatesBroadcaster
{
    public function __construct(private HubInterface $hub)
    {}

    /**
     * @param string|string[] $topics
     * @param string|null $data
     * @param callable|null $callback
     * @param mixed $responseData
     * @return JsonResponse
     */
    public function broadcast(
        string|array $topics,
        string $data = null,
        callable $callback = null,
        mixed $responseData = ['status' => 'ok']
    ): JsonResponse
    {
        $this->hub->publish(
            new Update(
                $topics,
                $data ?? $callback()
            )
        );

        return new JsonResponse($responseData);
    }
}
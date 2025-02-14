<?php

namespace App\Controller\Game;

use App\Service\UpdatesBroadcaster;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

final class PublishController extends AbstractController
{

    public function __construct(private readonly UpdatesBroadcaster $broadcaster)
    {}

    #[Route('/games/session/events/{identifier}', name: 'app_games_server_events', methods: ['POST'])]
    public function __invoke(
        Request $request,
        string $identifier
    ): JsonResponse
    {
        return $this->broadcaster->broadcast(
            [
                'http://localhost:5001/join/' . $identifier,
                'http://localhost:5001/players/synchronize/' . $identifier,
                'http://localhost:5001/players/is-ready/' . $identifier,
                'http://localhost:5001/players/disconnect/' . $identifier,
                'http://localhost:5001/play/' . $identifier,
            ],
            data: $request->getContent()
        );
    }
}

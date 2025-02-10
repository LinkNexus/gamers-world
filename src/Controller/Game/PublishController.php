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

    #[Route('/games/server/events', name: 'app_games_server_events', methods: ['POST'])]
    public function __invoke(Request $request): JsonResponse
    {
        return $this->broadcaster->broadcast(
            [
                'http://localhost:5001/join',
                'http://localhost:5001/players/synchronize',
                'http://localhost:5001/players/is-ready',
                'http://localhost:5001/players/disconnect',
                'http://localhost:5001/play'
            ],
            data: $request->getContent()
        );
    }
}

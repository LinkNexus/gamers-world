<?php

namespace App\Controller\Game;

use App\Service\UpdatesBroadcaster;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/games/server/events', name: 'app_games_server_events_', methods: ['POST'])]
final class PublishController extends AbstractController
{

    public function __construct(private readonly UpdatesBroadcaster $broadcaster)
    {}

    #[Route('/join', name: 'join')]
    public function notifyParticipation(Request $request): JsonResponse
    {
        return $this->broadcaster->broadcast(
            'http://localhost:5001/join',
            data: $request->getContent()
        );
    }

    #[Route('/players/synchronize', name: 'synchronize_players')]
    public function synchronizePlayers(Request $request): JsonResponse
    {
        return $this->broadcaster->broadcast(
            'http://localhost:5001/players/synchronize',
            data: $request->getContent()
        );
    }

    #[Route('/players/is-ready', name: 'is_ready')]
    public function notifyIsReady(Request $request): JsonResponse 
    {
        return $this->broadcaster->broadcast(
            'http://localhost:5001/players/is-ready',
            data: $request->getContent()
        );
    }
}

<?php

namespace App\Controller;

use App\Entity\Game;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bridge\Doctrine\Attribute\MapEntity;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/games', name: 'app_games')]
final class GamesController extends AbstractController
{

    public function __construct(private readonly EntityManagerInterface $entityManager)
    {}

    #[Route('/', name: '', methods: ['GET'])]
    public function index(): Response
    {
        $games = $this->entityManager->getRepository(Game::class)->findAll();
        return $this->render('app/games/index.html.twig', [
            'games' => $games,
        ]);
    }

    #[Route('/{slug}', name: '_game', methods: ['GET'])]
    public function game(
        #[MapEntity(mapping: ['slug' => 'slug'])]
        Game $game
    ): Response
    {
        return $this->render('app/games/game.html.twig', [
            'game' => $game,
        ]);
    }
}

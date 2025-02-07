<?php

namespace App\Controller\Game;

use App\Entity\Game;
use App\Enum\GameType;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bridge\Doctrine\Attribute\MapEntity;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/games', name: 'app_games')]
final class IndexController extends AbstractController
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

    #[Route('/{slug}/play/{type}', name: '_play', methods: ['GET'])]
    public function play(
        #[MapEntity(mapping: ['slug' => 'slug'])]
        Game $game,
        GameType $type = GameType::SOLO
    ): Response
    {
        return $this->render('app/games/play.html.twig', [
            'game' => $game->getSlug(),
            'type' => $type
        ]);
    }
}

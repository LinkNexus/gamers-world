<?php

namespace App\Controller\Game;

use App\Entity\Game;
use App\Entity\GameSession;
use App\Entity\User;
use App\Enum\Game\Type;
use App\Form\CreateGameSessionType;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bridge\Doctrine\Attribute\MapEntity;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\UX\Turbo\TurboBundle;

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

    #[Route('/{slug}', name: '_game', methods: ['GET', 'POST'], priority: -1)]
    public function game(
        #[MapEntity(mapping: ['slug' => 'slug'])]
        Game $game,
        Request $request
    ): Response
    {
        $session = (new GameSession())->setGame($game);
        $createGameForm = $this->createForm(CreateGameSessionType::class, $session);

        $createGameForm->handleRequest($request);

        if ($createGameForm->isSubmitted() && $createGameForm->isValid()) {
            $session->setInitiator($this->getUser());
            $this->entityManager->persist($session);
            $this->entityManager->flush();
            return $this->redirectToRoute('app_games_play', [
                'identifier' => $session->getIdentifier()
            ]);
        }

        return $this->render('app/games/game.html.twig', [
            'game' => $game,
            'gameForm' => $createGameForm,
        ]);
    }

    #[Route('/play/{identifier}', name: '_play', methods: ['GET'])]
    public function play(
        #[MapEntity(mapping: ['identifier' => 'identifier'])]
        GameSession $session
    ): Response
    {
        /** @var User $user */
        $user = $this->getUser();
        if ($session->getType() === Type::OPPONENT  && !$user) {
            $this->addFlash('error', 'You must be logged in to play a competitive game');
            return $this->redirectToRoute('app_index');
        }

        return $this->render('app/games/play.html.twig', [
            'session' => $session,
            'identifier' => $session->getIdentifier(),
        ]);
    }

    #[Route('/render', name: '_render', methods: ['GET'])]
    public function renderGames(): Response
    {
        return $this->render('app/games/render.html.twig', [
            'games' => $this->entityManager->getRepository(Game::class)->findAll(),
        ]);
    }
}

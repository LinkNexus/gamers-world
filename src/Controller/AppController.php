<?php

namespace App\Controller;

use App\Entity\Game;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

final class AppController extends AbstractController
{

    public function __construct(private readonly EntityManagerInterface $entityManager)
    {}

    #[Route('/', name: 'app_index')]
    public function index(): Response
    {
        $games = $this->entityManager->getRepository(Game::class)->findAll();
        return $this->render('app/index.html.twig', [
            'games' => $games,
        ]);
    }
}

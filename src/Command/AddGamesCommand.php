<?php

namespace App\Command;

use App\Entity\Game;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

#[AsCommand(
    name: 'app:add-games',
    description: 'Add the default games to the database',
)]
class AddGamesCommand extends Command
{
    public function __construct(private readonly EntityManagerInterface $entityManager)
    {
        parent::__construct();
    }

    protected function configure(): void
    {
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);

        $io->title('Add Games Command');
        $io->section('This command is designed to add default games to the database.');

        $games = [
            [
                "name" => "Chifoumi",
                "slug" => "chifoumi",
                "image" => "chifoumi.webp",
                "description" => "Chifoumi, also known as Rock, Paper, Scissors, is a classic hand game where players simultaneously form one of three shapes to determine a winner. Rock beats Scissors, Scissors beats Paper, and Paper beats Rock.",
                "icon" => "fa:hand-scissors-o"
            ],
            [
                "name" => "Memory Game",
                "slug" => "memory-game",
                "image" => "memory-game.png",
                "description" => "The Memory Game is a card-matching game where players flip over pairs of cards to find matching pairs. The goal is to collect the most pairs by remembering the positions of the cards.",
                "icon" => "mdi:brain"
            ],
            [
                "name" => "Tic Tac Toe",
                "slug" => "tic-tac-toe",
                "image" => "tictactoe.png",
                "description" => "Tic Tac Toe is a simple two-player game played on a 3x3 grid. Players take turns marking a square with their symbol (X or O) and the first to get three in a row wins.",
                "icon" => "tabler:tic-tac"
            ]
        ];

        foreach ($games as $gameData) {
            $game = new Game();
            $game->setName($gameData['name'])
                ->setSlug($gameData['slug'])
                ->setImage($gameData['image'])
                ->setDescription($gameData['description'])
                ->setIcon($gameData['icon']);

            $this->entityManager->persist($game);
            $io->success(sprintf('Game "%s" added successfully!', $game->getName()));
        }

        $this->entityManager->flush();
        $io->success('All games have been added to the database successfully!');

        return Command::SUCCESS;
    }
}

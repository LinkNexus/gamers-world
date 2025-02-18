<?php

namespace App\Service;

use Random\RandomException;

class AutomatedOpponent
{
    public function process(array $payload): array
    {
        if (!isset($payload['gameName'])) {
            throw new \Exception('Game name is required');
        }

        return match ($payload['gameName']) {
            'tic-tac-toe' => $this->playTicTacToe($payload),
            'memory-game' => $this->playMemoryGame($payload),
            'chifoumi' => $this->playChifoumi($payload),
            default => throw new \Exception('Game not supported')
        };
    }

    private function playTicTacToe(array $payload): array
    {
        $symbol = 'O';
        function randomIndex($payload): int
        {
            $index = random_int(0, 8);
            if ($payload['squares'][$index]) {
                return randomIndex($payload);
            }

            return $index;
        }

        $squares = $payload['squares'];
        $squares[randomIndex($payload)] = $symbol;
        $justPlayed = $symbol;

        return ['squares' => $squares, 'justPlayed' => $justPlayed];
    }

    private function playMemoryGame(array $payload): string
    {
        return 'Memory Game';
    }

    private function playChifoumi(array $payload): string
    {
        return 'Chifoumi';
    }
}
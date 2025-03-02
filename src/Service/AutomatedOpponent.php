<?php

namespace App\Service;

use App\Enum\Game\ChifoumiChoice;
use Random\RandomException;

final readonly class AutomatedOpponent
{
    /**
     * @param array $payload
     * @return array
     * @throws RandomException
     */
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

    /**
     * @param array $payload
     * @return array
     */
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

    /**
     * @param array $payload
     * @return array
     * @throws RandomException
     */
    private function playMemoryGame(array $payload): array
    {
        function randomValue($payload, ...$occupiedIndexes): int {
            $index = random_int(0, 15);
            if (in_array($index, $payload['history']) || in_array($index, $occupiedIndexes)) {
                return randomValue($payload);
            }
            return $index;
        }

        if ($payload["gameDifficulty"] == 1) {
            $cards = [randomValue($payload), randomValue($payload)];
            return [
                'cards' => $cards,
                'justPlayed' => 'computer'
            ];
        } else if ($payload["gameDifficulty"] == 2) {
            if (random_int(0, 10) < 5) {
                $index = randomValue($payload);
                $secondIndex = randomValue($payload, $index);

                if ($index == $secondIndex) {
                    dd('Not normal');
                }

                $cards[] = $index;
                $cards[] = $secondIndex;

                return [
                    'cards' => $cards,
                    'justPlayed' => 'computer'
                ];
            } else {
                $cardIndex = randomValue($payload);
                $allCards = $payload['cards'];
                $cards = [$cardIndex];

                array_walk($payload['cards'], function ($value, $index) use ($cardIndex, &$cards, $allCards) {
                    if ($value == $allCards[$cardIndex] && $index != $cardIndex) {
                        $cards[] = $index;
                    }
                });

                return ['cards' => $cards, 'justPlayed' => 'computer'];
            }
        } else {
            $cardIndex = randomValue($payload);
            $allCards = $payload['cards'];
            $cards = [$cardIndex];

            array_walk($payload['cards'], function ($value, $index) use ($cardIndex, &$cards, $allCards) {
                if ($value == $allCards[$cardIndex] && $index != $cardIndex) {
                    $cards[] = $index;
                }
            });

            return ['cards' => $cards, 'justPlayed' => 'computer'];
        }
    }

    /**
     * Processes the "Chifoumi" game logic and determines the computer's choice.
     *
     * Depending on the game difficulty, the function calculates the computer's move:
     * - On difficulty level 1, the choice is completely random.
     * - On difficulty level 2, the choice is primarily random but has a higher chance of being predictable.
     * - On higher difficulty levels, the choice counters the player's move.
     *
     * @param array $payload Contains information about the game's difficulty and the player's choice.
     *
     * @return array Returns an array containing the computer's choice and its player ID.
     * @throws RandomException
     */

    private function playChifoumi(array $payload): array
    {
        $opposites = [
            "ROCK" => "PAPER",
            "PAPER" => "SCISSORS",
            "SCISSORS" => "ROCK"
        ];

        if ($payload["gameDifficulty"] == 1) {
            $choice = ChifoumiChoice::fromInt(random_int(0, 2));
        } else if ($payload["gameDifficulty"] == 2) {
            if (random_int(0, 10) < 5) {
                $choice = ChifoumiChoice::fromInt(random_int(0, 2));
            } else {
                $choice = $opposites[$payload["choice"]];
            }
        } else {
            $choice = $opposites[$payload["choice"]];
        }

        return [
            'choice' => $choice,
            "playerId" => "computer"
        ];
    }
}
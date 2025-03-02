<?php

namespace App\Enum\Game;

enum ChifoumiChoice: string
{
    case ROCK = 'ROCK';
    case PAPER = 'PAPER';
    case SCISSORS = 'SCISSORS';

    public static function fromInt(int $value): self
    {
        return match ($value) {
            0 => self::ROCK,
            1 => self::PAPER,
            2 => self::SCISSORS,
            default => throw new \InvalidArgumentException('Invalid chifoumi choice')
        };
    }
}

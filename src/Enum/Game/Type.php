<?php

namespace App\Enum\Game;

enum Type: string
{
    case SOLO = 'solo';
    case COMPUTER = 'against-computer';
    case FRIEND = 'against-friend';
    case OPPONENT = 'against-opponent';

    public static function fromString (string $value) : self
    {
        return match ($value) {
            'solo' => self::SOLO,
            'against-computer' => self::COMPUTER,
            'against-friend' => self::FRIEND,
            'against-opponent' => self::OPPONENT,
            default => throw new \InvalidArgumentException('Invalid game type')
        };
    }

    public function getDescription (): string {
        return match ($this) {
            self::SOLO => 'Train yourself and improve your skills by playing alone',
            self::COMPUTER => 'Play solo against the computer to test your skills',
            self::FRIEND => 'Have fun playing against a friend of yours',
            self::OPPONENT => 'Be competitive and play against a random player on the server',
        };
    }
}

<?php

namespace App\Enum;

enum GameType: string
{
    case SOLO = 'solo';
    case COMPUTER = 'against-computer';
    case FRIEND = 'against-friend';
    case OPPONENT = 'against-opponent';
}

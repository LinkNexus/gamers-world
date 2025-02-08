export enum GameType {
    SOLO = 'SOLO',
    COMPUTER = 'against-computer',
    OPPONENT = 'against-opponent',
    FRIEND = 'against-friend'
}

export enum PlayerStatus {
    WAITING = 'WAITING',
    FOUND_OPPONENT = 'FOUND_OPPONENT',
    READY = 'READY',
    HIS_TURN = 'PLAYING',
    OPPONENT_TURN = 'WAITING_FOR_OPPONENT',
    FINISHED = 'FINISHED',
    DISCONNECTED = 'DISCONNECTED'
}

export enum GameOutcome {
    WIN = 'WIN',
    LOSE = 'LOSE',
    DRAW = 'DRAW'
}

export enum GameName {
    TIC_TAC_TOE = 'tic-tac-toe',
    CHIFOUMI = 'chifoumi'
} 
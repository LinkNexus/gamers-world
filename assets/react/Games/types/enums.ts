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
    PLAYING = 'PLAYING',
    DISCONNECTED = 'DISCONNECTED',
    WON = 'WON',
    LOST = 'LOST',
    DREW = 'DREW'
}

export enum GameName {
    TIC_TAC_TOE = 'tic-tac-toe',
    CHIFOUMI = 'chifoumi'
} 

export type TicTacToeSymbol = 'X' | 'O' | null;

export enum GameEvent {
    JOIN = 'JOIN',
    SYNCHRONIZE = 'SYNCHRONIZE',
    IS_READY = 'IS_READY',
    DISCONNECT = 'DISCONNECT',
    PLAY = 'PLAY',
}

export enum TimerStatus {
    RUNNING = 'RUNNING',
    STOPPED = 'STOPPED',
    PAUSED = 'PAUSED'
}
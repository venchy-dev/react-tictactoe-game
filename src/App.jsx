import { useState, memo, useRef, useEffect } from "react";

/* =========================
   Square Component
========================= */
const Square = memo(function Square({ value, isWinning, isLast, onClick }) {
    return (
        <button
            className={`cell 
                ${value === "X" ? "x" : ""}
                ${value === "O" ? "o" : ""}
                ${isWinning ? "win" : ""}
                ${isLast ? "last" : ""}
            `}
            onClick={onClick}
        >
            {value}
        </button>
    );
});

/* =========================
   Winner Checker
========================= */
function calculateWinner(squares) {
    const lines = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6],
    ];

    for (const [a, b, c] of lines) {
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return { winner: squares[a], line: [a, b, c] };
        }
    }
    return null;
}

/* =========================
   Board
========================= */
function Board({ squares, isXTurn, lastMove, onPlay, onReset }) {
    const result      = calculateWinner(squares);
    const winner      = result?.winner;
    const winningLine = result?.line || [];

    const isDraw = !winner && squares.every(Boolean);

    function handleClick(index) {
        if (squares[index] || winner) return;

        const nextSquares = squares.slice();
        nextSquares[index] = isXTurn ? "X" : "O";

        onPlay(nextSquares, index);
    }

    let status;
    if (winner) status = `🏆 Player ${winner} Wins!`;
    else if (isDraw) status = "🤝 Draw!";
    else status = `Player ${isXTurn ? "X" : "O"} Turn`;

    return (
        <div className="game-wrapper">
            <div className="game-container">
                <h1>
                    <span className="title-1">TicTacToe</span>{" "}
                    <span className="title-2">Game</span>
                </h1>

                <p className="status">{status}</p>

                <div className={`board ${winner ? "disabled" : ""}`}>
                    {squares.map((value, index) => (
                        <Square
                            key={index}
                            value={value}
                            isWinning={winningLine.includes(index)}
                            isLast={index === lastMove}
                            onClick={() => handleClick(index)}
                        />
                    ))}
                </div>

                <button className="reset-btn" onClick={onReset}>
                    Reset Game
                </button>
            </div>
        </div>
    );
}

/* =========================
   App
========================= */
export default function App() {
    const [history, setHistory] = useState([
        {
            squares: Array(9).fill(null),
            lastMove: null,
            player: null,
        },
    ]);

    const [currentMove, setCurrentMove] = useState(0);
    const activeRef = useRef(null);

    const currentSquares = history[currentMove].squares;
    const isXTurn = currentMove % 2 === 0;

    function handlePlay(nextSquares, index) {
        const player = isXTurn ? "X" : "O";

        const nextHistory = [
            ...history.slice(0, currentMove + 1),
            {
                squares: nextSquares,
                lastMove: index,
                player,
            },
        ];

        setHistory(nextHistory);
        setCurrentMove(nextHistory.length - 1);
    }

    function jumpTo(move) {
        setCurrentMove(move);
    }

    function resetGame() {
        setHistory([
            {
                squares: Array(9).fill(null),
                lastMove: null,
                player: null,
            },
        ]);
        setCurrentMove(0);
    }

    /* =========================
       AUTO SCROLL HISTORY
    ========================= */
    useEffect(() => {
        if (activeRef.current) {
            activeRef.current.scrollIntoView({
                behavior: "smooth",
                block: "nearest",
            });
        }
    }, [currentMove]);

    return (
        <>
            <div className="animated-bg"></div>

            <div className="app">
                <div className="game">
                    <Board
                        squares={currentSquares}
                        isXTurn={isXTurn}
                        lastMove={history[currentMove].lastMove}
                        onPlay={handlePlay}
                        onReset={resetGame}
                    />
                </div>

                <div className="game-info">
                    <h2 className="history-title">History</h2>

                    <div className="history-list">
                        {history.map((step, move) => {
                            const isActive = move === currentMove;

                            if (move === 0) {
                                return (
                                    <button
                                        key={move}
                                        ref={isActive ? activeRef : null}
                                        onClick={() => jumpTo(move)}
                                        className={`history-item ${isActive ? "active" : ""}`}
                                    >
                                        <span className="history-player">↺</span>
                                        <span className="history-text">Game Start</span>
                                    </button>
                                );
                            }

                            const row = Math.floor(step.lastMove / 3) + 1;
                            const col = (step.lastMove % 3) + 1;

                            return (
                                <button
                                    key={move}
                                    ref={isActive ? activeRef : null}
                                    onClick={() => jumpTo(move)}
                                    className={`history-item ${isActive ? "active" : ""}`}
                                >
                                    <span className={`history-player ${step.player.toLowerCase()}`}>
                                        {step.player}
                                    </span>

                                    <span className="history-text">
                                        Move #{move} ({step.player} at Row {row}, Col {col})
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </>
    );
}

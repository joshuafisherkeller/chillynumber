
import React, { useState, useRef, useEffect } from 'react';

const App: React.FC = () => {
    const [displayNumber, setDisplayNumber] = useState<number | string>('--');
    const [isSpinning, setIsSpinning] = useState(false);
    const [showResetUI, setShowResetUI] = useState(false);
    const intervalRef = useRef<number | null>(null);
    const resultTimeoutRef = useRef<number | null>(null);

    const clearRunningTimers = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
        if (resultTimeoutRef.current) {
            clearTimeout(resultTimeoutRef.current);
            resultTimeoutRef.current = null;
        }
    };

    const handleGetNumber = () => {
        if (isSpinning) return;

        setShowResetUI(false);
        clearRunningTimers();
        setIsSpinning(true);

        // Start the rapid spinning of random numbers
        intervalRef.current = window.setInterval(() => {
            const randomNumber = Math.floor(Math.random() * 1000);
            setDisplayNumber(randomNumber);
        }, 60);

        // After 5 seconds, stop the rapid spinning
        setTimeout(() => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }

            const showTeaser = Math.random() > 0.4;

            const finaliseNumber = () => {
                setDisplayNumber(47);
                setIsSpinning(false);
                // After showing 47, wait 3 seconds then change UI
                resultTimeoutRef.current = window.setTimeout(() => {
                    setShowResetUI(true);
                }, 3000);
            };

            if (showTeaser) {
                setDisplayNumber(46);
                // If we showed 46, wait 1 second before revealing the final number
                setTimeout(finaliseNumber, 1000);
            } else {
                finaliseNumber();
            }
        }, 5000);
    };

    // Cleanup effect to clear timers if component unmounts
    useEffect(() => {
        return () => {
            clearRunningTimers();
        };
    }, []);

    const renderCircleContent = () => {
        if (showResetUI) {
            return (
                <span className="text-3xl sm:text-4xl text-center font-semibold px-4">
                    Get Your Lucky Number!
                </span>
            );
        }
        return (
            <span 
                className={`
                    font-mono font-black transition-all duration-200
                    ${isSpinning 
                        ? 'text-7xl sm:text-8xl md:text-9xl text-blue-300 blur-[2px] opacity-90' 
                        : 'text-8xl sm:text-9xl md:[10rem] text-white'
                    }
                `}
            >
                {displayNumber}
            </span>
        );
    };

    return (
        <div className="bg-gradient-to-br from-blue-700 to-blue-900 text-white min-h-screen flex flex-col items-center justify-between p-4 sm:p-8 font-sans">
            <header className="w-full text-center py-4">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-wider text-shadow-lg">
                    Chilly E's Lucky Number Generator
                </h1>
            </header>

            <main className="flex-grow flex items-center justify-center w-full">
                <div 
                    onClick={showResetUI ? handleGetNumber : undefined}
                    aria-label={showResetUI ? "Get Your Lucky Number!" : "Number Display"}
                    role={showResetUI ? "button" : "status"}
                    className={`
                        w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 
                        flex items-center justify-center text-center
                        rounded-full transition-all duration-500
                        ${isSpinning 
                            ? 'bg-blue-900/50 shadow-2xl shadow-blue-500/50' 
                            : 'bg-blue-800/30 shadow-lg shadow-black/30'
                        }
                        ${showResetUI ? 'cursor-pointer hover:bg-blue-900/70 hover:scale-105 active:scale-100' : ''}
                    `}
                >
                    {renderCircleContent()}
                </div>
            </main>

            {!showResetUI && (
                <footer className="w-full text-center py-4 min-h-[92px]">
                    <button
                        onClick={handleGetNumber}
                        disabled={isSpinning}
                        className={`
                            px-8 py-4 sm:px-12 sm:py-5 
                            text-xl sm:text-2xl font-semibold text-blue-800 bg-white 
                            rounded-full shadow-lg transform transition-all duration-300 ease-in-out
                            hover:bg-blue-100 hover:scale-105 hover:shadow-2xl
                            focus:outline-none focus:ring-4 focus:ring-blue-300
                            disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 disabled:shadow-lg
                        `}
                    >
                        {isSpinning ? 'Spinning...' : 'Get Your Lucky Number!'}
                    </button>
                </footer>
            )}
        </div>
    );
};

export default App;

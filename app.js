// Global variables to avoid scope issues
const { useState, useEffect, useMemo, useRef } = React;

// --- Utils ---
function generateId() { return Math.random().toString(36).substr(2, 9); }
function getLocalStorage(key, initial) {
    try {
        const item = window.localStorage.getItem(key);
        return item ? JSON.parse(item) : initial;
    } catch (error) {
        console.error(error);
        return initial;
    }
}
function setLocalStorage(key, value) {
    try {
        window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.error(error);
    }
}

// --- Common Components ---
function BroadcastOverlay({ messages }) {
    const [currentMsg, setCurrentMsg] = useState(null);

    useEffect(() => {
        if (!messages || messages.length === 0) return;
        const lastMsg = messages[messages.length - 1];

        // If we're already showing this message, do nothing
        if (currentMsg && currentMsg.id === lastMsg.id) return;

        // Check timestamp - only show if sent within last 10 seconds
        // This prevents old messages from popping up on page reload
        const now = Date.now();
        if (now - lastMsg.timestamp < 10000) {
            setCurrentMsg(lastMsg);
            // Auto hide after 8 seconds
            const timer = setTimeout(() => setCurrentMsg(null), 8000);
            return () => clearTimeout(timer);
        }
    }, [messages]);

    if (!currentMsg) return null;

    let title = "BROADCAST";
    if (currentMsg.targets && !currentMsg.targets.includes('all')) {
        title = `MESSAGE FOR: ${currentMsg.targetNames ? currentMsg.targetNames.join(', ') : 'YOU'}`;
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
            <div className="bg-black/95 border-4 border-neon-pink p-8 max-w-2xl text-center pointer-events-auto animate-in zoom-in duration-300 shadow-[0_0_50px_rgba(255,0,128,0.5)] flex flex-col items-center gap-6">
                <h2 className="text-3xl font-pixel text-yellow-400 animate-pulse border-b-4 border-yellow-400 pb-2 px-8">{title}</h2>
                <p className="text-white text-4xl font-pixel leading-relaxed">{currentMsg.text}</p>
                <button
                    onClick={() => setCurrentMsg(null)}
                    className="bg-retro-accent text-white font-pixel text-xl px-8 py-4 border-4 border-white hover:bg-white hover:text-black hover:scale-105 active:scale-95 transition-all shadow-pixel"
                >
                    OK (CLOSE)
                </button>
            </div>
        </div>
    );
}

// --- Icons ---
const Icons = {
    Trophy: (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" /><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" /><path d="M4 22h16" /><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" /><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" /><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" /></svg>,
    Calendar: (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" /></svg>,
    ClipboardList: (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect width="8" height="4" x="8" y="2" rx="1" ry="1" /><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" /><path d="M12 11h4" /><path d="M12 16h4" /><path d="M8 11h.01" /><path d="M8 16h.01" /></svg>,
    Clock: (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>,
    User: (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>,
    Users: (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>,
    Radio: (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9" /><path d="M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5" /><circle cx="12" cy="12" r="2" /><path d="M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5" /><path d="M19.1 4.9C23 8.8 23 15.1 19.1 19" /></svg>,
};

// --- Common Components ---
function PixelCard({ children, className = "", title }) {
    return (
        <div className={`bg-retro-card border-4 border-retro-text relative p-4 shadow-pixel ${className}`}>
            {title && (
                <div className="absolute -top-5 left-4 bg-retro-accent text-white px-2 py-1 font-pixel text-xs border-2 border-retro-text shadow-pixel-sm z-10">
                    {title}
                </div>
            )}
            {children}
        </div>
    );
}

function Button({ children, onClick, variant = "primary", className = "", disabled = false }) {
    const colors = {
        primary: "bg-retro-accent text-white border-white active:bg-red-700",
        secondary: "bg-retro-text text-white border-gray-400 active:bg-blue-900",
        success: "bg-neon-green text-black border-white active:bg-green-600",
        danger: "bg-red-600 text-white border-white active:bg-red-800",
        outline: "bg-transparent text-neon-cyan border-neon-cyan active:bg-neon-cyan active:text-black",
    };
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`font-pixel text-xs px-4 py-3 border-2 shadow-pixel pixel-btn ${colors[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
        >
            {children}
        </button>
    );
}

function Input({ label, value, onChange, type = "text", placeholder }) {
    return (
        <div className="flex flex-col gap-2 mb-4">
            {label && <label className="font-pixel text-xs text-neon-cyan">{label}</label>}
            <input
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="bg-gray-900 border-2 border-retro-text p-2 font-mono text-white focus:outline-none focus:border-neon-pink shadow-pixel-sm w-full"
            />
        </div>
    );
}

// --- Feature Components ---

function CountdownDisplay({ targetTime }) {
    const [timeLeft, setTimeLeft] = useState(0);

    useEffect(() => {
        if (!targetTime) return;
        const interval = setInterval(() => {
            const now = Date.now();
            const diff = Math.max(0, Math.floor((targetTime - now) / 1000));
            setTimeLeft(diff);
            if (diff <= 0) clearInterval(interval);
        }, 1000);
        return () => clearInterval(interval);
    }, [targetTime]);

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    if (!targetTime || timeLeft <= 0) {
        return <div className="text-4xl font-pixel text-gray-600 animate-pulse">00:00</div>;
    }

    return (
        <div className={`text-6xl font-pixel ${timeLeft < 60 ? 'text-red-500 animate-pulse-fast' : 'text-neon-green'}`}>
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </div>
    );
}

function BracketView({ matches, players }) {
    const getPlayerName = (id) => players.find(p => p.id === id)?.name || "Bye";

    const rounds = matches.reduce((acc, match) => {
        const round = match.round || 1;
        if (!acc[round]) acc[round] = [];
        acc[round].push(match);
        return acc;
    }, {});

    if (Object.keys(rounds).length === 0) {
        return <div className="text-center font-pixel text-gray-500 py-10">NO MATCHES</div>;
    }

    return (
        <div className="flex flex-nowrap gap-8 overflow-x-auto p-4 pb-8 items-start h-full">
            {Object.keys(rounds).map((roundNum) => (
                <div key={roundNum} className="flex-shrink-0 w-64 flex flex-col gap-4">
                    <h3 className="text-center font-pixel text-neon-cyan mb-2 border-b-2 border-neon-cyan pb-1">ROUND {roundNum}</h3>
                    {rounds[roundNum].map(match => (
                        <div key={match.id} className={`bg-gray-900 border-2 ${match.status === 'completed' ? 'border-neon-green' : 'border-gray-600'} p-2 relative`}>
                            <div className="flex justify-between items-center bg-black/50 p-1 mb-2">
                                <span className="text-[10px] text-gray-400 font-mono">#{match.id.substr(0, 4)}</span>
                                {match.status === 'completed' && <span className="text-[10px] text-neon-green">DONE</span>}
                            </div>
                            <div className={`flex justify-between items-center p-1 ${match.winnerId && match.winnerId === match.p1_id ? 'bg-green-900/40 text-neon-green' : ''}`}>
                                <span className="font-pixel text-xs truncate max-w-[100px]">{getPlayerName(match.p1_id)}</span>
                                <span className="font-mono font-bold text-neon-pink">{match.score_p1 || 0}</span>
                            </div>
                            <div className="border-t border-gray-700 my-1"></div>
                            <div className={`flex justify-between items-center p-1 ${match.winnerId && match.winnerId === match.p2_id ? 'bg-green-900/40 text-neon-green' : ''}`}>
                                <span className="font-pixel text-xs truncate max-w-[100px]">{getPlayerName(match.p2_id)}</span>
                                <span className="font-mono font-bold text-neon-pink">{match.score_p2 || 0}</span>
                            </div>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
}

function PlayerScoreRow({ player, onUpdate }) {
    const [isAdd, setIsAdd] = useState(true);
    const [mode, setMode] = useState('slider'); // 'slider' | 'text'
    const [sliderVal, setSliderVal] = useState(10);
    const [textVal, setTextVal] = useState('');

    const handleConfirm = () => {
        const val = mode === 'slider' ? sliderVal : parseInt(textVal);
        if ((!val && val !== 0) || isNaN(val)) return;

        onUpdate(player.id, isAdd ? val : -val);

        // Reset text, keep slider
        setTextVal('');
    };

    return (
        <div className="bg-gray-800 border border-gray-600 p-2 flex flex-col gap-2 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 p-1 opacity-10 font-pixel text-[40px] leading-none pointer-events-none text-white">
                {isAdd ? '+' : '-'}
            </div>

            <div className="flex justify-between items-center z-10">
                <span className="font-pixel text-xs text-neon-cyan truncate max-w-[150px]">{player.name}</span>
                <span className="font-mono text-neon-pink text-sm">{player.score} pts</span>
            </div>

            <div className="flex flex-col gap-2 z-10">
                {/* Control Row: +/- and Mode Switch */}
                <div className="flex gap-2 h-8">
                    <div className="flex border border-gray-500 rounded overflow-hidden shrink-0">
                        <button
                            onClick={() => setIsAdd(true)}
                            className={`px-3 font-bold flex items-center justify-center transition-colors ${isAdd ? 'bg-neon-green text-black' : 'bg-gray-900 text-gray-500'}`}
                        >+</button>
                        <button
                            onClick={() => setIsAdd(false)}
                            className={`px-3 font-bold flex items-center justify-center transition-colors ${!isAdd ? 'bg-red-500 text-white' : 'bg-gray-900 text-gray-500'}`}
                        >-</button>
                    </div>

                    <div className="flex flex-1 border border-gray-500 rounded overflow-hidden">
                        <button
                            onClick={() => setMode('slider')}
                            className={`flex-1 text-[10px] font-pixel flex items-center justify-center gap-1 ${mode === 'slider' ? 'bg-retro-text text-white' : 'bg-gray-900 text-gray-500'}`}
                        >
                            SLIDER
                        </button>
                        <button
                            onClick={() => setMode('text')}
                            className={`flex-1 text-[10px] font-pixel flex items-center justify-center gap-1 ${mode === 'text' ? 'bg-retro-text text-white' : 'bg-gray-900 text-gray-500'}`}
                        >
                            KEYBOARD
                        </button>
                    </div>
                </div>

                {/* Input Area */}
                <div className="bg-black/40 border border-gray-600 rounded p-2 h-12 flex items-center justify-center">
                    {mode === 'slider' ? (
                        <div className="w-full flex items-center gap-3">
                            <input
                                type="range"
                                min="0" max="100" step="5"
                                value={sliderVal}
                                onChange={(e) => setSliderVal(parseInt(e.target.value))}
                                className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-neon-pink"
                            />
                            <span className="font-mono text-white w-8 text-right font-bold">{sliderVal}</span>
                        </div>
                    ) : (
                        <input
                            type="number"
                            value={textVal}
                            onChange={(e) => setTextVal(e.target.value)}
                            className="w-full bg-transparent text-white font-mono text-center text-lg outline-none placeholder-gray-700"
                            placeholder="Enter value..."
                            onKeyDown={(e) => e.key === 'Enter' && handleConfirm()}
                            autoFocus
                        />
                    )}
                </div>

                {/* Submit */}
                <button
                    onClick={handleConfirm}
                    className={`w-full py-1 font-pixel text-xs border text-white shadow-pixel-sm active:translate-y-0.5 active:shadow-none transition-all ${isAdd ? 'bg-green-700 border-green-400 hover:bg-green-600' : 'bg-red-900 border-red-500 hover:bg-red-800'}`}
                >
                    CONFIRM {isAdd ? '+' : '-'}{mode === 'slider' ? sliderVal : (textVal || '0')}
                </button>
            </div>
        </div>
    );
}

function ContestantScreen({ players, matches, timerStats, onBack, messages }) {
    const [tab, setTab] = useState('timer'); // timer, bracket, rank

    return (
        <div className="flex flex-col h-full">
            <BroadcastOverlay messages={messages} />
            <div className="p-2 border-b-4 border-retro-text flex justify-between items-center bg-gray-900">
                <button onClick={onBack} className="text-xs text-gray-400 hover:text-white px-2">&lt; EXIT</button>
                <span className="font-pixel text-xs text-neon-pink">PLAYER VIEW</span>
            </div>

            <div className="flex-1 overflow-hidden relative">
                {tab === 'timer' && (
                    <div className="h-full flex flex-col justify-center items-center p-8 text-center bg-retro-bg">
                        <h1 className="text-2xl font-pixel text-white mb-8"> MATCH TIME</h1>
                        <CountdownDisplay targetTime={timerStats?.targetTime} />

                    </div>
                )}
                {tab === 'bracket' && (
                    <div className="h-full bg-retro-bg">
                        <BracketView matches={matches} players={players} />
                    </div>
                )}
                {tab === 'rank' && (
                    <div className="h-full bg-retro-bg p-2 overflow-y-auto">
                        <h2 className="text-center font-pixel text-neon-green py-4 text-xl">LEADERBOARD</h2>
                        {players.sort((a, b) => b.score - a.score).map((p, i) => (
                            <div key={p.id} className="mb-2 bg-gray-800 border-2 border-retro-text p-3 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <span className={`font-pixel text-lg w-8 text-center ${i < 3 ? 'text-yellow-400' : 'text-gray-500'}`}>{i + 1}</span>
                                    <span className="font-pixel text-sm text-neon-cyan">{p.name}</span>
                                </div>
                                <span className="font-pixel text-xl text-neon-pink">{p.score}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="bg-black border-t-4 border-retro-text grid grid-cols-3 p-2 gap-2">
                <button onClick={() => setTab('timer')} className={`p-3 font-pixel text-[10px] flex flex-col items-center border-2 ${tab === 'timer' ? 'bg-retro-accent border-white text-white' : 'border-gray-800 text-gray-500'}`}>
                    <Icons.Clock size={20} className="mb-1" /> TIME
                </button>
                <button onClick={() => setTab('bracket')} className={`p-3 font-pixel text-[10px] flex flex-col items-center border-2 ${tab === 'bracket' ? 'bg-retro-accent border-white text-white' : 'border-gray-800 text-gray-500'}`}>
                    <Icons.Calendar size={20} className="mb-1" /> BRACKET
                </button>
                <button onClick={() => setTab('rank')} className={`p-3 font-pixel text-[10px] flex flex-col items-center border-2 ${tab === 'rank' ? 'bg-retro-accent border-white text-white' : 'border-gray-800 text-gray-500'}`}>
                    <Icons.Trophy size={20} className="mb-1" /> RANK
                </button>
            </div>
        </div>
    );
}

function ScorerScreen({ players, matches, setPlayers, setMatches, timerStats, setTimerStats, onBack, setToast, onSendMessage }) {
    const [tab, setTab] = useState('manage'); // manage, timer, people, broadcast
    const [minutesInput, setMinutesInput] = useState(10);
    const [scoreState, setScoreState] = useState({ matchId: '', p1: '', p2: '', mode: 'individual' });
    // Broadcast State
    const [broadcastMsg, setBroadcastMsg] = useState('');
    const [broadcastTarget, setBroadcastTarget] = useState('all'); // 'all' or 'select'
    const [selectedPlayers, setSelectedPlayers] = useState([]);

    const handleSendBroadcast = () => {
        if (!broadcastMsg.trim()) return;

        const targets = broadcastTarget === 'all' ? ['all'] : selectedPlayers;
        if (broadcastTarget === 'select' && selectedPlayers.length === 0) {
            setToast({ message: "Select at least one player!", type: "error" });
            return;
        }

        // Get names for display
        const targetNames = broadcastTarget === 'all'
            ? ['ALL']
            : players.filter(p => selectedPlayers.includes(p.id)).map(p => p.name);

        onSendMessage(broadcastMsg, targets, targetNames);
        setBroadcastMsg('');
        setToast({ message: "Message Broadcasted!", type: "success" });
    };

    const [newPlayerName, setNewPlayerName] = useState("");

    const updateIndividualScore = (playerId, delta) => {
        const newMatch = {
            id: generateId(),
            p1_id: playerId,
            p2_id: null,
            score_p1: delta,
            score_p2: 0,
            winnerId: delta > 0 ? playerId : null,
            status: 'completed',
            type: 'manual',
            timestamp: Date.now(),
            round: 'M'
        };
        const updatedMatches = [...matches, newMatch];

        // Recalculate Stats (Shared Logic with updateScore)
        const newPlayerStats = players.map(p => ({ ...p, score: 0, wins: 0, losses: 0 }));
        updatedMatches.forEach(m => {
            if (m.status === 'completed') {
                const p1 = newPlayerStats.find(p => p.id === m.p1_id);
                // p2 might be null for manual entries
                const p2 = m.p2_id ? newPlayerStats.find(p => p.id === m.p2_id) : null;

                if (p1) p1.score += (m.score_p1 || 0);
                if (p2) p2.score += (m.score_p2 || 0);

                if (m.winnerId && m.type !== 'manual') { // Only count W/L for real matches? Or manual too? Let's exclude manual from W/L stats for now.
                    const winner = newPlayerStats.find(p => p.id === m.winnerId);
                    const loser = newPlayerStats.find(p => p.id === (m.winnerId === m.p1_id ? m.p2_id : m.p1_id));
                    if (winner) winner.wins++;
                    if (loser) loser.losses++;
                }
            }
        });

        setMatches(updatedMatches);
        setPlayers(newPlayerStats);
        setToast({ message: `Points ${delta > 0 ? '+' : ''}${delta} Added!`, type: "success" });
    };
    const [tournamentType, setTournamentType] = useState("1V1"); // 1V1, SWISS, GROUP

    // Timer Logic
    const startTimer = () => {
        const target = Date.now() + (minutesInput * 60 * 1000);
        setTimerStats({ targetTime: target, isRunning: true });
        setToast({ message: "Timer Started!", type: "success" });
    };

    const stopTimer = () => {
        setTimerStats({ targetTime: null, isRunning: false });
        setToast({ message: "Timer Stopped!", type: "error" });
    };

    // Scheduling Logic
    const generateSchedule = () => {
        if (players.length < 2) {
            setToast({ message: "Need at least 2 players!", type: "error" });
            return;
        }

        if (!confirm(`Generate ${tournamentType} schedule? Existing matches will be CLEARED.`)) return;

        const newMatches = [];
        let timestamp = Date.now();
        const shuffled = [...players].sort(() => 0.5 - Math.random());

        // --- 1V1 Single Elimination Logic ---
        if (tournamentType === "1V1") {
            // Simple pairing for Round 1
            for (let i = 0; i < shuffled.length; i += 2) {
                if (i + 1 < shuffled.length) {
                    newMatches.push(createMatch(shuffled[i].id, shuffled[i + 1].id, 1, timestamp++));
                } else {
                    // Bye logic (auto-win or wait) - for MVP skipping bye visual
                }
            }

        }
        // --- Swiss Logic ---
        else if (tournamentType === "SWISS") {
            // Pair High vs High based on current score
            // First round is random (already shuffled)
            // Subsequent rounds would require filtering out repeats (complex for single file MVP)
            // For Round 1 generation, it's same as 1V1 random pairing
            for (let i = 0; i < shuffled.length; i += 2) {
                if (i + 1 < shuffled.length) {
                    newMatches.push(createMatch(shuffled[i].id, shuffled[i + 1].id, 1, timestamp++));
                }
            }
        }
        // --- Group Logic (Round Robin) ---
        else if (tournamentType === "GROUP") {
            // Everyone plays everyone
            // Round Robin Algorithm (Polygon Method)
            const n = shuffled.length;
            const map = shuffled.map(p => p.id);
            if (n % 2 === 1) map.push(null); // dummy for odd number

            const numPlayers = map.length;
            const numRounds = numPlayers - 1;
            const half = numPlayers / 2;

            for (let round = 1; round <= numRounds; round++) {
                for (let i = 0; i < half; i++) {
                    const p1 = map[i];
                    const p2 = map[numPlayers - 1 - i];
                    if (p1 && p2) {
                        newMatches.push(createMatch(p1, p2, round, timestamp++));
                    }
                }
                // Rotate array (keep index 0 fixed)
                map.splice(1, 0, map.pop());
            }
        }

        setMatches(newMatches);
        setToast({ message: `${tournamentType} Schedule Generated! Matches: ${newMatches.length}`, type: "success" });
    };

    const createMatch = (p1, p2, round, ts) => ({
        id: generateId(), p1_id: p1, p2_id: p2, score_p1: 0, score_p2: 0, winnerId: null, status: 'pending', timestamp: ts, round: round
    });

    const updateScore = () => {
        if (!scoreState.matchId) return;
        const match = matches.find(m => m.id === scoreState.matchId);
        const s1 = parseInt(scoreState.p1) || 0;
        const s2 = parseInt(scoreState.p2) || 0;

        let winnerId = null;
        if (s1 > s2) winnerId = match.p1_id;
        else if (s2 > s1) winnerId = match.p2_id;

        const updatedMatches = matches.map(m =>
            m.id === scoreState.matchId
                ? { ...m, score_p1: s1, score_p2: s2, winnerId, status: 'completed' }
                : m
        );

        // Recalculate Stats
        const newPlayerStats = players.map(p => ({ ...p, score: 0, wins: 0, losses: 0 }));
        updatedMatches.forEach(m => {
            if (m.status === 'completed') {
                const p1 = newPlayerStats.find(p => p.id === m.p1_id);
                const p2 = newPlayerStats.find(p => p.id === m.p2_id);
                if (p1) p1.score += m.score_p1;
                if (p2) p2.score += m.score_p2;
                if (m.winnerId) {
                    const winner = newPlayerStats.find(p => p.id === m.winnerId);
                    const loser = newPlayerStats.find(p => p.id === (m.winnerId === m.p1_id ? m.p2_id : m.p1_id));
                    if (winner) winner.wins++;
                    if (loser) loser.losses++;
                }
            }
        });

        setMatches(updatedMatches);
        setPlayers(newPlayerStats);
        setScoreState({ matchId: '', p1: '', p2: '' });
        setToast({ message: "Score Updated!", type: "success" });
    };

    const addPlayer = () => {
        if (!newPlayerName.trim()) return;
        setPlayers([...players, { id: generateId(), name: newPlayerName, score: 0, wins: 0, losses: 0 }]);
        setNewPlayerName("");
        setToast({ message: "Player Added", type: "success" });
    };

    return (
        <div className="flex flex-col h-full bg-gray-900 border-x-4 border-retro-text">
            <div className="p-2 border-b-4 border-retro-text flex justify-between items-center bg-gray-800">
                <button onClick={onBack} className="text-xs text-gray-400 hover:text-white px-2">&lt; EXIT</button>
                <span className="font-pixel text-xs text-yellow-400">SCORER ADMIN</span>
            </div>

            <div className="flex-1 overflow-y-auto p-4 reltive">
                {tab === 'timer' && (
                    <div className="space-y-6">
                        <PixelCard title="TIMER CONTROL">
                            <div className="text-center mb-4">
                                <CountdownDisplay targetTime={timerStats?.targetTime} />
                            </div>
                            <div className="flex gap-2 mb-4">
                                <div className="flex-1">
                                    <Input label="MINUTES" type="number" value={minutesInput} onChange={e => setMinutesInput(e.target.value)} />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <Button onClick={startTimer} variant="success">START</Button>
                                <Button onClick={stopTimer} variant="danger">STOP/RESET</Button>
                            </div>
                        </PixelCard>
                    </div>
                )}

                {tab === 'people' && (
                    <div className="space-y-6">
                        <PixelCard title="ADD PLAYER">
                            <div className="flex gap-2">
                                <div className="flex-1"><Input placeholder="Name" value={newPlayerName} onChange={e => setNewPlayerName(e.target.value)} /></div>
                                <Button onClick={addPlayer} className="h-[42px] mt-0">ADD</Button>
                            </div>
                            <div className="mt-4 flex flex-wrap gap-2">
                                {players.map(p => (
                                    <span key={p.id} className="text-xs bg-gray-700 px-2 py-1 border border-gray-500 rounded">{p.name}</span>
                                ))}
                            </div>
                        </PixelCard>

                        <PixelCard title="GENERATE SCHEDULE">
                            <p className="text-gray-400 text-xs mb-4">Select format based on player count ({players.length}).</p>
                            <div className="flex flex-col gap-2 mb-4">
                                <label className={`border-2 p-3 flex items-center gap-3 cursor-pointer ${tournamentType === '1V1' ? 'border-neon-green bg-green-900/30' : 'border-gray-600'}`}>
                                    <input type="radio" name="ttype" checked={tournamentType === '1V1'} onChange={() => setTournamentType('1V1')} />
                                    <span className="font-pixel text-xs">1V1 (Single Elim Round 1)</span>
                                </label>
                                <label className={`border-2 p-3 flex items-center gap-3 cursor-pointer ${tournamentType === 'SWISS' ? 'border-neon-green bg-green-900/30' : 'border-gray-600'}`}>
                                    <input type="radio" name="ttype" checked={tournamentType === 'SWISS'} onChange={() => setTournamentType('SWISS')} />
                                    <span className="font-pixel text-xs">SWISS (High Scores vs High)</span>
                                </label>
                                <label className={`border-2 p-3 flex items-center gap-3 cursor-pointer ${tournamentType === 'GROUP' ? 'border-neon-green bg-green-900/30' : 'border-gray-600'}`}>
                                    <input type="radio" name="ttype" checked={tournamentType === 'GROUP'} onChange={() => setTournamentType('GROUP')} />
                                    <span className="font-pixel text-xs">GROUP (Round Robin)</span>
                                </label>
                            </div>
                            <Button onClick={generateSchedule} variant="primary" className="w-full">GENERATE</Button>
                        </PixelCard>

                        <div className="pt-8 text-center">
                            <Button variant="danger" onClick={() => { if (confirm("RESET ALL DATA?")) { setPlayers([]); setMatches([]); window.location.reload(); } }}>FACTORY RESET</Button>
                        </div>
                    </div>
                )}

                {tab === 'manage' && (
                    <div className="space-y-6">
                        <PixelCard title="UPDATE SCORES">
                            {/* Toggle Scoring Mode */}
                            <div className="flex bg-black border-2 border-retro-text mb-4">
                                <button
                                    className={`flex-1 py-2 font-pixel text-[10px]`}
                                    style={{ backgroundColor: scoreState.mode === 'individual' ? '#e94560' : 'transparent', color: scoreState.mode === 'individual' ? 'white' : '#6b7280' }}
                                    onClick={() => setScoreState(prev => ({ ...prev, mode: 'individual' }))}
                                >
                                    INDIVIDUAL
                                </button>
                                <button
                                    className={`flex-1 py-2 font-pixel text-[10px] ${tournamentType === '1V1' || tournamentType === 'SWISS' || tournamentType === 'GROUP' ? '' : '' /* reusing logic? no, separate state */} ${/* temporary inline logic for tab-like switch */ 'match' === 'match' ? '' : ''}`}
                                    style={{ backgroundColor: scoreState.mode === 'match' ? '#e94560' : 'transparent', color: scoreState.mode === 'match' ? 'white' : '#6b7280' }}
                                    onClick={() => setScoreState(prev => ({ ...prev, mode: 'match' }))}
                                >
                                    MATCH MODE
                                </button>
                            </div>

                            {/* MATCH MODE UI */}
                            {scoreState.mode === 'match' && (
                                <div className="animate-in fade-in">
                                    <select
                                        className="w-full bg-gray-900 border-2 border-retro-text p-2 font-mono text-white mb-4"
                                        value={scoreState.matchId}
                                        onChange={e => {
                                            const m = matches.find(match => match.id === e.target.value);
                                            setScoreState(prev => ({
                                                ...prev,
                                                matchId: e.target.value,
                                                p1: m ? m.score_p1 : '',
                                                p2: m ? m.score_p2 : ''
                                            }));
                                        }}
                                    >
                                        <option value="">Select Match...</option>
                                        {matches.filter(m => m.status === 'pending').map(m => (
                                            <option key={m.id} value={m.id}>
                                                R{m.round} - {players.find(p => p.id === m.p1_id)?.name} vs {players.find(p => p.id === m.p2_id)?.name}
                                            </option>
                                        ))}
                                    </select>

                                    {scoreState.matchId && (
                                        <div className="animate-in fade-in slide-in-from-top-2">
                                            <div className="flex gap-4 mb-4">
                                                <div className="flex-1">
                                                    <label className="text-xs text-neon-cyan block mb-1">
                                                        {players.find(p => p.id === matches.find(m => m.id === scoreState.matchId).p1_id)?.name}
                                                    </label>
                                                    <input type="number" className="w-full bg-black border-2 border-white p-2 text-xl text-center text-neon-pink" value={scoreState.p1} onChange={e => setScoreState({ ...scoreState, p1: e.target.value })} />
                                                </div>
                                                <div className="flex-1">
                                                    <label className="text-xs text-neon-cyan block mb-1">
                                                        {players.find(p => p.id === matches.find(m => m.id === scoreState.matchId).p2_id)?.name}
                                                    </label>
                                                    <input type="number" className="w-full bg-black border-2 border-white p-2 text-xl text-center text-neon-pink" value={scoreState.p2} onChange={e => setScoreState({ ...scoreState, p2: e.target.value })} />
                                                </div>
                                            </div>
                                            <Button onClick={updateScore} variant="success" className="w-full">SUBMIT RESULT</Button>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* INDIVIDUAL MODE UI */}
                            {scoreState.mode === 'individual' && (
                                <div className="animate-in fade-in space-y-4">
                                    <div className="text-xs text-gray-400 text-center mb-2 font-mono">QUICK ADD POINTS</div>
                                    {players.map(p => (
                                        <PlayerScoreRow key={p.id} player={p} onUpdate={updateIndividualScore} />
                                    ))}
                                </div>
                            )}

                        </PixelCard>

                        <div className="mt-8">
                            <h3 className="font-pixel text-xs text-gray-500 mb-2">RECENT ACTIVITY</h3>
                            {matches.filter(m => m.status === 'completed').slice(0, 5).map(m => (
                                <div key={m.id} className="text-[10px] text-gray-400 font-mono mb-1">
                                    R{m.round}: {players.find(p => p.id === m.p1_id)?.name} {m.score_p1}-{m.score_p2} {players.find(p => p.id === m.p2_id)?.name}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                {tab === 'broadcast' && (
                    <div className="space-y-6">
                        <PixelCard title="BROADCAST SYSTEM">
                            <div className="mb-4">
                                <label className="font-pixel text-xs text-neon-cyan mb-2 block">MESSAGE CONTENT</label>
                                <textarea
                                    value={broadcastMsg}
                                    onChange={e => setBroadcastMsg(e.target.value)}
                                    placeholder="Enter message to broadcast..."
                                    className="w-full h-32 bg-gray-900 border-2 border-retro-text p-4 font-pixel text-white focus:outline-none focus:border-neon-pink shadow-pixel-sm resize-none"
                                />
                            </div>

                            <div className="mb-6">
                                <label className="font-pixel text-xs text-neon-cyan mb-2 block">RECIPIENTS</label>
                                <div className="flex gap-4 mb-4">
                                    <label className={`flex-1 border-2 p-3 flex items-center justify-center gap-2 cursor-pointer ${broadcastTarget === 'all' ? 'border-neon-green bg-green-900/30' : 'border-gray-600'}`}>
                                        <input type="radio" checked={broadcastTarget === 'all'} onChange={() => setBroadcastTarget('all')} className="hidden" />
                                        <span className="font-pixel text-xs">ALL PLAYERS</span>
                                    </label>
                                    <label className={`flex-1 border-2 p-3 flex items-center justify-center gap-2 cursor-pointer ${broadcastTarget === 'select' ? 'border-neon-green bg-green-900/30' : 'border-gray-600'}`}>
                                        <input type="radio" checked={broadcastTarget === 'select'} onChange={() => setBroadcastTarget('select')} className="hidden" />
                                        <span className="font-pixel text-xs">SELECT PLAYERS</span>
                                    </label>
                                </div>

                                {broadcastTarget === 'select' && (
                                    <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto p-2 border border-gray-700 bg-black/30">
                                        {players.map(p => (
                                            <label key={p.id} className={`flex items-center gap-2 p-2 border cursor-pointer hover:bg-gray-800 ${selectedPlayers.includes(p.id) ? 'border-neon-pink bg-pink-900/20' : 'border-gray-700'}`}>
                                                <input
                                                    type="checkbox"
                                                    checked={selectedPlayers.includes(p.id)}
                                                    onChange={e => {
                                                        if (e.target.checked) setSelectedPlayers([...selectedPlayers, p.id]);
                                                        else setSelectedPlayers(selectedPlayers.filter(id => id !== p.id));
                                                    }}
                                                    className="accent-neon-pink"
                                                />
                                                <span className="font-mono text-xs truncate">{p.name}</span>
                                            </label>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <Button onClick={handleSendBroadcast} className="w-full py-4 text-base" variant="secondary">
                                <Icons.Radio className="inline mr-2" /> SEND BROADCAST
                            </Button>
                        </PixelCard>
                    </div>
                )}
            </div>

            <div className="bg-black border-t-4 border-retro-text grid grid-cols-3 p-2 gap-2">
                <button onClick={() => setTab('manage')} className={`p-3 font-pixel text-[10px] flex flex-col items-center border-2 ${tab === 'manage' ? 'bg-retro-accent border-white text-white' : 'border-gray-800 text-gray-500'}`}>
                    <Icons.ClipboardList size={20} className="mb-1" /> SCORES
                </button>
                <button onClick={() => setTab('timer')} className={`p-3 font-pixel text-[10px] flex flex-col items-center border-2 ${tab === 'timer' ? 'bg-retro-accent border-white text-white' : 'border-gray-800 text-gray-500'}`}>
                    <Icons.Clock size={20} className="mb-1" /> TIMER
                </button>
                <button onClick={() => setTab('people')} className={`p-3 font-pixel text-[10px] flex flex-col items-center border-2 ${tab === 'people' ? 'bg-retro-accent border-white text-white' : 'border-gray-800 text-gray-500'}`}>
                    <Icons.Users size={20} className="mb-1" /> SETUP
                </button>
                <button onClick={() => setTab('broadcast')} className={`p-3 font-pixel text-[10px] flex flex-col items-center border-2 ${tab === 'broadcast' ? 'bg-retro-accent border-white text-white' : 'border-gray-800 text-gray-500'}`}>
                    <Icons.Radio size={20} className="mb-1" /> MSG
                </button>
            </div>
        </div>
    );
}

// --- Main App Logic ---

function App() {
    const [viewMode, setViewMode] = useState('select'); // select, scorer, contestant
    const [players, setPlayers] = useState(() => getLocalStorage("gk_players", []));
    const [matches, setMatches] = useState(() => getLocalStorage("gk_matches", []));
    const [timerStats, setTimerStats] = useState(() => getLocalStorage("gk_timer", { targetTime: null, isRunning: false }));
    const [messages, setMessages] = useState(() => getLocalStorage("gk_messages", []));
    const [toast, setToast] = useState(null);

    useEffect(() => {
        setLocalStorage("gk_players", players);
    }, [players]);

    useEffect(() => {
        setLocalStorage("gk_matches", matches);
    }, [matches]);

    useEffect(() => {
        setLocalStorage("gk_timer", timerStats);
    }, [timerStats]);

    useEffect(() => {
        setLocalStorage("gk_messages", messages);
    }, [messages]);

    // Cross-tab sync listener
    useEffect(() => {
        const handleStorage = (e) => {
            if (e.key === "gk_messages") {
                setMessages(JSON.parse(e.newValue || "[]"));
            }
            if (e.key === "gk_timer") {
                setTimerStats(JSON.parse(e.newValue || '{"targetTime": null, "isRunning": false}'));
            }
        };
        window.addEventListener('storage', handleStorage);
        return () => window.removeEventListener('storage', handleStorage);
    }, []);

    const handleSendMessage = (text, targets, targetNames) => {
        const newMsg = {
            id: generateId(),
            text,
            targets,
            targetNames,
            timestamp: Date.now()
        };
        setMessages([...messages, newMsg]);
    };

    useEffect(() => {
        const loader = document.getElementById('loading-screen');
        const root = document.getElementById('root');
        if (loader) loader.style.display = 'none';
        if (root) root.style.display = 'block';
    }, []);

    useEffect(() => {
        if (toast) {
            const t = setTimeout(() => setToast(null), 3000);
            return () => clearTimeout(t);
        }
    }, [toast]);


    const goBack = () => setViewMode('select');

    return (
        <div className="max-w-md mx-auto h-screen bg-retro-bg font-sans bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] text-white overflow-hidden shadow-2xl relative">
            {toast && (
                <div className={`absolute top-4 left-1/2 transform -translate-x-1/2 w-3/4 z-50 p-2 font-pixel text-xs border-2 shadow-pixel text-center animate-in slide-in-from-top-4 fade-in duration-300 ${toast.type === 'error' ? 'bg-red-600 border-white' : 'bg-neon-green border-white text-black'}`}>
                    {toast.message}
                </div>
            )}

            {viewMode === 'select' && (
                <div className="h-full flex flex-col justify-center items-center p-6 space-y-8 bg-retro-bg relative">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/40 via-gray-900/60 to-black pointer-events-none"></div>

                    <div className="text-center z-10 animate-pulse">
                        <h1 className="text-4xl font-pixel text-yellow-400 drop-shadow-[4px_4px_0_#990000] mb-2">賭王大賽</h1>
                        <p className="font-pixel text-xs text-neon-pink">TOURNAMENT SYSTEM V2.1</p>
                    </div>

                    <div className="w-full space-y-6 z-10">
                        <button
                            onClick={() => setViewMode('scorer')}
                            className="w-full bg-retro-card border-4 border-neon-cyan p-6 hover:bg-gray-800 active:scale-95 transition-transform group"
                        >
                            <Icons.Users className="mx-auto mb-2 text-neon-cyan group-hover:scale-110 transition-transform" size={48} />
                            <div className="text-xl font-pixel text-neon-cyan">Generate / Scorer</div>
                            <div className="text-[10px] text-gray-400 mt-2 font-mono">Setup match / Timer / Input Score</div>
                        </button>

                        <button
                            onClick={() => setViewMode('contestant')}
                            className="w-full bg-retro-card border-4 border-neon-green p-6 hover:bg-gray-800 active:scale-95 transition-transform group"
                        >
                            <Icons.Trophy className="mx-auto mb-2 text-neon-green group-hover:scale-110 transition-transform" size={48} />
                            <div className="text-xl font-pixel text-neon-green">Player Mode</div>
                            <div className="text-[10px] text-gray-400 mt-2 font-mono">View Schedule / Timer / Rank</div>
                        </button>
                    </div>

                    <div className="absolute bottom-4 text-[8px] font-pixel text-gray-600">
                        SYSTEM READY // WAITING FOR INPUT
                    </div>
                </div>
            )}

            {viewMode === 'contestant' && (
                <ContestantScreen
                    players={players}
                    matches={matches}
                    timerStats={timerStats}
                    messages={messages}
                    onBack={goBack}
                />
            )}

            {viewMode === 'scorer' && (
                <ScorerScreen
                    players={players}
                    matches={matches}
                    setPlayers={setPlayers}
                    setMatches={setMatches}
                    timerStats={timerStats}
                    setTimerStats={setTimerStats}
                    onBack={goBack}
                    setToast={setToast}
                    onSendMessage={handleSendMessage}
                />
            )}
        </div>
    );
}

try {
    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(<App />);
} catch (error) {
    console.error("Critical Render Error:", error);
    document.getElementById('error-display').style.display = 'block';
    document.getElementById('detailed-errors').innerHTML += '<p><strong>Render Error:</strong> ' + error.message + '</p>';
}

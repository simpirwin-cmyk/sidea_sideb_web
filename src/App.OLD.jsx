import React, { useState } from 'react';
import { fetchMatchup } from './services/api';
import { Star, Trophy, RotateCcw, Flame } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function App() {
  // Theme Toggle: 'black' (Aiwa Dark) or 'silver' (Aiwa Silver)
  const [theme, setTheme] = useState('black');

  // Input states
  const [artistA, setArtistA] = useState("Oasis");
  const [albumA, setAlbumA] = useState("Definitely Maybe");
  const [artistB, setArtistB] = useState("Blur");
  const [albumB, setAlbumB] = useState("Parklife");

  // Game Logic states
  const [loading, setLoading] = useState(false);
  const [matchData, setMatchData] = useState(null);
  const [currentRound, setCurrentRound] = useState(0);
  const [scores, setScores] = useState({ albumA: 0, albumB: 0 });
  const [goldenTrackUsed, setGoldenTrackUsed] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);

  // Theme styles
  const styles = {
    black: {
      chassis: 'bg-zinc-950 border-zinc-800 text-zinc-100 shadow-2xl',
      stackPanel: 'bg-gradient-to-b from-zinc-900 via-zinc-950 to-black border-zinc-800',
      centerUnit: 'bg-neutral-900 border-zinc-800',
      displayScreen: 'bg-black border-zinc-800 text-amber-500',
      deckDoor: 'bg-zinc-900/90 border-zinc-700/80',
      decorativeBtn: 'bg-zinc-800 border-zinc-700 text-zinc-400 select-none cursor-default',
      highlightBtn: 'bg-amber-500 hover:bg-amber-400 text-black font-black',
      accentText: 'text-amber-500',
      ledOn: 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.8)]',
    },
    silver: {
      chassis: 'bg-stone-300 border-stone-400 text-stone-900 shadow-2xl',
      stackPanel: 'bg-gradient-to-b from-stone-100 via-stone-200 to-stone-300 border-stone-400',
      centerUnit: 'bg-stone-200 border-stone-300',
      displayScreen: 'bg-slate-950 border-slate-700 text-cyan-400',
      deckDoor: 'bg-stone-100 border-stone-300',
      decorativeBtn: 'bg-stone-200 border-stone-400 text-stone-700 select-none cursor-default',
      highlightBtn: 'bg-cyan-500 hover:bg-cyan-400 text-black font-black',
      accentText: 'text-cyan-600',
      ledOn: 'bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]',
    }
  };

  const current = styles[theme];

  const startBattle = async (e) => {
    e.preventDefault();
    setLoading(true);
    setIsGameOver(false);
    setCurrentRound(0);
    setScores({ albumA: 0, albumB: 0 });
    setGoldenTrackUsed(false);

    try {
      const data = await fetchMatchup(artistA, albumA, artistB, albumB);
      setMatchData(data);
    } catch (err) {
      alert("Error fetching matchup: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVote = (winner, isGolden = false) => {
    let points = isGolden ? 2 : 1;
    if (isGolden) setGoldenTrackUsed(true);

    const newScores = { ...scores };
    if (winner === 'A') newScores.albumA += points;
    if (winner === 'B') newScores.albumB += points;
    setScores(newScores);

    if (currentRound + 1 < matchData.total_rounds) {
      setCurrentRound(currentRound + 1);
    } else {
      setIsGameOver(true);
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white p-4 md:p-8 flex flex-col items-center justify-center font-sans">
      
      {/* HEADER & THEME TOGGLE */}
      <header className="w-full max-w-5xl flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black tracking-wider uppercase text-amber-500 flex items-center gap-2">
            <Flame className="w-7 h-7 text-amber-500" /> Side A / Side B
          </h1>
          <p className="text-xs text-neutral-400 font-mono">DUAL CASSETTE HI-FI TRACK BATTLE</p>
        </div>

        {/* Finish Toggle */}
        <div className="flex items-center gap-2 bg-neutral-900 border border-neutral-800 p-1.5 rounded-lg">
          <span className="text-xs font-bold text-neutral-400 px-2 uppercase">Finish:</span>
          <button
            type="button"
            onClick={() => setTheme('black')}
            className={`px-3 py-1 text-xs font-black rounded transition-all ${
              theme === 'black' ? 'bg-amber-500 text-black shadow' : 'text-neutral-400 hover:text-white'
            }`}
          >
            MATTE BLACK
          </button>
          <button
            type="button"
            onClick={() => setTheme('silver')}
            className={`px-3 py-1 text-xs font-black rounded transition-all ${
              theme === 'silver' ? 'bg-stone-200 text-black shadow' : 'text-neutral-400 hover:text-white'
            }`}
          >
            VINTAGE SILVER
          </button>
        </div>
      </header>

      {!matchData ? (
        /* SETUP MODE: DUAL TAPE DECK FORM */
        <form onSubmit={startBattle} className="w-full max-w-5xl">
          <main className={`w-full rounded-2xl border-4 p-4 md:p-6 transition-colors duration-300 ${current.chassis} ${current.stackPanel}`}>
            
            {/* 12-COLUMN GRID: DECK 1 (5 cols) | SLIM CENTER (2 cols) | DECK 2 (5 cols) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
              
              {/* ================= CASSETTE DECK 1 (SIDE A) ================= */}
              <div className={`lg:col-span-5 rounded-xl border-2 p-4 flex flex-col justify-between relative shadow-inner ${current.deckDoor}`}>
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <span className={`text-xs font-black tracking-wider uppercase ${current.accentText}`}>
                      DECK 1 • SIDE A
                    </span>
                  </div>

                  {/* J-Card Form Inputs */}
                  <div className="bg-slate-50 text-slate-900 p-3.5 rounded-md border-2 border-slate-300 shadow-md mb-4">
                    <div className="border-b-2 border-red-500 pb-1 mb-2 flex justify-between items-center">
                      <span className="text-[9px] font-black tracking-widest text-slate-700">TAPE I INSERT</span>
                      <span className="text-red-600 font-black text-xs">90 MIN</span>
                    </div>

                    <div className="space-y-2">
                      <div>
                        <label className="block text-[8px] font-sans font-bold text-slate-500 uppercase tracking-wider">Artist A</label>
                        <input
                          type="text"
                          value={artistA}
                          onChange={(e) => setArtistA(e.target.value)}
                          placeholder="Artist A"
                          required
                          className="w-full bg-transparent border-b border-dashed border-slate-400 font-bold text-blue-900 focus:outline-none focus:border-red-500 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-[8px] font-sans font-bold text-slate-500 uppercase tracking-wider">Album A</label>
                        <input
                          type="text"
                          value={albumA}
                          onChange={(e) => setAlbumA(e.target.value)}
                          placeholder="Album A"
                          required
                          className="w-full bg-transparent border-b border-dashed border-slate-400 font-bold text-blue-900 focus:outline-none focus:border-red-500 text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Cassette Door Window & Decorative Hardware Controls */}
                <div className="space-y-3">
                  <div className="h-12 bg-black/80 rounded border border-neutral-700 flex items-center justify-around px-4">
                    <div className="w-7 h-7 rounded-full border-2 border-white/40 flex items-center justify-center">
                      <div className="w-2.5 h-2.5 rounded-full bg-white/60" />
                    </div>
                    <div className="text-[9px] font-mono text-neutral-400 font-bold tracking-widest">CASSETTE DECK A</div>
                    <div className="w-7 h-7 rounded-full border-2 border-white/40 flex items-center justify-center">
                      <div className="w-2.5 h-2.5 rounded-full bg-white/60" />
                    </div>
                  </div>

                  {/* Decorative Tape Transport Buttons */}
                  <div className="grid grid-cols-6 gap-1 pt-1 pointer-events-none select-none opacity-80">
                    <div className="py-1 rounded text-center text-[9px] font-black border bg-red-900/80 border-red-700 text-red-200 select-none cursor-default">● REC</div>
                    <div className={`py-1 rounded text-center text-[9px] font-black border ${current.decorativeBtn}`}>◀◀ REW</div>
                    <div className={`py-1 rounded text-center text-[9px] font-black border ${current.decorativeBtn}`}>▶ PLAY</div>
                    <div className={`py-1 rounded text-center text-[9px] font-black border ${current.decorativeBtn}`}>▶▶ FF</div>
                    <div className={`py-1 rounded text-center text-[9px] font-black border ${current.decorativeBtn}`}>⏸ PAUSE</div>
                    <div className={`py-1 rounded text-center text-[9px] font-black border ${current.decorativeBtn}`}>⏏ EJECT</div>
                  </div>
                </div>
              </div>

              {/* ================= SLIM CENTER AMPLIFIER / DISPLAY ================= */}
              <div className={`lg:col-span-2 rounded-xl border-2 p-3 flex flex-col justify-between items-center text-center shadow-md ${current.centerUnit}`}>
                
                {/* Visualizer Display */}
                <div className={`w-full p-2 rounded-lg border ${current.displayScreen}`}>
                  <div className="flex justify-between items-center text-[8px] font-mono mb-1">
                    <span className="flex items-center gap-1">
                      <span className={`w-1.5 h-1.5 rounded-full ${current.ledOn}`} />
                      DUB
                    </span>
                    <span>00:00</span>
                  </div>

                  <div className="text-[7px] font-mono mb-1 text-neutral-400 uppercase">EQ STACK</div>
                  <div className="flex items-end justify-center gap-0.5 h-10 pt-1 border-t border-neutral-800">
                    {[40, 75, 35, 90, 65, 85, 45, 95].map((h, i) => (
                      <div key={i} className="w-1.5 bg-current rounded-t opacity-90" style={{ height: `${h}%` }} />
                    ))}
                  </div>
                </div>

                {/* Static Volume Control Knob */}
                <div className="my-2 flex flex-col items-center pointer-events-none select-none opacity-90">
                  <div className="w-14 h-14 rounded-full border-2 border-neutral-600 bg-gradient-to-b from-neutral-800 to-neutral-900 shadow-md flex items-center justify-center relative">
                    <div className="w-1 h-4 bg-current rounded-full absolute top-1" />
                    <span className="text-[7px] font-black tracking-widest text-neutral-400 uppercase">VOL</span>
                  </div>
                </div>

                {/* Main Trigger Action Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-2.5 rounded-lg text-[10px] font-black tracking-wider uppercase shadow-lg transition-transform active:scale-95 ${current.highlightBtn}`}
                >
                  {loading ? "DUBBING..." : "START BATTLE"}
                </button>
              </div>

              {/* ================= CASSETTE DECK 2 (SIDE B) ================= */}
              <div className={`lg:col-span-5 rounded-xl border-2 p-4 flex flex-col justify-between relative shadow-inner ${current.deckDoor}`}>
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <span className={`text-xs font-black tracking-wider uppercase ${current.accentText}`}>
                      DECK 2 • SIDE B
                    </span>
                  </div>

                  {/* J-Card Form Inputs */}
                  <div className="bg-slate-50 text-slate-900 p-3.5 rounded-md border-2 border-slate-300 shadow-md mb-4">
                    <div className="border-b-2 border-red-500 pb-1 mb-2 flex justify-between items-center">
                      <span className="text-[9px] font-black tracking-widest text-slate-700">TAPE II INSERT</span>
                      <span className="text-red-600 font-black text-xs">90 MIN</span>
                    </div>

                    <div className="space-y-2">
                      <div>
                        <label className="block text-[8px] font-sans font-bold text-slate-500 uppercase tracking-wider">Artist B</label>
                        <input
                          type="text"
                          value={artistB}
                          onChange={(e) => setArtistB(e.target.value)}
                          placeholder="Artist B"
                          required
                          className="w-full bg-transparent border-b border-dashed border-slate-400 font-bold text-blue-900 focus:outline-none focus:border-red-500 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-[8px] font-sans font-bold text-slate-500 uppercase tracking-wider">Album B</label>
                        <input
                          type="text"
                          value={albumB}
                          onChange={(e) => setAlbumB(e.target.value)}
                          placeholder="Album B"
                          required
                          className="w-full bg-transparent border-b border-dashed border-slate-400 font-bold text-blue-900 focus:outline-none focus:border-red-500 text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Cassette Door Window & Decorative Hardware Controls */}
                <div className="space-y-3">
                  <div className="h-12 bg-black/80 rounded border border-neutral-700 flex items-center justify-around px-4">
                    <div className="w-7 h-7 rounded-full border-2 border-white/40 flex items-center justify-center">
                      <div className="w-2.5 h-2.5 rounded-full bg-white/60" />
                    </div>
                    <div className="text-[9px] font-mono text-neutral-400 font-bold tracking-widest">CASSETTE DECK B</div>
                    <div className="w-7 h-7 rounded-full border-2 border-white/40 flex items-center justify-center">
                      <div className="w-2.5 h-2.5 rounded-full bg-white/60" />
                    </div>
                  </div>

                  {/* Decorative Tape Transport Buttons */}
                  <div className="grid grid-cols-6 gap-1 pt-1 pointer-events-none select-none opacity-80">
                    <div className="py-1 rounded text-center text-[9px] font-black border bg-red-900/80 border-red-700 text-red-200 select-none cursor-default">● REC</div>
                    <div className={`py-1 rounded text-center text-[9px] font-black border ${current.decorativeBtn}`}>◀◀ REW</div>
                    <div className={`py-1 rounded text-center text-[9px] font-black border ${current.decorativeBtn}`}>▶ PLAY</div>
                    <div className={`py-1 rounded text-center text-[9px] font-black border ${current.decorativeBtn}`}>▶▶ FF</div>
                    <div className={`py-1 rounded text-center text-[9px] font-black border ${current.decorativeBtn}`}>⏸ PAUSE</div>
                    <div className={`py-1 rounded text-center text-[9px] font-black border ${current.decorativeBtn}`}>⏏ EJECT</div>
                  </div>
                </div>
              </div>

            </div>
          </main>
        </form>
      ) : isGameOver ? (
        /* FINAL GAME OVER / WINNER SCREEN */
        <div className="bg-zinc-900 p-8 rounded-2xl shadow-2xl border-2 border-zinc-800 text-center max-w-xl w-full">
          <Trophy className="w-16 h-16 text-amber-400 mx-auto mb-3 animate-bounce" />
          
          {scores.albumA === scores.albumB ? (
            /* DRAW / TIE DISPLAY */
            <div>
              <h2 className="text-3xl font-black text-amber-400 uppercase tracking-wider mb-2">IT'S A DRAW!</h2>
              <p className="text-xs text-neutral-400 uppercase tracking-widest mb-6">Equal Score — Both Albums Reign</p>
              
              <div className="grid grid-cols-2 gap-4 my-6">
                <div className="bg-zinc-950 p-4 rounded-xl border border-amber-500/30 flex flex-col items-center">
                  <img src={matchData.album_a.cover_art} alt="" className="w-24 h-24 rounded-lg shadow-md mb-3" />
                  <p className="font-black text-amber-400 text-sm">{matchData.album_a.title}</p>
                  <p className="text-2xl font-black mt-1">{scores.albumA} PTS</p>
                </div>
                <div className="bg-zinc-950 p-4 rounded-xl border border-cyan-500/30 flex flex-col items-center">
                  <img src={matchData.album_b.cover_art} alt="" className="w-24 h-24 rounded-lg shadow-md mb-3" />
                  <p className="font-black text-cyan-400 text-sm">{matchData.album_b.title}</p>
                  <p className="text-2xl font-black mt-1">{scores.albumB} PTS</p>
                </div>
              </div>
            </div>
          ) : (
            /* WINNER DISPLAY (LARGE WINNING ALBUM) */
            <div>
              <span className="text-xs text-neutral-400 uppercase font-mono tracking-widest">BATTLE VICTOR</span>
              <h2 className="text-3xl font-black text-amber-400 uppercase tracking-wider mb-6">CHAMPION DECK</h2>

              {/* Large Winner Hero Card */}
              {(() => {
                const isAWinner = scores.albumA > scores.albumB;
                const winnerAlbum = isAWinner ? matchData.album_a : matchData.album_b;
                const winnerScore = isAWinner ? scores.albumA : scores.albumB;
                const loserAlbum = isAWinner ? matchData.album_b : matchData.album_a;
                const loserScore = isAWinner ? scores.albumB : scores.albumA;

                return (
                  <div className="space-y-6">
                    <div className="bg-gradient-to-b from-zinc-800 to-zinc-950 p-6 rounded-2xl border-2 border-amber-500/60 shadow-xl flex flex-col items-center">
                      <img src={winnerAlbum.cover_art} alt="" className="w-36 h-36 rounded-xl shadow-2xl mb-4 border-2 border-amber-400/40" />
                      <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">WINNING ALBUM</span>
                      <h3 className="text-2xl font-black text-white mt-1">{winnerAlbum.title}</h3>
                      <p className="text-4xl font-black text-amber-400 mt-2">{winnerScore} <span className="text-base text-neutral-400 font-normal">PTS</span></p>
                    </div>

                    {/* Runner Up Summary */}
                    <div className="bg-zinc-950/80 p-3 rounded-xl border border-zinc-800 flex items-center justify-between px-6">
                      <div className="flex items-center gap-3">
                        <img src={loserAlbum.cover_art} alt="" className="w-10 h-10 rounded" />
                        <div className="text-left">
                          <span className="text-[10px] text-neutral-500 uppercase font-bold">RUNNER UP</span>
                          <p className="text-xs font-bold text-neutral-300">{loserAlbum.title}</p>
                        </div>
                      </div>
                      <span className="text-lg font-black text-neutral-400">{loserScore} PTS</span>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          <button
            type="button"
            onClick={() => setMatchData(null)}
            className="flex items-center gap-2 mx-auto bg-amber-500 hover:bg-amber-400 text-black font-black px-6 py-3 rounded-xl shadow-lg transition-transform active:scale-95 mt-8 text-xs tracking-wider uppercase"
          >
            <RotateCcw className="w-4 h-4" /> START NEW BATTLE
          </button>
        </div>
      ) : (
        /* ACTIVE BATTLE MATCHUP SCREEN (MATCHES DARK HI-FI THEME) */
        <div className="w-full max-w-2xl bg-zinc-900 p-6 rounded-2xl border-2 border-zinc-800 shadow-2xl">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <img src={matchData.album_a.cover_art} alt="" className="w-12 h-12 rounded shadow border border-zinc-700" />
              <span className="font-bold text-amber-400 text-xl">{scores.albumA}</span>
            </div>
            <span className="text-xs bg-zinc-950 border border-zinc-800 px-3 py-1 rounded-full text-neutral-400 font-mono font-bold tracking-wider">
              Round {currentRound + 1} of {matchData.total_rounds}
            </span>
            <div className="flex items-center gap-3">
              <span className="font-bold text-cyan-400 text-xl">{scores.albumB}</span>
              <img src={matchData.album_b.cover_art} alt="" className="w-12 h-12 rounded shadow border border-zinc-700" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 my-8 text-center">
            <button
              type="button"
              onClick={() => handleVote('A')}
              className="bg-zinc-950 border-2 border-zinc-800 hover:border-amber-500 p-6 rounded-xl transition-all group flex flex-col justify-between"
            >
              <span className="text-xs text-amber-500 font-bold uppercase tracking-wider mb-2">{matchData.album_a.title}</span>
              <p className="text-lg font-bold text-white group-hover:scale-105 transition-transform">
                {matchData.matchups[currentRound].track_a || "N/A (No Track)"}
              </p>
            </button>

            <button
              type="button"
              onClick={() => handleVote('B')}
              className="bg-zinc-950 border-2 border-zinc-800 hover:border-cyan-500 p-6 rounded-xl transition-all group flex flex-col justify-between"
            >
              <span className="text-xs text-cyan-400 font-bold uppercase tracking-wider mb-2">{matchData.album_b.title}</span>
              <p className="text-lg font-bold text-white group-hover:scale-105 transition-transform">
                {matchData.matchups[currentRound].track_b || "N/A (No Track)"}
              </p>
            </button>
          </div>

          <div className="flex justify-between items-center border-t border-zinc-800 pt-4 mt-6">
            <button
              type="button"
              onClick={() => handleVote('Tie')}
              className="text-neutral-400 hover:text-white text-sm font-semibold"
            >
              Skip / Tie
            </button>

            <button
              type="button"
              disabled={goldenTrackUsed}
              onClick={() => {
                const choice = prompt("Which side gets the Golden Track? Type 'A' or 'B'");
                if (choice?.toUpperCase() === 'A') handleVote('A', true);
                if (choice?.toUpperCase() === 'B') handleVote('B', true);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                goldenTrackUsed ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed' : 'bg-amber-500 text-black hover:bg-amber-400 shadow-lg'
              }`}
            >
              <Star className="w-3.5 h-3.5 fill-current" />
              {goldenTrackUsed ? "Golden Track Used" : "Use Golden Track (2x)"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
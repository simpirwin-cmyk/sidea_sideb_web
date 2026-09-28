import React, { useState } from 'react';
import { fetchMatchup } from './services/api';
import { Star, Trophy, RotateCcw, Flame } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function App() {
  const [artistA, setArtistA] = useState("The Strokes");
  const [albumA, setAlbumA] = useState("Is This It");
  const [artistB, setArtistB] = useState("The Strokes");
  const [albumB, setAlbumB] = useState("Room on Fire");

  const [loading, setLoading] = useState(false);
  const [matchData, setMatchData] = useState(null);
  const [currentRound, setCurrentRound] = useState(0);
  const [scores, setScores] = useState({ albumA: 0, albumB: 0 });
  const [goldenTrackUsed, setGoldenTrackUsed] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);

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
    <div className="max-w-4xl mx-auto p-4 flex flex-col items-center min-h-screen bg-slate-900 text-white">
      <header className="text-center my-6">
        <h1 className="text-4xl font-extrabold tracking-tight text-amber-400 flex items-center justify-center gap-2">
          <Flame className="w-8 h-8 text-amber-500" /> Side A / Side B
        </h1>
        <p className="text-slate-400 text-sm mt-1">Head-to-Head Track Battle</p>
      </header>

      {!matchData ? (
        <form onSubmit={startBattle} className="bg-slate-800 p-6 rounded-xl shadow-xl border border-slate-700 w-full max-w-md">
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-slate-200">Side A</h2>
            <input className="w-full bg-slate-900 border border-slate-700 p-2 rounded text-white" value={artistA} onChange={e => setArtistA(e.target.value)} placeholder="Artist A" required />
            <input className="w-full bg-slate-900 border border-slate-700 p-2 rounded text-white" value={albumA} onChange={e => setAlbumA(e.target.value)} placeholder="Album A" required />

            <hr className="border-slate-700" />

            <h2 className="text-lg font-bold text-slate-200">Side B</h2>
            <input className="w-full bg-slate-900 border border-slate-700 p-2 rounded text-white" value={artistB} onChange={e => setArtistB(e.target.value)} placeholder="Artist B" required />
            <input className="w-full bg-slate-900 border border-slate-700 p-2 rounded text-white" value={albumB} onChange={e => setAlbumB(e.target.value)} placeholder="Album B" required />

            <button type="submit" disabled={loading} className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold p-3 rounded-lg transition-all mt-4">
              {loading ? "Loading Matchup..." : "Start Battle"}
            </button>
          </div>
        </form>
      ) : isGameOver ? (
        <div className="bg-slate-800 p-8 rounded-xl shadow-2xl border border-slate-700 text-center max-w-lg w-full">
          <Trophy className="w-16 h-16 text-amber-400 mx-auto mb-4 animate-bounce" />
          <h2 className="text-2xl font-bold mb-2">Battle Complete!</h2>
          <div className="flex justify-around my-6 text-xl">
            <div>
              <p className="font-bold text-amber-400">{matchData.album_a.title}</p>
              <p className="text-3xl mt-2 font-black">{scores.albumA}</p>
            </div>
            <div className="self-center text-slate-500 font-bold">VS</div>
            <div>
              <p className="font-bold text-blue-400">{matchData.album_b.title}</p>
              <p className="text-3xl mt-2 font-black">{scores.albumB}</p>
            </div>
          </div>
          <button onClick={() => setMatchData(null)} className="flex items-center gap-2 mx-auto bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-lg font-bold">
            <RotateCcw className="w-4 h-4" /> Play Another
          </button>
        </div>
      ) : (
        <div className="w-full max-w-2xl bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-2xl">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <img src={matchData.album_a.cover_art} alt="" className="w-12 h-12 rounded shadow" />
              <span className="font-bold text-amber-400">{scores.albumA}</span>
            </div>
            <span className="text-xs bg-slate-700 px-3 py-1 rounded-full text-slate-300 font-semibold">
              Round {currentRound + 1} of {matchData.total_rounds}
            </span>
            <div className="flex items-center gap-3">
              <span className="font-bold text-blue-400">{scores.albumB}</span>
              <img src={matchData.album_b.cover_art} alt="" className="w-12 h-12 rounded shadow" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 my-8 text-center">
            <button onClick={() => handleVote('A')} className="bg-slate-900 border-2 border-slate-700 hover:border-amber-400 p-6 rounded-xl transition-all group flex flex-col justify-between">
              <span className="text-xs text-amber-400 font-bold uppercase tracking-wider mb-2">{matchData.album_a.title}</span>
              <p className="text-lg font-bold text-white group-hover:scale-105 transition-transform">
                {matchData.matchups[currentRound].track_a || "N/A (No Track)"}
              </p>
            </button>

            <button onClick={() => handleVote('B')} className="bg-slate-900 border-2 border-slate-700 hover:border-blue-400 p-6 rounded-xl transition-all group flex flex-col justify-between">
              <span className="text-xs text-blue-400 font-bold uppercase tracking-wider mb-2">{matchData.album_b.title}</span>
              <p className="text-lg font-bold text-white group-hover:scale-105 transition-transform">
                {matchData.matchups[currentRound].track_b || "N/A (No Track)"}
              </p>
            </button>
          </div>

          <div className="flex justify-between items-center border-t border-slate-700 pt-4 mt-6">
            <button onClick={() => handleVote('Tie')} className="text-slate-400 hover:text-white text-sm font-semibold">
              Skip / Tie
            </button>

            <button
              disabled={goldenTrackUsed}
              onClick={() => {
                const choice = prompt("Which side gets the Golden Track? Type 'A' or 'B'");
                if (choice?.toUpperCase() === 'A') handleVote('A', true);
                if (choice?.toUpperCase() === 'B') handleVote('B', true);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                goldenTrackUsed ? 'bg-slate-700 text-slate-500 cursor-not-allowed' : 'bg-amber-500 text-slate-950 hover:bg-amber-400 shadow-lg'
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
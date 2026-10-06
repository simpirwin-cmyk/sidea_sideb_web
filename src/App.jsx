import React, { useState, useEffect } from 'react';
import { fetchMatchup, searchArtists, fetchArtistAlbums } from './services/api';
import { Star, Trophy, RotateCcw, Flame, Loader2, Disc } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function App() {
  // Input states
  const [artistA, setArtistA] = useState("Oasis");
  const [albumA, setAlbumA] = useState("Definitely Maybe");
  const [artistB, setArtistB] = useState("Blur");
  const [albumB, setAlbumB] = useState("Parklife");

  // Auto-suggest & Album States - Side A
  const [suggestionsA, setSuggestionsA] = useState([]);
  const [showSuggestionsA, setShowSuggestionsA] = useState(false);
  const [albumsA, setAlbumsA] = useState([]);
  const [loadingAlbumsA, setLoadingAlbumsA] = useState(false);

  // Auto-suggest & Album States - Side B
  const [suggestionsB, setSuggestionsB] = useState([]);
  const [showSuggestionsB, setShowSuggestionsB] = useState(false);
  const [albumsB, setAlbumsB] = useState([]);
  const [loadingAlbumsB, setLoadingAlbumsB] = useState(false);

  // Game Logic states
  const [loading, setLoading] = useState(false);
  const [matchData, setMatchData] = useState(null);
  const [currentRound, setCurrentRound] = useState(0);
  const [scores, setScores] = useState({ albumA: 0, albumB: 0 });
  const [goldenTrackUsed, setGoldenTrackUsed] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);

  // Initial load: Fetch default albums for Oasis & Blur
  useEffect(() => {
    fetchArtistAlbums("Oasis").then(setAlbumsA);
    fetchArtistAlbums("Blur").then(setAlbumsB);
  }, []);

  // Handlers for Artist A
  const handleArtistAChange = async (e) => {
    const val = e.target.value;
    setArtistA(val);
    if (val.trim().length >= 2) {
      const results = await searchArtists(val);
      setSuggestionsA(results);
      setShowSuggestionsA(true);
    } else {
      setSuggestionsA([]);
      setShowSuggestionsA(false);
    }
  };

  const handleSelectArtistA = async (name) => {
    setArtistA(name);
    setShowSuggestionsA(false);
    setLoadingAlbumsA(true);
    const fetchedAlbums = await fetchArtistAlbums(name);
    setAlbumsA(fetchedAlbums);
    if (fetchedAlbums.length > 0) {
      setAlbumA(fetchedAlbums[0].title || fetchedAlbums[0].name || fetchedAlbums[0]);
    }
    setLoadingAlbumsA(false);
  };

  // Handlers for Artist B
  const handleArtistBChange = async (e) => {
    const val = e.target.value;
    setArtistB(val);
    if (val.trim().length >= 2) {
      const results = await searchArtists(val);
      setSuggestionsB(results);
      setShowSuggestionsB(true);
    } else {
      setSuggestionsB([]);
      setShowSuggestionsB(false);
    }
  };

  const handleSelectArtistB = async (name) => {
    setArtistB(name);
    setShowSuggestionsB(false);
    setLoadingAlbumsB(true);
    const fetchedAlbums = await fetchArtistAlbums(name);
    setAlbumsB(fetchedAlbums);
    if (fetchedAlbums.length > 0) {
      setAlbumB(fetchedAlbums[0].title || fetchedAlbums[0].name || fetchedAlbums[0]);
    }
    setLoadingAlbumsB(false);
  };

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
    <div className="min-h-screen bg-[#12100e] text-stone-100 p-4 md:p-8 flex flex-col items-center justify-center font-sans">
      
      {/* SIMPLIFIED HEADER */}
      <header className="w-full max-w-4xl text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-black tracking-widest uppercase text-amber-500 flex items-center justify-center gap-2">
          <Flame className="w-8 h-8 text-amber-500" /> SIDE A / SIDE B
        </h1>
        <p className="text-xs text-amber-200/60 font-mono tracking-widest uppercase mt-1">DUAL CASSETTE HI-FI TRACK BATTLE</p>
      </header>

      {!matchData ? (
        /* CLEAN VINTAGE CHASSIS FORM */
        <form onSubmit={startBattle} className="w-full max-w-4xl">
          <main className="w-full rounded-2xl border-2 border-[#3a2e2b] bg-[#1c1816] p-5 md:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              
              {/* ================= CASSETTE DECK 1 (SIDE A) ================= */}
              <div className="lg:col-span-5 rounded-xl border border-[#3a2e2b] bg-[#151210] p-5 flex flex-col justify-between shadow-inner">
                <div>
                  <div className="flex justify-between items-center mb-4 border-b border-[#2d2422] pb-2">
                    <span className="text-xs font-black tracking-widest text-amber-500 uppercase">
                      DECK I • SIDE A
                    </span>
                    <span className="text-[10px] font-mono text-stone-400">TAPE A</span>
                  </div>

                  {/* Clean J-Card Insert */}
                  <div className="bg-[#f5f2eb] text-stone-900 p-4 rounded-md border-l-4 border-amber-600 shadow-md">
                    <div className="space-y-3">
                      
                      {/* Artist Input */}
                      <div className="relative">
                        <label className="block text-[9px] font-bold text-stone-500 uppercase tracking-wider mb-0.5">Artist</label>
                        <input
                          type="text"
                          value={artistA}
                          onChange={handleArtistAChange}
                          onFocus={() => suggestionsA.length > 0 && setShowSuggestionsA(true)}
                          placeholder="Artist Name"
                          required
                          className="w-full bg-transparent border-b border-stone-400 font-bold text-amber-950 focus:outline-none focus:border-amber-600 text-base py-0.5"
                        />

                        {/* Suggestions Dropdown */}
                        {showSuggestionsA && suggestionsA.length > 0 && (
                          <ul className="absolute z-30 left-0 right-0 top-full mt-1 bg-[#1a1614] text-stone-200 border border-amber-900/50 rounded-md shadow-2xl max-h-40 overflow-y-auto text-xs">
                            {suggestionsA.map((item, idx) => {
                              const itemText = typeof item === 'string' ? item : item.name;
                              return (
                                <li
                                  key={idx}
                                  onClick={() => handleSelectArtistA(itemText)}
                                  className="p-2.5 hover:bg-amber-600 hover:text-black cursor-pointer font-bold border-b border-stone-800/50 last:border-none"
                                >
                                  {itemText}
                                </li>
                              );
                            })}
                          </ul>
                        )}
                      </div>

                      {/* Album Input */}
                      <div>
                        <div className="flex justify-between items-center mb-0.5">
                          <label className="block text-[9px] font-bold text-stone-500 uppercase tracking-wider">Album</label>
                          {loadingAlbumsA && <Loader2 className="w-3 h-3 text-amber-700 animate-spin" />}
                        </div>
                        {albumsA.length > 0 ? (
                          <select
                            value={albumA}
                            onChange={(e) => setAlbumA(e.target.value)}
                            className="w-full bg-stone-200/80 border-b border-stone-400 font-bold text-amber-950 focus:outline-none text-sm py-1 rounded cursor-pointer"
                          >
                            {albumsA.map((alb, idx) => {
                              const albTitle = typeof alb === 'string' ? alb : (alb.title || alb.name);
                              return (
                                <option key={idx} value={albTitle}>
                                  {albTitle}
                                </option>
                              );
                            })}
                          </select>
                        ) : (
                          <input
                            type="text"
                            value={albumA}
                            onChange={(e) => setAlbumA(e.target.value)}
                            placeholder={loadingAlbumsA ? "Loading..." : "Album Title"}
                            required
                            className="w-full bg-transparent border-b border-stone-400 font-bold text-amber-950 focus:outline-none focus:border-amber-600 text-base py-0.5"
                          />
                        )}
                      </div>

                    </div>
                  </div>
                </div>

                {/* Minimal Cassette Well Window */}
                <div className="mt-6">
                  <div className="h-16 bg-[#0a0908] rounded-lg border border-[#2d2422] flex items-center justify-between px-6">
                    <Disc className={`w-8 h-8 text-amber-600/70 ${loading ? 'animate-spin' : ''}`} />
                    <div className="text-center">
                      <span className="text-[10px] font-mono text-stone-500 tracking-widest block uppercase">DECK A</span>
                      <span className="text-[8px] font-mono text-amber-600/80">READY</span>
                    </div>
                    <Disc className={`w-8 h-8 text-amber-600/70 ${loading ? 'animate-spin' : ''}`} />
                  </div>
                </div>
              </div>

              {/* ================= CENTER CONTROL PANEL ================= */}
              <div className="lg:col-span-2 rounded-xl border border-[#3a2e2b] bg-[#151210] p-4 flex flex-col justify-between items-center text-center shadow-md">
                
                {/* VU Meter Visualizer */}
                <div className="w-full p-3 rounded-lg border border-[#2d2422] bg-[#0a0908]">
                  <div className="flex justify-between items-center text-[9px] font-mono text-amber-500 mb-2">
                    <span className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shadow-[0_0_6px_rgba(245,158,11,0.8)]" />
                      STEREO
                    </span>
                  </div>

                  {/* Dual Bar VU Meters */}
                  <div className="space-y-1.5 py-1">
                    <div className="text-[7px] font-mono text-stone-500 text-left">CH-L</div>
                    <div className="flex gap-0.5 h-2">
                      {[1,1,1,1,1,1,2,2,3].map((level, i) => (
                        <div 
                          key={i} 
                          className={`flex-1 rounded-sm ${
                            level === 1 ? 'bg-emerald-600' : level === 2 ? 'bg-amber-500' : 'bg-red-600'
                          } ${i < (loading ? 7 : 4) ? 'opacity-100' : 'opacity-20'}`} 
                        />
                      ))}
                    </div>
                    <div className="text-[7px] font-mono text-stone-500 text-left">CH-R</div>
                    <div className="flex gap-0.5 h-2">
                      {[1,1,1,1,1,1,2,2,3].map((level, i) => (
                        <div 
                          key={i} 
                          className={`flex-1 rounded-sm ${
                            level === 1 ? 'bg-emerald-600' : level === 2 ? 'bg-amber-500' : 'bg-red-600'
                          } ${i < (loading ? 8 : 5) ? 'opacity-100' : 'opacity-20'}`} 
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Tactile Master Dial */}
                <div className="my-3">
                  <div className="w-16 h-16 rounded-full border-2 border-[#3a2e2b] bg-gradient-to-b from-[#241d1b] to-[#120f0e] shadow-xl flex items-center justify-center relative">
                    <div className="w-1 h-4 bg-amber-500/80 rounded-full absolute top-1" />
                    <span className="text-[7px] font-black tracking-widest text-stone-400 uppercase">MASTER</span>
                  </div>
                </div>

                {/* Main Action Trigger */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-lg text-xs font-black tracking-widest uppercase bg-amber-600 hover:bg-amber-500 text-stone-950 shadow-lg transition-all active:scale-95 flex items-center justify-center gap-1.5"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" /> DUBBING
                    </>
                  ) : (
                    "START BATTLE"
                  )}
                </button>
              </div>

              {/* ================= CASSETTE DECK 2 (SIDE B) ================= */}
              <div className="lg:col-span-5 rounded-xl border border-[#3a2e2b] bg-[#151210] p-5 flex flex-col justify-between shadow-inner">
                <div>
                  <div className="flex justify-between items-center mb-4 border-b border-[#2d2422] pb-2">
                    <span className="text-xs font-black tracking-widest text-amber-500 uppercase">
                      DECK II • SIDE B
                    </span>
                    <span className="text-[10px] font-mono text-stone-400">TAPE B</span>
                  </div>

                  {/* Clean J-Card Insert */}
                  <div className="bg-[#f5f2eb] text-stone-900 p-4 rounded-md border-l-4 border-amber-600 shadow-md">
                    <div className="space-y-3">
                      
                      {/* Artist Input */}
                      <div className="relative">
                        <label className="block text-[9px] font-bold text-stone-500 uppercase tracking-wider mb-0.5">Artist</label>
                        <input
                          type="text"
                          value={artistB}
                          onChange={handleArtistBChange}
                          onFocus={() => suggestionsB.length > 0 && setShowSuggestionsB(true)}
                          placeholder="Artist Name"
                          required
                          className="w-full bg-transparent border-b border-stone-400 font-bold text-amber-950 focus:outline-none focus:border-amber-600 text-base py-0.5"
                        />

                        {/* Suggestions Dropdown */}
                        {showSuggestionsB && suggestionsB.length > 0 && (
                          <ul className="absolute z-30 left-0 right-0 top-full mt-1 bg-[#1a1614] text-stone-200 border border-amber-900/50 rounded-md shadow-2xl max-h-40 overflow-y-auto text-xs">
                            {suggestionsB.map((item, idx) => {
                              const itemText = typeof item === 'string' ? item : item.name;
                              return (
                                <li
                                  key={idx}
                                  onClick={() => handleSelectArtistB(itemText)}
                                  className="p-2.5 hover:bg-amber-600 hover:text-black cursor-pointer font-bold border-b border-stone-800/50 last:border-none"
                                >
                                  {itemText}
                                </li>
                              );
                            })}
                          </ul>
                        )}
                      </div>

                      {/* Album Input */}
                      <div>
                        <div className="flex justify-between items-center mb-0.5">
                          <label className="block text-[9px] font-bold text-stone-500 uppercase tracking-wider">Album</label>
                          {loadingAlbumsB && <Loader2 className="w-3 h-3 text-amber-700 animate-spin" />}
                        </div>
                        {albumsB.length > 0 ? (
                          <select
                            value={albumB}
                            onChange={(e) => setAlbumB(e.target.value)}
                            className="w-full bg-stone-200/80 border-b border-stone-400 font-bold text-amber-950 focus:outline-none text-sm py-1 rounded cursor-pointer"
                          >
                            {albumsB.map((alb, idx) => {
                              const albTitle = typeof alb === 'string' ? alb : (alb.title || alb.name);
                              return (
                                <option key={idx} value={albTitle}>
                                  {albTitle}
                                </option>
                              );
                            })}
                          </select>
                        ) : (
                          <input
                            type="text"
                            value={albumB}
                            onChange={(e) => setAlbumB(e.target.value)}
                            placeholder={loadingAlbumsB ? "Loading..." : "Album Title"}
                            required
                            className="w-full bg-transparent border-b border-stone-400 font-bold text-amber-950 focus:outline-none focus:border-amber-600 text-base py-0.5"
                          />
                        )}
                      </div>

                    </div>
                  </div>
                </div>

                {/* Minimal Cassette Well Window */}
                <div className="mt-6">
                  <div className="h-16 bg-[#0a0908] rounded-lg border border-[#2d2422] flex items-center justify-between px-6">
                    <Disc className={`w-8 h-8 text-amber-600/70 ${loading ? 'animate-spin' : ''}`} />
                    <div className="text-center">
                      <span className="text-[10px] font-mono text-stone-500 tracking-widest block uppercase">DECK B</span>
                      <span className="text-[8px] font-mono text-amber-600/80">READY</span>
                    </div>
                    <Disc className={`w-8 h-8 text-amber-600/70 ${loading ? 'animate-spin' : ''}`} />
                  </div>
                </div>
              </div>

            </div>
          </main>
        </form>
      ) : isGameOver ? (
        /* FINAL GAME OVER SCREEN */
        <div className="bg-[#1c1816] p-8 rounded-2xl shadow-2xl border-2 border-[#3a2e2b] text-center max-w-xl w-full">
          <Trophy className="w-16 h-16 text-amber-500 mx-auto mb-3 animate-bounce" />
          
          {scores.albumA === scores.albumB ? (
            <div>
              <h2 className="text-3xl font-black text-amber-500 uppercase tracking-wider mb-2">IT'S A DRAW!</h2>
              <p className="text-xs text-stone-400 uppercase tracking-widest mb-6">Equal Score — Both Albums Reign</p>
              
              <div className="grid grid-cols-2 gap-4 my-6">
                <div className="bg-[#12100e] p-4 rounded-xl border border-amber-900/40 flex flex-col items-center">
                  <img src={matchData.album_a.cover_art} alt="" className="w-24 h-24 rounded-lg shadow-md mb-3 object-cover" />
                  <p className="font-black text-amber-500 text-sm">{matchData.album_a.title}</p>
                  <p className="text-2xl font-black mt-1">{scores.albumA} PTS</p>
                </div>
                <div className="bg-[#12100e] p-4 rounded-xl border border-amber-900/40 flex flex-col items-center">
                  <img src={matchData.album_b.cover_art} alt="" className="w-24 h-24 rounded-lg shadow-md mb-3 object-cover" />
                  <p className="font-black text-amber-500 text-sm">{matchData.album_b.title}</p>
                  <p className="text-2xl font-black mt-1">{scores.albumB} PTS</p>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <span className="text-xs text-stone-400 uppercase font-mono tracking-widest">BATTLE VICTOR</span>
              <h2 className="text-3xl font-black text-amber-500 uppercase tracking-wider mb-6">CHAMPION DECK</h2>

              {(() => {
                const isAWinner = scores.albumA > scores.albumB;
                const winnerAlbum = isAWinner ? matchData.album_a : matchData.album_b;
                const winnerScore = isAWinner ? scores.albumA : scores.albumB;
                const loserAlbum = isAWinner ? matchData.album_b : matchData.album_a;
                const loserScore = isAWinner ? scores.albumB : scores.albumA;

                return (
                  <div className="space-y-6">
                    <div className="bg-gradient-to-b from-[#251f1c] to-[#12100e] p-6 rounded-2xl border-2 border-amber-600/50 shadow-xl flex flex-col items-center">
                      <img src={winnerAlbum.cover_art} alt="" className="w-36 h-36 rounded-xl shadow-2xl mb-4 border-2 border-amber-500/30 object-cover" />
                      <span className="text-xs font-bold text-amber-500 uppercase tracking-widest">WINNING ALBUM</span>
                      <h3 className="text-2xl font-black text-white mt-1">{winnerAlbum.title}</h3>
                      <p className="text-4xl font-black text-amber-500 mt-2">{winnerScore} <span className="text-base text-stone-400 font-normal">PTS</span></p>
                    </div>

                    <div className="bg-[#12100e] p-3.5 rounded-xl border border-[#2d2422] flex items-center justify-between px-6">
                      <div className="flex items-center gap-3">
                        <img src={loserAlbum.cover_art} alt="" className="w-10 h-10 rounded object-cover" />
                        <div className="text-left">
                          <span className="text-[10px] text-stone-500 uppercase font-bold">RUNNER UP</span>
                          <p className="text-xs font-bold text-stone-300">{loserAlbum.title}</p>
                        </div>
                      </div>
                      <span className="text-lg font-black text-stone-400">{loserScore} PTS</span>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          <button
            type="button"
            onClick={() => setMatchData(null)}
            className="flex items-center gap-2 mx-auto bg-amber-600 hover:bg-amber-500 text-stone-950 font-black px-6 py-3 rounded-xl shadow-lg transition-transform active:scale-95 mt-8 text-xs tracking-wider uppercase"
          >
            <RotateCcw className="w-4 h-4" /> START NEW BATTLE
          </button>
        </div>
      ) : (
        /* ACTIVE BATTLE MATCHUP SCREEN */
        <div className="w-full max-w-2xl bg-[#1c1816] p-6 rounded-2xl border-2 border-[#3a2e2b] shadow-2xl">
          <div className="flex justify-between items-center mb-6 border-b border-[#2d2422] pb-4">
            <div className="flex items-center gap-3">
              <img src={matchData.album_a.cover_art} alt="" className="w-12 h-12 rounded shadow border border-amber-900/40 object-cover" />
              <span className="font-bold text-amber-500 text-xl">{scores.albumA}</span>
            </div>
            <span className="text-xs bg-[#0a0908] border border-[#2d2422] px-3 py-1 rounded-full text-stone-400 font-mono font-bold tracking-wider">
              Round {currentRound + 1} of {matchData.total_rounds}
            </span>
            <div className="flex items-center gap-3">
              <span className="font-bold text-amber-500 text-xl">{scores.albumB}</span>
              <img src={matchData.album_b.cover_art} alt="" className="w-12 h-12 rounded shadow border border-amber-900/40 object-cover" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 my-8 text-center">
            <button
              type="button"
              onClick={() => handleVote('A')}
              className="bg-[#12100e] border-2 border-[#2d2422] hover:border-amber-600 p-6 rounded-xl transition-all group flex flex-col justify-between"
            >
              <span className="text-xs text-amber-500 font-bold uppercase tracking-wider mb-2">{matchData.album_a.title}</span>
              <p className="text-lg font-bold text-white group-hover:scale-105 transition-transform">
                {matchData.matchups[currentRound].track_a || "N/A (No Track)"}
              </p>
            </button>

            <button
              type="button"
              onClick={() => handleVote('B')}
              className="bg-[#12100e] border-2 border-[#2d2422] hover:border-amber-600 p-6 rounded-xl transition-all group flex flex-col justify-between"
            >
              <span className="text-xs text-amber-500 font-bold uppercase tracking-wider mb-2">{matchData.album_b.title}</span>
              <p className="text-lg font-bold text-white group-hover:scale-105 transition-transform">
                {matchData.matchups[currentRound].track_b || "N/A (No Track)"}
              </p>
            </button>
          </div>

          <div className="flex justify-between items-center border-t border-[#2d2422] pt-4 mt-6">
            <button
              type="button"
              onClick={() => handleVote('Tie')}
              className="text-stone-400 hover:text-white text-sm font-semibold"
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
                goldenTrackUsed ? 'bg-[#12100e] text-stone-600 cursor-not-allowed border border-[#2d2422]' : 'bg-amber-600 text-stone-950 hover:bg-amber-500 shadow-lg'
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
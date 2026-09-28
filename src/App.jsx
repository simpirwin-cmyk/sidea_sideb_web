import React, { useState } from 'react';

export default function HiFiDualDeckBattle() {
  // Theme Toggle: 'black' (Aiwa Dark) or 'silver' (Aiwa Silver)
  const [theme, setTheme] = useState('black');

  // Input states
  const [artistA, setArtistA] = useState('');
  const [albumA, setAlbumA] = useState('');
  const [artistB, setArtistB] = useState('');
  const [albumB, setAlbumB] = useState('');

  // Style configurations based on theme finish
  const styles = {
    black: {
      chassis: 'bg-zinc-950 border-zinc-800 text-zinc-100 shadow-2xl',
      stackPanel: 'bg-gradient-to-b from-zinc-900 via-zinc-950 to-black border-zinc-800',
      centerUnit: 'bg-neutral-900 border-zinc-800',
      displayScreen: 'bg-black border-zinc-800 text-amber-500',
      deckDoor: 'bg-zinc-900/90 border-zinc-700/80',
      metalButton: 'bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-700',
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
      metalButton: 'bg-stone-200 border-stone-400 text-stone-800 hover:bg-stone-100',
      highlightBtn: 'bg-cyan-500 hover:bg-cyan-400 text-black font-black',
      accentText: 'text-cyan-600',
      ledOn: 'bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]',
    }
  };

  const current = styles[theme];

  return (
    <div className="min-h-screen bg-neutral-950 text-white p-4 md:p-8 flex flex-col items-center justify-center font-sans">
      
      {/* TOP HEADER & SKIN TOGGLE */}
      <header className="w-full max-w-5xl flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black tracking-wider uppercase text-amber-500">
            Side A / Side B
          </h1>
          <p className="text-xs text-neutral-400 font-mono">DUAL CASSETTE HI-FI TRACK BATTLE</p>
        </div>

        {/* Finish Toggle Button */}
        <div className="flex items-center gap-2 bg-neutral-900 border border-neutral-800 p-1.5 rounded-lg">
          <span className="text-xs font-bold text-neutral-400 px-2 uppercase">Finish:</span>
          <button
            onClick={() => setTheme('black')}
            className={`px-3 py-1 text-xs font-black rounded transition-all ${
              theme === 'black' ? 'bg-amber-500 text-black shadow' : 'text-neutral-400 hover:text-white'
            }`}
          >
            MATTE BLACK
          </button>
          <button
            onClick={() => setTheme('silver')}
            className={`px-3 py-1 text-xs font-black rounded transition-all ${
              theme === 'silver' ? 'bg-stone-200 text-black shadow' : 'text-neutral-400 hover:text-white'
            }`}
          >
            VINTAGE SILVER
          </button>
        </div>
      </header>

      {/* 90s HI-FI SYSTEM MAIN CHASSIS */}
      <main className={`w-full max-w-5xl rounded-2xl border-4 p-4 md:p-6 transition-colors duration-300 ${current.chassis} ${current.stackPanel}`}>
        
        {/* HI-FI SYSTEM STRUCTURE: LEFT DECK | CENTER UNIT | RIGHT DECK */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* ================= LEFT CASSETTE BAY (DECK 1) ================= */}
          <div className={`lg:col-span-4 rounded-xl border-2 p-4 flex flex-col justify-between relative shadow-inner ${current.deckDoor}`}>
            <div>
              <div className="flex justify-between items-center mb-3">
                <span className={`text-xs font-black tracking-wider uppercase ${current.accentText}`}>
                  DECK 1 • SIDE A
                </span>
                <span className="text-[9px] font-mono bg-black/20 px-2 py-0.5 rounded border border-current/20">
                  HIGH BIAS
                </span>
              </div>

              {/* Cassette J-Card Insert Field */}
              <div className="bg-slate-50 text-slate-900 p-3.5 rounded-md border-2 border-slate-300 shadow-md mb-4">
                <div className="border-b-2 border-red-500 pb-1 mb-2 flex justify-between items-center">
                  <span className="text-[9px] font-black tracking-widest text-slate-700">TAPE I</span>
                  <span className="text-red-600 font-black text-xs">90 MIN</span>
                </div>

                <div className="space-y-2">
                  <div>
                    <label className="block text-[8px] font-sans font-bold text-slate-500 uppercase tracking-wider">Artist A</label>
                    <input
                      type="text"
                      value={artistA}
                      onChange={(e) => setArtistA(e.target.value)}
                      placeholder="e.g. Oasis"
                      className="w-full bg-transparent border-b border-dashed border-slate-400 font-bold text-blue-900 focus:outline-none focus:border-red-500 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-[8px] font-sans font-bold text-slate-500 uppercase tracking-wider">Album A</label>
                    <input
                      type="text"
                      value={albumA}
                      onChange={(e) => setAlbumA(e.target.value)}
                      placeholder="e.g. Definitely Maybe"
                      className="w-full bg-transparent border-b border-dashed border-slate-400 font-bold text-blue-900 focus:outline-none focus:border-red-500 text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Deck 1 Buttons & Reel Window */}
            <div className="space-y-3">
              {/* Cassette Window Graphic */}
              <div className="h-10 bg-black/80 rounded border border-neutral-700 flex items-center justify-around px-4">
                <div className="w-6 h-6 rounded-full border-2 border-white/40 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-white/60" />
                </div>
                <div className="text-[8px] font-mono text-neutral-500">PLAYING SIDE A</div>
                <div className="w-6 h-6 rounded-full border-2 border-white/40 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-white/60" />
                </div>
              </div>

              <div className="flex gap-2">
                <button className={`flex-1 py-1.5 rounded text-[11px] font-bold border ${current.metalButton}`}>
                  ▲ EJECT 1
                </button>
              </div>
            </div>
          </div>

          {/* ================= CENTER HI-FI CONTROL STACK ================= */}
          <div className={`lg:col-span-4 rounded-xl border-2 p-4 flex flex-col justify-between items-center text-center shadow-md ${current.centerUnit}`}>
            
            {/* Main Digital Display */}
            <div className={`w-full p-3 rounded-lg border-2 mb-4 ${current.displayScreen}`}>
              <div className="flex justify-between items-center text-[10px] font-mono mb-2">
                <span className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${current.ledOn}`} />
                  STEREO DUB
                </span>
                <span>00:00</span>
              </div>

              {/* Preset Graphic Equalizer Visualizer */}
              <div className="text-[8px] font-mono mb-1 text-neutral-400">GRAPHIC EQUALIZER</div>
              <div className="flex items-end justify-center gap-1 h-12 pt-1 border-t border-neutral-800">
                {[40, 75, 35, 90, 100, 65, 85, 45, 95, 50].map((h, i) => (
                  <div key={i} className="w-2 bg-current rounded-t opacity-90" style={{ height: `${h}%` }} />
                ))}
              </div>
            </div>

            {/* Tactile Master Dial */}
            <div className="my-2 flex flex-col items-center">
              <div className="w-20 h-20 rounded-full border-4 border-neutral-600 bg-gradient-to-b from-neutral-800 to-neutral-900 shadow-xl flex items-center justify-center relative cursor-pointer active:scale-95 transition-transform">
                <div className="w-1.5 h-6 bg-current rounded-full absolute top-1" />
                <span className="text-[9px] font-black tracking-widest text-neutral-400 uppercase">VOLUME</span>
              </div>
            </div>

            {/* Dubbing & Battle Action Button */}
            <button className={`w-full py-3 mt-3 rounded-xl text-xs tracking-widest uppercase shadow-lg transition-transform active:scale-95 ${current.highlightBtn}`}>
              ● START HIGH DUB BATTLE
            </button>
          </div>

          {/* ================= RIGHT CASSETTE BAY (DECK 2) ================= */}
          <div className={`lg:col-span-4 rounded-xl border-2 p-4 flex flex-col justify-between relative shadow-inner ${current.deckDoor}`}>
            <div>
              <div className="flex justify-between items-center mb-3">
                <span className={`text-xs font-black tracking-wider uppercase ${current.accentText}`}>
                  DECK 2 • SIDE B
                </span>
                <span className="text-[9px] font-mono bg-black/20 px-2 py-0.5 rounded border border-current/20">
                  CHROME / TYPE II
                </span>
              </div>

              {/* Cassette J-Card Insert Field */}
              <div className="bg-slate-50 text-slate-900 p-3.5 rounded-md border-2 border-slate-300 shadow-md mb-4">
                <div className="border-b-2 border-red-500 pb-1 mb-2 flex justify-between items-center">
                  <span className="text-[9px] font-black tracking-widest text-slate-700">TAPE II</span>
                  <span className="text-red-600 font-black text-xs">90 MIN</span>
                </div>

                <div className="space-y-2">
                  <div>
                    <label className="block text-[8px] font-sans font-bold text-slate-500 uppercase tracking-wider">Artist B</label>
                    <input
                      type="text"
                      value={artistB}
                      onChange={(e) => setArtistB(e.target.value)}
                      placeholder="e.g. Metallica"
                      className="w-full bg-transparent border-b border-dashed border-slate-400 font-bold text-blue-900 focus:outline-none focus:border-red-500 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-[8px] font-sans font-bold text-slate-500 uppercase tracking-wider">Album B</label>
                    <input
                      type="text"
                      value={albumB}
                      onChange={(e) => setAlbumB(e.target.value)}
                      placeholder="e.g. Master of Puppets"
                      className="w-full bg-transparent border-b border-dashed border-slate-400 font-bold text-blue-900 focus:outline-none focus:border-red-500 text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Deck 2 Buttons & Reel Window */}
            <div className="space-y-3">
              {/* Cassette Window Graphic */}
              <div className="h-10 bg-black/80 rounded border border-neutral-700 flex items-center justify-around px-4">
                <div className="w-6 h-6 rounded-full border-2 border-white/40 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-white/60" />
                </div>
                <div className="text-[8px] font-mono text-neutral-500">PLAYING SIDE B</div>
                <div className="w-6 h-6 rounded-full border-2 border-white/40 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-white/60" />
                </div>
              </div>

              <div className="flex gap-2">
                <button className={`flex-1 py-1.5 rounded text-[11px] font-bold border ${current.metalButton}`}>
                  ▲ EJECT 2
                </button>
              </div>
            </div>
          </div>

        </div>

      </main>
    </div>
  );
}
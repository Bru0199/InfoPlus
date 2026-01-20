"use client";

import React from "react";
import { Cloud, TrendingUp, Flag, Thermometer, Droplets, Wind } from "lucide-react";

// 1. WEATHER CARD
export const WeatherCard = ({ data }: { data: any }) => (
  <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-5 rounded-3xl shadow-lg w-full max-w-[280px]">
    <div className="flex justify-between items-start">
      <div>
        <h3 className="text-xl font-bold">{data.name}</h3>
        <p className="text-blue-100 text-xs">{data.weather[0].main}</p>
      </div>
      <Cloud className="h-8 w-8 text-white/80" />
    </div>
    <div className="my-4">
      <span className="text-5xl font-black">{Math.round(data.main.temp)}°</span>
    </div>
    <div className="grid grid-cols-2 gap-2 border-t border-white/20 pt-3 text-[10px]">
      <div className="flex items-center gap-1">
        <Droplets size={12} /> {data.main.humidity}%
      </div>
      <div className="flex items-center gap-1">
        <Wind size={12} /> {data.wind.speed}m/s
      </div>
    </div>
  </div>
);

// 2. STOCK CARD
export const StockCard = ({ data }: { data: any }) => {
  const isPositive = data.change >= 0;
  return (
    <div className="bg-white dark:bg-zinc-900 border border-[var(--border)] p-5 rounded-3xl shadow-md w-full max-w-[280px]">
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs font-bold text-zinc-400">{data.code}</span>
        <TrendingUp size={16} className={isPositive ? "text-green-500" : "text-red-500"} />
      </div>
      <div className="text-3xl font-black text-[var(--text-main)] mb-1">
        ${data.close.toFixed(2)}
      </div>
      <div className={`text-xs font-bold ${isPositive ? "text-green-500" : "text-red-500"}`}>
        {isPositive ? "+" : ""}{data.change_p}%
      </div>
    </div>
  );
};

// 3. F1 MATCH CARD
export const F1Card = ({ data }: { data: any }) => (
  <div className="bg-zinc-950 text-white p-5 rounded-3xl shadow-2xl border-l-4 border-red-600 w-full max-w-[300px]">
    <div className="flex items-center gap-2 mb-4">
      <Flag size={16} className="text-red-600" />
      <span className="text-[10px] font-black tracking-widest uppercase text-zinc-400">Next Grand Prix</span>
    </div>
    <h3 className="text-lg font-black leading-tight mb-1">{data.raceName}</h3>
    <p className="text-xs text-zinc-400 mb-4">{data.Circuit.circuitName}</p>
    <div className="bg-zinc-900 rounded-2xl p-3">
      <div className="flex justify-between text-[11px] mb-2">
        <span className="text-zinc-500">Race Date</span>
        <span className="font-bold">{new Date(data.date).toLocaleDateString()}</span>
      </div>
      <div className="flex justify-between text-[11px]">
        <span className="text-zinc-500">Qualifying</span>
        <span className="font-bold">{data.Qualifying.time}</span>
      </div>
    </div>
  </div>
);
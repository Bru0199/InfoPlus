"use client";

import React from "react";
import {
  Cloud,
  TrendingUp,
  Flag,
  Thermometer,
  Droplets,
  Wind,
} from "lucide-react";

const toNumber = (value: any, fallback: number | null = null) => {
  const n = typeof value === "string" ? Number(value) : typeof value === "number" ? value : NaN;
  return Number.isFinite(n) ? n : fallback;
};

// 1. WEATHER CARD
export const WeatherCard = ({ data }: { data: any }) => {
  const name = data?.name ?? data?.location ?? "Weather";
  const temp = data?.main?.temp ?? data?.temperature ?? data?.temp ?? null;
  const humidity = data?.main?.humidity ?? data?.humidity ?? null;
  const wind = data?.wind?.speed ?? data?.windSpeed ?? data?.speed ?? null;
  const condition =
    (Array.isArray(data?.weather) && data?.weather[0]?.main) ||
    data?.condition ||
    data?.summary ||
    "";

  return (
    <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-5 rounded-3xl shadow-lg w-full max-w-[280px]">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-bold">{name}</h3>
          <p className="text-blue-100 text-xs">{condition}</p>
        </div>
        <Cloud className="h-8 w-8 text-white/80" />
      </div>
      <div className="my-4">
        <span className="text-5xl font-black">{temp !== null ? Math.round(temp) : "--"}°</span>
      </div>
      <div className="grid grid-cols-2 gap-2 border-t border-white/20 pt-3 text-[10px]">
        <div className="flex items-center gap-1">
          <Droplets size={12} /> {humidity !== null ? `${humidity}%` : "--"}
        </div>
        <div className="flex items-center gap-1">
          <Wind size={12} /> {wind !== null ? `${wind} m/s` : "--"}
        </div>
      </div>
    </div>
  );
};

// 2. STOCK CARD
export const StockCard = ({ data }: { data: any }) => {
  const price = toNumber(data?.close ?? data?.price ?? data?.current ?? data?.last ?? data?.value);
  const changePct = toNumber(
    data?.change_p ?? data?.percentChange ?? data?.percent ?? data?.percent_change ?? data?.changePercent,
  );
  const changeAbs = toNumber(data?.change ?? data?.change_amount);
  const code = data?.code ?? data?.symbol ?? data?.ticker ?? data?.name ?? "N/A";
  const isPositive = (changePct ?? 0) >= 0;

  if (price === null) {
    return (
      <div className="bg-white dark:bg-zinc-900 border border-[var(--border)] p-5 rounded-3xl shadow-md w-full max-w-[280px]">
        <div className="text-sm text-zinc-500">No stock data available</div>
      </div>
    );
  }
  return (
    <div className="bg-white dark:bg-zinc-900 border border-[var(--border)] p-5 rounded-3xl shadow-md w-full max-w-[280px]">
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs font-bold text-zinc-400">{code}</span>
        <TrendingUp
          size={16}
          className={isPositive ? "text-green-500" : "text-red-500"}
        />
      </div>
      <div className="text-3xl font-black text-[var(--text-main)] mb-1">
        ${price.toFixed(2)}
      </div>
      <div
        className={`text-xs font-bold ${isPositive ? "text-green-500" : "text-red-500"}`}
      >
        {isPositive ? "+" : ""}
        {(changePct ?? 0).toFixed(2)}% {changeAbs !== null ? `(${changeAbs.toFixed(2)})` : ""}
      </div>
    </div>
  );
};

// 3. F1 MATCH CARD
export const F1Card = ({ data }: { data: any }) => (
  <div className="bg-gradient-to-br from-orange-500 to-orange-600 dark:from-zinc-900 dark:to-zinc-950 text-black dark:text-white p-5 rounded-3xl shadow-2xl border-l-4 border-orange-600 dark:border-red-600 w-full max-w-[300px]">
    <div className="flex items-center gap-2 mb-4">
      <Flag size={16} className="text-black dark:text-red-600" />
      <span className="text-[10px] font-black tracking-widest uppercase text-black/80 dark:text-zinc-400">
        Next Grand Prix
      </span>
    </div>
    <h3 className="text-lg font-black leading-tight mb-1 text-black dark:text-white">{data.raceName}</h3>
    <p className="text-xs text-black/70 dark:text-zinc-300 mb-4">{data.Circuit.circuitName}</p>
    <div className="bg-white/30 dark:bg-zinc-900 rounded-2xl p-3">
      <div className="flex justify-between text-[11px] mb-2">
        <span className="text-black/70 dark:text-zinc-400">Race Date</span>
        <span className="font-bold text-black dark:text-white">
          {new Date(data.date).toLocaleDateString()}
        </span>
      </div>
      <div className="flex justify-between text-[11px]">
        <span className="text-black/70 dark:text-zinc-400">Qualifying</span>
        <span className="font-bold text-black dark:text-white">{data.Qualifying.time}</span>
      </div>
    </div>
  </div>
);

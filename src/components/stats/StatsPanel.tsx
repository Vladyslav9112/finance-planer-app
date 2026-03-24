import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LineChart,
  Line,
  Area,
  AreaChart,
  Legend,
} from "recharts";
import { formatCurrency } from "../../lib/utils";

const tooltipStyle = {
  backgroundColor: "#212133",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: "12px",
  color: "#f8f8ff",
  fontSize: "12px",
  fontFamily: "Manrope",
};

const axisStyle = {
  fill: "rgba(255,255,255,0.35)",
  fontSize: 11,
  fontFamily: "Manrope",
};

// ─── Income vs Expenses Bar Chart ─────────────────────────────────────────────

interface IncomeExpenseData {
  name: string;
  income: number;
  expense: number;
}

export const IncomeExpenseChart: React.FC<{ data: IncomeExpenseData[] }> = ({
  data,
}) => (
  <ResponsiveContainer width="100%" height={180}>
    <BarChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
      <CartesianGrid
        strokeDasharray="3 3"
        stroke="rgba(255,255,255,0.04)"
        vertical={false}
      />
      <XAxis
        dataKey="name"
        tick={axisStyle}
        axisLine={false}
        tickLine={false}
      />
      <YAxis tick={axisStyle} axisLine={false} tickLine={false} />
      <Tooltip
        contentStyle={tooltipStyle}
        cursor={{ fill: "rgba(255,255,255,0.04)" }}
        formatter={(v: number) => [formatCurrency(v), ""]}
      />
      <Legend
        wrapperStyle={{
          fontSize: 11,
          fontFamily: "Manrope",
          color: "rgba(255,255,255,0.5)",
        }}
        iconType="circle"
        iconSize={8}
      />
      <Bar
        dataKey="income"
        name="Доходи"
        fill="#a3e635"
        radius={[4, 4, 0, 0]}
        opacity={0.85}
      />
      <Bar
        dataKey="expense"
        name="Витрати"
        fill="#a78bfa"
        radius={[4, 4, 0, 0]}
        opacity={0.85}
      />
    </BarChart>
  </ResponsiveContainer>
);

// ─── Earnings Area Chart ───────────────────────────────────────────────────────

interface EarningsData {
  name: string;
  earnings: number;
  paidOut: number;
}

export const EarningsAreaChart: React.FC<{ data: EarningsData[] }> = ({
  data,
}) => (
  <ResponsiveContainer width="100%" height={160}>
    <AreaChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
      <defs>
        <linearGradient id="earningsGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="#a78bfa" stopOpacity={0.3} />
          <stop offset="95%" stopColor="#a78bfa" stopOpacity={0} />
        </linearGradient>
        <linearGradient id="paidOutGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="#a3e635" stopOpacity={0.25} />
          <stop offset="95%" stopColor="#a3e635" stopOpacity={0} />
        </linearGradient>
      </defs>
      <CartesianGrid
        strokeDasharray="3 3"
        stroke="rgba(255,255,255,0.04)"
        vertical={false}
      />
      <XAxis
        dataKey="name"
        tick={axisStyle}
        axisLine={false}
        tickLine={false}
      />
      <YAxis tick={axisStyle} axisLine={false} tickLine={false} />
      <Tooltip
        contentStyle={tooltipStyle}
        cursor={{ stroke: "rgba(255,255,255,0.08)", strokeWidth: 1 }}
        formatter={(v: number) => [formatCurrency(v), ""]}
      />
      <Area
        type="monotone"
        dataKey="earnings"
        name="Зароблено"
        stroke="#a78bfa"
        strokeWidth={2}
        fill="url(#earningsGrad)"
      />
      <Area
        type="monotone"
        dataKey="paidOut"
        name="Видано"
        stroke="#a3e635"
        strokeWidth={2}
        fill="url(#paidOutGrad)"
      />
    </AreaChart>
  </ResponsiveContainer>
);

// ─── Balance Line Chart ────────────────────────────────────────────────────────

interface BalanceData {
  name: string;
  balance: number;
}

export const BalanceLineChart: React.FC<{ data: BalanceData[] }> = ({
  data,
}) => (
  <ResponsiveContainer width="100%" height={140}>
    <LineChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
      <defs>
        <linearGradient id="balanceGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="#2dd4bf" stopOpacity={0.2} />
          <stop offset="95%" stopColor="#2dd4bf" stopOpacity={0} />
        </linearGradient>
      </defs>
      <CartesianGrid
        strokeDasharray="3 3"
        stroke="rgba(255,255,255,0.04)"
        vertical={false}
      />
      <XAxis
        dataKey="name"
        tick={axisStyle}
        axisLine={false}
        tickLine={false}
      />
      <YAxis tick={axisStyle} axisLine={false} tickLine={false} />
      <Tooltip
        contentStyle={tooltipStyle}
        cursor={{ stroke: "rgba(255,255,255,0.08)", strokeWidth: 1 }}
        formatter={(v: number) => [formatCurrency(v), "Баланс"]}
      />
      <Line
        type="monotone"
        dataKey="balance"
        stroke="#2dd4bf"
        strokeWidth={2.5}
        dot={{ fill: "#2dd4bf", r: 3, strokeWidth: 0 }}
        activeDot={{ r: 5, fill: "#2dd4bf" }}
      />
    </LineChart>
  </ResponsiveContainer>
);

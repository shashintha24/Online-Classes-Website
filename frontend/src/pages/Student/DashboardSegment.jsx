import { useState, useEffect, useRef } from "react";
import React from 'react';

function DashboardPage({ t }) {
  const stats = getMarkStats(PAPER_RESULTS);

  return (
    <div className="p-6 space-y-5">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <MetricCard label="Average Mark" value={`${stats.avg}%`} color="text-[#a435f0]" t={t} />
        <MetricCard label="Attendance" value="88%" color="text-emerald-500" t={t} />
        <MetricCard label="A Grade %" value={`${stats.aPercent}%`} color="text-blue-500" t={t} />
        <MetricCard label="B Grade %" value={`${stats.bPercent}%`} color="text-amber-500" t={t} />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <MetricCard label="Class Rank" value="#3" color="text-[#3c3489]" t={t} />
        <MetricCard label="Percentile" value="89th" color="text-amber-500" t={t} />
        <MetricCard label="Papers Done" value={`${PAPER_RESULTS.length}`} color="text-[#a435f0]" t={t} />
        <MetricCard label="Latest Mark" value={`${PAPER_RESULTS[PAPER_RESULTS.length - 1].mark}%`} color="text-emerald-500" t={t} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SectionCard title="Marks Overview" t={t}>
          <div className="space-y-3">
            {[["Physics", 74, "bg-[#a435f0]"], ["Maths", 81, "bg-emerald-500"], ["Chemistry", 67, "bg-orange-500"]].map(([subj, val, clr]) => (
              <div key={subj}>
                <div className={`flex justify-between text-sm mb-1 ${t.text}`}>
                  <span>{subj}</span><span className="font-semibold">{val}%</span>
                </div>
                <ProgressBar value={val} color={clr} t={t} />
              </div>
            ))}
          </div>
        </SectionCard>

        <div className="space-y-4">
          <SectionCard title="Class Standing" t={t}>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full border-2 border-[#a435f0] flex flex-col items-center justify-center flex-shrink-0">
                <span className="text-xl font-bold text-[#a435f0]">#3</span>
                <span className={`text-[10px] ${t.textTert}`}>of 28</span>
              </div>
              <div className="flex-1">
                <p className={`text-sm ${t.textSub} mb-1`}>Better than 89% of class</p>
                <ProgressBar value={89} color="bg-[#a435f0]" t={t} />
              </div>
            </div>
          </SectionCard>

          <div className={`${t.feeGreen} rounded-xl p-4`}>
            <p className="text-xs font-semibold uppercase tracking-wider mb-1 opacity-70">April 2026 Fee</p>
            <p className="text-2xl font-bold">LKR 4,500</p>
            <p className="text-sm mt-0.5 opacity-80">Paid on April 3</p>
            <button className="mt-3 w-full flex items-center justify-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold py-2 rounded-md transition-colors cursor-pointer">
              <Icons.Download /> Download Receipt
            </button>
          </div>
        </div>
      </div>

      <SectionCard title="Upcoming & Recent" t={t}>
        <table className="w-full text-sm">
          <thead>
            <tr className={t.tableHead}>
              {["Date", "Subject", "Type", "Status"].map(h => (
                <th key={h} className="text-left text-xs font-semibold uppercase tracking-wider py-2 px-3 first:pl-0">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              ["Today 4:00 PM", "Physics", "Class", "green", "Today"],
              ["Apr 14", "Physics Paper 4", "Assignment due", "amber", "Submitted"],
              ["Apr 16", "Maths Problem Set 7", "Assignment due", "blue", "Pending"],
              ["Apr 18", "Chemistry Lab Report 2", "Assignment due", "gray", "Not started"],
            ].map(([date, subj, type, badge, status]) => (
              <tr key={date + subj} className={t.tableRow}>
                <td className={`py-3 px-3 pl-0 ${t.text}`}>{date}</td>
                <td className={`py-3 px-3 ${t.text}`}>{subj}</td>
                <td className={`py-3 px-3 ${t.textSub}`}>{type}</td>
                <td className="py-3 px-3"><Badge variant={badge} t={t}>{status}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </SectionCard>

      <PerformanceSparkline rows={PAPER_RESULTS} t={t} />
    </div>
  );
}
import React from 'react';
import { Team } from '../../types/event';
import { ScoreSelector } from '../ui/ScoreSelector';
import { TeamMark } from '../ui/TeamMark';

export function JudgeTeamRow({
  team,
  index,
  value,
  onChange





}: {team: Team;index: number;value: number;onChange: (v: number) => void;}) {
  const done = value > 0;
  return (
    <li className="relative overflow-hidden rounded-lg border border-line bg-ink-900 shadow-panel">
      <div className="flex items-center gap-4 border-b border-line bg-ink-850 px-5 py-3.5 pr-9">
        <span
          className={`num text-[11px] font-extrabold tracking-tech ${
          done ? 'text-brand' : 'text-fg-dim'}`
          }>
          
          {String(index + 1).padStart(2, '0')}
        </span>
        <TeamMark team={team} size={44} active={done} />
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-lg font-extrabold leading-tight text-fg">
            {team.name}
          </h3>
          <p className="truncate text-xs font-semibold text-fg-muted">
            {team.tagline}
          </p>
        </div>
      </div>
      <div className="px-5 py-4">
        <ScoreSelector value={value} onChange={onChange} teamName={team.name} />
      </div>
    </li>);

}
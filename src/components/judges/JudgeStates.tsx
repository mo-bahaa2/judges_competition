import React from 'react';
import { motion } from 'framer-motion';
import {
  CheckIcon,
  ClockIcon,
  CameraIcon,
  LockIcon,
  MapPinIcon,
  ShieldCheckIcon } from
'lucide-react';
import { Team } from '../../types/event';
import { TechLabel } from '../ui/TechScreen';
import { LogoMark } from '../brand/Logo';

const RANK_WORD = ['1st', '2nd', '3rd'];

function Frame({
  children,
  icon,
  tone = 'brand'




}: {children: React.ReactNode;icon: React.ReactNode;tone?: 'brand' | 'neutral';}) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-5 py-14 text-center">
      <motion.span
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.28, ease: [0.23, 1, 0.32, 1] }}
        className={`grid h-24 w-24 place-items-center rounded-lg border ${
        tone === 'brand' ?
        'border-brand-shade bg-brand text-ink-950' :
        'border-line-strong bg-ink-900 text-fg-muted'}`
        }>
        
        {icon}
      </motion.span>
      {children}
    </div>);

}

import { LampContainer } from '../ui/LampContainer';

const AnimatedCheckIcon = ({ className, strokeWidth }: { className: string, strokeWidth: number }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <motion.path
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
      d="M20 6L9 17L4 12"
    />
  </svg>
);

export function VoteSubmitted({
  ballot,
  teams
}: {ballot: string[];teams: Team[];}) {
  return (
    <>
      <Frame icon={<AnimatedCheckIcon className="h-12 w-12 text-ink-950" strokeWidth={3} />}>
        <h1 className="mt-7 text-3xl font-extrabold uppercase leading-tight text-fg">
          Evaluation Submitted
        </h1>
        <p className="mt-2 text-base font-medium text-fg-muted">
          Your rankings are locked and sent to the control room.
        </p>
        
        <div className="mt-8 flex w-full items-center gap-2 rounded-sm border border-line bg-ink-950 px-5 py-4 z-50">
          <ShieldCheckIcon className="h-4 w-4 text-brand" strokeWidth={2} />
          <TechLabel>CANNOT BE EDITED AFTER SUBMISSION</TechLabel>
        </div>
      </Frame>
    </>
  );
}

export function AlreadyVoted() {
  return (
    <Frame tone="neutral" icon={<LockIcon className="h-11 w-11" strokeWidth={2} />}>
      <h1 className="mt-7 text-4xl font-extrabold leading-tight text-fg">
        You've Already Voted
      </h1>
      <p className="mt-2 text-base font-medium text-fg-muted">
        You can only submit one vote during this event. Your ballot is safely
        recorded.
      </p>
      <div className="mt-8 w-full rounded-lg border border-line bg-ink-900 px-5 py-4 text-left">
        <TechLabel>What happens next</TechLabel>
        <p className="mt-2 text-sm font-semibold text-fg-soft">
          Results are revealed on the main stage screen once the host closes
          voting.
        </p>
      </div>
    </Frame>);

}

export function VotingNotOpen({ starting }: {starting: boolean;}) {
  return (
    <Frame tone="neutral" icon={<ClockIcon className="h-11 w-11" strokeWidth={2} />}>
      <h1 className="mt-7 text-4xl font-extrabold leading-tight text-fg">
        {starting ? 'Voting Starts Soon' : 'Voting Not Open Yet'}
      </h1>
      <p className="mt-2 text-base font-medium text-fg-muted">
        Keep this page open. Voting unlocks the moment the host opens the round.
      </p>
      <div className="mt-8 flex w-full items-center gap-3 rounded-sm border border-brand/30 bg-brand/[0.07] px-4 py-3 text-left">
        <span className="led-blink h-2.5 w-2.5 rounded-full bg-brand shadow-led" />
        <span className="text-xs font-extrabold uppercase tracking-tech text-brand">
          Standing by for host
        </span>
      </div>
    </Frame>);

}

export function VotingClosed({
  headline,
  body,
  venue,
  sponsors





}: {headline: string;body: string;venue: string;sponsors: string[];}) {
  return (
    <div className="mx-auto max-w-md px-5 py-12">
      <div className="flex flex-col items-center text-center">
        <span className="grid h-20 w-20 place-items-center rounded-lg border border-line-strong bg-ink-900">
          <LogoMark size={44} />
        </span>
        <h1 className="mt-6 text-4xl font-extrabold leading-tight text-fg">
          Voting Has Ended
        </h1>
        <p className="mt-2 text-base font-medium text-fg-muted">
          Thank you for participating.
        </p>
      </div>

      <div className="mt-9 rounded-lg border border-line bg-ink-900 p-5 shadow-panel">
        <TechLabel>Event update</TechLabel>
        <h2 className="mt-2 text-xl font-extrabold text-brand">{headline}</h2>
        <p className="mt-2 text-sm font-medium leading-relaxed text-fg-soft">
          {body}
        </p>
        <div className="mt-4 flex items-center gap-2 border-t border-line pt-4">
          <MapPinIcon className="h-4 w-4 text-fg-dim" strokeWidth={2} />
          <span className="text-xs font-bold text-fg-muted">{venue}</span>
        </div>
      </div>

      <a
        href="#"
        className="mt-4 flex items-center justify-center gap-2 rounded-sm border border-line bg-ink-900 py-3 text-sm font-bold text-fg-soft transition-colors duration-150 hover:border-brand/50 hover:text-brand">
        
        <CameraIcon className="h-4 w-4" strokeWidth={2} />
        Follow the championship
      </a>
    </div>);

}
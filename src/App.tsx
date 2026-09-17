import React, { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowLeftIcon,
  CheckIcon,
  GavelIcon,
  ScaleIcon,
  SendIcon,
  ShieldCheckIcon
} from 'lucide-react';
import { useEvent } from './contexts/EventContext';
import { Button } from './components/ui/Button';
import { LogoLockup, LogoMark } from './components/brand/Logo';
import { TeamSelectCard } from './components/judges/TeamSelectCard';
import { Divider, TechLabel, TechScreen } from './components/ui/TechScreen';
import { StatusBadge } from './components/ui/Status';
import { Input } from './components/ui/Field';
import { TeamMark } from './components/ui/TeamMark';
import { useToast } from './components/ui/Toast';
import { VotingClosed, VotingNotOpen } from './components/judges/JudgeStates';

const RANK_WORD = ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th'];

type Step = 'intro' | 'evaluate' | 'review' | 'done';

export default function App() {
  const { teams, settings, state, castJudgeVote, hasVoted } = useEvent();
  const toast = useToast();
  const [judgeName, setJudgeName] = useState(() => {
    return typeof localStorage !== 'undefined' ? localStorage.getItem('judge_name') || '' : '';
  });
  const [step, setStep] = useState<Step>(hasVoted ? 'done' : 'intro');
  const [picks, setPicks] = useState<string[]>([]);
  const [sending, setSending] = useState(false);

  const live = state === 'voting_live' || state === 'ending_soon';

  const rankOf = (id: string) => {
    const i = picks.indexOf(id);
    return i === -1 ? null : i + 1;
  };

  const toggle = (id: string) => {
    setPicks((p) =>
      p.includes(id) ? p.filter((x) => x !== id) : p.length < teams.length ? [...p, id] : p
    );
  };

  const nextLabel = useMemo(() => {
    if (picks.length === 0) return 'Tap your 1st place team';
    if (picks.length === 1) return 'Now pick your 2nd place team';
    if (picks.length < teams.length - 1) return `Pick your ${RANK_WORD[picks.length]} place`;
    if (picks.length === teams.length - 1) return 'One more — pick your last place';
    return `Review your ranking`;
  }, [picks.length, teams.length]);

  const submit = async () => {
    setSending(true);
    const success = await castJudgeVote(judgeName, picks);
    setSending(false);
    
    if (success) {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('judge_name', judgeName);
      }
      setStep('done');
      toast('Evaluation submitted', 'ok');
    } else {
      toast('Failed to submit evaluation. Please try again.', 'error');
    }
  };

  let body: React.ReactNode = null;

  if (step === 'done' || hasVoted) {
    body = (
        <div className="mx-auto flex max-w-md flex-col items-center px-5 py-16 text-center">
          <motion.span
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.28, ease: [0.23, 1, 0.32, 1] }}
            className="grid h-24 w-24 place-items-center rounded-lg border border-brand-shade bg-brand text-ink-950">
            <CheckIcon className="h-12 w-12" strokeWidth={3} />
          </motion.span>
          <h1 className="mt-7 text-4xl font-extrabold leading-tight">
            Evaluation Submitted
          </h1>
          <p className="mt-2 text-base font-medium text-fg-muted">
            {judgeName}, your rankings are locked and sent to the control room.
          </p>
          
          <div className="mt-8 w-full rounded-lg border border-line bg-ink-900 p-5">
            <div className="flex items-center gap-2">
              <ShieldCheckIcon className="h-4 w-4 text-brand" strokeWidth={2} />
              <TechLabel>Cannot be edited after submission</TechLabel>
            </div>
          </div>
          <div className="mt-8">
            <LogoMark size={40} />
          </div>
        </div>
    );
  } else if (state === 'not_started' || state === 'starting_soon') {
    body = <VotingNotOpen starting={state === 'starting_soon'} />;
  } else if (!live) {
    body = <VotingClosed headline={settings.postVotingHeadline} body={settings.postVotingBody} venue={settings.venue} sponsors={settings.sponsors} />;
  } else {
    if (step === 'intro') {
      body = (
        <div className="mx-auto max-w-2xl px-5 py-14">
          <div className="flex flex-col items-center text-center">
            <span className="grid h-20 w-20 place-items-center rounded-lg border border-line-strong bg-ink-900">
              <ScaleIcon className="h-9 w-9 text-brand" strokeWidth={1.5} />
            </span>
            <TechLabel className="mt-6">
              {settings.round} · Judges evaluation
            </TechLabel>
            <h1 className="mt-2 text-[42px] font-extrabold leading-[1.05]">
              Your Expertise <span className="text-brand">Matters</span>
            </h1>
            <p className="mt-3 max-w-lg text-base font-medium leading-relaxed text-fg-muted">
              Your ranking plays an important role in determining tonight's winner.
            </p>
          </div>

          <div className="mt-10 grid gap-3 sm:grid-cols-2">
            {[
              { k: 'Teams to rank', v: `${teams.length}`, s: 'All required' },
              {
                k: 'Panel weight',
                v: `${settings.judgesWeight}%`,
                s: `Audience ${settings.audienceWeight}%`
              }
            ].map((x) => (
              <div
                key={x.k}
                className="rounded-lg border border-line bg-ink-900 px-5 py-4">
                <TechLabel>{x.k}</TechLabel>
                <div className="num mt-1.5 text-3xl font-extrabold text-brand">
                  {x.v}
                </div>
                <div className="mt-1 text-xs font-semibold text-fg-dim">
                  {x.s}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-lg border border-line bg-ink-900 p-6 shadow-panel">
            <TechLabel>Identify yourself</TechLabel>
            <div className="mt-4">
              <Input
                label="Your Full Name"
                placeholder="e.g. Dr. Ahmed"
                value={judgeName}
                onChange={(e) => setJudgeName(e.target.value)}
              />
            </div>
          </div>

          <Button
            size="xl"
            block
            disabled={judgeName.trim().length < 2}
            className="mt-6"
            icon={<GavelIcon className="h-5 w-5" strokeWidth={2.5} />}
            onClick={() => setStep('evaluate')}>
            Begin Evaluation
          </Button>
        </div>
      );
    } else if (step === 'evaluate') {
      body = (
        <div className="mx-auto max-w-4xl px-5 pb-44 pt-7">
          <div className="mt-2">
            <TechLabel>Step 01 / 02 · Rank all teams</TechLabel>
            <h1 className="mt-1.5 text-[40px] font-extrabold leading-[1.05]">
              Rank the <span className="text-brand">Teams</span>
            </h1>
          </div>

          <ul className="mt-6 space-y-3 sm:grid sm:grid-cols-2 sm:gap-3 sm:space-y-0">
            {teams.map((team) => (
              <li key={team.id}>
                <TeamSelectCard
                  team={team}
                  rank={rankOf(team.id)}
                  disabled={picks.length >= teams.length}
                  onToggle={() => toggle(team.id)}
                />
              </li>
            ))}
          </ul>

          <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-ink-950/95 backdrop-blur">
            <div className="mx-auto max-w-4xl px-5 py-4">
              <div className="mb-3 flex items-center gap-2">
                {Array.from({ length: teams.length }).map((_, i) => {
                  const id = picks[i];
                  const team = teams.find((t) => t.id === id);
                  return (
                    <div
                      key={i}
                      className={`flex h-11 flex-1 items-center gap-2 overflow-hidden rounded-sm border px-2.5 ${
                        team
                          ? 'border-brand/60 bg-brand/10'
                          : 'border-dashed border-line-strong bg-ink-900'
                      }`}>
                      <span
                        className={`num text-[10px] font-extrabold tracking-tech ${
                          team ? 'text-brand' : 'text-fg-dim'
                        }`}>
                        {RANK_WORD[i]}
                      </span>
                      <span className="truncate text-xs font-bold text-fg-soft hidden sm:inline-block">
                        {team ? team.name : '—'}
                      </span>
                    </div>
                  );
                })}
              </div>
              <AnimatePresence mode="wait">
                <motion.p
                  key={nextLabel}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="mb-2.5 text-center text-xs font-extrabold uppercase tracking-tech text-fg-muted">
                  {nextLabel}
                </motion.p>
              </AnimatePresence>
              <Button
                size="xl"
                block
                disabled={picks.length !== teams.length}
                onClick={() => setStep('review')}>
                Review Ranking
              </Button>
            </div>
          </div>
        </div>
      );
    } else if (step === 'review') {
      body = (
        <div className="mx-auto max-w-2xl px-5 pb-40 pt-8">
          <button
            onClick={() => setStep('evaluate')}
            className="mb-5 inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-tech text-fg-muted transition-colors duration-150 hover:text-brand">
            <ArrowLeftIcon className="h-4 w-4" strokeWidth={2.5} />
            Edit Ranking
          </button>
          <TechLabel>Step 02 / 02</TechLabel>
          <h1 className="mt-1.5 text-4xl font-extrabold leading-tight">
            Review Ranking
          </h1>
          <p className="mt-2 text-sm font-medium text-fg-muted">
            Submitted rankings are final and feed directly into the{' '}
            {settings.judgesWeight}% judges weighting.
          </p>
          <ul className="mt-6 space-y-3">
            {picks.map((id, i) => {
              const team = teams.find((t) => t.id === id)!;
              return (
                <motion.li
                  key={id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: i * 0.05,
                    duration: 0.25,
                    ease: [0.23, 1, 0.32, 1]
                  }}
                  className={`flex items-center gap-4 rounded-lg border px-4 py-4 ${
                    i === 0 ? 'border-brand-shade bg-brand' : 'border-line-strong bg-ink-900'
                  }`}>
                  <span
                    className={`num grid h-11 w-11 shrink-0 place-items-center rounded-full text-sm font-extrabold ${
                      i === 0 ? 'bg-ink-950 text-brand' : 'bg-brand text-ink-950'
                    }`}>
                    {RANK_WORD[i]}
                  </span>
                  <TeamMark team={team} size={44} tone={i === 0 ? 'light' : 'dark'} />
                  <span
                    className={`min-w-0 flex-1 truncate text-lg font-extrabold ${
                      i === 0 ? 'text-ink-950' : 'text-fg'
                    }`}>
                    {team.name}
                  </span>
                </motion.li>
              );
            })}
          </ul>
          <div className="fixed inset-x-0 bottom-0 border-t border-line bg-ink-950/95 px-5 py-4 backdrop-blur">
            <div className="mx-auto max-w-2xl">
              <Button size="xl" block loading={sending} onClick={submit}>
                {sending ? 'Submitting…' : 'Confirm Evaluation'}
              </Button>
            </div>
          </div>
        </div>
      );
    }
  }

  return (
    <TechScreen>
      <header className="sticky top-0 z-30 border-b border-line bg-ink-950/95 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-3 px-5 py-3.5">
          <LogoLockup size={34} subtitle="Judges Panel" />
          <StatusBadge tone={live ? "ok" : "idle"}>
            {judgeName ? judgeName.split(' ')[0] : 'Ready'}
          </StatusBadge>
        </div>
      </header>

      {body}
    </TechScreen>
  );
}
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState } from
'react';
import {
  AudienceVote,
  DisplayControl,
  DisplayMode,
  EventSettings,
  EventState,
  Judge,
  Team,
  TeamResult } from
'../types/event';
import {
  DEFAULT_SETTINGS,
  INITIAL_JUDGES,
  TEAMS,
  seedVotes } from
'../data/event';
import { computeResults } from '../utils/scoring';

interface EventContextValue {
  teams: Team[];
  settings: EventSettings;
  updateSettings: (patch: Partial<EventSettings>) => void;
  state: EventState;
  setState: (s: EventState) => void;
  timer: number;
  running: boolean;
  votes: AudienceVote[];
  judges: Judge[];
  display: DisplayControl;
  results: TeamResult[];
  lastMover: string | null;
  hasVoted: boolean;
  myBallot: string[] | null;
  simulate: boolean;
  setSimulate: (v: boolean) => void;
  // actions
  startVoting: () => void;
  pauseVoting: () => void;
  stopVoting: () => void;
  resetTimer: () => void;
  resetVoting: () => void;
  castVote: (ranking: string[], voterName?: string) => void;
  deleteVote: (id: string) => void;
  castJudgeVote: (name: string, ranking: string[]) => void;
  deleteJudgeVote: (id: string) => void;
  setDisplayMode: (mode: DisplayMode) => void;
  setDisplayPower: (on: boolean) => void;
  publishWinner: () => void;
  finishEvent: () => void;
  updateTeam: (id: string, patch: Partial<Team>) => void;
}

const EventContext = createContext<EventContextValue | null>(null);

export function EventProvider({ children }: {children: React.ReactNode;}) {
  const [settings, setSettings] = useState<EventSettings>(DEFAULT_SETTINGS);
  const [teams, setTeams] = useState<Team[]>(TEAMS);
  const [state, setState] = useState<EventState>('voting_live');
  const [timer, setTimer] = useState(45);
  const [running, setRunning] = useState(true);
  const [votes, setVotes] = useState<AudienceVote[]>(() => seedVotes());
  const [judges, setJudges] = useState<Judge[]>(INITIAL_JUDGES);
  const [display, setDisplay] = useState<DisplayControl>({
    power: true,
    mode: 'audience'
  });
  const [hasVoted, setHasVoted] = useState(false);
  const [myBallot, setMyBallot] = useState<string[] | null>(null);
  const [simulate, setSimulate] = useState(true);
  const [lastMover, setLastMover] = useState<string | null>(null);
  const prevOrder = useRef<string>('');

  /* countdown */
  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => {
      setTimer((t) => {
        if (t <= 1) {
          setRunning(false);
          setState('voting_closed');
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [running]);

  useEffect(() => {
    if (state === 'voting_live' && running && timer > 0 && timer <= 15)
    setState('ending_soon');
  }, [timer, running, state]);

  /* incoming audience ballots while voting is live */
  useEffect(() => {
    const live = state === 'voting_live' || state === 'ending_soon';
    if (!simulate || !live || !running) return;
    const id = window.setInterval(() => {
      const weights = ['a', 'a', 'a', 'b', 'b', 'c', 'c', 'd', 'e'];
      const picked: string[] = [];
      while (picked.length < 3) {
        const c = weights[Math.floor(Math.random() * weights.length)];
        if (!picked.includes(c)) picked.push(c);
      }
      setVotes((v) => [
      {
        id: `V-${Math.floor(2000 + Math.random() * 7999)}`,
        ts: Date.now(),
        ranking: picked,
        source: Math.random() > 0.15 ? 'qr' : 'kiosk'
      },
      ...v]
      );
    }, 2600);
    return () => window.clearInterval(id);
  }, [simulate, state, running]);

  const results = useMemo(
    () =>
    computeResults({
      teams,
      votes,
      judges,
      judgesWeight: settings.judgesWeight,
      audienceWeight: settings.audienceWeight
    }),
    [teams, votes, judges, settings.judgesWeight, settings.audienceWeight]
  );

  /* detect rank movement for broadcast highlight */
  useEffect(() => {
    const order = results.map((r) => r.team.id).join('');
    if (prevOrder.current && prevOrder.current !== order) {
      const moved = results.find(
        (r, i) => prevOrder.current[i] !== undefined && prevOrder.current[i] !== order[i]
      );
      if (moved) {
        setLastMover(moved.team.id);
        window.setTimeout(() => setLastMover(null), 2200);
      }
    }
    prevOrder.current = order;
  }, [results]);

  const startVoting = useCallback(() => {
    setState('voting_live');
    setRunning(true);
    setTimer((t) => t <= 0 ? settings.votingDuration : t);
    setDisplay((d) => ({ ...d, mode: 'voting_live' }));
  }, [settings.votingDuration]);

  const pauseVoting = useCallback(() => setRunning(false), []);

  const stopVoting = useCallback(() => {
    setRunning(false);
    setState('voting_closed');
  }, []);

  const resetTimer = useCallback(
    () => setTimer(settings.votingDuration),
    [settings.votingDuration]
  );

  const resetVoting = useCallback(() => {
    setVotes([]);
    setTimer(settings.votingDuration);
    setRunning(false);
    setState('not_started');
    setHasVoted(false);
    setMyBallot(null);
  }, [settings.votingDuration]);

  const castVote = useCallback((ranking: string[], voterName?: string) => {
    setVotes((v) => [
    {
      id: `V-${Math.floor(2000 + Math.random() * 7999)}`,
      ts: Date.now(),
      ranking,
      source: 'qr',
      voterName
    },
    ...v]
    );
    setHasVoted(true);
    setMyBallot(ranking);
  }, []);

  const deleteVote = useCallback(
    (id: string) => setVotes((v) => v.filter((x) => x.id !== id)),
    []
  );

  const castJudgeVote = useCallback((name: string, ranking: string[]) => {
    setJudges((js) => [
      {
        id: `J-${Math.floor(2000 + Math.random() * 7999)}`,
        label: `Judge ${js.length + 1}`,
        name,
        ranking,
        submitted: true,
        submittedAt: Date.now()
      },
      ...js
    ]);
  }, []);

  const deleteJudgeVote = useCallback(
    (id: string) => setJudges((js) => js.filter((x) => x.id !== id)),
    []
  );

  const setDisplayMode = useCallback((mode: DisplayMode) => {
    setDisplay((d) => ({ ...d, mode }));
  }, []);

  const setDisplayPower = useCallback(
    (on: boolean) => setDisplay((d) => ({ ...d, power: on })),
    []
  );

  const publishWinner = useCallback(() => {
    setRunning(false);
    setState('winner_published');
    setDisplay({ power: true, mode: 'winner' });
  }, []);

  const finishEvent = useCallback(() => {
    setState('finished');
    setDisplay({ power: true, mode: 'finished' });
  }, []);

  const updateSettings = useCallback(
    (patch: Partial<EventSettings>) => setSettings((s) => ({ ...s, ...patch })),
    []
  );

  const updateTeam = useCallback(
    (id: string, patch: Partial<Team>) =>
    setTeams((ts) => ts.map((t) => t.id === id ? { ...t, ...patch } : t)),
    []
  );

  const value: EventContextValue = {
    teams,
    settings,
    updateSettings,
    state,
    setState,
    timer,
    running,
    votes,
    judges,
    display,
    results,
    lastMover,
    hasVoted,
    myBallot,
    simulate,
    setSimulate,
    startVoting,
    pauseVoting,
    stopVoting,
    resetTimer,
    resetVoting,
    castVote,
    deleteVote,
    castJudgeVote,
    deleteJudgeVote,
    setDisplayMode,
    setDisplayPower,
    publishWinner,
    finishEvent,
    updateTeam
  };

  return <EventContext.Provider value={value}>{children}</EventContext.Provider>;
}

export function useEvent(): EventContextValue {
  const ctx = useContext(EventContext);
  if (!ctx) throw new Error('useEvent must be used inside EventProvider');
  return ctx;
}
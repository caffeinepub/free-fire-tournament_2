import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Tournament, LeaderboardEntry, Room, RegisterUserResult, LoginUserResult } from '../backend';

export function useGetTournaments() {
  const { actor, isFetching } = useActor();

  return useQuery<Tournament[]>({
    queryKey: ['tournaments'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getTournaments();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetLeaderboard() {
  const { actor, isFetching } = useActor();

  return useQuery<LeaderboardEntry[]>({
    queryKey: ['leaderboard'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getLeaderboard();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetRooms() {
  const { actor, isFetching } = useActor();

  return useQuery<Room[]>({
    queryKey: ['rooms'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getRooms();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useRegisterPlayer() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      playerName,
      inGameId,
      teamName,
      whatsappNumber,
    }: {
      playerName: string;
      inGameId: string;
      teamName: string;
      whatsappNumber: string;
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.registerPlayer(playerName, inGameId, teamName, whatsappNumber);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['registrations'] });
    },
  });
}

export function useRegisterUser() {
  const { actor } = useActor();

  return useMutation<
    RegisterUserResult,
    Error,
    { name: string; email: string; whatsapp: string; freefireUid: string; password: string }
  >({
    mutationFn: async ({ name, email, whatsapp, freefireUid, password }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.registerUser(name, email, whatsapp, freefireUid, password);
    },
  });
}

export function useLoginUser() {
  const { actor } = useActor();

  return useMutation<LoginUserResult, Error, { email: string; password: string }>({
    mutationFn: async ({ email, password }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.loginUser(email, password);
    },
  });
}

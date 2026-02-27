import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Tournament, LeaderboardEntry, Room, DepositRecord } from '../backend';
import { ExternalBlob } from '../backend';

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
      if (!actor) throw new Error('Actor not available');
      return actor.registerPlayer(playerName, inGameId, teamName, whatsappNumber);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['registrations'] });
    },
  });
}

export function useRegisterUser() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async ({
      name,
      email,
      whatsapp,
      freefireUid,
      password,
    }: {
      name: string;
      email: string;
      whatsapp: string;
      freefireUid: string;
      password: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.registerUser(name, email, whatsapp, freefireUid, password);
    },
  });
}

export function useLoginUser() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.loginUser(email, password);
    },
  });
}

export function useGetWalletBalance(uid: string) {
  const { actor, isFetching } = useActor();

  return useQuery<number>({
    queryKey: ['walletBalance', uid],
    queryFn: async () => {
      if (!actor) return 0;
      return actor.getWalletBalance(uid);
    },
    enabled: !!actor && !isFetching && !!uid,
  });
}

export function useDeposit() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ uid, amount }: { uid: string; amount: number }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deposit(uid, amount);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['walletBalance', variables.uid] });
    },
  });
}

export function useWithdraw() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ uid, amount }: { uid: string; amount: number }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.withdraw(uid, amount);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['walletBalance', variables.uid] });
    },
  });
}

export function useSubmitDeposit() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      amount,
      transactionId,
      screenshotBytes,
    }: {
      amount: number;
      transactionId: string;
      screenshotBytes: Uint8Array<ArrayBuffer>;
    }) => {
      if (!actor) throw new Error('Actor not available');
      const screenshot = ExternalBlob.fromBytes(screenshotBytes);
      return actor.submitDeposit(amount, transactionId, screenshot);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pendingDeposits'] });
      queryClient.invalidateQueries({ queryKey: ['walletBalance'] });
    },
  });
}

export function useGetPendingDeposits() {
  const { actor, isFetching } = useActor();

  return useQuery<DepositRecord[]>({
    queryKey: ['pendingDeposits'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllPendingDeposits();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useApproveDeposit() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (depositId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.approveDeposit(depositId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pendingDeposits'] });
      queryClient.invalidateQueries({ queryKey: ['walletBalance'] });
    },
  });
}

export function useRejectDeposit() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (depositId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.rejectDeposit(depositId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pendingDeposits'] });
    },
  });
}

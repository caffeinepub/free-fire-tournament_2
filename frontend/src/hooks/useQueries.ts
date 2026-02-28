import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Tournament, LeaderboardEntry, Room, Transaction, SubmitDepositResult } from '../backend';
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

export function useVerifyLogin() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async ({ email }: { email: string; password: string }) => {
      if (!actor) throw new Error('Actor not available');
      // Verify the user exists by checking their wallet balance.
      const balance = await actor.getWalletBalance(email);
      return balance;
    },
  });
}

export function useGetWalletBalance(uid: string) {
  const { actor, isFetching } = useActor();

  return useQuery<number>({
    queryKey: ['walletBalance', uid],
    queryFn: async () => {
      if (!actor || !uid) return 0;
      return actor.getWalletBalance(uid);
    },
    enabled: !!actor && !isFetching && !!uid,
    // Refetch when window regains focus so balance stays fresh
    refetchOnWindowFocus: true,
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

  return useMutation<SubmitDepositResult, Error, { amount: number; utrNumber: string }>({
    mutationFn: async ({ amount, utrNumber }) => {
      if (!actor) throw new Error('Actor not available');
      // Backend still accepts a screenshot param; pass an empty blob as placeholder
      const emptyBlob = ExternalBlob.fromBytes(new Uint8Array(0) as Uint8Array<ArrayBuffer>);
      return actor.submitDeposit(amount, utrNumber, emptyBlob);
    },
    onSuccess: (result) => {
      if (result.__kind__ === 'success') {
        queryClient.invalidateQueries({ queryKey: ['pendingDeposits'] });
        // Invalidate all walletBalance queries (prefix match covers ['walletBalance', uid])
        queryClient.invalidateQueries({ queryKey: ['walletBalance'] });
      }
    },
  });
}

export function useGetPendingDeposits() {
  const { actor, isFetching } = useActor();

  return useQuery<Transaction[]>({
    queryKey: ['pendingDeposits'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllPendingTransactions();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useApproveDeposit() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (transactionId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.approveTransaction(transactionId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pendingDeposits'] });
      // Invalidate all walletBalance queries so the approved user's balance updates
      queryClient.invalidateQueries({ queryKey: ['walletBalance'] });
    },
  });
}

export function useRejectDeposit() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (transactionId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.rejectTransaction(transactionId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pendingDeposits'] });
    },
  });
}

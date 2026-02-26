import Array "mo:core/Array";
import Runtime "mo:core/Runtime";
import Text "mo:core/Text";
import List "mo:core/List";
import Iter "mo:core/Iter";
import Order "mo:core/Order";

actor {
  type Tournament = {
    id : Nat;
    name : Text;
    dateTime : Text;
    entryFeeType : EntryFeeType;
    prizePool : Nat;
  };

  type Registration = {
    playerName : Text;
    inGameId : Text;
    teamName : Text;
    whatsappNumber : Text;
  };

  type LeaderboardEntry = {
    rank : Nat;
    playerName : Text;
    teamName : Text;
    totalPoints : Nat;
    kills : Nat;
  };

  type EntryFeeType = {
    #free;
    #paid;
  };

  module LeaderboardEntry {
    public func compare(a : LeaderboardEntry, b : LeaderboardEntry) : Order.Order {
      Nat.compare(b.totalPoints, a.totalPoints);
    };
  };

  let sampleTournaments : [Tournament] = [
    {
      id = 1;
      name = "Summer Showdown";
      dateTime = "2023-07-15 18:00";
      entryFeeType = #free;
      prizePool = 500;
    },
    {
      id = 2;
      name = "Winter Cup";
      dateTime = "2023-12-10 20:00";
      entryFeeType = #paid;
      prizePool = 1000;
    },
    {
      id = 3;
      name = "Spring Open";
      dateTime = "2024-03-22 17:00";
      entryFeeType = #free;
      prizePool = 300;
    },
    {
      id = 4;
      name = "Autumn Clash";
      dateTime = "2023-09-28 19:00";
      entryFeeType = #paid;
      prizePool = 800;
    },
  ];

  let registrations = List.empty<Registration>();

  let sampleLeaderboard : [LeaderboardEntry] = [
    { rank = 1; playerName = "Alex"; teamName = "Wolves"; totalPoints = 1200; kills = 100 },
    { rank = 2; playerName = "Bella"; teamName = "Lions"; totalPoints = 1150; kills = 95 },
    { rank = 3; playerName = "Chris"; teamName = "Tigers"; totalPoints = 1100; kills = 90 },
    { rank = 4; playerName = "Diana"; teamName = "Eagles"; totalPoints = 1050; kills = 85 },
    { rank = 5; playerName = "Ethan"; teamName = "Bears"; totalPoints = 1000; kills = 80 },
    { rank = 6; playerName = "Fiona"; teamName = "Sharks"; totalPoints = 950; kills = 75 },
    { rank = 7; playerName = "George"; teamName = "Panthers"; totalPoints = 900; kills = 70 },
    { rank = 8; playerName = "Hannah"; teamName = "Cobras"; totalPoints = 850; kills = 65 },
    { rank = 9; playerName = "Ivan"; teamName = "Hawks"; totalPoints = 800; kills = 60 },
    { rank = 10; playerName = "Julia"; teamName = "Dragons"; totalPoints = 750; kills = 55 },
  ];

  public query ({ caller }) func getTournaments() : async [Tournament] {
    sampleTournaments;
  };

  public shared ({ caller }) func registerPlayer(playerName : Text, inGameId : Text, teamName : Text, whatsappNumber : Text) : async () {
    if (playerName.isEmpty() or inGameId.isEmpty() or teamName.isEmpty() or whatsappNumber.isEmpty()) {
      Runtime.trap("All fields are required");
    };

    let registration : Registration = {
      playerName;
      inGameId;
      teamName;
      whatsappNumber;
    };

    registrations.add(registration);
  };

  public query ({ caller }) func getLeaderboard() : async [LeaderboardEntry] {
    sampleLeaderboard.sort();
  };
};

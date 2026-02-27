import Array "mo:core/Array";
import Runtime "mo:core/Runtime";
import Text "mo:core/Text";
import List "mo:core/List";
import Iter "mo:core/Iter";
import Order "mo:core/Order";
import Nat "mo:core/Nat";
import Int "mo:core/Int";
import Map "mo:core/Map";
import Principal "mo:core/Principal";
import AccessControl "authorization/access-control";
import Migration "migration";
import MixinAuthorization "authorization/MixinAuthorization";
(with migration = Migration.run) actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  type Tournament = {
    id : Nat;
    name : Text;
    dateTime : Text;
    entryFeeType : EntryFeeType;
    entryFee : Text;
    prizePool : Text;
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

  type RoomType = {
    #solo;
    #duo;
    #squad;
    #clashSquad;
    #fullMap;
  };

  type Room = {
    name : Text;
    roomType : RoomType;
    entryFee : Text;
    prizePool : Text;
    totalSlots : Nat;
    joinedSlots : Nat;
    startTime : Int;
    joinStatus : RoomJoinStatus;
  };

  type RoomJoinStatus = {
    #open;
    #closed;
    #inProgress;
  };

  type User = {
    name : Text;
    email : Text;
    whatsapp : Text;
    freefireUid : Text;
    password : Text;
    walletBalance : Float;
  };

  type UserProfile = {
    name : Text;
    email : Text;
    whatsapp : Text;
    freefireUid : Text;
  };

  let sampleTournaments : [Tournament] = [
    {
      id = 1;
      name = "Summer Showdown";
      dateTime = "2023-07-15 18:00";
      entryFeeType = #paid;
      entryFee = "\u{20B9}10";
      prizePool = "\u{20B9}100";
    },
    {
      id = 2;
      name = "Winter Cup";
      dateTime = "2023-12-10 20:00";
      entryFeeType = #paid;
      entryFee = "\u{20B9}10";
      prizePool = "\u{20B9}100";
    },
    {
      id = 3;
      name = "Spring Open";
      dateTime = "2024-03-22 17:00";
      entryFeeType = #paid;
      entryFee = "\u{20B9}10";
      prizePool = "\u{20B9}100";
    },
    {
      id = 4;
      name = "Autumn Clash";
      dateTime = "2023-09-28 19:00";
      entryFeeType = #paid;
      entryFee = "\u{20B9}10";
      prizePool = "\u{20B9}100";
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

  let sampleRooms : [Room] = [
    {
      name = "Solo Room 1";
      roomType = #solo;
      entryFee = "\u{20B9}10";
      prizePool = "\u{20B9}100";
      totalSlots = 48;
      joinedSlots = 10;
      startTime = 1_689_312_000_000_000 : Int;
      joinStatus = #open;
    },
    {
      name = "Duo Room 1";
      roomType = #duo;
      entryFee = "\u{20B9}10";
      prizePool = "\u{20B9}100";
      totalSlots = 48;
      joinedSlots = 24;
      startTime = 1_689_312_100_000_000 : Int;
      joinStatus = #open;
    },
    {
      name = "Squad Room 1";
      roomType = #squad;
      entryFee = "\u{20B9}10";
      prizePool = "\u{20B9}100";
      totalSlots = 48;
      joinedSlots = 38;
      startTime = 1_689_312_200_000_000 : Int;
      joinStatus = #open;
    },
    {
      name = "Clash Squad Room 1";
      roomType = #clashSquad;
      entryFee = "\u{20B9}10";
      prizePool = "\u{20B9}100";
      totalSlots = 48;
      joinedSlots = 5;
      startTime = 1_689_312_300_000_000 : Int;
      joinStatus = #open;
    },
    {
      name = "Full Map Room 1";
      roomType = #fullMap;
      entryFee = "\u{20B9}10";
      prizePool = "\u{20B9}100";
      totalSlots = 48;
      joinedSlots = 42;
      startTime = 1_689_312_400_000_000 : Int;
      joinStatus = #open;
    },
  ];

  let users = Map.empty<Text, User>();
  // Maps Principal -> email (uid) so we can verify ownership of wallet operations
  let principalToEmail = Map.empty<Principal, Text>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  // Public query: anyone (including guests) can view tournaments
  public query func getTournaments() : async [Tournament] {
    sampleTournaments;
  };

  // Requires authenticated user (#user role) to register as a player
  public shared ({ caller }) func registerPlayer(playerName : Text, inGameId : Text, teamName : Text, whatsappNumber : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can register as players");
    };

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

  // Public query: anyone (including guests) can view the leaderboard
  public query func getLeaderboard() : async [LeaderboardEntry] {
    sampleLeaderboard.sort();
  };

  // Public query: anyone (including guests) can view rooms
  public query func getRooms() : async [Room] {
    sampleRooms;
  };

  public type RegisterUserResult = {
    #success;
    #emailExists;
  };

  public type LoginUserResult = {
    #success : User;
    #userNotFound;
    #passwordIncorrect;
  };

  // Anyone (including guests) can register a new account
  public shared ({ caller }) func registerUser(name : Text, email : Text, whatsapp : Text, freefireUid : Text, password : Text) : async RegisterUserResult {
    switch (users.get(email)) {
      case (?_) { return #emailExists };
      case (null) {
        let user : User = {
          name;
          email;
          whatsapp;
          freefireUid;
          password;
          walletBalance = 0.0;
        };
        users.add(email, user);
        // If the caller is an authenticated principal (not anonymous), record the mapping
        if (not caller.isAnonymous()) {
          principalToEmail.add(caller, email);
        };
        #success;
      };
    };
  };

  // Anyone (including guests) can attempt to log in
  public shared ({ caller }) func loginUser(email : Text, password : Text) : async LoginUserResult {
    switch (users.get(email)) {
      case (?user) {
        if (user.password == password) {
          // Record principal -> email mapping on successful login
          if (not caller.isAnonymous()) {
            principalToEmail.add(caller, email);
          };
          #success(user);
        } else {
          #passwordIncorrect;
        };
      };
      case (null) { #userNotFound };
    };
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view their profile");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can save their profile");
    };
    userProfiles.add(caller, profile);
  };

  // ---------------------------
  // Wallet Functionality
  // ---------------------------

  // Helper: verify that the caller owns the account identified by uid (email),
  // or that the caller is an admin.
  func assertWalletOwnerOrAdmin(caller : Principal, uid : Text) {
    if (AccessControl.isAdmin(accessControlState, caller)) {
      return; // admins can access any wallet
    };
    switch (principalToEmail.get(caller)) {
      case (?email) {
        if (email != uid) {
          Runtime.trap("Unauthorized: You can only access your own wallet");
        };
      };
      case (null) {
        Runtime.trap("Unauthorized: Caller has no associated account");
      };
    };
  };

  // Get wallet balance for a user identified by email uid.
  // Only the owning user or an admin may call this.
  public query ({ caller }) func getWalletBalance(uid : Text) : async Float {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can access wallet balances");
    };
    assertWalletOwnerOrAdmin(caller, uid);

    switch (users.get(uid)) {
      case (?user) { user.walletBalance };
      case (null) {
        Runtime.trap("User not found");
      };
    };
  };

  // Deposit funds into a user's wallet.
  // Only the owning user or an admin may call this.
  public shared ({ caller }) func deposit(uid : Text, amount : Float) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can deposit funds");
    };
    assertWalletOwnerOrAdmin(caller, uid);

    if (amount <= 0.0) {
      Runtime.trap("Deposit amount must be positive");
    };

    switch (users.get(uid)) {
      case (?user) {
        let updatedUser = { user with walletBalance = user.walletBalance + amount };
        users.add(uid, updatedUser);
      };
      case (null) {
        Runtime.trap("User not found");
      };
    };
  };

  // Withdraw funds from a user's wallet.
  // Only the owning user or an admin may call this.
  public shared ({ caller }) func withdraw(uid : Text, amount : Float) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can withdraw funds");
    };
    assertWalletOwnerOrAdmin(caller, uid);

    if (amount <= 0.0) {
      Runtime.trap("Withdraw amount must be positive");
    };

    switch (users.get(uid)) {
      case (?user) {
        if (user.walletBalance < amount) {
          Runtime.trap("Insufficient balance");
        };
        let updatedUser = { user with walletBalance = user.walletBalance - amount };
        users.add(uid, updatedUser);
      };
      case (null) {
        Runtime.trap("User not found");
      };
    };
  };
};

import Array "mo:core/Array";
import Runtime "mo:core/Runtime";
import Text "mo:core/Text";
import List "mo:core/List";
import Blob "mo:core/Blob";
import Iter "mo:core/Iter";
import Order "mo:core/Order";
import Nat "mo:core/Nat";
import Int "mo:core/Int";
import Float "mo:core/Float";
import Map "mo:core/Map";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import AccessControl "authorization/access-control";
import Migration "migration";

import MixinAuthorization "authorization/MixinAuthorization";
import Storage "blob-storage/Storage";
import MixinStorage "blob-storage/Mixin";
import UserApproval "user-approval/approval";

// Migration mapping must be added when adding persistent user state variables.
(with migration = Migration.run)
actor {
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

  type DepositStatus = {
    #pending;
    #approved;
    #rejected;
  };

  type DepositRecord = {
    id : Nat;
    user : Principal;
    amount : Float;
    transactionId : Text;
    screenshot : Storage.ExternalBlob;
    submittedAt : Int;
    status : DepositStatus;
  };

  var nextDepositId : Nat = 1;

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
  let deposits = Map.empty<Nat, DepositRecord>();

  let accessControlState = AccessControl.initState();
  let approvalState = UserApproval.initState(accessControlState);

  include MixinAuthorization(accessControlState);
  include MixinStorage();

  let minimumDepositAmount : Float = 10.0;

  // ---------------------------
  // User Profile Functions (required by instructions)
  // ---------------------------

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can get profiles");
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
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // ---------------------------
  // User Approval Functions (required by component)
  // ---------------------------

  public query ({ caller }) func isCallerApproved() : async Bool {
    AccessControl.hasPermission(accessControlState, caller, #admin) or UserApproval.isApproved(approvalState, caller);
  };

  public shared ({ caller }) func requestApproval() : async () {
    UserApproval.requestApproval(approvalState, caller);
  };

  public shared ({ caller }) func setApproval(user : Principal, status : UserApproval.ApprovalStatus) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    UserApproval.setApproval(approvalState, user, status);
  };

  public query ({ caller }) func listApprovals() : async [UserApproval.UserApprovalInfo] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    UserApproval.listApprovals(approvalState);
  };

  // ---------------------------
  // Tournament / Leaderboard / Rooms (public, no auth required)
  // ---------------------------

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

  // ---------------------------
  // User Registration / Login
  // ---------------------------

  public type RegisterUserResult = {
    #success;
    #emailExists;
  };

  public type LoginUserResult = {
    #success : User;
    #userNotFound;
    #passwordIncorrect;
  };

  // Anyone (including guests) can register a new account.
  // If the caller is an authenticated (non-anonymous) principal, assign the #user role
  // so that subsequent authenticated calls to deposit, wallet, etc. are authorized.
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
        // and assign the #user role so they can access authenticated endpoints.
        if (not caller.isAnonymous()) {
          principalToEmail.add(caller, email);
          AccessControl.assignRole(accessControlState, caller, caller, #user);
        };
        #success;
      };
    };
  };

  // ---------------------------
  // Wallet Functions
  // ---------------------------

  // Get wallet balance for a user identified by email uid.
  // Only the owning user (matched via principalToEmail) or an admin may call this.
  public query ({ caller }) func getWalletBalance(uid : Text) : async Float {
    // Admins can query any wallet; regular users can only query their own
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
        Runtime.trap("Unauthorized: Only authenticated users can view wallet balance");
      };
      switch (principalToEmail.get(caller)) {
        case (?email) {
          if (email != uid) {
            Runtime.trap("Unauthorized: You can only view your own wallet balance");
          };
        };
        case (null) {
          Runtime.trap("Unauthorized: No account linked to your principal");
        };
      };
    };

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
    // Admins can deposit to any wallet; regular users can only deposit to their own
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
        Runtime.trap("Unauthorized: Only authenticated users can deposit");
      };
      switch (principalToEmail.get(caller)) {
        case (?email) {
          if (email != uid) {
            Runtime.trap("Unauthorized: You can only deposit to your own wallet");
          };
        };
        case (null) {
          Runtime.trap("Unauthorized: No account linked to your principal");
        };
      };
    };

    if (amount < minimumDepositAmount) {
      Runtime.trap("Minimum deposit amount is \u{20B9}10. Please deposit \u{20B9}10 or more.");
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
    // Admins can withdraw from any wallet; regular users can only withdraw from their own
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
        Runtime.trap("Unauthorized: Only authenticated users can withdraw");
      };
      switch (principalToEmail.get(caller)) {
        case (?email) {
          if (email != uid) {
            Runtime.trap("Unauthorized: You can only withdraw from your own wallet");
          };
        };
        case (null) {
          Runtime.trap("Unauthorized: No account linked to your principal");
        };
      };
    };

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

  // ---------------------------
  // Deposit Submission System
  // ---------------------------

  // Authenticated users can submit a deposit request
  public shared ({ caller }) func submitDeposit(amount : Float, transactionId : Text, screenshot : Storage.ExternalBlob) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can submit deposits");
    };

    if (amount < minimumDepositAmount) {
      Runtime.trap(
        "Deposit amount must be at least \u{20B9}10. Please deposit \u{20B9}10 or more."
      );
    };

    let depositId = nextDepositId;
    nextDepositId += 1;

    let depositRecord : DepositRecord = {
      id = depositId;
      user = caller;
      amount;
      transactionId;
      screenshot;
      submittedAt = Time.now();
      status = #pending;
    };

    deposits.add(depositId, depositRecord);
    depositId;
  };

  // Admin only: fetch all pending deposits
  public query ({ caller }) func getAllPendingDeposits() : async [DepositRecord] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view pending deposits");
    };
    deposits.values().toArray().filter(func(d) { d.status == #pending });
  };

  // Admin only: approve a deposit and credit the user's wallet balance
  public shared ({ caller }) func approveDeposit(depositId : Nat) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can approve deposits");
    };

    switch (deposits.get(depositId)) {
      case (?deposit) {
        if (deposit.status != #pending) {
          Runtime.trap("Deposit is not pending or has already been processed");
        };

        // Credit the user's wallet by looking up their email via principalToEmail
        switch (principalToEmail.get(deposit.user)) {
          case (?email) {
            switch (users.get(email)) {
              case (?user) {
                let updatedUser = { user with walletBalance = user.walletBalance + deposit.amount };
                users.add(email, updatedUser);
              };
              case (null) {
                Runtime.trap("User account not found for deposit owner");
              };
            };
          };
          case (null) {
            Runtime.trap("No account mapping found for deposit owner");
          };
        };

        deposits.add(depositId, { deposit with status = #approved });
      };
      case (null) {
        Runtime.trap("Deposit not found");
      };
    };
  };

  // Admin only: reject a deposit
  public shared ({ caller }) func rejectDeposit(depositId : Nat) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can reject deposits");
    };

    switch (deposits.get(depositId)) {
      case (?deposit) {
        if (deposit.status != #pending) {
          Runtime.trap("Deposit is not pending or has already been processed");
        };

        deposits.add(depositId, { deposit with status = #rejected });
      };
      case (null) {
        Runtime.trap("Deposit not found");
      };
    };
  };

  // Authenticated users can fetch their own deposit records; admins can fetch any user's records
  public query ({ caller }) func getUserDeposits(user : Principal) : async [DepositRecord] {
    // Only the user themselves or an admin can view deposit records
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: You can only view your own deposit records");
    };
    if (not AccessControl.isAdmin(accessControlState, caller) and not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view deposit records");
    };
    deposits.values().toArray().filter(func(d) { d.user == user });
  };

  // Authenticated users can fetch their own deposit record by id; admins can fetch any record
  public query ({ caller }) func getDepositRecord(depositId : Nat) : async ?DepositRecord {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view deposit records");
    };
    switch (deposits.get(depositId)) {
      case (?deposit) {
        // Only the owning user or an admin can view the record
        if (deposit.user != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: You can only view your own deposit records");
        };
        ?deposit;
      };
      case (null) { null };
    };
  };
};

module {
  type OldActor = {
    nextDepositId : Nat;
  };

  type NewActor = {
    nextDepositId : Nat;
    minimumDepositAmount : Float;
  };

  public func run(old : OldActor) : NewActor {
    { old with minimumDepositAmount = 10.0 };
  };
};

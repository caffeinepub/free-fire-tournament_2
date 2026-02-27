import Map "mo:core/Map";
import Text "mo:core/Text";

module {
  type OldUser = {
    name : Text;
    email : Text;
    whatsapp : Text;
    freefireUid : Text;
    password : Text;
  };

  type OldActor = {
    users : Map.Map<Text, OldUser>;
  };

  type NewUser = {
    name : Text;
    email : Text;
    whatsapp : Text;
    freefireUid : Text;
    password : Text;
    walletBalance : Float;
  };

  type NewActor = {
    users : Map.Map<Text, NewUser>;
  };

  public func run(old : OldActor) : NewActor {
    let newUsers = old.users.map<Text, OldUser, NewUser>(
      func(_uid, oldUser) {
        { oldUser with walletBalance = 0.0 };
      }
    );
    { users = newUsers };
  };
};

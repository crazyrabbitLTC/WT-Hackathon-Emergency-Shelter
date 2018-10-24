
pragma solidity ^0.4.24;

contract AbstractWTIndex {
  address[] public hotels;
  mapping(address => uint) public hotelsIndex;
  mapping(address => address[]) public hotelsByManager;
  mapping(address => uint) public hotelsByManagerIndex;
  address public LifToken;

  function registerHotel(string dataUri) external;
  function deleteHotel(address hotel) external;
  function callHotel(address hotel, bytes data) external;
  function transferHotel(address hotel, address newManager) external;
  function getHotelsLength() view public returns (uint);
  function getHotels() view public returns (address[]);
  function getHotelsByManager(address manager) view public returns (address[]);

  event HotelRegistered(address hotel, uint managerIndex, uint allIndex);
  event HotelDeleted(address hotel, uint managerIndex, uint allIndex);
  event HotelCalled(address hotel);
  event HotelTransferred(address hotel, address previousManager, address newManager);
}

contract AbstractHotel{

  address public manager;
  string public dataUri;
  uint public created;
  address public index;

  modifier onlyFromIndex() {
    require(msg.sender == index);
    _;
  }

  function _editInfoImpl(string _dataUri) internal;
  function _destroyImpl() internal;
  function _changeManagerImpl(address _newManager) internal;
  function editInfo(string _dataUri) onlyFromIndex public;
  function destroy() onlyFromIndex public;

}

contract EmergencyShelterIndex {
    
    address WindingTreeContractAddress;
    
    //The Interact for the WindingTreeContract
    AbstractWTIndex WindingTreeContract;
    
    struct Emergency {
        address owner;
        string emergencyUri;
        uint durationStart;
        uint durationValid;
    }

    struct Shelter {
        address owner;
        string shelterUri;
        uint validUntil;
    }
    
    Emergency[] Emergencies;
    Shelter[] Shelters;
    

    uint public TotalShelterCount = 0;

    
    //emergencyURI => shelterIndex => shelter
    mapping(string => mapping(uint => Shelter)) public ShelterMapping;
    //Shelters per emergency
    mapping(string => uint) ShelterCountByEmergency;

    //AddressOfEmergencyManager => Emergencies
    mapping(address => mapping(uint => Emergency)) public EmergencyByManagerByIndex;
    mapping(address => uint) public ManagerEmergencyCount;

    //Events
    event newEmergency(
        address indexed emergencyManager,
        string emergencyUri,
        uint duration);
    
    event newShelter(
        address indexed shelterManager,
        string shelterUri,
        string emergencyUri,
        uint duration);

    //Set the address of the WindingTreeContract
    constructor(address _WindingTreeContractAddress) public {
        WindingTreeContract = AbstractWTIndex(_WindingTreeContractAddress);
    }
    
    function createEmergency(string _emergencyUri, uint _duration) public {
        Emergency memory emergency;
        
        emergency.owner = msg.sender;
        emergency.emergencyUri = _emergencyUri;
        emergency.durationStart = block.timestamp;
        emergency.durationValid = _duration;
        
        WindingTreeContract.registerHotel(_emergencyUri);
        
        uint ManagerEmergencyIndex = ManagerEmergencyCount[msg.sender]++;
        
        Emergencies.push(emergency);
        EmergencyByManagerByIndex[msg.sender][ManagerEmergencyIndex] = emergency;

        
        emit newEmergency(msg.sender, _emergencyUri, _duration);
    }
    
    function createShelter(string _shelterUri, string _emergencyUri, uint _validUntil) public {
        
        Shelter memory shelter;
        
        shelter.owner = msg.sender;
        shelter.shelterUri = _shelterUri;
        shelter.validUntil = _validUntil;
        ShelterMapping[_emergencyUri][ShelterCountByEmergency[_emergencyUri]++] = shelter;
        Shelters.push(shelter);
        
        emit newShelter(msg.sender, _shelterUri, _emergencyUri, _validUntil);
    }
    
    function getEmergencyCount() public view returns(uint){
    return Emergencies.length;
    }
    
    function getShelterCount() public view returns (uint){
        return Shelters.length;
    }
    
    function getEmergency(uint emergencyArrayIndex) public view returns (address, string, uint, uint){
        Emergency memory emergency = Emergencies[emergencyArrayIndex];
        return (emergency.owner, emergency.emergencyUri, emergency.durationStart, emergency.durationValid);
    }
    
    function getShelter() public returns (address, string, uint);
    
    
    
}

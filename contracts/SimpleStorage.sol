
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
  function editInfo(string _dataUri)  public;
  function destroy()  public;

}

contract EmergencyShelterIndex {
    
    address WindingTreeContractAddress;
    
    //The Interact for the WindingTreeContract
    AbstractWTIndex WindingTreeContract;
    
    struct Emergency {
        address owner;
        bytes32 emergencyUri;
        uint durationStart;
        uint durationValid;
    }

    struct Shelter {
        address owner;
        bytes32 shelterUri;
        uint validUntil;
    }
    
    Emergency[] Emergencies;

    uint public TotalShelterCount = 0;
    
    //emergencyUri => shelterIndex => shelter
    mapping(bytes32 => mapping(uint => Shelter)) public ShelterMapping;
    //emergencyUri => uint
    mapping(bytes32 => uint) ShelterCountByEmergency;

    //AddressOfEmergencyManager => Emergencies
    mapping(address => mapping(uint => Emergency)) public EmergencyByManagerByIndex;
    mapping(address => uint) public ManagerEmergencyCount;

    //Events
    event newEmergency(
        address indexed emergencyManager,
        bytes32 indexed emergencyUri,
        uint duration);
    
    event newShelter(
        address indexed shelterManager,
        bytes32 indexed shelterUri,
        bytes32 indexed emergencyUri,
        uint duration);

    //Set the address of the WindingTreeContract
    constructor(address _WindingTreeContractAddress) public {
        WindingTreeContract = AbstractWTIndex(_WindingTreeContractAddress);
    }
    
    function createEmergency(string _emergencyUriString, bytes32 _emergencyUri, uint _duration) public {
        Emergency memory emergency;
        
        emergency.owner = msg.sender;
        emergency.emergencyUri = _emergencyUri;
        emergency.durationStart = block.timestamp;
        emergency.durationValid = _duration;
        
        WindingTreeContract.registerHotel(_emergencyUriString);
        
        uint ManagerEmergencyIndex = ManagerEmergencyCount[msg.sender]++;
        
        Emergencies.push(emergency);
        EmergencyByManagerByIndex[msg.sender][ManagerEmergencyIndex] = emergency;

        
        emit newEmergency(msg.sender, _emergencyUri, _duration);
    }
    
    function createShelter(bytes32 _shelterUri, bytes32 _emergencyUri, uint _validUntil) public {
        
        Shelter memory shelter;
        

        shelter.owner = msg.sender;
        shelter.shelterUri = _shelterUri;
        shelter.validUntil = _validUntil;
        ShelterMapping[_emergencyUri][ShelterCountByEmergency[_emergencyUri]++] = shelter;
        
        TotalShelterCount++;
        
        emit newShelter(msg.sender, _shelterUri, _emergencyUri, _validUntil);
    }
    
    function getEmergencyCount() public view returns(uint){
    return Emergencies.length;
    }
    
    function getShelterCount(bytes32 _emergencyUri) public view returns (uint){
        return ShelterCountByEmergency[_emergencyUri];
    }
    
    function getEmergency(uint emergencyArrayIndex) public view returns (address, bytes32, uint, uint){
        Emergency memory emergency = Emergencies[emergencyArrayIndex];
        return (emergency.owner, emergency.emergencyUri, emergency.durationStart, emergency.durationValid);
    }
    
    function getShelter(bytes32 _emergencyUri, uint _shelterIndex) public view returns (address, bytes32, uint){
        Shelter memory shelter = ShelterMapping[_emergencyUri][_shelterIndex];
        return (shelter.owner, shelter.shelterUri, shelter.validUntil);
    }
    
    
    
    
    
}
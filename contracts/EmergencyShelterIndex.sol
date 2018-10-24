
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
        bytes32 dataUri;
        uint durationStart;
        uint durationValid;
    }

    struct Shelter {
        address owner;
        bytes32 dataUri;
        uint durationStart;
        uint durationValid;
    }
    
    //Use this to find which "Hotel" is the Shelter.
    uint public TotalShelterCount = 0;
    
    uint public TotalEmergencies = 0;
    
    //emergencyURI => shelterIndex => shelter
    mapping(bytes32 => mapping(uint => Shelter)) public ShelterMapping;

    //AddressOfEmergencyManager => Emergencies
    mapping(address => mapping(uint => Emergency)) public EmergencyByManagerByIndex;
    mapping(address => uint) public ManagerEmergencyCount;

    
    //Set the address of the WindingTreeContract
    constructor(address _WindingTreeContractAddress) public {
        WindingTreeContract = AbstractWTIndex(_WindingTreeContractAddress);
    }
    
    function createEmergency(bytes32 emergencyUri, uint duration) public {
        Emergency memory emergency;
        
        emergency.owner = msg.sender;
        emergency.dataUri = emergencyUri;
        emergency.durationStart = block.timestamp;
        emergency.durationValid = duration;
        
        
        
        uint ManagerEmergencyIndex = ManagerEmergencyCount[msg.sender]++;
        
        EmergencyByManagerByIndex[msg.sender][ManagerEmergencyIndex] = emergency;
        TotalEmergencies++;

        //Create 'Hotel' in WT contract
        
        
        
        

    }
    
    
    
}
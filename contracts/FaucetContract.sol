// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "./Owned.sol";
import "./Logger.sol";
import "./IFaucet.sol";

contract Faucet is Owned, Logger, IFaucet { 

    // address[] public funders;
    uint public numOfFunders;
    //mapping(uint => address) private funders;

    mapping(address => bool) private funders;
    mapping(uint => address) private lutFunders;

    // address public owner;

    // constructor() {
    //     owner = msg.sender;
    // }
 
    // modifier onlyOwner {
    //     require(
    //         msg.sender == owner,
    //         "Only owner can call this function"
    //     );
    //     _;
    // }

    modifier limitWithdraw(uint withdrawAmount) {
        require(
            withdrawAmount <=100000000000000000, 
            "Cannot withdraw more than 0.1 ether"
            );
            _;
    }

    receive() external payable {}

    function emitLog() public override pure returns (bytes32) {
        return "Test Test";
    }

    function addFunds() external override payable{
        // funders.push(msg.sender);
        //uint index = numOfFunders++;
        //funders[index] = msg.sender;

        address funder = msg.sender;
        test3();

        if (!funders[funder]) {
            uint index = numOfFunders++;
            funders[funder] = true;
            lutFunders[index] = funder;
        }
        else {
            funders[funder] = false;
        }

    }

    function test1() external onlyOwner {
        //only admin can access
    }

    function test2() external onlyOwner {
        //only admin can access
    }

    function withdraw(uint withdrawAmount) override external limitWithdraw(withdrawAmount) {
    //    if (withdrawAmount < 1000000000000000000) {
    //        payable (msg.sender).transfer(withdrawAmount);
    //    }
        //require(withdrawAmount <=100000000000000000, "Cannot withdraw more than 0.1 ether");
        payable(msg.sender).transfer(withdrawAmount);
    }

    function getAllFunders() external view returns(address[] memory) {
        address[] memory _funders = new address[](numOfFunders);

        for (uint i = 0; i< numOfFunders; i++) {
            //_funders[i] = funders[i];
            _funders[i] = lutFunders[i];
        }

        return _funders;


    }

    // function getAllFunders() public view returns (address[] memory) {
    //     return funders;
    // }

    function getFunderAtIndex(uint8 index) external view returns(address) {
        // address[] memory _funders = getAllFunders();
        //return funders[index];
        return lutFunders[index];
    }


   
}

 //const instance = await Faucet.deployed()
 
 //instance.addFunds({from: accounts[0], value: "2000000000000000000"})
 //instance.addFunds({from: accounts[1], value: "2000000000000000000"})
 
 //instance.withdraw("100000000000000000", {from: accounts[1]})
 
 //instance.getFunderAtIndex(0) 
 //instance.getAllFunders()
 //instance.






    // private -> cam be accesible only within the smart contract
    // internal -> can be accessible within smart contract and also derived smart contract

    //this is a special function
    //it's called when you make a transection that doesn't specify
    //function name to call

    //External function are part of the contract interface
    //Which means they can be called via contracts and other transection



    // pure , view - read-only call, no gass free
    // view - it indicates that the function will not alter the storage state in any way
    // pure - even more strict, indicating that it won't even read the storage state

    // Transaction (can generate state changes) and require gas fee
    //read-only call, no gass free

    // to talk to the node on the network you can make JSON-RPC http calls
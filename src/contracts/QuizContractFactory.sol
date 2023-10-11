// // SPDX-License-Identifier: MIT
// pragma solidity ^0.8.19;

// import "./quizContractt.sol";
// contract QuizContractFactory{
//     mapping (address=>QuizContract) private userToContract;
//     mapping (address=>bool) private onlyOne;
//     event ContractCreated(QuizContract indexed contractAddress);


//     function createQuizContract() public {
//             // require(!onlyOne[msg.sender],"You did not use your contract");
//             QuizContract quizContract = new QuizContract();
//             userToContract[msg.sender] = quizContract;
//             onlyOne[msg.sender] = true;
//             emit ContractCreated(quizContract);
//     }

//     function getUserToContract(address user) public view returns(QuizContract){
         
//          return userToContract[user];
//     }

//     function getOnlyOne(address user) public view returns(bool){
//         return onlyOne[user];
//     }
// }
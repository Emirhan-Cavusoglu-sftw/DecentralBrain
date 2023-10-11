

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;


contract QuizContract{

// EVENTS
event Winner(address indexed winnerAddress);
event QuestionAdded(string indexed text, string indexed correctOption, string[4] indexed options);
event PlayerJoined(address indexed player);
event GameFinished(address indexed winner, uint score);



    address private owner;
    uint private entryFee;
    uint private questionCount;
    uint private playerCount;
    
    bool private allQuestionsAnswered; // Soruların tümünün cevaplandığını gösteren bayrak
    address[] private players;
    mapping(address=>bool) private isPlayerJoined;
    struct Question {
        string text;
        string correctOption;
        string[4] options;
    }

    Question[] private questions;
    mapping(address => uint) private scores;
    mapping(uint256=>mapping(address=>bool )) private hasAnswered;
    
    

    constructor( ) {
        owner = msg.sender;
        entryFee = 10000000000000000;
    }

    

    function addQuestions(string[] memory texts, string[] memory correctOptions, string[4][] memory allOptions) public onlyOwner {
        require(texts.length == correctOptions.length, "Question count and correct option count mismatch.");
        require(texts.length == allOptions.length, "Question count and option count mismatch");
        
        for (uint i = 0; i < texts.length; i++) {
            questions.push(Question(texts[i], correctOptions[i], allOptions[i]));
            emit QuestionAdded(texts[i], correctOptions[i], allOptions[i]);
        }
        questionCount += texts.length;

    }

    function joinGame() public payable {
        require(msg.value == entryFee, "Entry fee is not correct.");
        require(!isPlayerJoined[msg.sender], "You have already played this game.");
        
        playerCount++;
        players.push(msg.sender);
        isPlayerJoined[msg.sender] = true;
        emit PlayerJoined(msg.sender);
    }

    function answerQuestion(uint[] memory _questionIndex, uint[] memory _selectedOption) public {
        require(isPlayerJoined[msg.sender] == true, "You did not join the game");
       for(uint i=0;i<questionCount;i++){
        uint questionIndex= _questionIndex[i];
        uint selectedOption =  _selectedOption[i];
        require(questionIndex < questionCount, "Invalid question index.");
        require(selectedOption < 4, "Invalid option selected.");
        require(!hasAnswered[questionIndex][msg.sender], "You have already answered this question.");
       
        if (keccak256(bytes(questions[questionIndex].options[selectedOption])) == keccak256(bytes(questions[questionIndex].correctOption))) {
            scores[msg.sender]++;
        }
        hasAnswered[questionIndex][msg.sender] = true;
       }
       
       bool allQestionsAnswered = checkAllQuestionsAnswered(); 
       if(allQestionsAnswered){
        finishGame();
       }
        

        // Tüm soruları cevapladığımızı kontrol et
        
    }

    function checkAllQuestionsAnswered() internal view returns (bool) {
        for (uint i = 0; i < playerCount; i++) {
            address player = players[i];
            for(uint j=0; j<questions.length; j++ ){

             if (!hasAnswered[j][player]) {
                return false;
            }
            }
        }
        return true;
    }

    function finishGame() internal {
        allQuestionsAnswered = checkAllQuestionsAnswered();
        require(allQuestionsAnswered,"there are still non-answered questions");

        address winner;
        uint highestScore = 0;

        for (uint i = 0; i < playerCount; i++) {
            address player = players[i];
            if (scores[player] > highestScore) {
                highestScore = scores[player];
                winner = player;
            }
        }

        
        (bool success,) = winner.call{value: address(this).balance  }("");
        require(success,"an error occured when sending reward");

         emit GameFinished(winner, highestScore);
    }






    function getEntryFee() public view returns(uint256){
        return entryFee;
    }

    function getQuestionCount() public view returns(uint256){
        return questionCount;
    }

    function getQuestions() public view returns(Question[] memory){
        return questions;
    }
    
    function getIsPlayerJoined(address playerAddress) public view returns(bool){
        return isPlayerJoined[playerAddress];
    }

    function getAllQuestionsAnswered() public view returns(bool){
        return checkAllQuestionsAnswered();
    }





    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can perform this action");
        _;
    }
}
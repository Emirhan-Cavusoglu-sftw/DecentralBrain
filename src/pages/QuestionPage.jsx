import React from "react";
import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Center,
  ChakraProvider,
  Container,
  Heading,
  ListItem,
  UnorderedList,
  useToast,
  Text,
  Spinner,
  Card,
  SimpleGrid,
} from "@chakra-ui/react";
import {
  useAccount,
  useContractRead,
  useContractWrite,
  useBlockNumber,
  useContractEvent,
} from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { abi } from "../contracts/QuizContract.json";
import { readContract, writeContract } from "@wagmi/core";
import QuestionCard from "../components/QuestionCard";
import Nav from "../components/Nav";
import { Link, Route, Routes, useParams } from "react-router-dom";
import { keccak256, parseEther } from "viem";

const QuestionPage = () => {
  const [log,setLog] = useState();
  const [color,setColor] = useState("blue.500")
  const [clicked,setClicked] = useState(new Map())
  const [questionIndex, setQuestionIndex] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);
  const [isPlayerAlreadyJoined, setPlayerJoined] = useState(true);
  const [optionsData, setOptionsData] = useState([]);
  const [dataUpdated, setDataUpdated] = useState();
  const [answered, setAnswered] = useState();
  const toast = useToast();
  const { adres } = useParams();
  const { address, isConnected } = useAccount();
  const [questionIndexArray,setQuestionArray] = useState([]);
  const [optionArray,setOptionArray] = useState([]);
  const [eventLog,seteventLog] = useState();

  // "0xcF56b876BBe2ff62481B54FBf37f5dc3Ab2d5376"
  
  useContractEvent({
    address:adres,
    abi:abi,
    eventName:"GameFinished",
    listener(log){
      seteventLog(log)
      
      
     
      
    }
  })

  
  useEffect(()=>{
      async function doit(){
        if(!!log){

          if(keccak256(address)===log[0].args.winner){
            return toast({
              title:"YOU ARE THE WINNER CONGRATS :)",
              status:"success",
              duration:20000,
              isClosable:true
            })
          }
        }
      }
      doit();
  },[eventLog])

  
  
  
  
  
  
  
  useEffect(() => {
    async function getQ() {
      // try {
      //  let adress = adres.toString
      await readContract({
        address: adres,
        abi: abi,
        functionName: "getQuestions",
      }).then((data) => {
        setOptionsData(data);
      });

      await readContract({
        address: adres,
        abi: abi,
        functionName: "getQuestionCount",
      }).then((data) => {
        setQuestionCount(Number(data));
      });

      await readContract({
        address: adres,
        abi: abi,
        functionName: "getIsPlayerJoined",
        args: [address],
      }).then((data) => {
        console.log(data);
        setPlayerJoined(data);
      });
      
      setDataUpdated(true)
    }
    getQ();
  }, [adres]);

  useEffect(() => {
    async function checkAnswered() {
      if (questionIndex === questionCount - 1) {
        await readContract({
          address: adres,
          abi: abi,
          functionName: "getAllQuestionsAnswered",
        }).then((data) => setAnswered(data));
      }
    }
    checkAnswered();
  }, [questionIndex]);

  async function handleHome() {
    if (!answered) {
      return toast({
        title: "You did not answer all questions",
        status: "error",
        isClosable: true,
      });
    }
  }
  


 async function answer(index){
  setClicked(new Map(clicked.set(questionIndex,true)))
  // console.log(clicked.get(questionIndex))
  // console.log(clicked.get(2))
  const cevap = document.getElementById(`buton${index}`).innerText

  console.log(cevap)
  const newquestionIndexArray = [...questionIndexArray,questionIndex]
  setQuestionArray(newquestionIndexArray)
  const newoptionArray = [...optionArray,index]
  setOptionArray(newoptionArray)
  
  
  // console.log(optionsData[questionIndex].options.indexOf(cevap))
 }


 console.log(questionIndexArray)
 console.log(optionArray)
    
    async function answerAllQuestions(){
      if(clicked.get(questionIndex)){
        await writeContract({
          address:  adres,
          abi: abi,
          functionName: "answerQuestion",
          args:[questionIndexArray,optionArray]
        })
        
      }
    }


   async function enterGame(address){
    await writeContract({
      address: address,
      abi: abi,
      functionName: "joinGame",
      value: parseEther("0.01"),
    })
    setDataUpdated(true)
    window.location.reload();
   }
   useContractEvent({
    address:adres,
    abi:abi,
    eventName:"PlayerJoined",
    listener(log){
     setLog(log)
    }

 })
 useEffect(()=>{
  async function doit(){
    if(!!log){
      window.location.reload();
    }
  }
doit();
 },[log])



  async function handleBackQuestion() {
    if (questionIndex === 0) {
      return toast({
        title: "That is enough BRUH ",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    } else if (questionIndex > 0) {
      setQuestionIndex(questionIndex - 1);
    }
  }
  async function handleNextQuestion() {
    if (questionIndex === questionCount - 1) {
      return toast({
        title: "That is enough BRUH ",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    } else if (questionIndex <= questionCount - 1) {
      setQuestionIndex(questionIndex + 1);
    }
  }
  
  if(isPlayerAlreadyJoined){

  
  return (
    <Container
      mt="40px"
      justifyContent="center"
      alignItems="center"
      display="flex"
      flexDirection="column"
    >
      <Button mb="40px" >
        {questionIndex === questionCount - 1  ? (
          <Link to={"/"} onClick={() => handleHome()}>
          Home
        </Link>
        ) : (
          <></>
        )}
      </Button>
      <Box
        justifyContent="center"
        alignItems="center"
        display="flex"
        flexDirection="column"
      >
        {dataUpdated ? (
          <Box w="700px" mb="40px">
            <Card m="20px">
              <Heading>{optionsData[questionIndex].text}</Heading>
              <SimpleGrid columns={2} spacing={10}>
                
                                
                      <Button id="buton0" isDisabled={clicked.get(questionIndex)} onClick={()=>answer(0)} >{optionsData[questionIndex].options[0]}</Button> 
                      <Button id="buton1" isDisabled={clicked.get(questionIndex)} onClick={()=>answer(1)} >{optionsData[questionIndex].options[1]}</Button> 
                      <Button id="buton2" isDisabled={clicked.get(questionIndex)}  onClick={()=>answer(2)} >{optionsData[questionIndex].options[2]}</Button> 
                      <Button id="buton3" isDisabled={clicked.get(questionIndex)} onClick={()=>answer(3)} >{optionsData[questionIndex].options[3]}</Button> 
                    
                  
              </SimpleGrid>
            </Card>
          </Box>
        ) : (
          <Spinner color="red.500" />
        )}
        {questionIndex === 0 ? (
          <Button
            onClick={() => {
              handleNextQuestion();
            }}
          >
            Next Question
          </Button>
        ) : (
          <Box>
            <Button
              onClick={() => {
                handleBackQuestion();
              }}
            >
              Back
            </Button>
            <Button
              onClick={() => {
                handleNextQuestion();
              }}
            >
              Next Question
            </Button>
          </Box>
        )}
        {}

        {/* // { optionsData.map((questionData)=>{
    //    return <QuestionCard text={questionData.text} correctOption={questionData.correctOption} options={questionData.options}></QuestionCard>
    //   })} */}
      </Box>
      {questionIndex===questionCount-1
      ? (<Button onClick={()=>{answerAllQuestions()}}>Submit the Quiz</Button>)
      : (<Button>Answer All Questions</Button>)
      }
    </Container>
  )
  }
  else{
    return(<Box><Button onClick={()=>enterGame(adres)}>Enter The Game</Button ></Box>)
  }
};

export default QuestionPage;

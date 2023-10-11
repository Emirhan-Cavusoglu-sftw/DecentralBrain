import { Box, Heading,Card, Input, SimpleGrid, Button, useToast, } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { Link ,useParams} from 'react-router-dom'
import { abiFactory } from "../contracts/QuizContractFactory.json";
import { abi } from "../contracts/QuizContract.json";
import { useAccount, useContractEvent } from 'wagmi';
import { readContract, writeContract } from "@wagmi/core";
const CreateQuizContractPage = () => {
  const {num} = useParams();
  const { address, isConnected } = useAccount();
  const [contractAddress,setcontractAddress] = useState();
  const [count, setCount] = useState(0);
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState("");
  const [options1, setOptions1] = useState("");
  const [options2, setOptions2] = useState("");
  const [options3, setOptions3] = useState("");
  const [correctOption,setcorrectOption] = useState("");
  const [optionArray,setoptionArray] = useState([]);
  const [questionArray,setquestionArray] = useState([]);
  const [correctOptionArray,setcorrectOptionArray] = useState([]);
  const [log,setLog] = useState();
  const toast = useToast()
  const number = 1;
  const factoryAddress = "0x0B6Bf7C2Ac3a0a6a932D801533a0DCECB9c0438c"
  
 

 
  
  
  useEffect(()=>{
    async function getAddress(){
      await readContract({
        address: factoryAddress,
        abi: abiFactory,
        functionName: "getUserToContract",
        args:[address]
      }).then((data) => setcontractAddress(data));
    }
    getAddress()
  },[])
  
  
  
  async function enterQuestions() {
    if(question==="" || options ==="" || options1 === "" || options2 === "" || options3 === "" || correctOption === ""){
      return toast({
        title:"there are empty inputs",
        status:"error",
        isClosable:true,
        position:"top"
      })
    }else{

    
    console.log(options);
    console.log(options1);
    console.log(options2);
    console.log(options3);
    setCount(count + 1);
    
    
    const newQuestionArray = [...questionArray,question]
    setquestionArray(newQuestionArray)
    
    
    const newOptionArray = [...optionArray,[options,options1,options2,options3]]
    setoptionArray(newOptionArray)
    

    const newCorrectOptionArray = [...correctOptionArray,correctOption]
    setcorrectOptionArray(newCorrectOptionArray);
    

    
    setQuestion("")
    setOptions("")
    setOptions1("")
    setOptions2("")
    setOptions3("")
    setcorrectOption("")
    
    
    return toast({
      title:"your question added",
      status:"success",
      isClosable:true,
      position:"top"
    })
  }
}

async function submitQuestions(){
  await writeContract({
    address:contractAddress,
    abi:abi,
    functionName:"addQuestions",
    args:[questionArray,correctOptionArray,optionArray]

  })
}

useContractEvent({
  address:contractAddress,
  abi:abi,
  eventName:"QuestionAdded",
  listener(log){
    setLog(log)
    
    
    //  return toast({
      //   title:log,
      //   status:"success",
      //   position:"top",
      //   duration:10000,
      //   isClosable:true
      //  })
  }
})
async function consoleee(){
  // console.log(log[0].args.text);
  console.log(questionArray)
  console.log(optionArray)
  console.log(correctOptionArray)
  console.log(num.indexOf)
}

useEffect(()=>{
  async function doit(){
    if(!!log){

      return toast({
        title:"your questions added successfully",
        status:"success",
        position:"top",
        isClosable:true,
        duration:9000
      })
    }
  }
  doit();
},[log])
  
  
  return (count===Number(num))? <Box display="flex" flexDirection="column" alignItems="center" padding="20px" m="20px"><Button m="20px" onClick={()=>{window.location.reload()}}>You Can write again if you are not sure</Button><Button onClick={()=>{submitQuestions()}}>Submit All Questions</Button><Button onClick={()=>{consoleee()}}>Console</Button></Box> 
  :(
    <Box display="flex" flexDirection="column" textAlign="center" alignItems="center" justifyContent="center">
        <Heading as="">Your Contract Address {contractAddress}</Heading>
        <Heading>Question {count}</Heading>
        <Card w="500px" textAlign="center" p="50px">
          {/* <Button mb="20px"></Button> */}

          
          <Heading as="h2">Enter Your Quiz Contract Info </Heading>

          <Heading mt="50px">Enter Questions Here</Heading>

          <Input
            id="question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          ></Input>

          <Heading mt="10px">Enter Options Here</Heading>
          <SimpleGrid columns={2} spacing={10} mt="30px">
            <Input
              type="text"
              borderColor="black"
              id="option1"
              value={options}
              onChange={(e) => setOptions(e.target.value)}
            ></Input>
            <Input
              type="text"
              borderColor="black"
              id="option2"
              value={options1}
              onChange={(e) => setOptions1(e.target.value)}
            ></Input>
            <Input
              type="text"
              borderColor="black"
              id="option3"
              value={options2}
              onChange={(e) => setOptions2(e.target.value)}
            ></Input>
            <Input
              type="text"
              borderColor="black"
              id="option4"
              value={options3}
              onChange={(e) => setOptions3(e.target.value)}
            ></Input>
          </SimpleGrid>

          <Heading>Enter The Correct Option</Heading>
          <Input id="correctOption" value={correctOption} onChange={(e)=>setcorrectOption(e.target.value)}></Input>

          <Button
            mt="20px"
            onClick={() => {
              enterQuestions();
            }}
          >
            Add Question
          </Button>
          <Button onClick={()=>{consoleee()}}>Console</Button>
        </Card>
      </Box>
  )
}

export default CreateQuizContractPage
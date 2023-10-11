import { Container, Heading, Input ,Button} from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { abiFactory } from "../contracts/QuizContractFactory.json";
import { useAccount, useContractEvent } from 'wagmi';
import { readContract, writeContract } from "@wagmi/core";
import { Link } from 'react-router-dom';
const CreateContractPage = () => {
  const [questionCount,setquestionCount] = useState(0);
  const [log,setLog] = useState();
  const {address} = useAccount();
  const [eventData,setEventData] = useState()
  const factoryAddress = "0x0B6Bf7C2Ac3a0a6a932D801533a0DCECB9c0438c"

  async function setCount(number){
        
          setquestionCount(number)
        
  }
  async function createContract(){
   if(localStorage.getItem("questionCount")===0 || localStorage.getItem("questionCount")<0||localStorage.getItem("questionCount")===1){
    alert("at least 2 questions")
   }
   else{

     await writeContract({
       address: factoryAddress,
       abi: abiFactory,
       functionName: "createQuizContract",
       
      })
    }
  }
  async function setCountt(value){
    localStorage.setItem("questionCount",value);
  }

  useEffect(()=>{
  async function get(){

    await readContract({
      address: factoryAddress,
      abi: abiFactory,
      functionName: "getOnlyOne",
      args:[address]
    }).then((data) => setLog(data));
  }
  get();
  },[])
 
  useEffect(()=>{
    

      async function get(){
        if(!!log){
        await readContract({
          address: factoryAddress,
          abi: abiFactory,
          functionName: "getUserToContract",
          args:[address]
        }).then((data) => setLog(data));
        window.location.reload();
      }
      }
    get()
  },[eventData])

  
  

  return log ? <Button><Link to={`enter/${localStorage.getItem("questionCount")}`}>enter your quiz contract here and add some questions </Link></Button>
  :(
    <Container display="flex" flexDirection="column">
    <Button><Link to={"/"}>Home</Link></Button>
    <Heading>Enter Your QuestionCount</Heading>
    <Input type='number' onChange={(e)=>setCountt(e.target.value)}></Input>
    <Button onClick={()=>{createContract()}} >Create Your Quiz Contract</Button>
    <Button>Reload page</Button>    
    { log? <Button><Link to={`enter/${localStorage.getItem("questionCount")}`}>enter your quiz contract here and add some questions</Link></Button>:""}
    </Container>
  )
}

export default CreateContractPage
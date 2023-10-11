import { Box, Button, Card, Input } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useContractEvent } from 'wagmi'
import { abiFactory } from "../contracts/QuizContractFactory.json";
import { abi } from "../contracts/QuizContract.json";
const JoinQuizPage = () => {
  const [address,setAddress] = useState()
  const [log,setLog] = useState();
  
  function updateAddress(text) {
    setAddress(text);
  }
  
 
  
  return (
    <Box>
      <Card>
       
         <Button><Link to={"/"}></Link></Button>
        <Input type='text' onChange={(e)=> updateAddress(e.target.value)}></Input>
       <Button> <Link to={`quiz/${address}`}>Join Game</Link></Button>
      </Card>
            
    </Box>
  )
}

export default JoinQuizPage
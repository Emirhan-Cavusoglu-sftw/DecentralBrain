import React, { useState } from 'react'
import { Box, Button, Card, Heading, SimpleGrid ,  } from '@chakra-ui/react'
const QuestionCard = ({text,correctOption,options}) => {

  const [answered,setAnswered] =  useState(false)
  
  
    return (
    <Box w="700px" mb="40px">

    <Card m="20px">
        <Heading>{text}</Heading>
        <SimpleGrid columns={2} spacing={10}>
            {options.map((option)=>{
                return <Button onClick={()=>{setAnswered(true)}}>{option}</Button>
            })}
        </SimpleGrid>
    </Card>
            </Box>
  )
}

export default QuestionCard
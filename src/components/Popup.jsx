import { Box, Card, Heading } from '@chakra-ui/react'
import React from 'react'

const Popup = ({trigger}) => {
  return trigger ? (
    <Box position="fixed" top="400" left="900" right="300" bottom="500" width="200vw" justifyContent="center" backgroundColor="white"alignItems="center" >
       <Card>

       <Heading>Pop Up</Heading>
       </Card>
    </Box>
  ):"";
}

export default Popup
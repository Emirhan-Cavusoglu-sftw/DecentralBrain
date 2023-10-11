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
} from "@chakra-ui/react";
import {
  useAccount,
  useContractRead,
  useContractWrite,
  useBlockNumber,
} from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { abi } from "./contracts/QuizContract.json";
import { readContract } from "@wagmi/core";
import QuestionCard from "./components/QuestionCard";
import Nav from "./components/Nav";
import { Link, Route, Routes } from "react-router-dom";
import QuestionPage from "./pages/QuestionPage";
import JoinQuizPage from "./pages/JoinQuizPage";
import CreateQuizContractPage from "./pages/CreateQuizContractPage";
import CreateContractPage from "./pages/CreateContractPage";
import Popup from "./components/Popup";

function App() {
  const { address, isConnected } = useAccount();
  const [questionIndex, setQuestionIndex] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);
  const [optionsData, setOptionsData] = useState([]);
  const [dataUpdated, setDataUpdated] = useState(false);
  const toast = useToast();
  
  

 
  if (isConnected) {
    return (
      
        <Container
          justifyContent="space-between"
          display="flex"
          alignItems={"center"}
          flexDirection={"column"}
          
        >
          <Nav></Nav>
          
           
          <Routes >
            <Route path="/" element={<Box mt="50px" justifyContent="space-between" p="20px" display="flex" flexDirection="row"><Button mr="100px" ><Link to={"/create"}>Create Quiz </Link></Button><Button><Link to={"/join"}>Join a quiz</Link></Button></Box>}></Route>
            <Route path="/join" element={<JoinQuizPage></JoinQuizPage>}></Route>
            <Route path="/join/quiz/:adres" element={<QuestionPage></QuestionPage>}></Route>
            <Route path="/create" element={<CreateContractPage></CreateContractPage>}></Route>
             {/* <Route path="/create" element={<CreateQuizContractPage></CreateQuizContractPage>}></Route> */}
            <Route path="/create/enter/:num" element={<CreateQuizContractPage></CreateQuizContractPage>}></Route>
          </Routes>
          
        </Container>
      
    );
  } else {
    return <><Container mt="300px"><Text  display="flex" alignContent="center" flexDirection="column" justifyContent="space-between" alignItems="center">You did not connect</Text><ConnectButton ></ConnectButton></Container></>;
  }
}

export default App;

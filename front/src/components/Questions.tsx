import React, { useEffect, useState } from "react";
import { Box, Button, List, Mark, SimpleGrid, Space, Text, Title } from "@mantine/core";
import { useApiGet, useApiPost } from "@/hook/useApi";
import { QuestionDto } from "@/schema/questionSchema";
import { ResponseMessage, ResponseMessageProps } from "@/components/ResponseMessage";
import { StudentDto } from "@/schema/studentSchema";
import { InstanceDto } from "@/schema/instanceSchema"
export interface QuestionProps {
    message: string,
    questionId: number
    success: boolean
}

interface Props {
  questions: QuestionProps[]
}

export const Questions = (props: Props) => {
console.log('props:', props)

  const challengeId = localStorage.getItem("challengeId");
  const userId = localStorage.getItem("userId");
  if(!challengeId || !userId) return <></>

  const { data: questionData, getData: getQuestionData } = useApiGet<QuestionDto>("auth/question");
  const { data: studentData, getData: getStudentData } = useApiGet<StudentDto>("student");
  const { postData: getQuestionChallengeData } = useApiPost<InstanceDto>("auth/challenge");


  const [response, setResponse] = useState<ResponseMessageProps>({success: false});


  useEffect(() => {
    if(props.questions.length > 0) {
      const lastQuestion = [...props.questions].pop() as QuestionProps
      getQuestionData(`${challengeId}/${lastQuestion.questionId}`)
    }
    getStudentData(userId);
  }, [props.questions])


  return (
    <>
      <Title>Question n°{questionData?.questionId}</Title>
      <Text size="xl">Afin de vérifier votre réponse, cliqué sur le bouton "Test".</Text>
      <Space h="lg"/>
      {questionData &&
        <SimpleGrid spacing="xs">
          <Text size="xl">Votre score est de <Mark color="teal">{studentData?.rating}</Mark></Text>
          <Text size="xl">Énoncé : {questionData.textQuestion}</Text>
          {props.questions.length && props.questions.map(question => question.success && <ResponseMessage success={true} message={question.message}/>)}
          {props.questions.length && <ResponseMessage success={[...props.questions].pop()?.success as QuestionProps["success"]} message={[...props.questions].pop()?.message}/>}
        </SimpleGrid>
      }
    </>
  )
}
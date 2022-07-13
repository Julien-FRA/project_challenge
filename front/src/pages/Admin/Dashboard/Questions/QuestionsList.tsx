import React, { useEffect, useState } from 'react';
import { Container, Table, Title } from "@mantine/core";
import { useApiGetList } from "@/hook/useApi";

interface QuestionList {
  questionId: number;
  textQuestion: string;
  scoreQuestion: number;
}

// Managing the data call
export const QuestionsList = () => {
  const {data: questions, getData} = useApiGetList<QuestionList>('auth/question/1');

  useEffect(() => { getData() }, []);

  // Showing the data
  return(
    <Container size="sm" mt="xl">
      <Title>Liste des Questions</Title>
      <Table striped horizontalSpacing="md" verticalSpacing="md" fontSize="md">
        <thead>
          <tr>
            <th>ID de la question</th>
            <th>Contenu de la question</th>
            <th>Score de la question</th>
          </tr>
        </thead>
        <tbody>
          {!!questions &&
            questions.rows.map((questions, index) =>
              <tr key={`${questions}-${index}`}>
                <td>{questions.questionId}</td>
                <td>{questions.textQuestion}</td>
                <td>{questions.scoreQuestion}</td>
              </tr>
            )
          }
        </tbody>
      </Table>
    </Container>
  )
}
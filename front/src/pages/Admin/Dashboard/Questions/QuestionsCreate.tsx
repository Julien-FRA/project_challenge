import React, { useState } from "react";
import { z } from 'zod';
import { FormProvider, useForm } from "react-hook-form";
import { Button, Container, Group, SimpleGrid, Text, Title, Alert, Tooltip} from "@mantine/core";
import { zodResolver } from "@hookform/resolvers/zod";
import { questionCreateSchema, QuestionCreateDto, questionInputSchema } from "@/schema/questionSchema";
import { InputController } from "@/components/inputs/InputController";
import { useApiPost } from "@/hook/useApi";
import { ResponseMessage, ResponseMessageProps } from "@/components/ResponseMessage";

const formSchema  = questionInputSchema
export type FormSchemaDto = z.infer<typeof formSchema>

export const QuestionCreate = () => {
  const methods = useForm<FormSchemaDto>({
    mode: "all",
    resolver: zodResolver(formSchema)
  });

  const [response, setResponse] = useState<ResponseMessageProps>({success: false});
  const { trigger, getValues } = methods;

  const handleSubmit = async () => {
    const isStepValid = await trigger(["challengeId", "textQuestion", "commandQuestion", "expectedAnswer", "scoreQuestion"]);
    const values = getValues()


    if (!isStepValid && !values) return setResponse({ success: false, message :"Bah, pk ta rien mit gros ? 🥲"})
    
    const { challengeId, textQuestion, commandQuestion, expectedAnswer, scoreQuestion } = values

    const questionPost = await createQuestionPost({ challengeId: Number(challengeId), textQuestion, commandQuestion, expectedAnswer, scoreQuestion: Number(scoreQuestion) });
    if(!questionPost) return setResponse({ success: false, message :"Ca a bug wsh 🥲"})

    // Clear form inputs
    methods.reset();
    return setResponse({success: true, message: `La question a bien été créée 🍆`})
  };
  
  const { postData: createQuestionPost } = useApiPost<QuestionCreateDto>(`auth/question`);
  
  return (
    <Container size="sm" mt="xl">
      <Title>Créer une nouvelle question</Title>
      <SimpleGrid cols={1} spacing="lg">
        <Text size="sm">Veuillez remplir le formulaire afin de créer une nouvelle question</Text>
        <FormProvider {...methods} >
          <form className="flex flex-col gap-4">
            <SimpleGrid cols={1} spacing="sm">
              <InputController
                name="challengeId"
                label="Id du challenge :"
                placeholder="Id du challenge pour la question"
                type="number"
                errorMessage="L'id du challenge n'est pas correct"
                required
              />
              <InputController
                name="textQuestion"
                label="Contenu de la question"
                placeholder="Enoncé de la question"
                errorMessage="L'énoncé a une forme incorrecte"
                required
              />
              <InputController
                name="commandQuestion"
                label="Commande de la question"
                placeholder="Commande à exécuter pour la question"
                errorMessage="La commande a exécuter à une forme incorrecte"
                required
              />
              <InputController
                name="expectedAnswer"
                label="Réponse attendue"
                placeholder="Réponse attendue par l'étudiant"
                errorMessage="La réponse attendue à une forme incorrecte"
                required
              />
              <InputController
                name="scoreQuestion"
                label="Score de la question"
                placeholder="Score de la question"
                type="number"
                errorMessage="Le score de la question doit être un nombre"
                required
              />
            </SimpleGrid>
            <Group position="right" mt="md">
              <Button onClick={handleSubmit}>Créer</Button>
            </Group>
          {!!response.message && <ResponseMessage success={response.success} message={response.message} />}
          </form>
        </FormProvider>
      </SimpleGrid>
    </Container>
  )
}
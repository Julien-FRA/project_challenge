import React, { useState } from "react";
import { z } from 'zod';
import { useClipboard } from "@mantine/hooks";
import { FormProvider, useForm } from "react-hook-form";
import { Button, Container, Group, SimpleGrid, Text, Title, Alert, Tooltip} from "@mantine/core";
import { zodResolver } from "@hookform/resolvers/zod";
import { challengeCreateSchema, ChallengeCreateDto } from "@/schema/challengeSchema";
import { PromoCreateDto, promoCreateSchema } from "@/schema/promoSchema";
import { InputController } from "@/components/inputs/InputController";
import { ChallengePromoCreateDto } from "@/schema/challengePromoSchema";
import { useApiPost } from "@/hook/useApi";
import { URL } from "@/utils/config";
import { ResponseMessage, ResponseMessageProps } from "@/components/ResponseMessage";

const formSchema  = challengeCreateSchema.merge(promoCreateSchema)
export type FormSchemaDto = z.infer<typeof formSchema>

export const ChallengeCreate = () => {

  const [link, setLink] = useState<string>()
  const clipboard = useClipboard({ timeout: 1500 });
  const [response, setResponse] = useState<ResponseMessageProps>({success: false});

  const methods = useForm<FormSchemaDto>({
    mode: "all",
    resolver: zodResolver(formSchema)
  });

  const { trigger, getValues } = methods;
  const {postData: challengePromoPost} = useApiPost<ChallengePromoCreateDto, { token: string }>('challengePromo')

  const handleSubmit = async () => {
    const isStepValid = await trigger(["challengeName", "promoName", "publicKey"]);
    const values = getValues()

    if (!isStepValid && !values) return setResponse({success: false, message: "Remplie les values stp!! 👊"})

    const {promoName, ...challengeValues}= values

    const promoId = await createPromo(promoName)
    const challengeId = await createChallenge(challengeValues)

    if(!challengeId || !promoId) return setResponse({success: false, message: "Non mais ça bug encore wesh 🤯"})

    const data = await challengePromoPost({
      challengeId,
      promoId,
      isOpen: false,
    })

    if(data?.token) setLink(data.token)
    methods.reset()
  };

  const { postData: createPromoPost } = useApiPost<PromoCreateDto>('auth/promo')
  const createPromo = async(promoName: string) => {
    const data = await createPromoPost({ promoName })
    if(!data) return
    return data.id
  }

  const { postData: createChallengePost } = useApiPost<ChallengeCreateDto>('auth/challenge')
  const createChallenge = async(challenge: ChallengeCreateDto) => {
    const data = await createChallengePost(challenge)
    if(!data) return
    return data.id
  }

  return (
    <Container size="sm" mt="xl">
      <Title>Créer un nouveau challenge</Title>
      <SimpleGrid cols={1} spacing="lg">
        <Text size="sm">Veuillez remplir le formulaire afin de générer un lien pour le challenge</Text>
        <FormProvider {...methods} >
          <form className="flex flex-col gap-4">
            <SimpleGrid cols={1} spacing="sm">
              <InputController
                name="challengeName"
                label="Nom du Challenge :"
                placeholder="Nom du Challenge :"
                errorMessage="Veuillez renseigner un nom de challenge valide"
                required
              />
              <InputController
                name="publicKey"
                label="Clé publique :"
                placeholder="Clé publique :"
                errorMessage="Veuillez renseigner une clé publique valide"
                required
              />
              <InputController
                name="promoName"
                label="Promo :"
                placeholder="MT4"
                errorMessage="Veuillez renseigner un nom de promo valide"
                required
              />
            </SimpleGrid>
            <Group position="right" mt="md">
              <Button onClick={handleSubmit}>Enregistrer</Button>
            </Group>
          </form>
        </FormProvider>
        {link &&
          <Tooltip
              opened={clipboard.copied ? true : false}
              label='Copier'
              color='teal'
              withArrow
            >
              <Alert title="Lien créé!" color="teal" radius="md" onClick={() => clipboard.copy(`${URL}/sing-up?token=${link}`)}>
                <Text variant="link">Récupérer le lien du challenge</Text>
              </Alert>
            </Tooltip>
          }
        {!!response.message && <ResponseMessage success={response.success} message={response.message} />}
      </SimpleGrid>
    </Container>
  )
}

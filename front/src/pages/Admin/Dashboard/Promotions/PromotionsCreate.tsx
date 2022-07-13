import React, { useState } from "react";
import { z } from 'zod';
import { FormProvider, useForm } from "react-hook-form";
import { Button, Container, Group, SimpleGrid, Text, Title, Alert, Tooltip} from "@mantine/core";
import { zodResolver } from "@hookform/resolvers/zod";
import { promoCreateSchema, PromoCreateDto } from "@/schema/promoSchema";
import { InputController } from "@/components/inputs/InputController";
import { useApiPost } from "@/hook/useApi";
import { ResponseMessage, ResponseMessageProps } from "@/components/ResponseMessage";

const formSchema  = promoCreateSchema
export type FormSchemaDto = z.infer<typeof formSchema>

export const PromotionsCreate = () => {
  const methods = useForm<FormSchemaDto>({
    mode: "all",
    resolver: zodResolver(formSchema)
  });

  const [response, setResponse] = useState<ResponseMessageProps>({success: false});
  const { trigger, getValues } = methods;

  const handleSubmit = async () => {
    const isStepValid = await trigger(["promoName"]);
    const values = getValues()


    if (!isStepValid && !values) return setResponse({ success: false, message :"Bah, pk ta rien mit gros ? 🥲"})
    
    const {promoName} = values

    const promotionPost = await createPromotionPost({ promoName });
    if(!promotionPost) return setResponse({ success: false, message :"Ca a bug wsh 🥲"})

    // Clear form inputs
    methods.reset();
    return setResponse({success: true, message: `La promotion ${promoName} a bien été créée 🍆`})
  };

  const { postData: createPromotionPost } = useApiPost<PromoCreateDto>('auth/promo');
  
  return (
    <Container size="sm" mt="xl">
      <Title>Créer une nouvelle Promotion</Title>
      <SimpleGrid cols={1} spacing="lg">
        <Text size="sm">Veuillez remplir le formulaire afin de créer une nouvelle promotion</Text>
        <FormProvider {...methods} >
          <form className="flex flex-col gap-4">
            <SimpleGrid cols={1} spacing="sm">
              <InputController
                name="promoName"
                label="Nom :"
                placeholder="Nom de la promotion..."
                errorMessage="La promotion doit contenir au moins 2 caractères"
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
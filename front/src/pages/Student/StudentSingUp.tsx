import React, { useEffect } from "react";
import { Affix, Button, Container, Group, Notification, SimpleGrid, Text, Title } from "@mantine/core";
import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { InputController } from "@/components/inputs/InputController";
import { TokenDto, tokenSchema } from "@/schema/tokenSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useApiGet, useApiPost } from "@/hook/useApi";
import { getToken } from "@/utils/token";
import { RegisterCreateDto, RegisterDto } from "@/schema/registerSchema";
import { ChallengePromoDto } from "@/schema/challengePromoSchema";

export const StudentSingUp = () => {
  const challengeId = localStorage.getItem("challengeId");
  
  const [isSending, setIsSending] = useState(false);

  const { getData: getChallengePromoDataId } = useApiGet<RegisterCreateDto>("register/verify");
  const { postData } = useApiPost<RegisterDto>("register");

  const { data: challengePromoData, getData: getChallengePromoData } = useApiGet<ChallengePromoDto>("challengePromo");
  useEffect(() => {
    const watchChallengePromo = async() => getChallengePromoData(`id/${challengeId}`)
    watchChallengePromo()
  }, [])


  const verifyToken = async () => {
    const token = await getToken();
    if (!token) return;

    const challengePromoDataId = await getChallengePromoDataId(token);
    if (challengePromoDataId) return challengePromoDataId;

    return false;
  };

  const methods = useForm<TokenDto>({
    mode: "all",
    resolver: zodResolver(tokenSchema),
  });
  const { getValues } = methods;

  const onSubmit = async (_data: TokenDto) => {
    const token = await verifyToken();
    if (!token) return;

    const { challengePromoId, challengeId, promoId } = token;

    const emailData = await postData({ email: _data.email, challengePromoId, challengeId, promoId });

    if (!emailData) return;

    setIsSending(true);
  };

  if(!challengePromoData) return (<Container mt={50}>
    <Title align="center">
      Le challange est finie
    </Title>
  </Container>)

  return (
    <>
      <Container size="xs" px="xs" mt="xl">
        <Title>Inscripton</Title>
        <SimpleGrid cols={1} spacing="lg">
          <Text size="xl">
            Entrez votre adresse email afin de recevoir un lien permettant de vous inscrire au challenge
          </Text>
          <FormProvider {...methods}>
            <form className="flex flex-col gap-4" onSubmit={methods.handleSubmit(onSubmit)}>
              <InputController
                name="email"
                label="Adresse e-mail"
                placeholder="your@email.com"
                errorMessage="Veuillez renseigner un email valide"
                required
              />
              <Group position="right" mt="md">
                <Button color="blue" type="submit">
                  Envoyer
                </Button>
              </Group>
            </form>
          </FormProvider>
        </SimpleGrid>
      </Container>
      {isSending && (
        <Affix position={{ bottom: 20, right: 20 }}>
          <Notification title="Envoyé !" color="teal" disallowClose>
            Vous avez reçu un mail sur {getValues("email")}
          </Notification>
        </Affix>
      )}
    </>
  );
};

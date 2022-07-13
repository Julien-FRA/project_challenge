import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {  Button, Container, Group, Step, Stepper, Text, Title } from "@mantine/core";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { InstanceConfig } from "@/components/InstanceConfig";
import { Instructions } from "@/components/Instructions";
import { TestConnection } from "@/components/TestConnection";
import { UserInfo } from "@/components/UserInfo";
import { InstanceCreateDto, instanceSchema } from "@/schema/instanceSchema";
import { StudentDto, studentSchema } from "@/schema/studentSchema";
import { useApiGet, useApiPost } from "@/hook/useApi";
import { useNavigate } from "react-router-dom";
import { PromoDto } from "@/schema/promoSchema";
import { Instance } from "@/schema/instanceDto";
import { ResponseMessage, ResponseMessageProps } from "@/components/ResponseMessage";
import { ChallengePromoDto } from "@/schema/challengePromoSchema";
import { ChallengeDto } from "@/schema/challengeSchema";
interface IFormInput {
  givenName: string;
  familyName: string;
  addressIp: string;
  username: string;
  port: string;
}

export const StudentRegister = (): JSX.Element => {
  const userId = localStorage.getItem("userId");
  const challengeId = localStorage.getItem("challengeId");
  const promoId = localStorage.getItem("promoId");

  if (!userId || !promoId || !challengeId)
    return (
      <Container>
        <Text size="xl" align="center" color="red" mt={50}>
          Veuillez repasser par le lien
        </Text>
      </Container>
    );

  useEffect(() => {
    getPromoData(promoId);
    getChallengeData(challengeId);
  }, []);

  const [active, setActive] = useState<number>(0);
  const [response, setResponse] = useState<ResponseMessageProps>({success: false});

  const navigate = useNavigate()

  const validationSchema = [
    z.never(),
    studentSchema.pick({
      familyName: true,
      givenName: true,
    }),
    instanceSchema.pick({
      addressIp: true,
      username: true,
      port: true,
    }),
    z.never(),
  ];
  const stepLenght = validationSchema.length - 1
  const currentValidationSchema = validationSchema[active];

  const methods = useForm<IFormInput>({
    shouldUnregister: false,
    mode: "all",
    resolver: zodResolver(currentValidationSchema),
  });
  const { trigger, getValues } = methods;

  const { data: promoData, getData: getPromoData } = useApiGet<PromoDto>("auth/promo");
  const { data: challengeData, getData: getChallengeData } = useApiGet<ChallengeDto>("auth/challenge");
  const { postData: postStudentData } = useApiPost<StudentDto>("student");
  const { data: studentData, getData: getStudentData } = useApiGet<StudentDto>("student");
  const { postData: postLinkStudentToChallengeData } = useApiPost<any>("challengeStudent");
  const { postData: postCreateInstanceData } = useApiPost<InstanceCreateDto>("instance");
  const { postData: postInstanceData, isLoading } = useApiPost("instance/connection")

  const values = getValues()

  const { data: challengePromoData, getData: getChallengePromoData } = useApiGet<ChallengePromoDto>("challengePromo");
  useEffect(() => {
    const watchChallengePromo = async() => getChallengePromoData(`id/${challengeId}`)
    watchChallengePromo()
  }, [])



  const testInstanceConnection = async () => {

    const connection = await postInstanceData({
      addressIp: values.addressIp,
      username: values.username,
      port: values.port
    })

    if(!connection) return setResponse({ success: false, message :"la connexion a échoué mon gars 🥲"})
    return setResponse({success: true, message: "La validation est ok mgl 🍆"})
  }

  if(studentData?.studentId) return <>{navigate("../challenge", { state: userId })}</>

  useEffect(() => {
    const watchStudent = async () => await getStudentData(userId)
    watchStudent()
  }, [userId])

  const handleSubmit = async () => {

    if (!values) return setResponse({success: false, message: "Une erreur s'est produite frérot 💩"})

    const createStudent = await postStudentData({
      studentId: Number(userId),
      familyName: values.familyName,
      givenName: values.givenName,
      promoId: Number(promoId),
      rating: 0,
    });

    if(!createStudent) return setResponse({success: false, message: "Une erreur s'est produite frérot 💩"})

    const linkStudentToChallenge = await postLinkStudentToChallengeData({
      studentId: userId,
      challengeId: challengeId,
    });

    // if (parseFloat(values.port) == 22) return console.error("For secuity purpose it's recommended to not use the default ssh port for your connection. So you have to change it before continues")

    const createInstance = await postCreateInstanceData({
      studentId: Number(userId),
      challengeId: Number(challengeId),
      addressIp: values.addressIp,
      username: values.username,
      port: Number(values.port)
    })

    if(!linkStudentToChallenge || !createInstance) return setResponse({success: false, message: "Une erreur s'est produite frérot 💩"})

    if (!linkStudentToChallenge || !createInstance) return setResponse({success: false, message: "Une erreur s'est produite"});

    return navigate("../challenge", { state: userId });
  };

  const nextStep = async () => {
    const isStepValid = await trigger(["familyName", "givenName", "addressIp", "username", "port"]);
    if (isStepValid) setActive((current) => (current < stepLenght ? current + 1 : current));
  };
  const prevStep = () => {
    setActive((current) => (current > 0 ? current - 1 : current))
    setResponse({success: false})
  };

  if(!challengePromoData) return (<Container mt={50}>
    <Title align="center">
      Le challange est finie
    </Title>
  </Container>)

  return (
    <Container size="lg" mt={50} mb="lg">
      <FormProvider {...methods}>
        <form>
          <Stepper
            active={active}
            onStepClick={setActive}
            breakpoint="sm"
            iconSize={32}
            styles={{
              steps: {
                margin: "1rem",
                marginBottom: "2rem",
              },
              step: {
                gap: ".5rem",
                flexDirection: "column",
              },
            }}
          >
            <Step label="Consignes">
              <Instructions />
            </Step>
            <Step label="Coordonnées">{promoData && <UserInfo promoValue={promoData?.promoName} />}</Step>
            <Step label="Instance">
              {challengeData && <InstanceConfig publicKey={challengeData.publicKey} />}
            </Step>
            <Step label="Validation">
              <TestConnection addressIp={getValues().addressIp} username={getValues().username} port={parseFloat(getValues().port)}  />
              {!!response.message && <ResponseMessage success={response.success} message={response.message} />}
            </Step>
          </Stepper>

          <Group position="right" mt="xl">
            {active > 0 &&
              <Button variant="default" onClick={prevStep}>
                Précédent
              </Button>
            }
            { active < stepLenght
              ? <Button onClick={nextStep}>Suivant</Button>
              : response.success
                ? <Button onClick={handleSubmit} color="teal">Valider</Button>
                : <Button onClick={testInstanceConnection} loading={isLoading} loaderPosition="right">Tester</Button>
            }
          </Group>
        </form>
      </FormProvider>
    </Container>
  );
};

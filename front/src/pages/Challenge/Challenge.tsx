import React, { useEffect, useState } from "react";
import { QuestionProps, Questions } from "@/components/Questions";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Container,
  Group,
  Header,
  SimpleGrid,
  Space,
  Step,
  Stepper,
  Text,
  Title,
  useMantineTheme,
} from "@mantine/core";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { TestConnection } from "@/components/TestConnection";
import { useApiGet, useApiPost, usePutApi } from "@/hook/useApi";
import { StudentDto } from "@/schema/studentSchema";
import { ChallengeDto } from "@/schema/challengeSchema";
import { InstanceDto, instanceSchema } from "@/schema/instanceSchema";
import { ResponseMessage, ResponseMessageProps } from "@/components/ResponseMessage";
import { InstanceConfig } from "@/components/InstanceConfig";
import { ChallengePromoDto } from "@/schema/challengePromoSchema";

interface IFormInput {
  addressIp: string;
  username: string;
  port: number;
}

export const Challenge = () => {
  const [active, setActive] = useState(0);
  const theme = useMantineTheme();

  const userId = localStorage.getItem("userId");
  const challengeId = localStorage.getItem("challengeId");

  if (!userId || !challengeId)
    return (
      <Container>
        <Text size="xl" align="center" color="red" mt={50}>
          Une erreur s'est produite
        </Text>
      </Container>
    );

  const { data: studentData, getData: getStudentData } = useApiGet<StudentDto>("student");
  const { data: challengeData, getData: getChallengeData } = useApiGet<ChallengeDto>("auth/challenge");
  const { postData: postChallengeScoreQuestionData } = useApiPost<InstanceDto, QuestionProps[]>("auth/challenge/launch");


  const { data: instanceData, getData: getInstanceData } = useApiGet<InstanceDto>("instance");
  const { putData: putInstanceData } = usePutApi<InstanceDto>("instance");

  const { data: challengePromoData, getData: getChallengePromoData } = useApiGet<ChallengePromoDto>("challengePromo");
  useEffect(() => {
    const watchChallengePromo = async() => getChallengePromoData(`id/${challengeId}`)
    watchChallengePromo()
  }, [])

  useEffect(() => {
    if(!challengePromoData?.isOpen) return

    getChallengeData(challengeId);
    getStudentData(userId);
  }, [challengePromoData, challengeId, userId]);

  useEffect(() => {
    if(studentData && challengeData) getInstanceData(`${9}/${studentData.studentId}`)
  }, [studentData, challengeData]);

  const validationSchema = [
    instanceSchema.pick({
      addressIp: true,
      username: true,
      port: true,
    }),
    z.never(),
    z.never()
  ];

  const stepLenght = validationSchema.length;
  const currentValidationSchema = validationSchema[active];

  const methods = useForm<IFormInput>({
    shouldUnregister: false,
    mode: "all",
    resolver: zodResolver(currentValidationSchema),
  });
  const { trigger, getValues, setValue } = methods;

  if(instanceData){
    setValue("username", instanceData.username)
    setValue("addressIp", instanceData.addressIp)
    setValue("port", instanceData.port)
  }

  const nextStep = async () => {
    const isStepValid = await trigger(["addressIp", "username", "port"]);
    if (isStepValid) setActive((current) => (current < 5 ? current + 1 : current));
  };
  const prevStep = () => setActive((current) => (current > 0 ? current - 1 : current));

  const [response, setResponse] = useState<ResponseMessageProps>({success: false});
  const [question, setQuestion] = useState<QuestionProps[]>([]);

  const {postData: postInstanceData, isLoading} = useApiPost("instance/connection")

  const testInstanceConnection = async () => {
    const values = getValues();

    const connection = await postInstanceData({
      addressIp: values.addressIp,
      username: values.username,
      port: values.port
    })

    if(!connection || !instanceData?.studentId) return setResponse({ success: false, message :"la connexion a échoué mon gars 🥲"})

    if(values.addressIp !== instanceData?.addressIp || values.port !== instanceData?.port || values.username !== instanceData?.username) {
      await putInstanceData(`${challengeId}/${instanceData?.studentId}`, {
        challengeId: Number(challengeId),
        studentId: instanceData.studentId,
        ...values
      })
    }
    return setResponse({success: true, message: "La validation est ok mgl 🍆"})
  }

  const handleSubmit = async () => {
    const values = getValues();

    const challengeScore = await postChallengeScoreQuestionData({
      challengeId: Number(challengeId),
      studentId: Number(userId),
      addressIp: values.addressIp,
      username: values.username,
      port: values.port
    })

    if(!challengeScore) return
    setQuestion(challengeScore)
  };

  if(challengePromoData?.isOpen) return (<Container mt={50}>
    <Title align="center">
      Le challange est finie
    </Title>
  </Container>)

  return (
    <>
      <Header
        height={65}
        p="md"
        styles={{
          root: {
            display: "flex",
            alignItems: "center",
            background: theme.colors.indigo[6],
          },
        }}
      >
        {challengeData && studentData && (
          <Text size="lg" color="white">
            Challange : {challengeData?.challengeName} ({studentData?.familyName} {studentData?.givenName})
          </Text>
        )}
      </Header>
      <Space h="lg" />
      <Container size="lg">
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
              <Step label="Instance">
                  {challengeData && <InstanceConfig publicKey={challengeData.publicKey} />}
              </Step>
              <Step label="Connexion">
                {instanceData && <TestConnection addressIp={instanceData.addressIp} port={instanceData.port} username={instanceData.username} />}
                {!!response.message && <ResponseMessage success={response.success} message={response.message} />}
              </Step>
              <Step label="Questions">
                <Questions questions={question} />
              </Step>
            </Stepper>

            <Group position="right" mt="xl">
              <>
                {active > 0 && (
                  <Button variant="default" onClick={prevStep}>
                    Précédent
                  </Button>
                )}
                { active === 0 && <Button onClick={nextStep}>Suivant</Button>}
                { active === 1 && (
                  response.success
                    ? <Button onClick={nextStep}>Suivant</Button>
                    : <Button onClick={testInstanceConnection} loading={isLoading} loaderPosition="right">Tester</Button>
                  )
                }
                {active === stepLenght - 1 && <Button onClick={handleSubmit} color="teal">Valider</Button>}
              </>
            </Group>
          </form>
        </FormProvider>
      </Container>
    </>
  );
};

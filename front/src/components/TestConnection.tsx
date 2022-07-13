import { Button, Container, Space, Text, Title } from "@mantine/core";
import axios from "axios";
import React from "react";
import { InstanceDto } from "../schema/instanceSchema";
import { API_URL } from "../utils/config";

interface Props extends Omit<InstanceDto, "studentId" | "challengeId" >{}

export const TestConnection = (props: Props) => {
  return (
    <>
      <Title>Testez votre connexion à l'instance</Title>
      <Text size="xl">
        Testez votre connexion afin de poursuivre à l'étape suivante
      </Text>
      <Space h="lg" />
      <Text size="lg">Adresse IP : {props.username}</Text>
      <Text size="lg">Utilisateur : {props.addressIp}</Text>
      <Text size="lg">Port : {props.port}</Text>
    </>
  )
}

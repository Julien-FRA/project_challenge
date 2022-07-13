import React from "react";
import { SimpleGrid, Space, Text, Title, Code, Textarea } from "@mantine/core";
import { InputController } from "./inputs/InputController";
import { InstanceDto } from "@/schema/instanceSchema";

interface Props {
  publicKey: string
}

export const InstanceConfig = (props: Props) => {

  return (
    <div>
      <Title>Configurez votre instance</Title>
      <Text size="xl">
        Configurez votre instance et accordez l'accès à l'utilisateur identifié par la clé publique suivante:
      </Text>
      <Space h="lg" />
      <SimpleGrid spacing="xs">
        <Textarea label="Clé publique à utiliser" value={props.publicKey} autosize onChange={(e) => e.preventDefault()} />
        <InputController name="addressIp" label="Adresse IP" placeholder="Adresse IP" required errorMessage="Veuillez renseigner une adresse IP valide"/>
        <InputController name="username" label="Utilisateur de l'instance" placeholder="Utilisateur de l'instance" required errorMessage="Veuillez renseigner un nom valide"/>
        <InputController name="port" label="Port de l'instance" placeholder="Port de l'instance" required errorMessage="Veuillez renseigner un port valide"/>
      </SimpleGrid>
    </div>
  );
};

import React from "react";
import { SimpleGrid, Space, Text, Title } from "@mantine/core";
import { InputController } from "./inputs/InputController";

interface Props {
  promoValue: string
}

export const UserInfo = (props: Props) => {
  return (
    <>
      <Title>Inscription</Title>
      <Text size="xl">Entrez vos informations</Text>
      <Space h="lg" />

      <SimpleGrid spacing="xs">
        {/* //TODO remove default value */}
        <InputController defaultValue="familyName" name="familyName" label="Nom" placeholder="Nom" required errorMessage="Veuillez renseigner un prénom valide"/>
        <InputController defaultValue="givenName" name="givenName" label="Prénom" placeholder="Prénom" required errorMessage="Veuillez renseigner un nom valide"/>
        <InputController defaultValue={props.promoValue} name="promo" disabled label="Promo" errorMessage="Veuillez renseigner une promo valide"/>
      </SimpleGrid>
    </>
  );
};

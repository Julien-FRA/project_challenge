import React from "react";
import { Text, Title, Space, SimpleGrid } from "@mantine/core";

export const Instructions = () => {
  return (
    <>
      <Title>Consignes</Title>
      <Text size="xl">Bienvenue au challenge</Text>
      <Space h="lg" />

      <SimpleGrid spacing="xs">
        <Text>Vous allez configurer et déployer votre propre instance Ubunutu,
          et renseigner les coordonnées de connexion sur cette page. Ce sytème va procéder à exécuter un certain nombre
          de tests selon les critères listées ici. Votre score sera calculé automatiquement.</Text>
        <Text>Attention Utilisez une instance de déploiement dédiée à cet exercice. La perte des données pourrait arriver </Text>
      </SimpleGrid>
    </>
  )
}
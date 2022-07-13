import React, { useState } from "react";
import { Container, Text, Title, Button, Group, SimpleGrid } from "@mantine/core";
import { FormProvider, useForm } from "react-hook-form";
import { Navigate, useNavigate } from "react-router-dom";
import { useApiPost } from "@/hook/useApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { InputController } from "@/components/inputs/InputController";
import { AdminCreateDto, adminCreateSchema } from "@/schema/adminSchema";

export const AdminSignIn = () => {
  let navigate = useNavigate();

  const [connectionError, setConnectionError] = useState<string>();

  const methods = useForm<AdminCreateDto>({
    mode: "all",
    resolver: zodResolver(adminCreateSchema),
  });

  const { postData } = useApiPost<AdminCreateDto, {token: string}>(`auth/admin/connect`);

  const onSubmit = async (data: AdminCreateDto) => {
    const adminData = await postData(
      {
        pseudo: data.pseudo,
        password: data.password,
      },
      data.pseudo
    );

    if (!adminData) return setConnectionError("Pseudo et/ou mot de passe incorrect(s)");

    // If identification successful
    localStorage.setItem("ConnectedID", adminData.token)
    navigate("../admin");
  };

  return (
    <Container size="xs" px="xs" mt={50}>
      <Title>Connexion Administrateur</Title>
      <SimpleGrid cols={1} spacing="lg">
        <Text size="xl">Connectez vous en tant qu'admin</Text>
        <FormProvider {...methods}>
          <form className="flex flex-col gap-4" onSubmit={methods.handleSubmit(onSubmit)}>
            <SimpleGrid cols={1} spacing="sm">
              <InputController
                name="pseudo"
                label="Votre pseudo :"
                placeholder="Votre pseudo :"
                errorMessage="Veuillez rensiegner que des caractères pour le pseudo"
                required
              />
              <InputController
                name="password"
                type="password"
                placeholder="Votre mot de passe..."
                label="Vote mot de passe :"
                errorMessage="Le mot de passe doit contenir au moins une minuscule, une majuscule et un chiffre et comprte au moins 8 caractères"
                required
              />
            </SimpleGrid>
            <Group position="right" mt="md">
              <Button color="indigo" type="submit">
                Se connecter
              </Button>
            </Group>
          </form>
        </FormProvider>
        {connectionError && <Text color={"red"}>{connectionError}</Text>}
      </SimpleGrid>
    </Container>
  );
};

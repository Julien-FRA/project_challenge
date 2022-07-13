import React, { useState } from "react";
import { z } from 'zod';
import { FormProvider, useForm } from "react-hook-form";
import { Button, Container, Group, SimpleGrid, Text, Title, Alert, Tooltip} from "@mantine/core";
import { zodResolver } from "@hookform/resolvers/zod";
import { userCreateSchema, UserDto, UserCreateDto } from "@/schema/userSchema";
import { adminCreationSchema, AdminCreateDto } from "@/schema/adminCreationSchema";
import { InputController } from "@/components/inputs/InputController";
import { useApiPost } from "@/hook/useApi";
import { ResponseMessage, ResponseMessageProps } from "@/components/ResponseMessage";

const formSchema  = userCreateSchema.merge(adminCreationSchema)
export type FormSchemaDto = z.infer<typeof formSchema>

export const ManagementCreate = () => {
  const methods = useForm<FormSchemaDto>({
    mode: "all",
    resolver: zodResolver(formSchema)
  });

  const [response, setResponse] = useState<ResponseMessageProps>({success: false});
  const { trigger, getValues } = methods;

  const { postData: createUserPost } = useApiPost<UserCreateDto>('user');
  const { postData: createAdminPost } = useApiPost<AdminCreateDto>('auth/admin');

  const handleSubmit = async () => {
    const isStepValid = await trigger(["email", "pseudo", "password"]);
    const values = getValues()


    if (!isStepValid && !values) return setResponse({ success: false, message :"Bah, pk ta rien mit gros ? 🥲"})

    const { email, pseudo, password } = values

    // Create the admin in the user table & in the admin table
    const userAdmin = await createUserPost({ email, role: 1 });
    if(!userAdmin) return setResponse({ success: false, message :"Le mail existe déjà dans la base de donnée utilisateur, ça a échoué mon gars 🥲"})

    const adminData = await createAdminPost({ adminId: userAdmin.id, pseudo, password });
    if(!adminData) return setResponse({ success: false, message :"Ca a bug wsh 🥲"})

    // Clear form inputs
    methods.reset();
    return setResponse({success: true, message: `L'admin ${pseudo} a bien été créé 🍆`})
  };

  return (
    <Container size="sm" mt="xl">
      <Title>Créer un nouvel administrateur</Title>
      <SimpleGrid cols={1} spacing="lg">
        <Text size="sm">Veuillez remplir le formulaire afin de générer un nouvel administrateur</Text>
        <FormProvider {...methods} >
          <form className="flex flex-col gap-4">
            <SimpleGrid cols={1} spacing="sm">
              <InputController
                name="email"
                label="Email :"
                placeholder="Email :"
                errorMessage="Veuillez renseigner un email valide"
                required
              />
              <InputController
                name="pseudo"
                label="Nom de l'administrateur :"
                placeholder="Nom de l'administrateur :"
                errorMessage="Veuillez renseigner un nom d'utilisateur valide"
                required
              />
              <InputController
                name="password"
                label="Mot de passe :"
                placeholder="Mot de passe..."
                errorMessage="Le mot de passe doit contenir au moins une minuscule, une majuscule et un chiffre et comprte au moins 8 caractères"
                required
                type="password"
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

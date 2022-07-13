import React from "react";
import { Alert, Text } from "@mantine/core";

export interface ResponseMessageProps {
  success: boolean;
  message?: string
}

export const ResponseMessage = (props: ResponseMessageProps) => {
  const color = props.success ? "teal" : "red"
  return(
    <Alert title={props.success ? "Succés !" : "Erreur !"} color={color} radius="md" mt={15}>
      {props.message && <Text size="lg" color={color}>{props.message}</Text>}
    </Alert>
  )
}
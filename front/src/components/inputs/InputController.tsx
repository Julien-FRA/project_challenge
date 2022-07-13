import React from "react";
import { TextInput, TextInputProps } from "@mantine/core";
import {
  Controller, get, useFormContext
} from "react-hook-form";

interface InputControllerProps extends TextInputProps{
  name: string
  errorMessage: string
}

export const InputController = (props: InputControllerProps) => {
  const { control, formState: { errors }, register  } = useFormContext();
  const errorText = get(errors, props.name) ? props.errorMessage : "";

  return (
    <Controller
      {...props}
      control={control}
      render={ () =>
        <TextInput type={props.type} label={props.label} placeholder={props.placeholder} required={props.required} disabled={props.disabled}
          defaultValue={props.defaultValue}
          {...register(props.name)}
          error={errorText}
        />
      }
  />

  );
};


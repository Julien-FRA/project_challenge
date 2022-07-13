import React from "react";
import { Global as MaGlobal } from "@mantine/core";
import Nunito from '../fonts/Nunito-Regular.ttf';

export const Global = () => (
  <MaGlobal
    styles={[
      {
        '@font-face': {
          fontFamily: 'Nunito',
          src: `url('${Nunito}') format("ttf")`,
          fontWeight: 400,
          fontStyle: 'normal',
        },
      },
    ]}
  />
);

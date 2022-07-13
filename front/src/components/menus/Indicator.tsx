import React from 'react';
import styled, { css } from 'styled-components';

export const NavIndicator = () => <Indicator />

export const styleIndicator = css`
  position: absolute;
  left: 0;
  top: 0;
  width: 0.25rem;
  height: 100%;
  background-color: ${({theme}) => theme.colors.indigo[6]};
  z-index: 1;
`
const Indicator = styled.div`
  ${styleIndicator}
`
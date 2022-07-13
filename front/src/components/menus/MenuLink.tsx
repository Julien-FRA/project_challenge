import React, { useRef, useEffect } from 'react';
import { MantineSize, Text } from "@mantine/core";
import { NavLink } from "react-router-dom";
import styled from 'styled-components';
import { Icon } from 'tabler-icons-react';
import { styleIndicator } from './Indicator';

export interface MenuLinkProps{
  link: string;
  icon?: Icon
  p?: MantineSize
  className?: string;
  indicator?: boolean
  isActive?: () => void
  children: string
}

export const MenuLink =(props: MenuLinkProps) => {

  const { indicator = true } = props
  const ref = useRef<HTMLAnchorElement | null>(null)

  useEffect(() => {
    if(ref.current?.className.includes('active') && props.isActive) props.isActive()
  }, [ref, props.isActive])

  return (
    <CustomNavLink to={props.link} ref={ref} className={props.className}>
      {props.icon && <props.icon size={20} strokeWidth={1.5} color='black' />}
      <Text color="black" weight={500} size="lg">{props.children}</Text>
      {indicator && <div className="nav-link-indicator" />}
    </CustomNavLink>
  );
}

const CustomNavLink = styled(NavLink)`
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration-line: none;
  padding: ${({theme}) => theme.spacing.md}px;

  &:hover {
    background-color: ${({theme}) => theme.colors.indigo[0]};
  }

  &.active{
    background-color: ${({theme}) => theme.colors.indigo[0]};
    .mantine-Text-root{
      color: ${({theme}) => theme.colors.indigo[6]};
    }
    svg{
      stroke: ${({theme}) => theme.colors.indigo[6]};
    }
    .nav-link-indicator{
      ${styleIndicator}
    }
  }
`
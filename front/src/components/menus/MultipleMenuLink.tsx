import { Accordion, Box, Text, useMantineTheme } from "@mantine/core";
import React, { ReactElement, useMemo, useState } from "react";
import styled from "styled-components";
import { Icon } from "tabler-icons-react";
import { NavIndicator } from "./Indicator";
import { MenuLink, MenuLinkProps } from "./MenuLink";

export interface MultipleMenuLinkProps {
  label: string;
  icon: Icon
  children: ReactElement<MenuLinkProps> | ReactElement<MenuLinkProps>[];
}

export const MultipleMenuLink = (props: MultipleMenuLinkProps) => {

  const [hasALinkActive, setHasALinkActive] = useState(false)
  const theme = useMantineTheme();

  const MenusLink = useMemo(
    () =>
      React.Children.map(props.children, (e) => {
        if (!React.isValidElement(e)) return;
        return e.props;
      }),
    [props.children]
  );

  const linkIsActived = () => setHasALinkActive(true)

  return(
    <RelativeContainer>
      <CustomAccordion disableIconRotation>
        <Accordion.Item
          label={<Text weight={500} size="lg" color={hasALinkActive ? theme.colors.indigo[6] : "black"}>{props.label}</Text>}
          icon={<props.icon size={20} strokeWidth={1.5} color={hasALinkActive ? theme.colors.indigo[6] : "black"} />}
          aria-selected={hasALinkActive}>
          {MenusLink && MenusLink.map((menuLink, index) =>
            <AccordionMenuLink key={`${index}-${menuLink.link}`} link={menuLink.link} icon={menuLink.icon} isActive={linkIsActived} indicator={false}>
              {menuLink.children}
            </AccordionMenuLink>
          )}
        </Accordion.Item>
      </CustomAccordion>
      {hasALinkActive && <NavIndicator />}
    </RelativeContainer>
  )
}

const CustomAccordion = styled(Accordion)`
  .mantine-Accordion-item{
    border: none;
    &[aria-selected="true"] {
      .mantine-Accordion-control {
        background-color: ${({theme}) => theme.colors.indigo[0]}
      }
    }
  }
  .mantine-Accordion-itemTitle {
    width: 100%;
    height: 100%;
  }
  .mantine-Accordion-control {
    width: 100%;
    padding: ${({theme}) => theme.spacing.md}px;
    &:hover {
      background-color: ${({theme}) => theme.colors.indigo[0]}
    };
  }
  .mantine-Accordion-contentInner{
    padding: 0;
    padding-left: 0.5rem
  }
  .mantine-Accordion-icon{
    width: auto;
    min-width: auto;
    margin-right: 0.5rem
  }
`
const RelativeContainer = styled(Box)`
  position: relative;
`

const AccordionMenuLink = styled(MenuLink)`
  &.active{
    background-color: transparent;
    &:hover{
      background: ${({theme}) => theme.colors.indigo[0]};
    }
  }
`;
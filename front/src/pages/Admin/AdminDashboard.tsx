import React from 'react';
import {
  AppShell, Header, Navbar, Text, useMantineTheme
} from '@mantine/core';
import { Outlet } from 'react-router-dom';
import { Books, Users, BrandAmongus, AddressBook, QuestionMark } from 'tabler-icons-react';
import { MenuLink } from '@/components/menus/MenuLink';
import { MultipleMenuLink } from '@/components/menus/MultipleMenuLink';

export const AdminDashboard = () => {
  const theme = useMantineTheme();

  return (
    <AppShell
      navbarOffsetBreakpoint="sm"
      asideOffsetBreakpoint="sm"
      fixed
      navbar={
        <Navbar hiddenBreakpoint="sm" width={{ sm: 100, lg: 250 }}>
          <MultipleMenuLink label="Admin" icon={BrandAmongus}>
            <MenuLink link="management/create">
              Créer
            </MenuLink>
            <MenuLink link="management/list">
              Liste
            </MenuLink>
          </MultipleMenuLink>
          <MultipleMenuLink label="Challenge" icon={Books}>
            <MenuLink link="challenge/create">
              Créer
            </MenuLink>
            <MenuLink link="challenge/list">
              Liste
            </MenuLink>
          </MultipleMenuLink>
          <MenuLink link="./students" icon={Users} p="md">
            Étudiants
          </MenuLink>
          <MultipleMenuLink label="Promortions" icon={AddressBook}>
            <MenuLink link="promotions/create">
              Créer
            </MenuLink>
            <MenuLink link="promotions/list">
              Liste
            </MenuLink>
          </MultipleMenuLink>
          <MultipleMenuLink label="Questions" icon={QuestionMark}>
            <MenuLink link="questions/create">
              Créer
            </MenuLink>
            <MenuLink link="questions/list">
              Liste
            </MenuLink>
          </MultipleMenuLink>
        </Navbar>
      }
      header={
        <Header height={65} p="md"
          styles={{
            root: {
              display: "flex",
              alignItems: "center",
              background: theme.colors.indigo[6],
            }
          }}>
           <Text size="lg" color="white">Tableau de board "Admin"</Text>
        </Header>
      }
    >
      <Outlet />
    </AppShell>
  );
}
import React, { useEffect, useState } from 'react';
import { Container, Table, Title } from "@mantine/core";
import { useApiGetList } from "@/hook/useApi";

interface AdminList {
  adminId: number;
  pseudo: string;
  password: string;
}

// Managing the data call
export const ManagementList = () => {
  const {data: admin, getData} = useApiGetList<AdminList>('auth/admin');

  useEffect(() => { getData() }, []);

  // Showing the data
  return(
    <Container size="sm" mt="xl">
      <Title>Liste des administrateurs</Title>
      <Table striped horizontalSpacing="md" verticalSpacing="md" fontSize="md">
        <thead>
          <tr>
            <th>ID de l'admin</th>
            <th>Nom de l'admin</th>
          </tr>
        </thead>
        <tbody>
          {!!admin &&
            admin.rows.map((admin, index) =>
              <tr key={`${admin}-${index}`}>
                <td>{admin.adminId}</td>
                <td>{admin.pseudo}</td>
              </tr>
            )
          }
        </tbody>
      </Table>
    </Container>
  )
}
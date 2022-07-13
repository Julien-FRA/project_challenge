import React, { useEffect, useState } from 'react';
import { Container, Table, Title } from "@mantine/core";
import { useApiGetList } from "@/hook/useApi";

interface PromotionList {
  promoId: number;
  promoName: string;
}

// Managing the data call
export const PromotionsList = () => {
  const {data: promotions, getData} = useApiGetList<PromotionList>('auth/promo');

  useEffect(() => { getData() }, []);

  // Showing the data
  return(
    <Container size="sm" mt="xl">
      <Title>Liste des Promotions</Title>
      <Table striped horizontalSpacing="md" verticalSpacing="md" fontSize="md">
        <thead>
          <tr>
            <th>ID de la promotion</th>
            <th>Nom de la promotion</th>
          </tr>
        </thead>
        <tbody>
          {!!promotions &&
            promotions.rows.map((promotions, index) =>
              <tr key={`${promotions}-${index}`}>
                <td>{promotions.promoId}</td>
                <td>{promotions.promoName}</td>
              </tr>
            )
          }
        </tbody>
      </Table>
    </Container>
  )
}
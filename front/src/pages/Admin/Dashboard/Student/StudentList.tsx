import { useApiGet, useApiGetList, usePutApi } from "@/hook/useApi";
import { ChallengePromoDto, ChallengePromoListDto } from "@/schema/challengePromoSchema";
import { Container, Select, Switch, Table, Title } from "@mantine/core";
import React, { useEffect, useState } from "react";

interface StudentList {
  studentId: number;
  familyName: string;
  givenName: string;
  rating: number;
  promoId: number;
  challengeName: number;
}

export const StudentList = () => {
  const options = [
    { value: "studentId", text: "--Choose an option--" },
    { value: "promoName", text: "Promo" },
    { value: "rating", text: "Note" },
    { value: "challengeName", text: "Challenge" },
  ];

  const [selected, setSelected] = useState(options[0].value);

  const handleChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    await getData(`?filter=${event.target.value}`);
  };

  const { data: challenges, getData } = useApiGet<ChallengePromoListDto[]>(`challengeStudent/list`);

  useEffect(() => {
    getData();
  }, []);

  return (
    <Container size="sm" mt="xl">
      <Title>List des étudiants</Title>
      <Table striped horizontalSpacing="md" verticalSpacing="md" fontSize="md">
        <thead>
          <select value={selected} onChange={handleChange}>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.text}
              </option>
            ))}
          </select>
          <tr>
            <th>Promo</th>
            <th>Family Name</th>
            <th>Given Name</th>
            <th>Rating</th>
            <th>Challenge Name</th>
          </tr>
        </thead>
        <tbody>
          {!!challenges &&
            challenges.map((challenge, index) => (
              <tr key={`${challenge}-${index}`}>
                <td>{challenge.promoName}</td>
                <td>{challenge.familyName}</td>
                <td>{challenge.givenName}</td>
                <td>{challenge.rating}</td>
                <td>{challenge.challengeName}</td>
              </tr>
            ))}
        </tbody>
      </Table>
    </Container>
  );
};

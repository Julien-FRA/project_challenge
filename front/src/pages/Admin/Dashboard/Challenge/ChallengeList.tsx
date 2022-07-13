import React, { useEffect, useState } from "react";
import { Button, Container, Group, Modal, Switch, Table, Text, Title } from "@mantine/core";
import { useApiGet, usePutApi } from "@/hook/useApi";
import { ChallengePromoListDto } from "@/schema/challengePromoSchema";

interface ChallengeStateModal {
  isModalOpen?: boolean;
  challengePromoId?: number;
}

export const ChallengeList = () => {
  const { data: challenges, getData } = useApiGet<ChallengePromoListDto[]>("challengePromo/list");
  const [challengeModal, setChallengeModal] = useState<ChallengeStateModal>({ isModalOpen: false });
  const { putData } = usePutApi<{ isOpen: boolean }>("challengePromo");

  useEffect(() => {
    getData();
  }, []);

  const submitChallengeStatut = async (state: boolean) => {
    if (!challengeModal.challengePromoId) return;

    const challengePromoIdData = await putData(challengeModal.challengePromoId, { isOpen: !state });
    console.log("challengePromoIdData:", challengePromoIdData);

    if (challengePromoIdData?.rows) {
      await getData();
      setChallengeModal({ isModalOpen: false });
    }
  };

  return (
    <Container size="sm" mt="xl">
      <Title>List des challenges</Title>
      <Table striped horizontalSpacing="md" verticalSpacing="md" fontSize="md">
        <thead>
          <tr>
            <th>Nom du challenge</th>
            <th>Promo</th>
            <th>Statut</th>
          </tr>
        </thead>
        <tbody>
          {!!challenges &&
            challenges.map((challenge, index) => (
              <tr key={`${challenge}-${index}`}>
                <td>{challenge.challengeName}</td>
                <td>{challenge.promoName}</td>
                <td>
                  <Switch
                    onLabel="ON"
                    offLabel="OFF"
                    checked={!!challenge.isOpen}
                    onChange={(e) =>
                      setChallengeModal({ isModalOpen: true, challengePromoId: challenge.challengePromoId })
                    }
                  />
                </td>
              </tr>
            ))}
        </tbody>
      </Table>
      {challenges && challengeModal.challengePromoId && (
        <StatusModal
          open={!!challengeModal.isModalOpen}
          challengePromoId={challengeModal.challengePromoId}
          challengePromo={challenges[challengeModal.challengePromoId - 1]}
          challengeModal={() => setChallengeModal({ isModalOpen: false })}
          handleSubmitChallengeStatut={submitChallengeStatut}
        />
      )}
    </Container>
  );
};

interface StatusModalProps {
  open: boolean;
  challengePromoId: number;
  challengePromo: ChallengePromoListDto;
  challengeModal: () => void;
  handleSubmitChallengeStatut: (state: boolean) => Promise<void>;
}

const StatusModal = (props: StatusModalProps) => {
  const { open, challengePromo, challengePromoId, challengeModal, handleSubmitChallengeStatut } = props;
  const { isOpen: challengePromoStatut, challengeName, promoName } = challengePromo;

  const modalStateText = challengePromoStatut ? "arrêter" : "lancer";

  return (
    <Modal
      opened={open}
      onClose={challengeModal}
      title={
        <Text size="xl" weight={700} transform="capitalize">
          {modalStateText} !
        </Text>
      }
    >
      <Text>
        Voulez-vous vraiment {modalStateText} le challange {challengeName} de la promo {promoName}
      </Text>
      <Group position="right" mt="md">
        <Button color="red" onClick={challengeModal}>
          Non
        </Button>
        <Button color="indigo" onClick={() => challengePromoId && handleSubmitChallengeStatut(challengePromoStatut)}>
          Oui
        </Button>
      </Group>
    </Modal>
  );
};

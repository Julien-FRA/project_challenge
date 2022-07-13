export interface ILinkStudentToChallenge {
  challengeId: number;
  studentId: number;
}

export interface IStudentChallengeList extends ILinkStudentToChallenge {
  challengeStudentId: number;
  challengeId: number;
  studentId: number;
}

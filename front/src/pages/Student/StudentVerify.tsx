import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { RegisterDto } from "@/schema/registerSchema";
import { Center, Container, Loader, Title } from "@mantine/core";
import { useApiGet, useApiPost } from "@/hook/useApi";
import { UserCreateDto, UserDto, UserTokenDto } from "@/schema/userSchema";
import { getToken } from "@/utils/token";
import { PromoDto } from "@/schema/promoSchema";
import { ChallengePromoDto } from "@/schema/challengePromoSchema";

export const StudentVerify = () => {
  const challengeId = localStorage.getItem("challengeId");
  
  let navigate = useNavigate();

  const { getData: getVerifyData } = useApiGet<RegisterDto>("register/verify");

  const { postData: postUserData } = useApiPost<UserCreateDto>("user");

  const { getData: userEmailDataExist } = useApiGet<UserDto>("user/email");
  const { postData: postUserTokenData } = useApiPost<UserTokenDto>("user/token");

  const { data: challengePromoData, getData: getChallengePromoData } = useApiGet<ChallengePromoDto>("challengePromo");
  useEffect(() => {
    const watchChallengePromo = async() => getChallengePromoData(`id/${challengeId}`)
    watchChallengePromo()
  }, [])


  const createUserToken = async (_data: UserDto, token: RegisterDto) => {
    const userToken = await postUserTokenData({
      userId: _data.userId,
      email: _data.email,
      challengeId: token.challengeId,
      promoId: token.promoId,
    });

    if (!_data.userId || !userToken) return navigate("/");

    localStorage.setItem("userId", JSON.stringify(_data.userId));
    localStorage.setItem("challengeId", JSON.stringify(token.challengeId));
    localStorage.setItem("promoId", JSON.stringify(token.promoId));
    localStorage.setItem("userToken", JSON.stringify(userToken));

    return navigate("../register");
  };

  const verifyToken = async () => {
    const token = await getToken();
    if (!token) return;

    const mailData = await getVerifyData(token);
    if (mailData) return mailData;

    return false;
  };

  const redirect = async () => {
    const token = await verifyToken();
    if (!token) return navigate("../");

    // is email valide
    const emailData = await userEmailDataExist(token.email);
    //if exist create new token
    if (emailData?.userId) return createUserToken(emailData, token);

    const userData = await postUserData({ email: token.email });
    if (!userData?.id) return navigate("../");

    const user: UserDto = {
      userId: userData.id,
      email: token.email,
      role: 0,
    };
    createUserToken(user, token);
  };

  useEffect(() => {
    redirect();
  }, []);

  if(!challengePromoData) return (<Container mt={50}>
    <Title align="center">
      Le challange est finie
    </Title>
  </Container>)

  return (
    <Center>
      <Loader />
    </Center>
  );
};

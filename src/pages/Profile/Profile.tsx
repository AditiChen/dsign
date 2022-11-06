import { useState, useContext } from "react";
import styled from "styled-components";
import ReactLoading from "react-loading";
import { useTranslation } from "react-i18next";
import { AuthContext } from "../../context/authContext";

interface Prop {
  url?: string;
  size?: string;
  background?: string;
  text?: string;
  focus?: string;
  position?: string;
  buttomLine?: string;
}

const Wrapper = styled.div`
  padding: 130px 0;
  width: 100%;
  min-width: 100vw;
  height: 100%;
  min-height: calc(100vh - 80px);
  position: relative;
  display: flex;
`;

const Container = styled.div`
  margin: 0 auto;
  width: 1200px;
  height: 100%;
  position: relative;
  display: flex;
`;

const InfoContainer = styled.div`
  margin: 0 auto;
  height: 100%;
  width: 100%;
  max-width: 460px;
  position: relative;
  border: 1px solid #b4b4b4;
  border-radius: 20px;
`;

const LoginContainer = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
`;

const SignStatus = styled.button`
  margin-bottom: 30px;
  padding: 0;
  width: 50%;
  height: 60px;
  font-size: 20px;
  color: #313538;
  border: none;
  border-bottom: ${(props: Prop) => props.buttomLine || "none"};
  border-radius: ${(props: Prop) => props.position || "0px 20px 0px 0px"};
  background-color: ${(props) => props.color || "#fff"};
  & + & {
    border-left: 1px solid #b4b4b4;
  }
  @media screen and (max-width: 1279px) {
    margin-bottom: 24px;
    height: 40px;
    font-size: 16px;
  }
`;

const Avatar = styled.div`
  height: 180px;
  width: 180px;
  background-image: ${(props: Prop) => props.url};
  background-size: cover;
  background-position: center;
`;

const Context = styled.div`
  margin-top: 20px;
  font-size: 24px;
  color: #3c3c3c;
  font-size: ${(props: Prop) => props.size};
  & + & {
    margin-top: 12px;
  }
`;

const Input = styled.input`
  padding: 6px 10px;
  width: 320px;
  height: 50px;
  color: #3c3c3c;
  font-size: 18px;
  background-color: #f0f0f090;
  border: 1px solid gray;
  & + & {
    margin-top: 30px;
  }
  &:focus {
    outline: none;
    background-color: #61616130;
  }
`;

const SignContainer = styled.div`
  display: flex;
`;

const SignBtn = styled.button`
  margin-top: 30px;
  padding: 0 20px;
  height: 40px;
  color: #3c3c3c;
  font-size: 18px;
  background-color: transparent;
  border: 1px solid #3c3c3c;
  &:hover {
    box-shadow: 1px 1px 5px #616161;
  }
  &:focus {
    outline: none;
  }
`;

const LoginOptionsContainer = styled.div`
  margin: 0 auto;
  width: 85%;
  max-width: 380px;
  height: 40px;
  position: relative;
`;

const LoginOptionsText = styled.div`
  height: 40px;
  padding: 0 20px;
  background-color: #ffffff;
  color: #787878;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  @media screen and (max-width: 1279px) {
    height: 30px;
    padding: 0 10px;
    font-size: 14px;
  }
`;

const LoginOptionsLine = styled.div`
  width: 100%;
  height: 10px;
  border-bottom: 1px solid #787878;
  @media screen and (max-width: 1279px) {
    height: 8px;
  }
`;

const Loading = styled(ReactLoading)`
  margin: 50px auto;
`;

function Profile() {
  const { t } = useTranslation();
  const {
    isLogin,
    isLoading,
    name,
    email,
    avatar,
    signUp,
    emailSignInHandler,
    googleLoginHandler,
    facebookLoginHandler,
    logout,
  } = useContext(AuthContext);
  const [inputName, setInputName] = useState("");
  const [inputEmail, setInputEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [signin, setSignin] = useState(true);

  function signInHandler() {
    if (!inputEmail || !password) {
      alert(t("email_and_password_input_check"));
      return;
    }
    if (
      inputEmail.search(
        /^\w+((-\w+)|(\.\w+))*@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/
      )
    ) {
      alert(t("email_format_check"));
      return;
    }
    if (password.length < 8) {
      alert(t("password_letter_check"));
      return;
    }
    emailSignInHandler(inputEmail, password);
  }

  function signUpHandler() {
    if (!inputName) {
      alert(t("name_input_check"));
      return;
    }
    if (!inputEmail || !password) {
      alert(t("email_and_password_input_check"));
      return;
    }
    if (
      inputEmail.search(
        /^\w+((-\w+)|(\.\w+))*@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/
      )
    ) {
      alert(t("email_format_check"));
      return;
    }
    if (password.length < 8) {
      alert(t("password_letter_check"));
      return;
    }
    if (password !== confirmPassword) {
      alert(t("password_confirm_failed"));
      return;
    }
    signUp(inputEmail, password, inputName);
  }

  if (isLoading) {
    return (
      <Wrapper>
        <Loading type="spinningBubbles" color="#3c3c3c" />
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <Container>
        {isLogin ? (
          <LoginContainer>
            <Avatar url={`url(${avatar})`} />
            <Context size="24px">{name}</Context>
            <Context size="20px">{email}</Context>
            <SignBtn onClick={logout}>Logout</SignBtn>
          </LoginContainer>
        ) : (
          <InfoContainer>
            <SignStatus
              onClick={() => setSignin(true)}
              color={signin ? "" : "#f0f0f0"}
              position="20px 0px 0px 0px"
              buttomLine={signin ? "" : "1px solid #b4b4b4"}
            >
              Sign in
            </SignStatus>
            <SignStatus
              onClick={() => setSignin(false)}
              color={signin ? "#f0f0f0" : ""}
              buttomLine={signin ? "1px solid #b4b4b4" : ""}
            >
              Sign up
            </SignStatus>
            {signin ? (
              <LoginContainer>
                <Input
                  placeholder={t("input_email")}
                  onChange={(e) => setInputEmail(e.target.value)}
                />
                <Input
                  placeholder={t("input_password")}
                  type="password"
                  onChange={(e) => setPassword(e.target.value)}
                />
                <SignContainer>
                  <SignBtn onClick={() => signInHandler()}>
                    {t("login")}
                  </SignBtn>
                </SignContainer>
              </LoginContainer>
            ) : (
              <LoginContainer>
                <Input
                  placeholder={t("input_name")}
                  onChange={(e) => setInputName(e.target.value)}
                />
                <Input
                  placeholder={t("input_email")}
                  onChange={(e) => setInputEmail(e.target.value)}
                />
                <Input
                  placeholder={t("input_password")}
                  type="password"
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Input
                  placeholder={t("check_input_password")}
                  type="password"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <SignContainer>
                  <SignBtn onClick={() => signUpHandler()}>
                    {t("sign_up")}
                  </SignBtn>
                </SignContainer>
              </LoginContainer>
            )}
            <LoginOptionsContainer>
              <LoginOptionsText>or</LoginOptionsText>
              <LoginOptionsLine />
            </LoginOptionsContainer>
            <LoginContainer>
              <SignBtn
                onClick={() => {
                  googleLoginHandler();
                }}
              >
                {t("continue_with_google")}
              </SignBtn>
              <SignBtn
                onClick={() => {
                  facebookLoginHandler();
                }}
              >
                {t("continue_with_facebook")}
              </SignBtn>
            </LoginContainer>
          </InfoContainer>
        )}
      </Container>
    </Wrapper>
  );
}

export default Profile;

import { useState, useContext } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import ReactLoading from "react-loading";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../context/firebaseSDK";

import { AuthContext } from "../../context/authContext";

import googleIcon from "../../icons/google-icon.png";
import googleIconHover from "../../icons/google-icon-hover.png";
import fbIcon from "../../icons/fb-icon.png";
import fbIconHover from "../../icons/fb-icon-hover.png";

interface Prop {
  url?: string;
  size?: string;
  background?: string;
  text?: string;
  focus?: string;
  position?: string;
  buttomLine?: string;
  img?: string;
  hoverImg?: string;
  margin?: string;
  checkLoading?: boolean;
}

const Wrapper = styled.div`
  padding: 130px 0;
  width: 100%;
  min-width: 100vw;
  height: 100%;
  min-height: calc(100vh - 80px);
  position: relative;
  display: flex;
  background-color: #787878;
`;

const Container = styled.div`
  margin: 0 auto;
  width: 1200px;
  height: 100%;
  position: relative;
  display: flex;
`;

const SignInContainer = styled.div`
  margin: 0 auto;
  height: 100%;
  width: 100%;
  max-width: 460px;
  position: relative;
  border: 1px solid #b4b4b4;
  border-radius: 20px;
  background-color: #ffffff;
  box-shadow: 0 0 20px #3c3c3c;
`;

const LoginContainer = styled.div`
  padding: 20px 30px;
  display: flex;
  flex-direction: column;
`;

const SignStatus = styled.button`
  margin-bottom: 30px;
  padding: 0;
  width: 50%;
  height: 60px;
  font-size: 22px;
  color: #313538;
  border: none;
  border-bottom: ${(props: Prop) => props.buttomLine || "none"};
  border-radius: ${(props: Prop) => props.position || "0px 20px 0px 0px"};
  background-color: ${(props) => props.color || "#fff"};
  & + & {
    border-left: 1px solid #b4b4b4;
  }
  &:hover {
    cursor: pointer;
  }
  @media screen and (max-width: 1279px) {
    margin-bottom: 24px;
    height: 40px;
    font-size: 16px;
  }
`;

const Input = styled.input`
  padding: 6px 10px;
  width: 100%;
  height: 50px;
  color: #3c3c3c;
  font-size: 18px;
  background-color: #f0f0f090;
  border: 1px solid #646464;
  border-radius: 10px;
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
  margin-left: auto;
  padding: 0 20px;
  height: 40px;
  color: #3c3c3c;
  font-size: 20px;
  border: 1px solid #3c3c3c40;
  border-radius: 10px;
  background-color: #3c3c3c30;
  display: flex;
  align-items: center;
  &:hover {
    cursor: ${(props: Prop) =>
      props.checkLoading ? "not-allowed" : "pointer"};
    color: #ffffff;
    background-color: #616161;
  }
`;

const LoginOptionsContainer = styled.div`
  margin: 0 auto;
  width: 85%;
  max-width: 380px;
  height: 20px;
  position: relative;
`;

const LoginOptionsText = styled.div`
  height: 40px;
  padding: 0 20px;
  background-color: #ffffff;
  color: #3c3c3c;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  font-size: 20px;
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

const Icon = styled.div`
  margin-right: 20px;
  height: 24px;
  width: 24px;
  background-position: center;
  background-size: cover;
`;

const GoogleIcon = styled(Icon)`
  background-image: url(${googleIcon});
`;

const FbIcon = styled(Icon)`
  background-image: url(${fbIcon});
`;

const OptionalLiginBtn = styled.button`
  margin-top: 10px;
  padding: 0 20px;
  width: 100%;
  height: 40px;
  display: flex;
  align-items: center;
  color: #4285f4;
  font-size: 20px;
  background-color: transparent;
  border: 1px solid #3c3c3c40;
  border-radius: 20px;
  & + & {
    margin-top: 25px;
    margin-bottom: 20px;
  }
  &:hover {
    cursor: pointer;
    color: #ffffff;
    border: none;
    background-color: #4285f4;
  }
  &:hover ${GoogleIcon} {
    background-image: url(${googleIconHover});
  }
  &:hover ${FbIcon} {
    background-image: url(${fbIconHover});
  }
`;

const Loading = styled(ReactLoading)`
  margin: ${(props: Prop) => props.margin};
`;

function SignIn() {
  const { t } = useTranslation();
  const {
    signUp,
    emailSignInHandler,
    googleLoginHandler,
    facebookLoginHandler,
    isLoading,
  } = useContext(AuthContext);
  const [inputName, setInputName] = useState("");
  const [inputEmail, setInputEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [signin, setSignin] = useState(true);
  const [checkLoading, setCheckLoading] = useState(false);

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

  async function signUpHandler() {
    if (!inputName) {
      alert(t("check_input_name"));
      return;
    }
    setCheckLoading(true);
    const userRef = collection(db, "users");
    const qName = query(userRef, where("name", "==", inputName));
    const querySnapshotName = await getDocs(qName);
    const nameRefReturnedData = querySnapshotName.docs[0]?.data();
    if (nameRefReturnedData !== undefined) {
      alert(t("name_exist"));
      setInputName("");
      setCheckLoading(false);
      return;
    }

    if (!inputEmail || !password) {
      alert(t("email_and_password_input_check"));
      setCheckLoading(false);
      return;
    }

    if (
      inputEmail.search(
        /^\w+((-\w+)|(\.\w+))*@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/
      )
    ) {
      alert(t("email_format_check"));
      setCheckLoading(false);
      return;
    }

    const qEmail = query(userRef, where("email", "==", inputEmail));
    const querySnapshotEmail = await getDocs(qEmail);
    const emailRefReturnedData = querySnapshotEmail.docs[0]?.data();
    if (emailRefReturnedData !== undefined) {
      alert(t("email_exist"));
      setInputEmail("");
      setCheckLoading(false);
      return;
    }

    if (password.length < 8) {
      alert(t("password_length_check"));
      setCheckLoading(false);
      return;
    }
    if (password.search(/^(?=.*\d)(?=.*[a-zA-Z]).{8,20}$/)) {
      alert(t("password_letter_check"));
      setCheckLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      alert(t("password_confirm_failed"));
      setCheckLoading(false);
      return;
    }
    setCheckLoading(false);
    signUp(inputEmail, password, inputName);
  }

  if (isLoading) {
    return (
      <Wrapper>
        <Loading type="cylon" color="#3c3c3c" margin="50px auto" />
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <Container>
        <SignInContainer>
          <SignStatus
            onClick={() => setSignin(true)}
            color={signin ? "" : "#3c3c3c30"}
            position="20px 0px 0px 0px"
            buttomLine={signin ? "" : "1px solid #b4b4b4"}
          >
            {t("login")}
          </SignStatus>
          <SignStatus
            onClick={() => setSignin(false)}
            color={signin ? "#3c3c3c30" : ""}
            buttomLine={signin ? "1px solid #b4b4b4" : ""}
          >
            {t("sign_up")}
          </SignStatus>
          {signin ? (
            <LoginContainer>
              <Input
                placeholder={t("input_email")}
                key="email"
                onChange={(e) => setInputEmail(e.target.value)}
              />
              <Input
                placeholder={t("input_password")}
                key="password"
                type="password"
                onChange={(e) => setPassword(e.target.value)}
              />
              <SignContainer>
                <SignBtn
                  checkLoading={checkLoading}
                  onClick={() => signInHandler()}
                >
                  {t("login")}
                </SignBtn>
              </SignContainer>
            </LoginContainer>
          ) : (
            <LoginContainer>
              <Input
                placeholder={t("input_name")}
                key="name"
                onChange={(e) => setInputName(e.target.value)}
              />
              <Input
                placeholder={t("input_email")}
                key="email"
                onChange={(e) => setInputEmail(e.target.value)}
              />
              <Input
                placeholder={t("input_password")}
                key="password"
                type="password"
                onChange={(e) => setPassword(e.target.value)}
              />
              <Input
                placeholder={t("check_input_password")}
                type="password"
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <SignContainer>
                <SignBtn
                  checkLoading={checkLoading}
                  onClick={() => signUpHandler()}
                >
                  {t("sign_up")}
                  {checkLoading && (
                    <Loading
                      type="spokes"
                      height="20px"
                      width="20px"
                      margin="0 0 0 15px"
                    />
                  )}
                </SignBtn>
              </SignContainer>
            </LoginContainer>
          )}
          <LoginOptionsContainer>
            <LoginOptionsText>or</LoginOptionsText>
            <LoginOptionsLine />
          </LoginOptionsContainer>
          <LoginContainer>
            <OptionalLiginBtn
              onClick={() => {
                googleLoginHandler();
              }}
            >
              <GoogleIcon />
              {t("continue_with_google")}
            </OptionalLiginBtn>
            <OptionalLiginBtn
              onClick={() => {
                facebookLoginHandler();
              }}
            >
              <FbIcon />
              {t("continue_with_facebook")}
            </OptionalLiginBtn>
          </LoginContainer>
        </SignInContainer>
      </Container>
    </Wrapper>
  );
}

export default SignIn;

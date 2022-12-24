import { useState, useContext } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import ReactLoading from "react-loading";
import { collection, query, where, getDocs } from "firebase/firestore";
import Swal from "sweetalert2";

import { db } from "../../context/firebaseSDK";
import { AuthContext } from "../../context/authContext";
import {
  googleIcon,
  googleIconHover,
  fbIcon,
  fbIconHover,
} from "../../components/icons/icons";

const Wrapper = styled.div`
  padding: 10vh 0;
  width: 100%;
  min-width: 100vw;
  height: 100%;
  min-height: calc(100vh - 110px);
  position: relative;
  display: flex;
  background-color: #787878;
  @media screen and (min-width: 800px) and (max-width: 1024px) {
    min-height: calc(100vh - 100px);
  }
  @media screen and (max-width: 799px) {
    padding: 5vh 0;
    min-height: calc(100vh - 90px);
  }
`;

const Container = styled.div`
  margin: 0 auto;
  width: 1200px;
  height: 100%;
  position: relative;
  display: flex;
  @media screen and (max-width: 549px) {
    width: 90vw;
    max-width: 350px;
  }
`;

const SignInContainer = styled.div`
  margin: 0 auto;
  height: 100%;
  width: 460px;
  position: relative;
  border: 1px solid #b4b4b4;
  border-radius: 20px;
  background-color: #ffffff;
  box-shadow: 0 0 20px #3c3c3c;
  @media screen and (max-width: 1449px) {
    width: 400px;
  }
`;

const LoginContainer = styled.div`
  padding: 20px 30px;
  display: flex;
  flex-direction: column;
  @media screen and (max-width: 549px) {
    padding: 10px 15px;
  }
`;

const SignStatus = styled.button<{
  buttonLine?: string;
  position?: string;
  $color?: string;
}>`
  margin-bottom: 15px;
  padding: 0;
  width: 50%;
  height: 60px;
  font-size: 22px;
  border: none;
  color: #3c3c3c;
  border-bottom: ${(props) => props.buttonLine || "none"};
  border-radius: ${(props) => props.position || "0px 20px 0px 0px"};
  background-color: ${(props) => props.$color || "#fff"};
  & + & {
    border-left: 1px solid #b4b4b4;
  }
  &:hover {
    cursor: pointer;
  }
  @media screen and (max-width: 1449px) {
    height: 50px;
    font-size: 20px;
  }
  @media screen and (max-width: 549px) {
    height: 40px;
    font-size: 16px;
  }
`;

const Input = styled.input`
  padding: 7px 10px 5px;
  width: 100%;
  height: 50px;
  font-size: 18px;
  color: #3c3c3c;
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
  @media screen and (max-width: 1449px) {
    height: 40px;
    font-size: 16px;
    border-radius: 8px;
    & + & {
      margin-top: 25px;
    }
  }
  @media screen and (max-width: 549px) {
    font-size: 14px;
    & + & {
      margin-top: 15px;
    }
  }
`;

const SignContainer = styled.div`
  display: flex;
`;

const SignBtn = styled.button<{ checkLoading?: boolean }>`
  margin-top: 30px;
  margin-left: auto;
  padding: 0 20px;
  height: 40px;
  font-size: 18px;
  color: #3c3c3c;
  border: 1px solid #3c3c3c40;
  border-radius: 10px;
  background-color: #3c3c3c30;
  display: flex;
  align-items: center;
  &:hover {
    cursor: ${(props) => (props.checkLoading ? "not-allowed" : "pointer")};
    color: #ffffff;
    background-color: #616161;
  }
  @media screen and (max-width: 1449px) {
    margin-top: 25px;
    height: 36px;
    font-size: 16px;
    border-radius: 8px;
  }
  @media screen and (max-width: 549px) {
    margin-top: 15px;
    height: 30px;
    font-size: 14px;
    border-radius: 6px;
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
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  font-size: 20px;
  @media screen and (max-width: 1449px) {
    font-size: 18px;
  }
  @media screen and (max-width: 549px) {
    height: 30px;
    padding: 0 10px;
    font-size: 14px;
  }
`;

const LoginOptionsLine = styled.div`
  width: 100%;
  height: 10px;
  border-bottom: 1px solid #787878;
  @media screen and (max-width: 549px) {
    height: 8px;
  }
`;

const Icon = styled.div`
  margin-right: 20px;
  height: 24px;
  width: 24px;
  background-position: center;
  background-size: cover;
  @media screen and (max-width: 549px) {
    margin-right: 10px;
    height: 18px;
    width: 18px;
  }
`;

const GoogleIcon = styled(Icon)`
  background-image: url(${googleIcon});
`;

const FbIcon = styled(Icon)`
  background-image: url(${fbIcon});
`;

const OptionalLoginBtn = styled.button`
  margin-top: 10px;
  padding: 0 20px;
  width: 100%;
  height: 40px;
  display: flex;
  align-items: center;
  color: #4285f4;
  font-size: 18px;
  line-height: 20px;
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
  @media screen and (max-width: 1449px) {
    height: 36px;
    font-size: 16px;
    & + & {
      margin-top: 20px;
    }
  }
  @media screen and (max-width: 549px) {
    margin-top: 10px;
    padding: 0 10px;
    height: 30px;
    font-size: 14px;
  }
`;

const Loading = styled(ReactLoading)<{ margin?: string }>`
  margin: ${(props) => props.margin};
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
  const [inputEmail, setInputEmail] = useState("shu@gmail.com");
  const [password, setPassword] = useState("test12345");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [signIn, setSignIn] = useState(true);
  const [checkLoading, setCheckLoading] = useState(false);

  function signInHandler() {
    if (!inputEmail || !password) {
      Swal.fire({
        text: t("email_and_password_input_check"),
        icon: "warning",
        confirmButtonColor: "#646464",
      });
      return;
    }
    emailSignInHandler(inputEmail, password);
  }

  async function signUpHandler() {
    if (checkLoading) return;
    if (!inputName) {
      Swal.fire({
        text: t("check_input_name"),
        icon: "warning",
        confirmButtonColor: "#646464",
      });
      return;
    }
    setCheckLoading(true);
    const userRef = collection(db, "users");
    const lowerCaseInputName = inputName.replace(/\s/g, "").toLowerCase();
    const qName = query(userRef, where("searchName", "==", lowerCaseInputName));
    const querySnapshotName = await getDocs(qName);
    const nameRefReturnedData = querySnapshotName.docs[0]?.data();
    if (nameRefReturnedData !== undefined) {
      Swal.fire({
        text: t("name_exist"),
        icon: "warning",
        confirmButtonColor: "#646464",
      });
      setInputName("");
      setCheckLoading(false);
      return;
    }
    if (!inputEmail || !password) {
      Swal.fire({
        text: t("email_and_password_input_check"),
        icon: "warning",
        confirmButtonColor: "#646464",
      });
      setCheckLoading(false);
      return;
    }

    if (
      inputEmail.search(
        /^\w+((-\w+)|(\.\w+))*@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/
      )
    ) {
      Swal.fire({
        text: t("email_format_check"),
        icon: "warning",
        confirmButtonColor: "#646464",
      });
      setCheckLoading(false);
      return;
    }

    const qEmail = query(userRef, where("email", "==", inputEmail));
    const querySnapshotEmail = await getDocs(qEmail);
    const emailRefReturnedData = querySnapshotEmail.docs[0]?.data();
    if (emailRefReturnedData !== undefined) {
      Swal.fire({
        text: t("email_exist"),
        icon: "warning",
        confirmButtonColor: "#646464",
      });
      setInputEmail("");
      setCheckLoading(false);
      return;
    }

    if (password.length < 8) {
      Swal.fire({
        text: t("password_length_check"),
        icon: "warning",
        confirmButtonColor: "#646464",
      });
      setCheckLoading(false);
      return;
    }
    if (password.search(/^(?=.*\d)(?=.*[a-zA-Z]).{8,20}$/)) {
      Swal.fire({
        text: t("password_letter_check"),
        icon: "warning",
        confirmButtonColor: "#646464",
      });
      setCheckLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      Swal.fire({
        text: t("password_confirm_failed"),
        icon: "warning",
        confirmButtonColor: "#646464",
      });
      setCheckLoading(false);
      return;
    }
    setCheckLoading(false);
    signUp(inputEmail, password, inputName);
  }

  if (isLoading) {
    return (
      <Wrapper>
        <Loading type="cylon" color="#ffffff" margin="50px auto" />
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <Container>
        <SignInContainer>
          <SignStatus
            onClick={() => setSignIn(true)}
            $color={signIn ? "" : "#3c3c3c30"}
            position="20px 0px 0px 0px"
            buttonLine={signIn ? "" : "1px solid #b4b4b4"}
          >
            {t("login")}
          </SignStatus>
          <SignStatus
            onClick={() => setSignIn(false)}
            $color={signIn ? "#3c3c3c30" : ""}
            buttonLine={signIn ? "1px solid #b4b4b4" : ""}
          >
            {t("sign_up")}
          </SignStatus>
          {signIn ? (
            <LoginContainer>
              <Input
                placeholder={t("input_email")}
                key="email"
                autoFocus
                value={inputEmail}
                onChange={(e) => setInputEmail(e.target.value)}
              />
              <Input
                placeholder={t("input_password")}
                key="password1"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => {
                  if (
                    inputEmail !== "" &&
                    password !== "" &&
                    e.key === "Enter"
                  ) {
                    signInHandler();
                  }
                }}
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
                autoFocus
                maxLength={20}
                onChange={(e) => setInputName(e.target.value)}
              />
              <Input
                placeholder={t("input_email")}
                key="email"
                maxLength={30}
                onChange={(e) => setInputEmail(e.target.value)}
              />
              <Input
                placeholder={t("input_password")}
                key="password"
                type="password"
                maxLength={20}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Input
                placeholder={t("check_input_password")}
                type="password"
                maxLength={20}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onKeyPress={(e) => {
                  if (
                    inputName !== "" &&
                    inputEmail !== "" &&
                    password !== "" &&
                    confirmPassword !== "" &&
                    e.key === "Enter"
                  ) {
                    signInHandler();
                  }
                }}
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
            <OptionalLoginBtn
              onClick={() => {
                googleLoginHandler();
              }}
            >
              <GoogleIcon />
              {t("continue_with_google")}
            </OptionalLoginBtn>
            <OptionalLoginBtn
              onClick={() => {
                facebookLoginHandler();
              }}
            >
              <FbIcon />
              {t("continue_with_facebook")}
            </OptionalLoginBtn>
          </LoginContainer>
        </SignInContainer>
      </Container>
    </Wrapper>
  );
}

export default SignIn;

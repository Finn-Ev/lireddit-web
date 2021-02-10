import { Box, Button, Link } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { NextPage } from "next";
import { withUrqlClient } from "next-urql";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import InputField from "../../components/InputField";
import { Wrapper } from "../../components/Wrapper";
import { useChangePasswordMutation } from "../../generated/graphql";
import { createUrqlClient } from "../../utils/createUrqlClient";
import { toErrorMap } from "../../utils/toErrorMap";

const ChangePassword: NextPage<{ token: string }> = ({ token }) => {
  const [, changePassword] = useChangePasswordMutation();
  const router = useRouter();
  const [tokenError, setTokenError] = useState("");
  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ newPassword: "", repeatPassword: "" }}
        onSubmit={async (values, { setErrors }) => {
          if (values.newPassword != values.repeatPassword) {
            return setErrors(
              toErrorMap([
                { field: "repeatPassword", message: "Passwords don't match" },
              ])
            );
          }
          const res = await changePassword({
            token,
            newPassword: values.newPassword,
          });
          console.log(res);
          if (res.data?.changePassword.errors) {
            const errorMap = toErrorMap(res.data.changePassword.errors);

            if ("token" in errorMap) {
              setTokenError(errorMap.token);
            }

            setErrors(errorMap);
          } else if (res.data?.changePassword.user) {
            router.push("/");
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              name="newPassword"
              placeholder="New password"
              label="New Password"
              type="password"
            />

            <Box pt={2}>
              <InputField
                name="repeatPassword"
                placeholder="Repeat password"
                label="Repeat Password"
                type="password"
              />
            </Box>

            {tokenError && (
              <Box pt={2}>
                <p style={{ color: "red" }}>{tokenError}</p>
                <NextLink href="/forgot-password">
                  <Link>Get a new token</Link>
                </NextLink>
              </Box>
            )}
            <Button
              mt={4}
              type="submit"
              isLoading={isSubmitting}
              colorScheme="teal"
            >
              Change Password
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

ChangePassword.getInitialProps = ({ query }) => {
  return {
    token: query.token as string,
  };
};

export default withUrqlClient(createUrqlClient)(ChangePassword as any);

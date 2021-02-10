import { Box, Button } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import React from "react";
import InputField from "../components/InputField";
import { Wrapper } from "../components/Wrapper";
import { useRegisterMutation } from "../generated/graphql";
import { toErrorMap } from "../utils/toErrorMap";
import { useRouter } from "next/router";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";

interface registerProps {}

const Register: React.FC<registerProps> = ({}) => {
  const router = useRouter();
  const [, register] = useRegisterMutation();
  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{
          username: "",
          email: "",
          password: "",
          repeatPassword: "",
        }}
        onSubmit={async (values, { setErrors }) => {
          if (values.password != values.repeatPassword) {
            setErrors(
              toErrorMap([
                { field: "repeatPassword", message: "Passwords don't match" },
              ])
            );
          }
          const res = await register({
            options: {
              email: values.email,
              password: values.password,
              username: values.username,
            },
          });
          console.log(res);
          if (res.data?.register.errors) {
            setErrors(toErrorMap(res.data.register.errors));
          } else if (res.data?.register.user) {
            router.push("/");
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              name="email"
              placeholder="Email"
              label="Email"
              type="email"
            />
            <Box mt={4}>
              <InputField
                name="username"
                placeholder="Username"
                label="Username"
              />
            </Box>
            <Box mt={4}>
              <InputField
                name="password"
                placeholder="Password"
                label="Password"
                type="password"
              />
              <Box mt={2}>
                <InputField
                  name="repeatPassword"
                  placeholder="Repeat password"
                  label="Repeat Password"
                  type="password"
                />
              </Box>
            </Box>
            <Button
              mt={4}
              type="submit"
              isLoading={isSubmitting}
              colorScheme="teal"
            >
              Register
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default withUrqlClient(createUrqlClient)(Register);

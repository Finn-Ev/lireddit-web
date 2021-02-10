import { Box, Button, Link } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import { withUrqlClient } from "next-urql";
import router from "next/dist/next-server/lib/router/router";
import React, { useState } from "react";
import InputField from "../components/InputField";
import { Wrapper } from "../components/Wrapper";
import { useForgotPasswordMutation } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";

const ForgotPassword: React.FC<{}> = ({}) => {
  const [complete, setComplete] = useState(false);
  const [, forgotPassword] = useForgotPasswordMutation();
  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ email: "" }}
        onSubmit={async ({ email }, { setErrors }) => {
          await forgotPassword({ email });
          setComplete(true);
        }}
      >
        {({ isSubmitting }) =>
          complete ? (
            <Box>
              A email will be send if an account related with the entered adress
              exists
            </Box>
          ) : (
            <>
              <Box mb={3}>
                Fill in your Email to receive a message with instructions how to
                reset your password
              </Box>
              <Form>
                <InputField
                  name="email"
                  placeholder="email"
                  label="Email"
                  type="email"
                />
                <Button
                  mt={2}
                  type="submit"
                  isLoading={isSubmitting}
                  colorScheme="teal"
                >
                  Submit
                </Button>
              </Form>
            </>
          )
        }
      </Formik>
    </Wrapper>
  );
};
export default withUrqlClient(createUrqlClient)(ForgotPassword);

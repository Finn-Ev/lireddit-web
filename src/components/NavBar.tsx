import { Box, Button, Flex, Link } from "@chakra-ui/react";
import React from "react";
import RouterLink from "next/link";
import { useLogoutMutation, useMeQuery } from "../generated/graphql";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { isServer } from "../utils/isServer";

interface NavBarProps {}
const NavBar: React.FC<NavBarProps> = ({}) => {
  const [{ data }] = useMeQuery({
    pause: isServer(),
  });
  const [{ fetching: logoutFetching }, logout] = useLogoutMutation();

  let body = null;

  if (!data?.me) {
    // user not logged in
    body = (
      <>
        <Box ml={"auto"}>
          <RouterLink href="/login">
            <Button mr={5}>
              <Link href="">Login</Link>
            </Button>
          </RouterLink>
          <RouterLink href="/register">
            <Button>
              <Link>Register</Link>
            </Button>
          </RouterLink>
        </Box>
      </>
    );
  } else {
    body = (
      <>
        <Box ml={"auto"}>
          <Box d={"inline-block"} mr={4}>
            Hello {data.me.username}
          </Box>
          <Button isLoading={logoutFetching} onClick={() => logout()}>
            Logout
          </Button>
        </Box>
      </>
    );
  }
  return (
    <Box bg="tomato" p={2}>
      <Flex
        maxW={1200}
        justifyContent={"space-between"}
        m={"auto"}
        alignItems={"center"}
      >
        <RouterLink href="/">Li-Reddit</RouterLink>
        {body}
      </Flex>
    </Box>
  );
};

export default withUrqlClient(createUrqlClient)(NavBar);

import { ChakraProvider } from "@chakra-ui/react";
import NavBar from "../components/NavBar";
import theme from "../theme";

function App({ Component, pageProps }: any) {
  return (
    <ChakraProvider resetCSS theme={theme}>
      <NavBar />
      <Component {...pageProps} />
    </ChakraProvider>
  );
}

export default App;

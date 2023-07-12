import { styled } from "@mui/material";
import { Html, Head, Main, NextScript } from "next/document";

const Body = styled("body")({
  overflowY: "scroll",
});

export default function Document() {
  return (
    <Html lang="ja">
      <Head />
      <Body>
        <Main />
        <NextScript />
      </Body>
    </Html>
  );
}

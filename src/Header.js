import React from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Box } from "@chakra-ui/react";
function Header() {
  return (
    <Box className="bg-white flex items-center justify-between px-5 py-2 rounded-lg">
      <Box className="text-xl font-extrabold">
      📡 3toN
      </Box>
      <Box>
        <ConnectButton />
      </Box>
    </Box>
  );
}

export default Header;

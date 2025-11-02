import { Flex } from "@mantine/core";
import MatchesGrid from "./MatchesGrid";

const MainWrapper = () => {
  return (
    <Flex w={"100%"} h={"100%"} p={10}>
      <MatchesGrid />
    </Flex>
  );
};

export default MainWrapper;

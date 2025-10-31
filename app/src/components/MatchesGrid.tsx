import { Flex } from "@mantine/core";
import type { ColDef } from "ag-grid-community";
import matchService from "../services/match";
import Grid from "./Grid";

const MatchesGrid = () => {
  const columnDefs: ColDef[] = [
    { headerName: "ID", field: "id" },
    { headerName: "Sport", field: "sport" },
    { headerName: "Home Team", field: "homeTeam" },
    { headerName: "Away Team", field: "awayTeam" },
    { headerName: "Home Score", field: "homeScore" },
    { headerName: "Away Score", field: "awayScore" },
    { headerName: "Status", field: "status" },
    { headerName: "Match Time", field: "matchTime" },
    { headerName: "League", field: "league" },
    { headerName: "Venue", field: "venue" },
    { headerName: "Source", field: "source" },
    { headerName: "Last Updated", field: "lastUpdated" },
  ];

  return (
    <Flex w="100%" h="100%">
      <Grid repository={matchService} columnDefs={columnDefs}></Grid>
    </Flex>
  );
};

export default MatchesGrid;

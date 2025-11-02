import { Flex } from "@mantine/core";
import type { ColDef } from "ag-grid-community";
import matchService from "../services/match";
import Grid from "./Grid";
import dayjs from "dayjs";
import { FULL_DATE_TIME_FORMAT } from "../constants/date";

const MatchesGrid = () => {
  const columnDefs: ColDef[] = [
    { headerName: "Sport", field: "sport" },
    { headerName: "Home Team", field: "homeTeam" },
    { headerName: "Away Team", field: "awayTeam" },
    { headerName: "Home Score", field: "homeScore" },
    { headerName: "Away Score", field: "awayScore" },
    { headerName: "Status", field: "status" },
    {
      headerName: "Match Time",
      field: "matchTime",
      valueFormatter: (params) =>
        params.value
          ? dayjs(new Date(params.value).toLocaleString()).format(
              FULL_DATE_TIME_FORMAT
            )
          : "",
    },
    { headerName: "League", field: "league" },
    { headerName: "Venue", field: "venue" },
    {
      headerName: "Last Updated",
      field: "lastUpdated",
      valueFormatter: (params) =>
        params.value
          ? dayjs(new Date(params.value).toLocaleString()).format(
              FULL_DATE_TIME_FORMAT
            )
          : "",
    },
  ];

  return (
    <Flex w="100%" h="100%">
      <Grid
        repository={matchService}
        columnDefs={columnDefs}
        filterBy="league"
        searchBy={{ title: "team", searchFields: ["homeTeam", "awayTeam"] }}
      ></Grid>
    </Flex>
  );
};

export default MatchesGrid;

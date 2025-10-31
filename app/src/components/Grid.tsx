import { Box, Flex } from "@mantine/core";
import { AgGridReact } from "ag-grid-react";
import type { Match } from "../models/match";
import type {
  ColDef,
  GridApi,
  GridOptions,
  GridReadyEvent,
  IGetRowsParams,
} from "ag-grid-community";
import type { IRestRepository } from "../models/restRepository";
import { useMemo, useRef } from "react";

interface IProps<TBase extends Match> {
  columnDefs: ColDef[];
  repository: IRestRepository<TBase>;
}

const Grid = <TBase extends Match>({
  columnDefs,
  repository,
}: IProps<TBase>) => {
  const gridApiRef = useRef<GridApi<TBase> | null>(null);

  const gridOptions = useMemo<GridOptions<TBase>>(() => {
    const newDataSource = {
      getRows: async (params: IGetRowsParams) => {
        try {
          const result = await repository.getAll();
          params.successCallback(result.matches, result.matches.length);
        } catch (error) {
          params.failCallback();
          console.error("Error fetching rows:", error);
        }
      },
    };

    const onGridReady = (params: GridReadyEvent) => {
      if (params.api) {
        gridApiRef.current = params.api;
      }
      params.api.setGridOption("datasource", newDataSource);
    };

    return {
      columnDefs: [...columnDefs],
      rowModelType: "infinite",
      cacheBlockSize: 100,
      paginationPageSize: 100,
      onGridReady,
      getRowId: (param) => param.data.id,
    };
  }, [columnDefs, repository]);

  return (
    <Flex w={"100%"} h={"100%"}>
      <Box
        className={"ag-theme-quartz"}
        style={{ flex: 1, height: "100%" }}
        mt={5}
      >
        <AgGridReact gridOptions={gridOptions} theme="legacy" />
      </Box>
    </Flex>
  );
};

export default Grid;

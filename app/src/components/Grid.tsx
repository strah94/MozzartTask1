import { Box, Flex, type ComboboxData } from "@mantine/core";
import { AgGridReact } from "ag-grid-react";
import type { Match } from "../models/match";
import type {
  ColDef,
  GridApi,
  GridOptions,
  GridReadyEvent,
  IGetRowsParams,
} from "ag-grid-community";
import type { IRestRepository, IResult } from "../models/restRepository";
import { useEffect, useMemo, useRef, useState } from "react";
import Filter from "./Filter";
import Search from "./Search";

interface ISearch {
  title: string;
  searchFields: string[];
}

interface IProps<TBase extends Match> {
  columnDefs: ColDef[];
  repository: IRestRepository<TBase>;
  filterBy?: string;
  searchBy?: ISearch;
}

const Grid = <TBase extends Match>({
  columnDefs,
  repository,
  filterBy,
  searchBy,
}: IProps<TBase>) => {
  const gridApiRef = useRef<GridApi<TBase> | null>(null);
  const prevIdsRef = useRef<Set<string>>(new Set());
  const prevAllIdsRef = useRef<Set<string>>(new Set());
  const flashAddRef = useRef<Set<string>>(new Set());
  const flashRemoveRef = useRef<Set<string>>(new Set());
  const [filterData, setFilterData] = useState<ComboboxData>([]);
  const selectedFilterValueRef = useRef<string | null>(null);
  const searchTextRef = useRef<string | null>(null);

  useEffect(() => {
    const t = setInterval(
      () => gridApiRef.current?.refreshInfiniteCache(),
      7000
    );
    return () => clearInterval(t);
  }, []);

  function collectRenderedIds(api: any): Set<string> {
    const set = new Set<string>();
    const nodes = api.getRenderedNodes?.() ?? [];
    nodes.forEach((n: any) => {
      const id = n.id ?? n.data?.id;
      if (id != null) set.add(String(id));
    });
    return set;
  }

  const onModelUpdated = (e: any) => {
    const curr = collectRenderedIds(e.api);
    const prev = prevIdsRef.current;

    const added: string[] = [];
    curr.forEach((id) => !prev.has(id) && added.push(id));

    if (added.length) {
      flashAddRef.current = new Set(added);
      redrawRows(added);
      setTimeout(() => {
        flashAddRef.current = new Set();
        redrawRows(added);
      }, 1000);
    }

    prevIdsRef.current = curr;
  };

  function redrawRows(ids: string[]) {
    const rows = getRenderedNodesByIds(gridApiRef.current, ids);
    gridApiRef.current?.redrawRows({ rowNodes: rows });
  }

  function getRenderedNodesByIds(api: any, ids: string[]): any[] {
    return (api.getRenderedNodes() ?? []).filter((n: any) =>
      ids.includes(String(n.id ?? n.data?.id))
    );
  }

  const handleFilterData = (result: IResult<TBase>) => {
    const uniqueValues = [
      ...new Set(result.matches.map((match) => match[filterBy as keyof Match])),
    ].sort();

    setFilterData(
      uniqueValues.map((val) => ({ value: String(val), label: String(val) }))
    );
  };

  const handleFilterValueChange = (value: string | null) => {
    selectedFilterValueRef.current = value;
    gridApiRef.current?.refreshInfiniteCache();
  };

  const handleSearchTextChange = (value: string) => {
    searchTextRef.current = value;
  };

  const handleSearch = () => {
    gridApiRef.current?.refreshInfiniteCache();
  };

  const getFilteredResults = (result: IResult<TBase>): IResult<TBase> => {
    return {
      ...result,
      matches: result.matches.filter(
        (match) =>
          match.league.toUpperCase() ===
          selectedFilterValueRef.current?.toUpperCase()
      ),
    };
  };

  const getSearchResults = (result: IResult<TBase>): IResult<TBase> => {
    return {
      ...result,
      matches: searchTextRef.current
        ? result.matches.filter(
            (match) =>
              match.homeTeam.toUpperCase() ===
                searchTextRef.current?.toUpperCase() ||
              match.awayTeam.toUpperCase() ===
                searchTextRef.current?.toUpperCase()
          )
        : result.matches,
    };
  };

  const gridOptions = useMemo<GridOptions<TBase>>(() => {
    const newDataSource = {
      getRows: async (params: IGetRowsParams) => {
        try {
          const result = await repository.getAll();
          const newIds = new Set(result.matches.map((m) => String(m.id)));
          const prevAllIds = prevAllIdsRef.current;

          filterBy && result.matches.length && handleFilterData(result);

          const beingRemoved = Array.from(prevAllIds).filter(
            (id) => !newIds.has(id)
          );

          const gridResults = getSearchResults(
            !!selectedFilterValueRef.current
              ? getFilteredResults(result)
              : result
          );

          if (beingRemoved.length && gridApiRef.current) {
            const nodesToRemove = getRenderedNodesByIds(
              gridApiRef.current,
              beingRemoved
            );

            flashRemoveRef.current = new Set(beingRemoved);

            if (nodesToRemove.length > 0) {
              gridApiRef.current.redrawRows({ rowNodes: nodesToRemove });
            }

            setTimeout(() => {
              params.successCallback(
                gridResults.matches,
                gridResults.matches.length
              );
              prevAllIdsRef.current = newIds;
              setTimeout(() => {
                flashRemoveRef.current.clear();
              }, 100);
            }, 2000);
          } else {
            params.successCallback(
              gridResults.matches,
              gridResults.matches.length
            );
            prevAllIdsRef.current = newIds;
          }
        } catch (error) {
          params.failCallback();
          console.error("Error fetching rows:", error);
        }
      },
    };

    const onGridReady = (params: GridReadyEvent) => {
      if (params.api) {
        gridApiRef.current = params.api;
        prevIdsRef.current = collectRenderedIds(params.api);
      }
      params.api.setGridOption("datasource", newDataSource);

      repository.getAll().then((result) => {
        prevAllIdsRef.current = new Set(
          result.matches.map((m) => String(m.id))
        );
      });
    };

    return {
      columnDefs: [...columnDefs],
      animateRows: true,
      rowModelType: "infinite",
      cacheBlockSize: 100,
      paginationPageSize: 100,
      rowClassRules: {
        "flash-added": (p) => flashAddRef.current.has(String(p.data?.id)),
        "flash-removed": (p) => flashRemoveRef.current.has(String(p.data?.id)),
      },
      overlayNoRowsTemplate: "nothing",
      onGridReady,
      onModelUpdated,
      getRowId: (p) => String(p.data.id),
    };
  }, [columnDefs, repository]);

  return (
    <Flex w={"100%"} h={"100%"} direction={"column"}>
      <Flex mb={10} gap={10}>
        {filterBy && (
          <Filter
            title={filterBy}
            data={filterData}
            onChange={handleFilterValueChange}
          />
        )}
        {searchBy && (
          <Search
            title={searchBy.title}
            onChange={handleSearchTextChange}
            onSeearch={handleSearch}
          />
        )}
      </Flex>
      <Box className={"ag-theme-quartz"} mt={5} flex={1} h={"100%"}>
        <AgGridReact gridOptions={gridOptions} theme={"legacy"} />
      </Box>
    </Flex>
  );
};

export default Grid;

import type { Match } from "../models/match";
import type { IRestRepository, IResult } from "../models/restRepository";
import { API_GATEWAY_BASE_URL } from "./config";
import { fetchWithRetry } from "./helpers";

const matchService: IRestRepository<Match> = {
  getAll: async (): Promise<IResult<Match>> => {
    return fetchWithRetry(
      async () => {
        const res = await fetch(`${API_GATEWAY_BASE_URL}/api/matches`, {
          headers: {
            "Content-Type": "application/json",
            username: "strahinjavelickovic94@gmail.com",
          },
        });

        if (!res.ok) {
          throw new Error(`Get All Error - status: ${res.status}`);
        }

        return res.json();
      },
      3,
      1500
    );
  },
};

export default matchService;

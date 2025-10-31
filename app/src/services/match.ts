import type { Match } from "../models/match";
import type { IRestRepository, IResult } from "../models/restRepository";
import { API_GATEWAY_BASE_URL } from "./config";

const matchService: IRestRepository<Match> = {
  getAll: async (): Promise<IResult<Match>> => {
    const res = await fetch(`${API_GATEWAY_BASE_URL}/api/matches`, {
      headers: {
        "Content-Type": "application/json",
        username: "strahinjavelickovic94@gmail.com",
      },
    });

    return res.json();
  },
};

export default matchService;

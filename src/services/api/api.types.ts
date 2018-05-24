import { GeneralApiProblem } from "./api-problem"

export interface Repo {
  id: number
  name: string
  owner: string
}

export interface Credentials {
  tenancyName: string
  usernameOrEmailAddress: string
  password: string
}

export interface GetTransactionsInput {
  type: string
  accountId: string
  startDate: string
  endDate: string
}

export type GetRepoResult = { kind: "ok"; repo: Repo } | GeneralApiProblem

export type AuthenticateResult =
  | {
      kind: "ok"
      token: string,
    }
  | GeneralApiProblem

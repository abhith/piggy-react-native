import { ApisauceInstance, create, ApiResponse } from "apisauce"
import { getGeneralApiProblem } from "./api-problem"
import { ApiConfig, DEFAULT_API_CONFIG } from "./api-config"
import * as Types from "./api.types"
import { loadString } from "../../lib/storage"

/**
 * Manages all requests to the API.
 */
export class Api {
  /**
   * The underlying apisauce instance which performs the requests.
   */
  apisauce: ApisauceInstance

  /**
   * Configurable options.
   */
  config: ApiConfig

  /**
   * Creates the api.
   *
   * @param config The configuration to use.
   */
  constructor(config: ApiConfig = DEFAULT_API_CONFIG) {
    this.config = config
  }

  /**
   * Sets up the API.  This will be called during the bootup
   * sequence and will happen before the first React component
   * is mounted.
   *
   * Be as quick as possible in here.
   */
  setup() {
    // construct the apisauce instance
    this.apisauce = create({
      baseURL: this.config.url,
      timeout: this.config.timeout,
      headers: {
        Accept: "application/vnd.github.v3+json",
      },
    })
  }

  /**
   * Gets a list of repos.
   */
  async getRepo(repo: string): Promise<Types.GetRepoResult> {
    // make the api call
    const response: ApiResponse<any> = await this.apisauce.get(`/repos/${repo}`)

    // the typical ways to die when calling an api
    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    // transform the data into the format we are expecting
    try {
      const resultRepo: Types.Repo = {
        id: response.data.id,
        name: response.data.name,
        owner: response.data.owner.login,
      }
      return { kind: "ok", repo: resultRepo }
    } catch {
      return { kind: "bad-data" }
    }
  }

  async authenticate(credentials: Types.Credentials): Promise<Types.AuthenticateResult> {
    const response: ApiResponse<any> = await this.apisauce.post(
      `/Account/Authenticate`,
      credentials,
    )
    // console.log("authenticate", response)
    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    try {
      return { kind: "ok", token: response.data.result }
    } catch {
      return { kind: "bad-data" }
    }
  }

  async getTransactions(getTransactionsInput: Types.GetTransactionsInput): Promise<any> {
    const authToken = await loadString("authToken")
    this.apisauce.setHeader("Authorization", `Bearer ${authToken}`)
    const response: ApiResponse<any> = await this.apisauce.post(
      `services/app/transaction/GetTransactionsAsync`,
      getTransactionsInput,
    )

    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    try {
      console.log("api getTransactions", response)
      return { kind: "ok", items: response.data.result.items }
    } catch {
      return { kind: "bad-data" }
    }
  }
}

import {
  GenezioDeploy,
  GenezioMethod,
  GenezioHttpRequest,
  GenezioHttpResponse,
} from "@genezio/types";
import fetch from "node-fetch";
import { MessageService } from "./services/messageService";

@GenezioDeploy()
export class BackendService {
  messageService: MessageService;
  constructor() {
    this.messageService = new MessageService();
  }
  @GenezioMethod({ type: "http" })
  async handleSimplePlainRequest(
    request: GenezioHttpRequest
  ): Promise<GenezioHttpResponse> {
    if (request.headers.method == "GET") {
      const res = await this.messageService.verifyToken(
        request.body.hub.mode,
        request.body.hub.verify_token,
        request.body.hub.challenge
      );
      if (res.statusCode == "200") {
        return {
          body: request.body.hub.challenge,
          headers: { "content-type": "application/json" },
          statusCode: "200",
        };
      }
    }

    const response: GenezioHttpResponse = {
      body: request.body,
      headers: { "content-type": "text/html" },
      statusCode: "403",
    };

    return response;
  }
}

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
  constructor() {}
  @GenezioMethod({ type: "http" })
  async handleSimplePlainRequest(
    request: GenezioHttpRequest
  ): Promise<GenezioHttpResponse> {
    const messageService = new MessageService();
    console.log(JSON.stringify(request));
    if (request.http.method == "GET") {
      console.log(JSON.stringify(request));
      console.log(request.queryStringParameters!["hub.mode"]);
      console.log(request.queryStringParameters!["hub.verify_token"]);
      console.log(request.queryStringParameters!["hub.challenge"]);
      const res = await messageService.verifyToken(
        request.queryStringParameters!["hub.mode"],
        request.queryStringParameters!["hub.verify_token"],
        request.queryStringParameters!["hub.challenge"]
      );
      if (res.statusCode == "200") {
        return {
          body: request.queryStringParameters!["hub.challenge"],
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

  @GenezioMethod({ type: "cron", cronString: "* * * * *" })
  async sendMessageEveryday() {
    const messageService = new MessageService();
    await messageService.sendPoll();
  }
}

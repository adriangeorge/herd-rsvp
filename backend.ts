import {
  GenezioDeploy,
  GenezioMethod,
  GenezioHttpRequest,
  GenezioHttpResponse,
} from "@genezio/types";
import fetch from "node-fetch";
import { MessageService } from "./services/messageService";
import { CapybaraDBService } from "./repository/capybarasDB";

@GenezioDeploy()
export class BackendService {
  constructor() {}
  @GenezioMethod({ type: "http" })
  async handleSimplePlainRequest(
    request: GenezioHttpRequest
  ): Promise<GenezioHttpResponse> {
    const messageService = new MessageService();
    const capybaraService = new CapybaraDBService();
    if (request.http.method == "GET") {
      console.log(request.queryStringParameters!["hub.mode"]);
      console.log(request.queryStringParameters!["hub.verify_token"]);
      console.log(request.queryStringParameters!["hub.challenge"]);
      const res = await messageService.verifyToken(
        request.queryStringParameters!["hub.mode"],
        request.queryStringParameters!["hub.verify_token"]
      );
      if (res.statusCode == "200") {
        return {
          body: request.queryStringParameters!["hub.challenge"],
          headers: { "content-type": "application/json" },
          statusCode: "200",
        };
      }
    }
    if (
      request.http.method == "POST" &&
      request.body.entry[0].changes[0].value.messages[0].context.from !=
        process.env.SENDER_PHONE_NUMBER
    ) {
      if (
        request.body.entry[0].changes[0].value.messages != undefined &&
        request.body.entry[0].changes[0].value.messages[0].button !=
          undefined &&
        request.body.entry[0].changes[0].value.messages[0].button.payload ==
          "Vin la biro"
      ) {
        await capybaraService.setCapybaraStatus(
          request.body.entry[0].changes[0].value.messages[0].from,
          "OFFICE"
        );
        await messageService.sendReport();
        await messageService.whatHourArrival(
          request.body.entry[0].changes[0].value.messages[0].from
        );
      } else if (
        request.body.entry[0].changes[0].value.messages != undefined &&
        request.body.entry[0].changes[0].value.messages[0].button !=
          undefined &&
        request.body.entry[0].changes[0].value.messages[0].button.payload ==
          "Raman acasa"
      ) {
        await capybaraService.setCapybaraStatus(
          request.body.entry[0].changes[0].value.messages[0].from,
          "WFH"
        );
        await messageService.sendReport();
      } else if (
        request.body.entry[0].changes[0].value.messages != undefined &&
        request.body.entry[0].changes[0].value.messages[0].text.body !=
          undefined
      ) {
        await capybaraService.setCapybaraArrival(
          request.body.entry[0].changes[0].value.messages[0].from,
          request.body.entry[0].changes[0].value.messages[0].text.body
        );
        await messageService.sendReport();
      }
      // console.log("THis is request",request.body.entry[0].changes[0].value.conversation);
    }

    const response: GenezioHttpResponse = {
      body: request.body,
      headers: { "content-type": "text/html" },
      statusCode: "403",
    };

    return response;
  }

  // @GenezioMethod({ type: "cron", cronString: "* * * * *" })
  // async sendMessageEveryday() {
  //   const messageService = new MessageService();
  //   await messageService.sendPoll();
  // }
}

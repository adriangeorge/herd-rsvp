import { GenezioHttpRequest, GenezioHttpResponse } from "@genezio/types";
import axios from "axios";

export class MessageService {
  async verifyToken(
    mode: string,
    token: string,
    challenge: string
  ): Promise<GenezioHttpResponse> {
    const verify_token = process.env.VERIFY_TOKEN;

    // Check if a token and mode were sent
    if (mode && token) {
      // Check the mode and token sent are correct
      if (mode === "subscribe" && token === verify_token) {
        // Respond with 200 OK and challenge token from the request
        console.log("WEBHOOK_VERIFIED");
        return {
          body: "Succesfully verified",
          statusCode: "200",
        };
      } else {
        // Responds with '403 Forbidden' if verify tokens do not match
        return {
          body: "Failed Verification",
          statusCode: "403",
        };
      }
    }
    return {
      body: "Failed Verification",
      statusCode: "403",
    };
  }
  async sendPoll() {
    let data = JSON.stringify({
      messaging_product: "whatsapp",
      to: "40737850966",
      type: "template",
      template: {
        name: "intrebare_birou",
        language: {
          code: "ro",
        },
      },
    });

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://graph.facebook.com/v18.0/225503143983395/messages",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer <token>",
      },
      data: data,
    };

    try {
      const res = await axios.request(config);
      console.log(JSON.stringify(res.data));
    } catch (error) {
      console.log(error);
    }
  }
}

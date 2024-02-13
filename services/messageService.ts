import { GenezioHttpResponse } from "@genezio/types";

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
}

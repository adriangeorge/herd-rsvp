import { GenezioHttpResponse } from "@genezio/types";
import axios from "axios";
import { CapybaraDBService, CapybaraModel } from "../repository/capybarasDB";

export class MessageService {
  async verifyToken(mode: string, token: string): Promise<GenezioHttpResponse> {
    const verify_token = process.env.WEBHOOK_VERIFY_TOKEN;

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
    const capybaraService = new CapybaraDBService();
    let rows: CapybaraModel[] = await capybaraService.getCapybaras();
    rows.forEach(async (capybara) => {
      let data = JSON.stringify({
        messaging_product: "whatsapp",
        to: capybara.nrtel,
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
        url: `https://graph.facebook.com/v18.0/${process.env.SENDER_PHONE_ID}/messages`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.BUSINESS_ACCT_TOKEN}`,
        },
        data: data,
      };

      try {
        const res = await axios.request(config);
      } catch (error) {
        console.log(error);
      }
    });
  }

  async whatHourArrival(phoneNumber: string) {
    let data = JSON.stringify({
      messaging_product: "whatsapp",
      to: phoneNumber,
      type: "template",
      template: {
        name: "birou_ore",
        language: {
          code: "ro",
        },
      },
    });

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `https://graph.facebook.com/v18.0/${process.env.SENDER_PHONE_ID}/messages`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.BUSINESS_ACCT_TOKEN}`,
      },
      data: data,
    };

    try {
      const res = await axios.request(config);
    } catch (error) {
      console.log(error);
    }
  }

  async sendReport() {
    const capybaraService = new CapybaraDBService();
    let rows: CapybaraModel[] = await capybaraService.getCapybaras();
    let office = "";
    let home = "";
    console.log(JSON.stringify(rows));
    for (let i = 0; i < rows.length; i++) {
      if (rows[i].status == "WFH") {
        home += `${rows[i].name}\n`;
      } else {
        office += `${rows[i].name} la ${rows[i].arrivesat}\n`;
      }
    }

    const currentDateISO = new Date().toISOString().slice(0, 10);
    for (let i = 0; i < rows.length; i++) {
      const reportMessage = `*Raport pentru ${currentDateISO}*
--------------     
La birou vine:
${office}
--------------
Acasa raman:
${home}
`;
      let data = JSON.stringify({
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: rows[i].nrtel,
        type: "text",
        text: {
          preview_url: false,
          body: reportMessage,
        },
      });

      let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: `https://graph.facebook.com/v18.0/${process.env.SENDER_PHONE_ID}/messages`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.BUSINESS_ACCT_TOKEN}`,
        },
        data: data,
      };

      try {
        const res = await axios.request(config);
      } catch (error) {
        console.log(error);
      }
    }
  }
}

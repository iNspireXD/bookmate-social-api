import cron from "cron";
import https from "https";

const job = new cron.CronJob("*/14 * * * *", function () {
  https
    .get(process.env.API_URL, (res) => {
      if (res.statusCode === 200) console.log("GET request sent successfully");
      else console.log("GET request failed", res.statusCode);
    })
    .on("error", (err) =>
      console.log("Error while sending request", err.message)
    );
});

export default job;

// CRON JOB EXPLANATION
// The cron job is set to run every 14 minutes. It sends a GET request to the specified API URL (defined in the environment variable API_URL). If the request is successful (status code 200), it logs a success message; otherwise, it logs an error message with the status code. If there is an error while sending the request, it logs the error message.
// The cron job is created using the cron package, which allows you to schedule tasks at specific intervals. The job is defined as a function that will be executed according to the specified schedule. In this case, the schedule is set to run every 14 minutes using the cron expression "*/14 * * * *". The job can be started using the start() method of the CronJob instance.
//Example of cron job schedule expressions:
// 1. Every minute: "* * * * *"
// 2. Every hour: "0 * * * *"
// 3. Every day at midnight: "0 0 * * *"
// 4. Every Sunday at 3 AM: "0 3 * * 0"

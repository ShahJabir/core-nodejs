enum Status {
  Pending = "PENDING",
  Success = "SUCCESS",
  Error = "ERROR",
}

const PORT = process.env.PORT;
const currentStatus: Status = Status.Success;

console.log(`The port is ${PORT}`);
console.log(`Current Status: ${currentStatus}`);

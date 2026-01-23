import { open } from "fs/promises";

const fileHandle = await open("buffer.txt", "w");

const stream = fileHandle.createWriteStream();
console.log(stream.writableHighWaterMark);
console.log(stream.writableLength);

const buff = Buffer.from("B");
console.log(stream.write(buff));
console.log(stream.writableLength);

const overBuff = Buffer.alloc(16384, "A");
console.log(stream.write(overBuff));
console.log(stream.writableLength);

stream.on("drain", () => {
  console.log("We are now safe to write more!");
  console.log(stream.write(Buffer.alloc(1, "B")));
  console.log(stream.writableLength);
});

stream.end();

await new Promise((resolve) => stream.once("finish", resolve));

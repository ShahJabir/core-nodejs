import { open } from "fs/promises";

console.time("Buffer");
const fileHandle = await open("buffer.txt", "w");

const stream = fileHandle.createWriteStream();
console.log(stream.writableHighWaterMark);

let i = 0;

const writeBuff = () => {
  while (i < 1000000) {
    const buff = Buffer.from(` ${i} `, "utf-8");
    i++;
    if (i > 999999) {
      return stream.end(buff);
    }
    if (!stream.write(buff)) break;
  }
};

writeBuff();

stream.on("drain", () => {
  console.log("Drained!!!");
  writeBuff();
});
stream.on("finish", () => {
  console.timeEnd("Buffer");
  fileHandle.close();
});

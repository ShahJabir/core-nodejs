import { open as openPromise } from "fs/promises";
import { open, write, writeSync } from "fs";
(async () => {
  console.time("writeManyPromise");
  const fileHandle = await openPromise("textPromise.txt", "w");
  for (let index = 0; index < 1000000; index++) {
    await fileHandle.write(` ${index} `);
  }
  console.timeEnd("writeManyPromise");
})();

(async () => {
  console.time("writeManySync");
  open("testSync.txt", "w", (_, fd) => {
    for (let index = 0; index < 1000000; index++) {
      writeSync(fd, ` ${index} `);
    }
  });
  console.timeEnd("writeManySync");
})();

(async () => {
  console.time("writeManyCallBack");
  open("testCallBack.txt", "w", (_, fd) => {
    for (let index = 0; index < 1000000; index++) {
      write(fd, ` ${index} `, () => {});
    }
  });
  console.timeEnd("writeManyCallBack");
})();

# Node.js EventEmitter - Complete Guide

A comprehensive guide to understanding and using the EventEmitter class in Node.js.

## Table of Contents

- [Introduction](#-introduction)
- [Basic Concepts](#basic-concepts)
- [Core Methods](#core-methods)
- [Usage Examples](#usage-examples)
- [Real-World Use Cases](#real-world-use-cases)
- [Best Practices](#best-practices)
- [Common Patterns](#common-patterns)
- [Error Handling](#error-handling)
- [Performance Tips](#performance-tips)
- [Common Pitfalls](#common-pitfalls)

---

---

## 🌟 Introduction

EventEmitter is one of the most fundamental and powerful patterns in Node.js. It's at the heart of Node's asynchronous architecture and is used by almost every major Node.js module including:

- 🌐 HTTP/HTTPS servers
- 📁 File system streams
- 🔌 Network sockets
- 👶 Child processes
- 🎭 Custom application logic

**This guide will teach you:**

- ✅ What EventEmitter is and why it matters
- ✅ How to use all EventEmitter methods
- ✅ Real-world patterns and best practices
- ✅ How to avoid common pitfalls
- ✅ Performance optimization techniques

---

### Why Use EventEmitter?

✅ **Loose Coupling** - Components don't need to know about each other  
✅ **Extensibility** - Easy to add new features without modifying existing code  
✅ **Asynchronous Communication** - Handle async operations elegantly  
✅ **Multiple Listeners** - Many handlers can respond to the same event  
✅ **Built into Node.js** - Used by streams, HTTP servers, child processes, etc.

### Simple Analogy

Think of EventEmitter like a **radio station**:

- **emit()** = Broadcasting a message
- **on()** = Tuning in to listen
- Multiple people can listen to the same broadcast
- The broadcaster doesn't need to know who's listening

---

## Basic Concepts

### 1. Events and Listeners

```output
┌─────────────┐         emit         ┌─────────────┐
│             │ ──────────────────► │             │
│   Emitter   │                      │  Listener 1 │
│             │ ──────────────────► │  Listener 2 │
│             │                      │  Listener 3 │
└─────────────┘                      └─────────────┘
```

- **Event**: A named occurrence (e.g., 'data', 'error', 'complete')
- **Listener**: A function that executes when an event is emitted
- **Emitter**: An object that triggers events

### Creating an EventEmitter

```javascript
const EventEmitter = require("events");

// Method 1: Direct instantiation
const emitter = new EventEmitter();

// Method 2: Extending the class (recommended for complex objects)
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();
```

### The Event Loop

```output
1. Register listeners with .on()
2. Emit events with .emit()
3. Listeners are called in registration order
4. Events are synchronous by default
```

---

## Core Methods

### 1. `emitter.on(eventName, listener)`

Register a listener function that will be called every time the event is emitted.

**Aliases:** `addListener()`

```javascript
const emitter = new EventEmitter();

emitter.on("greet", (name) => {
  console.log(`Hello, ${name}!`);
});

emitter.emit("greet", "Alice"); // Output: Hello, Alice!
emitter.emit("greet", "Bob"); // Output: Hello, Bob!
```

**Parameters:**

- `eventName` (string | symbol) - The name of the event
- `listener` (function) - The callback function to execute

**Returns:** `EventEmitter` (for chaining)

---

### 2. `emitter.emit(eventName[, ...args])`

Trigger an event and call all registered listeners with the provided arguments.

```javascript
const emitter = new EventEmitter();

emitter.on("calculate", (a, b) => {
  console.log(`Sum: ${a + b}`);
});

emitter.emit("calculate", 5, 10); // Output: Sum: 15
```

**Parameters:**

- `eventName` (string | symbol) - The event to emit
- `...args` - Arguments to pass to listeners

**Returns:** `boolean` - `true` if listeners exist, `false` otherwise

---

### 3. `emitter.once(eventName, listener)`

Register a listener that will only be called **once**, then automatically removed.

```javascript
const emitter = new EventEmitter();

emitter.once("initialize", () => {
  console.log("Initialized!");
});

emitter.emit("initialize"); // Output: Initialized!
emitter.emit("initialize"); // Output: (nothing)
```

**Use Cases:**

- One-time setup/initialization
- Connection established
- First-time events

---

### 4. `emitter.off(eventName, listener)`

Remove a specific listener from an event.

**Aliases:** `removeListener()`

```javascript
const emitter = new EventEmitter();

function handler() {
  console.log("Event fired!");
}

emitter.on("test", handler);
emitter.emit("test"); // Output: Event fired!

emitter.off("test", handler);
emitter.emit("test"); // Output: (nothing)
```

⚠️ **Important:** You must pass the exact same function reference to remove it.

---

### 5. `emitter.removeAllListeners([eventName])`

Remove all listeners for a specific event, or all events if no event name provided.

```javascript
const emitter = new EventEmitter();

emitter.on("test", () => console.log("Listener 1"));
emitter.on("test", () => console.log("Listener 2"));
emitter.on("other", () => console.log("Other"));

// Remove all 'test' listeners
emitter.removeAllListeners("test");
emitter.emit("test"); // Output: (nothing)

// Remove ALL listeners for ALL events
emitter.removeAllListeners();
emitter.emit("other"); // Output: (nothing)
```

---

### 6. `emitter.listenerCount(eventName)`

Get the number of listeners for a specific event.

```javascript
const emitter = new EventEmitter();

emitter.on("data", () => {});
emitter.on("data", () => {});

console.log(emitter.listenerCount("data")); // Output: 2
```

---

### 7. `emitter.listeners(eventName)`

Get an array of all listener functions for an event.

```javascript
const emitter = new EventEmitter();

const listener1 = () => console.log("One");
const listener2 = () => console.log("Two");

emitter.on("event", listener1);
emitter.on("event", listener2);

console.log(emitter.listeners("event"));
// Output: [Function: listener1, Function: listener2]
```

---

### 8. `emitter.eventNames()`

Get an array of all event names that have registered listeners.

```javascript
const emitter = new EventEmitter();

emitter.on("start", () => {});
emitter.on("stop", () => {});

console.log(emitter.eventNames());
// Output: ['start', 'stop']
```

---

### 9. `emitter.prependListener(eventName, listener)`

Add a listener at the **beginning** of the listeners array instead of the end.

```javascript
const emitter = new EventEmitter();

emitter.on("event", () => console.log("Second"));
emitter.prependListener("event", () => console.log("First"));

emitter.emit("event");
// Output:
// First
// Second
```

---

### 10. `emitter.prependOnceListener(eventName, listener)`

Like `prependListener()`, but the listener is removed after being called once.

```javascript
const emitter = new EventEmitter();

emitter.prependOnceListener("event", () => console.log("Only once, first"));
emitter.on("event", () => console.log("Always, second"));

emitter.emit("event");
// Output:
// Only once, first
// Always, second

emitter.emit("event");
// Output:
// Always, second
```

---

## Usage Examples

### Basic Example

```javascript
const EventEmitter = require("events");
const emitter = new EventEmitter();

// Register a listener
emitter.on("message", (msg) => {
  console.log("Received:", msg);
});

// Emit the event
emitter.emit("message", "Hello World!");
// Output: Received: Hello World!
```

### Multiple Listeners

```javascript
const emitter = new EventEmitter();

// Multiple listeners for the same event
emitter.on("userLogin", (username) => {
  console.log(`User logged in: ${username}`);
});

emitter.on("userLogin", (username) => {
  console.log(`Update last login time for ${username}`);
});

emitter.on("userLogin", (username) => {
  console.log(`Send welcome notification to ${username}`);
});

emitter.emit("userLogin", "Alice");
// Output:
// User logged in: Alice
// Update last login time for Alice
// Send welcome notification to Alice
```

### Extending EventEmitter

```javascript
const EventEmitter = require("events");

class User extends EventEmitter {
  constructor(name) {
    super();
    this.name = name;
  }

  login() {
    console.log(`${this.name} is logging in...`);
    this.emit("login", this.name);
  }

  logout() {
    console.log(`${this.name} is logging out...`);
    this.emit("logout", this.name);
  }
}

const user = new User("Bob");

user.on("login", (name) => {
  console.log(`Welcome back, ${name}!`);
});

user.on("logout", (name) => {
  console.log(`Goodbye, ${name}!`);
});

user.login();
// Output:
// Bob is logging in...
// Welcome back, Bob!

user.logout();
// Output:
// Bob is logging out...
// Goodbye, Bob!
```

---

## Real-World Use Cases

### 1. File Upload System

```javascript
const EventEmitter = require("events");

class FileUploader extends EventEmitter {
  upload(fileName, fileSize) {
    console.log(`Starting upload: ${fileName}`);
    this.emit("uploadStart", { fileName, fileSize });

    // Simulate upload progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 25;
      this.emit("uploadProgress", { fileName, progress });

      if (progress >= 100) {
        clearInterval(interval);
        this.emit("uploadComplete", { fileName });
      }
    }, 1000);
  }
}

const uploader = new FileUploader();

uploader.on("uploadStart", ({ fileName, fileSize }) => {
  console.log(`📤 Starting upload: ${fileName} (${fileSize}MB)`);
});

uploader.on("uploadProgress", ({ fileName, progress }) => {
  console.log(`⏳ ${fileName}: ${progress}% complete`);
});

uploader.on("uploadComplete", ({ fileName }) => {
  console.log(`✅ Upload finished: ${fileName}`);
});

uploader.upload("document.pdf", 5);
```

**Output:**

```output
Starting upload: document.pdf
📤 Starting upload: document.pdf (5MB)
⏳ document.pdf: 25% complete
⏳ document.pdf: 50% complete
⏳ document.pdf: 75% complete
⏳ document.pdf: 100% complete
✅ Upload finished: document.pdf
```

---

### 2. E-commerce Order System

```javascript
const EventEmitter = require("events");

class OrderService extends EventEmitter {
  placeOrder(order) {
    console.log(`Processing order #${order.id}`);

    // Emit different events based on order value
    this.emit("orderPlaced", order);

    if (order.total > 1000) {
      this.emit("largeOrderPlaced", order);
    }

    if (order.isFirstOrder) {
      this.emit("firstOrderPlaced", order);
    }
  }
}

const orderService = new OrderService();

// Email confirmation
orderService.on("orderPlaced", (order) => {
  console.log(`📧 Sending confirmation email for order #${order.id}`);
});

// Inventory update
orderService.on("orderPlaced", (order) => {
  console.log(`📦 Updating inventory for order #${order.id}`);
});

// Analytics tracking
orderService.on("orderPlaced", (order) => {
  console.log(`📊 Tracking order #${order.id} in analytics`);
});

// Special handling for large orders
orderService.on("largeOrderPlaced", (order) => {
  console.log(`🎉 Large order alert! Order #${order.id}: $${order.total}`);
  console.log(`📞 Notifying sales team`);
});

// First order bonus
orderService.on("firstOrderPlaced", (order) => {
  console.log(`🎁 Giving first-order bonus to customer #${order.customerId}`);
});

// Place orders
orderService.placeOrder({
  id: 1001,
  customerId: "C001",
  total: 1500,
  isFirstOrder: true,
});

console.log("\n---\n");

orderService.placeOrder({
  id: 1002,
  customerId: "C002",
  total: 50,
  isFirstOrder: false,
});
```

---

### 3. Chat Application

```javascript
const EventEmitter = require("events");

class ChatRoom extends EventEmitter {
  constructor(name) {
    super();
    this.name = name;
    this.users = [];
  }

  addUser(username) {
    this.users.push(username);
    this.emit("userJoined", username);
  }

  removeUser(username) {
    this.users = this.users.filter((u) => u !== username);
    this.emit("userLeft", username);
  }

  sendMessage(username, message) {
    this.emit("message", { username, message, timestamp: new Date() });
  }
}

const room = new ChatRoom("General");

// Log when users join
room.on("userJoined", (username) => {
  console.log(`✅ ${username} joined the chat`);
});

// Log when users leave
room.on("userLeft", (username) => {
  console.log(`❌ ${username} left the chat`);
});

// Display messages
room.on("message", ({ username, message, timestamp }) => {
  const time = timestamp.toLocaleTimeString();
  console.log(`[${time}] ${username}: ${message}`);
});

// Simulate chat activity
room.addUser("Alice");
room.addUser("Bob");
room.sendMessage("Alice", "Hello everyone!");
room.sendMessage("Bob", "Hi Alice!");
room.removeUser("Alice");
```

---

### 4. Database Connection Pool

```javascript
const EventEmitter = require("events");

class DatabasePool extends EventEmitter {
  constructor(maxConnections) {
    super();
    this.maxConnections = maxConnections;
    this.activeConnections = 0;
    this.queue = [];
  }

  async connect() {
    if (this.activeConnections < this.maxConnections) {
      this.activeConnections++;
      this.emit("connectionAcquired", this.activeConnections);
      return { id: this.activeConnections };
    } else {
      this.emit("connectionWaiting");
      // Wait for a connection to be released
      return new Promise((resolve) => {
        this.queue.push(resolve);
      });
    }
  }

  release(connection) {
    this.activeConnections--;
    this.emit("connectionReleased", this.activeConnections);

    // Give connection to next waiting request
    if (this.queue.length > 0) {
      const resolve = this.queue.shift();
      this.activeConnections++;
      resolve({ id: this.activeConnections });
    }
  }
}

const pool = new DatabasePool(3);

pool.on("connectionAcquired", (count) => {
  console.log(`🔌 Connection acquired. Active: ${count}`);
});

pool.on("connectionReleased", (count) => {
  console.log(`🔓 Connection released. Active: ${count}`);
});

pool.on("connectionWaiting", () => {
  console.log(`⏰ Waiting for available connection...`);
});

// Simulate usage
(async () => {
  const conn1 = await pool.connect();
  const conn2 = await pool.connect();
  const conn3 = await pool.connect();

  // This will wait
  setTimeout(async () => {
    const conn4 = await pool.connect();
    console.log("Got connection 4!");
  }, 100);

  // Release a connection
  setTimeout(() => {
    pool.release(conn1);
  }, 500);
})();
```

---

## Best Practices

### 1. Always Handle the 'error' Event

```javascript
const emitter = new EventEmitter();

// ❌ BAD - Will crash if error is emitted
emitter.emit("error", new Error("Something broke!"));

// ✅ GOOD - Always listen to 'error' events
emitter.on("error", (err) => {
  console.error("Error occurred:", err.message);
});

emitter.emit("error", new Error("Something broke!"));
// Output: Error occurred: Something broke!
```

**Rule:** If you emit an 'error' event and no listener exists, Node.js will **throw** and crash your application.

---

### 2. Remove Listeners to Prevent Memory Leaks

```javascript
const emitter = new EventEmitter();

function handler() {
  console.log("Event fired!");
}

// Add listener
emitter.on("data", handler);

// When done, remove it
emitter.off("data", handler);

// OR use once() for one-time events
emitter.once("initialize", () => {
  console.log("Initialized");
});
```

---

### 3. Use Named Functions for Better Debugging

```javascript
// ❌ BAD - Anonymous functions are hard to debug
emitter.on("event", () => {
  console.log("Something happened");
});

// ✅ GOOD - Named functions show up in stack traces
emitter.on("event", function handleEvent() {
  console.log("Something happened");
});
```

---

### 4. Set Max Listeners When Needed

By default, EventEmitter warns if more than 10 listeners are added to a single event (possible memory leak).

```javascript
const emitter = new EventEmitter();

// Increase the limit if you genuinely need many listeners
emitter.setMaxListeners(50);

// Or set to 0 for unlimited (use with caution)
emitter.setMaxListeners(0);
```

---

### 5. Use Symbols for Private Events

```javascript
// Use symbols to prevent naming conflicts
const PRIVATE_EVENT = Symbol("privateEvent");

class MyClass extends EventEmitter {
  doSomething() {
    this.emit(PRIVATE_EVENT, "data");
  }
}

const instance = new MyClass();
instance.on(PRIVATE_EVENT, (data) => {
  console.log("Private event:", data);
});
```

---

### 6. Return `this` for Method Chaining

```javascript
class MyEmitter extends EventEmitter {
  start() {
    console.log("Starting...");
    this.emit("start");
    return this; // Enable chaining
  }

  stop() {
    console.log("Stopping...");
    this.emit("stop");
    return this; // Enable chaining
  }
}

const emitter = new MyEmitter();

emitter
  .on("start", () => console.log("Started!"))
  .on("stop", () => console.log("Stopped!"))
  .start()
  .stop();
```

---

## Common Patterns

### 1. Event Namespacing

```javascript
const emitter = new EventEmitter();

// Use namespacing with colons
emitter.on("user:login", handleLogin);
emitter.on("user:logout", handleLogout);
emitter.on("order:created", handleOrderCreated);
emitter.on("order:shipped", handleOrderShipped);
```

---

### 2. Wildcard Events (Custom Implementation)

```javascript
class WildcardEmitter extends EventEmitter {
  emit(event, ...args) {
    super.emit(event, ...args);
    super.emit("*", event, ...args); // Emit wildcard
    return this;
  }
}

const emitter = new WildcardEmitter();

// Listen to all events
emitter.on("*", (eventName, ...args) => {
  console.log(`Event: ${eventName}`, args);
});

emitter.on("userLogin", (user) => {
  console.log(`User logged in: ${user}`);
});

emitter.emit("userLogin", "Alice");
// Output:
// User logged in: Alice
// Event: userLogin ['Alice']
```

---

### 3. Event Pipeline

```javascript
class Pipeline extends EventEmitter {
  async process(data) {
    this.emit("start", data);

    const validated = await this.validate(data);
    this.emit("validated", validated);

    const transformed = await this.transform(validated);
    this.emit("transformed", transformed);

    const saved = await this.save(transformed);
    this.emit("complete", saved);

    return saved;
  }

  async validate(data) {
    // Validation logic
    return data;
  }

  async transform(data) {
    // Transformation logic
    return data;
  }

  async save(data) {
    // Save logic
    return data;
  }
}

const pipeline = new Pipeline();

pipeline.on("start", (data) => console.log("Starting pipeline"));
pipeline.on("validated", (data) => console.log("Data validated"));
pipeline.on("transformed", (data) => console.log("Data transformed"));
pipeline.on("complete", (data) => console.log("Pipeline complete"));
```

---

### 4. Async Event Handlers

```javascript
const emitter = new EventEmitter();

// Async handlers work, but emit() doesn't wait for them
emitter.on("data", async (data) => {
  await someAsyncOperation(data);
  console.log("Async operation complete");
});

// If you need to wait, wrap in a promise
async function emitAsync(emitter, event, ...args) {
  const listeners = emitter.listeners(event);
  await Promise.all(listeners.map((listener) => listener(...args)));
}

// Usage
await emitAsync(emitter, "data", someData);
```

---

## Error Handling

### Handling Errors Properly

```javascript
const emitter = new EventEmitter();

// Method 1: Always add an error listener
emitter.on("error", (err) => {
  console.error("Error:", err.message);
  // Log to monitoring service
  // Notify administrators
});

// Method 2: Use try-catch in listeners
emitter.on("process", (data) => {
  try {
    // Risky operation
    const result = riskyOperation(data);
  } catch (err) {
    emitter.emit("error", err);
  }
});

// Method 3: Global error handler (last resort)
process.on("uncaughtException", (err) => {
  console.error("Uncaught exception:", err);
  process.exit(1);
});
```

---

### Error Event Best Practice

```javascript
class SafeEmitter extends EventEmitter {
  safeEmit(event, ...args) {
    try {
      return this.emit(event, ...args);
    } catch (err) {
      this.emit("error", err);
      return false;
    }
  }
}

const emitter = new SafeEmitter();

emitter.on("error", (err) => {
  console.error("Caught error:", err.message);
});

emitter.on("data", () => {
  throw new Error("Something went wrong");
});

emitter.safeEmit("data"); // Won't crash, will emit 'error' instead
```

---

## Performance Tips

### 1. Use `once()` for One-Time Events

```javascript
// ❌ Less efficient
emitter.on("initialized", function handler() {
  console.log("Initialized");
  emitter.off("initialized", handler);
});

// ✅ Better
emitter.once("initialized", () => {
  console.log("Initialized");
});
```

---

### 2. Remove Listeners When Done

```javascript
class Component extends EventEmitter {
  constructor() {
    super();
    this.handlers = [];
  }

  addHandler(event, handler) {
    this.on(event, handler);
    this.handlers.push({ event, handler });
  }

  cleanup() {
    // Remove all handlers
    this.handlers.forEach(({ event, handler }) => {
      this.off(event, handler);
    });
    this.handlers = [];
  }
}
```

---

### 3. Batch Events

```javascript
// ❌ BAD - Emitting many events in a loop
for (let i = 0; i < 1000; i++) {
  emitter.emit("data", i);
}

// ✅ BETTER - Batch the data
const batch = [];
for (let i = 0; i < 1000; i++) {
  batch.push(i);
}
emitter.emit("dataBatch", batch);
```

---

## Common Pitfalls

### 1. Memory Leaks from Unremoved Listeners

```javascript
// ❌ MEMORY LEAK
function createConnection() {
  const conn = new Connection();
  conn.on("data", handleData); // Never removed!
  return conn;
}

// Create many connections
for (let i = 0; i < 1000; i++) {
  createConnection();
}

// ✅ FIX
function createConnection() {
  const conn = new Connection();
  const handler = (data) => handleData(data);
  conn.on("data", handler);

  // Clean up when done
  conn.on("close", () => {
    conn.off("data", handler);
  });

  return conn;
}
```

---

### 2. Synchronous Event Emitters Block the Event Loop

```javascript
// ❌ BAD - Heavy computation blocks everything
emitter.on("process", (data) => {
  for (let i = 0; i < 1000000000; i++) {
    // Heavy computation
  }
});

// ✅ BETTER - Use async or setImmediate
emitter.on("process", (data) => {
  setImmediate(() => {
    for (let i = 0; i < 1000000000; i++) {
      // Heavy computation
    }
  });
});
```

---

### 3. Removing Anonymous Functions

```javascript
// ❌ DOESN'T WORK - Different function reference
emitter.on("event", () => console.log("Hello"));
emitter.off("event", () => console.log("Hello")); // Won't remove!

// ✅ WORKS - Same function reference
const handler = () => console.log("Hello");
emitter.on("event", handler);
emitter.off("event", handler); // Removed!
```

---

### 4. 'error' Event Must Have a Listener

```javascript
// ❌ CRASHES if no error listener
emitter.emit("error", new Error("Boom!"));
// Uncaught Error: Boom!

// ✅ SAFE
emitter.on("error", (err) => {
  console.error(err);
});
emitter.emit("error", new Error("Boom!"));
// Error: Boom! (handled gracefully)
```

---

## Quick Reference

### Method Summary

| Method                             | Purpose               | Returns      |
| ---------------------------------- | --------------------- | ------------ |
| `on(event, listener)`              | Add listener          | EventEmitter |
| `once(event, listener)`            | Add one-time listener | EventEmitter |
| `emit(event, ...args)`             | Trigger event         | boolean      |
| `off(event, listener)`             | Remove listener       | EventEmitter |
| `removeAllListeners([event])`      | Remove all listeners  | EventEmitter |
| `listenerCount(event)`             | Count listeners       | number       |
| `listeners(event)`                 | Get listeners array   | Function[]   |
| `eventNames()`                     | Get event names       | Array        |
| `prependListener(event, listener)` | Add listener at start | EventEmitter |
| `setMaxListeners(n)`               | Set max listeners     | EventEmitter |

---

## Further Reading

- [Node.js Official Documentation](https://nodejs.org/api/events.html)
- [EventEmitter Source Code](https://github.com/nodejs/node/blob/main/lib/events.js)
- [Observer Pattern](https://en.wikipedia.org/wiki/Observer_pattern)
- [Pub/Sub Pattern](https://en.wikipedia.org/wiki/Publish%E2%80%93subscribe_pattern)

---

## License

This guide is provided as-is for educational purposes.

---

## Contributing

Feel free to submit issues and enhancement requests!

---

## 🙏 Acknowledgments

- Node.js core team for creating EventEmitter
- The JavaScript community for patterns and best practices
- All contributors to this guide

---

## 📞 Support

- 📧 Email: [shahjabirofficial@gmail.com](mailto:shahjabirofficial@gmail.com)
- 💬 Linkedin: [shahjabir](https://www.linkedin.com/in/shahjabir/)
- 🌐 Site: [Official Website](https://shahjabir.com.bd)

---

<div align="center">

### ⭐ If this guide helped you, please give it a star! ⭐

Made with ❤️ by [Shah Jabir Taqi](https://github.com/ShahJabir)

</div>

### Happy Coding! 🚀

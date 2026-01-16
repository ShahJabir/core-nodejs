# Hello World - x86-64 Assembly for Windows

A simple "Hello, World!" program written in x86-64 assembly language that uses the Windows API directly.

## System Requirements

### Operating System

- **Windows 10/11** (64-bit)
- **Windows Server 2016+** (64-bit)

This program is specifically written for **Windows x64** systems and will **NOT** work on:

- Linux
- macOS
- 32-bit Windows
- ARM-based Windows

### Architecture

- **AMD64 (x86-64)** processors
  - AMD Ryzen series (5000, 7000, 9000)
  - Intel Core series (any 64-bit processor)
  - Any x86-64 compatible processor

### Required Tools

- **GNU Assembler (as)** - part of MinGW-w64 or MSYS2
- **GCC** - for linking
- **Windows Terminal** or **Command Prompt**

## Installation

### Option 1: Install MSYS2 (Recommended)

1. Download MSYS2 from <https://www.msys2.org/>
2. Install MSYS2
3. Open MSYS2 terminal and run:

### Option 2: Install MinGW-w64

1. Download from <https://www.mingw-w64.org/>
2. Install with x86_64 architecture selected
3. Add to PATH: `C:\mingw64\bin`

## How to Build

### Step 1: Assemble

Convert the assembly source to an object file:

```cmd
as -o .\assembly-demo\output\hello_world.o .\assembly-demo\main.asm
```

### Step 2: Link

Link the object file to create an executable:

```cmd
gcc -o .\assembly-demo\output\hello.exe .\assembly-demo\output\hello_world.o -lkernel32
```

### Alternative: One-line build

```cmd
as -o .\assembly-demo\output\hello_world.o .\assembly-demo\main.asm && gcc -o .\assembly-demo\output\hello.exe .\assembly-demo\output\hello_world.o -lkernel32
```

## How to Run

Simply execute the program:

```cmd
.\assembly-demo\output\hello.exe
```

### Expected Output

```output
Hello, World!
```

## Technical Details

### Assembly Syntax

- **AT&T syntax** (GNU Assembler style)
- Destination operand on the right
- Register names prefixed with `%`
- Immediate values prefixed with `$`

### Windows x64 Calling Convention

- First 4 parameters: `RCX`, `RDX`, `R8`, `R9`
- Additional parameters: stack
- **Shadow space**: 32 bytes must be reserved on stack
- Return value: `RAX`
- Caller must clean up stack

### Windows API Functions Used

1. **GetStdHandle(-11)** - Gets handle to standard output
2. **WriteConsoleA(handle, buffer, length, &written, NULL)** - Writes to console
3. **ExitProcess(0)** - Terminates the program

### Memory Sections

- **.text** - Code section (executable)
- **.data** - Initialized data (the "Hello, World!" string)
- **.bss** - Uninitialized data (written bytes counter)

## Troubleshooting

### Error: "undefined reference to GetStdHandle"

**Solution:** Use `gcc` for linking instead of `ld`:

```cmd
gcc -o .\assembly-demo\output\hello.exe .\assembly-demo\output\hello_world.o -lkernel32
```

### Error: "cannot find -lkernel32"

**Solution:** Install MinGW-w64 or MSYS2 properly and ensure it's in your PATH.

### Program doesn't output anything

**Solution:** Make sure you're running from Windows Terminal or Command Prompt, not a Unix-like shell.

## Learning Resources

- [Intel x86-64 Manual](https://www.intel.com/content/www/us/en/developer/articles/technical/intel-sdm.html)
- [Windows x64 Calling Convention](https://learn.microsoft.com/en-us/cpp/build/x64-calling-convention)
- [Windows API Documentation](https://learn.microsoft.com/en-us/windows/win32/api/)

## Author Notes

This program demonstrates:

- Direct Windows API calls from assembly
- x86-64 register usage
- Windows x64 calling convention
- Console I/O at the lowest level

Converted from macOS ARM64 assembly to Windows x86-64 assembly.

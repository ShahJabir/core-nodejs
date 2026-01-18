# Hello World for Windows x64
# Uses Windows API (kernel32.dll)

.global main
.text

main:
    # Allocate shadow space (32 bytes required by Windows x64 calling convention)
    sub $40, %rsp
    
    # Get handle to stdout
    # GetStdHandle(STD_OUTPUT_HANDLE)
    mov $-11, %rcx          # STD_OUTPUT_HANDLE = -11
    call GetStdHandle
    mov %rax, %rbx          # Save handle in rbx
    
    # WriteConsole(handle, buffer, length, &written, NULL)
    mov %rbx, %rcx          # hConsoleOutput
    lea message(%rip), %rdx # lpBuffer
    mov $14, %r8            # nNumberOfCharsToWrite
    lea written(%rip), %r9  # lpNumberOfCharsWritten
    movq $0, 32(%rsp)       # lpReserved = NULL
    call WriteConsoleA
    
    # ExitProcess(0)
    xor %rcx, %rcx          # exit code 0
    call ExitProcess

.data
message:
    .ascii "Hello, World!\n"
    
.bss
written:
    .space 4

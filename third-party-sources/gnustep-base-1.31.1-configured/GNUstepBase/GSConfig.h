#pragma once
#include <stdint.h>
#define GS_PASS_ARGUMENTS 0
#define GS_FAKE_MAIN 0
#define GS_WINAPI
#define GS_USE_WIN32_THREADS_AND_LOCKS 0
#define GS_USE_LIBDISPATCH 0
#define GS_USE_LIBDISPATCH_RUNLOOP 0
#define GS_HAVE_NSURLSESSION 1
#define GS_WORDS_BIGENDIAN 0
#define GS_SIZEOF_SHORT 2
#define GS_SIZEOF_INT 4
#define GS_SIZEOF_LONG 4
#define GS_SIZEOF_LONG_LONG 8
#define GS_SIZEOF_FLOAT 4
#define GS_SIZEOF_DOUBLE 8
#define GS_SIZEOF_VOIDP 4
#define _GSC_S_SHT 0
#define _GSC_S_INT 1
#define _GSC_S_LNG 2
#define _GSC_S_LNG_LNG 3
typedef int8_t gss8;
typedef uint8_t gsu8;
typedef int16_t gss16;
typedef uint16_t gsu16;
typedef int32_t gss32;
typedef uint32_t gsu32;
typedef int64_t gss64;
typedef uint64_t gsu64;
typedef __int128_t gss128;
typedef __uint128_t gsu128;
typedef float gsf32;
typedef double gsf64;
typedef uintptr_t gsaddr;
typedef struct { char storage[64]; } gs_cond_public_t;
typedef struct { char storage[64]; } gs_mutex_public_t;
#define GS_HAVE_I64 1
#define GS_HAVE_I128 1
#define GSNativeChar char
#define UTF32Char uint32_t
#define USE_ZLIB 0
#define USE_GMP 0
#define NXConstantString NSConstantString
#define GS_WITH_GC 0

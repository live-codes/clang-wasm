#pragma once
#include <stdlib.h>
#include <stdarg.h>
#define GNUSTEP_BASE_VERSION 13101
#define GNUSTEP_BASE_MAJOR_VERSION 1
#define GNUSTEP_BASE_MINOR_VERSION 31
#define GNUSTEP_BASE_SUBMINOR_VERSION 1
#define GNUSTEP_BASE_GCC_VERSION 0
#include <objc/objc.h>
#include <objc/objc-class.h>
#include <objc/objc-runtime.h>
#define VSPRINTF_LENGTH(VSPF_CALL) (VSPF_CALL)
#define VASPRINTF_LENGTH(VASPF_CALL) (VASPF_CALL)
#ifndef MAX
#define MAX(a,b) ((a) > (b) ? (a) : (b))
#endif
#ifndef MIN
#define MIN(a,b) ((a) < (b) ? (a) : (b))
#endif
#ifndef ABS
#define ABS(a) ((a) < 0 ? -(a) : (a))
#endif
#ifndef STRINGIFY
#define STRINGIFY(s) XSTRINGIFY(s)
#define XSTRINGIFY(s) #s
#endif
#ifndef OBJC_STRINGIFY
#define OBJC_STRINGIFY(s) @STRINGIFY(s)
#endif
#define assert(expr) ((void)0)
#define GSNOSUPERDEALLOC return
#define GS_UNREACHABLE() __builtin_unreachable()

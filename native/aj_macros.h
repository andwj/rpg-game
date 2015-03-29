
/**********************
   AJ UTILITY MACROS
***********************

by Andrew Apted, July 2014


The code herein is provided 'as-is', without any express or implied
warranty.  In no event will the authors be held liable for any damages
arising from the use of this code.  Use at your own risk.

Permission is granted to anyone to use this code for any purpose,
including commercial applications, and to freely redistribute and
modify it.  An acknowledgement would be nice, but is not required.

_____

ABOUT
_____

This is a simple header-file library with some useful macros and
endianness handling.  No implementation is needed for these.

____________

DEPENDENCIES
____________

No other libraries.

Needs the C99 header <stdint.h> 

*/

#ifndef __AJ_MACRO_LIBRARY_H__
#define __AJ_MACRO_LIBRARY_H__

/* constants */

#ifndef NULL
#define NULL    ((void*) 0)
#endif

#ifndef M_PI
#define M_PI  3.14159265358979323846
#endif

/* mathematical macros */

#ifndef MAX
#define MAX(a,b)  ((a) > (b) ? (a) : (b))
#endif

#ifndef MIN
#define MIN(a,b)  ((a) < (b) ? (a) : (b))
#endif

#ifndef ABS
#define ABS(x)  ((x) < 0 ? -(x) : (x))
#endif

#ifndef SGN
#define SGN(x)  ((x) < 0 ? -1 : (x) > 0 ? +1 : 0)
#endif

#ifndef I_ROUND
#define I_ROUND(x)  ((int) (((x) < 0.0f) ? ((x) - 0.5f) : ((x) + 0.5f)))
#endif

#ifndef CLAMP
#define CLAMP(L,x,H)  ((x) < (L) ? (L) : (x) > (H) ? (H) : (x))
#endif

/* other... */

#ifdef __GNUC__
#define PACKEDATTR  __attribute__((packed))
#else
#define PACKEDATTR
#endif

/* endian handling */

#if defined(__hppa__) || defined(__sparc__) || \
    defined(__m68k__) || defined(mc68000) || defined(_M_M68K) || \
	defined(__ppc__) || defined(__POWERPC__) || defined(_M_PPC) || \
	(defined(__MIPS__) && defined(__MISPEB__))
#define AJ_BIG_ENDIAN
#else
#define AJ_LITTLE_ENDIAN
#endif

#ifndef AJ_SWAP_16
#define AJ_SWAP_16(X)  ( ((uint16_t)(X) << 8) | ((uint16_t)(X) >> 8) )
#endif

#ifndef AJ_SWAP_32
#define AJ_SWAP_32(X)  \
  ( ((uint32_t)(X) << 24) | (((uint32_t)(X) << 8) & 0xFF0000) |  \
    ((uint32_t)(X) >> 24) | (((uint32_t)(X) >> 8) & 0xFF00) )
#endif

#ifdef AJ_LITTLE_ENDIAN
#define LE_U16(X)  ((uint16_t)(X))
#define LE_U32(X)  ((uint32_t)(X))
#define BE_U16(X)  ((uint16_t)AJ_SWAP_16(X))
#define BE_U32(X)  ((uint32_t)AJ_SWAP_32(X))
#else
#define BE_U16(X)  ((uint16_t)(X))
#define BE_U32(X)  ((uint32_t)(X))
#define LE_U16(X)  ((uint16_t)AJ_SWAP_16(X))
#define LE_U32(X)  ((uint32_t)AJ_SWAP_32(X))
#endif

/* signed versions of the above */
#define LE_S16(X)  ((int16_t) LE_U16((uint16_t)(X)))
#define LE_S32(X)  ((int32_t) LE_U32((uint32_t)(X)))
#define BE_S16(X)  ((int16_t) BE_U16((uint16_t)(X)))
#define BE_S32(X)  ((int32_t) BE_U32((uint32_t)(X)))

#endif /* __AJ_MACRO_LIBRARY_H__ */

//--- editor settings ---
// vi:ts=4:sw=4:noexpandtab

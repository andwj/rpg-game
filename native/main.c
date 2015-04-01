//----------------------------------------------------------------------
//  MAIN PROGRAM
//----------------------------------------------------------------------
//
//  Copyright (C) 2015  Andrew Apted
//
//  This program is free software; you can redistribute it and/or
//  modify it under the terms of the GNU General Public License
//  as published by the Free Software Foundation; either version 3
//  of the License, or (at your option) any later version.
//
//  This program is distributed in the hope that it will be useful,
//  but WITHOUT ANY WARRANTY; without even the implied warranty of
//  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//  GNU General Public License for more details.
//
//  You should have received a copy of the GNU General Public License
//  along with this software.  If not, please visit the following
//  web page: http://www.gnu.org/licenses/gpl.html
//
//----------------------------------------------------------------------

#define AJ_ARG_LIB_IMPLEMENTATION
#define AJ_RANDOM_IMPLEMENTATION

#include "headers.h"


bool want_quit;

const char *install_dir = NULL;


/* ----- user information ----------------------------- */

static void ShowInfo(void)
{
	printf(
		"\n"
		"===| " PROG_TITLE " " PROG_VERSION " (C) 2015 Andrew Apted |===\n"
		"\n"
	);

	printf(
		"This program is free software, under the terms of the GNU General Public\n"
		"License, and comes with ABSOLUTELY NO WARRANTY.  See the documentation\n"
		"for more details, or visit http://www.gnu.org/licenses/gpl.html\n"
		"\n"
	);
}


static bool Verify_InstallDir(const char *path)
{
	static char filename[4096];
	sprintf(filename, "%s/js/render.js", path);

#if 0  // DEBUG
	fprintf(stderr, "Trying install dir: [%s]\n", path);
	fprintf(stderr, "  using file: [%s]\n\n", filename);
#endif

	bool exists = true; //!!!! FIXME M_FileExists(filename);

	return exists;
}


void Determine_InstallDir(const char *argv0)
{
	// secondly find the "Install directory", and store the
	// result in the global variable 'install_dir'.  This is
	// where all the LUA scripts and other data files are.

// FIXME
install_dir = StringDup(".");
return;

#if 0

	int index;
	int parms;

	index = aj_arg_Find('i', "install", &parms);

	if (index >= 0 && parms > 0)
	{
		const char *user_dir = aj_arg_Param(index, 0);

		install_dir = StringDup(user_dir);

		if (Verify_InstallDir(install_dir))
			return;

		Main_FatalError("Bad install directory specified!\n");
	}

	// if run from current directory, look there
	if (argv0[0] == '.' && Verify_InstallDir("."))
	{
		install_dir = StringDup(".");
		return;
	}

#ifdef WIN32
	install_dir = M_GetExecutablePath(argv0);

#else
	static const char *prefixes[] =
	{
		"/usr/local", "/usr", "/opt",
		
		NULL  // end of list
	};

	static char test_dir[FL_PATH_MAX];

	for (int i = 0 ; prefixes[i] ; i++)
	{
		sprintf(test_dir, "%s/share/rpg-game", prefixes[i]);

		if (Verify_InstallDir(test_dir))
		{
			install_dir = StringDup(test_dir);
			return;
		}

		install_dir = NULL;
	}
#endif

	if (! install_dir)
		install_dir = StringDup(".");

	if (! Verify_InstallDir(install_dir))
		Main_FatalError("Unable to find the install directory!\n");

#endif
}


void Main_Shutdown(bool error)
{
	Screen_Shutdown();

//!!!	JS_Close();
}


void Main_FatalError(const char *msg, ...)
{
	static char buffer[MSG_BUF_LEN];

	va_list arg_pt;

	va_start(arg_pt, msg);
	vsnprintf(buffer, MSG_BUF_LEN, msg, arg_pt);
	va_end(arg_pt);

	buffer[MSG_BUF_LEN-1] = 0;

	fprintf(stderr, "\n%s\n\n", buffer);

	Main_Shutdown(true);

	al_show_native_message_box(NULL, PROG_TITLE " : Error", "A fatal error occurred", buffer, NULL, ALLEGRO_MESSAGEBOX_ERROR);

	exit(9);
}


/* ----- Main Program ----------------------------- */


void Main_ParseArguments(void)
{
	int index;
	int parms;

	index = aj_arg_Find('s', "seed", &parms);

	if (index >= 0 && parms > 0)
	{
		const char *user_seed = aj_arg_Param(index, 0);

//???		main_win->b_seed->value(user_seed);
	}
}


int main(int argc, char **argv)
{
	aj_arg_Init(argc-1, (const char **) (argv+1));

	if (aj_arg_Exists('h', "help") ||
		aj_arg_Exists(0,   "version"))
	{
		ShowInfo();
		exit(1);
	}


	Screen_Init();


	Determine_InstallDir(argv[0]);


	ConPrintf("\n");
	ConPrintf("******************************************\n");
	ConPrintf("** " PROG_TITLE " " PROG_VERSION " (C) 2015 Andrew Apted **\n");
	ConPrintf("******************************************\n");
	ConPrintf("\n");

	ConPrintf("install_dir: %s\n", install_dir);


	Main_ParseArguments();

	//?? Main_ReadPrefs();


//!!	JS_Load();


	// FIXME : script will do this
	Screen_OpenWindow(640, 480);


	while (! want_quit)
	{
		Screen_Update();
	}

	Main_Shutdown(false);

	return 0;
}


//--- editor settings ---
// vi:ts=4:sw=4:noexpandtab

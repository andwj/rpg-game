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
	sprintf(filename, "%s/js/all_files.txt", path);

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


void Main_Shutdown(void)
{
	static bool shutting_down = false;

	if (shutting_down)
		return;

	shutting_down = true;

	LogPrintf("Shutting down....\n");

	JS_Close();

	Screen_Shutdown();
}


void Main_FatalError(const char *msg, ...)
{
	static char buffer[MSG_BUF_LEN];

	va_list arg_pt;

	va_start(arg_pt, msg);
	vsnprintf(buffer, MSG_BUF_LEN, msg, arg_pt);
	va_end(arg_pt);

	buffer[MSG_BUF_LEN-1] = 0;

	fprintf(stderr, "\nERROR: %s\n", buffer);

	Main_Shutdown();

	al_show_native_message_box(NULL, PROG_TITLE " : Error", "A fatal error occurred", buffer, NULL, ALLEGRO_MESSAGEBOX_ERROR);

	exit(9);
}


bool Main_ConfirmQuit(void)
{
	// in developer mode, no need to ask
	if (aj_arg_Exists(0, "dev"))
		return true;

	// no need to ask if a game is not currently active
	if (! JS_CheckGameActive())
		return true;

	int res = al_show_native_message_box(NULL, PROG_TITLE " : Confirm Quit",
				"Really quit?",
				"There is a current game in progress. "
				"Are you sure you want to discard it without saving?",
				"Cancel|Quit",
				ALLEGRO_MESSAGEBOX_YES_NO | ALLEGRO_MESSAGEBOX_QUESTION);

	return (res == 2);
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


	LogPrintf("\n");
	LogPrintf("*****************************************\n");
	LogPrintf("** " PROG_TITLE " " PROG_VERSION " (C) 2015 Andrew Apted **\n");
	LogPrintf("*****************************************\n");
	LogPrintf("\n");


	Determine_InstallDir(argv[0]);

	LogPrintf("Install_dir: %s\n", install_dir);
	LogPrintf("\n");


	JS_Init();

	Screen_Init();

	//TODO Main_ReadOptions();

	Main_ParseArguments();	// TODO: make part of Main_ReadOptions


	/* init complete, actually do stuff now... */

	LogPrintf("\n");

	JS_Load();

	Screen_OpenWindow();

	JS_BeginScript();

	LogPrintf("\nStartup successful.\n\n");


	while (true)
	{
		Screen_Update();

		if (want_quit)
		{
			if (Main_ConfirmQuit())
				break;

			want_quit = false;
		}
	}

	Main_Shutdown();

	return 0;
}


//--- editor settings ---
// vi:ts=4:sw=4:noexpandtab

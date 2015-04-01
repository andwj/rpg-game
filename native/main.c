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

#ifndef WIN32
#include <sys/time.h>
#include <time.h>
#endif


bool want_quit;

const char *install_dir = NULL;


/* ----- user information ----------------------------- */

static void ShowInfo()
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
	static char filename[FL_PATH_MAX];
	sprintf(filename, "%s/prog/track_open.lua", path);

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
}


/* this is only to prevent ESCAPE key from quitting */
int Main_key_handler(int event)
{
	if (event != FL_SHORTCUT)
		return 0;

	if (Fl::event_key() == FL_Escape)
		return 1;  // eat it

	return 0;
}


void Main_InitFLTK()
{
	Fl::visual(FL_DOUBLE | FL_RGB);

	screen_w = Fl::w();
	screen_h = Fl::h();

#if 0  // debug
	fprintf(stderr, "Screen dimensions = %dx%d\n", screen_w, screen_h);
#endif


	// default font size for widgets
	FL_NORMAL_SIZE = 16;

	fl_message_font(FL_HELVETICA /* _BOLD */, 18);
}


void Main_OpenWindow()
{
	ConPrintf("Opening main window....\n");

 	Fl::add_handler(Main_key_handler);


	main_win = new UI_Window(800, 500, PROG_TITLE " v" PROG_VERSION);


	// show window (pass some dummy arguments)
	{
		char *argv[2];
		argv[0] = strdup("Rpg-Game.exe");
		argv[1] = NULL;

		main_win->show(1 /* argc */, argv);
	}

	Fl::wait(0.1);
	Fl::wait(0.1);

	main_win->CreateCanvas();
}


void Main_Shutdown(bool error)
{
	if (main_win)
	{
		delete main_win;
		main_win = NULL;
	}

//!!!	Script_Close();
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

	fl_alert("%s", buffer);

	Main_Shutdown(true);

	exit(9);
}


/* ----- Main Program ----------------------------- */


void Main_ParseArguments()
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


	// prepare for dialogs...
	Main_InitFLTK();


	Determine_InstallDir(argv[0]);


	ConPrintf("\n");
	ConPrintf("******************************************\n");
	ConPrintf("** " PROG_TITLE " " PROG_VERSION " (C) 2015 Andrew Apted **\n");
	ConPrintf("******************************************\n");
	ConPrintf("\n");

	ConPrintf("install_dir: %s\n", install_dir);


	Main_ParseArguments();

	//?? Main_ReadPrefs();


//!!	Script_Open();

	// FIXME : script will do this
	Main_OpenWindow();


	// run the GUI until the user quits
	try
	{
		while (! want_quit)
		{
			Fl::wait();
		}
	}
	catch (...)
	{
		Main_FatalError("An unknown problem occurred (an exception was thrown).\n");
	}

	//?? Main_WritePrefs();

	Main_Shutdown(false);

	return 0;
}


//--- editor settings ---
// vi:ts=4:sw=4:noexpandtab

import os
import locale
from subprocess import Popen, STDOUT, PIPE


class Proc(object):
    """	Control a system process. """
    def __init__(self, cmd, include_stderr=False, return_pipe=False, return_obj=False, return_retcode=True):
        super(Proc, self).__init__()
        self.cmd = cmd
        self.include_stderr = include_stderr
        self.return_pipe = return_pipe
        self.return_obj = return_obj
        self.return_retcode = return_retcode

    def Run(self):
        """ Run a command.

        Runs the given command, returning either the output
        of the program, or a pipe to read output from.

        keyword arguments --
        cmd - The command to execute
        include_std_err - Boolean specifying if stderr should
                          be included in the pipe to the cmd.
        return_pipe - Boolean specifying if a pipe to the
                      command should be returned.  If it is
                      False, all that will be returned is
                      one output string from the command.
        return_obj - If True, Run will return the Popen object
                     for the command that was run.

        """
        if not isinstance(self.cmd, list):
            cmd = self.to_unicode(str(self.cmd))
            cmd = cmd.split()
        if self.include_stderr:
            err = STDOUT
            fds = True
        else:
            err = None
            fds = False
        if self.return_obj:
            std_in = PIPE
        else:
            std_in = None

        # We need to make sure that the results of the command we run
        # are in English, so we set up a temporary environment.
        tmpenv = os.environ.copy()
        tmpenv["LC_ALL"] = "C"
        tmpenv["LANG"] = "C"

        try:
            f = Popen(cmd, shell=False, stdout=PIPE, stdin=std_in, stderr=err,
                      close_fds=fds, cwd='/', env=tmpenv)
        except OSError, e:
            print "Running command %s failed: %s" % (str(cmd), str(e))
            return ""

        if self.return_obj:
            return f
        if self.return_pipe:
            return f.stdout
        else:
            return f.communicate()[0]

    def sanitize_escaped(self,s):
        """ Sanitize double-escaped unicode strings. """
        lastpos = -1
        while True:
            lastpos = s.find('\\x', lastpos + 1)
            # print lastpos
            if lastpos == -1:
                break
            c = s[lastpos + 2:lastpos + 4]  # i.e. get the next two characters
            s = s.replace('\\x' + c, chr(int(c, 16)))
        return s

    def to_unicode(self, x):
        """ Attempts to convert a string to utf-8. """
        # If this is a unicode string, encode it and return
        if not isinstance(x, basestring):
            return x
        if isinstance(x, unicode):
            return x.encode('utf-8')

        x = self.sanitize_escaped(x)

        encoding = locale.getpreferredencoding()
        try:
            ret = x.decode(encoding).encode('utf-8')
        except UnicodeError:
            try:
                ret = x.decode('utf-8').encode('utf-8')
            except UnicodeError:
                try:
                    ret = x.decode('latin-1').encode('utf-8')
                except UnicodeError:
                    ret = x.decode('utf-8', 'replace').encode('utf-8')

        return ret

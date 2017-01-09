import os
from main.process import Proc


class Directory(object):
    """Control a Directory"""
    def __init__(self, dirname, verbose=False):
        """ Initialise the object.

        Keyword arguments:
        dirname -- the name of the directory
        verbose -- whether to print every command run

        """
        super(Directory, self).__init__()
        self.dirname = dirname
        self.verbose = verbose

    def Existed(self):
        """ check existence of given directory and return it's os feedback """
        return os.path.isdir(self.dirname)

    def List(self):
        if not os.path.exists(self.dirname):
            return None
        cmd = 'ls ' + self.dirname
        if self.verbose:
            print cmd
        process_run = Proc(cmd)
        return process_run.Run()

    def Make(self):
        cmd = 'mkdir -p ' + self.dirname
        if self.verbose:
            print cmd
        process_run = Proc(cmd)
        return process_run.Run()

import os


class File(object):
    """Control a Directory"""
    def __init__(self, name, path, verbose=False):
        """ Initialise the object.

        Keyword arguments:
        dirname -- the name of the directory
        verbose -- whether to print every command run

        """
        super(File, self).__init__()
        self.filename = path + name
        self.verbose = verbose

    def MakeExec(self):
        mode = os.stat(self.filename).st_mode
        mode |= (mode & 0o444) >> 2
        os.chmod(self.filename, mode)

    def Existed(self):
        """ check existence of given file and return it's os feedback """
        return os.path.isfile(self.filename)

    def Remove(self):
        """ remove given file and return it's os feedback """
        try:
            os.remove(self.filename)
            return True
        except Exception as e:
            return '%s (%s)' % (e.message, type(e))

    def Read(self):
        """ read in a file and return it's contents as a string """
        if not os.path.exists(self.filename):
            return None
        try:
            file_handle = open(self.filename, 'r')
            data = file_handle.read().strip()
        finally:
            file_handle.close()
        return str(data)

    def Write(self, content):
        """ write in a file and return true if succeeded  """
        try:
            file_handle = open(self.filename, 'w')
            file_handle.write(content)
        finally:
            file_handle.close()

import sys


class ErrorService:
    @staticmethod
    def return_exception(e):
        exc_tb = sys.exc_info()[2]
        file_name = exc_tb.tb_frame.f_code.co_filename
        return f"{str(e)} => {file_name}:{str(exc_tb.tb_lineno)}"

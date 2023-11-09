class CustomSaveMixin:
    def save_without_signals(self):
        self._disable_signals = True
        self.save()
        self._disable_signals = False

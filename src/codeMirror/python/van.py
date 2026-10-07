import sys as _sys
import types as _types

class _LineTracer:
    def __init__(self):
        self.top_frame = None
        self.last_line = -1
        self.issued_on_line = False

    def mark_issued(self):
        self.issued_on_line = True

    def trace(self, frame, event, arg):
        if self.top_frame is None:
            self.top_frame = frame
        # Only trace the student's own top-level frame - calls into Van's
        # methods (or any function the student defines) run in their own
        # frame and are intentionally left untraced.
        if frame is not self.top_frame:
            return None
        if event == "line":
            if self.last_line != -1 and not self.issued_on_line:
                _wait(self.last_line)
            self.last_line = frame.f_lineno
            self.issued_on_line = False
        return self.trace

    def finish(self):
        if self.last_line != -1 and not self.issued_on_line:
            _wait(self.last_line)

_tracer = None

def _run_traced(source):
    global _tracer
    _tracer = _LineTracer()
    _sys.settrace(_tracer.trace)
    try:
        exec(compile(source, "<student_code>", "exec"), _run_traced.__globals__)
    finally:
        _sys.settrace(None)
        _tracer.finish()

class Van:
    def move_forwards(self):
        _tracer.mark_issued()
        _move_forwards(_sys._getframe().f_back.f_lineno)
    def turn_left(self):
        _tracer.mark_issued()
        _turn_left(_sys._getframe().f_back.f_lineno)
    def turn_right(self):
        _tracer.mark_issued()
        _turn_right(_sys._getframe().f_back.f_lineno)
    def turn_around(self):
        _tracer.mark_issued()
        _turn_around(_sys._getframe().f_back.f_lineno)
    def wait(self):
        _tracer.mark_issued()
        _wait(_sys._getframe().f_back.f_lineno)
    def deliver(self):
        _tracer.mark_issued()
        _deliver(_sys._getframe().f_back.f_lineno)
    def sound_horn(self):
        _tracer.mark_issued()
        _sound_horn(_sys._getframe().f_back.f_lineno)
    def is_road(self, direction):
        return _is_road(direction)
    def is_road_forward(self):
        return _is_road_forward()
    def is_road_left(self):
        return _is_road_left()
    def is_road_right(self):
        return _is_road_right()
    def at_dead_end(self):
        return _at_dead_end()
    def at_destination(self):
        return _at_destination()
    def at_traffic_light(self, colour):
        return _at_traffic_light(colour)
    def at_red_traffic_light(self):
        return _at_red_traffic_light()
    def at_green_traffic_light(self):
        return _at_green_traffic_light()
    def is_animal_crossing(self):
        return _is_animal_crossing()

_van_module = _types.ModuleType("van")
_van_module.Van = Van
_sys.modules["van"] = _van_module

'use strict'

const ffi = require('ffi')
const path = require('path')
const { refType, types } = require('ref')
const Struct = require('ref-struct')

const SUNVOX_PATH = path.join(__dirname, '../sunvox_dll/macos/lib_x86_64/sunvox.dylib')

const cInt = types.int
const cShort = types.short
const cString = types.CString
const cByte = types.byte
const cUint = types.uint
const cUshort = types.ushort
const cVoid = types.void

const pCInt = refType(cInt)
const pCShort = refType(cShort)
const pCVoid = refType(cVoid)

const SunvoxNote = Struct({
  note: cByte,
  vel: cByte,
  module: cByte,
  nothing: cByte,
  ctl: cUshort,
  ctl_val: cUshort,
})
const pSunvoxNote = refType(SunvoxNote)

const TYPES = {
  SunvoxNote,
  pSunvoxNote,
}

const NOTECMD_NOTE_OFF = 128
const NOTECMD_ALL_NOTES_OFF = 129 /* notes of all synths off */
const NOTECMD_CLEAN_SYNTHS = 130 /* stop and clean all synths */
const NOTECMD_STOP = 131
const NOTECMD_PLAY = 132

const SV_INIT_FLAG_NO_DEBUG_OUTPUT = (1 << 0)
const SV_INIT_FLAG_USER_AUDIO_CALLBACK = (1 << 1) /* Interaction with sound card is on the user side */
const SV_INIT_FLAG_AUDIO_INT16 = (1 << 2)
const SV_INIT_FLAG_AUDIO_FLOAT32 = (1 << 3)
const SV_INIT_FLAG_ONE_THREAD = (1 << 4) /* Audio callback and song modification functions are in single thread */
const SV_MODULE_FLAG_EXISTS = 1
const SV_MODULE_FLAG_EFFECT = 2
const SV_MODULE_INPUTS_OFF = 16
const SV_MODULE_INPUTS_MASK = (255 << SV_MODULE_INPUTS_OFF)
const SV_MODULE_OUTPUTS_OFF = (16 + 8)
const SV_MODULE_OUTPUTS_MASK = (255 << SV_MODULE_OUTPUTS_OFF)
const SV_STYPE_INT16 = 0
const SV_STYPE_INT32 = 1
const SV_STYPE_FLOAT32 = 2
const SV_STYPE_FLOAT64 = 3

const CONSTANTS = {
  NOTECMD_NOTE_OFF,
  NOTECMD_ALL_NOTES_OFF,
  NOTECMD_CLEAN_SYNTHS,
  NOTECMD_STOP,
  NOTECMD_PLAY,
  SV_INIT_FLAG_NO_DEBUG_OUTPUT,
  SV_INIT_FLAG_USER_AUDIO_CALLBACK,
  SV_INIT_FLAG_AUDIO_INT16,
  SV_INIT_FLAG_AUDIO_FLOAT32,
  SV_INIT_FLAG_ONE_THREAD,
  SV_MODULE_FLAG_EXISTS,
  SV_MODULE_FLAG_EFFECT,
  SV_MODULE_INPUTS_OFF,
  SV_MODULE_INPUTS_MASK,
  SV_MODULE_OUTPUTS_OFF,
  SV_MODULE_OUTPUTS_MASK,
  SV_STYPE_INT16,
  SV_STYPE_INT32,
  SV_STYPE_FLOAT32,
  SV_STYPE_FLOAT64,
}

const FUNCS = {
  sv_audio_callback: [cInt, [pCVoid, cInt, cInt, cUint]],
  sv_open_slot: [cInt, [cInt]],
  sv_close_slot: [cInt, [cInt]],
  sv_lock_slot: [cInt, [cInt]],
  sv_unlock_slot: [cInt, [cInt]],
  sv_init: [cUint, [cString, cInt, cInt, cInt]],
  sv_deinit: [cInt, []],
  sv_get_sample_type: [cInt, []],
  sv_load: [cInt, [cInt, cString]],
  sv_load_from_memory: [cInt, [cInt, pCVoid, cUint]],
  sv_play: [cInt, [cInt]],
  sv_play_from_beginning: [cInt, [cInt]],
  sv_stop: [cInt, [cInt]],
  sv_set_autostop: [cInt, [cInt, cInt]],
  sv_end_of_song: [cInt, [cInt]],
  sv_rewind: [cInt, [cInt, cInt]],
  sv_volume: [cInt, [cInt, cInt]],
  sv_send_event: [cInt, [cInt, cInt, cInt, cInt, cInt, cInt, cInt]],
  sv_get_current_line: [cInt, [cInt]],
  sv_get_current_line2: [cInt, [cInt]],
  sv_get_current_signal_level: [cInt, [cInt, cInt]],
  sv_get_song_name: [cString, [cInt]],
  sv_get_song_bpm: [cInt, [cInt]],
  sv_get_song_tpl: [cInt, [cInt]],
  sv_get_song_length_frames: [cUint, [cInt]],
  sv_get_song_length_lines: [cUint, [cInt]],
  sv_new_module: [cInt, [cInt, cString, cString, cInt, cInt, cInt]],
  sv_remove_module: [cInt, [cInt, cInt]],
  sv_connect_module: [cInt, [cInt, cInt, cInt]],
  sv_disconnect_module: [cInt, [cInt, cInt, cInt]],
  sv_load_module: [cInt, [cInt, cString, cInt, cInt, cInt]],
  sv_sampler_load: [cInt, [cInt, cInt, cString, cInt]],
  sv_get_number_of_modules: [cInt, [cInt]],
  sv_get_module_flags: [cUint, [cInt, cInt]],
  sv_get_module_inputs: [pCInt, [cInt, cInt]],
  sv_get_module_outputs: [pCInt, [cInt, cInt]],
  sv_get_module_name: [cString, [cInt, cInt]],
  sv_get_module_xy: [cUint, [cInt, cInt]],
  sv_get_module_color: [cInt, [cInt, cInt]],
  sv_get_module_scope: [pCVoid, [cInt, cInt, cInt, pCInt, pCInt]],
  sv_get_module_scope2: [cUint, [cInt, cInt, cInt, pCShort, cUint]],
  sv_get_number_of_module_ctls: [cInt, [cInt, cInt]],
  sv_get_module_ctl_name: [cString, [cInt, cInt, cInt]],
  sv_get_module_ctl_value: [cInt, [cInt, cInt, cInt, cInt]],
  sv_get_number_of_patterns: [cInt, [cInt]],
  sv_get_pattern_x: [cInt, [cInt]],
  sv_get_pattern_y: [cInt, [cInt]],
  sv_get_pattern_tracks: [cInt, [cInt, cInt]],
  sv_get_pattern_lines: [cInt, [cInt, cInt]],
  sv_get_pattern_data: [pSunvoxNote, [cInt, cInt]],
  sv_pattern_mute: [cInt, [cInt, cInt, cInt]],
  sv_get_ticks: [cUint, []],
  sv_get_ticks_per_second: [cUint, []],
}

const lib = ffi.Library(SUNVOX_PATH, FUNCS)

Object.assign(module.exports, lib, CONSTANTS, TYPES)

var FRAMEDIV = 60,
    CPUSPEED = 6E6,
    STOPPERIOD = CPUSPEED / FRAMEDIV;
CTyE = {
    CTyQ: 0,
    CTyR: 1,
    CTyS: 2,
    CTyT: 3,
    CTyP: 4,
    CALC_TYPE_76FR: 5,
    CALC_TYPE_82STATSFR: 6,
    CALC_TYPE_73: 7,
    CALC_TYPE_82: 8,
    CALC_TYPE_82HW1: 9,
    CALC_TYPE_82HW2: 10,
    CALC_TYPE_81: 11,
    CTySCSE: 12,
    CTySCE: 13
};
CalcTypeNames = "TI-83+;TI-83+SE;TI-84+;TI-84+SE;TI-83;TI-76.fr;TI-82 Stats.fr;TI-73;TI-82;TI-82;TI-82;TI-81;TI-84+CSE;TI-84+CE".split(";");
PSEnum3 = {
    PORT0: 0,
    PORT2: 1,
    PORT3: 2,
    PORT4: 3
};
PSEnumX = {
    PORT3: 0,
    PORT4: 1,
    PORT5: 2,
    PORT6: 3,
    PORT7: 4,
    PORT8: 5,
    PORT9: 6,
    PORTA: 7,
    PORTB: 8,
    PORTC: 9,
    PORTD: 10,
    PORTE: 11,
    PORTF: 12,
    PORT20: 13,
    PORT21: 14,
    PORT22: 15,
    PORT23: 16,
    PORT25: 17,
    PORT26: 18,
    PORT27: 19,
    PORT28: 20,
    PORT29: 21,
    PORT2A: 22,
    PORT2B: 23,
    PORT2C: 24,
    PORT2D: 25,
    PORT2E: 26,
    PORT2F: 27
};

function i6_struct(c, d) {
    this.bank_c = this.bank_b = this.bank_a = 0;
    this.partner_link = this.link_state = 3;
    this.it_state = this.it_next = this.it_cnt = this.it_active_timer = this.it_active = this.it_mask = this.on_key = 0;
    this.it_times = Array(4);
    this.key_mask = 0;
    this.key_state = Array(7);
    this.key_map = Array(255);
    this.rom_loaded = 0;
    this.page = Array(4);
    this.mut = Array(4);
    this.flash_lock = this.mmap = 0;
    this.exc = Array(4);
    this.prot_cnt = 0;
    this.prot_buffer = Array(8);
    this.type = c;
    this.subtype = d;
    switch (c) {
        case CTyE.CALC_TYPE_82:
            this.rompages =
                8;
            this.rampages = 2;
            break;
        case CTyE.CTyP:
            this.rompages = 16;
            this.rampages = 2;
            break;
        case CTyE.CTyQ:
            this.rompages = 32;
            this.rampages = 4;
            break;
        case CTyE.CTyT:
        case CTyE.CTyR:
            this.rompages = d == CTyE.CTySCSE ? 256 : 128;
            this.rampages = 8;
            break;
        case CTyE.CTyS:
            this.rompages = 64;
            this.rampages = 8;
            break;
        case CTyE.CTySCE:
            this.rompages = 256, this.rampages = 25
    }
    this.rom = new Uint8Array(16384 * this.rompages);
    this.ram =
        new Uint8Array(16384 * this.rampages);
    this.run_lock = Array(this.rompages + this.rampages);
    this.priv_page_mask = 252;
    this.priv_page_val = 28;
    c == CTyE.CTyP || c == CTyE.CALC_TYPE_82 ? this.portbuf = Array(4) : c == CTyE.CTySCE ? this.portbuf = new Uint8Array(memports_84pce_buflen) : c != CTyE.CTyQ && (this.portbuf = Array(PSEnumX.PORT2F + 1), this.md5ars = Array(8), this.timer0 = Array(6), this.timer1 = Array(6), this.timer2 = Array(6), this.timer0[5] = 0, this.timer1[5] = 1, this.timer2[5] = 2, this.la_outstamp = -1);
    this.serial_load = function(d) {
        var e = d.charCodeAt(0),
            g = d.charCodeAt(1),
            l = 2;
        0 == e && (e = 256);
        0 == g && (g = 256);
        var h = "";
        255 == e && 255 == g ? (e = d.charCodeAt(l) - 32 | d.charCodeAt(l + 1) - 32 << 8 | d.charCodeAt(l + 2) - 32 << 16 | d.charCodeAt(l + 3) - 32 << 24, l += 4, bindata = base32k.decodeBytes(d.substring(l, l + e)), d = d.substring(l + e), e = bindata.charCodeAt(0) | bindata.charCodeAt(1) << 8, g = bindata.charCodeAt(2) | bindata.charCodeAt(3) << 8, l = 4, i6_rom = bindata.substring(l, l + 16384 * g), l += 16384 * g, i6_ram = bindata.substring(l, l + 16384 * e), h = JSON.parse(d)) :
            (i6_rom = d.substring(l, l + 16384 * g), l += 16384 * g, i6_ram = d.substring(l, l + 16384 * e), h = JSON.parse(d.substring(l + 16384 * e)));
        this.bank_a = h.bank_a;
        this.bank_b = h.bank_b;
        this.bank_c = h.bank_c;
        this.link_state = h.link_state;
        this.partner_link = h.partner_link;
        this.on_key = h.on_key;
        this.it_mask = h.it_mask;
        this.it_active = h.it_active;
        this.it_active_timer = h.it_active_timer;
        this.it_cnt = h.it_cnt;
        this.it_next = h.it_next;
        this.it_state = h.it_state;
        this.key_mask = h.key_mask;
        this.rom_loaded = h.rom_loaded;
        this.page = h.page;
        this.mut =
            h.mut;
        this.mmap = h.mmap;
        this.flash_lock = h.flash_lock;
        this.exc = h.exc;
        this.prot_cnt = h.prot_cnt;
        this.type = h.type;
        this.subtype = h.subtype;
        serial_helper_bytearray_load(i6_ram, this.ram);
        serial_helper_bytearray_load(i6_rom, this.rom);
        this.run_lock = h.run_lock;
        this.key_map = h.key_map;
        this.it_times = h.it_times;
        for (i = 0; 7 > i; i++) i6.key_state[i] = 255;
        this.prot_buffer = h.prot_buffer;
        this.rompages = h.rompages;
        this.rampages = h.rampages;
        c == CTyE.CTyP || c == CTyE.CALC_TYPE_82 ? this.portbuf = h.portbuf :
            this.type != CTyE.CTyQ && (this.portbuf = h.portbuf, this.md5ars = h.md5ars, this.timer0 = h.timer0, this.timer1 = h.timer1, this.timer2 = h.timer2, this.la_outstamp = h.la_outstamp);
        ti_common_set_type_routines();
        i6_set_priv_pages();
        i6_mem_chmode()
    };
    this.serial_save = function() {
        js_lo = {};
        js_lo.bank_a = this.bank_a;
        js_lo.bank_b = this.bank_b;
        js_lo.bank_c = this.bank_c;
        js_lo.link_state = this.link_state;
        js_lo.partner_link = this.partner_link;
        js_lo.on_key = this.on_key;
        js_lo.it_mask = this.it_mask;
        js_lo.it_active =
            this.it_active;
        js_lo.it_active_timer = this.it_active_timer;
        js_lo.it_cnt = this.it_cnt;
        js_lo.it_next = this.it_next;
        js_lo.it_state = this.it_state;
        js_lo.key_mask = this.key_mask;
        js_lo.rom_loaded = this.rom_loaded;
        js_lo.page = this.page;
        js_lo.mut = this.mut;
        js_lo.mmap = this.mmap;
        js_lo.flash_lock = this.flash_lock;
        js_lo.exc = this.exc;
        js_lo.prot_cnt = this.prot_cnt;
        js_lo_ram = serial_helper_bytearray_save(this.ram, 16384 * this.rampages);
        js_lo_rom = serial_helper_bytearray_save(this.rom, 16384 * this.rompages);
        js_lo.run_lock = this.run_lock;
        js_lo.key_map = this.key_map;
        js_lo.it_times = this.it_times;
        js_lo.key_state = this.key_state;
        js_lo.prot_buffer = this.prot_buffer;
        js_lo.type = this.type;
        js_lo.subtype = this.subtype;
        js_lo.rompages = this.rompages;
        js_lo.rampages = this.rampages;
        c == CTyE.CTyP || c == CTyE.CALC_TYPE_82 ? js_lo.portbuf = this.portbuf : this.type != CTyE.CTyQ && (js_lo.portbuf = this.portbuf, js_lo.md5ars = this.md5ars, js_lo.timer0 = this.timer0, js_lo.timer1 = this.timer1, js_lo.timer2 = this.timer2, js_lo.la_outstamp = this.la_outstamp);
        js_lo.version = localStoreVersion;
        var d = String.fromCharCode(this.rampages & 255) + String.fromCharCode(this.rampages >> 8 & 255) + String.fromCharCode(this.rompages & 255) + String.fromCharCode(this.rompages >> 8 & 255),
            d = base32k.encodeBytes(d + js_lo_rom + js_lo_ram),
            d = String.fromCharCode(32 + (d.length & 255)) + String.fromCharCode(32 + (d.length >> 8 & 255)) + String.fromCharCode(32 + (d.length >> 16 & 255)) + String.fromCharCode(32 + (d.length >> 24 & 255)) + d;
        return String.fromCharCode(255) + String.fromCharCode(255) + d + JSON.stringify(js_lo)
    };
    this.key_map = [];
    this.key_map[27] = 102;
    this.key_map[48] = 64;
    this.key_map[49] = 65;
    this.key_map[50] = 49;
    this.key_map[51] = 33;
    this.key_map[52] = 66;
    this.key_map[53] = 50;
    this.key_map[54] = 34;
    this.key_map[55] = 67;
    this.key_map[56] = 51;
    this.key_map[57] = 35;
    this.key_map[96] = 64;
    this.key_map[97] = 65;
    this.key_map[98] = 49;
    this.key_map[99] = 33;
    this.key_map[100] = 66;
    this.key_map[101] = 50;
    this.key_map[102] = 34;
    this.key_map[103] = 67;
    this.key_map[104] = 51;
    this.key_map[105] = 35;
    this.key_map[173] = 32;
    this.key_map[187] = 17;
    this.key_map[189] = 32;
    this.key_map[61] =
        17;
    this.key_map[69] = 69;
    this.key_map[73] = 84;
    this.key_map[79] = 67;
    this.key_map[80] = 51;
    this.key_map[81] = 35;
    this.key_map[87] = 18;
    this.key_map[82] = 19;
    this.key_map[84] = 66;
    this.key_map[89] = 65;
    this.key_map[85] = 50;
    this.key_map[219] = 52;
    this.key_map[221] = 36;
    this.key_map[13] = 16;
    this.key_map[17] = 87;
    this.key_map[65] = 86;
    this.key_map[83] = 82;
    this.key_map[68] = 85;
    this.key_map[70] = 53;
    this.key_map[71] = 37;
    this.key_map[72] = 21;
    this.key_map[74] = 68;
    this.key_map[75] = 52;
    this.key_map[76] = 36;
    this.key_map[16] = 101;
    this.key_map[192] =
        71;
    this.key_map[90] = 49;
    this.key_map[88] = 81;
    this.key_map[67] = 54;
    this.key_map[86] = 34;
    this.key_map[66] = 70;
    this.key_map[78] = 83;
    this.key_map[77] = 20;
    this.key_map[188] = 68;
    this.key_map[190] = 48;
    this.key_map[111] = 20;
    this.key_map[191] = 22;
    this.key_map[106] = 19;
    this.key_map[32] = 64;
    this.key_map[112] = 100;
    this.key_map[113] = 99;
    this.key_map[114] = 98;
    this.key_map[115] = 97;
    this.key_map[116] = 96;
    this.key_map[117] = 128;
    this.key_map[36] = 86;
    this.key_map[38] = 3;
    this.key_map[33] = 70;
    this.key_map[109] = 18;
    this.key_map[37] = 1;
    this.key_map[39] =
        2;
    this.key_map[107] = 17;
    this.key_map[35] = 55;
    this.key_map[40] = 0;
    this.key_map[34] = 54;
    this.key_map[45] = 38;
    this.key_map[46] = 103
}

function i6_loadrom(c) {
    if (!i6.rom_loaded) {
        for (var d = 0; d < c.length; d++) i6.rom[d] = c.charCodeAt(d);
        i6.rom_loaded = 1
    }
}

function ti_common_reset() {
    ti_common_set_type_routines();
    ti_common_doreset()
}

function ti_common_set_type_routines() {
    i6.type == CTyE.CTyP ? (ti_common_doreset = i5_reset, ti_common_out = i5_out, ti_common_in = i5_in, ti_common_get_file = i5_get_file, ti_common_send_file = i5_send_file, ti_common_get_listing = i5_get_listing) : i6.type == CTyE.CALC_TYPE_82 ? (ti_common_doreset = ti_82_reset, ti_common_out = ti_82_out, ti_common_in = ti_82_in, ti_common_get_file = i5_get_file, ti_common_send_file = i5_send_file, ti_common_get_listing = i5_get_listing) : i6.type ==
        CTyE.CTySCE ? (ti_common_doreset = ti_84pce_reset, ti_common_out = ti_84pce_out, ti_common_in = ti_84pce_in, ti_common_get_file = ti_84pce_get_file, ti_common_send_file = ti_84pce_send_file, ti_common_get_listing = ti_84pce_get_listing) : (ti_common_doreset = i6_reset, ti_common_out = i6_out, ti_common_in = i6_in, ti_common_get_file = i6_get_file, ti_common_send_file = i6_send_file, ti_common_get_listing = i6_get_listing);
    i6_mem_chmode()
}

function i6_powered() {
    return i6.it_mask & 8 || !z8.halted
}

function i6_key(c, d) {
    if (128 == c || 128 == i6.key_map[c]) d & 1 ? i6.on_key || (i6.on_key = 1, i6.it_active |= i6.it_mask & 1) : i6.on_key = 0;
    else {
        if (2 > d && void 0 == i6.key_map[c]) return !1;
        var f = 2 > d ? i6.key_map[c] : c;
        f < 7 * f4t946cth() << 4 && (i6.key_state[f >> 4] = d & 1 ? i6.key_state[f >> 4] & ~(1 << (f & 7)) : i6.key_state[f >> 4] | 1 << (f & 7))
    }
    return !0
}

function i6_link_instruction() {
    var c = i6_rmem(z8.r2[Regs2_PC]),
        d = i6_rmem(z8.r2[Regs2_PC] + 1);
    return 0 == (d & 23) && 211 == (c & 247) || 237 == c && 0 == (z8.r[Regs_C] & 23) && 64 == (d & 198)
}

function i6_run() {
    for (;;) {
        for (; i6.it_cnt < i6.it_next && !i6.it_active && !i6.it_active_timer && emu.stop_cnt < emu.stop_period && !debug_trapped && 2 > z8.halted;) z8_step();
        if (debug_trapped) break;
        2 == z8.halted && i6_reset();
        if (emu.stop_cnt >= emu.stop_period) break;
        if (i6.it_active_timer) z8_interrupt_fire();
        else switch (4 * (0 != i6.it_active) + 2 * (i6.it_cnt >= i6.it_next) + z8.halted) {
            case 0:
                z8_step();
                break;
            case 1:
                if (i6.it_mask & 6 && emu.stop_period - emu.stop_cnt > i6.it_next - i6.it_cnt) tss +=
                    i6.it_next - i6.it_cnt, emu.stop_cnt += i6.it_next - i6.it_cnt, i6.it_cnt = i6.it_next;
                else {
                    tss += emu.stop_period - emu.stop_cnt;
                    i6.it_cnt += emu.stop_period - emu.stop_cnt;
                    emu.stop_cnt = emu.stop_period;
                    return
                }
                break;
            case 2:
            case 3:
            case 6:
            case 7:
                switch (i6.it_state) {
                    case 0:
                    case 1:
                        i6.it_active |= i6.it_mask & (i6.it_mask & 8 || !z8.halted ? 4 : 0);
                        break;
                    case 2:
                        i6.it_active |= i6.it_mask & (i6.it_mask & 8 || !z8.halted ? 2 : 0);
                        break;
                    case 3:
                        i6.it_cnt -= i6.it_next
                }
                i6.it_state =
                    i6.it_state + 1 & 3;
                i6.it_next = i6.it_times[i6.it_state];
                if (!i6.it_active) break;
            case 4:
            case 5:
                if (z8_interrupt_fire()) return
        }
        if (1 == debug_stepping) break
    }
}

function i6_rcv_file() {
    emu.link_state = 3;
    return 0
};
FTyE = {
    FTyQ: CTyE.CTyQ,
    FTyR: CTyE.CTyR,
    FTyS: CTyE.CTyS,
    FTyT: CTyE.CTyT,
    FTyP: CTyE.CTyP,
    FLASH_TYPE_82: CTyE.CALC_TYPE_82,
    FTyU: CTyE.CTySCSE
};
FlashModeEnum = {
    FLASH_RESET: 0,
    FLASH_CONSUME: 3,
    FLASH_PROGRAM: 19,
    FLASH_ERASEC: 32,
    FLASH_ERASE: 34,
    FLASH_ID: 51
};
var flash_82 = [
        [0, 0, 65536],
        [0, 65536, 65536],
        [0, 131072, 65536],
        [0, 196608, 65536],
        [0, 262144, 65536],
        [0, 327680, 65536],
        [0, 393216, 65536],
        [0, 458752, 65536]
    ],
    flash_83 = [
        [0, 0, 65536],
        [0, 65536, 65536],
        [0, 131072, 65536],
        [0, 196608, 65536],
        [0, 262144, 65536],
        [0, 327680, 65536],
        [0, 393216, 65536],
        [0, 458752, 65536],
        [0, 524288, 65536],
        [0, 589824, 65536],
        [0, 655360, 65536],
        [0, 720896, 65536],
        [0, 786432, 65536],
        [0, 851968, 65536],
        [0, 917504, 65536],
        [0, 983040, 65536]
    ],
    flash_83p = [
        [0, 0, 65536],
        [0, 65536, 65536],
        [0, 131072, 65536],
        [0, 196608, 65536],
        [0, 262144,
            65536
        ],
        [0, 327680, 65536],
        [0, 393216, 65536],
        [0, 458752, 32768],
        [0, 491520, 8192],
        [0, 499712, 8192],
        [1, 507904, 16384]
    ],
    flash_84p = [
        [0, 0, 65536],
        [0, 65536, 65536],
        [0, 131072, 65536],
        [0, 196608, 65536],
        [0, 262144, 65536],
        [0, 327680, 65536],
        [0, 393216, 65536],
        [0, 458752, 65536],
        [0, 524288, 65536],
        [0, 589824, 65536],
        [0, 655360, 65536],
        [1, 720896, 65536],
        [0, 786432, 65536],
        [0, 851968, 65536],
        [0, 917504, 65536],
        [0, 983040, 32768],
        [0, 1015808, 8192],
        [0, 1024E3, 8192],
        [1, 1032192, 16384]
    ],
    flash_84pse = [
        [0, 0, 65536],
        [0, 65536, 65536],
        [0, 131072, 65536],
        [0, 196608,
            65536
        ],
        [0, 262144, 65536],
        [0, 327680, 65536],
        [0, 393216, 65536],
        [0, 458752, 65536],
        [0, 524288, 65536],
        [0, 589824, 65536],
        [0, 655360, 65536],
        [1, 720896, 65536],
        [0, 786432, 65536],
        [0, 851968, 65536],
        [0, 917504, 65536],
        [0, 983040, 65536],
        [0, 1048576, 65536],
        [0, 1114112, 65536],
        [0, 1179648, 65536],
        [0, 1245184, 65536],
        [0, 1310720, 65536],
        [0, 1376256, 65536],
        [0, 1441792, 65536],
        [0, 1507328, 65536],
        [0, 1572864, 65536],
        [0, 1638400, 65536],
        [0, 1703936, 65536],
        [0, 1769472, 65536],
        [0, 1835008, 65536],
        [0, 1900544, 65536],
        [0, 1966080, 65536],
        [0, 2031616, 32768],
        [0,
            2064384, 8192
        ],
        [0, 2072576, 8192],
        [1, 2080768, 16384]
    ],
    flash_84pcse = [
        [0, 0, 65536],
        [0, 65536, 65536],
        [0, 131072, 65536],
        [0, 196608, 65536],
        [0, 262144, 65536],
        [0, 327680, 65536],
        [0, 393216, 65536],
        [0, 458752, 65536],
        [0, 524288, 65536],
        [0, 589824, 65536],
        [0, 655360, 65536],
        [1, 720896, 65536],
        [0, 786432, 65536],
        [0, 851968, 65536],
        [0, 917504, 65536],
        [0, 983040, 65536],
        [0, 1048576, 65536],
        [0, 1114112, 65536],
        [0, 1179648, 65536],
        [0, 1245184, 65536],
        [0, 1310720, 65536],
        [0, 1376256, 65536],
        [0, 1441792, 65536],
        [0, 1507328, 65536],
        [0, 1572864, 65536],
        [0, 1638400,
            65536
        ],
        [0, 1703936, 65536],
        [0, 1769472, 65536],
        [0, 1835008, 65536],
        [0, 1900544, 65536],
        [0, 1966080, 65536],
        [0, 2031616, 65536],
        [0, 2097152, 65536],
        [0, 2162688, 65536],
        [0, 2228224, 65536],
        [0, 2293760, 65536],
        [0, 2359296, 65536],
        [0, 2424832, 65536],
        [0, 2490368, 65536],
        [0, 2555904, 65536],
        [0, 2621440, 65536],
        [0, 2686976, 65536],
        [0, 2752512, 65536],
        [0, 2818048, 65536],
        [0, 2883584, 65536],
        [0, 2949120, 65536],
        [0, 3014656, 65536],
        [0, 3080192, 65536],
        [0, 3145728, 65536],
        [0, 3211264, 65536],
        [0, 3276800, 65536],
        [0, 3342336, 65536],
        [0, 3407872, 65536],
        [0, 3473408,
            65536
        ],
        [0, 3538944, 65536],
        [0, 3604480, 65536],
        [0, 3670016, 65536],
        [0, 3735552, 65536],
        [0, 3801088, 65536],
        [0, 3866624, 65536],
        [0, 3932160, 65536],
        [0, 3997696, 65536],
        [0, 4063232, 65536],
        [0, 4128768, 8192],
        [0, 4136960, 8192],
        [0, 4145152, 8192],
        [0, 4153344, 8192],
        [0, 4161536, 8192],
        [0, 4169728, 8192],
        [1, 4177920, 8192],
        [1, 4186112, 8192]
    ];

function FlashROM() {
    this.pnum = this.mask = this.phase = 0;
    this.mem = [];
    this.pages = [];
    this.serial_load = function(c) {
        flash2 = JSON.parse(c);
        this.phase = flash2.phase;
        this.mask = flash2.mask;
        this.pnum = flash2.pnum;
        this.pages = flash2.pages
    };
    this.serial_save = function() {
        js_lo = {};
        js_lo.phase = this.phase;
        js_lo.mask = this.mask;
        js_lo.pnum = this.pnum;
        js_lo.pages = this.pages;
        return JSON.stringify(js_lo)
    }
}
var flash = new FlashROM;

function flash_reset(c, d) {
    flash.phase = FlashModeEnum.FLASH_RESET;
    flash.mem = d;
    switch (c) {
        case FTyE.FLASH_TYPE_82:
            flash.pages = flash_82;
            flash.mask = 131071;
            break;
        case FTyE.FTyP:
            flash.pages = flash_83;
            flash.mask = 262143;
            break;
        case FTyE.FTyQ:
            flash.pages = flash_83p;
            flash.mask = 524287;
            break;
        case FTyE.FTyS:
            flash.pages = flash_84p;
            flash.mask = 1048575;
            break;
        case FTyE.FTyU:
            flash.pages = flash_84pcse;
            flash.mask = 4194303;
            break;
        default:
            flash.pages =
                flash_84pse, flash.mask = 2097151
    }
    flash.pnum = flash.pages.length
}

function flash_erase(c) {
    if (!flash.pages[c][0])
        for (var d = 0; d < flash.pages[c][2]; d++) flash.mem[flash.pages[c][1] + d] = 255
}

function flash_write(c, d) {
    c &= flash.mask;
    switch (flash.phase & 3) {
        case 0:
            170 == d && 2730 == (c & 4095) ? flash.phase++ : flash.phase = FlashModeEnum.FLASH_RESET;
            break;
        case 1:
            85 == d && 1365 == (c & 4095) ? flash.phase++ : flash.phase = FlashModeEnum.FLASH_RESET;
            break;
        case 2:
            switch (d) {
                case 16:
                    if (flash.phase == FlashModeEnum.FLASH_ERASE && 2730 == (c & 4095))
                        for (var f = 0; f < flash.pnum; f++) flash_erase(f);
                    flash.phase = FlashModeEnum.FLASH_RESET;
                    break;
                case 48:
                    if (flash.phase == FlashModeEnum.FLASH_ERASE)
                        for (f = 0; f < flash.pnum; f++)
                            if (c < flash.pages[f][1] +
                                flash.pages[f][2]) {
                                flash_erase(f);
                                break
                            } flash.phase = FlashModeEnum.FLASH_RESET;
                    break;
                case 128:
                    flash.phase = FlashModeEnum.FLASH_ERASEC;
                    break;
                case 144:
                    flash.phase = FlashModeEnum.FLASH_ID;
                    i6_mem_chmode(1);
                    break;
                case 160:
                    flash.phase = FlashModeEnum.FLASH_PROGRAM
            }
            break;
        case 3:
            flash.phase == FlashModeEnum.FLASH_ID && 240 == d ? (flash.phase = FlashModeEnum.FLASH_RESET, i6_mem_chmode()) : flash.phase == FlashModeEnum.FLASH_PROGRAM && (flash.mem[c] &= d, flash.phase = FlashModeEnum.FLASH_RESET)
    }
};
var savestate_onunload = !0;

function i6_wipe_state() {
    localStorage.removeItem("jstified_state_ti83p");
    localStorage.removeItem("jstified_state_emu");
    localStorage.removeItem("jstified_state_flash");
    localStorage.removeItem("jstified_state_z8");
    localStorage.removeItem("jstified_state_lcd");
    localStorage.removeItem("jstified_state_link");
    localStorage.removeItem("jstified_settings")
}

function i6_load_state() {
    if (!(localStorage.getItem("jstified_state_ti83p") && localStorage.getItem("jstified_state_emu") && localStorage.getItem("jstified_state_flash") && localStorage.getItem("jstified_state_z8") && localStorage.getItem("jstified_state_lcd") && localStorage.getItem("jstified_state_link") && localStorage.getItem("jstified_settings"))) return -1;
    settings = JSON.parse(localStorage.getItem("jstified_settings"));
    if (null == settings.calctype) return -1;
    calctype = settings.calctype;
    calcsubtype = -1;
    null !=
        settings.calcsubtype && (calcsubtype = settings.calcsubtype);
    calcsubtype == CTyE.CTySCSE && (lcd = new CLCD);
    debug_active = settings.debug_active;
    running = autorun ? settings.running : !1;
    showskin = settings.showskin;
    tos = settings.tos;
    i6 = new i6_struct(calctype, calcsubtype);
    i6.serial_load(serial_get_item("jstified_state_ti83p"));
    emu.serial_load(serial_get_item("jstified_state_emu"));
    flash.serial_load(serial_get_item("jstified_state_flash"));
    z8.serial_load(serial_get_item("jstified_state_z8"));
    lcd.serial_load(serial_get_item("jstified_state_lcd"), settings);
    link.serial_load(serial_get_item("jstified_state_link"));
    return 0
}

function my_deep_copy_data(c, d) {
    if ("object" == typeof c)
        for (prop in c)
            if (null != c[prop])
                if ("object" == typeof c[prop]) {
                    if (c[prop].__isArray)
                        for (d[prop] = [], i = 0; i < c[prop].length; i++) d.push(c[prop][i])
                } else d[prop] = c[prop]
}

function serial_helper_array_save(c) {
    flatstring = "";
    return flatstring = JSON.stringify(c)
}

function serial_helper_array_load(c, d) {
    JSON.parse(c)
}

function serial_helper_bytearray_save(c, d) {
    for (var f = "", e = "undefined" == typeof d ? c.length : d, g = 0; g < e; g++) f += String.fromCharCode(c[g]);
    return f
}

function serial_helper_bytearray_load(c, d) {
    for (var f = 0; f < c.length; f++) d[f] = c.charCodeAt(f)
}

function i6_save_state() {
    if (null == i6 || null == i6.type || !savestate_onunload) return -1;
    var c = 0;
    try {
        var d = i6.serial_save();
        serial_set_item("jstified_state_ti83p", d);
        c++;
        serial_set_item("jstified_state_emu", emu.serial_save());
        c++;
        serial_set_item("jstified_state_flash", flash.serial_save());
        c++;
        serial_set_item("jstified_state_z8", z8.serial_save());
        c++;
        serial_set_item("jstified_state_lcd", lcd.serial_save());
        c++;
        serial_set_item("jstified_state_link", link.serial_save());
        c++
    } catch (f) {
        return alert(f),
            -3 - c
    }
    settings = {};
    settings.debug_active = debug_active;
    settings.running = autorun ? running : !0;
    settings.showskin = showskin;
    settings.tos = tos;
    settings.calctype = i6.type;
    settings.calcsubtype = i6.subtype;
    settings.localStoreVersion = localStoreVersion;
    try {
        localStorage.setItem("jstified_settings", JSON.stringify(settings))
    } catch (e) {
        return -2
    }
    return 0
}

function trashstate() {
    i6_trash_state()
}

function i6_trash_state() {
    confirm("Delete all saved state, including stored ROM image?") && (localStorage.removeItem("jstified_state_ti83p"), localStorage.removeItem("jstified_state_emu"), localStorage.removeItem("jstified_state_flash"), localStorage.removeItem("jstified_state_z8"), localStorage.removeItem("jstified_state_lcd"), localStorage.removeItem("jstified_state_link"), localStorage.removeItem("jstified_state_settings"), savestate_onunload = !1, location.reload())
}

function serial_get_item(c) {
    if (-1 < navigator.userAgent.toLowerCase().indexOf("chrome")) {
        c = localStorage.getItem(c);
        var d = 0;
        if ("UTF16PACKED" != c.substring(0, 11)) return c;
        var d = d + 11,
            f = c.charCodeAt(d);
        d++;
        for (var e = ""; d < c.length - f; d++) var g = c.charCodeAt(d),
            l = g & 255,
            g = g >> 8,
            e = e + (String.fromCharCode(g) + String.fromCharCode(l));
        f && (e += c.charAt(c.length - 1));
        return e
    }
    return localStorage.getItem(c)
}

function serial_set_item(c, d) {
    localStorage.setItem(c, d)
};

function LCD() {
    this.ctr = this.test = this.amp2 = this.amp = this.w_len = this.on = this.cnt_sel = this.up_dn = this.z = this.y = this.x = 0;
    this.dummy;
    this.dat = [];
    this.wcnt = [];
    this.lcnt = [];
    this.sblk = this.swht = this.amul = this.cmul = this.cblk = this.cwht = this.sdec = this.sinc = this.tjit = this.tmin = this.next_w = 0;
    this.scr = [];
    this.lcd_command = function(c) {
        emu.stop_cnt < lcd.next_w || (0 == (c & 254) ? lcd.w_len = c & 1 : 2 == (c & 254) ? lcd.on = c & 1 : 4 == (c & 252) ? (lcd.up_dn = c & 1, lcd.cnt_sel = c >> 1 & 1) : 16 == (c & 248) ? lcd.amp = c & 3 : 8 == (c & 248) ? lcd.amp2 = c & 3 : 24 == (c & 248) ?
            (lcd.test = c >> 2 & 1, lcd.ctr = 63) : 32 == (c & 224) ? (lcd.y = c & 31, lcd.dummy = 1) : 64 == (c & 192) ? lcd.z = c & 63 : 128 == (c & 192) ? (lcd.x = c & 63, lcd.dummy = 1) : 192 == (c & 192) && (lcd.ctr = c & 63), lcd.swht = lcd.cwht + lcd.cmul * (lcd.ctr - 32) - lcd.amul * (lcd.amp + lcd.amp2), lcd.sblk = lcd.cblk + lcd.cmul * (lcd.ctr - 32) - lcd.amul * (lcd.amp + lcd.amp2), lcd.next_w = 1 < lcd.tjit ? emu.stop_cnt + lcd.tmin + Math.floor(Math.random() * lcd.tjit) : emu.stop_cnt + lcd.tmin)
    };
    this.lcd_status = function() {
        return (emu.stop_cnt < lcd.next_w && emu.stop_cnt > lcd.next_w - lcd.tmin - lcd.tjit) << 7 | lcd.w_len <<
            6 | lcd.on << 5 | lcd.cnt_sel << 1 | lcd.up_dn
    };
    this.lcd_write = function(c) {
        if (!(emu.stop_cnt < lcd.next_w)) {
            var d = lcd.w_len ? 8 : 6,
                f = lcd.w_len ? 15 : 20,
                e = 120 * lcd.x + lcd.y * d,
                g;
            for (g = 0; g < d; g++) lcd.dat[e] || (lcd.wcnt[e] += emu.stop_cnt - lcd.lcnt[e]), lcd.lcnt[e] = emu.stop_cnt, lcd.dat[e] = c >> d - g - 1 & 1, e++;
            switch (lcd.cnt_sel << 1 | lcd.up_dn) {
                case 0:
                    lcd.x = (lcd.x - 1) % 64;
                    break;
                case 1:
                    lcd.x = (lcd.x + 1) % 64;
                    break;
                case 2:
                    lcd.y = (lcd.y - 1 + f) % f;
                    break;
                case 3:
                    lcd.y = (lcd.y + 1) % f
            }
            lcd.next_w = 1 < lcd.tjit ? emu.stop_cnt + lcd.tmin + Math.floor(Math.random() * lcd.tjit) :
                emu.stop_cnt + lcd.tmin
        }
    };
    this.lcd_read = function() {
        if (lcd.dummy) return lcd.dummy = 0;
        var c = lcd.w_len ? 8 : 6,
            d = lcd.w_len ? 15 : 20,
            f = 120 * lcd.x + lcd.y * c,
            e, g;
        for (e = g = 0; e < c; e++) g |= lcd.dat[f + e] << c - e - 1;
        switch (lcd.cnt_sel << 1 | lcd.up_dn) {
            case 0:
                lcd.x = (lcd.x - 1) % 64;
                break;
            case 1:
                lcd.x = (lcd.x + 1) % 64;
                break;
            case 2:
                lcd.y = (lcd.y - 1 + d) % d;
                break;
            case 3:
                lcd.y = (lcd.y + 1) % d
        }
        return g
    };
    this.lcd_reset = function(c) {
        var d;
        lcd.x = lcd.y = lcd.z = lcd.on = lcd.test = lcd.amp = lcd.amp2 = lcd.next_w = 0;
        lcd.up_dn = lcd.cnt_sel = lcd.w_len = lcd.dummy = 1;
        for (d = 0; 7680 >
            d; d++) lcd.dat[d] = lcd.wcnt[d] = lcd.lcnt[d] = 0, lcd.scr[d] = 0;
        lcd.ctr = 18;
        lcd.tmin = 25;
        lcd.tjit = 22;
        lcd.sinc = 9830.25;
        lcd.sdec = .07 * 65535;
        lcd.cwht = 3276.75;
        lcd.cblk = 65535;
        c == CTyE.CTyQ || c == CTyE.CTyP ? (lcd.cmul = 3276.75, lcd.amul = 9830.25) : (lcd.cmul = 6553.5, lcd.amul = 7097.4405);
        lcd.swht = lcd.cwht + lcd.cmul * (lcd.ctr - 32) - lcd.amul * (lcd.amp + lcd.amp2);
        lcd.sblk = lcd.cblk + lcd.cmul * (lcd.ctr - 32) - lcd.amul * (lcd.amp + lcd.amp2)
    };
    this.lcd_update = function() {
        var c, d, f;
        for (c = 0; 7680 > c; c++) d = (c + 120 * lcd.z) %
            7680, lcd.dat[d] || (lcd.wcnt[d] += emu.stop_cnt - lcd.lcnt[d]), f = (lcd.wcnt[d] << 8) / emu.stop_period, f = f * lcd.swht + (256 - f) * lcd.sblk >> 8, lcd.scr[c] > f ? (lcd.scr[c] -= lcd.sdec, lcd.scr[c] < f && (lcd.scr[c] = f)) : lcd.scr[c] < f && (lcd.scr[c] += lcd.sinc, lcd.scr[c] > f && (lcd.scr[c] = f)), 0 > lcd.scr[c] && (lcd.scr[c] = 0), 65535 < lcd.scr[c] && (lcd.scr[c] = 65535), lcd.wcnt[d] = lcd.lcnt[d] = 0;
        0 < lcd.next_w && (lcd.next_w -= emu.stop_period)
    };
    this.serial_load = function(c) {
        lcd2 = JSON.parse(c);
        this.x = lcd2.x;
        this.y = lcd2.y;
        this.z = lcd2.z;
        this.up_dn = lcd2.up_dn;
        this.cnt_sel = lcd2.cnt_sel;
        this.on = lcd2.on;
        this.w_len = lcd2.w_len;
        this.amp = lcd2.amp;
        this.amp2 = lcd2.amp2;
        this.test = lcd2.test;
        this.ctr = lcd2.ctr;
        this.next_w = lcd2.next_w;
        this.tmin = lcd2.tmin;
        this.tjit = lcd2.tjit;
        this.sinc = lcd2.sinc;
        this.sdec = lcd2.sdec;
        this.cwht = lcd2.cwht;
        this.cblk = lcd2.cblk;
        this.cmul = lcd2.cmul;
        this.amul = lcd2.amul;
        this.swht = lcd2.swht;
        this.sblk = lcd2.sblk;
        this.dat = lcd2.dat;
        this.wcnt = lcd2.wcnt;
        this.lcnt = lcd2.lcnt;
        this.scr = lcd2.scr
    };
    this.serial_save = function() {
        js_lo = {};
        js_lo.x = this.x;
        js_lo.y =
            this.y;
        js_lo.z = this.z;
        js_lo.up_dn = this.up_dn;
        js_lo.cnt_sel = this.cnt_sel;
        js_lo.on = this.on;
        js_lo.w_len = this.w_len;
        js_lo.amp = this.amp;
        js_lo.amp2 = this.amp2;
        js_lo.test = this.test;
        js_lo.ctr = this.ctr;
        js_lo.next_w = this.next_w;
        js_lo.tmin = this.tmin;
        js_lo.tjit = this.tjit;
        js_lo.sinc = this.sinc;
        js_lo.sdec = this.sdec;
        js_lo.cwht = this.cwht;
        js_lo.cblk = this.cblk;
        js_lo.cmul = this.cmul;
        js_lo.amul = this.amul;
        js_lo.swht = this.swht;
        js_lo.sblk = this.sblk;
        js_lo.dat = this.dat;
        js_lo.wcnt = this.wcnt;
        js_lo.lcnt = this.lcnt;
        js_lo.scr = this.scr;
        return JSON.stringify(js_lo)
    };
    this.setcanvasprops = function(c) {};
    this.getcanvaswidth = function() {
        return 192
    };
    this.getcanvasheight = function() {
        return 128
    };
    this.getneedrepaint = function() {
        return 1
    };
    this.getColorDepth = function() {
        return 4
    }
}
var lcd = new LCD;
var exp_jpeg_bpp = 2,
    exp_jpeg_q = 90,
    jpeg_hri_margin = 16;

function rom_onupload(c) {
    c = c.target.result;
    c instanceof ArrayBuffer && (romData2 = new Uint8Array(c), c = serial_helper_bytearray_save(romData2, romData2.length));
    "\u00ff\u00d8" == c.substring(0, 2) ? import_rom_jpeg(c) : process_rom(c)
}

function process_rom(c) {
    var d = -1,
        f = -1;
    lcd = new LCD;
    151552 >= c.length ? (d = CTyE.CALC_TYPE_82, -1 != c.indexOf("OPJ3KMLU", 0) && (f = CTyE.CALC_TYPE_81)) : 311296 >= c.length ? (d = CTyE.CTyP, -1 != c.indexOf("Termin\u0096", 0) ? f = CTyE.CALC_TYPE_76FR : -1 != c.indexOf("Liste\x00Matrice", 0) && (f = CTyE.CALC_TYPE_82STATSFR)) : 604160 >= c.length ? (d = CTyE.CTyQ, -1 != c.indexOf("GRAPH  EXPLORER  SOFTWARE", 0) && (f = CTyE.CALC_TYPE_73)) : 1040384 <= c.length && 1054720 >= c.length ? d =
        CTyE.CTyS : 2093056 <= c.length && 2314240 >= c.length ? d = "1" < c[100] ? CTyE.CTyT : CTyE.CTyR : 4186112 <= c.length && 4628480 >= c.length && (d = CTyE.CTyT, f = CTyE.CTySCSE, lcd = new CLCD);
    if (-1 != d) {
        null != document.getElementById("jstified_tools") ? tabs_tools() : null != sc2_togglemenus && sc2_togglemenus(0, 0);
        allowrun = 1;
        i6.rom_loaded = 0;
        i6_wipe_state();
        delete i6;
        i6 = new i6_struct(d, f);
        i6_loadrom(c);
        ti_common_reset();
        if (c =
            i6_save_state()) {
            if (-999 == c) return;
            alert("Failed to save state to DOM Storage (Error " + -c + "). Try a different browser.\n")
        }
        setTimeout(function() {
            go(1)
        }, 500);
        setTimeout(function() {
            press_onkey()
        }, 1E3)
    } else alert("Sorry, but this ROM appears to be an invalid size. If this is in error, please report it on the Cemetech forum.")
}

function export_rom_jpeg(c) {
    c = void 0 !== c ? c : {};
    if (void 0 === c.expim) {
        c.wasrunning = running;
        stop();
        c.rawsize = 16384 * i6.rompages;
        document.getElementById("rom_export").style.display = "block";
        document.getElementById("progress_jpeg_size").innerHTML = c.rawsize;
        c.expim = document.getElementById("rom_export_image");
        if (!c.expim || !i6.rom_loaded) return handleloadfile_pbcb(3, "jpeg", c.rawsize, "", c.lzw_state.i), !1;
        c.expcan = document.createElement("canvas");
        c.data = serial_helper_bytearray_save(i6.rom, c.rawsize);
        c.lzw_state = {};
        console.log("Start LZW data...");
        c.outdata = lzw_encode(c.data, c.rawsize, c.lzw_state, 8192);
        setTimeout(function() {
            export_rom_jpeg(c)
        }, 10)
    } else if (0 == c.lzw_state.complete) handleloadfile_pbcb(1, "jpeg", c.rawsize, "", c.lzw_state.i), c.outdata = lzw_encode(c.data, c.rawsize, c.lzw_state, 8192), setTimeout(function() {
        export_rom_jpeg(c)
    }, 10);
    else {
        handleloadfile_pbcb(2, "jpeg", c.rawsize, "", c.lzw_state.i);
        c.data = "";
        console.log("Finish LZW data...");
        c.outdata = lzw_unicode2bytestr(c.outdata);
        var d = c.outdata.length,
            d = [(d & 4278190080) >> 24, (d & 16711680) >> 16, (d & 65280) >> 8, d & 255, 0, 0, 0, 0],
            f = Math.ceil(8 / exp_jpeg_bpp * c.outdata.length),
            e = Math.floor(Math.sqrt(f)),
            e = Math.min(e, 1536),
            g = Math.ceil(f / e) + jpeg_hri_margin;
        d[4] = (e & 65280) >> 8;
        d[5] = e & 255;
        d[6] = (g & 65280) >> 8;
        d[7] = g & 255;
        c.outdata = serial_helper_bytearray_save(d, 8) + c.outdata;
        c.expcan.width = e;
        c.expcan.height = g;
        var d = 0,
            f = 0 + 4 * e * jpeg_hri_margin,
            l = c.expcan.getContext("2d");
        l.fillStyle = "white";
        l.fillRect(0, 0, e, g);
        l.font = "10px Arial";
        l.fillStyle = "red";
        l.fillText("Upload this JPEG as a ROM: http://cemete.ch/emu",
            0, 11);
        l.fillStyle = "blue";
        l.fillText(CalcTypeNames[-1 == i6.subtype ? i6.type : i6.subtype], e - 100, 11);
        expiD = l.getImageData(0, 0, e, g);
        expiDD = expiD.data;
        for (e = (1 << exp_jpeg_bpp) - 1; d < c.outdata.length;) {
            for (var g = c.outdata.charCodeAt(d), h = 8 - exp_jpeg_bpp; 0 <= h; h -= exp_jpeg_bpp) {
                var m = 255 / e * (g >> h & e);
                expiDD[f++] = m;
                expiDD[f++] = m;
                expiDD[f++] = m;
                f++
            }
            d++
        }
        l.putImageData(expiD, 0, 0);
        c.expim.src = c.expcan.toDataURL("image/jpeg", exp_jpeg_q / 100);
        c.wasrunning && start();
        delete c
    }
}

function import_rom_jpeg(c) {
    var d = document.createElement("canvas"),
        f = d.getContext("2d"),
        e = new Image;
    e.onload = function() {
        d.width = e.width;
        d.height = e.height;
        f.drawImage(e, 0, 0);
        var c = read_array_from_context(f, 0, jpeg_hri_margin, d.width, d.height - jpeg_hri_margin),
            c = lzw_bytestr2unicode(c.substring(8, 8 + (c.charCodeAt(0) << 24) + (c.charCodeAt(1) << 16) + (c.charCodeAt(2) << 8) + c.charCodeAt(3))),
            c = lzw_decode(c);
        process_rom(c)
    };
    e.src = "data:image/png;base64," + base64_encode(c)
}

function read_array_from_context(c, d, f, e, g) {
    c = c.getImageData(d, f, e, g).data;
    d = "";
    for (var l = f = 0, h = 0, m = (1 << exp_jpeg_bpp) - 1; h < 4 * e * g;) f = f << exp_jpeg_bpp | Math.round(c[h] * m / 255), l += exp_jpeg_bpp, 8 == l && (d += String.fromCharCode(f), f = l = 0), h += 4;
    return d
};
var tss = 0,
    flashFrame = 0,
    running = !1,
    apiSent = 0,
    lastRun = -1,
    localStoreVersion = 2,
    debug_active = 0,
    debug_trapped = 0,
    debug_stepping = 0,
    event_next_event, allowrun = 1,
    showskin = 1,
    bigscreen = 0,
    evt_handlers_init_flag = 0,
    tos = !1,
    qq = 44,
    ios = !1,
    autorun = !0,
    external_callbacks = {
        onload: null,
        onskinchange: null
    },
    firststart = !0;

function setExternalCallback(c, d) {
    external_callbacks[c] = d
}

function setq(c) {
    qq = c - 11
}

function evt_handlers_init() {
    if (!evt_handlers_init_flag) {
        var c = $("#screen"),
            d = $("#dropoverlay_ram"),
            f = $("#dropoverlay_rom");
        c.bind({
            dragenter: dragEnter,
            dragover: dragEnter,
            drop: drop_ram
        });
        d.bind({
            dragenter: dragEnter,
            dragexit: dragExit,
            dragleave: dragExit,
            dragover: dragOver,
            drop: drop_ram
        });
        f.bind({
            dragenter: dragEnter,
            dragexit: dragExit,
            dragleave: dragExit,
            dragover: dragOver,
            drop: drop_rom
        });
        $(".calckey").bind({
            mousedown: clickKeyDown,
            mouseup: clickKeyUp,
            touchstart: clickKey
        });
        $(".onkey").bind({
            mousedown: press_onkey
        });
        $(document).keydown(keyDown).keyup(keyUp);
        evt_handlers_init_flag = 1
    }
}

function dragEnter(c) {
    $("#dropoverlay_ram").css("display", "block");
    var d = CTyE.CTyT;
    null != i6 && null != i6.type && (d = i6.type);
    d != CTyE.CTyQ && d != CTyE.CTyR && d != CTyE.CTyS && d != CTyE.CTyT || $("#dropoverlay_rom").css("display", "block");
    c.stopPropagation();
    c.preventDefault()
}

function dragExit(c) {
    $("#dropoverlay_ram").hide();
    $("#dropoverlay_rom").hide();
    c && (c.stopPropagation(), c.preventDefault())
}

function dragOver(c) {
    c.stopPropagation();
    c.preventDefault()
}

function drop_ram(c) {
    drop(c, !0)
}

function drop_rom(c) {
    drop(c, !1)
}

function drop(c, d) {
    c.stopPropagation();
    c.preventDefault();
    dragExit();
    var f = c.originalEvent.dataTransfer;
    if (f)
        for (var f = f.files, e = f.length, g = 0; g < e; g++) handleloadfile(f[g], d)
}

function f4t946cth() {
    var c = function(c, f) {
        var e, g, l = c.length;
        for (g = 0; g < l && !e; g++)
            for (var h = 0, m = c[g].length, n = f.length, h = 0; h < m && m == n && !e; h++) e = c[g][h] === f[h];
        return e
    }(arr1, function(c) {
        var f = [],
            e, g = c.length;
        for (e = 0; e < g; e++) f.push(c.charCodeAt(e));
        return f
    }(document[function(c) {
        var f = "";
        c.forEach(function(c) {
            f += String.fromCharCode(c)
        });
        return f
    }([100, 111, 109, 97, 105, 110])])) ? !0 : !1;
    window.f4t946cth = function() {
        return c
    };
    return c
}

function go(c) {
    check_prereqs();
    evt_handlers_init();
    allowrun &= f4t946cth();
    null == c && (c = !0);
    if (firststart) try {
        c = external_callbacks.onload()
    } catch (d) {}
    c = "undefined" !== typeof sc3_present && sc3_present ? !1 : c;
    autorun = !("undefined" !== typeof sc3_present && sc3_present);
    allowrun && (allowrun &= ti83p_init());
    allowrun ? (setskin(showskin), $("#romoverlay").hide()) : ($("#rom_upload").css("display", "block"), $("#romoverlay").css("display", "block"));
    tos ? (wasrunning = running, c && start(), !wasrunning || !c && firststart || (updateMenuClass(),
        debug && (debug.debug_enablestep(!1), debug.debug_continue()), run()), firststart = !1, c = getQueryParams(), !apiSent && c.loadfile && 0 < c.loadfile.length ? ajax_kickoff("api_load.php?loadfile=" + encodeURIComponent(c.loadfile), api_loadfile_handledata) : !apiSent && document.getElementById("post_file_body") && "" != document.getElementById("post_file_body").innerHTML && api_loadfile_handledata("post")) : (allowrun = 0, $("#accept_tos").css("display", "block"), $("#romoverlay").css("display", "block"))
}

function api_loadfile_handledata(c) {
    if (44 == qq || "post" == c) {
        var d = 0;
        if (null != c && "post" == c || 4 == jstxmlhttp.readyState) {
            ajax_inprogress = !1;
            if (null != c && "post" == c || 200 == jstxmlhttp.status) {
                c = null != c && "post" == c ? document.getElementById("post_file_body").innerHTML.split("\n") : jstxmlhttp.responseText.split("\n");
                if ("FAIL" == c[0]) d = 1;
                else if (confirm("An external page is instructing jsTIfied to load " + (c.length - 1) + " files to the emulated calculator. Confirm loading only if you initiated this."))
                    for (var f = 1; f < c.length; f++) {
                        var e =
                            base64_decode(c[f]);
                        handleloadfiledata(e)
                    } else d = 1;
                apiSent = !0
            } else d = 1;
            d && (document.getElementById("file_upload_error").style.display = "block")
        }
    }
}

function getQueryParams() {
    for (var c = location.search.substr(1).split("&"), d = {}, f = 0; f < c.length; f++) {
        var e = c[f].split("=");
        d[e[0]] = e[1]
    }
    return d
}

function check_prereqs() {
    $("#API_nojs").hide();
    ios = navigator.userAgent.match(/(iPad|iPhone|iPod)/i) ? !0 : !1;
    window.File && window.FileReader && window.FileList && window.Blob || (allowrun = 0, $("#API_nofiles").show());
    window.localStorage || (allowrun = 0, $("#API_nodomstore").show());
    window.JSON || (allowrun = 0, $("#API_nojson").show());
    var c = document.getElementById("screen");
    c && c.getContext("2d") && c.getContext("2d").getImageData || (allowrun = 0, $("#API_nocanvas").show());
    localStorage.getItem("jstified_ROM") && localStorage.removeItem("jstified_ROM")
}

function processTos(c) {
    (tos = 1 == c ? !0 : !1) && $("#accept_tos").hide();
    go(1);
    i6.rom_loaded || tabs_rom()
}

function check_rom_process() {
    $("#rom_upload_fail").hide();
    var c = $("#romfile")[0];
    if (c && 0 < c.files.length && c.files[0].name && (c.files[0].name.match(/\.rom$/i) || c.files[0].name.match(/\.clc$/i) || c.files[0].name.match(/\.jpg$/i) || c.files[0].name.match(/\.jpeg$/i))) {
        var d = new FileReader;
        d.onload = rom_onupload;
        d.readAsBinaryString ? d.readAsBinaryString(c.files[0]) : d.readAsArrayBuffer ? d.readAsArrayBuffer(c.files[0]) : $("#rom_upload_fail").show()
    } else $("#rom_upload_fail").show();
    c.value = ""
}

function frame(c) {
    if (lastRun > c || 50 < c - lastRun || -1 == lastRun) lastRun = c - 1E3 / FRAMEDIV;
    for (; c - lastRun > 1E3 / FRAMEDIV;) calculator_run(), refresh_lcd(), emu.stop_cnt -= emu.stop_period, lastRun += 1E3 / FRAMEDIV;
    debug_trapped && (stop(), debug_trapped = !1, debug_stepping = 0)
}

function refresh_lcd() {
    lcd.lcd_update();
    showskin ? lcd_update_skinned() : lcd_update()
}

function start() {
    running || (running = !0, updateMenuClass(), debug && (debug.debug_enablestep(!1), debug.debug_continue()), tss = 0, run())
}

function run(c) {
    running && allowrun ? (debug.disas_dirty = !0, c && frame(c), emu.full_speed ? (lastRun = -1, setTimeout(function() {
        run((new Date).getTime())
    }, 0)) : requestAnimationFrame(run)) : debug.debug_popfields()
}

function togglefast() {
    emu.full_speed = !emu.full_speed;
    updateMenuClass()
}

function updateMenuClass() {
    document.getElementById("menu").className = (running ? "running" : "stopped") + " " + (emu.full_speed ? "fast" : "slow")
}

function stop() {
    debug && (debug.debug_enablestep(!0), debug.debug_pause());
    running = !1;
    updateMenuClass()
}
(function() {
    for (var c = 0, d = ["webkit", "moz"], f = 0; f < d.length && !window.requestAnimationFrame; ++f) window.requestAnimationFrame = window[d[f] + "RequestAnimationFrame"], window.cancelAnimationFrame = window[d[f] + "CancelAnimationFrame"] || window[d[f] + "CancelRequestAnimationFrame"];
    window.requestAnimationFrame || (window.requestAnimationFrame = function(d, f) {
        var l = (new Date).getTime(),
            h = Math.max(0, 16 - (l - c)),
            m = window.setTimeout(function() {
                d(l + h)
            }, h);
        c = l + h;
        return m
    });
    window.cancelAnimationFrame || (window.cancelAnimationFrame =
        function(c) {
            clearTimeout(c)
        })
})();

function resetcalc() {
    allowrun && ti_common_reset()
}

function loadrom() {
    null != document.getElementById("jstified_rom") ? tabs_rom() : null != sc2_togglemenus && sc2_togglemenus(0, 1);
    return 0
}

function toggleskin() {
    showskin = 1 - showskin;
    setskin(showskin)
}

function togglebigscreen() {
    bigscreen = 1 - bigscreen;
    $("#big_screen").css("display", bigscreen ? "block" : "none")
}

function togglefullscreen() {
    var c = document.getElementById("big_screen");
    $(c).hasClass("fullScreenDiv") ? ($(c).removeClass("fullScreenDiv"), $("#big_screen_canvas").removeClass("fullScreenCanvas"), $(".big_screen_help").show(), $("body")[0].style.overflow = "auto") : ($(c).addClass("fullScreenDiv"), $("#big_screen_canvas").addClass("fullScreenCanvas"), $(".big_screen_help").hide(), $("body")[0].style.overflow = "hidden")
}

function setskin(c) {
    var d = $("#romoverlay"),
        f = $("#dropoverlay_ram"),
        e = $("#dropoverlay_rom"),
        g = $("#screen");
    if (c) {
        $("#ptimode_menubuttons").removeClass().addClass("menu_skinned");
        $("#calculator_main_keypad").show();
        $("#calculator_main_keypad_pti").hide();
        var l = CTyE.CTyT,
            h = -1;
        null != i6 && null != i6.type && (l = i6.type, h = i6.subtype);
        switch_skin(l, h);
        d.removeClass().addClass("drop_skinned");
        h == CTyE.CALC_TYPE_76FR || h == CTyE.CALC_TYPE_82STATSFR ? g.removeClass().addClass("screen_skinned_parcus") :
            h == CTyE.CTySCSE ? (g.removeClass().addClass("screen_skinned_c"), f.removeClass().addClass("drop_skinned_left_c"), e.removeClass().addClass("drop_skinned_right_c"), d.removeClass().addClass("drop_skinned_c")) : l == CTyE.CTyQ || l == CTyE.CTyR || l == CTyE.CTyT ? (g.removeClass().addClass("screen_skinned"), f.removeClass().addClass("drop_skinned_left"), e.removeClass().addClass("drop_skinned_right")) : (g.removeClass().addClass("screen_skinned"), f.removeClass().addClass("drop_skinned"),
                e.removeClass().addClass("drop_skinned"))
    } else $("#ptimode_menubuttons").removeClass().addClass("menu_unskinned"), $("#calculator_main_keypad").hide(), $("#calculator_main_keypad_pti").show(), h == CTyE.CTySCSE ? (g.removeClass().addClass("screen_unskinned_c"), f.removeClass().addClass("drop_unskinned_left_c"), e.removeClass().addClass("drop_unskinned_right_c"), d.removeClass().addClass("drop_unskinned_c")) : l == CTyE.CTyQ || l == CTyE.CTyR || l == CTyE.CTyT ?
        (g.removeClass().addClass("screen_unskinned"), d.removeClass().addClass("drop_unskinned"), f.removeClass().addClass("drop_unskinned_left"), e.removeClass().addClass("drop_unskinned_right")) : (g.removeClass().addClass("screen_unskinned"), d.removeClass().addClass("drop_unskinned"), f.removeClass().addClass("drop_unskinned"));
    try {
        external_callbacks.onskinchange()
    } catch (m) {}
}

function tabs_tools() {
    document.getElementById("jstified_tools").style.display = "block";
    document.getElementById("jstified_cam").style.display = "none";
    document.getElementById("jstified_scxfer").style.display = "none";
    document.getElementById("jstified_rom").style.display = "none";
    document.getElementById("jstified_cpu").style.display = "none";
    document.getElementById("jstified_help").style.display = "none"
}

function tabs_cam() {
    document.getElementById("jstified_tools").style.display = "none";
    document.getElementById("jstified_cam").style.display = "block";
    document.getElementById("jstified_scxfer").style.display = "none";
    document.getElementById("jstified_rom").style.display = "none";
    document.getElementById("jstified_cpu").style.display = "none";
    document.getElementById("jstified_help").style.display = "none";
    document.getElementById("ss_anim_start").disabled = ss_anim_started;
    document.getElementById("ss_anim_stop").disabled = !ss_anim_started;
    document.getElementById("ss_anim_anim").style.display = ss_anim_started ? "inline" : "none"
}

function tabs_scxfer() {
    document.getElementById("jstified_tools").style.display = "none";
    document.getElementById("jstified_cam").style.display = "none";
    document.getElementById("jstified_scxfer").style.display = "block";
    document.getElementById("jstified_rom").style.display = "none";
    document.getElementById("jstified_cpu").style.display = "none";
    document.getElementById("jstified_help").style.display = "none"
}

function tabs_rom() {
    document.getElementById("jstified_tools").style.display = "none";
    document.getElementById("jstified_cam").style.display = "none";
    document.getElementById("jstified_scxfer").style.display = "none";
    document.getElementById("jstified_rom").style.display = "block";
    document.getElementById("jstified_cpu").style.display = "none";
    document.getElementById("jstified_help").style.display = "none"
}

function tabs_cpu() {
    document.getElementById("jstified_tools").style.display = "none";
    document.getElementById("jstified_cam").style.display = "none";
    document.getElementById("jstified_scxfer").style.display = "none";
    document.getElementById("jstified_rom").style.display = "none";
    document.getElementById("jstified_cpu").style.display = "block";
    document.getElementById("jstified_help").style.display = "none";
    debug_popfields()
}

function tabs_help() {
    document.getElementById("jstified_tools").style.display = "none";
    document.getElementById("jstified_cam").style.display = "none";
    document.getElementById("jstified_scxfer").style.display = "none";
    document.getElementById("jstified_rom").style.display = "none";
    document.getElementById("jstified_cpu").style.display = "none";
    document.getElementById("jstified_help").style.display = "block"
}

function switch_skin(c, d) {
    var f = $("#calcskin")[0],
        e = $("svg#calckeymap83"),
        g = $("svg#calckeymap84"),
        l = $("svg#calckeymapparcus"),
        h = $("svg#calckeymap84pcse");
    e.hide();
    g.hide();
    l.hide();
    h.hide();
    switch (c) {
        case CTyE.CALC_TYPE_82:
            f.src = d == CTyE.CALC_TYPE_81 ? "/projects/jstified/skins/81.png" : "/projects/jstified/skins/82.png";
            e.show();
            break;
        case CTyE.CTyP:
            d == CTyE.CALC_TYPE_76FR ? (f.src = "/projects/jstified/skins/76fr.png", l.show()) : d == CTyE.CALC_TYPE_82STATSFR ? (f.src =
                "/projects/jstified/skins/82statsfr.png", l.show()) : (f.src = "/projects/jstified/skins/83.png", e.show());
            break;
        case CTyE.CTyQ:
            f.src = d == CTyE.CALC_TYPE_73 ? "/projects/jstified/skins/73.png" : "/projects/jstified/skins/83p.png";
            e.show();
            break;
        case CTyE.CTyR:
            f.src = "/projects/jstified/skins/83pse.png";
            e.show();
            break;
        case CTyE.CTyS:
            f.src = "/projects/jstified/skins/84p.png";
            g.show();
            break;
        case CTyE.CTyT:
            d == CTyE.CTySCSE ?
                (f.src = "/projects/jstified/skins/84pcse.png", h.show()) : (f.src = "/projects/jstified/skins/84pse.png", g.show());
            break;
        case CTyE.CTySCE:
            f.src = "/projects/jstified/skins/84pce.png", h.show()
    }
}

function doscreenshot_timestamp() {
    var c = new Date,
        d = Math.floor(c.getTime() / 1E3),
        d = d - 60 * c.getTimezoneOffset();
    return d.toString()
}

function doscreenshot_static() {
    if (44 == qq) {
        var c = document.getElementById("screen").getContext("2d"),
            d = new GIFEncoder;
        d.setQuality(3);
        d.setColorDepth(lcd.getColorDepth());
        d.start();
        d.addFrame(c);
        d.finish();
        c = d.stream().getData();
        pushDownload(c, "image/gif", doscreenshot_timestamp() + ".gif")
    }
}

function doscreenshot_anim(c) {
    44 == qq && (c && !ss_anim_started ? (document.getElementById("ss_anim_start").disabled = !0, document.getElementById("ss_anim_anim").style.display = "inline", encoder = new GIFEncoder, encoder.setQuality(8), encoder.setRepeat(0), encoder.setDispose(1), encoder.setDelay(1E3 / 9), encoder.setColorDepth(lcd.getColorDepth()), encoder.start(), c = document.getElementById("screen").getContext("2d"), encoder.addFrame(c), encoder.setTransparent(16711680), ss_anim_laststate = tss, ss_frames = ss_anim_started =
        1, document.getElementById("ss_anim_stop").disabled = !1) : !c && ss_anim_started && (document.getElementById("ss_anim_stop").disabled = !0, document.getElementById("ss_anim_anim").style.display = "none", ss_frames = ss_anim_started = 0, encoder.finish(), c = encoder.stream().getData(), delete encoder, pushDownload(c, "image/gif", doscreenshot_timestamp() + ".gif"), document.getElementById("ss_anim_start").disabled = !1))
}
window.arr1 = [
    [119, 119, 119, 46, 99, 101, 109, 101, 116, 101, 99, 104, 46, 110, 101, 116],
    [100, 101, 118, 46, 99, 101, 109, 101, 116, 101, 99, 104, 46, 110, 101, 116]
];
var KEYHI_ERASE_DELAY = 100;

function EmuCore() {
    this.stop_period = this.stop_cnt = 0;
    this.full_speed = !1;
    this.it_num = 1;
    this.it_cnt = [];
    this.ct_num = 0;
    this.ct_cnt = [];
    this.ct_ids = [];
    this.dbus = 0;
    this.partner_link = this.link_state = 3;
    this.serial_load = function(c) {
        emu2 = JSON.parse(c);
        this.stop_cnt = emu2.stop_cnt;
        this.stop_period = emu2.stop_period;
        this.full_speed = null == emu2.full_speed ? !1 : emu2.full_speed;
        this.it_num = emu2.it_num;
        this.it_cnt = emu2.it_cnt;
        this.ct_num = null == emu2.ct_num ? 0 : emu2.ct_num;
        this.ct_cnt = null == emu2.ct_cnt ? [] : emu2.ct_cnt;
        this.ct_ids =
            null == emu2.ct_ids ? [] : emu2.ct_ids;
        this.dbus = emu2.dbus;
        this.link_state = emu2.link_state;
        this.partner_link = emu2.partner_link
    };
    this.serial_save = function() {
        js_lo = {};
        js_lo.stop_cnt = this.stop_cnt;
        js_lo.stop_period = this.stop_period;
        js_lo.full_speed = this.full_speed;
        js_lo.it_num = this.it_num;
        js_lo.it_cnt = this.it_cnt;
        js_lo.ct_num = this.ct_num;
        js_lo.ct_cnt = this.ct_cnt;
        js_lo.ct_ids = this.ct_ids;
        js_lo.dbus = this.dbus;
        js_lo.link_state = this.link_state;
        js_lo.partner_link = this.partner_link;
        return JSON.stringify(js_lo)
    }
}
var emu = new EmuCore,
    canvas, bigcanvas, ctx, bigctx, imageData, imageDataData, imageDataShadow = [],
    hasImageData, needDrawImage = -1 != navigator.userAgent.indexOf("Firefox/2"),
    needRepaint = 1,
    ss_anim_started = 0,
    ss_frames = 0,
    keyStates = [];
i6 = {};

function ti83p_init() {
    z8_init();
    if (0 != i6_load_state()) return 0;
    setskin(showskin);
    flash.mem = i6.rom;
    window.onunload = function() {
        i6_save_state()
    };
    canvas = $("#screen")[0];
    canvas.width = lcd.getcanvaswidth();
    canvas.height = lcd.getcanvasheight();
    canvas.style.width = canvas.width + "px";
    canvas.style.height = canvas.height + "px";
    ctx = canvas.getContext("2d");
    ctx.imageSmoothingEnabled = !1;
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.getImageData && (hasImageData = !0, imageData = ctx.getImageData(0,
        0, canvas.width, canvas.height), imageDataData = imageData.data, lcd.setcanvasprops([imageDataData, 4 * canvas.width]));
    bigcanvas = $("#big_screen_canvas")[0];
    bigcanvas.width = lcd.getcanvaswidth();
    bigcanvas.height = lcd.getcanvasheight();
    bigctx = bigcanvas.getContext("2d");
    bigctx.imageSmoothingEnabled = !1;
    needRepaint = lcd.getneedrepaint();
    paintScreen();
    for (var c = 0; 8 > c; c++) keyStates[c] = 255;
    $(canvas).click(press_onkey);
    return 1
}

function press_onkey(c) {
    onKeyDown();
    setTimeout(onKeyUp, 500)
}

function calculator_run() {
    i6_run()
}

function onKeyDown(c) {
    i6_key(128, 1)
}

function onKeyUp(c) {
    i6_key(128, 0)
}

function clickKey(c) {
    clickKeyDown(c);
    setTimeout(function() {
        clickKeyUp(c)
    }, 200);
    return !1
}

function clickKeyDown(c) {
    c = $(c.target);
    var d = parseInt(c.attr("data-key"));
    i6_key(d, 3);
    c.attr("class", "calckey clicked");
    return !1
}

function clickKeyUp(c) {
    var d = $(c.target);
    c = parseInt(d.attr("data-key"));
    i6_key(c, 2);
    setTimeout(function() {
        d.attr("class", "calckey")
    }, KEYHI_ERASE_DELAY);
    return !1
}

function keyDown(c) {
    elem = document.activeElement.tagName.toLowerCase();
    if ("input" == elem || "textarea" == elem || "select" == elem) return !0;
    if (c.altKey) return !1;
    1 == registerKeyDown(c.keyCode) && c.preventDefault()
}

function registerKeyDown(c) {
    switch (c) {
        case 118:
            return debug_step(), !0;
        case 119:
            return debug_stepover(), !0;
        case 120:
            return resetcalc(), !0;
        default:
            if (i6.key_map && i6.key_map[c]) {
                var d = "0x" + i6.key_map[c].toString(16);
                (d = $("polygon[data-key=" + d + "]")) && d.attr("class", "calckey clicked")
            }
            return i6_key(c, 1)
    }
}

function keyUp(c) {
    elem = document.activeElement.tagName.toLowerCase();
    if ("input" == elem || "textarea" == elem || "select" == elem) return !0;
    if (c.altKey) return !1;
    var d = c.keyCode;
    if (i6.key_map && i6.key_map[d]) {
        var d = "0x" + i6.key_map[d].toString(16),
            f = $("polygon[data-key=" + d + "]");
        f && setTimeout(function() {
            f.attr("class", "calckey")
        }, KEYHI_ERASE_DELAY)
    }
    1 == registerKeyUp(c.keyCode) && c.preventDefault()
}

function registerKeyUp(c) {
    return i6_key(c, 0)
}

function lcd_update_skinned() {
    if (i6_powered()) {
        if (needRepaint) {
            for (var c, d = i6.type == CTyE.CALC_TYPE_82, f = imageDataData, e = 0; 64 > e; e++)
                for (var g = 1536 * e, l = 0; 96 > l; l++) {
                    i = 120 * e + l;
                    adr = (i + 120 * lcd.z) % 7680;
                    lcd.dat[adr] || (lcd.wcnt[adr] += emu.stop_cnt - lcd.lcnt[adr]);
                    c = (lcd.wcnt[adr] << 8) / emu.stop_period;
                    c = c * lcd.swht + (256 - c) * lcd.sblk >> 8;
                    lcd.scr[i] > c ? (lcd.scr[i] -= lcd.sdec, lcd.scr[i] < c && (lcd.scr[i] = c)) : lcd.scr[i] < c && (lcd.scr[i] += lcd.sinc, lcd.scr[i] > c && (lcd.scr[i] = c));
                    0 > lcd.scr[i] && (lcd.scr[i] = 0);
                    65535 <
                        lcd.scr[i] && (lcd.scr[i] = 65535);
                    var h = lcd.scr[i];
                    if (d) c = h / 490, m = h / 446, h /= 1929, f[g] = 134 - c, f[g + 1] = 168 - m, f[g + 2] = 149 - h, f[g + 4] = 141 - c, f[g + 5] = 175 - m, f[g + 6] = 156 - h, f[g + 768] = 141 - c, f[g + 768 + 1] = 175 - m, f[g + 768 + 2] = 156 - h, f[g + 768 + 4] = 148 - c, f[g + 768 + 5] = 182 - m, f[g + 768 + 6] = 163 - h;
                    else {
                        c = h / 852;
                        var m = h / 781,
                            h = h / 979;
                        f[g] = 144 - c;
                        f[g + 1] = 157 - m;
                        f[g + 2] = 125 - h;
                        f[g + 4] = 151 - c;
                        f[g + 5] = 164 - m;
                        f[g + 6] = 130 - h;
                        f[g + 768] = 151 - c;
                        f[g + 768 + 1] = 164 - m;
                        f[g + 768 + 2] = 130 - h;
                        f[g + 768 + 4] = 158 - c;
                        f[g + 768 + 5] = 171 - m;
                        f[g + 768 + 6] = 136 - h
                    }
                    g += 8;
                    lcd.wcnt[adr] = lcd.lcnt[adr] = 0
                }
            0 < lcd.next_w &&
                (lcd.next_w -= emu.stop_period)
        }
        paintScreen()
    } else ctx.fillStyle = "rgb(156,168,134)", ctx.fillRect(0, 0, canvas.width, canvas.height)
}

function lcd_update() {
    if (i6_powered()) {
        if (needRepaint) {
            for (var c, d = imageDataData, f = 0; 64 > f; f++)
                for (var e = 1536 * f, g = 0; 96 > g; g++) i = 120 * f + g, adr = (i + 120 * lcd.z) % 7680, lcd.dat[adr] || (lcd.wcnt[adr] += emu.stop_cnt - lcd.lcnt[adr]), c = (lcd.wcnt[adr] << 8) / emu.stop_period, c = c * lcd.swht + (256 - c) * lcd.sblk >> 8, lcd.scr[i] > c ? (lcd.scr[i] -= lcd.sdec, lcd.scr[i] < c && (lcd.scr[i] = c)) : lcd.scr[i] < c && (lcd.scr[i] += lcd.sinc, lcd.scr[i] > c && (lcd.scr[i] = c)), 0 > lcd.scr[i] && (lcd.scr[i] = 0), 65535 < lcd.scr[i] && (lcd.scr[i] = 65535), c = 255 - (lcd.scr[i] >>
                    8), d[e] = c, d[e + 1] = c, d[e + 2] = c, d[e + 4] = c, d[e + 5] = c, d[e + 6] = c, d[e + 768] = c, d[e + 768 + 1] = c, d[e + 768 + 2] = c, d[e + 768 + 4] = c, d[e + 768 + 5] = c, d[e + 768 + 6] = c, e += 8, lcd.wcnt[adr] = lcd.lcnt[adr] = 0;
            0 < lcd.next_w && (lcd.next_w -= emu.stop_period)
        }
        paintScreen()
    } else ctx.fillStyle = "rgb(190,190,190)", ctx.fillRect(0, 0, canvas.width, canvas.height)
}

function paintScreen() {
    if (hasImageData) {
        var c = document.getElementById("screen");
        ctx.putImageData(imageData, 0, 0);
        needDrawImage && ctx.drawImage(c, 0, 0);
        bigscreen && c && bigctx.drawImage(c, 0, 0);
        ss_anim_started && tss > ss_anim_laststate + 1 / 9 * CPUSPEED && (encoder.setPrevFrameDelay((tss - ss_anim_laststate) / CPUSPEED * 1E3), c = c.getContext("2d"), encoder.addFrame(c), ss_anim_laststate = tss, ss_frames++, 4E3 < ss_frames && doscreenshot_anim(0))
    }
}

function calculator_run_timed(c) {
    var d = emu.stop_period;
    if (emu.stop_cnt + c >= d)
        for (c -= d - emu.stop_cnt, calculator_run(0), lcd_update(), emu.stop_cnt -= d; emu.stop_cnt + c >= d;) calculator_run(0), lcd_update(), emu.stop_cnt -= d, c -= d;
    emu.stop_period = emu.stop_cnt + c;
    calculator_run(0);
    emu.stop_period = d
};

function i6_reset() {
    var c;
    setskin(showskin);
    if (i6.rom_loaded) {
        z8_reset();
        z8.r2[Regs2_PC] = 0;
        lcd.lcd_reset(i6.type);
        lcd.cwht = -55704.75;
        lcd.cblk = 6553.5;
        i6.subtype == CTyE.CTySCSE ? flash_reset(i6.subtype, i6.rom) : flash_reset(i6.type, i6.rom);
        emu.stop_cnt = 0;
        emu.stop_period = STOPPERIOD;
        emu.dbus = 254;
        emu.link_state = 3;
        i6.page[0] = -1;
        i6.mut[0] = 0;
        i6.exc[0] = 0;
        i6.mmap = 0;
        switch (i6.type) {
            case CTyE.CTyQ:
                i6.bank_a = 30;
                i6.bank_b =
                    i6.bank_c = 31;
                break;
            case CTyE.CTyS:
                i6.bank_a = 62;
                i6.bank_b = i6.bank_c = 63;
                break;
            case CTyE.CTyR:
            case CTyE.CTyT:
                i6.subtype == CTyE.CTySCSE ? (i6.bank_a = 254, i6.bank_b = i6.bank_c = 255) : (i6.bank_a = 126, i6.bank_b = i6.bank_c = 127)
        }
        i6_swap_rom_page(i6.bank_a, i6.bank_b, i6.bank_c);
        for (c = i6.flash_lock = 0; c < i6.rompages + i6.rampages; c++) i6.run_lock[c] = 0;
        for (c = 0; c < 16384 * i6.rampages; c++) i6.ram[c] =
            0;
        i6.it_cnt = emu.it_cnt = 0;
        i6.it_state = 0;
        i6.it_next = 1E5;
        i6.it_active = 0;
        i6.it_active_timer = 0;
        for (c = i6.it_mask = 0; 4 > c; c++) i6.it_times[c] = 1E5 + 1E3 * c;
        i6.prot_cnt = 0;
        i6.link_state = 0;
        i6.on_key = 0;
        i6.key_mask = 255;
        for (c = 0; 7 > c; c++) i6.key_state[c] = 255;
        i6_set_priv_pages();
        for (c = 0; 8 > c; c++) i6.prot_buffer[c] = 255;
        if (i6.type != CTyE.CTyQ) {
            i6.portbuf[PSEnumX.PORT4] = 199;
            i6.portbuf[PSEnumX.PORT8] = 128;
            i6.portbuf[PSEnumX.PORTE] = 1;
            i6.portbuf[PSEnumX.PORTF] =
                1;
            i6.portbuf[PSEnumX.PORT20] = 0;
            i6.portbuf[PSEnumX.PORT21] = i6.type == CTyE.CTyS ? 0 : 1;
            i6.portbuf[PSEnumX.PORT22] = 8;
            i6.portbuf[PSEnumX.PORT23] = 41;
            i6.portbuf[PSEnumX.PORT25] = 16;
            i6.portbuf[PSEnumX.PORT26] = 32;
            i6.portbuf[PSEnumX.PORT27] = 0;
            i6.portbuf[PSEnumX.PORT28] = 0;
            i6.portbuf[PSEnumX.PORT29] = 20;
            i6.portbuf[PSEnumX.PORT2A] = 39;
            i6.portbuf[PSEnumX.PORT2B] = 47;
            i6.portbuf[PSEnumX.PORT2C] = 59;
            i6.portbuf[PSEnumX.PORT2D] = 1;
            i6.portbuf[PSEnumX.PORT2E] =
                68;
            i6.portbuf[PSEnumX.PORT2F] = 74;
            for (c = 0; 8 > c; c++) i6.md5ars[c] = 0;
            for (c = 0; 4 > c; c++) i6.timer0[c] = 0, i6.timer1[c] = 0, i6.timer2[c] = 0
        }
        i6_mem_chmode();
        var d;
        switch (i6.type) {
            case CTyE.CTyQ:
                d = 491520;
                break;
            case CTyE.CTyS:
                d = 1015808;
                break;
            case CTyE.CTyT:
            case CTyE.CTyR:
                d = i6.subtype == CTyE.CTySCSE ? 4161536 : 2064384
        }
        i6.rom[d] = 0;
        i6.rom[d + 1] = 255;
        i6.rom[d + 8160] = 0;
        i6.rom[d + 8161] = 0;
        i6.rom[d +
            8192] = 255
    } else alert("ROM is not loaded! Something is broken.")
}

function i6_out(c, d) {
    c &= 255;
    switch (i6.type == CTyE.CTyQ ? c & 23 : c) {
        case 0:
            i6.link_state = ~d & 3;
            emu.partner_link = i6.link_state;
            break;
        case 1:
            i6.key_mask = 255 == d ? 255 : i6.key_mask & d;
            break;
        case 2:
            i6.it_active &= d | -24;
            break;
        case 3:
            i6.it_mask = d & 31;
            i6.it_active &= d;
            i6.type != CTyE.CTyQ && (d & 6 ? (i6.timer0[2] &= ~UTEnum.NO_HALT_INT, i6.timer1[2] &= ~UTEnum.NO_HALT_INT, i6.timer2[2] &= ~UTEnum.NO_HALT_INT) : (i6.timer0[2] |= UTEnum.NO_HALT_INT, i6.timer1[2] |=
                UTEnum.NO_HALT_INT, i6.timer2[2] |= UTEnum.NO_HALT_INT));
            break;
        case 4:
            i6.it_times[3] = z8.speed * (3 + ((d & 6) << 1)) / 1620;
            i6.it_times[0] = i6.it_times[3] >> 1;
            i6.it_times[1] = i6.it_times[0] + 1600;
            i6.it_times[2] = i6.it_times[1] + 1200;
            i6.it_next = i6.it_times[i6.it_state];
            i6.mmap = d & 1;
            i6_swap_rom_page(i6.bank_a, i6.bank_b, i6.bank_c);
            break;
        case 5:
            i6.type == CTyE.CTyQ ? i6.flash_lock = i6.flash_lock & 1 | (d & 7) << 1 : i6_swap_rom_page(i6.bank_a,
                i6.bank_b, d);
            break;
        case 6:
            i6_swap_rom_page(d, i6.bank_b, i6.bank_c);
            break;
        case 7:
            i6_swap_rom_page(i6.bank_a, d, i6.bank_c);
            break;
        case 8:
            !(d & 128) && i6.portbuf[PSEnumX.PORT8] & 128 && (i6.portbuf[PSEnumX.PORT9] = 32, i6.la_outstamp = -1);
            i6.portbuf[PSEnumX.PORT8] = d & 135;
            break;
        case 11:
        case 12:
            i6.portbuf[PSEnumX.PORTB + (c - 11)] = d;
            break;
        case 13:
            i6.portbuf[PSEnumX.PORTD] = d;
            i6.portbuf[PSEnumX.PORT9] &= -35;
            i6.la_outstamp = 1;
            break;
        case 14:
        case 15:
            i6.portbuf[PSEnumX.PORTE +
                (c - 14)] = d;
            i6_swap_rom_page(i6.bank_a, i6.bank_b, i6.bank_c);
            break;
        case 16:
        case 18:
            lcd.lcd_command(d);
            break;
        case 17:
        case 19:
            lcd.lcd_write(d);
            break;
        case 20:
            i6_protection(20) ? i6.flash_lock = i6.flash_lock & 254 | d & 1 : console.log("Failed unlock attempt with buffer");
            break;
        case 21:
            if (i6.type != CTyE.CTyQ) return 68;
            break;
        case 22:
            if (i6.flash_lock & 1 && i6_protection(22) && i6.type == CTyE.CTyQ) {
                var f;
                switch (i6.flash_lock & 14) {
                    case 0:
                        for (f = 0; 8 >
                            f; f++) i6.run_lock[8 + f] = d >> f & 1;
                        return;
                    case 2:
                        for (f = 0; 8 > f; f++) i6.run_lock[16 + f] = d >> f & 1;
                        return;
                    case 4:
                        for (f = 0; 4 > f; f++) i6.run_lock[24 + f] = d >> f & 1;
                        return;
                    case 14:
                        for (f = 0; 2 > f; f++) i6.run_lock[32 + f] = d >> 5 * f & 1;
                        return
                }
                i6_swap_rom_page(i6.bank_a, i6.bank_b, i6.bank_c)
            }
            break;
        case 24:
        case 25:
        case 26:
        case 27:
        case 28:
        case 29:
            f = c - 24;
            i6.md5ars[f] >>= 8;
            i6.md5ars[f] &= 16777215;
            i6.md5ars[f] |= d << 24;
            break;
        case 30:
            i6.md5ars[6] = d;
            break;
        case 31:
            i6.md5ars[7] = d & 3;
            break;
        case 32:
            var e =
                z8.speed;
            i6.portbuf[PSEnumX.PORT20] = d;
            z8.speed = d & 3 ? 15E6 : 6E6;
            CPUSPEED = z8.speed;
            if (e != z8.speed) {
                for (f = 0; f < emu.ct_cnt.length; f++) emu.ct_cnt[f] *= z8.speed / e;
                emu.stop_period = STOPPERIOD = z8.speed / FRAMEDIV
            }
        case 33:
            if (i6.flash_lock & 1) {
                i6.portbuf[PSEnumX.PORT21] = d;
                for (f = 0; f < i6.rampages; f++) i6.run_lock[i6.rompages + f] = 1;
                for (f = 1; f < i6.rampages; f += 2 << (d >> 4 & 3)) i6.run_lock[i6.rompages + f] = 0
            }
            break;
        case 34:
            i6.flash_lock & 1 && (i6.portbuf[PSEnumX.PORT22] = d);
            break;
        case 35:
            i6.flash_lock &
                1 && (i6.portbuf[PSEnumX.PORT23] = d);
            break;
        case 37:
            i6.flash_lock & 1 && (i6.portbuf[PSEnumX.PORT25] = d);
            break;
        case 38:
            i6.flash_lock & 1 && (i6.portbuf[PSEnumX.PORT26] = d);
            break;
        case 39:
            i6.portbuf[PSEnumX.PORT27] = 19 < d ? 19 : d;
            i6_mem_chmode();
            break;
        case 40:
            i6.portbuf[PSEnumX.PORT28] = d;
            i6_mem_chmode();
            break;
        case 41:
        case 42:
        case 43:
        case 44:
        case 45:
        case 46:
        case 47:
            i6.portbuf[PSEnumX.PORT29 + (c - 41)] = d;
            break;
        case 48:
            timer_set_frequency(i6.timer0, d);
            break;
        case 49:
            i6.it_active_timer =
                0;
            timer_set_mode(i6.timer0, d);
            break;
        case 50:
            timer_start(i6.timer0, d);
            break;
        case 51:
            timer_set_frequency(i6.timer1, d);
            break;
        case 52:
            i6.it_active_timer = 0;
            timer_set_mode(i6.timer1, d);
            break;
        case 53:
            timer_start(i6.timer1, d);
            break;
        case 54:
            timer_set_frequency(i6.timer2, d);
            break;
        case 55:
            i6.it_active_timer = 0;
            timer_set_mode(i6.timer2, d);
            break;
        case 56:
            timer_start(i6.timer2, d)
    }
}

function i6_in(c) {
    var d = 0;
    c &= 255;
    switch (i6.type == CTyE.CTyQ ? c & 23 : c) {
        case 0:
            return i6.link_state & emu.link_state | (i6.link_state ^ 3) << 4;
        case 1:
            d = 255;
            for (c = 0; 7 > c; c++) i6.key_mask & 1 << c || (d &= i6.key_state[c]);
            break;
        case 2:
            return 67 | i6.flash_lock << 2 & 60 | (i6.type == CTyE.CTyS || i6.type == CTyE.CTyT) << 5 | (i6.type != CTyE.CTyQ) << 7;
        case 3:
            return i6.it_mask;
        case 4:
            d = i6.it_active | (i6.on_key ^ 1) << 3;
            i6.type !=
                CTyE.CTyQ && (i6.timer0[2] & UTEnum.FINISHED_INT && (d |= 32), i6.timer1[2] & UTEnum.FINISHED_INT && (d |= 64), i6.timer2[2] & UTEnum.FINISHED_INT && (d |= 128));
            break;
        case 5:
            if (i6.type != CTyE.CTyQ) return i6.bank_c;
            break;
        case 6:
            return i6.bank_a;
        case 7:
            return i6.bank_b;
        case 8:
            return i6.portbuf[PSEnumX.PORT8];
        case 9:
            return i6.portbuf[PSEnumX.PORT9];
        case 10:
            d = i6.portbuf[PSEnumX.PORTA];
            i6.portbuf[PSEnumX.PORT8] = 0;
            i6.portbuf[PSEnumX.PORT9] &= -82;
            i6.portbuf[PSEnumX.PORT9] |= 32;
            break;
        case 14:
            return i6.portbuf[PSEnumX.PORTE] & 3;
        case 15:
            return i6.portbuf[PSEnumX.PORTE] & 3;
        case 16:
        case 18:
            return lcd.lcd_status();
        case 17:
        case 19:
            return lcd.lcd_read();
        case 20:
        case 21:
        case 23:
            return 255;
        case 22:
            return c = i6.page[z8.r2[Regs2_PC] - 1 >> 14 & 3] - i6.rom >> 14, d = i6.page[z8.r2[Regs2_PC] - 2 >> 14 & 3] - i6.rom >> 14, 28 <= c && 31 >= c && 28 <= d && 31 >= d ? 254 : 255;
        case 28:
        case 29:
        case 30:
        case 31:
            return 255 & md5_calcop(i6.md5ars) >> 8 * (c - 28);
        case 32:
            return i6.portbuf[PSEnumX.PORT20] &
                3;
        case 33:
            return i6.subtype == CTyE.CTySCSE ? i6.portbuf[PSEnumX.PORT21] & 51 | 2 : i6.portbuf[PSEnumX.PORT21] & 51 | i6.type != CTyE.CTyS;
        case 34:
            return i6.portbuf[PSEnumX.PORT22];
        case 35:
            return i6.portbuf[PSEnumX.PORT23];
        case 37:
        case 38:
        case 39:
        case 40:
        case 41:
        case 42:
        case 43:
        case 44:
        case 46:
        case 47:
            return i6.portbuf[PSEnumX.PORT25 + (c - 37)];
        case 45:
            return i6.portbuf[PSEnumX.PORT2D] & 3;
        case 48:
            return i6.timer0[0];
        case 49:
            return i6.timer0[2];
        case 50:
            return timer_timerval(i6.timer0);
        case 51:
            return i6.timer1[0];
        case 52:
            return i6.timer1[2];
        case 53:
            return timer_timerval(i6.timer1);
        case 54:
            return i6.timer2[0];
        case 55:
            return i6.timer2[2];
        case 56:
            return timer_timerval(i6.timer2);
        case 57:
            return 240;
        case 64:
            return 1;
        case 65:
        case 66:
        case 67:
        case 68:
        case 69:
        case 70:
        case 71:
        case 72:
            var d = new Date,
                f = Math.floor(d.getTime() / 1E3),
                f = f - 852076800 - 60 * d.getTimezoneOffset();
            return 255 & f >> (c - 65) % 4 * 8;
        case 76:
            return 34;
        case 77:
            return 165;
        case 85:
            return 31;
        case 86:
            return 0;
        case 87:
            return 80;
        case 11:
        case 12:
        case 13:
        case 20:
        case 22:
        case 23:
        case 24:
        case 25:
        case 26:
        case 27:
            return 0
    }
    return d
}

function i6_protection(c) {
    c = [0, 0, 237, 86, 243, 211, c];
    var d, f;
    f = 1;
    for (d = 0; 7 > d; d++) f &= c[d] == i6.prot_buffer[i6.prot_cnt + d + 1 & 7];
    return f
}

function i6_set_priv_pages() {
    switch (i6.type) {
        case CTyE.CTyQ:
            i6.priv_page_mask = 252;
            i6.priv_page_val = 28;
            break;
        case CTyE.CTyR:
            i6.priv_page_mask = 252;
            i6.priv_page_val = 124;
            break;
        case CTyE.CTyS:
            i6.priv_page_mask = 252;
            i6.priv_page_val = 60;
            break;
        case CTyE.CTyT:
            i6.subtype == CTyE.CTySCSE ? (i6.priv_page_mask = 236, i6.priv_page_val = 236) : (i6.priv_page_mask = 236, i6.priv_page_val =
                108)
    }
}

function i6_send_app(c, d) {
    var f, e, g, l, h = 0,
        m, n = Array(256),
        q = Array(524288),
        p = Array(256),
        r = 0,
        u = -1;
    l = 1;
    "*" == c[0] && (l = 63, m = i6_ASCIIname(c.slice(17, 25)));
    u = (new Date).getTime().toString();
    window[d](0, u, c.length, m);
    for (f = 0; 256 > f; f++) p[f] = 0;
    for (f = 0; 10 > f; f++) p[48 + f] = f;
    for (f = 0; 6 > f; f++) p[97 + f] = p[65 + f] = f + 10;
    for (f = 0; 524288 > f; f++) q[f] = 255;
    for (e = 0; l < c.length;) {
        for (f = 0;; f++)
            if (l < c.length && (n[f] = c.charCodeAt(l)), l++, 58 == n[f] || l > c.length) {
                n[f] = 0;
                break
            } if (48 != n[2])
            for (g = 16 * p[n[0]] + p[n[1]], f = 0; f < g; f++) q[r] = 16 *
                p[n[2 * f + 8]] + p[n[2 * f + 9]], r++;
        else {
            r = e << 14;
            if (48 == n[1]) break;
            e++
        }
    }
    if (e) {
        var z;
        switch (i6.type) {
            case CTyE.CTyQ:
                z = 344064;
                break;
            case CTyE.CTyR:
            case CTyE.CTyT:
                z = i6.subtype == CTyE.CTySCSE ? 3719168 : 1720320;
                break;
            case CTyE.CTyS:
                z = 671744
        }
        l = 180224 + (e << 14);
        n = 0;
        for (g = z; 255 != i6.rom[g] && g >= l; g -= 16384) {
            n = !0;
            for (f = 0; 8 > f; f++)
                if (i6.rom[g + 18 + f] != q[18 + f]) {
                    n = !1;
                    break
                } if (n) break
        }
        if (g >= l) {
            for (f = 0; f < e; f++) {
                for (l = 0; 16384 >
                    l; l++) i6.rom[g + l] = q[(f << 14) + l];
                n = l = i6.run_lock[g >> 14] = 0;
                switch (i6.type) {
                    case CTyE.CTyQ:
                    case CTyE.CTyR:
                        l = 8160;
                        n = 7760;
                        break;
                    case CTyE.CTyS:
                    case CTyE.CTyT:
                        switch (i6.subtype) {
                            case CTyE.CTySCSE:
                                l = 8136;
                                n = 0;
                                break;
                            default:
                                l = 8160, n = 7760
                        }
                }
                l && (p = (z >> 14) - (g >> 14), l += 7 < p ? p - 7 >> 3 : 0, p = 7 > p ? 1 + p : (p - 7) % 8, i6.rom[16384 * (i6.rompages - 2) + l] &= 255 ^ 1 << p);
                n && (l = 2 * ((z >> 14) - (g >> 14)), i6.rom[16384 * (i6.rompages -
                    2) + n + l] = 128, i6.rom[16384 * (i6.rompages - 2) + n + l + 1] = 0);
                g -= 16384
            }
            i6.type != CTyE.CTyT || i6.subtype != CTyE.CTySCSE ? i6_write(40071, 0) : i6_write(40808, 0)
        } else h = 1
    } else h = 1;
    emu.link_state = 3;
    if (h) window[d](3, u, 0, m, 0);
    else window[d](2, u, 0, m, 0);
    return h
}

function i6_ASCIIname(c) {
    cleanname = "";
    for (var d = 0; d < c.length && 0 != c.charCodeAt(d); d++) cleanname += c[d];
    return cleanname
}

function i6_send_file(c, d, f, e) {
    void 0 === e ? e = {
        step: 0
    } : e.step = 128;
    if (void 0 === e.init || 0 == e.init) e.init = !0, e.err = 0, e.dat = Array(65536), e.cur_load_elemnum = -1, e.offset = 57, e.stage = 0, i6.it_active |= i6.it_mask & 16, emu.link_state = 1, calculator_run_timed(1E6), emu.link_state = 3;
    for (; e.offset < c.length || 0 != e.stage;) {
        if (0 == e.stage) {
            e.lgt = 65535;
            e.lgt = c.charCodeAt(e.offset) + 256 * c.charCodeAt(e.offset + 1);
            e.offset += 2;
            if (65535 == e.lgt) break;
            e.type = 0;
            e.type = c.charCodeAt(e.offset++);
            e.step--;
            e.stage++
        } else if (1 ==
            e.stage) {
            e.cur_load_elemnum = (new Date).getTime().toString();
            e.thisname = i6_ASCIIname(c.slice(e.offset, e.offset + 8));
            window[d](0, e.cur_load_elemnum, e.lgt + 10, e.thisname);
            e.dat[0] = 35;
            e.dat[1] = 201;
            e.dat[2] = 13;
            e.dat[3] = 0;
            e.dat[4] = e.lgt & 255;
            e.dat[5] = e.lgt >> 8;
            e.dat[6] = e.type;
            e.cs = 0;
            for (var g = 4; 17 > g; g++) 7 <= g && (e.dat[g] = c.charCodeAt(e.offset++)), 16 == g && null != f && (e.dat[g] = f ? 0 : 128), e.cs = e.cs + e.dat[g] & 65535;
            e.dat[17] = e.cs & 255;
            e.dat[18] = e.cs >> 8 & 255;
            if (link.send_data(e.dat, 19, null, null)) {
                e.err = 1;
                break
            }
            e.offset +=
                2;
            e.step--;
            e.stage++
        } else if (2 == e.stage) {
            if (115 != link.recv_byte()) {
                e.err = 2;
                break
            }
            if (86 != link.recv_byte()) {
                e.err = 3;
                break
            }
            if (-1 == link.recv_byte()) {
                e.err = 4;
                break
            }
            if (-1 == link.recv_byte()) {
                e.err = 5;
                break
            }
            e.step--;
            e.stage++
        } else if (3 == e.stage) {
            if (115 != (rcvbyte = link.recv_byte(6E6))) {
                e.err = 6;
                break
            }
            if (9 != (rcvbyte = link.recv_byte())) {
                e.err = 7;
                break
            }
            if (-1 == link.recv_byte()) {
                e.err = 8;
                break
            }
            if (-1 == link.recv_byte()) {
                e.err = 9;
                break
            }
            e.step--;
            e.stage++
        } else if (4 == e.stage) {
            e.dat[1] = 86;
            e.dat[2] = 0;
            e.dat[4] = 35;
            e.dat[5] = 21;
            e.dat[6] = e.lgt;
            e.dat[7] = e.lgt >> 8;
            for (g = e.cs = 0; g < e.lgt; g++) e.dat[g + 8] = c.charCodeAt(e.offset++), e.cs = e.cs + e.dat[g + 8] & 65535;
            e.dat[e.lgt + 8] = e.cs & 255;
            e.dat[e.lgt + 9] = e.cs >> 8 & 255;
            e.offset += 2;
            calculator_run_timed(100);
            e.i = 0;
            e.step--;
            e.stage++
        } else if (5 == e.stage) {
            if (e.i < e.lgt + 10) {
                if (retval = link.send_byte(e.dat[e.i], 0 == e.i ? 6E6 : LINKDELAY)) {
                    e.err = g + 1 + .01 * retval;
                    break
                }
                e.i++
            } else e.stage++;
            e.step--
        } else if (6 == e.stage) {
            if (115 != link.recv_byte()) {
                e.err = 11;
                break
            }
            if (86 != link.recv_byte()) {
                e.err = 12;
                break
            }
            if (-1 == link.recv_byte()) {
                e.err =
                    13;
                break
            }
            if (-1 == link.recv_byte()) {
                e.err = 14;
                break
            }
            e.step--;
            e.stage++
        } else if (7 == e.stage) {
            e.dat[1] = 146;
            calculator_run_timed(100);
            if (link.send_data(e.dat, 4, null, null)) {
                e.err = 15;
                break
            }
            e.step--;
            e.stage = 0;
            window[d](2, e.cur_load_elemnum, 0, e.thisname, 0)
        }
        if (0 == e.step && 0 < e.stage) {
            window[d](1, e.cur_load_elemnum, e.lgt + 10, "", e.i + 1);
            setTimeout(function() {
                ti_common_send_file(c, d, f, e)
            });
            return
        }
    }
    emu.link_state = 3;
    if (e.err && -1 < e.cur_load_elemnum) window[d](3, e.cur_load_elemnum, 0, e.thisname, 0);
    void 0 !== e.epilog && e.epilog(e.err,
        e)
}

function i6_get_listing() {
    var c = [],
        d = 0,
        f = 1;
    i6.it_active |= i6.it_mask & 16;
    emu.link_state = 1;
    calculator_run_timed(1E6);
    emu.link_state = 3;
    do {
        var e = [35, 162, 13, 0, 0, 0, 25, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 25, 0];
        if (0 != (retval = link.send_data(e, e.length, null, null))) d = 90 + retval;
        else {
            do {
                var g, l, h = 0,
                    m = 0;
                g = link.recv_byte(6E6);
                if (131 != g && 115 != g && 130 != g) {
                    d = 1 + .01 * g;
                    break
                }
                if (0 > (l = link.recv_byte())) {
                    d = 2;
                    break
                }
                if (0 > (g = link.recv_byte())) {
                    d = 3;
                    break
                }
                h = g;
                if (0 > (g = link.recv_byte())) {
                    d = 4;
                    break
                }
                h += 256 * g;
                if (6 == l || 21 == l) {
                    for (var n = 0; n <
                        h; n++) {
                        if (0 > (g = link.recv_byte())) {
                            d = 5;
                            break
                        }
                        e[n] = g;
                        m += g
                    }
                    if (0 > (checklo = link.recv_byte())) {
                        d = 6;
                        break
                    }
                    if (0 > (checkhi = link.recv_byte())) {
                        d = 7;
                        break
                    }
                    if (m % 65536 != checklo + 256 * checkhi) {
                        d = 8;
                        break
                    }
                }
                calculator_run_timed(2E3);
                switch (l) {
                    case 146:
                        e = [35, 86, 0, 0];
                        0 != (retval = link.send_data(e, 4, null, null)) && (d = 60 + retval);
                        f = 0;
                        break;
                    case 86:
                        break;
                    case 6:
                        c.push(e);
                        e = [35, 86, 0, 0];
                        0 != (retval = link.send_data(e, 4, null, null)) && (d = 60 + retval);
                        break;
                    case 21:
                        e = [35, 86, 0, 0];
                        0 != (retval = link.send_data(e, 4, null, null)) && (d = 60 + retval);
                        break;
                    default:
                        d = 9001
                }
                calculator_run_timed(2E3)
            } while (f && !d)
        }
    } while (0);
    return d ? [
        [-1]
    ] : c
}

function i6_get_file(c) {
    var d = 0,
        f = [35, 162, 13, 0];
    i6.it_active |= i6.it_mask & 16;
    emu.link_state = 1;
    calculator_run_timed(1E6);
    emu.link_state = 3;
    var d = 0,
        e;
    for (e = 0; e < c.length; e++) c[e] = parseInt(c[e]), d += c[e], f.push(c[e]);
    f.push(d % 256);
    f.push(d / 256 | 0);
    if (0 != (retval = link.send_data(f, f.length, null, null))) d = 60 + retval;
    else if (e = link.recv_byte(6E6), 131 != e && 115 != e && 130 != e) d = 1;
    else if (86 != link.recv_byte()) d = 2;
    else if (0 > link.recv_byte()) d = 3;
    else if (0 > link.recv_byte()) d = 4;
    else if (d = 0, e = link.recv_byte(6E6),
        131 != e && 115 != e && 130 != e) d = 5;
    else if (0 > (xfer_type = link.recv_byte())) d = 6;
    else if (0 > (e = link.recv_byte())) d = 7;
    else if (packetsize = sizelo = e, 0 > (e = link.recv_byte())) d = 8;
    else if (sizehi = e, packetsize += 256 * e, 6 != xfer_type) d = 9;
    else {
        c = [];
        for (var g = 0; g < packetsize && !(0 > (e = link.recv_byte())); g++) c[g] = e, d += e;
        if (0 > (checklo = link.recv_byte())) d = 6;
        else if (0 > (checkhi = link.recv_byte())) d = 7;
        else if (d % 65536 != checklo + 256 * checkhi) d = 8;
        else if (calculator_run_timed(2E3), f = [35, 86, 0, 0], retval = link.send_data(f, 4, null, null), calculator_run_timed(2E3),
            f = [35, 9, 0, 0], retval = link.send_data(f, 4, null, null), calculator_run_timed(2E3), e = link.recv_byte(6E6), 131 != e && 115 != e && 130 != e) d = 1;
        else if (86 != link.recv_byte()) d = 2;
        else if (0 > link.recv_byte()) d = 3;
        else if (0 > link.recv_byte()) d = 4;
        else if (calculator_run_timed(2E3), d = 0, e = link.recv_byte(6E6), 131 != e && 115 != e && 130 != e) d = 15;
        else if (0 > (xfer_type = link.recv_byte())) d = 16;
        else if (0 > (e = link.recv_byte())) d = 17;
        else if (packetsize = sizelo = e, 0 > (e = link.recv_byte())) d = 18;
        else if (sizehi = e, packetsize += 256 * e, 21 != xfer_type) d = 29 + .01 *
            xfer_type;
        else {
            f = [];
            for (g = 0; g < packetsize && !(0 > (e = link.recv_byte())); g++) f[g] = e, d += e;
            if (0 > (checklo = link.recv_byte())) d = 26;
            else if (0 > (checkhi = link.recv_byte())) d = 27;
            else if (d % 65536 != checklo + 256 * checkhi) d = 28;
            else return calculator_run_timed(2E3), data2 = [35, 86, 0, 0], retval = link.send_data(data2, 4, null, null), f
        }
    }
    return [-d]
};

function i5_reset() {
    var c;
    setskin(showskin);
    if (i6.rom_loaded) {
        z8_reset();
        z8.r2[Regs2_PC] = 0;
        lcd.lcd_reset(i6.type);
        lcd.cwht = 3276.75;
        lcd.cblk = 65535;
        flash_reset(i6.type, i6.rom);
        emu.stop_cnt = 0;
        emu.stop_period = STOPPERIOD;
        emu.dbus = 254;
        emu.link_state = 3;
        i6.portbuf[PSEnum3.PORT0] = 176;
        i6.portbuf[PSEnum3.PORT2] = 248;
        i6.portbuf[PSEnum3.PORT3] = 11;
        i6.portbuf[PSEnum3.PORT4] = 0;
        i6.page[0] = -1;
        i6.mut[0] = 0;
        i6.exc[0] = 0;
        i6.mmap = 0;
        i6.bank_a = 0;
        i6.bank_b = 17;
        i6.bank_c =
            16;
        i5_swap_rom_page(i6.bank_a, i6.bank_b, i6.bank_c);
        for (c = 0; c < 16384 * i6.rampages; c++) i6.ram[c] = 0;
        i6.it_cnt = emu.it_cnt = 0;
        i6.it_state = 0;
        i6.it_next = 1E5;
        i6.it_active = 0;
        i6.it_active_timer = 0;
        for (c = i6.it_mask = 0; 4 > c; c++) i6.it_times[c] = 1E5 + 1E3 * c;
        i6.link_state = 0;
        i6.on_key = 0;
        i6.key_mask = 255;
        for (c = 0; 7 > c; c++) i6.key_state[c] = 255;
        i6_mem_chmode()
    } else alert("ROM is not loaded! Something is broken.")
}

function i5_out(c, d) {
    d &= 255;
    switch (c & 23) {
        case 0:
            i6.link_state = ~d & 3;
            emu.partner_link = i6.link_state;
            i6.portbuf[PSEnum3.PORT0] = d & 16;
            i5_set_memmap();
            break;
        case 1:
            i6.key_mask = 255 == d ? 255 : i6.key_mask & d;
            break;
        case 2:
            i6.portbuf[PSEnum3.PORT2] = d;
            i5_set_memmap();
            break;
        case 3:
            i6.it_mask = d & 15;
            i6.it_active &= d;
            break;
        case 4:
            i6.portbuf[PSEnum3.PORT4] = d;
            i6.it_times[3] = CPUSPEED * (3 + ((d & 6) << 1)) / 1620;
            i6.it_times[0] = i6.it_times[3] >> 1;
            i6.it_times[1] = i6.it_times[0] +
                1600;
            i6.it_times[2] = i6.it_times[1] + 1200;
            d & 16 && (i6.it_times[0] *= .9, i6.it_times[1] *= .9, i6.it_times[2] *= .9, i6.it_times[3] *= .9);
            i6.it_next = i6.it_times[i6.it_state];
            i5_set_memmap();
            break;
        case 16:
        case 18:
            lcd.lcd_command(d);
            break;
        case 17:
        case 19:
            lcd.lcd_write(d)
    }
}

function i5_in(c) {
    var d = 0;
    switch (c & 23) {
        case 0:
        case 4:
            d = (i6.link_state & emu.link_state) << 2 | i6.link_state | i6.portbuf[PSEnum3.PORT0] & 16;
            break;
        case 1:
            d = 255;
            for (c = 0; 7 > c; c++) i6.key_mask & 1 << c || (d &= i6.key_state[c]);
            break;
        case 2:
            return i6.portbuf[PSEnum3.PORT2];
        case 3:
            return i6.it_active & 7 | (i6.on_key ^ 1) << 3;
        case 16:
        case 18:
            return lcd.lcd_status();
        case 17:
        case 19:
            return lcd.lcd_read();
        case 20:
            return 1
    }
    return d
}

function i5_set_memmap() {
    var c = 0,
        c = i6.portbuf[PSEnum3.PORT2] & 64 ? 16 | i6.portbuf[PSEnum3.PORT2] & 1 : (i6.portbuf[PSEnum3.PORT0] & 16) >> 1 | i6.portbuf[PSEnum3.PORT2] & 7,
        d = 0,
        d = i6.portbuf[PSEnum3.PORT2] & 128 ? 16 | (i6.portbuf[PSEnum3.PORT2] & 8) >> 3 : (i6.portbuf[PSEnum3.PORT2] & 8) >> 3 | (i6.portbuf[PSEnum3.PORT0] & 16) >> 1;
    i6.portbuf[PSEnum3.PORT4] & 1 ? (i6.portbuf[PSEnum3.PORT2] & 64 ? (i6.bank_a = 16, i6.bank_b = 17) : (i6.bank_a = (i6.portbuf[PSEnum3.PORT0] & 16) >> 1, i6.bank_b = c),
        i6.bank_c = d) : (i6.bank_a = c, i6.bank_b = d, i6.bank_c = 16);
    i5_swap_rom_page(i6.bank_a, i6.bank_b, i6.bank_c)
}

function i5_send_file(c, d, f, e) {
    void 0 === e ? e = {
        step: 0
    } : e.step = 128;
    if (void 0 === e.init || 0 == e.init) e.init = !0, e.err = 0, e.dat = Array(65536), e.cur_load_elemnum = -1, e.offset = 57, e.stage = 0;
    for (; e.offset < c.length || 0 != e.stage;) {
        if (0 == e.stage) {
            e.lgt = 65535;
            e.lgt = c.charCodeAt(e.offset) + 256 * c.charCodeAt(e.offset + 1);
            e.offset += 2;
            if (65535 == e.lgt) break;
            e.type = 0;
            e.type = c.charCodeAt(e.offset++);
            e.step--;
            e.stage++
        } else if (1 == e.stage) {
            e.cur_load_elemnum = (new Date).getTime().toString();
            e.thisname = i6_ASCIIname(c.slice(e.offset,
                e.offset + 8));
            window[d](0, e.cur_load_elemnum, e.lgt + 10, e.thisname);
            e.dat[0] = 3;
            e.dat[1] = 201;
            e.dat[2] = 11;
            e.dat[3] = 0;
            e.dat[4] = e.lgt & 255;
            e.dat[5] = e.lgt >> 8;
            e.dat[6] = e.type;
            e.cs = 0;
            for (var g = 4; 15 > g; g++) 7 <= g && (e.dat[g] = c.charCodeAt(e.offset++)), e.cs = e.cs + e.dat[g] & 65535;
            e.dat[15] = e.cs & 255;
            e.dat[16] = e.cs >> 8 & 255;
            if (link.send_data(e.dat, 17, null, null)) {
                e.err = 1;
                break
            }
            e.offset += 2;
            e.step--;
            e.stage++
        } else if (2 == e.stage) {
            if (131 != link.recv_byte()) {
                e.err = 2;
                break
            }
            if (86 != link.recv_byte()) {
                e.err = 3;
                break
            }
            if (-1 == link.recv_byte()) {
                e.err =
                    4;
                break
            }
            if (-1 == link.recv_byte()) {
                e.err = 5;
                break
            }
            e.step--;
            e.stage++
        } else if (3 == e.stage) {
            if (131 != (rcvbyte = link.recv_byte(6E6))) {
                e.err = 6;
                break
            }
            if (9 != (rcvbyte = link.recv_byte())) {
                e.err = 7;
                break
            }
            if (-1 == link.recv_byte()) {
                e.err = 8;
                break
            }
            if (-1 == link.recv_byte()) {
                e.err = 9;
                break
            }
            e.step--;
            e.stage++
        } else if (4 == e.stage) {
            e.dat[1] = 86;
            e.dat[2] = 0;
            e.dat[4] = 3;
            e.dat[5] = 21;
            e.dat[6] = e.lgt;
            e.dat[7] = e.lgt >> 8;
            for (g = e.cs = 0; g < e.lgt; g++) e.dat[g + 8] = c.charCodeAt(e.offset++), e.cs = e.cs + e.dat[g + 8] & 65535;
            e.dat[e.lgt + 8] = e.cs & 255;
            e.dat[e.lgt +
                9] = e.cs >> 8 & 255;
            e.offset += 2;
            calculator_run_timed(100);
            e.i = 0;
            e.step--;
            e.stage++
        } else if (5 == e.stage) {
            if (e.i < e.lgt + 10) {
                if (retval = link.send_byte(e.dat[e.i], 0 == e.i ? 6E6 : LINKDELAY)) {
                    e.err = g + 1 + .01 * retval;
                    break
                }
                e.i++
            } else e.stage++;
            e.step--
        } else if (6 == e.stage) {
            if (131 != link.recv_byte()) {
                e.err = 11;
                break
            }
            if (86 != link.recv_byte()) {
                e.err = 12;
                break
            }
            if (-1 == link.recv_byte()) {
                e.err = 13;
                break
            }
            if (-1 == link.recv_byte()) {
                e.err = 14;
                break
            }
            e.step--;
            e.stage++
        } else if (7 == e.stage) {
            e.dat[1] = 146;
            calculator_run_timed(100);
            if (link.send_data(e.dat,
                    4, null, null)) {
                e.err = 15;
                break
            }
            window[d](2, e.cur_load_elemnum, 0, e.thisname, 0);
            e.step--;
            e.stage = 0
        }
        if (0 == e.step && 0 < e.stage) {
            window[d](1, e.cur_load_elemnum, e.lgt + 10, "", e.i + 1);
            setTimeout(function() {
                ti_common_send_file(c, d, f, e)
            });
            return
        }
    }
    emu.link_state = 3;
    if (e.err && -1 < e.cur_load_elemnum) window[d](3, e.cur_load_elemnum, 0, e.thisname, 0);
    void 0 !== e.epilog && e.epilog(e.err, e)
}

function i5_get_listing() {
    var c = [],
        d = 0,
        f = 1;
    do {
        var e = [3, 162, 11, 0, 0, 0, 25, 0, 0, 0, 0, 0, 0, 0, 0, 25, 0];
        if (0 != (retval = link.send_data(e, e.length, null, null))) d = 90 + retval;
        else {
            do {
                var g, l, h = 0,
                    m = 0;
                g = link.recv_byte(6E6);
                if (131 != g && 115 != g && 130 != g) {
                    d = 1 + .01 * g;
                    break
                }
                if (0 > (l = link.recv_byte())) {
                    d = 2;
                    break
                }
                if (0 > (g = link.recv_byte())) {
                    d = 3;
                    break
                }
                h = g;
                if (0 > (g = link.recv_byte())) {
                    d = 4;
                    break
                }
                h += 256 * g;
                if (6 == l || 21 == l) {
                    for (var n = 0; n < h; n++) {
                        if (0 > (g = link.recv_byte())) {
                            d = 5;
                            break
                        }
                        e[n] = g;
                        m += g
                    }
                    if (0 > (checklo = link.recv_byte())) {
                        d = 6;
                        break
                    }
                    if (0 >
                        (checkhi = link.recv_byte())) {
                        d = 7;
                        break
                    }
                    if (m % 65536 != checklo + 256 * checkhi) {
                        d = 8;
                        break
                    }
                }
                calculator_run_timed(2E3);
                switch (l) {
                    case 146:
                        e = [3, 86, 0, 0];
                        0 != (retval = link.send_data(e, 4, null, null)) && (d = 60 + retval);
                        f = 0;
                        break;
                    case 86:
                        break;
                    case 6:
                        c.push(e);
                        e = [3, 86, 0, 0];
                        0 != (retval = link.send_data(e, 4, null, null)) && (d = 60 + retval);
                        break;
                    case 21:
                        e = [3, 86, 0, 0];
                        0 != (retval = link.send_data(e, 4, null, null)) && (d = 60 + retval);
                        break;
                    default:
                        d = 9001
                }
                calculator_run_timed(2E3)
            } while (f && !d)
        }
    } while (0);
    return d ? [
        [-1]
    ] : c
}

function i5_get_file(c) {
    var d = 0,
        f = [3, 162, 11, 0];
    i6.it_active |= i6.it_mask & 16;
    emu.link_state = 1;
    calculator_run_timed(1E6);
    emu.link_state = 3;
    var d = 0,
        e;
    for (e = 0; e < c.length; e++) c[e] = parseInt(c[e]), d += c[e], f.push(c[e]);
    f.push(d % 256);
    f.push(d / 256 | 0);
    if (0 != (retval = link.send_data(f, f.length, null, null))) d = 60 + retval;
    else if (e = link.recv_byte(6E6), 131 != e && 115 != e && 130 != e) d = 1;
    else if (86 != link.recv_byte()) d = 2;
    else if (0 > link.recv_byte()) d = 3;
    else if (0 > link.recv_byte()) d = 4;
    else if (d = 0, e = link.recv_byte(6E6), 131 !=
        e && 115 != e && 130 != e) d = 5;
    else if (0 > (xfer_type = link.recv_byte())) d = 6;
    else if (0 > (e = link.recv_byte())) d = 7;
    else if (packetsize = sizelo = e, 0 > (e = link.recv_byte())) d = 8;
    else if (sizehi = e, packetsize += 256 * e, 6 != xfer_type) d = 9;
    else {
        c = [];
        for (var g = 0; g < packetsize && !(0 > (e = link.recv_byte())); g++) c[g] = e, d += e;
        if (0 > (checklo = link.recv_byte())) d = 6;
        else if (0 > (checkhi = link.recv_byte())) d = 7;
        else if (d % 65536 != checklo + 256 * checkhi) d = 8;
        else if (calculator_run_timed(2E3), f = [3, 86, 0, 0], retval = link.send_data(f, 4, null, null), calculator_run_timed(2E3),
            f = [3, 9, 0, 0], retval = link.send_data(f, 4, null, null), calculator_run_timed(2E3), e = link.recv_byte(6E6), 131 != e && 115 != e && 130 != e) d = 1;
        else if (86 != link.recv_byte()) d = 2;
        else if (0 > link.recv_byte()) d = 3;
        else if (0 > link.recv_byte()) d = 4;
        else if (calculator_run_timed(2E3), d = 0, e = link.recv_byte(6E6), 131 != e && 115 != e && 130 != e) d = 15;
        else if (0 > (xfer_type = link.recv_byte())) d = 16;
        else if (0 > (e = link.recv_byte())) d = 17;
        else if (packetsize = sizelo = e, 0 > (e = link.recv_byte())) d = 18;
        else if (sizehi = e, packetsize += 256 * e, 21 != xfer_type) d = 29 + .01 *
            xfer_type;
        else {
            f = [];
            for (g = 0; g < packetsize && !(0 > (e = link.recv_byte())); g++) f[g] = e, d += e;
            if (0 > (checklo = link.recv_byte())) d = 26;
            else if (0 > (checkhi = link.recv_byte())) d = 27;
            else if (d % 65536 != checklo + 256 * checkhi) d = 28;
            else return calculator_run_timed(2E3), data2 = [3, 86, 0, 0], retval = link.send_data(data2, 4, null, null), f
        }
    }
    return [-d]
};

function ti_82_reset() {
    var c;
    setskin(showskin);
    if (i6.rom_loaded) {
        z8_reset();
        z8.r2[Regs2_PC] = 0;
        lcd.lcd_reset(i6.type);
        lcd.cwht = 3276.75;
        lcd.cblk = 65535;
        flash_reset(i6.type, i6.rom);
        emu.stop_cnt = 0;
        emu.stop_period = STOPPERIOD;
        emu.dbus = 254;
        emu.link_state = 3;
        i6.portbuf[PSEnum3.PORT0] = 176;
        i6.portbuf[PSEnum3.PORT2] = 248;
        i6.portbuf[PSEnum3.PORT3] = 11;
        i6.portbuf[PSEnum3.PORT4] = 0;
        i6.page[0] = -1;
        i6.mut[0] = 0;
        i6.exc[0] = 0;
        i6.mmap = 0;
        i6.bank_a = 0;
        i6.bank_b = 9;
        i6.bank_c =
            8;
        i5_swap_rom_page(i6.bank_a, i6.bank_b, i6.bank_c);
        for (c = 0; c < 16384 * i6.rampages; c++) i6.ram[c] = 0;
        i6.it_cnt = emu.it_cnt = 0;
        i6.it_state = 0;
        i6.it_next = 1E5;
        i6.it_active = 0;
        i6.it_active_timer = 0;
        for (c = i6.it_mask = 0; 4 > c; c++) i6.it_times[c] = 1E5 + 1E3 * c;
        i6.link_state = 0;
        i6.on_key = 0;
        i6.key_mask = 255;
        for (c = 0; 7 > c; c++) i6.key_state[c] = 255;
        i6_mem_chmode()
    } else alert("ROM is not loaded! Something is broken.")
}

function ti_82_out(c, d) {
    d &= 255;
    switch (c & 23) {
        case 0:
            i6.link_state = ~d & 3;
            emu.partner_link = i6.link_state;
            i6.portbuf[PSEnum3.PORT0] = d & 16;
            ti_82_set_memmap();
            break;
        case 1:
            i6.key_mask = 255 == d ? 255 : i6.key_mask & d;
            break;
        case 2:
            i6.portbuf[PSEnum3.PORT2] = d;
            ti_82_set_memmap();
            break;
        case 3:
            i6.it_mask = d & 11;
            i6.it_active &= d;
            i6.portbuf[PSEnum3.PORT3] = d;
            break;
        case 4:
            i6.portbuf[PSEnum3.PORT4] = d;
            16384 > (z8.r2[Regs2_PC] & 65280) && (i6.subtype = d & 16 ? CTyE.CALC_TYPE_82HW1 : CTyE.CALC_TYPE_82HW2);
            i6.it_next = i6.it_times[i6.it_state];
            ti_82_set_memmap();
            break;
        case 16:
        case 18:
            lcd.lcd_command(d);
            break;
        case 17:
        case 19:
            lcd.lcd_write(d)
    }
}

function ti_82_in(c) {
    var d = 0;
    switch (c & 23) {
        case 0:
        case 4:
            d = (i6.link_state & emu.link_state) << 2 | i6.link_state | i6.portbuf[PSEnum3.PORT0] & 16;
            break;
        case 1:
            d = 255;
            for (c = 0; 7 > c; c++) i6.key_mask & 1 << c || (d &= i6.key_state[c]);
            break;
        case 2:
            return i6.portbuf[PSEnum3.PORT2];
        case 3:
            return i6.it_active & 3 | (i6.on_key ^ 1) << 3;
        case 16:
        case 18:
            return lcd.lcd_status();
        case 17:
        case 19:
            return lcd.lcd_read();
        case 20:
            return 1
    }
    return d
}

function ti_82_set_memmap() {
    var c = 0,
        c = i6.portbuf[PSEnum3.PORT2] & 64 ? 8 | i6.portbuf[PSEnum3.PORT2] & 1 : i6.portbuf[PSEnum3.PORT2] & 7,
        d = 0,
        d = i6.portbuf[PSEnum3.PORT2] & 128 ? 8 | (i6.portbuf[PSEnum3.PORT2] & 8) >> 3 : (i6.portbuf[PSEnum3.PORT2] & 8) >> 3;
    i6.portbuf[PSEnum3.PORT4] & 1 ? (i6.portbuf[PSEnum3.PORT2] & 64 ? (i6.bank_a = 8, i6.bank_b = 9) : (i6.bank_a = 0, i6.bank_b = c), i6.bank_c = d) : (i6.bank_a = c, i6.bank_b = d, i6.bank_c = 8);
    i5_swap_rom_page(i6.bank_a, i6.bank_b,
        i6.bank_c)
};

function ti_84pce_reset() {
    var c;
    setskin(showskin);
    if (i6.rom_loaded) {
        z8_reset();
        z8.r2[Regs2_PC] = 0;
        lcd.lcd_reset(i6.type);
        lcd.cwht = -55704.75;
        lcd.cblk = 6553.5;
        flash_reset(i6.type, i6.rom);
        emu.stop_cnt = 0;
        emu.stop_period = STOPPERIOD;
        emu.dbus = 254;
        emu.link_state = 3;
        i6.it_cnt = emu.it_cnt = 0;
        i6.it_state = 0;
        i6.it_next = 1E5;
        i6.it_active = 0;
        i6.it_active_timer = 0;
        for (c = i6.it_mask = 0; 4 > c; c++) i6.it_times[c] = 1E5 + 1E3 * c;
        i6.prot_cnt = 0;
        i6.link_state = 0;
        i6.on_key = 0;
        i6.key_mask =
            255;
        for (c = 0; 7 > c; c++) i6.key_state[c] = 255;
        ti_84pce_set_priv_pages();
        for (c = 0; 8 > c; c++) i6.prot_buffer[c] = 255
    } else alert("ROM is not loaded! Something is broken.")
}

function ti_84pce_out(c, d) {}

function ti_84pce_in(c) {
    return 0
}

function ti_84pce_protection(c) {
    return 0
}

function ti_84pce_set_priv_pages() {}

function ti_84pce_send_app(c, d) {
    return -1
}

function ti_84pce_ASCIIname(c) {
    cleanname = "";
    for (var d = 0; d < c.length && 0 != c.charCodeAt(d); d++) cleanname += c[d];
    return cleanname
}

function ti_84pce_send_file(c, d, f, e) {
    void 0 === e ? e = {
        step: 0
    } : e.step = 128;
    if (void 0 === e.init || 0 == e.init) e.init = !0, e.err = 0, e.dat = Array(65536), e.cur_load_elemnum = -1, e.offset = 57, e.stage = 0, i6.it_active |= i6.it_mask & 16, emu.link_state = 1, calculator_run_timed(1E6), emu.link_state = 3;
    for (; e.offset < c.length || 0 != e.stage;) {
        if (0 == e.stage) {
            e.lgt = 65535;
            e.lgt = c.charCodeAt(e.offset) + 256 * c.charCodeAt(e.offset + 1);
            e.offset += 2;
            if (65535 == e.lgt) break;
            e.type = 0;
            e.type = c.charCodeAt(e.offset++);
            e.step--;
            e.stage++
        } else if (1 ==
            e.stage) {
            e.cur_load_elemnum = (new Date).getTime().toString();
            e.thisname = ti_84pce_ASCIIname(c.slice(e.offset, e.offset + 8));
            window[d](0, e.cur_load_elemnum, e.lgt + 10, e.thisname);
            e.dat[0] = 35;
            e.dat[1] = 201;
            e.dat[2] = 13;
            e.dat[3] = 0;
            e.dat[4] = e.lgt & 255;
            e.dat[5] = e.lgt >> 8;
            e.dat[6] = e.type;
            e.cs = 0;
            for (var g = 4; 17 > g; g++) 7 <= g && (e.dat[g] = c.charCodeAt(e.offset++)), 16 == g && null != f && (e.dat[g] = f ? 0 : 128), e.cs = e.cs + e.dat[g] & 65535;
            e.dat[17] = e.cs & 255;
            e.dat[18] = e.cs >> 8 & 255;
            if (link.send_data(e.dat, 19, null, null)) {
                e.err = 1;
                break
            }
            e.offset +=
                2;
            e.step--;
            e.stage++
        } else if (2 == e.stage) {
            if (115 != link.recv_byte()) {
                e.err = 2;
                break
            }
            if (86 != link.recv_byte()) {
                e.err = 3;
                break
            }
            if (-1 == link.recv_byte()) {
                e.err = 4;
                break
            }
            if (-1 == link.recv_byte()) {
                e.err = 5;
                break
            }
            e.step--;
            e.stage++
        } else if (3 == e.stage) {
            if (115 != (rcvbyte = link.recv_byte(6E6))) {
                e.err = 6;
                break
            }
            if (9 != (rcvbyte = link.recv_byte())) {
                e.err = 7;
                break
            }
            if (-1 == link.recv_byte()) {
                e.err = 8;
                break
            }
            if (-1 == link.recv_byte()) {
                e.err = 9;
                break
            }
            e.step--;
            e.stage++
        } else if (4 == e.stage) {
            e.dat[1] = 86;
            e.dat[2] = 0;
            e.dat[4] = 35;
            e.dat[5] = 21;
            e.dat[6] = e.lgt;
            e.dat[7] = e.lgt >> 8;
            for (g = e.cs = 0; g < e.lgt; g++) e.dat[g + 8] = c.charCodeAt(e.offset++), e.cs = e.cs + e.dat[g + 8] & 65535;
            e.dat[e.lgt + 8] = e.cs & 255;
            e.dat[e.lgt + 9] = e.cs >> 8 & 255;
            e.offset += 2;
            calculator_run_timed(100);
            e.i = 0;
            e.step--;
            e.stage++
        } else if (5 == e.stage) {
            if (e.i < e.lgt + 10) {
                if (retval = link.send_byte(e.dat[e.i], 0 == e.i ? 6E6 : LINKDELAY)) {
                    e.err = g + 1 + .01 * retval;
                    break
                }
                e.i++
            } else e.stage++;
            e.step--
        } else if (6 == e.stage) {
            if (115 != link.recv_byte()) {
                e.err = 11;
                break
            }
            if (86 != link.recv_byte()) {
                e.err = 12;
                break
            }
            if (-1 == link.recv_byte()) {
                e.err =
                    13;
                break
            }
            if (-1 == link.recv_byte()) {
                e.err = 14;
                break
            }
            e.step--;
            e.stage++
        } else if (7 == e.stage) {
            e.dat[1] = 146;
            calculator_run_timed(100);
            if (link.send_data(e.dat, 4, null, null)) {
                e.err = 15;
                break
            }
            window[d](2, e.cur_load_elemnum, 0, e.thisname, 0);
            e.step--;
            e.stage = 0
        }
        if (0 == e.step) {
            window[d](1, e.cur_load_elemnum, e.lgt + 10, "", e.i + 1);
            setTimeout(function() {
                ti_common_send_file(c, d, f, e)
            });
            return
        }
    }
    emu.link_state = 3;
    if (e.err && -1 < e.cur_load_elemnum) window[d](3, e.cur_load_elemnum, 0, e.thisname, 0);
    void 0 !== e.epilog && e.epilog(e.err,
        e)
}

function ti_84pce_get_listing() {
    var c = [],
        d = 0,
        f = 1;
    i6.it_active |= i6.it_mask & 16;
    emu.link_state = 1;
    calculator_run_timed(1E6);
    emu.link_state = 3;
    do {
        var e = [35, 162, 13, 0, 0, 0, 25, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 25, 0];
        if (0 != (retval = link.send_data(e, e.length, null, null))) d = 90 + retval;
        else {
            do {
                var g, l, h = 0,
                    m = 0;
                g = link.recv_byte(6E6);
                if (131 != g && 115 != g && 130 != g) {
                    d = 1 + .01 * g;
                    break
                }
                if (0 > (l = link.recv_byte())) {
                    d = 2;
                    break
                }
                if (0 > (g = link.recv_byte())) {
                    d = 3;
                    break
                }
                h = g;
                if (0 > (g = link.recv_byte())) {
                    d = 4;
                    break
                }
                h += 256 * g;
                if (6 == l || 21 == l) {
                    for (var n = 0; n <
                        h; n++) {
                        if (0 > (g = link.recv_byte())) {
                            d = 5;
                            break
                        }
                        e[n] = g;
                        m += g
                    }
                    if (0 > (checklo = link.recv_byte())) {
                        d = 6;
                        break
                    }
                    if (0 > (checkhi = link.recv_byte())) {
                        d = 7;
                        break
                    }
                    if (m % 65536 != checklo + 256 * checkhi) {
                        d = 8;
                        break
                    }
                }
                calculator_run_timed(2E3);
                switch (l) {
                    case 146:
                        e = [35, 86, 0, 0];
                        0 != (retval = link.send_data(e, 4, null, null)) && (d = 60 + retval);
                        f = 0;
                        break;
                    case 86:
                        break;
                    case 6:
                        c.push(e);
                        e = [35, 86, 0, 0];
                        0 != (retval = link.send_data(e, 4, null, null)) && (d = 60 + retval);
                        break;
                    case 21:
                        e = [35, 86, 0, 0];
                        0 != (retval = link.send_data(e, 4, null, null)) && (d = 60 + retval);
                        break;
                    default:
                        d = 9001
                }
                calculator_run_timed(2E3)
            } while (f && !d)
        }
    } while (0);
    return d ? [
        [-1]
    ] : c
}

function ti_84pce_get_file(c) {
    var d = 0,
        f = [35, 162, 13, 0];
    i6.it_active |= i6.it_mask & 16;
    emu.link_state = 1;
    calculator_run_timed(1E6);
    emu.link_state = 3;
    var d = 0,
        e;
    for (e = 0; e < c.length; e++) c[e] = parseInt(c[e]), d += c[e], f.push(c[e]);
    f.push(d % 256);
    f.push(d / 256 | 0);
    if (0 != (retval = link.send_data(f, f.length, null, null))) d = 60 + retval;
    else if (e = link.recv_byte(6E6), 131 != e && 115 != e && 130 != e) d = 1;
    else if (86 != link.recv_byte()) d = 2;
    else if (0 > link.recv_byte()) d = 3;
    else if (0 > link.recv_byte()) d = 4;
    else if (d = 0, e = link.recv_byte(6E6),
        131 != e && 115 != e && 130 != e) d = 5;
    else if (0 > (xfer_type = link.recv_byte())) d = 6;
    else if (0 > (e = link.recv_byte())) d = 7;
    else if (packetsize = sizelo = e, 0 > (e = link.recv_byte())) d = 8;
    else if (sizehi = e, packetsize += 256 * e, 6 != xfer_type) d = 9;
    else {
        c = [];
        for (var g = 0; g < packetsize && !(0 > (e = link.recv_byte())); g++) c[g] = e, d += e;
        if (0 > (checklo = link.recv_byte())) d = 6;
        else if (0 > (checkhi = link.recv_byte())) d = 7;
        else if (d % 65536 != checklo + 256 * checkhi) d = 8;
        else if (calculator_run_timed(2E3), f = [35, 86, 0, 0], retval = link.send_data(f, 4, null, null), calculator_run_timed(2E3),
            f = [35, 9, 0, 0], retval = link.send_data(f, 4, null, null), calculator_run_timed(2E3), e = link.recv_byte(6E6), 131 != e && 115 != e && 130 != e) d = 1;
        else if (86 != link.recv_byte()) d = 2;
        else if (0 > link.recv_byte()) d = 3;
        else if (0 > link.recv_byte()) d = 4;
        else if (calculator_run_timed(2E3), d = 0, e = link.recv_byte(6E6), 131 != e && 115 != e && 130 != e) d = 15;
        else if (0 > (xfer_type = link.recv_byte())) d = 16;
        else if (0 > (e = link.recv_byte())) d = 17;
        else if (packetsize = sizelo = e, 0 > (e = link.recv_byte())) d = 18;
        else if (sizehi = e, packetsize += 256 * e, 21 != xfer_type) d = 29 + .01 *
            xfer_type;
        else {
            f = [];
            for (g = 0; g < packetsize && !(0 > (e = link.recv_byte())); g++) f[g] = e, d += e;
            if (0 > (checklo = link.recv_byte())) d = 26;
            else if (0 > (checkhi = link.recv_byte())) d = 27;
            else if (d % 65536 != checklo + 256 * checkhi) d = 28;
            else return calculator_run_timed(2E3), data2 = [35, 86, 0, 0], retval = link.send_data(data2, 4, null, null), f
        }
    }
    return [-d]
};
var hcat_ = [0, 16, 16, 16, 0, 0, 0, 16],
    hcst_ = [0, 0, 16, 0, 16, 0, 16, 16],
    oAt = [0, 0, 0, 4, 4, 0, 0, 0],
    oSt = [0, 4, 0, 0, 0, 0, 4, 0],
    zTe5 = new Uint8Array(256),
    parity_table = new Uint8Array(256),
    zTe6 = new Uint8Array(256),
    bfi_table = new Uint8Array(256),
    bfd_table = new Uint8Array(256);
REGS_8BIT = 23;
REGS_16BIT = 2;
var Regs_A = 0,
    Regs_F = 1,
    Regs_B = 2,
    Regs_C = 3,
    Regs_D = 4,
    Regs_E = 5,
    Regs_H = 6,
    Regs_L = 7,
    Regs_A_ = 8,
    Regs_F_ = 9,
    Regs_B_ = 10,
    Regs_C_ = 11,
    Regs_D_ = 12,
    Regs_E_ = 13,
    Regs_H_ = 14,
    Regs_L_ = 15,
    Regs_IXH = 16,
    Regs_IXL = 17,
    Regs_IYH = 18,
    Regs_IYL = 19,
    Regs_I = 20,
    Regs_R = 21,
    Regs_R7 = 22,
    Regs2_SP = 0,
    Regs2_PC = 1;

function z8_struct() {
    this.r = new Uint8Array(REGS_8BIT);
    this.r2 = new Uint16Array(REGS_16BIT);
    this.im = this.iff2 = this.iff1 = 0;
    this.halted = !1;
    this.speed = 6E6;
    this.breaks = 0;
    this.breakp = [];
    this.breakim = !1;
    this.watches = {};
    this.serial_load = function(c) {
        c = JSON.parse(c);
        if (void 0 == c.r[0] || void 0 == c.r2[0]) this.r[Regs_A] = c.a, this.r[Regs_F] = c.f, this.r[Regs_B] = c.b, this.r[Regs_C] = c.c, this.r[Regs_D] = c.d, this.r[Regs_E] = c.e, this.r[Regs_H] = c.h, this.r[Regs_L] = c.l, this.r[Regs_A_] = c.a_, this.r[Regs_F_] = c.f_, this.r[Regs_B_] =
            c.b_, this.r[Regs_C_] = c.c_, this.r[Regs_D_] = c.d_, this.r[Regs_E_] = c.e_, this.r[Regs_H_] = c.h_, this.r[Regs_L_] = c.l_, this.r[Regs_IXH] = c.ixh, this.r[Regs_IXL] = c.ixl, this.r[Regs_IYH] = c.iyh, this.r[Regs_IYL] = c.iyl, this.r[Regs_I] = c.i, this.r[Regs_R] = c.r, this.r[Regs_R7] = c.r7, this.r2[Regs2_SP] = c.sp, this.r2[Regs2_PC] = c.pc;
        else {
            for (var d = 0; d < REGS_8BIT; d++) this.r[d] = c.r[d];
            for (d = 0; d < REGS_16BIT; d++) this.r2[d] = c.r2[d]
        }
        this.iff1 = c.iff1;
        this.iff2 = c.iff2;
        this.im = c.im;
        this.halted = c.halted;
        this.speed = c.speed;
        this.breaks = c.breaks;
        this.breakp = c.breakp;
        c.watches && (this.watches = c.watches)
    };
    this.serial_save = function() {
        return JSON.stringify(this)
    }
}
var z8 = new z8_struct;

function z8_init() {
    z8_init_tables()
}

function z8_init_tables() {
    var c, d, f, e;
    for (c = 0; 256 > c; c++) {
        zTe5[c] = c & 168;
        d = c;
        for (f = e = 0; 8 > f; f++) e ^= d & 1, d >>= 1;
        parity_table[c] = e ? 0 : 4;
        zTe6[c] = zTe5[c] | parity_table[c]
    }
    zTe5[0] |= 64;
    zTe6[0] |= 64;
    for (c = 0; 256 > c; c++) bfi_table[c] = (128 == c ? 4 : 0) | (c & 15 ? 0 : 16) | zTe5[c], bfd_table[c] = (c + 1 & 15 ? 0 : 16) | 2 | (127 == c ? 4 : 0) | zTe5[c]
}

function z8_reset() {
    z8.r[Regs_A] = z8.r[Regs_F] = z8.r[Regs_B] = z8.r[Regs_C] = z8.r[Regs_D] = z8.r[Regs_E] = z8.r[Regs_H] = z8.r[Regs_L] = 0;
    z8.r[Regs_A_] = z8.r[Regs_F_] = z8.r[Regs_B_] = z8.r[Regs_C_] = z8.r[Regs_D_] = z8.r[Regs_E_] = z8.r[Regs_H_] = z8.r[Regs_L_] = 0;
    z8.r[Regs_IXH] = z8.r[Regs_IXL] = z8.r[Regs_IYH] = z8.r[Regs_IYL] = 0;
    z8.r[Regs_I] = z8.r[Regs_R] = z8.r[Regs_R7] = 0;
    z8.r2[Regs2_SP] = 65535;
    z8.r2[Regs2_PC] = 0;
    z8.iff1 = z8.iff2 = 0;
    z8.im = 1;
    z8.halted = 0;
    z8.ie = 0;
    CPUSPEED = 6E6;
    z8.speed = CPUSPEED;
    STOPPERIOD =
        CPUSPEED / FRAMEDIV
}

function z8_interrupt_force() {
    z8_interrupt()
}

function z8_interrupt_fire() {
    z8.ie && z8_step();
    if (z8.iff1) emu.dbus = Math.floor(256 * Math.random()), z8_interrupt_force();
    else {
        if (z8.halted) return emu.stop_cnt = emu.stop_period, 1;
        z8_step()
    }
    return 0
}

function z8_interrupt() {
    if (z8.iff1) switch (z8.halted && (z8.r2[Regs2_PC]++, z8.r2[Regs2_PC] &= 65535, z8.halted = !1), z8.iff1 = z8.iff2 = 0, z8.r2[Regs2_SP] = z8.r2[Regs2_SP] - 1 & 65535, wQi(z8.r2[Regs2_SP], z8.r2[Regs2_PC] >> 8), z8.r2[Regs2_SP] = z8.r2[Regs2_SP] - 1 & 65535, wQi(z8.r2[Regs2_SP], z8.r2[Regs2_PC] & 255), z8.r[Regs_R] = z8.r[Regs_R] + 1 & 127, z8.im) {
        case 0:
            z8.r2[Regs2_PC] = 56;
            tss += 12;
            break;
        case 1:
            z8.r2[Regs2_PC] = 56;
            tss += 13;
            break;
        case 2:
            var c = 256 * z8.r[Regs_I] + 255,
                d = wQj(c++),
                c = wQj(c & 65535);
            z8.r2[Regs2_PC] = d | c << 8;
            tss += 19
    }
};

function sXd(c) {
    return 128 > c ? c : c - 256
}

function z8_do_opcodes() {
    for (; tss < event_next_event;) z8_step()
}
var showall = !1,
    z8_step = z8_step_one;

function z8_step_chmode() {
    z8_step = z8.breaks || z8.breakim ? z8_step_debug : z8_step_one
}

function z8_step_debug() {
    if (z8.breaks)
        for (var c = 0; c < z8.breaks; c++)
            if (z8.breakp[c] == z8.r2[Regs2_PC] && !debug_stepping) {
                debug_trapped = !0;
                return
            } 2 == debug_stepping && z8.r2[Regs2_SP] >= debug_ret_sp && z8.r2[Regs2_PC] > debug_ret_pc && z8.r2[Regs2_PC] <= debug_ret_pc + 4 ? debug_trapped = !0 : (im = z8.im, z8_step_one(), z8.breakim && !debug_stepping && z8.im != im && (debug_trapped = !0))
}

function z8_step_one() {
    var c, d = tss;
    tss += 4;
    z8.r[Regs_R] = z8.r[Regs_R] + 1 & 127;
    c = wQj(z8.r2[Regs2_PC]++);
    z8.r2[Regs2_PC] &= 65535;
    (c = z8oT[c]) || (c = z8oT[z8oT.length - 1]);
    c && c();
    z8.ie >>= 1;
    d = tss - d;
    for (c = 0; c < emu.it_num; c++) i6.it_cnt += d;
    for (c = 0; c < emu.ct_num; c++)
        if (emu.ct_cnt[c] -= d, 0 >= emu.ct_cnt[c]) {
            var f = emu.ct_ids[c];
            emu.ct_ids.splice(c, 1);
            emu.ct_cnt.splice(c, 1);
            emu.ct_num--;
            c--;
            timer_expired(f)
        } emu.stop_cnt += d
}
window.z8oT_c203 = Array(257);
z8oT_c203[0] = function() {
    z8.r[Regs_B] = (z8.r[Regs_B] & 127) << 1 | z8.r[Regs_B] >> 7;
    z8.r[Regs_F] = z8.r[Regs_B] & 1 | zTe6[z8.r[Regs_B]]
};
z8oT_c203[1] = function() {
    z8.r[Regs_C] = (z8.r[Regs_C] & 127) << 1 | z8.r[Regs_C] >> 7;
    z8.r[Regs_F] = z8.r[Regs_C] & 1 | zTe6[z8.r[Regs_C]]
};
z8oT_c203[2] = function() {
    z8.r[Regs_D] = (z8.r[Regs_D] & 127) << 1 | z8.r[Regs_D] >> 7;
    z8.r[Regs_F] = z8.r[Regs_D] & 1 | zTe6[z8.r[Regs_D]]
};
z8oT_c203[3] = function() {
    z8.r[Regs_E] = (z8.r[Regs_E] & 127) << 1 | z8.r[Regs_E] >> 7;
    z8.r[Regs_F] = z8.r[Regs_E] & 1 | zTe6[z8.r[Regs_E]]
};
z8oT_c203[4] = function() {
    z8.r[Regs_H] = (z8.r[Regs_H] & 127) << 1 | z8.r[Regs_H] >> 7;
    z8.r[Regs_F] = z8.r[Regs_H] & 1 | zTe6[z8.r[Regs_H]]
};
z8oT_c203[5] = function() {
    z8.r[Regs_L] = (z8.r[Regs_L] & 127) << 1 | z8.r[Regs_L] >> 7;
    z8.r[Regs_F] = z8.r[Regs_L] & 1 | zTe6[z8.r[Regs_L]]
};
z8oT_c203[6] = function() {
    var c = wQj(z8.r[Regs_L] | z8.r[Regs_H] << 8);
    tss += 7;
    c = (c & 127) << 1 | c >> 7;
    z8.r[Regs_F] = c & 1 | zTe6[c];
    wQi(z8.r[Regs_L] | z8.r[Regs_H] << 8, c)
};
z8oT_c203[7] = function() {
    z8.r[Regs_A] = (z8.r[Regs_A] & 127) << 1 | z8.r[Regs_A] >> 7;
    z8.r[Regs_F] = z8.r[Regs_A] & 1 | zTe6[z8.r[Regs_A]]
};
z8oT_c203[8] = function() {
    z8.r[Regs_F] = z8.r[Regs_B] & 1;
    z8.r[Regs_B] = z8.r[Regs_B] >> 1 | (z8.r[Regs_B] & 1) << 7;
    z8.r[Regs_F] |= zTe6[z8.r[Regs_B]]
};
z8oT_c203[9] = function() {
    z8.r[Regs_F] = z8.r[Regs_C] & 1;
    z8.r[Regs_C] = z8.r[Regs_C] >> 1 | (z8.r[Regs_C] & 1) << 7;
    z8.r[Regs_F] |= zTe6[z8.r[Regs_C]]
};
z8oT_c203[10] = function() {
    z8.r[Regs_F] = z8.r[Regs_D] & 1;
    z8.r[Regs_D] = z8.r[Regs_D] >> 1 | (z8.r[Regs_D] & 1) << 7;
    z8.r[Regs_F] |= zTe6[z8.r[Regs_D]]
};
z8oT_c203[11] = function() {
    z8.r[Regs_F] = z8.r[Regs_E] & 1;
    z8.r[Regs_E] = z8.r[Regs_E] >> 1 | (z8.r[Regs_E] & 1) << 7;
    z8.r[Regs_F] |= zTe6[z8.r[Regs_E]]
};
z8oT_c203[12] = function() {
    z8.r[Regs_F] = z8.r[Regs_H] & 1;
    z8.r[Regs_H] = z8.r[Regs_H] >> 1 | (z8.r[Regs_H] & 1) << 7;
    z8.r[Regs_F] |= zTe6[z8.r[Regs_H]]
};
z8oT_c203[13] = function() {
    z8.r[Regs_F] = z8.r[Regs_L] & 1;
    z8.r[Regs_L] = z8.r[Regs_L] >> 1 | (z8.r[Regs_L] & 1) << 7;
    z8.r[Regs_F] |= zTe6[z8.r[Regs_L]]
};
z8oT_c203[14] = function() {
    var c = wQj(z8.r[Regs_L] | z8.r[Regs_H] << 8);
    tss += 7;
    z8.r[Regs_F] = c & 1;
    c = c >> 1 | (c & 1) << 7;
    z8.r[Regs_F] |= zTe6[c];
    wQi(z8.r[Regs_L] | z8.r[Regs_H] << 8, c)
};
z8oT_c203[15] = function() {
    z8.r[Regs_F] = z8.r[Regs_A] & 1;
    z8.r[Regs_A] = z8.r[Regs_A] >> 1 | (z8.r[Regs_A] & 1) << 7;
    z8.r[Regs_F] |= zTe6[z8.r[Regs_A]]
};
z8oT_c203[16] = function() {
    var c = z8.r[Regs_B];
    z8.r[Regs_B] = (z8.r[Regs_B] & 127) << 1 | z8.r[Regs_F] & 1;
    z8.r[Regs_F] = c >> 7 | zTe6[z8.r[Regs_B]]
};
z8oT_c203[17] = function() {
    var c = z8.r[Regs_C];
    z8.r[Regs_C] = (z8.r[Regs_C] & 127) << 1 | z8.r[Regs_F] & 1;
    z8.r[Regs_F] = c >> 7 | zTe6[z8.r[Regs_C]]
};
z8oT_c203[18] = function() {
    var c = z8.r[Regs_D];
    z8.r[Regs_D] = (z8.r[Regs_D] & 127) << 1 | z8.r[Regs_F] & 1;
    z8.r[Regs_F] = c >> 7 | zTe6[z8.r[Regs_D]]
};
z8oT_c203[19] = function() {
    var c = z8.r[Regs_E];
    z8.r[Regs_E] = (z8.r[Regs_E] & 127) << 1 | z8.r[Regs_F] & 1;
    z8.r[Regs_F] = c >> 7 | zTe6[z8.r[Regs_E]]
};
z8oT_c203[20] = function() {
    var c = z8.r[Regs_H];
    z8.r[Regs_H] = (z8.r[Regs_H] & 127) << 1 | z8.r[Regs_F] & 1;
    z8.r[Regs_F] = c >> 7 | zTe6[z8.r[Regs_H]]
};
z8oT_c203[21] = function() {
    var c = z8.r[Regs_L];
    z8.r[Regs_L] = (z8.r[Regs_L] & 127) << 1 | z8.r[Regs_F] & 1;
    z8.r[Regs_F] = c >> 7 | zTe6[z8.r[Regs_L]]
};
z8oT_c203[22] = function() {
    var c = wQj(z8.r[Regs_L] | z8.r[Regs_H] << 8);
    tss += 7;
    var d = c,
        c = (c & 127) << 1 | z8.r[Regs_F] & 1;
    z8.r[Regs_F] = d >> 7 | zTe6[c];
    wQi(z8.r[Regs_L] | z8.r[Regs_H] << 8, c)
};
z8oT_c203[23] = function() {
    var c = z8.r[Regs_A];
    z8.r[Regs_A] = (z8.r[Regs_A] & 127) << 1 | z8.r[Regs_F] & 1;
    z8.r[Regs_F] = c >> 7 | zTe6[z8.r[Regs_A]]
};
z8oT_c203[24] = function() {
    var c = z8.r[Regs_B];
    z8.r[Regs_B] = z8.r[Regs_B] >> 1 | (z8.r[Regs_F] & 1) << 7;
    z8.r[Regs_F] = c & 1 | zTe6[z8.r[Regs_B]]
};
z8oT_c203[25] = function() {
    var c = z8.r[Regs_C];
    z8.r[Regs_C] = z8.r[Regs_C] >> 1 | (z8.r[Regs_F] & 1) << 7;
    z8.r[Regs_F] = c & 1 | zTe6[z8.r[Regs_C]]
};
z8oT_c203[26] = function() {
    var c = z8.r[Regs_D];
    z8.r[Regs_D] = z8.r[Regs_D] >> 1 | (z8.r[Regs_F] & 1) << 7;
    z8.r[Regs_F] = c & 1 | zTe6[z8.r[Regs_D]]
};
z8oT_c203[27] = function() {
    var c = z8.r[Regs_E];
    z8.r[Regs_E] = z8.r[Regs_E] >> 1 | (z8.r[Regs_F] & 1) << 7;
    z8.r[Regs_F] = c & 1 | zTe6[z8.r[Regs_E]]
};
z8oT_c203[28] = function() {
    var c = z8.r[Regs_H];
    z8.r[Regs_H] = z8.r[Regs_H] >> 1 | (z8.r[Regs_F] & 1) << 7;
    z8.r[Regs_F] = c & 1 | zTe6[z8.r[Regs_H]]
};
z8oT_c203[29] = function() {
    var c = z8.r[Regs_L];
    z8.r[Regs_L] = z8.r[Regs_L] >> 1 | (z8.r[Regs_F] & 1) << 7;
    z8.r[Regs_F] = c & 1 | zTe6[z8.r[Regs_L]]
};
z8oT_c203[30] = function() {
    var c = wQj(z8.r[Regs_L] | z8.r[Regs_H] << 8);
    tss += 7;
    var d = c,
        c = c >> 1 | (z8.r[Regs_F] & 1) << 7;
    z8.r[Regs_F] = d & 1 | zTe6[c];
    wQi(z8.r[Regs_L] | z8.r[Regs_H] << 8, c)
};
z8oT_c203[31] = function() {
    var c = z8.r[Regs_A];
    z8.r[Regs_A] = z8.r[Regs_A] >> 1 | (z8.r[Regs_F] & 1) << 7;
    z8.r[Regs_F] = c & 1 | zTe6[z8.r[Regs_A]]
};
z8oT_c203[32] = function() {
    z8.r[Regs_F] = z8.r[Regs_B] >> 7;
    z8.r[Regs_B] <<= 1;
    z8.r[Regs_B] &= 255;
    z8.r[Regs_F] |= zTe6[z8.r[Regs_B]]
};
z8oT_c203[33] = function() {
    z8.r[Regs_F] = z8.r[Regs_C] >> 7;
    z8.r[Regs_C] <<= 1;
    z8.r[Regs_C] &= 255;
    z8.r[Regs_F] |= zTe6[z8.r[Regs_C]]
};
z8oT_c203[34] = function() {
    z8.r[Regs_F] = z8.r[Regs_D] >> 7;
    z8.r[Regs_D] <<= 1;
    z8.r[Regs_D] &= 255;
    z8.r[Regs_F] |= zTe6[z8.r[Regs_D]]
};
z8oT_c203[35] = function() {
    z8.r[Regs_F] = z8.r[Regs_E] >> 7;
    z8.r[Regs_E] <<= 1;
    z8.r[Regs_E] &= 255;
    z8.r[Regs_F] |= zTe6[z8.r[Regs_E]]
};
z8oT_c203[36] = function() {
    z8.r[Regs_F] = z8.r[Regs_H] >> 7;
    z8.r[Regs_H] <<= 1;
    z8.r[Regs_H] &= 255;
    z8.r[Regs_F] |= zTe6[z8.r[Regs_H]]
};
z8oT_c203[37] = function() {
    z8.r[Regs_F] = z8.r[Regs_L] >> 7;
    z8.r[Regs_L] <<= 1;
    z8.r[Regs_L] &= 255;
    z8.r[Regs_F] |= zTe6[z8.r[Regs_L]]
};
z8oT_c203[38] = function() {
    var c = wQj(z8.r[Regs_L] | z8.r[Regs_H] << 8);
    tss += 4;
    tss += 3;
    z8.r[Regs_F] = c >> 7;
    c = c << 1 & 255;
    z8.r[Regs_F] |= zTe6[c];
    wQi(z8.r[Regs_L] | z8.r[Regs_H] << 8, c)
};
z8oT_c203[39] = function() {
    z8.r[Regs_F] = z8.r[Regs_A] >> 7;
    z8.r[Regs_A] <<= 1;
    z8.r[Regs_A] &= 255;
    z8.r[Regs_F] |= zTe6[z8.r[Regs_A]]
};
z8oT_c203[40] = function() {
    z8.r[Regs_F] = z8.r[Regs_B] & 1;
    z8.r[Regs_B] = z8.r[Regs_B] & 128 | z8.r[Regs_B] >> 1;
    z8.r[Regs_F] |= zTe6[z8.r[Regs_B]]
};
z8oT_c203[41] = function() {
    z8.r[Regs_F] = z8.r[Regs_C] & 1;
    z8.r[Regs_C] = z8.r[Regs_C] & 128 | z8.r[Regs_C] >> 1;
    z8.r[Regs_F] |= zTe6[z8.r[Regs_C]]
};
z8oT_c203[42] = function() {
    z8.r[Regs_F] = z8.r[Regs_D] & 1;
    z8.r[Regs_D] = z8.r[Regs_D] & 128 | z8.r[Regs_D] >> 1;
    z8.r[Regs_F] |= zTe6[z8.r[Regs_D]]
};
z8oT_c203[43] = function() {
    z8.r[Regs_F] = z8.r[Regs_E] & 1;
    z8.r[Regs_E] = z8.r[Regs_E] & 128 | z8.r[Regs_E] >> 1;
    z8.r[Regs_F] |= zTe6[z8.r[Regs_E]]
};
z8oT_c203[44] = function() {
    z8.r[Regs_F] = z8.r[Regs_H] & 1;
    z8.r[Regs_H] = z8.r[Regs_H] & 128 | z8.r[Regs_H] >> 1;
    z8.r[Regs_F] |= zTe6[z8.r[Regs_H]]
};
z8oT_c203[45] = function() {
    z8.r[Regs_F] = z8.r[Regs_L] & 1;
    z8.r[Regs_L] = z8.r[Regs_L] & 128 | z8.r[Regs_L] >> 1;
    z8.r[Regs_F] |= zTe6[z8.r[Regs_L]]
};
z8oT_c203[46] = function() {
    var c = wQj(z8.r[Regs_L] | z8.r[Regs_H] << 8);
    tss += 7;
    z8.r[Regs_F] = c & 1;
    c = c & 128 | c >> 1;
    z8.r[Regs_F] |= zTe6[c];
    wQi(z8.r[Regs_L] | z8.r[Regs_H] << 8, c)
};
z8oT_c203[47] = function() {
    z8.r[Regs_F] = z8.r[Regs_A] & 1;
    z8.r[Regs_A] = z8.r[Regs_A] & 128 | z8.r[Regs_A] >> 1;
    z8.r[Regs_F] |= zTe6[z8.r[Regs_A]]
};
z8oT_c203[48] = function() {
    z8.r[Regs_F] = z8.r[Regs_B] >> 7;
    z8.r[Regs_B] = z8.r[Regs_B] << 1 | 1;
    z8.r[Regs_B] &= 255;
    z8.r[Regs_F] |= zTe6[z8.r[Regs_B]]
};
z8oT_c203[49] = function() {
    z8.r[Regs_F] = z8.r[Regs_C] >> 7;
    z8.r[Regs_C] = z8.r[Regs_C] << 1 | 1;
    z8.r[Regs_C] &= 255;
    z8.r[Regs_F] |= zTe6[z8.r[Regs_C]]
};
z8oT_c203[50] = function() {
    z8.r[Regs_F] = z8.r[Regs_D] >> 7;
    z8.r[Regs_D] = z8.r[Regs_D] << 1 | 1;
    z8.r[Regs_D] &= 255;
    z8.r[Regs_F] |= zTe6[z8.r[Regs_D]]
};
z8oT_c203[51] = function() {
    z8.r[Regs_F] = z8.r[Regs_E] >> 7;
    z8.r[Regs_E] = z8.r[Regs_E] << 1 | 1;
    z8.r[Regs_E] &= 255;
    z8.r[Regs_F] |= zTe6[z8.r[Regs_E]]
};
z8oT_c203[52] = function() {
    z8.r[Regs_F] = z8.r[Regs_H] >> 7;
    z8.r[Regs_H] = z8.r[Regs_H] << 1 | 1;
    z8.r[Regs_H] &= 255;
    z8.r[Regs_F] |= zTe6[z8.r[Regs_H]]
};
z8oT_c203[53] = function() {
    z8.r[Regs_F] = z8.r[Regs_L] >> 7;
    z8.r[Regs_L] = z8.r[Regs_L] << 1 | 1;
    z8.r[Regs_L] &= 255;
    z8.r[Regs_F] |= zTe6[z8.r[Regs_L]]
};
z8oT_c203[54] = function() {
    var c = wQj(z8.r[Regs_L] | z8.r[Regs_H] << 8);
    tss += 7;
    z8.r[Regs_F] = c >> 7;
    c = (c << 1 | 1) & 255;
    z8.r[Regs_F] |= zTe6[c];
    wQi(z8.r[Regs_L] | z8.r[Regs_H] << 8, c)
};
z8oT_c203[55] = function() {
    z8.r[Regs_F] = z8.r[Regs_A] >> 7;
    z8.r[Regs_A] = z8.r[Regs_A] << 1 | 1;
    z8.r[Regs_A] &= 255;
    z8.r[Regs_F] |= zTe6[z8.r[Regs_A]]
};
z8oT_c203[56] = function() {
    z8.r[Regs_F] = z8.r[Regs_B] & 1;
    z8.r[Regs_B] >>= 1;
    z8.r[Regs_F] |= zTe6[z8.r[Regs_B]]
};
z8oT_c203[57] = function() {
    z8.r[Regs_F] = z8.r[Regs_C] & 1;
    z8.r[Regs_C] >>= 1;
    z8.r[Regs_F] |= zTe6[z8.r[Regs_C]]
};
z8oT_c203[58] = function() {
    z8.r[Regs_F] = z8.r[Regs_D] & 1;
    z8.r[Regs_D] >>= 1;
    z8.r[Regs_F] |= zTe6[z8.r[Regs_D]]
};
z8oT_c203[59] = function() {
    z8.r[Regs_F] = z8.r[Regs_E] & 1;
    z8.r[Regs_E] >>= 1;
    z8.r[Regs_F] |= zTe6[z8.r[Regs_E]]
};
z8oT_c203[60] = function() {
    z8.r[Regs_F] = z8.r[Regs_H] & 1;
    z8.r[Regs_H] >>= 1;
    z8.r[Regs_F] |= zTe6[z8.r[Regs_H]]
};
z8oT_c203[61] = function() {
    z8.r[Regs_F] = z8.r[Regs_L] & 1;
    z8.r[Regs_L] >>= 1;
    z8.r[Regs_F] |= zTe6[z8.r[Regs_L]]
};
z8oT_c203[62] = function() {
    var c = wQj(z8.r[Regs_L] | z8.r[Regs_H] << 8);
    tss += 7;
    z8.r[Regs_F] = c & 1;
    c >>= 1;
    z8.r[Regs_F] |= zTe6[c];
    wQi(z8.r[Regs_L] | z8.r[Regs_H] << 8, c)
};
z8oT_c203[63] = function() {
    z8.r[Regs_F] = z8.r[Regs_A] & 1;
    z8.r[Regs_A] >>= 1;
    z8.r[Regs_F] |= zTe6[z8.r[Regs_A]]
};
z8oT_c203[64] = function() {
    z8.r[Regs_F] = z8.r[Regs_F] & 1 | 16 | z8.r[Regs_B] & 40;
    z8.r[Regs_B] & 1 || (z8.r[Regs_F] |= 68)
};
z8oT_c203[65] = function() {
    z8.r[Regs_F] = z8.r[Regs_F] & 1 | 16 | z8.r[Regs_C] & 40;
    z8.r[Regs_C] & 1 || (z8.r[Regs_F] |= 68)
};
z8oT_c203[66] = function() {
    z8.r[Regs_F] = z8.r[Regs_F] & 1 | 16 | z8.r[Regs_D] & 40;
    z8.r[Regs_D] & 1 || (z8.r[Regs_F] |= 68)
};
z8oT_c203[67] = function() {
    z8.r[Regs_F] = z8.r[Regs_F] & 1 | 16 | z8.r[Regs_E] & 40;
    z8.r[Regs_E] & 1 || (z8.r[Regs_F] |= 68)
};
z8oT_c203[68] = function() {
    z8.r[Regs_F] = z8.r[Regs_F] & 1 | 16 | z8.r[Regs_H] & 40;
    z8.r[Regs_H] & 1 || (z8.r[Regs_F] |= 68)
};
z8oT_c203[69] = function() {
    z8.r[Regs_F] = z8.r[Regs_F] & 1 | 16 | z8.r[Regs_L] & 40;
    z8.r[Regs_L] & 1 || (z8.r[Regs_F] |= 68)
};
z8oT_c203[70] = function() {
    var c = wQj(z8.r[Regs_L] | z8.r[Regs_H] << 8);
    tss += 4;
    z8.r[Regs_F] = z8.r[Regs_F] & 1 | 16 | c & 40;
    c & 1 || (z8.r[Regs_F] |= 68)
};
z8oT_c203[71] = function() {
    z8.r[Regs_F] = z8.r[Regs_F] & 1 | 16 | z8.r[Regs_A] & 40;
    z8.r[Regs_A] & 1 || (z8.r[Regs_F] |= 68)
};
z8oT_c203[72] = function() {
    z8.r[Regs_F] = z8.r[Regs_F] & 1 | 16 | z8.r[Regs_B] & 40;
    z8.r[Regs_B] & 2 || (z8.r[Regs_F] |= 68)
};
z8oT_c203[73] = function() {
    z8.r[Regs_F] = z8.r[Regs_F] & 1 | 16 | z8.r[Regs_C] & 40;
    z8.r[Regs_C] & 2 || (z8.r[Regs_F] |= 68)
};
z8oT_c203[74] = function() {
    z8.r[Regs_F] = z8.r[Regs_F] & 1 | 16 | z8.r[Regs_D] & 40;
    z8.r[Regs_D] & 2 || (z8.r[Regs_F] |= 68)
};
z8oT_c203[75] = function() {
    z8.r[Regs_F] = z8.r[Regs_F] & 1 | 16 | z8.r[Regs_E] & 40;
    z8.r[Regs_E] & 2 || (z8.r[Regs_F] |= 68)
};
z8oT_c203[76] = function() {
    z8.r[Regs_F] = z8.r[Regs_F] & 1 | 16 | z8.r[Regs_H] & 40;
    z8.r[Regs_H] & 2 || (z8.r[Regs_F] |= 68)
};
z8oT_c203[77] = function() {
    z8.r[Regs_F] = z8.r[Regs_F] & 1 | 16 | z8.r[Regs_L] & 40;
    z8.r[Regs_L] & 2 || (z8.r[Regs_F] |= 68)
};
z8oT_c203[78] = function() {
    var c = wQj(z8.r[Regs_L] | z8.r[Regs_H] << 8);
    tss += 4;
    z8.r[Regs_F] = z8.r[Regs_F] & 1 | 16 | c & 40;
    c & 2 || (z8.r[Regs_F] |= 68)
};
z8oT_c203[79] = function() {
    z8.r[Regs_F] = z8.r[Regs_F] & 1 | 16 | z8.r[Regs_A] & 40;
    z8.r[Regs_A] & 2 || (z8.r[Regs_F] |= 68)
};
z8oT_c203[80] = function() {
    z8.r[Regs_F] = z8.r[Regs_F] & 1 | 16 | z8.r[Regs_B] & 40;
    z8.r[Regs_B] & 4 || (z8.r[Regs_F] |= 68)
};
z8oT_c203[81] = function() {
    z8.r[Regs_F] = z8.r[Regs_F] & 1 | 16 | z8.r[Regs_C] & 40;
    z8.r[Regs_C] & 4 || (z8.r[Regs_F] |= 68)
};
z8oT_c203[82] = function() {
    z8.r[Regs_F] = z8.r[Regs_F] & 1 | 16 | z8.r[Regs_D] & 40;
    z8.r[Regs_D] & 4 || (z8.r[Regs_F] |= 68)
};
z8oT_c203[83] = function() {
    z8.r[Regs_F] = z8.r[Regs_F] & 1 | 16 | z8.r[Regs_E] & 40;
    z8.r[Regs_E] & 4 || (z8.r[Regs_F] |= 68)
};
z8oT_c203[84] = function() {
    z8.r[Regs_F] = z8.r[Regs_F] & 1 | 16 | z8.r[Regs_H] & 40;
    z8.r[Regs_H] & 4 || (z8.r[Regs_F] |= 68)
};
z8oT_c203[85] = function() {
    z8.r[Regs_F] = z8.r[Regs_F] & 1 | 16 | z8.r[Regs_L] & 40;
    z8.r[Regs_L] & 4 || (z8.r[Regs_F] |= 68)
};
z8oT_c203[86] = function() {
    var c = wQj(z8.r[Regs_L] | z8.r[Regs_H] << 8);
    tss += 4;
    z8.r[Regs_F] = z8.r[Regs_F] & 1 | 16 | c & 40;
    c & 4 || (z8.r[Regs_F] |= 68)
};
z8oT_c203[87] = function() {
    z8.r[Regs_F] = z8.r[Regs_F] & 1 | 16 | z8.r[Regs_A] & 40;
    z8.r[Regs_A] & 4 || (z8.r[Regs_F] |= 68)
};
z8oT_c203[88] = function() {
    z8.r[Regs_F] = z8.r[Regs_F] & 1 | 16 | z8.r[Regs_B] & 40;
    z8.r[Regs_B] & 8 || (z8.r[Regs_F] |= 68)
};
z8oT_c203[89] = function() {
    z8.r[Regs_F] = z8.r[Regs_F] & 1 | 16 | z8.r[Regs_C] & 40;
    z8.r[Regs_C] & 8 || (z8.r[Regs_F] |= 68)
};
z8oT_c203[90] = function() {
    z8.r[Regs_F] = z8.r[Regs_F] & 1 | 16 | z8.r[Regs_D] & 40;
    z8.r[Regs_D] & 8 || (z8.r[Regs_F] |= 68)
};
z8oT_c203[91] = function() {
    z8.r[Regs_F] = z8.r[Regs_F] & 1 | 16 | z8.r[Regs_E] & 40;
    z8.r[Regs_E] & 8 || (z8.r[Regs_F] |= 68)
};
z8oT_c203[92] = function() {
    z8.r[Regs_F] = z8.r[Regs_F] & 1 | 16 | z8.r[Regs_H] & 40;
    z8.r[Regs_H] & 8 || (z8.r[Regs_F] |= 68)
};
z8oT_c203[93] = function() {
    z8.r[Regs_F] = z8.r[Regs_F] & 1 | 16 | z8.r[Regs_L] & 40;
    z8.r[Regs_L] & 8 || (z8.r[Regs_F] |= 68)
};
z8oT_c203[94] = function() {
    var c = wQj(z8.r[Regs_L] | z8.r[Regs_H] << 8);
    tss += 4;
    z8.r[Regs_F] = z8.r[Regs_F] & 1 | 16 | c & 40;
    c & 8 || (z8.r[Regs_F] |= 68)
};
z8oT_c203[95] = function() {
    z8.r[Regs_F] = z8.r[Regs_F] & 1 | 16 | z8.r[Regs_A] & 40;
    z8.r[Regs_A] & 8 || (z8.r[Regs_F] |= 68)
};
z8oT_c203[96] = function() {
    z8.r[Regs_F] = z8.r[Regs_F] & 1 | 16 | z8.r[Regs_B] & 40;
    z8.r[Regs_B] & 16 || (z8.r[Regs_F] |= 68)
};
z8oT_c203[97] = function() {
    z8.r[Regs_F] = z8.r[Regs_F] & 1 | 16 | z8.r[Regs_C] & 40;
    z8.r[Regs_C] & 16 || (z8.r[Regs_F] |= 68)
};
z8oT_c203[98] = function() {
    z8.r[Regs_F] = z8.r[Regs_F] & 1 | 16 | z8.r[Regs_D] & 40;
    z8.r[Regs_D] & 16 || (z8.r[Regs_F] |= 68)
};
z8oT_c203[99] = function() {
    z8.r[Regs_F] = z8.r[Regs_F] & 1 | 16 | z8.r[Regs_E] & 40;
    z8.r[Regs_E] & 16 || (z8.r[Regs_F] |= 68)
};
z8oT_c203[100] = function() {
    z8.r[Regs_F] = z8.r[Regs_F] & 1 | 16 | z8.r[Regs_H] & 40;
    z8.r[Regs_H] & 16 || (z8.r[Regs_F] |= 68)
};
z8oT_c203[101] = function() {
    z8.r[Regs_F] = z8.r[Regs_F] & 1 | 16 | z8.r[Regs_L] & 40;
    z8.r[Regs_L] & 16 || (z8.r[Regs_F] |= 68)
};
z8oT_c203[102] = function() {
    var c = wQj(z8.r[Regs_L] | z8.r[Regs_H] << 8);
    tss += 4;
    z8.r[Regs_F] = z8.r[Regs_F] & 1 | 16 | c & 40;
    c & 16 || (z8.r[Regs_F] |= 68)
};
z8oT_c203[103] = function() {
    z8.r[Regs_F] = z8.r[Regs_F] & 1 | 16 | z8.r[Regs_A] & 40;
    z8.r[Regs_A] & 16 || (z8.r[Regs_F] |= 68)
};
z8oT_c203[104] = function() {
    z8.r[Regs_F] = z8.r[Regs_F] & 1 | 16 | z8.r[Regs_B] & 40;
    z8.r[Regs_B] & 32 || (z8.r[Regs_F] |= 68)
};
z8oT_c203[105] = function() {
    z8.r[Regs_F] = z8.r[Regs_F] & 1 | 16 | z8.r[Regs_C] & 40;
    z8.r[Regs_C] & 32 || (z8.r[Regs_F] |= 68)
};
z8oT_c203[106] = function() {
    z8.r[Regs_F] = z8.r[Regs_F] & 1 | 16 | z8.r[Regs_D] & 40;
    z8.r[Regs_D] & 32 || (z8.r[Regs_F] |= 68)
};
z8oT_c203[107] = function() {
    z8.r[Regs_F] = z8.r[Regs_F] & 1 | 16 | z8.r[Regs_E] & 40;
    z8.r[Regs_E] & 32 || (z8.r[Regs_F] |= 68)
};
z8oT_c203[108] = function() {
    z8.r[Regs_F] = z8.r[Regs_F] & 1 | 16 | z8.r[Regs_H] & 40;
    z8.r[Regs_H] & 32 || (z8.r[Regs_F] |= 68)
};
z8oT_c203[109] = function() {
    z8.r[Regs_F] = z8.r[Regs_F] & 1 | 16 | z8.r[Regs_L] & 40;
    z8.r[Regs_L] & 32 || (z8.r[Regs_F] |= 68)
};
z8oT_c203[110] = function() {
    var c = wQj(z8.r[Regs_L] | z8.r[Regs_H] << 8);
    tss += 4;
    z8.r[Regs_F] = z8.r[Regs_F] & 1 | 16 | c & 40;
    c & 32 || (z8.r[Regs_F] |= 68)
};
z8oT_c203[111] = function() {
    z8.r[Regs_F] = z8.r[Regs_F] & 1 | 16 | z8.r[Regs_A] & 40;
    z8.r[Regs_A] & 32 || (z8.r[Regs_F] |= 68)
};
z8oT_c203[112] = function() {
    z8.r[Regs_F] = z8.r[Regs_F] & 1 | 16 | z8.r[Regs_B] & 40;
    z8.r[Regs_B] & 64 || (z8.r[Regs_F] |= 68)
};
z8oT_c203[113] = function() {
    z8.r[Regs_F] = z8.r[Regs_F] & 1 | 16 | z8.r[Regs_C] & 40;
    z8.r[Regs_C] & 64 || (z8.r[Regs_F] |= 68)
};
z8oT_c203[114] = function() {
    z8.r[Regs_F] = z8.r[Regs_F] & 1 | 16 | z8.r[Regs_D] & 40;
    z8.r[Regs_D] & 64 || (z8.r[Regs_F] |= 68)
};
z8oT_c203[115] = function() {
    z8.r[Regs_F] = z8.r[Regs_F] & 1 | 16 | z8.r[Regs_E] & 40;
    z8.r[Regs_E] & 64 || (z8.r[Regs_F] |= 68)
};
z8oT_c203[116] = function() {
    z8.r[Regs_F] = z8.r[Regs_F] & 1 | 16 | z8.r[Regs_H] & 40;
    z8.r[Regs_H] & 64 || (z8.r[Regs_F] |= 68)
};
z8oT_c203[117] = function() {
    z8.r[Regs_F] = z8.r[Regs_F] & 1 | 16 | z8.r[Regs_L] & 40;
    z8.r[Regs_L] & 64 || (z8.r[Regs_F] |= 68)
};
z8oT_c203[118] = function() {
    var c = wQj(z8.r[Regs_L] | z8.r[Regs_H] << 8);
    tss += 4;
    z8.r[Regs_F] = z8.r[Regs_F] & 1 | 16 | c & 40;
    c & 64 || (z8.r[Regs_F] |= 68)
};
z8oT_c203[119] = function() {
    z8.r[Regs_F] = z8.r[Regs_F] & 1 | 16 | z8.r[Regs_A] & 40;
    z8.r[Regs_A] & 64 || (z8.r[Regs_F] |= 68)
};
z8oT_c203[120] = function() {
    z8.r[Regs_F] = z8.r[Regs_F] & 1 | 16 | z8.r[Regs_B] & 40;
    z8.r[Regs_B] & 128 || (z8.r[Regs_F] |= 68);
    z8.r[Regs_B] & 128 && (z8.r[Regs_F] |= 128)
};
z8oT_c203[121] = function() {
    z8.r[Regs_F] = z8.r[Regs_F] & 1 | 16 | z8.r[Regs_C] & 40;
    z8.r[Regs_C] & 128 || (z8.r[Regs_F] |= 68);
    z8.r[Regs_C] & 128 && (z8.r[Regs_F] |= 128)
};
z8oT_c203[122] = function() {
    z8.r[Regs_F] = z8.r[Regs_F] & 1 | 16 | z8.r[Regs_D] & 40;
    z8.r[Regs_D] & 128 || (z8.r[Regs_F] |= 68);
    z8.r[Regs_D] & 128 && (z8.r[Regs_F] |= 128)
};
z8oT_c203[123] = function() {
    z8.r[Regs_F] = z8.r[Regs_F] & 1 | 16 | z8.r[Regs_E] & 40;
    z8.r[Regs_E] & 128 || (z8.r[Regs_F] |= 68);
    z8.r[Regs_E] & 128 && (z8.r[Regs_F] |= 128)
};
z8oT_c203[124] = function() {
    z8.r[Regs_F] = z8.r[Regs_F] & 1 | 16 | z8.r[Regs_H] & 40;
    z8.r[Regs_H] & 128 || (z8.r[Regs_F] |= 68);
    z8.r[Regs_H] & 128 && (z8.r[Regs_F] |= 128)
};
z8oT_c203[125] = function() {
    z8.r[Regs_F] = z8.r[Regs_F] & 1 | 16 | z8.r[Regs_L] & 40;
    z8.r[Regs_L] & 128 || (z8.r[Regs_F] |= 68);
    z8.r[Regs_L] & 128 && (z8.r[Regs_F] |= 128)
};
z8oT_c203[126] = function() {
    var c = wQj(z8.r[Regs_L] | z8.r[Regs_H] << 8);
    tss += 4;
    z8.r[Regs_F] = z8.r[Regs_F] & 1 | 16 | c & 40;
    c & 128 || (z8.r[Regs_F] |= 68);
    c & 128 && (z8.r[Regs_F] |= 128)
};
z8oT_c203[127] = function() {
    z8.r[Regs_F] = z8.r[Regs_F] & 1 | 16 | z8.r[Regs_A] & 40;
    z8.r[Regs_A] & 128 || (z8.r[Regs_F] |= 68);
    z8.r[Regs_A] & 128 && (z8.r[Regs_F] |= 128)
};
z8oT_c203[128] = function() {
    z8.r[Regs_B] &= 254
};
z8oT_c203[129] = function() {
    z8.r[Regs_C] &= 254
};
z8oT_c203[130] = function() {
    z8.r[Regs_D] &= 254
};
z8oT_c203[131] = function() {
    z8.r[Regs_E] &= 254
};
z8oT_c203[132] = function() {
    z8.r[Regs_H] &= 254
};
z8oT_c203[133] = function() {
    z8.r[Regs_L] &= 254
};
z8oT_c203[134] = function() {
    tss += 4;
    tss += 3;
    wQi(z8.r[Regs_L] | z8.r[Regs_H] << 8, wQj(z8.r[Regs_L] | z8.r[Regs_H] << 8) & 254)
};
z8oT_c203[135] = function() {
    z8.r[Regs_A] &= 254
};
z8oT_c203[136] = function() {
    z8.r[Regs_B] &= 253
};
z8oT_c203[137] = function() {
    z8.r[Regs_C] &= 253
};
z8oT_c203[138] = function() {
    z8.r[Regs_D] &= 253
};
z8oT_c203[139] = function() {
    z8.r[Regs_E] &= 253
};
z8oT_c203[140] = function() {
    z8.r[Regs_H] &= 253
};
z8oT_c203[141] = function() {
    z8.r[Regs_L] &= 253
};
z8oT_c203[142] = function() {
    tss += 7;
    wQi(z8.r[Regs_L] | z8.r[Regs_H] << 8, wQj(z8.r[Regs_L] | z8.r[Regs_H] << 8) & 253)
};
z8oT_c203[143] = function() {
    z8.r[Regs_A] &= 253
};
z8oT_c203[144] = function() {
    z8.r[Regs_B] &= 251
};
z8oT_c203[145] = function() {
    z8.r[Regs_C] &= 251
};
z8oT_c203[146] = function() {
    z8.r[Regs_D] &= 251
};
z8oT_c203[147] = function() {
    z8.r[Regs_E] &= 251
};
z8oT_c203[148] = function() {
    z8.r[Regs_H] &= 251
};
z8oT_c203[149] = function() {
    z8.r[Regs_L] &= 251
};
z8oT_c203[150] = function() {
    tss += 7;
    wQi(z8.r[Regs_L] | z8.r[Regs_H] << 8, wQj(z8.r[Regs_L] | z8.r[Regs_H] << 8) & 251)
};
z8oT_c203[151] = function() {
    z8.r[Regs_A] &= 251
};
z8oT_c203[152] = function() {
    z8.r[Regs_B] &= 247
};
z8oT_c203[153] = function() {
    z8.r[Regs_C] &= 247
};
z8oT_c203[154] = function() {
    z8.r[Regs_D] &= 247
};
z8oT_c203[155] = function() {
    z8.r[Regs_E] &= 247
};
z8oT_c203[156] = function() {
    z8.r[Regs_H] &= 247
};
z8oT_c203[157] = function() {
    z8.r[Regs_L] &= 247
};
z8oT_c203[158] = function() {
    tss += 7;
    wQi(z8.r[Regs_L] | z8.r[Regs_H] << 8, wQj(z8.r[Regs_L] | z8.r[Regs_H] << 8) & 247)
};
z8oT_c203[159] = function() {
    z8.r[Regs_A] &= 247
};
z8oT_c203[160] = function() {
    z8.r[Regs_B] &= 239
};
z8oT_c203[161] = function() {
    z8.r[Regs_C] &= 239
};
z8oT_c203[162] = function() {
    z8.r[Regs_D] &= 239
};
z8oT_c203[163] = function() {
    z8.r[Regs_E] &= 239
};
z8oT_c203[164] = function() {
    z8.r[Regs_H] &= 239
};
z8oT_c203[165] = function() {
    z8.r[Regs_L] &= 239
};
z8oT_c203[166] = function() {
    tss += 7;
    wQi(z8.r[Regs_L] | z8.r[Regs_H] << 8, wQj(z8.r[Regs_L] | z8.r[Regs_H] << 8) & 239)
};
z8oT_c203[167] = function() {
    z8.r[Regs_A] &= 239
};
z8oT_c203[168] = function() {
    z8.r[Regs_B] &= 223
};
z8oT_c203[169] = function() {
    z8.r[Regs_C] &= 223
};
z8oT_c203[170] = function() {
    z8.r[Regs_D] &= 223
};
z8oT_c203[171] = function() {
    z8.r[Regs_E] &= 223
};
z8oT_c203[172] = function() {
    z8.r[Regs_H] &= 223
};
z8oT_c203[173] = function() {
    z8.r[Regs_L] &= 223
};
z8oT_c203[174] = function() {
    tss += 7;
    wQi(z8.r[Regs_L] | z8.r[Regs_H] << 8, wQj(z8.r[Regs_L] | z8.r[Regs_H] << 8) & 223)
};
z8oT_c203[175] = function() {
    z8.r[Regs_A] &= 223
};
z8oT_c203[176] = function() {
    z8.r[Regs_B] &= 191
};
z8oT_c203[177] = function() {
    z8.r[Regs_C] &= 191
};
z8oT_c203[178] = function() {
    z8.r[Regs_D] &= 191
};
z8oT_c203[179] = function() {
    z8.r[Regs_E] &= 191
};
z8oT_c203[180] = function() {
    z8.r[Regs_H] &= 191
};
z8oT_c203[181] = function() {
    z8.r[Regs_L] &= 191
};
z8oT_c203[182] = function() {
    tss += 7;
    wQi(z8.r[Regs_L] | z8.r[Regs_H] << 8, wQj(z8.r[Regs_L] | z8.r[Regs_H] << 8) & 191)
};
z8oT_c203[183] = function() {
    z8.r[Regs_A] &= 191
};
z8oT_c203[184] = function() {
    z8.r[Regs_B] &= 127
};
z8oT_c203[185] = function() {
    z8.r[Regs_C] &= 127
};
z8oT_c203[186] = function() {
    z8.r[Regs_D] &= 127
};
z8oT_c203[187] = function() {
    z8.r[Regs_E] &= 127
};
z8oT_c203[188] = function() {
    z8.r[Regs_H] &= 127
};
z8oT_c203[189] = function() {
    z8.r[Regs_L] &= 127
};
z8oT_c203[190] = function() {
    tss += 7;
    wQi(z8.r[Regs_L] | z8.r[Regs_H] << 8, wQj(z8.r[Regs_L] | z8.r[Regs_H] << 8) & 127)
};
z8oT_c203[191] = function() {
    z8.r[Regs_A] &= 127
};
z8oT_c203[192] = function() {
    z8.r[Regs_B] |= 1
};
z8oT_c203[193] = function() {
    z8.r[Regs_C] |= 1
};
z8oT_c203[194] = function() {
    z8.r[Regs_D] |= 1
};
z8oT_c203[195] = function() {
    z8.r[Regs_E] |= 1
};
z8oT_c203[196] = function() {
    z8.r[Regs_H] |= 1
};
z8oT_c203[197] = function() {
    z8.r[Regs_L] |= 1
};
z8oT_c203[198] = function() {
    tss += 4;
    tss += 3;
    wQi(z8.r[Regs_L] | z8.r[Regs_H] << 8, wQj(z8.r[Regs_L] | z8.r[Regs_H] << 8) | 1)
};
z8oT_c203[199] = function() {
    z8.r[Regs_A] |= 1
};
z8oT_c203[200] = function() {
    z8.r[Regs_B] |= 2
};
z8oT_c203[201] = function() {
    z8.r[Regs_C] |= 2
};
z8oT_c203[202] = function() {
    z8.r[Regs_D] |= 2
};
z8oT_c203[203] = function() {
    z8.r[Regs_E] |= 2
};
z8oT_c203[204] = function() {
    z8.r[Regs_H] |= 2
};
z8oT_c203[205] = function() {
    z8.r[Regs_L] |= 2
};
z8oT_c203[206] = function() {
    tss += 7;
    wQi(z8.r[Regs_L] | z8.r[Regs_H] << 8, wQj(z8.r[Regs_L] | z8.r[Regs_H] << 8) | 2)
};
z8oT_c203[207] = function() {
    z8.r[Regs_A] |= 2
};
z8oT_c203[208] = function() {
    z8.r[Regs_B] |= 4
};
z8oT_c203[209] = function() {
    z8.r[Regs_C] |= 4
};
z8oT_c203[210] = function() {
    z8.r[Regs_D] |= 4
};
z8oT_c203[211] = function() {
    z8.r[Regs_E] |= 4
};
z8oT_c203[212] = function() {
    z8.r[Regs_H] |= 4
};
z8oT_c203[213] = function() {
    z8.r[Regs_L] |= 4
};
z8oT_c203[214] = function() {
    tss += 7;
    wQi(z8.r[Regs_L] | z8.r[Regs_H] << 8, wQj(z8.r[Regs_L] | z8.r[Regs_H] << 8) | 4)
};
z8oT_c203[215] = function() {
    z8.r[Regs_A] |= 4
};
z8oT_c203[216] = function() {
    z8.r[Regs_B] |= 8
};
z8oT_c203[217] = function() {
    z8.r[Regs_C] |= 8
};
z8oT_c203[218] = function() {
    z8.r[Regs_D] |= 8
};
z8oT_c203[219] = function() {
    z8.r[Regs_E] |= 8
};
z8oT_c203[220] = function() {
    z8.r[Regs_H] |= 8
};
z8oT_c203[221] = function() {
    z8.r[Regs_L] |= 8
};
z8oT_c203[222] = function() {
    tss += 7;
    wQi(z8.r[Regs_L] | z8.r[Regs_H] << 8, wQj(z8.r[Regs_L] | z8.r[Regs_H] << 8) | 8)
};
z8oT_c203[223] = function() {
    z8.r[Regs_A] |= 8
};
z8oT_c203[224] = function() {
    z8.r[Regs_B] |= 16
};
z8oT_c203[225] = function() {
    z8.r[Regs_C] |= 16
};
z8oT_c203[226] = function() {
    z8.r[Regs_D] |= 16
};
z8oT_c203[227] = function() {
    z8.r[Regs_E] |= 16
};
z8oT_c203[228] = function() {
    z8.r[Regs_H] |= 16
};
z8oT_c203[229] = function() {
    z8.r[Regs_L] |= 16
};
z8oT_c203[230] = function() {
    tss += 7;
    wQi(z8.r[Regs_L] | z8.r[Regs_H] << 8, wQj(z8.r[Regs_L] | z8.r[Regs_H] << 8) | 16)
};
z8oT_c203[231] = function() {
    z8.r[Regs_A] |= 16
};
z8oT_c203[232] = function() {
    z8.r[Regs_B] |= 32
};
z8oT_c203[233] = function() {
    z8.r[Regs_C] |= 32
};
z8oT_c203[234] = function() {
    z8.r[Regs_D] |= 32
};
z8oT_c203[235] = function() {
    z8.r[Regs_E] |= 32
};
z8oT_c203[236] = function() {
    z8.r[Regs_H] |= 32
};
z8oT_c203[237] = function() {
    z8.r[Regs_L] |= 32
};
z8oT_c203[238] = function() {
    tss += 7;
    wQi(z8.r[Regs_L] | z8.r[Regs_H] << 8, wQj(z8.r[Regs_L] | z8.r[Regs_H] << 8) | 32)
};
z8oT_c203[239] = function() {
    z8.r[Regs_A] |= 32
};
z8oT_c203[240] = function() {
    z8.r[Regs_B] |= 64
};
z8oT_c203[241] = function() {
    z8.r[Regs_C] |= 64
};
z8oT_c203[242] = function() {
    z8.r[Regs_D] |= 64
};
z8oT_c203[243] = function() {
    z8.r[Regs_E] |= 64
};
z8oT_c203[244] = function() {
    z8.r[Regs_H] |= 64
};
z8oT_c203[245] = function() {
    z8.r[Regs_L] |= 64
};
z8oT_c203[246] = function() {
    tss += 7;
    wQi(z8.r[Regs_L] | z8.r[Regs_H] << 8, wQj(z8.r[Regs_L] | z8.r[Regs_H] << 8) | 64)
};
z8oT_c203[247] = function() {
    z8.r[Regs_A] |= 64
};
z8oT_c203[248] = function() {
    z8.r[Regs_B] |= 128
};
z8oT_c203[249] = function() {
    z8.r[Regs_C] |= 128
};
z8oT_c203[250] = function() {
    z8.r[Regs_D] |= 128
};
z8oT_c203[251] = function() {
    z8.r[Regs_E] |= 128
};
z8oT_c203[252] = function() {
    z8.r[Regs_H] |= 128
};
z8oT_c203[253] = function() {
    z8.r[Regs_L] |= 128
};
z8oT_c203[254] = function() {
    tss += 7;
    wQi(z8.r[Regs_L] | z8.r[Regs_H] << 8, wQj(z8.r[Regs_L] | z8.r[Regs_H] << 8) | 128)
};
z8oT_c203[255] = function() {
    z8.r[Regs_A] |= 128
};
z8oT_c203[256] = z8oT_c203[255];
window.z8oT_c221c203 = Array(257);
z8oT_c221c203[0] = function(c) {
    tss += 8;
    z8.r[Regs_B] = wQj(c);
    z8.r[Regs_B] = (z8.r[Regs_B] & 127) << 1 | z8.r[Regs_B] >> 7;
    z8.r[Regs_F] = z8.r[Regs_B] & 1 | zTe6[z8.r[Regs_B]];
    wQi(c, z8.r[Regs_B])
};
z8oT_c221c203[1] = function(c) {
    tss += 8;
    z8.r[Regs_C] = wQj(c);
    z8.r[Regs_C] = (z8.r[Regs_C] & 127) << 1 | z8.r[Regs_C] >> 7;
    z8.r[Regs_F] = z8.r[Regs_C] & 1 | zTe6[z8.r[Regs_C]];
    wQi(c, z8.r[Regs_C])
};
z8oT_c221c203[2] = function(c) {
    tss += 8;
    z8.r[Regs_D] = wQj(c);
    z8.r[Regs_D] = (z8.r[Regs_D] & 127) << 1 | z8.r[Regs_D] >> 7;
    z8.r[Regs_F] = z8.r[Regs_D] & 1 | zTe6[z8.r[Regs_D]];
    wQi(c, z8.r[Regs_D])
};
z8oT_c221c203[3] = function(c) {
    tss += 8;
    z8.r[Regs_E] = wQj(c);
    z8.r[Regs_E] = (z8.r[Regs_E] & 127) << 1 | z8.r[Regs_E] >> 7;
    z8.r[Regs_F] = z8.r[Regs_E] & 1 | zTe6[z8.r[Regs_E]];
    wQi(c, z8.r[Regs_E])
};
z8oT_c221c203[4] = function(c) {
    tss += 8;
    z8.r[Regs_H] = wQj(c);
    z8.r[Regs_H] = (z8.r[Regs_H] & 127) << 1 | z8.r[Regs_H] >> 7;
    z8.r[Regs_F] = z8.r[Regs_H] & 1 | zTe6[z8.r[Regs_H]];
    wQi(c, z8.r[Regs_H])
};
z8oT_c221c203[5] = function(c) {
    tss += 8;
    z8.r[Regs_L] = wQj(c);
    z8.r[Regs_L] = (z8.r[Regs_L] & 127) << 1 | z8.r[Regs_L] >> 7;
    z8.r[Regs_F] = z8.r[Regs_L] & 1 | zTe6[z8.r[Regs_L]];
    wQi(c, z8.r[Regs_L])
};
z8oT_c221c203[6] = function(c) {
    tss += 8;
    var d = wQj(c),
        d = (d & 127) << 1 | d >> 7;
    z8.r[Regs_F] = d & 1 | zTe6[d];
    wQi(c, d)
};
z8oT_c221c203[7] = function(c) {
    tss += 8;
    z8.r[Regs_A] = wQj(c);
    z8.r[Regs_A] = (z8.r[Regs_A] & 127) << 1 | z8.r[Regs_A] >> 7;
    z8.r[Regs_F] = z8.r[Regs_A] & 1 | zTe6[z8.r[Regs_A]];
    wQi(c, z8.r[Regs_A])
};
z8oT_c221c203[8] = function(c) {
    tss += 8;
    z8.r[Regs_B] = wQj(c);
    z8.r[Regs_F] = z8.r[Regs_B] & 1;
    z8.r[Regs_B] = z8.r[Regs_B] >> 1 | (z8.r[Regs_B] & 1) << 7;
    z8.r[Regs_F] |= zTe6[z8.r[Regs_B]];
    wQi(c, z8.r[Regs_B])
};
z8oT_c221c203[9] = function(c) {
    tss += 8;
    z8.r[Regs_C] = wQj(c);
    z8.r[Regs_F] = z8.r[Regs_C] & 1;
    z8.r[Regs_C] = z8.r[Regs_C] >> 1 | (z8.r[Regs_C] & 1) << 7;
    z8.r[Regs_F] |= zTe6[z8.r[Regs_C]];
    wQi(c, z8.r[Regs_C])
};
z8oT_c221c203[10] = function(c) {
    tss += 8;
    z8.r[Regs_D] = wQj(c);
    z8.r[Regs_F] = z8.r[Regs_D] & 1;
    z8.r[Regs_D] = z8.r[Regs_D] >> 1 | (z8.r[Regs_D] & 1) << 7;
    z8.r[Regs_F] |= zTe6[z8.r[Regs_D]];
    wQi(c, z8.r[Regs_D])
};
z8oT_c221c203[11] = function(c) {
    tss += 8;
    z8.r[Regs_E] = wQj(c);
    z8.r[Regs_F] = z8.r[Regs_E] & 1;
    z8.r[Regs_E] = z8.r[Regs_E] >> 1 | (z8.r[Regs_E] & 1) << 7;
    z8.r[Regs_F] |= zTe6[z8.r[Regs_E]];
    wQi(c, z8.r[Regs_E])
};
z8oT_c221c203[12] = function(c) {
    tss += 8;
    z8.r[Regs_H] = wQj(c);
    z8.r[Regs_F] = z8.r[Regs_H] & 1;
    z8.r[Regs_H] = z8.r[Regs_H] >> 1 | (z8.r[Regs_H] & 1) << 7;
    z8.r[Regs_F] |= zTe6[z8.r[Regs_H]];
    wQi(c, z8.r[Regs_H])
};
z8oT_c221c203[13] = function(c) {
    tss += 8;
    z8.r[Regs_L] = wQj(c);
    z8.r[Regs_F] = z8.r[Regs_L] & 1;
    z8.r[Regs_L] = z8.r[Regs_L] >> 1 | (z8.r[Regs_L] & 1) << 7;
    z8.r[Regs_F] |= zTe6[z8.r[Regs_L]];
    wQi(c, z8.r[Regs_L])
};
z8oT_c221c203[14] = function(c) {
    tss += 8;
    var d = wQj(c);
    z8.r[Regs_F] = d & 1;
    d = d >> 1 | (d & 1) << 7;
    z8.r[Regs_F] |= zTe6[d];
    wQi(c, d)
};
z8oT_c221c203[15] = function(c) {
    tss += 8;
    z8.r[Regs_A] = wQj(c);
    z8.r[Regs_F] = z8.r[Regs_A] & 1;
    z8.r[Regs_A] = z8.r[Regs_A] >> 1 | (z8.r[Regs_A] & 1) << 7;
    z8.r[Regs_F] |= zTe6[z8.r[Regs_A]];
    wQi(c, z8.r[Regs_A])
};
z8oT_c221c203[16] = function(c) {
    tss += 8;
    z8.r[Regs_B] = wQj(c);
    var d = z8.r[Regs_B];
    z8.r[Regs_B] = (z8.r[Regs_B] & 127) << 1 | z8.r[Regs_F] & 1;
    z8.r[Regs_F] = d >> 7 | zTe6[z8.r[Regs_B]];
    wQi(c, z8.r[Regs_B])
};
z8oT_c221c203[17] = function(c) {
    tss += 8;
    z8.r[Regs_C] = wQj(c);
    var d = z8.r[Regs_C];
    z8.r[Regs_C] = (z8.r[Regs_C] & 127) << 1 | z8.r[Regs_F] & 1;
    z8.r[Regs_F] = d >> 7 | zTe6[z8.r[Regs_C]];
    wQi(c, z8.r[Regs_C])
};
z8oT_c221c203[18] = function(c) {
    tss += 8;
    z8.r[Regs_D] = wQj(c);
    var d = z8.r[Regs_D];
    z8.r[Regs_D] = (z8.r[Regs_D] & 127) << 1 | z8.r[Regs_F] & 1;
    z8.r[Regs_F] = d >> 7 | zTe6[z8.r[Regs_D]];
    wQi(c, z8.r[Regs_D])
};
z8oT_c221c203[19] = function(c) {
    tss += 8;
    z8.r[Regs_E] = wQj(c);
    var d = z8.r[Regs_E];
    z8.r[Regs_E] = (z8.r[Regs_E] & 127) << 1 | z8.r[Regs_F] & 1;
    z8.r[Regs_F] = d >> 7 | zTe6[z8.r[Regs_E]];
    wQi(c, z8.r[Regs_E])
};
z8oT_c221c203[20] = function(c) {
    tss += 8;
    z8.r[Regs_H] = wQj(c);
    var d = z8.r[Regs_H];
    z8.r[Regs_H] = (z8.r[Regs_H] & 127) << 1 | z8.r[Regs_F] & 1;
    z8.r[Regs_F] = d >> 7 | zTe6[z8.r[Regs_H]];
    wQi(c, z8.r[Regs_H])
};
z8oT_c221c203[21] = function(c) {
    tss += 8;
    z8.r[Regs_L] = wQj(c);
    var d = z8.r[Regs_L];
    z8.r[Regs_L] = (z8.r[Regs_L] & 127) << 1 | z8.r[Regs_F] & 1;
    z8.r[Regs_F] = d >> 7 | zTe6[z8.r[Regs_L]];
    wQi(c, z8.r[Regs_L])
};
z8oT_c221c203[22] = function(c) {
    tss += 8;
    var d = wQj(c),
        f = (d & 127) << 1 | z8.r[Regs_F] & 1;
    z8.r[Regs_F] = d >> 7 | zTe6[f];
    wQi(c, f)
};
z8oT_c221c203[23] = function(c) {
    tss += 8;
    z8.r[Regs_A] = wQj(c);
    var d = z8.r[Regs_A];
    z8.r[Regs_A] = (z8.r[Regs_A] & 127) << 1 | z8.r[Regs_F] & 1;
    z8.r[Regs_F] = d >> 7 | zTe6[z8.r[Regs_A]];
    wQi(c, z8.r[Regs_A])
};
z8oT_c221c203[24] = function(c) {
    tss += 8;
    z8.r[Regs_B] = wQj(c);
    var d = z8.r[Regs_B];
    z8.r[Regs_B] = z8.r[Regs_B] >> 1 | (z8.r[Regs_F] & 1) << 7;
    z8.r[Regs_F] = d & 1 | zTe6[z8.r[Regs_B]];
    wQi(c, z8.r[Regs_B])
};
z8oT_c221c203[25] = function(c) {
    tss += 8;
    z8.r[Regs_C] = wQj(c);
    var d = z8.r[Regs_C];
    z8.r[Regs_C] = z8.r[Regs_C] >> 1 | (z8.r[Regs_F] & 1) << 7;
    z8.r[Regs_F] = d & 1 | zTe6[z8.r[Regs_C]];
    wQi(c, z8.r[Regs_C])
};
z8oT_c221c203[26] = function(c) {
    tss += 8;
    z8.r[Regs_D] = wQj(c);
    var d = z8.r[Regs_D];
    z8.r[Regs_D] = z8.r[Regs_D] >> 1 | (z8.r[Regs_F] & 1) << 7;
    z8.r[Regs_F] = d & 1 | zTe6[z8.r[Regs_D]];
    wQi(c, z8.r[Regs_D])
};
z8oT_c221c203[27] = function(c) {
    tss += 8;
    z8.r[Regs_E] = wQj(c);
    var d = z8.r[Regs_E];
    z8.r[Regs_E] = z8.r[Regs_E] >> 1 | (z8.r[Regs_F] & 1) << 7;
    z8.r[Regs_F] = d & 1 | zTe6[z8.r[Regs_E]];
    wQi(c, z8.r[Regs_E])
};
z8oT_c221c203[28] = function(c) {
    tss += 8;
    z8.r[Regs_H] = wQj(c);
    var d = z8.r[Regs_H];
    z8.r[Regs_H] = z8.r[Regs_H] >> 1 | (z8.r[Regs_F] & 1) << 7;
    z8.r[Regs_F] = d & 1 | zTe6[z8.r[Regs_H]];
    wQi(c, z8.r[Regs_H])
};
z8oT_c221c203[29] = function(c) {
    tss += 8;
    z8.r[Regs_L] = wQj(c);
    var d = z8.r[Regs_L];
    z8.r[Regs_L] = z8.r[Regs_L] >> 1 | (z8.r[Regs_F] & 1) << 7;
    z8.r[Regs_F] = d & 1 | zTe6[z8.r[Regs_L]];
    wQi(c, z8.r[Regs_L])
};
z8oT_c221c203[30] = function(c) {
    tss += 8;
    var d = wQj(c),
        f = d >> 1 | (z8.r[Regs_F] & 1) << 7;
    z8.r[Regs_F] = d & 1 | zTe6[f];
    wQi(c, f)
};
z8oT_c221c203[31] = function(c) {
    tss += 8;
    z8.r[Regs_A] = wQj(c);
    var d = z8.r[Regs_A];
    z8.r[Regs_A] = z8.r[Regs_A] >> 1 | (z8.r[Regs_F] & 1) << 7;
    z8.r[Regs_F] = d & 1 | zTe6[z8.r[Regs_A]];
    wQi(c, z8.r[Regs_A])
};
z8oT_c221c203[32] = function(c) {
    tss += 8;
    z8.r[Regs_B] = wQj(c);
    z8.r[Regs_F] = z8.r[Regs_B] >> 7;
    z8.r[Regs_B] <<= 1;
    z8.r[Regs_B] &= 255;
    z8.r[Regs_F] |= zTe6[z8.r[Regs_B]];
    wQi(c, z8.r[Regs_B])
};
z8oT_c221c203[33] = function(c) {
    tss += 8;
    z8.r[Regs_C] = wQj(c);
    z8.r[Regs_F] = z8.r[Regs_C] >> 7;
    z8.r[Regs_C] <<= 1;
    z8.r[Regs_C] &= 255;
    z8.r[Regs_F] |= zTe6[z8.r[Regs_C]];
    wQi(c, z8.r[Regs_C])
};
z8oT_c221c203[34] = function(c) {
    tss += 8;
    z8.r[Regs_D] = wQj(c);
    z8.r[Regs_F] = z8.r[Regs_D] >> 7;
    z8.r[Regs_D] <<= 1;
    z8.r[Regs_D] &= 255;
    z8.r[Regs_F] |= zTe6[z8.r[Regs_D]];
    wQi(c, z8.r[Regs_D])
};
z8oT_c221c203[35] = function(c) {
    tss += 8;
    z8.r[Regs_E] = wQj(c);
    z8.r[Regs_F] = z8.r[Regs_E] >> 7;
    z8.r[Regs_E] <<= 1;
    z8.r[Regs_E] &= 255;
    z8.r[Regs_F] |= zTe6[z8.r[Regs_E]];
    wQi(c, z8.r[Regs_E])
};
z8oT_c221c203[36] = function(c) {
    tss += 8;
    z8.r[Regs_H] = wQj(c);
    z8.r[Regs_F] = z8.r[Regs_H] >> 7;
    z8.r[Regs_H] <<= 1;
    z8.r[Regs_H] &= 255;
    z8.r[Regs_F] |= zTe6[z8.r[Regs_H]];
    wQi(c, z8.r[Regs_H])
};
z8oT_c221c203[37] = function(c) {
    tss += 8;
    z8.r[Regs_L] = wQj(c);
    z8.r[Regs_F] = z8.r[Regs_L] >> 7;
    z8.r[Regs_L] <<= 1;
    z8.r[Regs_L] &= 255;
    z8.r[Regs_F] |= zTe6[z8.r[Regs_L]];
    wQi(c, z8.r[Regs_L])
};
z8oT_c221c203[38] = function(c) {
    tss += 8;
    var d = wQj(c);
    z8.r[Regs_F] = d >> 7;
    d = d << 1 & 255;
    z8.r[Regs_F] |= zTe6[d];
    wQi(c, d)
};
z8oT_c221c203[39] = function(c) {
    tss += 8;
    z8.r[Regs_A] = wQj(c);
    z8.r[Regs_F] = z8.r[Regs_A] >> 7;
    z8.r[Regs_A] <<= 1;
    z8.r[Regs_A] &= 255;
    z8.r[Regs_F] |= zTe6[z8.r[Regs_A]];
    wQi(c, z8.r[Regs_A])
};
z8oT_c221c203[40] = function(c) {
    tss += 8;
    z8.r[Regs_B] = wQj(c);
    z8.r[Regs_F] = z8.r[Regs_B] & 1;
    z8.r[Regs_B] = z8.r[Regs_B] & 128 | z8.r[Regs_B] >> 1;
    z8.r[Regs_F] |= zTe6[z8.r[Regs_B]];
    wQi(c, z8.r[Regs_B])
};
z8oT_c221c203[41] = function(c) {
    tss += 8;
    z8.r[Regs_C] = wQj(c);
    z8.r[Regs_F] = z8.r[Regs_C] & 1;
    z8.r[Regs_C] = z8.r[Regs_C] & 128 | z8.r[Regs_C] >> 1;
    z8.r[Regs_F] |= zTe6[z8.r[Regs_C]];
    wQi(c, z8.r[Regs_C])
};
z8oT_c221c203[42] = function(c) {
    tss += 8;
    z8.r[Regs_D] = wQj(c);
    z8.r[Regs_F] = z8.r[Regs_D] & 1;
    z8.r[Regs_D] = z8.r[Regs_D] & 128 | z8.r[Regs_D] >> 1;
    z8.r[Regs_F] |= zTe6[z8.r[Regs_D]];
    wQi(c, z8.r[Regs_D])
};
z8oT_c221c203[43] = function(c) {
    tss += 8;
    z8.r[Regs_E] = wQj(c);
    z8.r[Regs_F] = z8.r[Regs_E] & 1;
    z8.r[Regs_E] = z8.r[Regs_E] & 128 | z8.r[Regs_E] >> 1;
    z8.r[Regs_F] |= zTe6[z8.r[Regs_E]];
    wQi(c, z8.r[Regs_E])
};
z8oT_c221c203[44] = function(c) {
    tss += 8;
    z8.r[Regs_H] = wQj(c);
    z8.r[Regs_F] = z8.r[Regs_H] & 1;
    z8.r[Regs_H] = z8.r[Regs_H] & 128 | z8.r[Regs_H] >> 1;
    z8.r[Regs_F] |= zTe6[z8.r[Regs_H]];
    wQi(c, z8.r[Regs_H])
};
z8oT_c221c203[45] = function(c) {
    tss += 8;
    z8.r[Regs_L] = wQj(c);
    z8.r[Regs_F] = z8.r[Regs_L] & 1;
    z8.r[Regs_L] = z8.r[Regs_L] & 128 | z8.r[Regs_L] >> 1;
    z8.r[Regs_F] |= zTe6[z8.r[Regs_L]];
    wQi(c, z8.r[Regs_L])
};
z8oT_c221c203[46] = function(c) {
    tss += 8;
    var d = wQj(c);
    z8.r[Regs_F] = d & 1;
    d = d & 128 | d >> 1;
    z8.r[Regs_F] |= zTe6[d];
    wQi(c, d)
};
z8oT_c221c203[47] = function(c) {
    tss += 8;
    z8.r[Regs_A] = wQj(c);
    z8.r[Regs_F] = z8.r[Regs_A] & 1;
    z8.r[Regs_A] = z8.r[Regs_A] & 128 | z8.r[Regs_A] >> 1;
    z8.r[Regs_F] |= zTe6[z8.r[Regs_A]];
    wQi(c, z8.r[Regs_A])
};
z8oT_c221c203[48] = function(c) {
    tss += 8;
    z8.r[Regs_B] = wQj(c);
    z8.r[Regs_F] = z8.r[Regs_B] >> 7;
    z8.r[Regs_B] = z8.r[Regs_B] << 1 | 1;
    z8.r[Regs_B] &= 255;
    z8.r[Regs_F] |= zTe6[z8.r[Regs_B]];
    wQi(c, z8.r[Regs_B])
};
z8oT_c221c203[49] = function(c) {
    tss += 8;
    z8.r[Regs_C] = wQj(c);
    z8.r[Regs_F] = z8.r[Regs_C] >> 7;
    z8.r[Regs_C] = z8.r[Regs_C] << 1 | 1;
    z8.r[Regs_C] &= 255;
    z8.r[Regs_F] |= zTe6[z8.r[Regs_C]];
    wQi(c, z8.r[Regs_C])
};
z8oT_c221c203[50] = function(c) {
    tss += 8;
    z8.r[Regs_D] = wQj(c);
    z8.r[Regs_F] = z8.r[Regs_D] >> 7;
    z8.r[Regs_D] = z8.r[Regs_D] << 1 | 1;
    z8.r[Regs_D] &= 255;
    z8.r[Regs_F] |= zTe6[z8.r[Regs_D]];
    wQi(c, z8.r[Regs_D])
};
z8oT_c221c203[51] = function(c) {
    tss += 8;
    z8.r[Regs_E] = wQj(c);
    z8.r[Regs_F] = z8.r[Regs_E] >> 7;
    z8.r[Regs_E] = z8.r[Regs_E] << 1 | 1;
    z8.r[Regs_E] &= 255;
    z8.r[Regs_F] |= zTe6[z8.r[Regs_E]];
    wQi(c, z8.r[Regs_E])
};
z8oT_c221c203[52] = function(c) {
    tss += 8;
    z8.r[Regs_H] = wQj(c);
    z8.r[Regs_F] = z8.r[Regs_H] >> 7;
    z8.r[Regs_H] = z8.r[Regs_H] << 1 | 1;
    z8.r[Regs_H] &= 255;
    z8.r[Regs_F] |= zTe6[z8.r[Regs_H]];
    wQi(c, z8.r[Regs_H])
};
z8oT_c221c203[53] = function(c) {
    tss += 8;
    z8.r[Regs_L] = wQj(c);
    z8.r[Regs_F] = z8.r[Regs_L] >> 7;
    z8.r[Regs_L] = z8.r[Regs_L] << 1 | 1;
    z8.r[Regs_L] &= 255;
    z8.r[Regs_F] |= zTe6[z8.r[Regs_L]];
    wQi(c, z8.r[Regs_L])
};
z8oT_c221c203[54] = function(c) {
    tss += 8;
    var d = wQj(c);
    z8.r[Regs_F] = d >> 7;
    d = (d << 1 | 1) & 255;
    z8.r[Regs_F] |= zTe6[d];
    wQi(c, d)
};
z8oT_c221c203[55] = function(c) {
    tss += 8;
    z8.r[Regs_A] = wQj(c);
    z8.r[Regs_F] = z8.r[Regs_A] >> 7;
    z8.r[Regs_A] = z8.r[Regs_A] << 1 | 1;
    z8.r[Regs_A] &= 255;
    z8.r[Regs_F] |= zTe6[z8.r[Regs_A]];
    wQi(c, z8.r[Regs_A])
};
z8oT_c221c203[56] = function(c) {
    tss += 8;
    z8.r[Regs_B] = wQj(c);
    z8.r[Regs_F] = z8.r[Regs_B] & 1;
    z8.r[Regs_B] >>= 1;
    z8.r[Regs_F] |= zTe6[z8.r[Regs_B]];
    wQi(c, z8.r[Regs_B])
};
z8oT_c221c203[57] = function(c) {
    tss += 8;
    z8.r[Regs_C] = wQj(c);
    z8.r[Regs_F] = z8.r[Regs_C] & 1;
    z8.r[Regs_C] >>= 1;
    z8.r[Regs_F] |= zTe6[z8.r[Regs_C]];
    wQi(c, z8.r[Regs_C])
};
z8oT_c221c203[58] = function(c) {
    tss += 8;
    z8.r[Regs_D] = wQj(c);
    z8.r[Regs_F] = z8.r[Regs_D] & 1;
    z8.r[Regs_D] >>= 1;
    z8.r[Regs_F] |= zTe6[z8.r[Regs_D]];
    wQi(c, z8.r[Regs_D])
};
z8oT_c221c203[59] = function(c) {
    tss += 8;
    z8.r[Regs_E] = wQj(c);
    z8.r[Regs_F] = z8.r[Regs_E] & 1;
    z8.r[Regs_E] >>= 1;
    z8.r[Regs_F] |= zTe6[z8.r[Regs_E]];
    wQi(c, z8.r[Regs_E])
};
z8oT_c221c203[60] = function(c) {
    tss += 8;
    z8.r[Regs_H] = wQj(c);
    z8.r[Regs_F] = z8.r[Regs_H] & 1;
    z8.r[Regs_H] >>= 1;
    z8.r[Regs_F] |= zTe6[z8.r[Regs_H]];
    wQi(c, z8.r[Regs_H])
};
z8oT_c221c203[61] = function(c) {
    tss += 8;
    z8.r[Regs_L] = wQj(c);
    z8.r[Regs_F] = z8.r[Regs_L] & 1;
    z8.r[Regs_L] >>= 1;
    z8.r[Regs_F] |= zTe6[z8.r[Regs_L]];
    wQi(c, z8.r[Regs_L])
};
z8oT_c221c203[62] = function(c) {
    tss += 8;
    var d = wQj(c);
    z8.r[Regs_F] = d & 1;
    d >>= 1;
    z8.r[Regs_F] |= zTe6[d];
    wQi(c, d)
};
z8oT_c221c203[63] = function(c) {
    tss += 8;
    z8.r[Regs_A] = wQj(c);
    z8.r[Regs_F] = z8.r[Regs_A] & 1;
    z8.r[Regs_A] >>= 1;
    z8.r[Regs_F] |= zTe6[z8.r[Regs_A]];
    wQi(c, z8.r[Regs_A])
};
z8oT_c221c203[71] = function(c) {
    tss += 5;
    var d = wQj(c);
    z8.r[Regs_F] = z8.r[Regs_F] & 1 | 16 | c >> 8 & 40;
    d & 1 || (z8.r[Regs_F] |= 68)
};
z8oT_c221c203[64] = z8oT_c221c203[71];
z8oT_c221c203[65] = z8oT_c221c203[71];
z8oT_c221c203[66] = z8oT_c221c203[71];
z8oT_c221c203[67] = z8oT_c221c203[71];
z8oT_c221c203[68] = z8oT_c221c203[71];
z8oT_c221c203[69] = z8oT_c221c203[71];
z8oT_c221c203[70] = z8oT_c221c203[71];
z8oT_c221c203[79] = function(c) {
    tss += 5;
    var d = wQj(c);
    z8.r[Regs_F] = z8.r[Regs_F] & 1 | 16 | c >> 8 & 40;
    d & 2 || (z8.r[Regs_F] |= 68)
};
z8oT_c221c203[72] = z8oT_c221c203[79];
z8oT_c221c203[73] = z8oT_c221c203[79];
z8oT_c221c203[74] = z8oT_c221c203[79];
z8oT_c221c203[75] = z8oT_c221c203[79];
z8oT_c221c203[76] = z8oT_c221c203[79];
z8oT_c221c203[77] = z8oT_c221c203[79];
z8oT_c221c203[78] = z8oT_c221c203[79];
z8oT_c221c203[87] = function(c) {
    tss += 5;
    var d = wQj(c);
    z8.r[Regs_F] = z8.r[Regs_F] & 1 | 16 | c >> 8 & 40;
    d & 4 || (z8.r[Regs_F] |= 68)
};
z8oT_c221c203[80] = z8oT_c221c203[87];
z8oT_c221c203[81] = z8oT_c221c203[87];
z8oT_c221c203[82] = z8oT_c221c203[87];
z8oT_c221c203[83] = z8oT_c221c203[87];
z8oT_c221c203[84] = z8oT_c221c203[87];
z8oT_c221c203[85] = z8oT_c221c203[87];
z8oT_c221c203[86] = z8oT_c221c203[87];
z8oT_c221c203[95] = function(c) {
    tss += 5;
    var d = wQj(c);
    z8.r[Regs_F] = z8.r[Regs_F] & 1 | 16 | c >> 8 & 40;
    d & 8 || (z8.r[Regs_F] |= 68)
};
z8oT_c221c203[88] = z8oT_c221c203[95];
z8oT_c221c203[89] = z8oT_c221c203[95];
z8oT_c221c203[90] = z8oT_c221c203[95];
z8oT_c221c203[91] = z8oT_c221c203[95];
z8oT_c221c203[92] = z8oT_c221c203[95];
z8oT_c221c203[93] = z8oT_c221c203[95];
z8oT_c221c203[94] = z8oT_c221c203[95];
z8oT_c221c203[103] = function(c) {
    tss += 5;
    var d = wQj(c);
    z8.r[Regs_F] = z8.r[Regs_F] & 1 | 16 | c >> 8 & 40;
    d & 16 || (z8.r[Regs_F] |= 68)
};
z8oT_c221c203[96] = z8oT_c221c203[103];
z8oT_c221c203[97] = z8oT_c221c203[103];
z8oT_c221c203[98] = z8oT_c221c203[103];
z8oT_c221c203[99] = z8oT_c221c203[103];
z8oT_c221c203[100] = z8oT_c221c203[103];
z8oT_c221c203[101] = z8oT_c221c203[103];
z8oT_c221c203[102] = z8oT_c221c203[103];
z8oT_c221c203[111] = function(c) {
    tss += 5;
    var d = wQj(c);
    z8.r[Regs_F] = z8.r[Regs_F] & 1 | 16 | c >> 8 & 40;
    d & 32 || (z8.r[Regs_F] |= 68)
};
z8oT_c221c203[104] = z8oT_c221c203[111];
z8oT_c221c203[105] = z8oT_c221c203[111];
z8oT_c221c203[106] = z8oT_c221c203[111];
z8oT_c221c203[107] = z8oT_c221c203[111];
z8oT_c221c203[108] = z8oT_c221c203[111];
z8oT_c221c203[109] = z8oT_c221c203[111];
z8oT_c221c203[110] = z8oT_c221c203[111];
z8oT_c221c203[119] = function(c) {
    tss += 5;
    var d = wQj(c);
    z8.r[Regs_F] = z8.r[Regs_F] & 1 | 16 | c >> 8 & 40;
    d & 64 || (z8.r[Regs_F] |= 68)
};
z8oT_c221c203[112] = z8oT_c221c203[119];
z8oT_c221c203[113] = z8oT_c221c203[119];
z8oT_c221c203[114] = z8oT_c221c203[119];
z8oT_c221c203[115] = z8oT_c221c203[119];
z8oT_c221c203[116] = z8oT_c221c203[119];
z8oT_c221c203[117] = z8oT_c221c203[119];
z8oT_c221c203[118] = z8oT_c221c203[119];
z8oT_c221c203[127] = function(c) {
    tss += 5;
    var d = wQj(c);
    z8.r[Regs_F] = z8.r[Regs_F] & 1 | 16 | c >> 8 & 40;
    d & 128 || (z8.r[Regs_F] |= 68);
    d & 128 && (z8.r[Regs_F] |= 128)
};
z8oT_c221c203[120] = z8oT_c221c203[127];
z8oT_c221c203[121] = z8oT_c221c203[127];
z8oT_c221c203[122] = z8oT_c221c203[127];
z8oT_c221c203[123] = z8oT_c221c203[127];
z8oT_c221c203[124] = z8oT_c221c203[127];
z8oT_c221c203[125] = z8oT_c221c203[127];
z8oT_c221c203[126] = z8oT_c221c203[127];
z8oT_c221c203[128] = function(c) {
    tss += 8;
    z8.r[Regs_B] = wQj(c) & 254;
    wQi(c, z8.r[Regs_B])
};
z8oT_c221c203[129] = function(c) {
    tss += 8;
    z8.r[Regs_C] = wQj(c) & 254;
    wQi(c, z8.r[Regs_C])
};
z8oT_c221c203[130] = function(c) {
    tss += 8;
    z8.r[Regs_D] = wQj(c) & 254;
    wQi(c, z8.r[Regs_D])
};
z8oT_c221c203[131] = function(c) {
    tss += 8;
    z8.r[Regs_E] = wQj(c) & 254;
    wQi(c, z8.r[Regs_E])
};
z8oT_c221c203[132] = function(c) {
    tss += 8;
    z8.r[Regs_H] = wQj(c) & 254;
    wQi(c, z8.r[Regs_H])
};
z8oT_c221c203[133] = function(c) {
    tss += 8;
    z8.r[Regs_L] = wQj(c) & 254;
    wQi(c, z8.r[Regs_L])
};
z8oT_c221c203[134] = function(c) {
    tss += 8;
    wQi(c, wQj(c) & 254)
};
z8oT_c221c203[135] = function(c) {
    tss += 8;
    z8.r[Regs_A] = wQj(c) & 254;
    wQi(c, z8.r[Regs_A])
};
z8oT_c221c203[136] = function(c) {
    tss += 8;
    z8.r[Regs_B] = wQj(c) & 253;
    wQi(c, z8.r[Regs_B])
};
z8oT_c221c203[137] = function(c) {
    tss += 8;
    z8.r[Regs_C] = wQj(c) & 253;
    wQi(c, z8.r[Regs_C])
};
z8oT_c221c203[138] = function(c) {
    tss += 8;
    z8.r[Regs_D] = wQj(c) & 253;
    wQi(c, z8.r[Regs_D])
};
z8oT_c221c203[139] = function(c) {
    tss += 8;
    z8.r[Regs_E] = wQj(c) & 253;
    wQi(c, z8.r[Regs_E])
};
z8oT_c221c203[140] = function(c) {
    tss += 8;
    z8.r[Regs_H] = wQj(c) & 253;
    wQi(c, z8.r[Regs_H])
};
z8oT_c221c203[141] = function(c) {
    tss += 8;
    z8.r[Regs_L] = wQj(c) & 253;
    wQi(c, z8.r[Regs_L])
};
z8oT_c221c203[142] = function(c) {
    tss += 8;
    wQi(c, wQj(c) & 253)
};
z8oT_c221c203[143] = function(c) {
    tss += 8;
    z8.r[Regs_A] = wQj(c) & 253;
    wQi(c, z8.r[Regs_A])
};
z8oT_c221c203[144] = function(c) {
    tss += 8;
    z8.r[Regs_B] = wQj(c) & 251;
    wQi(c, z8.r[Regs_B])
};
z8oT_c221c203[145] = function(c) {
    tss += 8;
    z8.r[Regs_C] = wQj(c) & 251;
    wQi(c, z8.r[Regs_C])
};
z8oT_c221c203[146] = function(c) {
    tss += 8;
    z8.r[Regs_D] = wQj(c) & 251;
    wQi(c, z8.r[Regs_D])
};
z8oT_c221c203[147] = function(c) {
    tss += 8;
    z8.r[Regs_E] = wQj(c) & 251;
    wQi(c, z8.r[Regs_E])
};
z8oT_c221c203[148] = function(c) {
    tss += 8;
    z8.r[Regs_H] = wQj(c) & 251;
    wQi(c, z8.r[Regs_H])
};
z8oT_c221c203[149] = function(c) {
    tss += 8;
    z8.r[Regs_L] = wQj(c) & 251;
    wQi(c, z8.r[Regs_L])
};
z8oT_c221c203[150] = function(c) {
    tss += 8;
    wQi(c, wQj(c) & 251)
};
z8oT_c221c203[151] = function(c) {
    tss += 8;
    z8.r[Regs_A] = wQj(c) & 251;
    wQi(c, z8.r[Regs_A])
};
z8oT_c221c203[152] = function(c) {
    tss += 8;
    z8.r[Regs_B] = wQj(c) & 247;
    wQi(c, z8.r[Regs_B])
};
z8oT_c221c203[153] = function(c) {
    tss += 8;
    z8.r[Regs_C] = wQj(c) & 247;
    wQi(c, z8.r[Regs_C])
};
z8oT_c221c203[154] = function(c) {
    tss += 8;
    z8.r[Regs_D] = wQj(c) & 247;
    wQi(c, z8.r[Regs_D])
};
z8oT_c221c203[155] = function(c) {
    tss += 8;
    z8.r[Regs_E] = wQj(c) & 247;
    wQi(c, z8.r[Regs_E])
};
z8oT_c221c203[156] = function(c) {
    tss += 8;
    z8.r[Regs_H] = wQj(c) & 247;
    wQi(c, z8.r[Regs_H])
};
z8oT_c221c203[157] = function(c) {
    tss += 8;
    z8.r[Regs_L] = wQj(c) & 247;
    wQi(c, z8.r[Regs_L])
};
z8oT_c221c203[158] = function(c) {
    tss += 8;
    wQi(c, wQj(c) & 247)
};
z8oT_c221c203[159] = function(c) {
    tss += 8;
    z8.r[Regs_A] = wQj(c) & 247;
    wQi(c, z8.r[Regs_A])
};
z8oT_c221c203[160] = function(c) {
    tss += 8;
    z8.r[Regs_B] = wQj(c) & 239;
    wQi(c, z8.r[Regs_B])
};
z8oT_c221c203[161] = function(c) {
    tss += 8;
    z8.r[Regs_C] = wQj(c) & 239;
    wQi(c, z8.r[Regs_C])
};
z8oT_c221c203[162] = function(c) {
    tss += 8;
    z8.r[Regs_D] = wQj(c) & 239;
    wQi(c, z8.r[Regs_D])
};
z8oT_c221c203[163] = function(c) {
    tss += 8;
    z8.r[Regs_E] = wQj(c) & 239;
    wQi(c, z8.r[Regs_E])
};
z8oT_c221c203[164] = function(c) {
    tss += 8;
    z8.r[Regs_H] = wQj(c) & 239;
    wQi(c, z8.r[Regs_H])
};
z8oT_c221c203[165] = function(c) {
    tss += 8;
    z8.r[Regs_L] = wQj(c) & 239;
    wQi(c, z8.r[Regs_L])
};
z8oT_c221c203[166] = function(c) {
    tss += 8;
    wQi(c, wQj(c) & 239)
};
z8oT_c221c203[167] = function(c) {
    tss += 8;
    z8.r[Regs_A] = wQj(c) & 239;
    wQi(c, z8.r[Regs_A])
};
z8oT_c221c203[168] = function(c) {
    tss += 8;
    z8.r[Regs_B] = wQj(c) & 223;
    wQi(c, z8.r[Regs_B])
};
z8oT_c221c203[169] = function(c) {
    tss += 8;
    z8.r[Regs_C] = wQj(c) & 223;
    wQi(c, z8.r[Regs_C])
};
z8oT_c221c203[170] = function(c) {
    tss += 8;
    z8.r[Regs_D] = wQj(c) & 223;
    wQi(c, z8.r[Regs_D])
};
z8oT_c221c203[171] = function(c) {
    tss += 8;
    z8.r[Regs_E] = wQj(c) & 223;
    wQi(c, z8.r[Regs_E])
};
z8oT_c221c203[172] = function(c) {
    tss += 8;
    z8.r[Regs_H] = wQj(c) & 223;
    wQi(c, z8.r[Regs_H])
};
z8oT_c221c203[173] = function(c) {
    tss += 8;
    z8.r[Regs_L] = wQj(c) & 223;
    wQi(c, z8.r[Regs_L])
};
z8oT_c221c203[174] = function(c) {
    tss += 8;
    wQi(c, wQj(c) & 223)
};
z8oT_c221c203[175] = function(c) {
    tss += 8;
    z8.r[Regs_A] = wQj(c) & 223;
    wQi(c, z8.r[Regs_A])
};
z8oT_c221c203[176] = function(c) {
    tss += 8;
    z8.r[Regs_B] = wQj(c) & 191;
    wQi(c, z8.r[Regs_B])
};
z8oT_c221c203[177] = function(c) {
    tss += 8;
    z8.r[Regs_C] = wQj(c) & 191;
    wQi(c, z8.r[Regs_C])
};
z8oT_c221c203[178] = function(c) {
    tss += 8;
    z8.r[Regs_D] = wQj(c) & 191;
    wQi(c, z8.r[Regs_D])
};
z8oT_c221c203[179] = function(c) {
    tss += 8;
    z8.r[Regs_E] = wQj(c) & 191;
    wQi(c, z8.r[Regs_E])
};
z8oT_c221c203[180] = function(c) {
    tss += 8;
    z8.r[Regs_H] = wQj(c) & 191;
    wQi(c, z8.r[Regs_H])
};
z8oT_c221c203[181] = function(c) {
    tss += 8;
    z8.r[Regs_L] = wQj(c) & 191;
    wQi(c, z8.r[Regs_L])
};
z8oT_c221c203[182] = function(c) {
    tss += 8;
    wQi(c, wQj(c) & 191)
};
z8oT_c221c203[183] = function(c) {
    tss += 8;
    z8.r[Regs_A] = wQj(c) & 191;
    wQi(c, z8.r[Regs_A])
};
z8oT_c221c203[184] = function(c) {
    tss += 8;
    z8.r[Regs_B] = wQj(c) & 127;
    wQi(c, z8.r[Regs_B])
};
z8oT_c221c203[185] = function(c) {
    tss += 8;
    z8.r[Regs_C] = wQj(c) & 127;
    wQi(c, z8.r[Regs_C])
};
z8oT_c221c203[186] = function(c) {
    tss += 8;
    z8.r[Regs_D] = wQj(c) & 127;
    wQi(c, z8.r[Regs_D])
};
z8oT_c221c203[187] = function(c) {
    tss += 8;
    z8.r[Regs_E] = wQj(c) & 127;
    wQi(c, z8.r[Regs_E])
};
z8oT_c221c203[188] = function(c) {
    tss += 8;
    z8.r[Regs_H] = wQj(c) & 127;
    wQi(c, z8.r[Regs_H])
};
z8oT_c221c203[189] = function(c) {
    tss += 8;
    z8.r[Regs_L] = wQj(c) & 127;
    wQi(c, z8.r[Regs_L])
};
z8oT_c221c203[190] = function(c) {
    tss += 8;
    wQi(c, wQj(c) & 127)
};
z8oT_c221c203[191] = function(c) {
    tss += 8;
    z8.r[Regs_A] = wQj(c) & 127;
    wQi(c, z8.r[Regs_A])
};
z8oT_c221c203[192] = function(c) {
    tss += 8;
    z8.r[Regs_B] = wQj(c) | 1;
    wQi(c, z8.r[Regs_B])
};
z8oT_c221c203[193] = function(c) {
    tss += 8;
    z8.r[Regs_C] = wQj(c) | 1;
    wQi(c, z8.r[Regs_C])
};
z8oT_c221c203[194] = function(c) {
    tss += 8;
    z8.r[Regs_D] = wQj(c) | 1;
    wQi(c, z8.r[Regs_D])
};
z8oT_c221c203[195] = function(c) {
    tss += 8;
    z8.r[Regs_E] = wQj(c) | 1;
    wQi(c, z8.r[Regs_E])
};
z8oT_c221c203[196] = function(c) {
    tss += 8;
    z8.r[Regs_H] = wQj(c) | 1;
    wQi(c, z8.r[Regs_H])
};
z8oT_c221c203[197] = function(c) {
    tss += 8;
    z8.r[Regs_L] = wQj(c) | 1;
    wQi(c, z8.r[Regs_L])
};
z8oT_c221c203[198] = function(c) {
    tss += 8;
    wQi(c, wQj(c) | 1)
};
z8oT_c221c203[199] = function(c) {
    tss += 8;
    z8.r[Regs_A] = wQj(c) | 1;
    wQi(c, z8.r[Regs_A])
};
z8oT_c221c203[200] = function(c) {
    tss += 8;
    z8.r[Regs_B] = wQj(c) | 2;
    wQi(c, z8.r[Regs_B])
};
z8oT_c221c203[201] = function(c) {
    tss += 8;
    z8.r[Regs_C] = wQj(c) | 2;
    wQi(c, z8.r[Regs_C])
};
z8oT_c221c203[202] = function(c) {
    tss += 8;
    z8.r[Regs_D] = wQj(c) | 2;
    wQi(c, z8.r[Regs_D])
};
z8oT_c221c203[203] = function(c) {
    tss += 8;
    z8.r[Regs_E] = wQj(c) | 2;
    wQi(c, z8.r[Regs_E])
};
z8oT_c221c203[204] = function(c) {
    tss += 8;
    z8.r[Regs_H] = wQj(c) | 2;
    wQi(c, z8.r[Regs_H])
};
z8oT_c221c203[205] = function(c) {
    tss += 8;
    z8.r[Regs_L] = wQj(c) | 2;
    wQi(c, z8.r[Regs_L])
};
z8oT_c221c203[206] = function(c) {
    tss += 8;
    wQi(c, wQj(c) | 2)
};
z8oT_c221c203[207] = function(c) {
    tss += 8;
    z8.r[Regs_A] = wQj(c) | 2;
    wQi(c, z8.r[Regs_A])
};
z8oT_c221c203[208] = function(c) {
    tss += 8;
    z8.r[Regs_B] = wQj(c) | 4;
    wQi(c, z8.r[Regs_B])
};
z8oT_c221c203[209] = function(c) {
    tss += 8;
    z8.r[Regs_C] = wQj(c) | 4;
    wQi(c, z8.r[Regs_C])
};
z8oT_c221c203[210] = function(c) {
    tss += 8;
    z8.r[Regs_D] = wQj(c) | 4;
    wQi(c, z8.r[Regs_D])
};
z8oT_c221c203[211] = function(c) {
    tss += 8;
    z8.r[Regs_E] = wQj(c) | 4;
    wQi(c, z8.r[Regs_E])
};
z8oT_c221c203[212] = function(c) {
    tss += 8;
    z8.r[Regs_H] = wQj(c) | 4;
    wQi(c, z8.r[Regs_H])
};
z8oT_c221c203[213] = function(c) {
    tss += 8;
    z8.r[Regs_L] = wQj(c) | 4;
    wQi(c, z8.r[Regs_L])
};
z8oT_c221c203[214] = function(c) {
    tss += 8;
    wQi(c, wQj(c) | 4)
};
z8oT_c221c203[215] = function(c) {
    tss += 8;
    z8.r[Regs_A] = wQj(c) | 4;
    wQi(c, z8.r[Regs_A])
};
z8oT_c221c203[216] = function(c) {
    tss += 8;
    z8.r[Regs_B] = wQj(c) | 8;
    wQi(c, z8.r[Regs_B])
};
z8oT_c221c203[217] = function(c) {
    tss += 8;
    z8.r[Regs_C] = wQj(c) | 8;
    wQi(c, z8.r[Regs_C])
};
z8oT_c221c203[218] = function(c) {
    tss += 8;
    z8.r[Regs_D] = wQj(c) | 8;
    wQi(c, z8.r[Regs_D])
};
z8oT_c221c203[219] = function(c) {
    tss += 8;
    z8.r[Regs_E] = wQj(c) | 8;
    wQi(c, z8.r[Regs_E])
};
z8oT_c221c203[220] = function(c) {
    tss += 8;
    z8.r[Regs_H] = wQj(c) | 8;
    wQi(c, z8.r[Regs_H])
};
z8oT_c221c203[221] = function(c) {
    tss += 8;
    z8.r[Regs_L] = wQj(c) | 8;
    wQi(c, z8.r[Regs_L])
};
z8oT_c221c203[222] = function(c) {
    tss += 8;
    wQi(c, wQj(c) | 8)
};
z8oT_c221c203[223] = function(c) {
    tss += 8;
    z8.r[Regs_A] = wQj(c) | 8;
    wQi(c, z8.r[Regs_A])
};
z8oT_c221c203[224] = function(c) {
    tss += 8;
    z8.r[Regs_B] = wQj(c) | 16;
    wQi(c, z8.r[Regs_B])
};
z8oT_c221c203[225] = function(c) {
    tss += 8;
    z8.r[Regs_C] = wQj(c) | 16;
    wQi(c, z8.r[Regs_C])
};
z8oT_c221c203[226] = function(c) {
    tss += 8;
    z8.r[Regs_D] = wQj(c) | 16;
    wQi(c, z8.r[Regs_D])
};
z8oT_c221c203[227] = function(c) {
    tss += 8;
    z8.r[Regs_E] = wQj(c) | 16;
    wQi(c, z8.r[Regs_E])
};
z8oT_c221c203[228] = function(c) {
    tss += 8;
    z8.r[Regs_H] = wQj(c) | 16;
    wQi(c, z8.r[Regs_H])
};
z8oT_c221c203[229] = function(c) {
    tss += 8;
    z8.r[Regs_L] = wQj(c) | 16;
    wQi(c, z8.r[Regs_L])
};
z8oT_c221c203[230] = function(c) {
    tss += 8;
    wQi(c, wQj(c) | 16)
};
z8oT_c221c203[231] = function(c) {
    tss += 8;
    z8.r[Regs_A] = wQj(c) | 16;
    wQi(c, z8.r[Regs_A])
};
z8oT_c221c203[232] = function(c) {
    tss += 8;
    z8.r[Regs_B] = wQj(c) | 32;
    wQi(c, z8.r[Regs_B])
};
z8oT_c221c203[233] = function(c) {
    tss += 8;
    z8.r[Regs_C] = wQj(c) | 32;
    wQi(c, z8.r[Regs_C])
};
z8oT_c221c203[234] = function(c) {
    tss += 8;
    z8.r[Regs_D] = wQj(c) | 32;
    wQi(c, z8.r[Regs_D])
};
z8oT_c221c203[235] = function(c) {
    tss += 8;
    z8.r[Regs_E] = wQj(c) | 32;
    wQi(c, z8.r[Regs_E])
};
z8oT_c221c203[236] = function(c) {
    tss += 8;
    z8.r[Regs_H] = wQj(c) | 32;
    wQi(c, z8.r[Regs_H])
};
z8oT_c221c203[237] = function(c) {
    tss += 8;
    z8.r[Regs_L] = wQj(c) | 32;
    wQi(c, z8.r[Regs_L])
};
z8oT_c221c203[238] = function(c) {
    tss += 8;
    wQi(c, wQj(c) | 32)
};
z8oT_c221c203[239] = function(c) {
    tss += 8;
    z8.r[Regs_A] = wQj(c) | 32;
    wQi(c, z8.r[Regs_A])
};
z8oT_c221c203[240] = function(c) {
    tss += 8;
    z8.r[Regs_B] = wQj(c) | 64;
    wQi(c, z8.r[Regs_B])
};
z8oT_c221c203[241] = function(c) {
    tss += 8;
    z8.r[Regs_C] = wQj(c) | 64;
    wQi(c, z8.r[Regs_C])
};
z8oT_c221c203[242] = function(c) {
    tss += 8;
    z8.r[Regs_D] = wQj(c) | 64;
    wQi(c, z8.r[Regs_D])
};
z8oT_c221c203[243] = function(c) {
    tss += 8;
    z8.r[Regs_E] = wQj(c) | 64;
    wQi(c, z8.r[Regs_E])
};
z8oT_c221c203[244] = function(c) {
    tss += 8;
    z8.r[Regs_H] = wQj(c) | 64;
    wQi(c, z8.r[Regs_H])
};
z8oT_c221c203[245] = function(c) {
    tss += 8;
    z8.r[Regs_L] = wQj(c) | 64;
    wQi(c, z8.r[Regs_L])
};
z8oT_c221c203[246] = function(c) {
    tss += 8;
    wQi(c, wQj(c) | 64)
};
z8oT_c221c203[247] = function(c) {
    tss += 8;
    z8.r[Regs_A] = wQj(c) | 64;
    wQi(c, z8.r[Regs_A])
};
z8oT_c221c203[248] = function(c) {
    tss += 8;
    z8.r[Regs_B] = wQj(c) | 128;
    wQi(c, z8.r[Regs_B])
};
z8oT_c221c203[249] = function(c) {
    tss += 8;
    z8.r[Regs_C] = wQj(c) | 128;
    wQi(c, z8.r[Regs_C])
};
z8oT_c221c203[250] = function(c) {
    tss += 8;
    z8.r[Regs_D] = wQj(c) | 128;
    wQi(c, z8.r[Regs_D])
};
z8oT_c221c203[251] = function(c) {
    tss += 8;
    z8.r[Regs_E] = wQj(c) | 128;
    wQi(c, z8.r[Regs_E])
};
z8oT_c221c203[252] = function(c) {
    tss += 8;
    z8.r[Regs_H] = wQj(c) | 128;
    wQi(c, z8.r[Regs_H])
};
z8oT_c221c203[253] = function(c) {
    tss += 8;
    z8.r[Regs_L] = wQj(c) | 128;
    wQi(c, z8.r[Regs_L])
};
z8oT_c221c203[254] = function(c) {
    tss += 8;
    wQi(c, wQj(c) | 128)
};
z8oT_c221c203[255] = function(c) {
    tss += 8;
    z8.r[Regs_A] = wQj(c) | 128;
    wQi(c, z8.r[Regs_A])
};
z8oT_c221c203[256] = z8oT_c221c203[255];
window.z8oT_c221 = Array(251);
z8oT_c221[9] = function() {
    var c = (z8.r[Regs_IXL] | z8.r[Regs_IXH] << 8) + (z8.r[Regs_C] | z8.r[Regs_B] << 8),
        d = ((z8.r[Regs_IXL] | z8.r[Regs_IXH] << 8) & 2048) >> 11 | ((z8.r[Regs_C] | z8.r[Regs_B] << 8) & 2048) >> 10 | (c & 2048) >> 9;
    tss += 7;
    z8.r[Regs_IXH] = c >> 8;
    z8.r[Regs_IXL] = c;
    z8.r[Regs_F] = z8.r[Regs_F] & 196 | (c & 65536 ? 1 : 0) | c >> 8 & 40 | hcat_[d]
};
z8oT_c221[25] = function() {
    var c = (z8.r[Regs_IXL] | z8.r[Regs_IXH] << 8) + (z8.r[Regs_E] | z8.r[Regs_D] << 8),
        d = ((z8.r[Regs_IXL] | z8.r[Regs_IXH] << 8) & 2048) >> 11 | ((z8.r[Regs_E] | z8.r[Regs_D] << 8) & 2048) >> 10 | (c & 2048) >> 9;
    tss += 7;
    z8.r[Regs_IXH] = c >> 8;
    z8.r[Regs_IXL] = c;
    z8.r[Regs_F] = z8.r[Regs_F] & 196 | (c & 65536 ? 1 : 0) | c >> 8 & 40 | hcat_[d]
};
z8oT_c221[33] = function() {
    tss += 6;
    z8.r[Regs_IXL] = wQj(z8.r2[Regs2_PC]++);
    z8.r[Regs_IXH] = wQj(z8.r2[Regs2_PC]++)
};
z8oT_c221[34] = function() {
    tss += 12;
    var c = wQj(z8.r2[Regs2_PC]++),
        c = c | wQj(z8.r2[Regs2_PC]++) << 8;
    wQi(c++, z8.r[Regs_IXL]);
    wQi(c & 65535, z8.r[Regs_IXH])
};
z8oT_c221[35] = function() {
    tss += 2;
    var c = (z8.r[Regs_IXL] | z8.r[Regs_IXH] << 8) + 1 & 65535;
    z8.r[Regs_IXH] = c >> 8;
    z8.r[Regs_IXL] = c
};
z8oT_c221[36] = function() {
    z8.r[Regs_IXH] += 1;
    z8.r[Regs_F] = z8.r[Regs_F] & 1 | (128 == z8.r[Regs_IXH] ? 4 : 0) | (z8.r[Regs_IXH] & 15 ? 0 : 16) | zTe5[z8.r[Regs_IXH]]
};
z8oT_c221[37] = function() {
    z8.r[Regs_F] = z8.r[Regs_F] & 1 | (z8.r[Regs_IXH] & 15 ? 0 : 16) | 2;
    --z8.r[Regs_IXH];
    z8.r[Regs_F] = z8.r[Regs_F] | (127 == z8.r[Regs_IXH] ? 4 : 0) | zTe5[z8.r[Regs_IXH]]
};
z8oT_c221[38] = function() {
    tss += 3;
    z8.r[Regs_IXH] = wQj(z8.r2[Regs2_PC]++)
};
z8oT_c221[41] = function() {
    var c = (z8.r[Regs_IXL] | z8.r[Regs_IXH] << 8) + (z8.r[Regs_IXL] | z8.r[Regs_IXH] << 8),
        d = ((z8.r[Regs_IXL] | z8.r[Regs_IXH] << 8) & 2048) >> 11 | ((z8.r[Regs_IXL] | z8.r[Regs_IXH] << 8) & 2048) >> 10 | (c & 2048) >> 9;
    tss += 7;
    z8.r[Regs_IXH] = c >> 8;
    z8.r[Regs_IXL] = c;
    z8.r[Regs_F] = z8.r[Regs_F] & 196 | (c & 65536 ? 1 : 0) | c >> 8 & 40 | hcat_[d]
};
z8oT_c221[42] = function() {
    tss += 12;
    var c = wQj(z8.r2[Regs2_PC]++),
        c = c | wQj(z8.r2[Regs2_PC]++) << 8;
    z8.r[Regs_IXL] = wQj(c++);
    z8.r[Regs_IXH] = wQj(c & 65535)
};
z8oT_c221[43] = function() {
    tss += 2;
    var c = (z8.r[Regs_IXL] | z8.r[Regs_IXH] << 8) - 1 & 65535;
    z8.r[Regs_IXH] = c >> 8;
    z8.r[Regs_IXL] = c
};
z8oT_c221[44] = function() {
    z8.r[Regs_IXL] += 1;
    z8.r[Regs_F] = z8.r[Regs_F] & 1 | (128 == z8.r[Regs_IXL] ? 4 : 0) | (z8.r[Regs_IXL] & 15 ? 0 : 16) | zTe5[z8.r[Regs_IXL]]
};
z8oT_c221[45] = function() {
    z8.r[Regs_F] = z8.r[Regs_F] & 1 | (z8.r[Regs_IXL] & 15 ? 0 : 16) | 2;
    --z8.r[Regs_IXL];
    z8.r[Regs_F] = z8.r[Regs_F] | (127 == z8.r[Regs_IXL] ? 4 : 0) | zTe5[z8.r[Regs_IXL]]
};
z8oT_c221[46] = function() {
    tss += 3;
    z8.r[Regs_IXL] = wQj(z8.r2[Regs2_PC]++)
};
z8oT_c221[52] = function() {
    tss += 15;
    var c = (z8.r[Regs_IXL] | z8.r[Regs_IXH] << 8) + sXd(wQj(z8.r2[Regs2_PC]++)) & 65535,
        d = wQj(c),
        d = d + 1 & 255;
    z8.r[Regs_F] = z8.r[Regs_F] & 1 | (128 == d ? 4 : 0) | (d & 15 ? 0 : 16) | zTe5[d];
    wQi(c, d)
};
z8oT_c221[53] = function() {
    tss += 15;
    var c = (z8.r[Regs_IXL] | z8.r[Regs_IXH] << 8) + sXd(wQj(z8.r2[Regs2_PC]++)) & 65535,
        d = wQj(c);
    z8.r[Regs_F] = z8.r[Regs_F] & 1 | (d & 15 ? 0 : 16) | 2;
    d = d - 1 & 255;
    z8.r[Regs_F] = z8.r[Regs_F] | (127 == d ? 4 : 0) | zTe5[d];
    wQi(c, d)
};
z8oT_c221[54] = function() {
    tss += 11;
    var c = (z8.r[Regs_IXL] | z8.r[Regs_IXH] << 8) + sXd(wQj(z8.r2[Regs2_PC]++)) & 65535;
    wQi(c, wQj(z8.r2[Regs2_PC]++))
};
z8oT_c221[57] = function() {
    var c = (z8.r[Regs_IXL] | z8.r[Regs_IXH] << 8) + z8.r2[Regs2_SP],
        d = ((z8.r[Regs_IXL] | z8.r[Regs_IXH] << 8) & 2048) >> 11 | (z8.r2[Regs2_SP] & 2048) >> 10 | (c & 2048) >> 9;
    tss += 7;
    z8.r[Regs_IXH] = c >> 8;
    z8.r[Regs_IXL] = c;
    z8.r[Regs_F] = z8.r[Regs_F] & 196 | (c & 65536 ? 1 : 0) | c >> 8 & 40 | hcat_[d]
};
z8oT_c221[68] = function() {
    z8.r[Regs_B] = z8.r[Regs_IXH]
};
z8oT_c221[69] = function() {
    z8.r[Regs_B] = z8.r[Regs_IXL]
};
z8oT_c221[70] = function() {
    tss += 11;
    z8.r[Regs_B] = wQj((z8.r[Regs_IXL] | z8.r[Regs_IXH] << 8) + sXd(wQj(z8.r2[Regs2_PC]++)) & 65535)
};
z8oT_c221[76] = function() {
    z8.r[Regs_C] = z8.r[Regs_IXH]
};
z8oT_c221[77] = function() {
    z8.r[Regs_C] = z8.r[Regs_IXL]
};
z8oT_c221[78] = function() {
    tss += 11;
    z8.r[Regs_C] = wQj((z8.r[Regs_IXL] | z8.r[Regs_IXH] << 8) + sXd(wQj(z8.r2[Regs2_PC]++)) & 65535)
};
z8oT_c221[84] = function() {
    z8.r[Regs_D] = z8.r[Regs_IXH]
};
z8oT_c221[85] = function() {
    z8.r[Regs_D] = z8.r[Regs_IXL]
};
z8oT_c221[86] = function() {
    tss += 11;
    z8.r[Regs_D] = wQj((z8.r[Regs_IXL] | z8.r[Regs_IXH] << 8) + sXd(wQj(z8.r2[Regs2_PC]++)) & 65535)
};
z8oT_c221[92] = function() {
    z8.r[Regs_E] = z8.r[Regs_IXH]
};
z8oT_c221[93] = function() {
    z8.r[Regs_E] = z8.r[Regs_IXL]
};
z8oT_c221[94] = function() {
    tss += 11;
    z8.r[Regs_E] = wQj((z8.r[Regs_IXL] | z8.r[Regs_IXH] << 8) + sXd(wQj(z8.r2[Regs2_PC]++)) & 65535)
};
z8oT_c221[96] = function() {
    z8.r[Regs_IXH] = z8.r[Regs_B]
};
z8oT_c221[97] = function() {
    z8.r[Regs_IXH] = z8.r[Regs_C]
};
z8oT_c221[98] = function() {
    z8.r[Regs_IXH] = z8.r[Regs_D]
};
z8oT_c221[99] = function() {
    z8.r[Regs_IXH] = z8.r[Regs_E]
};
z8oT_c221[101] = function() {
    z8.r[Regs_IXH] = z8.r[Regs_IXL]
};
z8oT_c221[100] = z8oT_c221[101];
z8oT_c221[102] = function() {
    tss += 11;
    z8.r[Regs_H] = wQj((z8.r[Regs_IXL] | z8.r[Regs_IXH] << 8) + sXd(wQj(z8.r2[Regs2_PC]++)) & 65535)
};
z8oT_c221[103] = function() {
    z8.r[Regs_IXH] = z8.r[Regs_A]
};
z8oT_c221[104] = function() {
    z8.r[Regs_IXL] = z8.r[Regs_B]
};
z8oT_c221[105] = function() {
    z8.r[Regs_IXL] = z8.r[Regs_C]
};
z8oT_c221[106] = function() {
    z8.r[Regs_IXL] = z8.r[Regs_D]
};
z8oT_c221[107] = function() {
    z8.r[Regs_IXL] = z8.r[Regs_E]
};
z8oT_c221[108] = function() {
    z8.r[Regs_IXL] = z8.r[Regs_IXH]
};
z8oT_c221[110] = function() {
    tss += 11;
    z8.r[Regs_L] = wQj((z8.r[Regs_IXL] | z8.r[Regs_IXH] << 8) + sXd(wQj(z8.r2[Regs2_PC]++)) & 65535)
};
z8oT_c221[109] = z8oT_c221[110];
z8oT_c221[111] = function() {
    z8.r[Regs_IXL] = z8.r[Regs_A]
};
z8oT_c221[112] = function() {
    tss += 11;
    wQi((z8.r[Regs_IXL] | z8.r[Regs_IXH] << 8) + sXd(wQj(z8.r2[Regs2_PC]++)) & 65535, z8.r[Regs_B])
};
z8oT_c221[113] = function() {
    tss += 11;
    wQi((z8.r[Regs_IXL] | z8.r[Regs_IXH] << 8) + sXd(wQj(z8.r2[Regs2_PC]++)) & 65535, z8.r[Regs_C])
};
z8oT_c221[114] = function() {
    tss += 11;
    wQi((z8.r[Regs_IXL] | z8.r[Regs_IXH] << 8) + sXd(wQj(z8.r2[Regs2_PC]++)) & 65535, z8.r[Regs_D])
};
z8oT_c221[115] = function() {
    tss += 11;
    wQi((z8.r[Regs_IXL] | z8.r[Regs_IXH] << 8) + sXd(wQj(z8.r2[Regs2_PC]++)) & 65535, z8.r[Regs_E])
};
z8oT_c221[116] = function() {
    tss += 11;
    wQi((z8.r[Regs_IXL] | z8.r[Regs_IXH] << 8) + sXd(wQj(z8.r2[Regs2_PC]++)) & 65535, z8.r[Regs_H])
};
z8oT_c221[117] = function() {
    tss += 11;
    wQi((z8.r[Regs_IXL] | z8.r[Regs_IXH] << 8) + sXd(wQj(z8.r2[Regs2_PC]++)) & 65535, z8.r[Regs_L])
};
z8oT_c221[119] = function() {
    tss += 11;
    wQi((z8.r[Regs_IXL] | z8.r[Regs_IXH] << 8) + sXd(wQj(z8.r2[Regs2_PC]++)) & 65535, z8.r[Regs_A])
};
z8oT_c221[124] = function() {
    z8.r[Regs_A] = z8.r[Regs_IXH]
};
z8oT_c221[125] = function() {
    z8.r[Regs_A] = z8.r[Regs_IXL]
};
z8oT_c221[126] = function() {
    tss += 11;
    z8.r[Regs_A] = wQj((z8.r[Regs_IXL] | z8.r[Regs_IXH] << 8) + sXd(wQj(z8.r2[Regs2_PC]++)) & 65535)
};
z8oT_c221[132] = function() {
    var c = z8.r[Regs_A] + z8.r[Regs_IXH],
        d = (z8.r[Regs_A] & 136) >> 3 | (z8.r[Regs_IXH] & 136) >> 2 | (c & 136) >> 1;
    z8.r[Regs_A] = c;
    z8.r[Regs_F] = (c & 256 ? 1 : 0) | hcat_[d & 7] | oAt[d >> 4] | zTe5[z8.r[Regs_A]]
};
z8oT_c221[133] = function() {
    var c = z8.r[Regs_A] + z8.r[Regs_IXL],
        d = (z8.r[Regs_A] & 136) >> 3 | (z8.r[Regs_IXL] & 136) >> 2 | (c & 136) >> 1;
    z8.r[Regs_A] = c;
    z8.r[Regs_F] = (c & 256 ? 1 : 0) | hcat_[d & 7] | oAt[d >> 4] | zTe5[z8.r[Regs_A]]
};
z8oT_c221[134] = function() {
    tss += 11;
    var c = wQj((z8.r[Regs_IXL] | z8.r[Regs_IXH] << 8) + sXd(wQj(z8.r2[Regs2_PC]++)) & 65535),
        d = z8.r[Regs_A] + c,
        c = (z8.r[Regs_A] & 136) >> 3 | (c & 136) >> 2 | (d & 136) >> 1;
    z8.r[Regs_A] = d;
    z8.r[Regs_F] = (d & 256 ? 1 : 0) | hcat_[c & 7] | oAt[c >> 4] | zTe5[z8.r[Regs_A]]
};
z8oT_c221[140] = function() {
    var c = z8.r[Regs_A] + z8.r[Regs_IXH] + (z8.r[Regs_F] & 1),
        d = (z8.r[Regs_A] & 136) >> 3 | (z8.r[Regs_IXH] & 136) >> 2 | (c & 136) >> 1;
    z8.r[Regs_A] = c;
    z8.r[Regs_F] = (c & 256 ? 1 : 0) | hcat_[d & 7] | oAt[d >> 4] | zTe5[z8.r[Regs_A]]
};
z8oT_c221[141] = function() {
    var c = z8.r[Regs_A] + z8.r[Regs_IXL] + (z8.r[Regs_F] & 1),
        d = (z8.r[Regs_A] & 136) >> 3 | (z8.r[Regs_IXL] & 136) >> 2 | (c & 136) >> 1;
    z8.r[Regs_A] = c;
    z8.r[Regs_F] = (c & 256 ? 1 : 0) | hcat_[d & 7] | oAt[d >> 4] | zTe5[z8.r[Regs_A]]
};
z8oT_c221[142] = function() {
    tss += 11;
    var c = wQj((z8.r[Regs_IXL] | z8.r[Regs_IXH] << 8) + sXd(wQj(z8.r2[Regs2_PC]++)) & 65535),
        d = z8.r[Regs_A] + c + (z8.r[Regs_F] & 1),
        c = (z8.r[Regs_A] & 136) >> 3 | (c & 136) >> 2 | (d & 136) >> 1;
    z8.r[Regs_A] = d;
    z8.r[Regs_F] = (d & 256 ? 1 : 0) | hcat_[c & 7] | oAt[c >> 4] | zTe5[z8.r[Regs_A]]
};
z8oT_c221[148] = function() {
    var c = z8.r[Regs_A] - z8.r[Regs_IXH],
        d = (z8.r[Regs_A] & 136) >> 3 | (z8.r[Regs_IXH] & 136) >> 2 | (c & 136) >> 1;
    z8.r[Regs_A] = c;
    z8.r[Regs_F] = (c & 256 ? 1 : 0) | 2 | hcst_[d & 7] | oSt[d >> 4] | zTe5[z8.r[Regs_A]]
};
z8oT_c221[149] = function() {
    var c = z8.r[Regs_A] - z8.r[Regs_IXL],
        d = (z8.r[Regs_A] & 136) >> 3 | (z8.r[Regs_IXL] & 136) >> 2 | (c & 136) >> 1;
    z8.r[Regs_A] = c;
    z8.r[Regs_F] = (c & 256 ? 1 : 0) | 2 | hcst_[d & 7] | oSt[d >> 4] | zTe5[z8.r[Regs_A]]
};
z8oT_c221[150] = function() {
    tss += 11;
    var c = wQj((z8.r[Regs_IXL] | z8.r[Regs_IXH] << 8) + sXd(wQj(z8.r2[Regs2_PC]++)) & 65535),
        d = z8.r[Regs_A] - c,
        c = (z8.r[Regs_A] & 136) >> 3 | (c & 136) >> 2 | (d & 136) >> 1;
    z8.r[Regs_A] = d;
    z8.r[Regs_F] = (d & 256 ? 1 : 0) | 2 | hcst_[c & 7] | oSt[c >> 4] | zTe5[z8.r[Regs_A]]
};
z8oT_c221[156] = function() {
    var c = z8.r[Regs_A] - z8.r[Regs_IXH] - (z8.r[Regs_F] & 1),
        d = (z8.r[Regs_A] & 136) >> 3 | (z8.r[Regs_IXH] & 136) >> 2 | (c & 136) >> 1;
    z8.r[Regs_A] = c;
    z8.r[Regs_F] = (c & 256 ? 1 : 0) | 2 | hcst_[d & 7] | oSt[d >> 4] | zTe5[z8.r[Regs_A]]
};
z8oT_c221[157] = function() {
    var c = z8.r[Regs_A] - z8.r[Regs_IXL] - (z8.r[Regs_F] & 1),
        d = (z8.r[Regs_A] & 136) >> 3 | (z8.r[Regs_IXL] & 136) >> 2 | (c & 136) >> 1;
    z8.r[Regs_A] = c;
    z8.r[Regs_F] = (c & 256 ? 1 : 0) | 2 | hcst_[d & 7] | oSt[d >> 4] | zTe5[z8.r[Regs_A]]
};
z8oT_c221[158] = function() {
    tss += 11;
    var c = wQj((z8.r[Regs_IXL] | z8.r[Regs_IXH] << 8) + sXd(wQj(z8.r2[Regs2_PC]++)) & 65535),
        d = z8.r[Regs_A] - c - (z8.r[Regs_F] & 1),
        c = (z8.r[Regs_A] & 136) >> 3 | (c & 136) >> 2 | (d & 136) >> 1;
    z8.r[Regs_A] = d;
    z8.r[Regs_F] = (d & 256 ? 1 : 0) | 2 | hcst_[c & 7] | oSt[c >> 4] | zTe5[z8.r[Regs_A]]
};
z8oT_c221[164] = function() {
    z8.r[Regs_A] &= z8.r[Regs_IXH];
    z8.r[Regs_F] = 16 | zTe6[z8.r[Regs_A]]
};
z8oT_c221[165] = function() {
    z8.r[Regs_A] &= z8.r[Regs_IXL];
    z8.r[Regs_F] = 16 | zTe6[z8.r[Regs_A]]
};
z8oT_c221[166] = function() {
    tss += 11;
    var c = wQj((z8.r[Regs_IXL] | z8.r[Regs_IXH] << 8) + sXd(wQj(z8.r2[Regs2_PC]++)) & 65535);
    z8.r[Regs_A] &= c;
    z8.r[Regs_F] = 16 | zTe6[z8.r[Regs_A]]
};
z8oT_c221[172] = function() {
    z8.r[Regs_A] ^= z8.r[Regs_IXH];
    z8.r[Regs_F] = zTe6[z8.r[Regs_A]]
};
z8oT_c221[173] = function() {
    z8.r[Regs_A] ^= z8.r[Regs_IXL];
    z8.r[Regs_F] = zTe6[z8.r[Regs_A]]
};
z8oT_c221[174] = function() {
    tss += 11;
    var c = wQj((z8.r[Regs_IXL] | z8.r[Regs_IXH] << 8) + sXd(wQj(z8.r2[Regs2_PC]++)) & 65535);
    z8.r[Regs_A] ^= c;
    z8.r[Regs_F] = zTe6[z8.r[Regs_A]]
};
z8oT_c221[180] = function() {
    z8.r[Regs_A] |= z8.r[Regs_IXH];
    z8.r[Regs_F] = zTe6[z8.r[Regs_A]]
};
z8oT_c221[181] = function() {
    z8.r[Regs_A] |= z8.r[Regs_IXL];
    z8.r[Regs_F] = zTe6[z8.r[Regs_A]]
};
z8oT_c221[182] = function() {
    tss += 11;
    var c = wQj((z8.r[Regs_IXL] | z8.r[Regs_IXH] << 8) + sXd(wQj(z8.r2[Regs2_PC]++)) & 65535);
    z8.r[Regs_A] |= c;
    z8.r[Regs_F] = zTe6[z8.r[Regs_A]]
};
z8oT_c221[188] = function() {
    var c = z8.r[Regs_A] - z8.r[Regs_IXH],
        d = (z8.r[Regs_A] & 136) >> 3 | (z8.r[Regs_IXH] & 136) >> 2 | (c & 136) >> 1;
    z8.r[Regs_F] = (c & 256 ? 1 : c ? 0 : 64) | 2 | hcst_[d & 7] | oSt[d >> 4] | z8.r[Regs_IXH] & 40 | c & 128
};
z8oT_c221[189] = function() {
    var c = z8.r[Regs_A] - z8.r[Regs_IXL],
        d = (z8.r[Regs_A] & 136) >> 3 | (z8.r[Regs_IXL] & 136) >> 2 | (c & 136) >> 1;
    z8.r[Regs_F] = (c & 256 ? 1 : c ? 0 : 64) | 2 | hcst_[d & 7] | oSt[d >> 4] | z8.r[Regs_IXL] & 40 | c & 128
};
z8oT_c221[190] = function() {
    tss += 11;
    var c = wQj((z8.r[Regs_IXL] | z8.r[Regs_IXH] << 8) + sXd(wQj(z8.r2[Regs2_PC]++)) & 65535),
        d = z8.r[Regs_A] - c,
        f = (z8.r[Regs_A] & 136) >> 3 | (c & 136) >> 2 | (d & 136) >> 1;
    z8.r[Regs_F] = (d & 256 ? 1 : d ? 0 : 64) | 2 | hcst_[f & 7] | oSt[f >> 4] | c & 40 | d & 128
};
z8oT_c221[203] = function() {
    tss += 7;
    var c = (z8.r[Regs_IXL] | z8.r[Regs_IXH] << 8) + sXd(wQj(z8.r2[Regs2_PC]++)),
        d = wQj(z8.r2[Regs2_PC]++);
    (d = z8oT_c221c203[d]) || (d = z8oT_c221c203[z8oT_c221c203.length - 1]);
    d(c)
};
z8oT_c221[225] = function() {
    tss += 6;
    z8.r[Regs_IXL] = wQj(z8.r2[Regs2_SP]++);
    z8.r[Regs_IXH] = wQj(z8.r2[Regs2_SP]++)
};
z8oT_c221[227] = function() {
    var c = wQj(z8.r2[Regs2_SP]),
        d = wQj(z8.r2[Regs2_SP] + 1);
    tss += 15;
    wQi(z8.r2[Regs2_SP] + 1, z8.r[Regs_IXH]);
    wQi(z8.r2[Regs2_SP], z8.r[Regs_IXL]);
    z8.r[Regs_IXL] = c;
    z8.r[Regs_IXH] = d
};
z8oT_c221[229] = function() {
    tss += 7;
    z8.r2[Regs2_SP]--;
    wQi(z8.r2[Regs2_SP], z8.r[Regs_IXH]);
    z8.r2[Regs2_SP]--;
    wQi(z8.r2[Regs2_SP], z8.r[Regs_IXL])
};
z8oT_c221[233] = function() {
    z8.r2[Regs2_PC] = z8.r[Regs_IXL] | z8.r[Regs_IXH] << 8
};
z8oT_c221[249] = function() {
    tss += 2;
    z8.r2[Regs2_SP] = z8.r[Regs_IXL] | z8.r[Regs_IXH] << 8
};
z8oT_c221[250] = function() {
    z8.r2[Regs2_PC]--;
    z8.r[Regs_R]--;
    z8.r[Regs_R] &= 127
};
window.z8oT_c237 = Array(189);
z8oT_c237[64] = function() {
    tss += 4;
    z8.r[Regs_B] = ti_common_in(z8.r[Regs_C] | z8.r[Regs_B] << 8);
    z8.r[Regs_F] = z8.r[Regs_F] & 1 | zTe6[z8.r[Regs_B]]
};
z8oT_c237[65] = function() {
    tss += 4;
    ti_common_out(z8.r[Regs_C] | z8.r[Regs_B] << 8, z8.r[Regs_B])
};
z8oT_c237[66] = function() {
    tss += 7;
    var c = (z8.r[Regs_L] | z8.r[Regs_H] << 8) - (z8.r[Regs_C] | z8.r[Regs_B] << 8) - (z8.r[Regs_F] & 1),
        d = ((z8.r[Regs_L] | z8.r[Regs_H] << 8) & 34816) >> 11 | ((z8.r[Regs_C] | z8.r[Regs_B] << 8) & 34816) >> 10 | (c & 34816) >> 9;
    z8.r[Regs_H] = c >> 8;
    z8.r[Regs_L] = c;
    z8.r[Regs_F] = (c & 65536 ? 1 : 0) | 2 | oSt[d >> 4] | z8.r[Regs_H] & 168 | hcst_[d & 7] | (z8.r[Regs_L] | z8.r[Regs_H] << 8 ? 0 : 64)
};
z8oT_c237[67] = function() {
    tss += 12;
    var c = wQj(z8.r2[Regs2_PC]++),
        c = c | wQj(z8.r2[Regs2_PC]++) << 8;
    wQi(c++, z8.r[Regs_C]);
    wQi(c & 65535, z8.r[Regs_B])
};
z8oT_c237[124] = function() {
    var c = z8.r[Regs_A];
    z8.r[Regs_A] = 0;
    var d = z8.r[Regs_A] - c,
        c = (z8.r[Regs_A] & 136) >> 3 | (c & 136) >> 2 | (d & 136) >> 1;
    z8.r[Regs_A] = d;
    z8.r[Regs_F] = (d & 256 ? 1 : 0) | 2 | hcst_[c & 7] | oSt[c >> 4] | zTe5[z8.r[Regs_A]]
};
z8oT_c237[68] = z8oT_c237[124];
z8oT_c237[76] = z8oT_c237[124];
z8oT_c237[84] = z8oT_c237[124];
z8oT_c237[92] = z8oT_c237[124];
z8oT_c237[100] = z8oT_c237[124];
z8oT_c237[108] = z8oT_c237[124];
z8oT_c237[116] = z8oT_c237[124];
z8oT_c237[125] = function() {
    z8.iff1 = z8.iff2;
    tss += 6;
    var c = wQj(z8.r2[Regs2_SP]++),
        d = wQj(z8.r2[Regs2_SP]++);
    z8.r2[Regs2_PC] = c | d << 8
};
z8oT_c237[69] = z8oT_c237[125];
z8oT_c237[77] = z8oT_c237[125];
z8oT_c237[85] = z8oT_c237[125];
z8oT_c237[93] = z8oT_c237[125];
z8oT_c237[101] = z8oT_c237[125];
z8oT_c237[109] = z8oT_c237[125];
z8oT_c237[117] = z8oT_c237[125];
z8oT_c237[110] = function() {
    z8.im = 0
};
z8oT_c237[70] = z8oT_c237[110];
z8oT_c237[78] = z8oT_c237[110];
z8oT_c237[102] = z8oT_c237[110];
z8oT_c237[71] = function() {
    tss += 1;
    z8.r[Regs_I] = z8.r[Regs_A]
};
z8oT_c237[72] = function() {
    tss += 4;
    z8.r[Regs_C] = ti_common_in(z8.r[Regs_C] | z8.r[Regs_B] << 8);
    z8.r[Regs_F] = z8.r[Regs_F] & 1 | zTe6[z8.r[Regs_C]]
};
z8oT_c237[73] = function() {
    tss += 4;
    ti_common_out(z8.r[Regs_C] | z8.r[Regs_B] << 8, z8.r[Regs_C])
};
z8oT_c237[74] = function() {
    tss += 7;
    var c = (z8.r[Regs_L] | z8.r[Regs_H] << 8) + (z8.r[Regs_C] | z8.r[Regs_B] << 8) + (z8.r[Regs_F] & 1),
        d = ((z8.r[Regs_L] | z8.r[Regs_H] << 8) & 34816) >> 11 | ((z8.r[Regs_C] | z8.r[Regs_B] << 8) & 34816) >> 10 | (c & 34816) >> 9;
    z8.r[Regs_H] = c >> 8;
    z8.r[Regs_L] = c;
    z8.r[Regs_F] = (c & 65536 ? 1 : 0) | oAt[d >> 4] | z8.r[Regs_H] & 168 | hcat_[d & 7] | (z8.r[Regs_L] | z8.r[Regs_H] << 8 ? 0 : 64)
};
z8oT_c237[75] = function() {
    tss += 12;
    var c = wQj(z8.r2[Regs2_PC]++),
        c = c | wQj(z8.r2[Regs2_PC]++) << 8;
    z8.r[Regs_C] = wQj(c++);
    z8.r[Regs_B] = wQj(c & 65535)
};
z8oT_c237[79] = function() {
    tss += 1;
    z8.r[Regs_R] = z8.r[Regs_R7] = z8.r[Regs_A]
};
z8oT_c237[80] = function() {
    tss += 4;
    z8.r[Regs_D] = ti_common_in(z8.r[Regs_C] | z8.r[Regs_B] << 8);
    z8.r[Regs_F] = z8.r[Regs_F] & 1 | zTe6[z8.r[Regs_D]]
};
z8oT_c237[81] = function() {
    tss += 4;
    ti_common_out(z8.r[Regs_C] | z8.r[Regs_B] << 8, z8.r[Regs_D])
};
z8oT_c237[82] = function() {
    tss += 7;
    var c = (z8.r[Regs_L] | z8.r[Regs_H] << 8) - (z8.r[Regs_E] | z8.r[Regs_D] << 8) - (z8.r[Regs_F] & 1),
        d = ((z8.r[Regs_L] | z8.r[Regs_H] << 8) & 34816) >> 11 | ((z8.r[Regs_E] | z8.r[Regs_D] << 8) & 34816) >> 10 | (c & 34816) >> 9;
    z8.r[Regs_H] = c >> 8;
    z8.r[Regs_L] = c;
    z8.r[Regs_F] = (c & 65536 ? 1 : 0) | 2 | oSt[d >> 4] | z8.r[Regs_H] & 168 | hcst_[d & 7] | (z8.r[Regs_L] | z8.r[Regs_H] << 8 ? 0 : 64)
};
z8oT_c237[83] = function() {
    tss += 12;
    var c = wQj(z8.r2[Regs2_PC]++),
        c = c | wQj(z8.r2[Regs2_PC]++) << 8;
    wQi(c++, z8.r[Regs_E]);
    wQi(c & 65535, z8.r[Regs_D])
};
z8oT_c237[118] = function() {
    z8.im = 1
};
z8oT_c237[86] = z8oT_c237[118];
z8oT_c237[87] = function() {
    tss += 1;
    z8.r[Regs_A] = z8.r[Regs_I];
    z8.r[Regs_F] = z8.r[Regs_F] & 1 | zTe5[z8.r[Regs_A]] | (z8.iff2 ? 4 : 0)
};
z8oT_c237[88] = function() {
    tss += 4;
    z8.r[Regs_E] = ti_common_in(z8.r[Regs_C] | z8.r[Regs_B] << 8);
    z8.r[Regs_F] = z8.r[Regs_F] & 1 | zTe6[z8.r[Regs_E]]
};
z8oT_c237[89] = function() {
    tss += 4;
    ti_common_out(z8.r[Regs_C] | z8.r[Regs_B] << 8, z8.r[Regs_E])
};
z8oT_c237[90] = function() {
    tss += 7;
    var c = (z8.r[Regs_L] | z8.r[Regs_H] << 8) + (z8.r[Regs_E] | z8.r[Regs_D] << 8) + (z8.r[Regs_F] & 1),
        d = ((z8.r[Regs_L] | z8.r[Regs_H] << 8) & 34816) >> 11 | ((z8.r[Regs_E] | z8.r[Regs_D] << 8) & 34816) >> 10 | (c & 34816) >> 9;
    z8.r[Regs_H] = c >> 8;
    z8.r[Regs_L] = c;
    z8.r[Regs_F] = (c & 65536 ? 1 : 0) | oAt[d >> 4] | z8.r[Regs_H] & 168 | hcat_[d & 7] | (z8.r[Regs_L] | z8.r[Regs_H] << 8 ? 0 : 64)
};
z8oT_c237[91] = function() {
    tss += 12;
    var c = wQj(z8.r2[Regs2_PC]++),
        c = c | wQj(z8.r2[Regs2_PC]++) << 8;
    z8.r[Regs_E] = wQj(c++);
    z8.r[Regs_D] = wQj(c & 65535)
};
z8oT_c237[126] = function() {
    z8.im = 2
};
z8oT_c237[94] = z8oT_c237[126];
z8oT_c237[95] = function() {
    tss += 1;
    z8.r[Regs_A] = z8.r[Regs_R] & 127 | z8.r[Regs_R7] & 128;
    z8.r[Regs_F] = z8.r[Regs_F] & 1 | zTe5[z8.r[Regs_A]] | (z8.iff2 ? 4 : 0)
};
z8oT_c237[96] = function() {
    tss += 4;
    z8.r[Regs_H] = ti_common_in(z8.r[Regs_C] | z8.r[Regs_B] << 8);
    z8.r[Regs_F] = z8.r[Regs_F] & 1 | zTe6[z8.r[Regs_H]]
};
z8oT_c237[97] = function() {
    tss += 4;
    ti_common_out(z8.r[Regs_C] | z8.r[Regs_B] << 8, z8.r[Regs_H])
};
z8oT_c237[98] = function() {
    tss += 7;
    var c = (z8.r[Regs_L] | z8.r[Regs_H] << 8) - (z8.r[Regs_L] | z8.r[Regs_H] << 8) - (z8.r[Regs_F] & 1),
        d = ((z8.r[Regs_L] | z8.r[Regs_H] << 8) & 34816) >> 11 | ((z8.r[Regs_L] | z8.r[Regs_H] << 8) & 34816) >> 10 | (c & 34816) >> 9;
    z8.r[Regs_H] = c >> 8;
    z8.r[Regs_L] = c;
    z8.r[Regs_F] = (c & 65536 ? 1 : 0) | 2 | oSt[d >> 4] | z8.r[Regs_H] & 168 | hcst_[d & 7] | (z8.r[Regs_L] | z8.r[Regs_H] << 8 ? 0 : 64)
};
z8oT_c237[99] = function() {
    tss += 12;
    var c = wQj(z8.r2[Regs2_PC]++),
        c = c | wQj(z8.r2[Regs2_PC]++) << 8;
    wQi(c++, z8.r[Regs_L]);
    wQi(c & 65535, z8.r[Regs_H])
};
z8oT_c237[103] = function() {
    var c = wQj(z8.r[Regs_L] | z8.r[Regs_H] << 8);
    tss += 10;
    wQi(z8.r[Regs_L] | z8.r[Regs_H] << 8, (z8.r[Regs_A] & 15) << 4 | c >> 4);
    z8.r[Regs_A] = z8.r[Regs_A] & 240 | c & 15;
    z8.r[Regs_F] = z8.r[Regs_F] & 1 | zTe6[z8.r[Regs_A]]
};
z8oT_c237[104] = function() {
    tss += 4;
    z8.r[Regs_L] = ti_common_in(z8.r[Regs_C] | z8.r[Regs_B] << 8);
    z8.r[Regs_F] = z8.r[Regs_F] & 1 | zTe6[z8.r[Regs_L]]
};
z8oT_c237[105] = function() {
    tss += 4;
    ti_common_out(z8.r[Regs_C] | z8.r[Regs_B] << 8, z8.r[Regs_L])
};
z8oT_c237[106] = function() {
    tss += 7;
    var c = (z8.r[Regs_L] | z8.r[Regs_H] << 8) + (z8.r[Regs_L] | z8.r[Regs_H] << 8) + (z8.r[Regs_F] & 1),
        d = ((z8.r[Regs_L] | z8.r[Regs_H] << 8) & 34816) >> 11 | ((z8.r[Regs_L] | z8.r[Regs_H] << 8) & 34816) >> 10 | (c & 34816) >> 9;
    z8.r[Regs_H] = c >> 8;
    z8.r[Regs_L] = c;
    z8.r[Regs_F] = (c & 65536 ? 1 : 0) | oAt[d >> 4] | z8.r[Regs_H] & 168 | hcat_[d & 7] | (z8.r[Regs_L] | z8.r[Regs_H] << 8 ? 0 : 64)
};
z8oT_c237[107] = function() {
    tss += 12;
    var c = wQj(z8.r2[Regs2_PC]++),
        c = c | wQj(z8.r2[Regs2_PC]++) << 8;
    z8.r[Regs_L] = wQj(c++);
    z8.r[Regs_H] = wQj(c & 65535)
};
z8oT_c237[111] = function() {
    var c = wQj(z8.r[Regs_L] | z8.r[Regs_H] << 8);
    tss += 10;
    wQi(z8.r[Regs_L] | z8.r[Regs_H] << 8, (c & 15) << 4 | z8.r[Regs_A] & 15);
    z8.r[Regs_A] = z8.r[Regs_A] & 240 | c >> 4;
    z8.r[Regs_F] = z8.r[Regs_F] & 1 | zTe6[z8.r[Regs_A]]
};
z8oT_c237[112] = function() {
    tss += 4;
    var c = ti_common_in(z8.r[Regs_C] | z8.r[Regs_B] << 8);
    z8.r[Regs_F] = z8.r[Regs_F] & 1 | zTe6[c]
};
z8oT_c237[113] = function() {
    tss += 4;
    ti_common_out(z8.r[Regs_C] | z8.r[Regs_B] << 8, 0)
};
z8oT_c237[114] = function() {
    tss += 7;
    var c = (z8.r[Regs_L] | z8.r[Regs_H] << 8) - z8.r2[Regs2_SP] - (z8.r[Regs_F] & 1),
        d = ((z8.r[Regs_L] | z8.r[Regs_H] << 8) & 34816) >> 11 | (z8.r2[Regs2_SP] & 34816) >> 10 | (c & 34816) >> 9;
    z8.r[Regs_H] = c >> 8;
    z8.r[Regs_L] = c;
    z8.r[Regs_F] = (c & 65536 ? 1 : 0) | 2 | oSt[d >> 4] | z8.r[Regs_H] & 168 | hcst_[d & 7] | (z8.r[Regs_L] | z8.r[Regs_H] << 8 ? 0 : 64)
};
z8oT_c237[115] = function() {
    tss += 12;
    var c = wQj(z8.r2[Regs2_PC]++),
        c = c | wQj(z8.r2[Regs2_PC]++) << 8;
    wQi(c++, z8.r2[Regs2_SP] & 255);
    wQi(c & 65535, z8.r2[Regs2_SP] >> 8)
};
z8oT_c237[120] = function() {
    tss += 4;
    z8.r[Regs_A] = ti_common_in(z8.r[Regs_C] | z8.r[Regs_B] << 8);
    z8.r[Regs_F] = z8.r[Regs_F] & 1 | zTe6[z8.r[Regs_A]]
};
z8oT_c237[121] = function() {
    tss += 4;
    ti_common_out(z8.r[Regs_C] | z8.r[Regs_B] << 8, z8.r[Regs_A])
};
z8oT_c237[122] = function() {
    tss += 7;
    var c = (z8.r[Regs_L] | z8.r[Regs_H] << 8) + z8.r2[Regs2_SP] + (z8.r[Regs_F] & 1),
        d = ((z8.r[Regs_L] | z8.r[Regs_H] << 8) & 34816) >> 11 | (z8.r2[Regs2_SP] & 34816) >> 10 | (c & 34816) >> 9;
    z8.r[Regs_H] = c >> 8;
    z8.r[Regs_L] = c;
    z8.r[Regs_F] = (c & 65536 ? 1 : 0) | oAt[d >> 4] | z8.r[Regs_H] & 168 | hcat_[d & 7] | (z8.r[Regs_L] | z8.r[Regs_H] << 8 ? 0 : 64)
};
z8oT_c237[123] = function() {
    tss += 12;
    var c = wQj(z8.r2[Regs2_PC]++),
        c = c | wQj(z8.r2[Regs2_PC]++) << 8,
        d = wQj(c++),
        c = wQj(c & 65535);
    z8.r2[Regs2_SP] = d | c << 8
};
z8oT_c237[160] = function() {
    var c = wQj(z8.r[Regs_L] | z8.r[Regs_H] << 8);
    tss += 8;
    var d = (z8.r[Regs_C] | z8.r[Regs_B] << 8) - 1 & 65535;
    z8.r[Regs_B] = d >> 8;
    z8.r[Regs_C] = d;
    wQi(z8.r[Regs_E] | z8.r[Regs_D] << 8, c);
    d = (z8.r[Regs_E] | z8.r[Regs_D] << 8) + 1 & 65535;
    z8.r[Regs_D] = d >> 8;
    z8.r[Regs_E] = d;
    d = (z8.r[Regs_L] | z8.r[Regs_H] << 8) + 1 & 65535;
    z8.r[Regs_H] = d >> 8;
    z8.r[Regs_L] = d;
    c = c + z8.r[Regs_A] & 255;
    z8.r[Regs_F] = z8.r[Regs_F] & 193 | (z8.r[Regs_C] | z8.r[Regs_B] << 8 ? 4 : 0) | c & 8 | (c & 2 ? 32 : 0)
};
z8oT_c237[161] = function() {
    var c = wQj(z8.r[Regs_L] | z8.r[Regs_H] << 8),
        d = z8.r[Regs_A] - c & 255,
        c = (z8.r[Regs_A] & 8) >> 3 | (c & 8) >> 2 | (d & 8) >> 1;
    tss += 8;
    var f = (z8.r[Regs_L] | z8.r[Regs_H] << 8) + 1 & 65535;
    z8.r[Regs_H] = f >> 8;
    z8.r[Regs_L] = f;
    f = (z8.r[Regs_C] | z8.r[Regs_B] << 8) - 1 & 65535;
    z8.r[Regs_B] = f >> 8;
    z8.r[Regs_C] = f;
    z8.r[Regs_F] = z8.r[Regs_F] & 1 | (z8.r[Regs_C] | z8.r[Regs_B] << 8 ? 6 : 2) | hcst_[c] | (d ? 0 : 64) | d & 128;
    z8.r[Regs_F] & 16 && d--;
    z8.r[Regs_F] = z8.r[Regs_F] | d & 8 | (d & 2 ? 32 : 0)
};
z8oT_c237[162] = function() {
    var c = ti_common_in(z8.r[Regs_C] | z8.r[Regs_B] << 8);
    tss += 8;
    wQi(z8.r[Regs_L] | z8.r[Regs_H] << 8, c);
    --z8.r[Regs_B];
    var d = (z8.r[Regs_L] | z8.r[Regs_H] << 8) + 1 & 65535;
    z8.r[Regs_H] = d >> 8;
    z8.r[Regs_L] = d;
    z8.r[Regs_F] = (c & 128 ? 2 : 0) | zTe5[z8.r[Regs_B]]
};
z8oT_c237[163] = function() {
    var c = wQj(z8.r[Regs_L] | z8.r[Regs_H] << 8);
    --z8.r[Regs_B];
    tss += 8;
    var d = (z8.r[Regs_L] | z8.r[Regs_H] << 8) + 1 & 65535;
    z8.r[Regs_H] = d >> 8;
    z8.r[Regs_L] = d;
    ti_common_out(z8.r[Regs_C] | z8.r[Regs_B] << 8, c);
    z8.r[Regs_F] = (c & 128 ? 2 : 0) | zTe5[z8.r[Regs_B]]
};
z8oT_c237[168] = function() {
    var c = wQj(z8.r[Regs_L] | z8.r[Regs_H] << 8);
    tss += 8;
    var d = (z8.r[Regs_C] | z8.r[Regs_B] << 8) - 1 & 65535;
    z8.r[Regs_B] = d >> 8;
    z8.r[Regs_C] = d;
    wQi(z8.r[Regs_E] | z8.r[Regs_D] << 8, c);
    d = (z8.r[Regs_E] | z8.r[Regs_D] << 8) - 1 & 65535;
    z8.r[Regs_D] = d >> 8;
    z8.r[Regs_E] = d;
    d = (z8.r[Regs_L] | z8.r[Regs_H] << 8) - 1 & 65535;
    z8.r[Regs_H] = d >> 8;
    z8.r[Regs_L] = d;
    c = c + z8.r[Regs_A] & 255;
    z8.r[Regs_F] = z8.r[Regs_F] & 193 | (z8.r[Regs_C] | z8.r[Regs_B] << 8 ? 4 : 0) | c & 8 | (c & 2 ? 32 : 0)
};
z8oT_c237[169] = function() {
    var c = wQj(z8.r[Regs_L] | z8.r[Regs_H] << 8),
        d = z8.r[Regs_A] - c & 255,
        c = (z8.r[Regs_A] & 8) >> 3 | (c & 8) >> 2 | (d & 8) >> 1;
    tss += 8;
    var f = (z8.r[Regs_L] | z8.r[Regs_H] << 8) - 1 & 65535;
    z8.r[Regs_H] = f >> 8;
    z8.r[Regs_L] = f;
    f = (z8.r[Regs_C] | z8.r[Regs_B] << 8) - 1 & 65535;
    z8.r[Regs_B] = f >> 8;
    z8.r[Regs_C] = f;
    z8.r[Regs_F] = z8.r[Regs_F] & 1 | (z8.r[Regs_C] | z8.r[Regs_B] << 8 ? 6 : 2) | hcst_[c] | (d ? 0 : 64) | d & 128;
    z8.r[Regs_F] & 16 && d--;
    z8.r[Regs_F] = z8.r[Regs_F] | d & 8 | (d & 2 ? 32 : 0)
};
z8oT_c237[170] = function() {
    var c = ti_common_in(z8.r[Regs_C] | z8.r[Regs_B] << 8);
    tss += 8;
    wQi(z8.r[Regs_L] | z8.r[Regs_H] << 8, c);
    --z8.r[Regs_B];
    var d = (z8.r[Regs_L] | z8.r[Regs_H] << 8) - 1 & 65535;
    z8.r[Regs_H] = d >> 8;
    z8.r[Regs_L] = d;
    z8.r[Regs_F] = (c & 128 ? 2 : 0) | zTe5[z8.r[Regs_B]]
};
z8oT_c237[171] = function() {
    var c = wQj(z8.r[Regs_L] | z8.r[Regs_H] << 8);
    --z8.r[Regs_B];
    tss++;
    tss += 7;
    var d = (z8.r[Regs_L] | z8.r[Regs_H] << 8) - 1 & 65535;
    z8.r[Regs_H] = d >> 8;
    z8.r[Regs_L] = d;
    ti_common_out(z8.r[Regs_C] | z8.r[Regs_B] << 8, c);
    z8.r[Regs_F] = (c & 128 ? 2 : 0) | zTe5[z8.r[Regs_B]]
};
z8oT_c237[176] = function() {
    var c = wQj(z8.r[Regs_L] | z8.r[Regs_H] << 8);
    tss += 8;
    wQi(z8.r[Regs_E] | z8.r[Regs_D] << 8, c);
    var d = (z8.r[Regs_L] | z8.r[Regs_H] << 8) + 1 & 65535;
    z8.r[Regs_H] = d >> 8;
    z8.r[Regs_L] = d;
    d = (z8.r[Regs_E] | z8.r[Regs_D] << 8) + 1 & 65535;
    z8.r[Regs_D] = d >> 8;
    z8.r[Regs_E] = d;
    d = (z8.r[Regs_C] | z8.r[Regs_B] << 8) - 1 & 65535;
    z8.r[Regs_B] = d >> 8;
    z8.r[Regs_C] = d;
    c = c + z8.r[Regs_A] & 255;
    z8.r[Regs_F] = z8.r[Regs_F] & 193 | (z8.r[Regs_C] | z8.r[Regs_B] << 8 ? 4 : 0) | c & 8 | (c & 2 ? 32 : 0);
    z8.r[Regs_C] | z8.r[Regs_B] << 8 && (tss += 1, tss += 1, tss += 1, tss += 1, tss += 1, z8.r2[Regs2_PC] -= 2)
};
z8oT_c237[177] = function() {
    var c = wQj(z8.r[Regs_L] | z8.r[Regs_H] << 8),
        d = z8.r[Regs_A] - c & 255,
        c = (z8.r[Regs_A] & 8) >> 3 | (c & 8) >> 2 | (d & 8) >> 1;
    tss += 8;
    var f = (z8.r[Regs_L] | z8.r[Regs_H] << 8) + 1 & 65535;
    z8.r[Regs_H] = f >> 8;
    z8.r[Regs_L] = f;
    f = (z8.r[Regs_C] | z8.r[Regs_B] << 8) - 1 & 65535;
    z8.r[Regs_B] = f >> 8;
    z8.r[Regs_C] = f;
    z8.r[Regs_F] = z8.r[Regs_F] & 1 | (z8.r[Regs_C] | z8.r[Regs_B] << 8 ? 6 : 2) | hcst_[c] | (d ? 0 : 64) | d & 128;
    z8.r[Regs_F] & 16 && d--;
    z8.r[Regs_F] = z8.r[Regs_F] | d & 8 | (d & 2 ? 32 : 0);
    4 == (z8.r[Regs_F] &
        68) && (tss += 1, tss += 1, tss += 1, tss += 1, tss += 1, z8.r2[Regs2_PC] -= 2)
};
z8oT_c237[178] = function() {
    var c = ti_common_in(z8.r[Regs_C] | z8.r[Regs_B] << 8);
    tss += 8;
    wQi(z8.r[Regs_L] | z8.r[Regs_H] << 8, c);
    --z8.r[Regs_B];
    var d = (z8.r[Regs_L] | z8.r[Regs_H] << 8) + 1 & 65535;
    z8.r[Regs_H] = d >> 8;
    z8.r[Regs_L] = d;
    z8.r[Regs_F] = (c & 128 ? 2 : 0) | zTe5[z8.r[Regs_B]];
    z8.r[Regs_B] && (tss += 1, tss += 1, tss += 1, tss += 1, tss += 1, z8.r2[Regs2_PC] -= 2)
};
z8oT_c237[179] = function() {
    var c = wQj(z8.r[Regs_L] | z8.r[Regs_H] << 8);
    tss += 5;
    --z8.r[Regs_B];
    var d = (z8.r[Regs_L] | z8.r[Regs_H] << 8) + 1 & 65535;
    z8.r[Regs_H] = d >> 8;
    z8.r[Regs_L] = d;
    ti_common_out(z8.r[Regs_C] | z8.r[Regs_B] << 8, c);
    z8.r[Regs_F] = (c & 128 ? 2 : 0) | zTe5[z8.r[Regs_B]];
    z8.r[Regs_B] ? (tss += 1, tss += 1, tss += 1, tss += 1, tss += 1, tss += 1, tss += 1, tss += 1, z8.r2[Regs2_PC] -= 2) : tss += 3
};
z8oT_c237[184] = function() {
    var c = wQj(z8.r[Regs_L] | z8.r[Regs_H] << 8);
    tss += 8;
    wQi(z8.r[Regs_E] | z8.r[Regs_D] << 8, c);
    var d = (z8.r[Regs_L] | z8.r[Regs_H] << 8) - 1 & 65535;
    z8.r[Regs_H] = d >> 8;
    z8.r[Regs_L] = d;
    d = (z8.r[Regs_E] | z8.r[Regs_D] << 8) - 1 & 65535;
    z8.r[Regs_D] = d >> 8;
    z8.r[Regs_E] = d;
    d = (z8.r[Regs_C] | z8.r[Regs_B] << 8) - 1 & 65535;
    z8.r[Regs_B] = d >> 8;
    z8.r[Regs_C] = d;
    c = c + z8.r[Regs_A] & 255;
    z8.r[Regs_F] = z8.r[Regs_F] & 193 | (z8.r[Regs_C] | z8.r[Regs_B] << 8 ? 4 : 0) | c & 8 | (c & 2 ? 32 : 0);
    z8.r[Regs_C] | z8.r[Regs_B] << 8 && (tss += 1, tss += 1, tss += 1, tss += 1, tss += 1, z8.r2[Regs2_PC] -= 2)
};
z8oT_c237[185] = function() {
    var c = wQj(z8.r[Regs_L] | z8.r[Regs_H] << 8),
        d = z8.r[Regs_A] - c & 255,
        c = (z8.r[Regs_A] & 8) >> 3 | (c & 8) >> 2 | (d & 8) >> 1;
    tss += 5;
    var f = (z8.r[Regs_L] | z8.r[Regs_H] << 8) - 1 & 65535;
    z8.r[Regs_H] = f >> 8;
    z8.r[Regs_L] = f;
    f = (z8.r[Regs_C] | z8.r[Regs_B] << 8) - 1 & 65535;
    z8.r[Regs_B] = f >> 8;
    z8.r[Regs_C] = f;
    z8.r[Regs_F] = z8.r[Regs_F] & 1 | (z8.r[Regs_C] | z8.r[Regs_B] << 8 ? 6 : 2) | hcst_[c] | (d ? 0 : 64) | d & 128;
    z8.r[Regs_F] & 16 && d--;
    z8.r[Regs_F] = z8.r[Regs_F] | d & 8 | (d & 2 ? 32 : 0);
    4 == (z8.r[Regs_F] &
        68) && (tss += 1, tss += 1, tss += 1, tss += 1, tss += 1, z8.r2[Regs2_PC] -= 2)
};
z8oT_c237[186] = function() {
    var c = ti_common_in(z8.r[Regs_C] | z8.r[Regs_B] << 8);
    tss += 8;
    wQi(z8.r[Regs_L] | z8.r[Regs_H] << 8, c);
    --z8.r[Regs_B];
    var d = (z8.r[Regs_L] | z8.r[Regs_H] << 8) - 1 & 65535;
    z8.r[Regs_H] = d >> 8;
    z8.r[Regs_L] = d;
    z8.r[Regs_F] = (c & 128 ? 2 : 0) | zTe5[z8.r[Regs_B]];
    z8.r[Regs_B] && (tss += 1, tss += 1, tss += 1, tss += 1, tss += 1, z8.r2[Regs2_PC] -= 2)
};
z8oT_c237[187] = function() {
    var c = wQj(z8.r[Regs_L] | z8.r[Regs_H] << 8);
    tss += 5;
    --z8.r[Regs_B];
    var d = (z8.r[Regs_L] | z8.r[Regs_H] << 8) - 1 & 65535;
    z8.r[Regs_H] = d >> 8;
    z8.r[Regs_L] = d;
    ti_common_out(z8.r[Regs_C] | z8.r[Regs_B] << 8, c);
    z8.r[Regs_F] = (c & 128 ? 2 : 0) | zTe5[z8.r[Regs_B]];
    z8.r[Regs_B] ? (tss += 8, z8.r2[Regs2_PC] -= 2) : tss += 3
};
z8oT_c237[188] = z8oT_c237[187];
window.z8oT_c253c203 = Array(257);
z8oT_c253c203[0] = function(c) {
    tss += 8;
    z8.r[Regs_B] = wQj(c);
    z8.r[Regs_B] = (z8.r[Regs_B] & 127) << 1 | z8.r[Regs_B] >> 7;
    z8.r[Regs_F] = z8.r[Regs_B] & 1 | zTe6[z8.r[Regs_B]];
    wQi(c, z8.r[Regs_B])
};
z8oT_c253c203[1] = function(c) {
    tss += 8;
    z8.r[Regs_C] = wQj(c);
    z8.r[Regs_C] = (z8.r[Regs_C] & 127) << 1 | z8.r[Regs_C] >> 7;
    z8.r[Regs_F] = z8.r[Regs_C] & 1 | zTe6[z8.r[Regs_C]];
    wQi(c, z8.r[Regs_C])
};
z8oT_c253c203[2] = function(c) {
    tss += 8;
    z8.r[Regs_D] = wQj(c);
    z8.r[Regs_D] = (z8.r[Regs_D] & 127) << 1 | z8.r[Regs_D] >> 7;
    z8.r[Regs_F] = z8.r[Regs_D] & 1 | zTe6[z8.r[Regs_D]];
    wQi(c, z8.r[Regs_D])
};
z8oT_c253c203[3] = function(c) {
    tss += 8;
    z8.r[Regs_E] = wQj(c);
    z8.r[Regs_E] = (z8.r[Regs_E] & 127) << 1 | z8.r[Regs_E] >> 7;
    z8.r[Regs_F] = z8.r[Regs_E] & 1 | zTe6[z8.r[Regs_E]];
    wQi(c, z8.r[Regs_E])
};
z8oT_c253c203[4] = function(c) {
    tss += 8;
    z8.r[Regs_H] = wQj(c);
    z8.r[Regs_H] = (z8.r[Regs_H] & 127) << 1 | z8.r[Regs_H] >> 7;
    z8.r[Regs_F] = z8.r[Regs_H] & 1 | zTe6[z8.r[Regs_H]];
    wQi(c, z8.r[Regs_H])
};
z8oT_c253c203[5] = function(c) {
    tss += 8;
    z8.r[Regs_L] = wQj(c);
    z8.r[Regs_L] = (z8.r[Regs_L] & 127) << 1 | z8.r[Regs_L] >> 7;
    z8.r[Regs_F] = z8.r[Regs_L] & 1 | zTe6[z8.r[Regs_L]];
    wQi(c, z8.r[Regs_L])
};
z8oT_c253c203[6] = function(c) {
    tss += 8;
    var d = wQj(c),
        d = (d & 127) << 1 | d >> 7;
    z8.r[Regs_F] = d & 1 | zTe6[d];
    wQi(c, d)
};
z8oT_c253c203[7] = function(c) {
    tss += 8;
    z8.r[Regs_A] = wQj(c);
    z8.r[Regs_A] = (z8.r[Regs_A] & 127) << 1 | z8.r[Regs_A] >> 7;
    z8.r[Regs_F] = z8.r[Regs_A] & 1 | zTe6[z8.r[Regs_A]];
    wQi(c, z8.r[Regs_A])
};
z8oT_c253c203[8] = function(c) {
    tss += 8;
    z8.r[Regs_B] = wQj(c);
    z8.r[Regs_F] = z8.r[Regs_B] & 1;
    z8.r[Regs_B] = z8.r[Regs_B] >> 1 | (z8.r[Regs_B] & 1) << 7;
    z8.r[Regs_F] |= zTe6[z8.r[Regs_B]];
    wQi(c, z8.r[Regs_B])
};
z8oT_c253c203[9] = function(c) {
    tss += 8;
    z8.r[Regs_C] = wQj(c);
    z8.r[Regs_F] = z8.r[Regs_C] & 1;
    z8.r[Regs_C] = z8.r[Regs_C] >> 1 | (z8.r[Regs_C] & 1) << 7;
    z8.r[Regs_F] |= zTe6[z8.r[Regs_C]];
    wQi(c, z8.r[Regs_C])
};
z8oT_c253c203[10] = function(c) {
    tss += 8;
    z8.r[Regs_D] = wQj(c);
    z8.r[Regs_F] = z8.r[Regs_D] & 1;
    z8.r[Regs_D] = z8.r[Regs_D] >> 1 | (z8.r[Regs_D] & 1) << 7;
    z8.r[Regs_F] |= zTe6[z8.r[Regs_D]];
    wQi(c, z8.r[Regs_D])
};
z8oT_c253c203[11] = function(c) {
    tss += 8;
    z8.r[Regs_E] = wQj(c);
    z8.r[Regs_F] = z8.r[Regs_E] & 1;
    z8.r[Regs_E] = z8.r[Regs_E] >> 1 | (z8.r[Regs_E] & 1) << 7;
    z8.r[Regs_F] |= zTe6[z8.r[Regs_E]];
    wQi(c, z8.r[Regs_E])
};
z8oT_c253c203[12] = function(c) {
    tss += 8;
    z8.r[Regs_H] = wQj(c);
    z8.r[Regs_F] = z8.r[Regs_H] & 1;
    z8.r[Regs_H] = z8.r[Regs_H] >> 1 | (z8.r[Regs_H] & 1) << 7;
    z8.r[Regs_F] |= zTe6[z8.r[Regs_H]];
    wQi(c, z8.r[Regs_H])
};
z8oT_c253c203[13] = function(c) {
    tss += 8;
    z8.r[Regs_L] = wQj(c);
    z8.r[Regs_F] = z8.r[Regs_L] & 1;
    z8.r[Regs_L] = z8.r[Regs_L] >> 1 | (z8.r[Regs_L] & 1) << 7;
    z8.r[Regs_F] |= zTe6[z8.r[Regs_L]];
    wQi(c, z8.r[Regs_L])
};
z8oT_c253c203[14] = function(c) {
    tss += 8;
    var d = wQj(c);
    z8.r[Regs_F] = d & 1;
    d = d >> 1 | (d & 1) << 7;
    z8.r[Regs_F] |= zTe6[d];
    wQi(c, d)
};
z8oT_c253c203[15] = function(c) {
    tss += 8;
    z8.r[Regs_A] = wQj(c);
    z8.r[Regs_F] = z8.r[Regs_A] & 1;
    z8.r[Regs_A] = z8.r[Regs_A] >> 1 | (z8.r[Regs_A] & 1) << 7;
    z8.r[Regs_F] |= zTe6[z8.r[Regs_A]];
    wQi(c, z8.r[Regs_A])
};
z8oT_c253c203[16] = function(c) {
    tss += 8;
    z8.r[Regs_B] = wQj(c);
    var d = z8.r[Regs_B];
    z8.r[Regs_B] = (z8.r[Regs_B] & 127) << 1 | z8.r[Regs_F] & 1;
    z8.r[Regs_F] = d >> 7 | zTe6[z8.r[Regs_B]];
    wQi(c, z8.r[Regs_B])
};
z8oT_c253c203[17] = function(c) {
    tss += 8;
    z8.r[Regs_C] = wQj(c);
    var d = z8.r[Regs_C];
    z8.r[Regs_C] = (z8.r[Regs_C] & 127) << 1 | z8.r[Regs_F] & 1;
    z8.r[Regs_F] = d >> 7 | zTe6[z8.r[Regs_C]];
    wQi(c, z8.r[Regs_C])
};
z8oT_c253c203[18] = function(c) {
    tss += 8;
    z8.r[Regs_D] = wQj(c);
    var d = z8.r[Regs_D];
    z8.r[Regs_D] = (z8.r[Regs_D] & 127) << 1 | z8.r[Regs_F] & 1;
    z8.r[Regs_F] = d >> 7 | zTe6[z8.r[Regs_D]];
    wQi(c, z8.r[Regs_D])
};
z8oT_c253c203[19] = function(c) {
    tss += 8;
    z8.r[Regs_E] = wQj(c);
    var d = z8.r[Regs_E];
    z8.r[Regs_E] = (z8.r[Regs_E] & 127) << 1 | z8.r[Regs_F] & 1;
    z8.r[Regs_F] = d >> 7 | zTe6[z8.r[Regs_E]];
    wQi(c, z8.r[Regs_E])
};
z8oT_c253c203[20] = function(c) {
    tss += 8;
    z8.r[Regs_H] = wQj(c);
    var d = z8.r[Regs_H];
    z8.r[Regs_H] = (z8.r[Regs_H] & 127) << 1 | z8.r[Regs_F] & 1;
    z8.r[Regs_F] = d >> 7 | zTe6[z8.r[Regs_H]];
    wQi(c, z8.r[Regs_H])
};
z8oT_c253c203[21] = function(c) {
    tss += 8;
    z8.r[Regs_L] = wQj(c);
    var d = z8.r[Regs_L];
    z8.r[Regs_L] = (z8.r[Regs_L] & 127) << 1 | z8.r[Regs_F] & 1;
    z8.r[Regs_F] = d >> 7 | zTe6[z8.r[Regs_L]];
    wQi(c, z8.r[Regs_L])
};
z8oT_c253c203[22] = function(c) {
    tss += 8;
    var d = wQj(c),
        f = (d & 127) << 1 | z8.r[Regs_F] & 1;
    z8.r[Regs_F] = d >> 7 | zTe6[f];
    wQi(c, f)
};
z8oT_c253c203[23] = function(c) {
    tss += 8;
    z8.r[Regs_A] = wQj(c);
    var d = z8.r[Regs_A];
    z8.r[Regs_A] = (z8.r[Regs_A] & 127) << 1 | z8.r[Regs_F] & 1;
    z8.r[Regs_F] = d >> 7 | zTe6[z8.r[Regs_A]];
    wQi(c, z8.r[Regs_A])
};
z8oT_c253c203[24] = function(c) {
    tss += 8;
    z8.r[Regs_B] = wQj(c);
    var d = z8.r[Regs_B];
    z8.r[Regs_B] = z8.r[Regs_B] >> 1 | (z8.r[Regs_F] & 1) << 7;
    z8.r[Regs_F] = d & 1 | zTe6[z8.r[Regs_B]];
    wQi(c, z8.r[Regs_B])
};
z8oT_c253c203[25] = function(c) {
    tss += 8;
    z8.r[Regs_C] = wQj(c);
    var d = z8.r[Regs_C];
    z8.r[Regs_C] = z8.r[Regs_C] >> 1 | (z8.r[Regs_F] & 1) << 7;
    z8.r[Regs_F] = d & 1 | zTe6[z8.r[Regs_C]];
    wQi(c, z8.r[Regs_C])
};
z8oT_c253c203[26] = function(c) {
    tss += 8;
    z8.r[Regs_D] = wQj(c);
    var d = z8.r[Regs_D];
    z8.r[Regs_D] = z8.r[Regs_D] >> 1 | (z8.r[Regs_F] & 1) << 7;
    z8.r[Regs_F] = d & 1 | zTe6[z8.r[Regs_D]];
    wQi(c, z8.r[Regs_D])
};
z8oT_c253c203[27] = function(c) {
    tss += 8;
    z8.r[Regs_E] = wQj(c);
    var d = z8.r[Regs_E];
    z8.r[Regs_E] = z8.r[Regs_E] >> 1 | (z8.r[Regs_F] & 1) << 7;
    z8.r[Regs_F] = d & 1 | zTe6[z8.r[Regs_E]];
    wQi(c, z8.r[Regs_E])
};
z8oT_c253c203[28] = function(c) {
    tss += 8;
    z8.r[Regs_H] = wQj(c);
    var d = z8.r[Regs_H];
    z8.r[Regs_H] = z8.r[Regs_H] >> 1 | (z8.r[Regs_F] & 1) << 7;
    z8.r[Regs_F] = d & 1 | zTe6[z8.r[Regs_H]];
    wQi(c, z8.r[Regs_H])
};
z8oT_c253c203[29] = function(c) {
    tss += 8;
    z8.r[Regs_L] = wQj(c);
    var d = z8.r[Regs_L];
    z8.r[Regs_L] = z8.r[Regs_L] >> 1 | (z8.r[Regs_F] & 1) << 7;
    z8.r[Regs_F] = d & 1 | zTe6[z8.r[Regs_L]];
    wQi(c, z8.r[Regs_L])
};
z8oT_c253c203[30] = function(c) {
    tss += 8;
    var d = wQj(c),
        f = d >> 1 | (z8.r[Regs_F] & 1) << 7;
    z8.r[Regs_F] = d & 1 | zTe6[f];
    wQi(c, f)
};
z8oT_c253c203[31] = function(c) {
    tss += 8;
    z8.r[Regs_A] = wQj(c);
    var d = z8.r[Regs_A];
    z8.r[Regs_A] = z8.r[Regs_A] >> 1 | (z8.r[Regs_F] & 1) << 7;
    z8.r[Regs_F] = d & 1 | zTe6[z8.r[Regs_A]];
    wQi(c, z8.r[Regs_A])
};
z8oT_c253c203[32] = function(c) {
    tss += 8;
    z8.r[Regs_B] = wQj(c);
    z8.r[Regs_F] = z8.r[Regs_B] >> 7;
    z8.r[Regs_B] <<= 1;
    z8.r[Regs_B] &= 255;
    z8.r[Regs_F] |= zTe6[z8.r[Regs_B]];
    wQi(c, z8.r[Regs_B])
};
z8oT_c253c203[33] = function(c) {
    tss += 8;
    z8.r[Regs_C] = wQj(c);
    z8.r[Regs_F] = z8.r[Regs_C] >> 7;
    z8.r[Regs_C] <<= 1;
    z8.r[Regs_C] &= 255;
    z8.r[Regs_F] |= zTe6[z8.r[Regs_C]];
    wQi(c, z8.r[Regs_C])
};
z8oT_c253c203[34] = function(c) {
    tss += 8;
    z8.r[Regs_D] = wQj(c);
    z8.r[Regs_F] = z8.r[Regs_D] >> 7;
    z8.r[Regs_D] <<= 1;
    z8.r[Regs_D] &= 255;
    z8.r[Regs_F] |= zTe6[z8.r[Regs_D]];
    wQi(c, z8.r[Regs_D])
};
z8oT_c253c203[35] = function(c) {
    tss += 8;
    z8.r[Regs_E] = wQj(c);
    z8.r[Regs_F] = z8.r[Regs_E] >> 7;
    z8.r[Regs_E] <<= 1;
    z8.r[Regs_E] &= 255;
    z8.r[Regs_F] |= zTe6[z8.r[Regs_E]];
    wQi(c, z8.r[Regs_E])
};
z8oT_c253c203[36] = function(c) {
    tss += 8;
    z8.r[Regs_H] = wQj(c);
    z8.r[Regs_F] = z8.r[Regs_H] >> 7;
    z8.r[Regs_H] <<= 1;
    z8.r[Regs_H] &= 255;
    z8.r[Regs_F] |= zTe6[z8.r[Regs_H]];
    wQi(c, z8.r[Regs_H])
};
z8oT_c253c203[37] = function(c) {
    tss += 8;
    z8.r[Regs_L] = wQj(c);
    z8.r[Regs_F] = z8.r[Regs_L] >> 7;
    z8.r[Regs_L] <<= 1;
    z8.r[Regs_L] &= 255;
    z8.r[Regs_F] |= zTe6[z8.r[Regs_L]];
    wQi(c, z8.r[Regs_L])
};
z8oT_c253c203[38] = function(c) {
    tss += 8;
    var d = wQj(c);
    z8.r[Regs_F] = d >> 7;
    d = d << 1 & 255;
    z8.r[Regs_F] |= zTe6[d];
    wQi(c, d)
};
z8oT_c253c203[39] = function(c) {
    tss += 8;
    z8.r[Regs_A] = wQj(c);
    z8.r[Regs_F] = z8.r[Regs_A] >> 7;
    z8.r[Regs_A] <<= 1;
    z8.r[Regs_A] &= 255;
    z8.r[Regs_F] |= zTe6[z8.r[Regs_A]];
    wQi(c, z8.r[Regs_A])
};
z8oT_c253c203[40] = function(c) {
    tss += 8;
    z8.r[Regs_B] = wQj(c);
    z8.r[Regs_F] = z8.r[Regs_B] & 1;
    z8.r[Regs_B] = z8.r[Regs_B] & 128 | z8.r[Regs_B] >> 1;
    z8.r[Regs_F] |= zTe6[z8.r[Regs_B]];
    wQi(c, z8.r[Regs_B])
};
z8oT_c253c203[41] = function(c) {
    tss += 8;
    z8.r[Regs_C] = wQj(c);
    z8.r[Regs_F] = z8.r[Regs_C] & 1;
    z8.r[Regs_C] = z8.r[Regs_C] & 128 | z8.r[Regs_C] >> 1;
    z8.r[Regs_F] |= zTe6[z8.r[Regs_C]];
    wQi(c, z8.r[Regs_C])
};
z8oT_c253c203[42] = function(c) {
    tss += 8;
    z8.r[Regs_D] = wQj(c);
    z8.r[Regs_F] = z8.r[Regs_D] & 1;
    z8.r[Regs_D] = z8.r[Regs_D] & 128 | z8.r[Regs_D] >> 1;
    z8.r[Regs_F] |= zTe6[z8.r[Regs_D]];
    wQi(c, z8.r[Regs_D])
};
z8oT_c253c203[43] = function(c) {
    tss += 8;
    z8.r[Regs_E] = wQj(c);
    z8.r[Regs_F] = z8.r[Regs_E] & 1;
    z8.r[Regs_E] = z8.r[Regs_E] & 128 | z8.r[Regs_E] >> 1;
    z8.r[Regs_F] |= zTe6[z8.r[Regs_E]];
    wQi(c, z8.r[Regs_E])
};
z8oT_c253c203[44] = function(c) {
    tss += 8;
    z8.r[Regs_H] = wQj(c);
    z8.r[Regs_F] = z8.r[Regs_H] & 1;
    z8.r[Regs_H] = z8.r[Regs_H] & 128 | z8.r[Regs_H] >> 1;
    z8.r[Regs_F] |= zTe6[z8.r[Regs_H]];
    wQi(c, z8.r[Regs_H])
};
z8oT_c253c203[45] = function(c) {
    tss += 8;
    z8.r[Regs_L] = wQj(c);
    z8.r[Regs_F] = z8.r[Regs_L] & 1;
    z8.r[Regs_L] = z8.r[Regs_L] & 128 | z8.r[Regs_L] >> 1;
    z8.r[Regs_F] |= zTe6[z8.r[Regs_L]];
    wQi(c, z8.r[Regs_L])
};
z8oT_c253c203[46] = function(c) {
    tss += 8;
    var d = wQj(c);
    z8.r[Regs_F] = d & 1;
    d = d & 128 | d >> 1;
    z8.r[Regs_F] |= zTe6[d];
    wQi(c, d)
};
z8oT_c253c203[47] = function(c) {
    tss += 8;
    z8.r[Regs_A] = wQj(c);
    z8.r[Regs_F] = z8.r[Regs_A] & 1;
    z8.r[Regs_A] = z8.r[Regs_A] & 128 | z8.r[Regs_A] >> 1;
    z8.r[Regs_F] |= zTe6[z8.r[Regs_A]];
    wQi(c, z8.r[Regs_A])
};
z8oT_c253c203[48] = function(c) {
    tss += 8;
    z8.r[Regs_B] = wQj(c);
    z8.r[Regs_F] = z8.r[Regs_B] >> 7;
    z8.r[Regs_B] = z8.r[Regs_B] << 1 | 1;
    z8.r[Regs_B] &= 255;
    z8.r[Regs_F] |= zTe6[z8.r[Regs_B]];
    wQi(c, z8.r[Regs_B])
};
z8oT_c253c203[49] = function(c) {
    tss += 8;
    z8.r[Regs_C] = wQj(c);
    z8.r[Regs_F] = z8.r[Regs_C] >> 7;
    z8.r[Regs_C] = z8.r[Regs_C] << 1 | 1;
    z8.r[Regs_C] &= 255;
    z8.r[Regs_F] |= zTe6[z8.r[Regs_C]];
    wQi(c, z8.r[Regs_C])
};
z8oT_c253c203[50] = function(c) {
    tss += 8;
    z8.r[Regs_D] = wQj(c);
    z8.r[Regs_F] = z8.r[Regs_D] >> 7;
    z8.r[Regs_D] = z8.r[Regs_D] << 1 | 1;
    z8.r[Regs_D] &= 255;
    z8.r[Regs_F] |= zTe6[z8.r[Regs_D]];
    wQi(c, z8.r[Regs_D])
};
z8oT_c253c203[51] = function(c) {
    tss += 8;
    z8.r[Regs_E] = wQj(c);
    z8.r[Regs_F] = z8.r[Regs_E] >> 7;
    z8.r[Regs_E] = z8.r[Regs_E] << 1 | 1;
    z8.r[Regs_E] &= 255;
    z8.r[Regs_F] |= zTe6[z8.r[Regs_E]];
    wQi(c, z8.r[Regs_E])
};
z8oT_c253c203[52] = function(c) {
    tss += 8;
    z8.r[Regs_H] = wQj(c);
    z8.r[Regs_F] = z8.r[Regs_H] >> 7;
    z8.r[Regs_H] = z8.r[Regs_H] << 1 | 1;
    z8.r[Regs_H] &= 255;
    z8.r[Regs_F] |= zTe6[z8.r[Regs_H]];
    wQi(c, z8.r[Regs_H])
};
z8oT_c253c203[53] = function(c) {
    tss += 8;
    z8.r[Regs_L] = wQj(c);
    z8.r[Regs_F] = z8.r[Regs_L] >> 7;
    z8.r[Regs_L] = z8.r[Regs_L] << 1 | 1;
    z8.r[Regs_L] &= 255;
    z8.r[Regs_F] |= zTe6[z8.r[Regs_L]];
    wQi(c, z8.r[Regs_L])
};
z8oT_c253c203[54] = function(c) {
    tss += 8;
    var d = wQj(c);
    z8.r[Regs_F] = d >> 7;
    d = (d << 1 | 1) & 255;
    z8.r[Regs_F] |= zTe6[d];
    wQi(c, d)
};
z8oT_c253c203[55] = function(c) {
    tss += 8;
    z8.r[Regs_A] = wQj(c);
    z8.r[Regs_F] = z8.r[Regs_A] >> 7;
    z8.r[Regs_A] = z8.r[Regs_A] << 1 | 1;
    z8.r[Regs_A] &= 255;
    z8.r[Regs_F] |= zTe6[z8.r[Regs_A]];
    wQi(c, z8.r[Regs_A])
};
z8oT_c253c203[56] = function(c) {
    tss += 8;
    z8.r[Regs_B] = wQj(c);
    z8.r[Regs_F] = z8.r[Regs_B] & 1;
    z8.r[Regs_B] >>= 1;
    z8.r[Regs_F] |= zTe6[z8.r[Regs_B]];
    wQi(c, z8.r[Regs_B])
};
z8oT_c253c203[57] = function(c) {
    tss += 8;
    z8.r[Regs_C] = wQj(c);
    z8.r[Regs_F] = z8.r[Regs_C] & 1;
    z8.r[Regs_C] >>= 1;
    z8.r[Regs_F] |= zTe6[z8.r[Regs_C]];
    wQi(c, z8.r[Regs_C])
};
z8oT_c253c203[58] = function(c) {
    tss += 8;
    z8.r[Regs_D] = wQj(c);
    z8.r[Regs_F] = z8.r[Regs_D] & 1;
    z8.r[Regs_D] >>= 1;
    z8.r[Regs_F] |= zTe6[z8.r[Regs_D]];
    wQi(c, z8.r[Regs_D])
};
z8oT_c253c203[59] = function(c) {
    tss += 8;
    z8.r[Regs_E] = wQj(c);
    z8.r[Regs_F] = z8.r[Regs_E] & 1;
    z8.r[Regs_E] >>= 1;
    z8.r[Regs_F] |= zTe6[z8.r[Regs_E]];
    wQi(c, z8.r[Regs_E])
};
z8oT_c253c203[60] = function(c) {
    tss += 8;
    z8.r[Regs_H] = wQj(c);
    z8.r[Regs_F] = z8.r[Regs_H] & 1;
    z8.r[Regs_H] >>= 1;
    z8.r[Regs_F] |= zTe6[z8.r[Regs_H]];
    wQi(c, z8.r[Regs_H])
};
z8oT_c253c203[61] = function(c) {
    tss += 8;
    z8.r[Regs_L] = wQj(c);
    z8.r[Regs_F] = z8.r[Regs_L] & 1;
    z8.r[Regs_L] >>= 1;
    z8.r[Regs_F] |= zTe6[z8.r[Regs_L]];
    wQi(c, z8.r[Regs_L])
};
z8oT_c253c203[62] = function(c) {
    tss += 8;
    var d = wQj(c);
    z8.r[Regs_F] = d & 1;
    d >>= 1;
    z8.r[Regs_F] |= zTe6[d];
    wQi(c, d)
};
z8oT_c253c203[63] = function(c) {
    tss += 8;
    z8.r[Regs_A] = wQj(c);
    z8.r[Regs_F] = z8.r[Regs_A] & 1;
    z8.r[Regs_A] >>= 1;
    z8.r[Regs_F] |= zTe6[z8.r[Regs_A]];
    wQi(c, z8.r[Regs_A])
};
z8oT_c253c203[71] = function(c) {
    tss += 5;
    var d = wQj(c);
    z8.r[Regs_F] = z8.r[Regs_F] & 1 | 16 | c >> 8 & 40;
    d & 1 || (z8.r[Regs_F] |= 68)
};
z8oT_c253c203[64] = z8oT_c253c203[71];
z8oT_c253c203[65] = z8oT_c253c203[71];
z8oT_c253c203[66] = z8oT_c253c203[71];
z8oT_c253c203[67] = z8oT_c253c203[71];
z8oT_c253c203[68] = z8oT_c253c203[71];
z8oT_c253c203[69] = z8oT_c253c203[71];
z8oT_c253c203[70] = z8oT_c253c203[71];
z8oT_c253c203[79] = function(c) {
    tss += 5;
    var d = wQj(c);
    z8.r[Regs_F] = z8.r[Regs_F] & 1 | 16 | c >> 8 & 40;
    d & 2 || (z8.r[Regs_F] |= 68)
};
z8oT_c253c203[72] = z8oT_c253c203[79];
z8oT_c253c203[73] = z8oT_c253c203[79];
z8oT_c253c203[74] = z8oT_c253c203[79];
z8oT_c253c203[75] = z8oT_c253c203[79];
z8oT_c253c203[76] = z8oT_c253c203[79];
z8oT_c253c203[77] = z8oT_c253c203[79];
z8oT_c253c203[78] = z8oT_c253c203[79];
z8oT_c253c203[87] = function(c) {
    tss += 5;
    var d = wQj(c);
    z8.r[Regs_F] = z8.r[Regs_F] & 1 | 16 | c >> 8 & 40;
    d & 4 || (z8.r[Regs_F] |= 68)
};
z8oT_c253c203[80] = z8oT_c253c203[87];
z8oT_c253c203[81] = z8oT_c253c203[87];
z8oT_c253c203[82] = z8oT_c253c203[87];
z8oT_c253c203[83] = z8oT_c253c203[87];
z8oT_c253c203[84] = z8oT_c253c203[87];
z8oT_c253c203[85] = z8oT_c253c203[87];
z8oT_c253c203[86] = z8oT_c253c203[87];
z8oT_c253c203[95] = function(c) {
    tss += 5;
    var d = wQj(c);
    z8.r[Regs_F] = z8.r[Regs_F] & 1 | 16 | c >> 8 & 40;
    d & 8 || (z8.r[Regs_F] |= 68)
};
z8oT_c253c203[88] = z8oT_c253c203[95];
z8oT_c253c203[89] = z8oT_c253c203[95];
z8oT_c253c203[90] = z8oT_c253c203[95];
z8oT_c253c203[91] = z8oT_c253c203[95];
z8oT_c253c203[92] = z8oT_c253c203[95];
z8oT_c253c203[93] = z8oT_c253c203[95];
z8oT_c253c203[94] = z8oT_c253c203[95];
z8oT_c253c203[103] = function(c) {
    tss += 5;
    var d = wQj(c);
    z8.r[Regs_F] = z8.r[Regs_F] & 1 | 16 | c >> 8 & 40;
    d & 16 || (z8.r[Regs_F] |= 68)
};
z8oT_c253c203[96] = z8oT_c253c203[103];
z8oT_c253c203[97] = z8oT_c253c203[103];
z8oT_c253c203[98] = z8oT_c253c203[103];
z8oT_c253c203[99] = z8oT_c253c203[103];
z8oT_c253c203[100] = z8oT_c253c203[103];
z8oT_c253c203[101] = z8oT_c253c203[103];
z8oT_c253c203[102] = z8oT_c253c203[103];
z8oT_c253c203[111] = function(c) {
    tss += 5;
    var d = wQj(c);
    z8.r[Regs_F] = z8.r[Regs_F] & 1 | 16 | c >> 8 & 40;
    d & 32 || (z8.r[Regs_F] |= 68)
};
z8oT_c253c203[104] = z8oT_c253c203[111];
z8oT_c253c203[105] = z8oT_c253c203[111];
z8oT_c253c203[106] = z8oT_c253c203[111];
z8oT_c253c203[107] = z8oT_c253c203[111];
z8oT_c253c203[108] = z8oT_c253c203[111];
z8oT_c253c203[109] = z8oT_c253c203[111];
z8oT_c253c203[110] = z8oT_c253c203[111];
z8oT_c253c203[119] = function(c) {
    tss += 5;
    var d = wQj(c);
    z8.r[Regs_F] = z8.r[Regs_F] & 1 | 16 | c >> 8 & 40;
    d & 64 || (z8.r[Regs_F] |= 68)
};
z8oT_c253c203[112] = z8oT_c253c203[119];
z8oT_c253c203[113] = z8oT_c253c203[119];
z8oT_c253c203[114] = z8oT_c253c203[119];
z8oT_c253c203[115] = z8oT_c253c203[119];
z8oT_c253c203[116] = z8oT_c253c203[119];
z8oT_c253c203[117] = z8oT_c253c203[119];
z8oT_c253c203[118] = z8oT_c253c203[119];
z8oT_c253c203[127] = function(c) {
    tss += 5;
    var d = wQj(c);
    z8.r[Regs_F] = z8.r[Regs_F] & 1 | 16 | c >> 8 & 40;
    d & 128 || (z8.r[Regs_F] |= 68);
    d & 128 && (z8.r[Regs_F] |= 128)
};
z8oT_c253c203[120] = z8oT_c253c203[127];
z8oT_c253c203[121] = z8oT_c253c203[127];
z8oT_c253c203[122] = z8oT_c253c203[127];
z8oT_c253c203[123] = z8oT_c253c203[127];
z8oT_c253c203[124] = z8oT_c253c203[127];
z8oT_c253c203[125] = z8oT_c253c203[127];
z8oT_c253c203[126] = z8oT_c253c203[127];
z8oT_c253c203[128] = function(c) {
    tss += 8;
    z8.r[Regs_B] = wQj(c) & 254;
    wQi(c, z8.r[Regs_B])
};
z8oT_c253c203[129] = function(c) {
    tss += 8;
    z8.r[Regs_C] = wQj(c) & 254;
    wQi(c, z8.r[Regs_C])
};
z8oT_c253c203[130] = function(c) {
    tss += 8;
    z8.r[Regs_D] = wQj(c) & 254;
    wQi(c, z8.r[Regs_D])
};
z8oT_c253c203[131] = function(c) {
    tss += 8;
    z8.r[Regs_E] = wQj(c) & 254;
    wQi(c, z8.r[Regs_E])
};
z8oT_c253c203[132] = function(c) {
    tss += 8;
    z8.r[Regs_H] = wQj(c) & 254;
    wQi(c, z8.r[Regs_H])
};
z8oT_c253c203[133] = function(c) {
    tss += 8;
    z8.r[Regs_L] = wQj(c) & 254;
    wQi(c, z8.r[Regs_L])
};
z8oT_c253c203[134] = function(c) {
    tss += 8;
    wQi(c, wQj(c) & 254)
};
z8oT_c253c203[135] = function(c) {
    tss += 8;
    z8.r[Regs_A] = wQj(c) & 254;
    wQi(c, z8.r[Regs_A])
};
z8oT_c253c203[136] = function(c) {
    tss += 8;
    z8.r[Regs_B] = wQj(c) & 253;
    wQi(c, z8.r[Regs_B])
};
z8oT_c253c203[137] = function(c) {
    tss += 8;
    z8.r[Regs_C] = wQj(c) & 253;
    wQi(c, z8.r[Regs_C])
};
z8oT_c253c203[138] = function(c) {
    tss += 8;
    z8.r[Regs_D] = wQj(c) & 253;
    wQi(c, z8.r[Regs_D])
};
z8oT_c253c203[139] = function(c) {
    tss += 8;
    z8.r[Regs_E] = wQj(c) & 253;
    wQi(c, z8.r[Regs_E])
};
z8oT_c253c203[140] = function(c) {
    tss += 8;
    z8.r[Regs_H] = wQj(c) & 253;
    wQi(c, z8.r[Regs_H])
};
z8oT_c253c203[141] = function(c) {
    tss += 8;
    z8.r[Regs_L] = wQj(c) & 253;
    wQi(c, z8.r[Regs_L])
};
z8oT_c253c203[142] = function(c) {
    tss += 8;
    wQi(c, wQj(c) & 253)
};
z8oT_c253c203[143] = function(c) {
    tss += 8;
    z8.r[Regs_A] = wQj(c) & 253;
    wQi(c, z8.r[Regs_A])
};
z8oT_c253c203[144] = function(c) {
    tss += 8;
    z8.r[Regs_B] = wQj(c) & 251;
    wQi(c, z8.r[Regs_B])
};
z8oT_c253c203[145] = function(c) {
    tss += 8;
    z8.r[Regs_C] = wQj(c) & 251;
    wQi(c, z8.r[Regs_C])
};
z8oT_c253c203[146] = function(c) {
    tss += 8;
    z8.r[Regs_D] = wQj(c) & 251;
    wQi(c, z8.r[Regs_D])
};
z8oT_c253c203[147] = function(c) {
    tss += 8;
    z8.r[Regs_E] = wQj(c) & 251;
    wQi(c, z8.r[Regs_E])
};
z8oT_c253c203[148] = function(c) {
    tss += 8;
    z8.r[Regs_H] = wQj(c) & 251;
    wQi(c, z8.r[Regs_H])
};
z8oT_c253c203[149] = function(c) {
    tss += 8;
    z8.r[Regs_L] = wQj(c) & 251;
    wQi(c, z8.r[Regs_L])
};
z8oT_c253c203[150] = function(c) {
    tss += 8;
    wQi(c, wQj(c) & 251)
};
z8oT_c253c203[151] = function(c) {
    tss += 8;
    z8.r[Regs_A] = wQj(c) & 251;
    wQi(c, z8.r[Regs_A])
};
z8oT_c253c203[152] = function(c) {
    tss += 8;
    z8.r[Regs_B] = wQj(c) & 247;
    wQi(c, z8.r[Regs_B])
};
z8oT_c253c203[153] = function(c) {
    tss += 8;
    z8.r[Regs_C] = wQj(c) & 247;
    wQi(c, z8.r[Regs_C])
};
z8oT_c253c203[154] = function(c) {
    tss += 8;
    z8.r[Regs_D] = wQj(c) & 247;
    wQi(c, z8.r[Regs_D])
};
z8oT_c253c203[155] = function(c) {
    tss += 8;
    z8.r[Regs_E] = wQj(c) & 247;
    wQi(c, z8.r[Regs_E])
};
z8oT_c253c203[156] = function(c) {
    tss += 8;
    z8.r[Regs_H] = wQj(c) & 247;
    wQi(c, z8.r[Regs_H])
};
z8oT_c253c203[157] = function(c) {
    tss += 8;
    z8.r[Regs_L] = wQj(c) & 247;
    wQi(c, z8.r[Regs_L])
};
z8oT_c253c203[158] = function(c) {
    tss += 8;
    wQi(c, wQj(c) & 247)
};
z8oT_c253c203[159] = function(c) {
    tss += 8;
    z8.r[Regs_A] = wQj(c) & 247;
    wQi(c, z8.r[Regs_A])
};
z8oT_c253c203[160] = function(c) {
    tss += 8;
    z8.r[Regs_B] = wQj(c) & 239;
    wQi(c, z8.r[Regs_B])
};
z8oT_c253c203[161] = function(c) {
    tss += 8;
    z8.r[Regs_C] = wQj(c) & 239;
    wQi(c, z8.r[Regs_C])
};
z8oT_c253c203[162] = function(c) {
    tss += 8;
    z8.r[Regs_D] = wQj(c) & 239;
    wQi(c, z8.r[Regs_D])
};
z8oT_c253c203[163] = function(c) {
    tss += 8;
    z8.r[Regs_E] = wQj(c) & 239;
    wQi(c, z8.r[Regs_E])
};
z8oT_c253c203[164] = function(c) {
    tss += 8;
    z8.r[Regs_H] = wQj(c) & 239;
    wQi(c, z8.r[Regs_H])
};
z8oT_c253c203[165] = function(c) {
    tss += 8;
    z8.r[Regs_L] = wQj(c) & 239;
    wQi(c, z8.r[Regs_L])
};
z8oT_c253c203[166] = function(c) {
    tss += 8;
    wQi(c, wQj(c) & 239)
};
z8oT_c253c203[167] = function(c) {
    tss += 8;
    z8.r[Regs_A] = wQj(c) & 239;
    wQi(c, z8.r[Regs_A])
};
z8oT_c253c203[168] = function(c) {
    tss += 8;
    z8.r[Regs_B] = wQj(c) & 223;
    wQi(c, z8.r[Regs_B])
};
z8oT_c253c203[169] = function(c) {
    tss += 8;
    z8.r[Regs_C] = wQj(c) & 223;
    wQi(c, z8.r[Regs_C])
};
z8oT_c253c203[170] = function(c) {
    tss += 8;
    z8.r[Regs_D] = wQj(c) & 223;
    wQi(c, z8.r[Regs_D])
};
z8oT_c253c203[171] = function(c) {
    tss += 8;
    z8.r[Regs_E] = wQj(c) & 223;
    wQi(c, z8.r[Regs_E])
};
z8oT_c253c203[172] = function(c) {
    tss += 8;
    z8.r[Regs_H] = wQj(c) & 223;
    wQi(c, z8.r[Regs_H])
};
z8oT_c253c203[173] = function(c) {
    tss += 8;
    z8.r[Regs_L] = wQj(c) & 223;
    wQi(c, z8.r[Regs_L])
};
z8oT_c253c203[174] = function(c) {
    tss += 8;
    wQi(c, wQj(c) & 223)
};
z8oT_c253c203[175] = function(c) {
    tss += 8;
    z8.r[Regs_A] = wQj(c) & 223;
    wQi(c, z8.r[Regs_A])
};
z8oT_c253c203[176] = function(c) {
    tss += 8;
    z8.r[Regs_B] = wQj(c) & 191;
    wQi(c, z8.r[Regs_B])
};
z8oT_c253c203[177] = function(c) {
    tss += 8;
    z8.r[Regs_C] = wQj(c) & 191;
    wQi(c, z8.r[Regs_C])
};
z8oT_c253c203[178] = function(c) {
    tss += 8;
    z8.r[Regs_D] = wQj(c) & 191;
    wQi(c, z8.r[Regs_D])
};
z8oT_c253c203[179] = function(c) {
    tss += 8;
    z8.r[Regs_E] = wQj(c) & 191;
    wQi(c, z8.r[Regs_E])
};
z8oT_c253c203[180] = function(c) {
    tss += 8;
    z8.r[Regs_H] = wQj(c) & 191;
    wQi(c, z8.r[Regs_H])
};
z8oT_c253c203[181] = function(c) {
    tss += 8;
    z8.r[Regs_L] = wQj(c) & 191;
    wQi(c, z8.r[Regs_L])
};
z8oT_c253c203[182] = function(c) {
    tss += 8;
    wQi(c, wQj(c) & 191)
};
z8oT_c253c203[183] = function(c) {
    tss += 8;
    z8.r[Regs_A] = wQj(c) & 191;
    wQi(c, z8.r[Regs_A])
};
z8oT_c253c203[184] = function(c) {
    tss += 8;
    z8.r[Regs_B] = wQj(c) & 127;
    wQi(c, z8.r[Regs_B])
};
z8oT_c253c203[185] = function(c) {
    tss += 8;
    z8.r[Regs_C] = wQj(c) & 127;
    wQi(c, z8.r[Regs_C])
};
z8oT_c253c203[186] = function(c) {
    tss += 8;
    z8.r[Regs_D] = wQj(c) & 127;
    wQi(c, z8.r[Regs_D])
};
z8oT_c253c203[187] = function(c) {
    tss += 8;
    z8.r[Regs_E] = wQj(c) & 127;
    wQi(c, z8.r[Regs_E])
};
z8oT_c253c203[188] = function(c) {
    tss += 8;
    z8.r[Regs_H] = wQj(c) & 127;
    wQi(c, z8.r[Regs_H])
};
z8oT_c253c203[189] = function(c) {
    tss += 8;
    z8.r[Regs_L] = wQj(c) & 127;
    wQi(c, z8.r[Regs_L])
};
z8oT_c253c203[190] = function(c) {
    tss += 8;
    wQi(c, wQj(c) & 127)
};
z8oT_c253c203[191] = function(c) {
    tss += 8;
    z8.r[Regs_A] = wQj(c) & 127;
    wQi(c, z8.r[Regs_A])
};
z8oT_c253c203[192] = function(c) {
    tss += 8;
    z8.r[Regs_B] = wQj(c) | 1;
    wQi(c, z8.r[Regs_B])
};
z8oT_c253c203[193] = function(c) {
    tss += 8;
    z8.r[Regs_C] = wQj(c) | 1;
    wQi(c, z8.r[Regs_C])
};
z8oT_c253c203[194] = function(c) {
    tss += 8;
    z8.r[Regs_D] = wQj(c) | 1;
    wQi(c, z8.r[Regs_D])
};
z8oT_c253c203[195] = function(c) {
    tss += 8;
    z8.r[Regs_E] = wQj(c) | 1;
    wQi(c, z8.r[Regs_E])
};
z8oT_c253c203[196] = function(c) {
    tss += 8;
    z8.r[Regs_H] = wQj(c) | 1;
    wQi(c, z8.r[Regs_H])
};
z8oT_c253c203[197] = function(c) {
    tss += 8;
    z8.r[Regs_L] = wQj(c) | 1;
    wQi(c, z8.r[Regs_L])
};
z8oT_c253c203[198] = function(c) {
    tss += 8;
    wQi(c, wQj(c) | 1)
};
z8oT_c253c203[199] = function(c) {
    tss += 8;
    z8.r[Regs_A] = wQj(c) | 1;
    wQi(c, z8.r[Regs_A])
};
z8oT_c253c203[200] = function(c) {
    tss += 8;
    z8.r[Regs_B] = wQj(c) | 2;
    wQi(c, z8.r[Regs_B])
};
z8oT_c253c203[201] = function(c) {
    tss += 8;
    z8.r[Regs_C] = wQj(c) | 2;
    wQi(c, z8.r[Regs_C])
};
z8oT_c253c203[202] = function(c) {
    tss += 8;
    z8.r[Regs_D] = wQj(c) | 2;
    wQi(c, z8.r[Regs_D])
};
z8oT_c253c203[203] = function(c) {
    tss += 8;
    z8.r[Regs_E] = wQj(c) | 2;
    wQi(c, z8.r[Regs_E])
};
z8oT_c253c203[204] = function(c) {
    tss += 8;
    z8.r[Regs_H] = wQj(c) | 2;
    wQi(c, z8.r[Regs_H])
};
z8oT_c253c203[205] = function(c) {
    tss += 8;
    z8.r[Regs_L] = wQj(c) | 2;
    wQi(c, z8.r[Regs_L])
};
z8oT_c253c203[206] = function(c) {
    tss += 8;
    wQi(c, wQj(c) | 2)
};
z8oT_c253c203[207] = function(c) {
    tss += 8;
    z8.r[Regs_A] = wQj(c) | 2;
    wQi(c, z8.r[Regs_A])
};
z8oT_c253c203[208] = function(c) {
    tss += 8;
    z8.r[Regs_B] = wQj(c) | 4;
    wQi(c, z8.r[Regs_B])
};
z8oT_c253c203[209] = function(c) {
    tss += 8;
    z8.r[Regs_C] = wQj(c) | 4;
    wQi(c, z8.r[Regs_C])
};
z8oT_c253c203[210] = function(c) {
    tss += 8;
    z8.r[Regs_D] = wQj(c) | 4;
    wQi(c, z8.r[Regs_D])
};
z8oT_c253c203[211] = function(c) {
    tss += 8;
    z8.r[Regs_E] = wQj(c) | 4;
    wQi(c, z8.r[Regs_E])
};
z8oT_c253c203[212] = function(c) {
    tss += 8;
    z8.r[Regs_H] = wQj(c) | 4;
    wQi(c, z8.r[Regs_H])
};
z8oT_c253c203[213] = function(c) {
    tss += 8;
    z8.r[Regs_L] = wQj(c) | 4;
    wQi(c, z8.r[Regs_L])
};
z8oT_c253c203[214] = function(c) {
    tss += 8;
    wQi(c, wQj(c) | 4)
};
z8oT_c253c203[215] = function(c) {
    tss += 8;
    z8.r[Regs_A] = wQj(c) | 4;
    wQi(c, z8.r[Regs_A])
};
z8oT_c253c203[216] = function(c) {
    tss += 8;
    z8.r[Regs_B] = wQj(c) | 8;
    wQi(c, z8.r[Regs_B])
};
z8oT_c253c203[217] = function(c) {
    tss += 8;
    z8.r[Regs_C] = wQj(c) | 8;
    wQi(c, z8.r[Regs_C])
};
z8oT_c253c203[218] = function(c) {
    tss += 8;
    z8.r[Regs_D] = wQj(c) | 8;
    wQi(c, z8.r[Regs_D])
};
z8oT_c253c203[219] = function(c) {
    tss += 8;
    z8.r[Regs_E] = wQj(c) | 8;
    wQi(c, z8.r[Regs_E])
};
z8oT_c253c203[220] = function(c) {
    tss += 8;
    z8.r[Regs_H] = wQj(c) | 8;
    wQi(c, z8.r[Regs_H])
};
z8oT_c253c203[221] = function(c) {
    tss += 8;
    z8.r[Regs_L] = wQj(c) | 8;
    wQi(c, z8.r[Regs_L])
};
z8oT_c253c203[222] = function(c) {
    tss += 8;
    wQi(c, wQj(c) | 8)
};
z8oT_c253c203[223] = function(c) {
    tss += 8;
    z8.r[Regs_A] = wQj(c) | 8;
    wQi(c, z8.r[Regs_A])
};
z8oT_c253c203[224] = function(c) {
    tss += 8;
    z8.r[Regs_B] = wQj(c) | 16;
    wQi(c, z8.r[Regs_B])
};
z8oT_c253c203[225] = function(c) {
    tss += 8;
    z8.r[Regs_C] = wQj(c) | 16;
    wQi(c, z8.r[Regs_C])
};
z8oT_c253c203[226] = function(c) {
    tss += 8;
    z8.r[Regs_D] = wQj(c) | 16;
    wQi(c, z8.r[Regs_D])
};
z8oT_c253c203[227] = function(c) {
    tss += 8;
    z8.r[Regs_E] = wQj(c) | 16;
    wQi(c, z8.r[Regs_E])
};
z8oT_c253c203[228] = function(c) {
    tss += 8;
    z8.r[Regs_H] = wQj(c) | 16;
    wQi(c, z8.r[Regs_H])
};
z8oT_c253c203[229] = function(c) {
    tss += 8;
    z8.r[Regs_L] = wQj(c) | 16;
    wQi(c, z8.r[Regs_L])
};
z8oT_c253c203[230] = function(c) {
    tss += 8;
    wQi(c, wQj(c) | 16)
};
z8oT_c253c203[231] = function(c) {
    tss += 8;
    z8.r[Regs_A] = wQj(c) | 16;
    wQi(c, z8.r[Regs_A])
};
z8oT_c253c203[232] = function(c) {
    tss += 8;
    z8.r[Regs_B] = wQj(c) | 32;
    wQi(c, z8.r[Regs_B])
};
z8oT_c253c203[233] = function(c) {
    tss += 8;
    z8.r[Regs_C] = wQj(c) | 32;
    wQi(c, z8.r[Regs_C])
};
z8oT_c253c203[234] = function(c) {
    tss += 8;
    z8.r[Regs_D] = wQj(c) | 32;
    wQi(c, z8.r[Regs_D])
};
z8oT_c253c203[235] = function(c) {
    tss += 8;
    z8.r[Regs_E] = wQj(c) | 32;
    wQi(c, z8.r[Regs_E])
};
z8oT_c253c203[236] = function(c) {
    tss += 8;
    z8.r[Regs_H] = wQj(c) | 32;
    wQi(c, z8.r[Regs_H])
};
z8oT_c253c203[237] = function(c) {
    tss += 8;
    z8.r[Regs_L] = wQj(c) | 32;
    wQi(c, z8.r[Regs_L])
};
z8oT_c253c203[238] = function(c) {
    tss += 8;
    wQi(c, wQj(c) | 32)
};
z8oT_c253c203[239] = function(c) {
    tss += 8;
    z8.r[Regs_A] = wQj(c) | 32;
    wQi(c, z8.r[Regs_A])
};
z8oT_c253c203[240] = function(c) {
    tss += 8;
    z8.r[Regs_B] = wQj(c) | 64;
    wQi(c, z8.r[Regs_B])
};
z8oT_c253c203[241] = function(c) {
    tss += 8;
    z8.r[Regs_C] = wQj(c) | 64;
    wQi(c, z8.r[Regs_C])
};
z8oT_c253c203[242] = function(c) {
    tss += 8;
    z8.r[Regs_D] = wQj(c) | 64;
    wQi(c, z8.r[Regs_D])
};
z8oT_c253c203[243] = function(c) {
    tss += 8;
    z8.r[Regs_E] = wQj(c) | 64;
    wQi(c, z8.r[Regs_E])
};
z8oT_c253c203[244] = function(c) {
    tss += 8;
    z8.r[Regs_H] = wQj(c) | 64;
    wQi(c, z8.r[Regs_H])
};
z8oT_c253c203[245] = function(c) {
    tss += 8;
    z8.r[Regs_L] = wQj(c) | 64;
    wQi(c, z8.r[Regs_L])
};
z8oT_c253c203[246] = function(c) {
    tss += 8;
    wQi(c, wQj(c) | 64)
};
z8oT_c253c203[247] = function(c) {
    tss += 8;
    z8.r[Regs_A] = wQj(c) | 64;
    wQi(c, z8.r[Regs_A])
};
z8oT_c253c203[248] = function(c) {
    tss += 8;
    z8.r[Regs_B] = wQj(c) | 128;
    wQi(c, z8.r[Regs_B])
};
z8oT_c253c203[249] = function(c) {
    tss += 8;
    z8.r[Regs_C] = wQj(c) | 128;
    wQi(c, z8.r[Regs_C])
};
z8oT_c253c203[250] = function(c) {
    tss += 8;
    z8.r[Regs_D] = wQj(c) | 128;
    wQi(c, z8.r[Regs_D])
};
z8oT_c253c203[251] = function(c) {
    tss += 8;
    z8.r[Regs_E] = wQj(c) | 128;
    wQi(c, z8.r[Regs_E])
};
z8oT_c253c203[252] = function(c) {
    tss += 8;
    z8.r[Regs_H] = wQj(c) | 128;
    wQi(c, z8.r[Regs_H])
};
z8oT_c253c203[253] = function(c) {
    tss += 8;
    z8.r[Regs_L] = wQj(c) | 128;
    wQi(c, z8.r[Regs_L])
};
z8oT_c253c203[254] = function(c) {
    tss += 8;
    wQi(c, wQj(c) | 128)
};
z8oT_c253c203[255] = function(c) {
    tss += 8;
    z8.r[Regs_A] = wQj(c) | 128;
    wQi(c, z8.r[Regs_A])
};
z8oT_c253c203[256] = z8oT_c253c203[255];
window.z8oT_c253 = Array(251);
z8oT_c253[9] = function() {
    var c = (z8.r[Regs_IYL] | z8.r[Regs_IYH] << 8) + (z8.r[Regs_C] | z8.r[Regs_B] << 8),
        d = ((z8.r[Regs_IYL] | z8.r[Regs_IYH] << 8) & 2048) >> 11 | ((z8.r[Regs_C] | z8.r[Regs_B] << 8) & 2048) >> 10 | (c & 2048) >> 9;
    tss += 7;
    z8.r[Regs_IYH] = c >> 8;
    z8.r[Regs_IYL] = c;
    z8.r[Regs_F] = z8.r[Regs_F] & 196 | (c & 65536 ? 1 : 0) | c >> 8 & 40 | hcat_[d]
};
z8oT_c253[25] = function() {
    var c = (z8.r[Regs_IYL] | z8.r[Regs_IYH] << 8) + (z8.r[Regs_E] | z8.r[Regs_D] << 8),
        d = ((z8.r[Regs_IYL] | z8.r[Regs_IYH] << 8) & 2048) >> 11 | ((z8.r[Regs_E] | z8.r[Regs_D] << 8) & 2048) >> 10 | (c & 2048) >> 9;
    tss += 7;
    z8.r[Regs_IYH] = c >> 8;
    z8.r[Regs_IYL] = c;
    z8.r[Regs_F] = z8.r[Regs_F] & 196 | (c & 65536 ? 1 : 0) | c >> 8 & 40 | hcat_[d]
};
z8oT_c253[33] = function() {
    tss += 6;
    z8.r[Regs_IYL] = wQj(z8.r2[Regs2_PC]++);
    z8.r[Regs_IYH] = wQj(z8.r2[Regs2_PC]++)
};
z8oT_c253[34] = function() {
    tss += 12;
    var c = wQj(z8.r2[Regs2_PC]++),
        c = c | wQj(z8.r2[Regs2_PC]++) << 8;
    wQi(c++, z8.r[Regs_IYL]);
    wQi(c & 65535, z8.r[Regs_IYH])
};
z8oT_c253[35] = function() {
    tss += 2;
    var c = (z8.r[Regs_IYL] | z8.r[Regs_IYH] << 8) + 1 & 65535;
    z8.r[Regs_IYH] = c >> 8;
    z8.r[Regs_IYL] = c
};
z8oT_c253[36] = function() {
    z8.r[Regs_IYH] += 1;
    z8.r[Regs_F] = z8.r[Regs_F] & 1 | (128 == z8.r[Regs_IYH] ? 4 : 0) | (z8.r[Regs_IYH] & 15 ? 0 : 16) | zTe5[z8.r[Regs_IYH]]
};
z8oT_c253[37] = function() {
    z8.r[Regs_F] = z8.r[Regs_F] & 1 | (z8.r[Regs_IYH] & 15 ? 0 : 16) | 2;
    --z8.r[Regs_IYH];
    z8.r[Regs_F] = z8.r[Regs_F] | (127 == z8.r[Regs_IYH] ? 4 : 0) | zTe5[z8.r[Regs_IYH]]
};
z8oT_c253[38] = function() {
    tss += 3;
    z8.r[Regs_IYH] = wQj(z8.r2[Regs2_PC]++)
};
z8oT_c253[41] = function() {
    var c = (z8.r[Regs_IYL] | z8.r[Regs_IYH] << 8) + (z8.r[Regs_IYL] | z8.r[Regs_IYH] << 8),
        d = ((z8.r[Regs_IYL] | z8.r[Regs_IYH] << 8) & 2048) >> 11 | ((z8.r[Regs_IYL] | z8.r[Regs_IYH] << 8) & 2048) >> 10 | (c & 2048) >> 9;
    tss += 7;
    z8.r[Regs_IYH] = c >> 8;
    z8.r[Regs_IYL] = c;
    z8.r[Regs_F] = z8.r[Regs_F] & 196 | (c & 65536 ? 1 : 0) | c >> 8 & 40 | hcat_[d]
};
z8oT_c253[42] = function() {
    tss += 12;
    var c = wQj(z8.r2[Regs2_PC]++),
        c = c | wQj(z8.r2[Regs2_PC]++) << 8;
    z8.r[Regs_IYL] = wQj(c++);
    z8.r[Regs_IYH] = wQj(c & 65535)
};
z8oT_c253[43] = function() {
    tss += 2;
    var c = (z8.r[Regs_IYL] | z8.r[Regs_IYH] << 8) - 1 & 65535;
    z8.r[Regs_IYH] = c >> 8;
    z8.r[Regs_IYL] = c
};
z8oT_c253[44] = function() {
    z8.r[Regs_IYL] += 1;
    z8.r[Regs_F] = z8.r[Regs_F] & 1 | (128 == z8.r[Regs_IYL] ? 4 : 0) | (z8.r[Regs_IYL] & 15 ? 0 : 16) | zTe5[z8.r[Regs_IYL]]
};
z8oT_c253[45] = function() {
    z8.r[Regs_F] = z8.r[Regs_F] & 1 | (z8.r[Regs_IYL] & 15 ? 0 : 16) | 2;
    --z8.r[Regs_IYL];
    z8.r[Regs_F] = z8.r[Regs_F] | (127 == z8.r[Regs_IYL] ? 4 : 0) | zTe5[z8.r[Regs_IYL]]
};
z8oT_c253[46] = function() {
    tss += 3;
    z8.r[Regs_IYL] = wQj(z8.r2[Regs2_PC]++)
};
z8oT_c253[52] = function() {
    tss += 15;
    var c = (z8.r[Regs_IYL] | z8.r[Regs_IYH] << 8) + sXd(wQj(z8.r2[Regs2_PC]++)) & 65535,
        d = wQj(c),
        d = d + 1 & 255;
    z8.r[Regs_F] = z8.r[Regs_F] & 1 | (128 == d ? 4 : 0) | (d & 15 ? 0 : 16) | zTe5[d];
    wQi(c, d)
};
z8oT_c253[53] = function() {
    tss += 15;
    var c = (z8.r[Regs_IYL] | z8.r[Regs_IYH] << 8) + sXd(wQj(z8.r2[Regs2_PC]++)) & 65535,
        d = wQj(c);
    z8.r[Regs_F] = z8.r[Regs_F] & 1 | (d & 15 ? 0 : 16) | 2;
    d = d - 1 & 255;
    z8.r[Regs_F] = z8.r[Regs_F] | (127 == d ? 4 : 0) | zTe5[d];
    wQi(c, d)
};
z8oT_c253[54] = function() {
    tss += 11;
    var c = (z8.r[Regs_IYL] | z8.r[Regs_IYH] << 8) + sXd(wQj(z8.r2[Regs2_PC]++)) & 65535;
    wQi(c, wQj(z8.r2[Regs2_PC]++))
};
z8oT_c253[57] = function() {
    var c = (z8.r[Regs_IYL] | z8.r[Regs_IYH] << 8) + z8.r2[Regs2_SP],
        d = ((z8.r[Regs_IYL] | z8.r[Regs_IYH] << 8) & 2048) >> 11 | (z8.r2[Regs2_SP] & 2048) >> 10 | (c & 2048) >> 9;
    tss += 7;
    z8.r[Regs_IYH] = c >> 8;
    z8.r[Regs_IYL] = c;
    z8.r[Regs_F] = z8.r[Regs_F] & 196 | (c & 65536 ? 1 : 0) | c >> 8 & 40 | hcat_[d]
};
z8oT_c253[68] = function() {
    z8.r[Regs_B] = z8.r[Regs_IYH]
};
z8oT_c253[69] = function() {
    z8.r[Regs_B] = z8.r[Regs_IYL]
};
z8oT_c253[70] = function() {
    tss += 11;
    z8.r[Regs_B] = wQj((z8.r[Regs_IYL] | z8.r[Regs_IYH] << 8) + sXd(wQj(z8.r2[Regs2_PC]++)) & 65535)
};
z8oT_c253[76] = function() {
    z8.r[Regs_C] = z8.r[Regs_IYH]
};
z8oT_c253[77] = function() {
    z8.r[Regs_C] = z8.r[Regs_IYL]
};
z8oT_c253[78] = function() {
    tss += 11;
    z8.r[Regs_C] = wQj((z8.r[Regs_IYL] | z8.r[Regs_IYH] << 8) + sXd(wQj(z8.r2[Regs2_PC]++)) & 65535)
};
z8oT_c253[84] = function() {
    z8.r[Regs_D] = z8.r[Regs_IYH]
};
z8oT_c253[85] = function() {
    z8.r[Regs_D] = z8.r[Regs_IYL]
};
z8oT_c253[86] = function() {
    tss += 11;
    z8.r[Regs_D] = wQj((z8.r[Regs_IYL] | z8.r[Regs_IYH] << 8) + sXd(wQj(z8.r2[Regs2_PC]++)) & 65535)
};
z8oT_c253[92] = function() {
    z8.r[Regs_E] = z8.r[Regs_IYH]
};
z8oT_c253[93] = function() {
    z8.r[Regs_E] = z8.r[Regs_IYL]
};
z8oT_c253[94] = function() {
    tss += 11;
    z8.r[Regs_E] = wQj((z8.r[Regs_IYL] | z8.r[Regs_IYH] << 8) + sXd(wQj(z8.r2[Regs2_PC]++)) & 65535)
};
z8oT_c253[96] = function() {
    z8.r[Regs_IYH] = z8.r[Regs_B]
};
z8oT_c253[97] = function() {
    z8.r[Regs_IYH] = z8.r[Regs_C]
};
z8oT_c253[98] = function() {
    z8.r[Regs_IYH] = z8.r[Regs_D]
};
z8oT_c253[99] = function() {
    z8.r[Regs_IYH] = z8.r[Regs_E]
};
z8oT_c253[101] = function() {
    z8.r[Regs_IYH] = z8.r[Regs_IYL]
};
z8oT_c253[100] = z8oT_c253[101];
z8oT_c253[102] = function() {
    tss += 11;
    z8.r[Regs_H] = wQj((z8.r[Regs_IYL] | z8.r[Regs_IYH] << 8) + sXd(wQj(z8.r2[Regs2_PC]++)) & 65535)
};
z8oT_c253[103] = function() {
    z8.r[Regs_IYH] = z8.r[Regs_A]
};
z8oT_c253[104] = function() {
    z8.r[Regs_IYL] = z8.r[Regs_B]
};
z8oT_c253[105] = function() {
    z8.r[Regs_IYL] = z8.r[Regs_C]
};
z8oT_c253[106] = function() {
    z8.r[Regs_IYL] = z8.r[Regs_D]
};
z8oT_c253[107] = function() {
    z8.r[Regs_IYL] = z8.r[Regs_E]
};
z8oT_c253[108] = function() {
    z8.r[Regs_IYL] = z8.r[Regs_IYH]
};
z8oT_c253[110] = function() {
    tss += 11;
    z8.r[Regs_L] = wQj((z8.r[Regs_IYL] | z8.r[Regs_IYH] << 8) + sXd(wQj(z8.r2[Regs2_PC]++)) & 65535)
};
z8oT_c253[109] = z8oT_c253[110];
z8oT_c253[111] = function() {
    z8.r[Regs_IYL] = z8.r[Regs_A]
};
z8oT_c253[112] = function() {
    tss += 11;
    wQi((z8.r[Regs_IYL] | z8.r[Regs_IYH] << 8) + sXd(wQj(z8.r2[Regs2_PC]++)) & 65535, z8.r[Regs_B])
};
z8oT_c253[113] = function() {
    tss += 11;
    wQi((z8.r[Regs_IYL] | z8.r[Regs_IYH] << 8) + sXd(wQj(z8.r2[Regs2_PC]++)) & 65535, z8.r[Regs_C])
};
z8oT_c253[114] = function() {
    tss += 11;
    wQi((z8.r[Regs_IYL] | z8.r[Regs_IYH] << 8) + sXd(wQj(z8.r2[Regs2_PC]++)) & 65535, z8.r[Regs_D])
};
z8oT_c253[115] = function() {
    tss += 11;
    wQi((z8.r[Regs_IYL] | z8.r[Regs_IYH] << 8) + sXd(wQj(z8.r2[Regs2_PC]++)) & 65535, z8.r[Regs_E])
};
z8oT_c253[116] = function() {
    tss += 11;
    wQi((z8.r[Regs_IYL] | z8.r[Regs_IYH] << 8) + sXd(wQj(z8.r2[Regs2_PC]++)) & 65535, z8.r[Regs_H])
};
z8oT_c253[117] = function() {
    tss += 11;
    wQi((z8.r[Regs_IYL] | z8.r[Regs_IYH] << 8) + sXd(wQj(z8.r2[Regs2_PC]++)) & 65535, z8.r[Regs_L])
};
z8oT_c253[119] = function() {
    tss += 11;
    wQi((z8.r[Regs_IYL] | z8.r[Regs_IYH] << 8) + sXd(wQj(z8.r2[Regs2_PC]++)) & 65535, z8.r[Regs_A])
};
z8oT_c253[124] = function() {
    z8.r[Regs_A] = z8.r[Regs_IYH]
};
z8oT_c253[125] = function() {
    z8.r[Regs_A] = z8.r[Regs_IYL]
};
z8oT_c253[126] = function() {
    tss += 11;
    z8.r[Regs_A] = wQj((z8.r[Regs_IYL] | z8.r[Regs_IYH] << 8) + sXd(wQj(z8.r2[Regs2_PC]++)) & 65535)
};
z8oT_c253[132] = function() {
    var c = z8.r[Regs_A] + z8.r[Regs_IYH],
        d = (z8.r[Regs_A] & 136) >> 3 | (z8.r[Regs_IYH] & 136) >> 2 | (c & 136) >> 1;
    z8.r[Regs_A] = c;
    z8.r[Regs_F] = (c & 256 ? 1 : 0) | hcat_[d & 7] | oAt[d >> 4] | zTe5[z8.r[Regs_A]]
};
z8oT_c253[133] = function() {
    var c = z8.r[Regs_A] + z8.r[Regs_IYL],
        d = (z8.r[Regs_A] & 136) >> 3 | (z8.r[Regs_IYL] & 136) >> 2 | (c & 136) >> 1;
    z8.r[Regs_A] = c;
    z8.r[Regs_F] = (c & 256 ? 1 : 0) | hcat_[d & 7] | oAt[d >> 4] | zTe5[z8.r[Regs_A]]
};
z8oT_c253[134] = function() {
    tss += 11;
    var c = wQj((z8.r[Regs_IYL] | z8.r[Regs_IYH] << 8) + sXd(wQj(z8.r2[Regs2_PC]++)) & 65535),
        d = z8.r[Regs_A] + c,
        c = (z8.r[Regs_A] & 136) >> 3 | (c & 136) >> 2 | (d & 136) >> 1;
    z8.r[Regs_A] = d;
    z8.r[Regs_F] = (d & 256 ? 1 : 0) | hcat_[c & 7] | oAt[c >> 4] | zTe5[z8.r[Regs_A]]
};
z8oT_c253[140] = function() {
    var c = z8.r[Regs_A] + z8.r[Regs_IYH] + (z8.r[Regs_F] & 1),
        d = (z8.r[Regs_A] & 136) >> 3 | (z8.r[Regs_IYH] & 136) >> 2 | (c & 136) >> 1;
    z8.r[Regs_A] = c;
    z8.r[Regs_F] = (c & 256 ? 1 : 0) | hcat_[d & 7] | oAt[d >> 4] | zTe5[z8.r[Regs_A]]
};
z8oT_c253[141] = function() {
    var c = z8.r[Regs_A] + z8.r[Regs_IYL] + (z8.r[Regs_F] & 1),
        d = (z8.r[Regs_A] & 136) >> 3 | (z8.r[Regs_IYL] & 136) >> 2 | (c & 136) >> 1;
    z8.r[Regs_A] = c;
    z8.r[Regs_F] = (c & 256 ? 1 : 0) | hcat_[d & 7] | oAt[d >> 4] | zTe5[z8.r[Regs_A]]
};
z8oT_c253[142] = function() {
    tss += 11;
    var c = wQj((z8.r[Regs_IYL] | z8.r[Regs_IYH] << 8) + sXd(wQj(z8.r2[Regs2_PC]++)) & 65535),
        d = z8.r[Regs_A] + c + (z8.r[Regs_F] & 1),
        c = (z8.r[Regs_A] & 136) >> 3 | (c & 136) >> 2 | (d & 136) >> 1;
    z8.r[Regs_A] = d;
    z8.r[Regs_F] = (d & 256 ? 1 : 0) | hcat_[c & 7] | oAt[c >> 4] | zTe5[z8.r[Regs_A]]
};
z8oT_c253[148] = function() {
    var c = z8.r[Regs_A] - z8.r[Regs_IYH],
        d = (z8.r[Regs_A] & 136) >> 3 | (z8.r[Regs_IYH] & 136) >> 2 | (c & 136) >> 1;
    z8.r[Regs_A] = c;
    z8.r[Regs_F] = (c & 256 ? 1 : 0) | 2 | hcst_[d & 7] | oSt[d >> 4] | zTe5[z8.r[Regs_A]]
};
z8oT_c253[149] = function() {
    var c = z8.r[Regs_A] - z8.r[Regs_IYL],
        d = (z8.r[Regs_A] & 136) >> 3 | (z8.r[Regs_IYL] & 136) >> 2 | (c & 136) >> 1;
    z8.r[Regs_A] = c;
    z8.r[Regs_F] = (c & 256 ? 1 : 0) | 2 | hcst_[d & 7] | oSt[d >> 4] | zTe5[z8.r[Regs_A]]
};
z8oT_c253[150] = function() {
    tss += 11;
    var c = wQj((z8.r[Regs_IYL] | z8.r[Regs_IYH] << 8) + sXd(wQj(z8.r2[Regs2_PC]++)) & 65535),
        d = z8.r[Regs_A] - c,
        c = (z8.r[Regs_A] & 136) >> 3 | (c & 136) >> 2 | (d & 136) >> 1;
    z8.r[Regs_A] = d;
    z8.r[Regs_F] = (d & 256 ? 1 : 0) | 2 | hcst_[c & 7] | oSt[c >> 4] | zTe5[z8.r[Regs_A]]
};
z8oT_c253[156] = function() {
    var c = z8.r[Regs_A] - z8.r[Regs_IYH] - (z8.r[Regs_F] & 1),
        d = (z8.r[Regs_A] & 136) >> 3 | (z8.r[Regs_IYH] & 136) >> 2 | (c & 136) >> 1;
    z8.r[Regs_A] = c;
    z8.r[Regs_F] = (c & 256 ? 1 : 0) | 2 | hcst_[d & 7] | oSt[d >> 4] | zTe5[z8.r[Regs_A]]
};
z8oT_c253[157] = function() {
    var c = z8.r[Regs_A] - z8.r[Regs_IYL] - (z8.r[Regs_F] & 1),
        d = (z8.r[Regs_A] & 136) >> 3 | (z8.r[Regs_IYL] & 136) >> 2 | (c & 136) >> 1;
    z8.r[Regs_A] = c;
    z8.r[Regs_F] = (c & 256 ? 1 : 0) | 2 | hcst_[d & 7] | oSt[d >> 4] | zTe5[z8.r[Regs_A]]
};
z8oT_c253[158] = function() {
    tss += 11;
    var c = wQj((z8.r[Regs_IYL] | z8.r[Regs_IYH] << 8) + sXd(wQj(z8.r2[Regs2_PC]++)) & 65535),
        d = z8.r[Regs_A] - c - (z8.r[Regs_F] & 1),
        c = (z8.r[Regs_A] & 136) >> 3 | (c & 136) >> 2 | (d & 136) >> 1;
    z8.r[Regs_A] = d;
    z8.r[Regs_F] = (d & 256 ? 1 : 0) | 2 | hcst_[c & 7] | oSt[c >> 4] | zTe5[z8.r[Regs_A]]
};
z8oT_c253[164] = function() {
    z8.r[Regs_A] &= z8.r[Regs_IYH];
    z8.r[Regs_F] = 16 | zTe6[z8.r[Regs_A]]
};
z8oT_c253[165] = function() {
    z8.r[Regs_A] &= z8.r[Regs_IYL];
    z8.r[Regs_F] = 16 | zTe6[z8.r[Regs_A]]
};
z8oT_c253[166] = function() {
    tss += 11;
    var c = wQj((z8.r[Regs_IYL] | z8.r[Regs_IYH] << 8) + sXd(wQj(z8.r2[Regs2_PC]++)) & 65535);
    z8.r[Regs_A] &= c;
    z8.r[Regs_F] = 16 | zTe6[z8.r[Regs_A]]
};
z8oT_c253[172] = function() {
    z8.r[Regs_A] ^= z8.r[Regs_IYH];
    z8.r[Regs_F] = zTe6[z8.r[Regs_A]]
};
z8oT_c253[173] = function() {
    z8.r[Regs_A] ^= z8.r[Regs_IYL];
    z8.r[Regs_F] = zTe6[z8.r[Regs_A]]
};
z8oT_c253[174] = function() {
    tss += 11;
    var c = wQj((z8.r[Regs_IYL] | z8.r[Regs_IYH] << 8) + sXd(wQj(z8.r2[Regs2_PC]++)) & 65535);
    z8.r[Regs_A] ^= c;
    z8.r[Regs_F] = zTe6[z8.r[Regs_A]]
};
z8oT_c253[180] = function() {
    z8.r[Regs_A] |= z8.r[Regs_IYH];
    z8.r[Regs_F] = zTe6[z8.r[Regs_A]]
};
z8oT_c253[181] = function() {
    z8.r[Regs_A] |= z8.r[Regs_IYL];
    z8.r[Regs_F] = zTe6[z8.r[Regs_A]]
};
z8oT_c253[182] = function() {
    tss += 11;
    var c = wQj((z8.r[Regs_IYL] | z8.r[Regs_IYH] << 8) + sXd(wQj(z8.r2[Regs2_PC]++)) & 65535);
    z8.r[Regs_A] |= c;
    z8.r[Regs_F] = zTe6[z8.r[Regs_A]]
};
z8oT_c253[188] = function() {
    var c = z8.r[Regs_A] - z8.r[Regs_IYH],
        d = (z8.r[Regs_A] & 136) >> 3 | (z8.r[Regs_IYH] & 136) >> 2 | (c & 136) >> 1;
    z8.r[Regs_F] = (c & 256 ? 1 : c ? 0 : 64) | 2 | hcst_[d & 7] | oSt[d >> 4] | z8.r[Regs_IYH] & 40 | c & 128
};
z8oT_c253[189] = function() {
    var c = z8.r[Regs_A] - z8.r[Regs_IYL],
        d = (z8.r[Regs_A] & 136) >> 3 | (z8.r[Regs_IYL] & 136) >> 2 | (c & 136) >> 1;
    z8.r[Regs_F] = (c & 256 ? 1 : c ? 0 : 64) | 2 | hcst_[d & 7] | oSt[d >> 4] | z8.r[Regs_IYL] & 40 | c & 128
};
z8oT_c253[190] = function() {
    tss += 11;
    var c = wQj((z8.r[Regs_IYL] | z8.r[Regs_IYH] << 8) + sXd(wQj(z8.r2[Regs2_PC]++)) & 65535),
        d = z8.r[Regs_A] - c,
        f = (z8.r[Regs_A] & 136) >> 3 | (c & 136) >> 2 | (d & 136) >> 1;
    z8.r[Regs_F] = (d & 256 ? 1 : d ? 0 : 64) | 2 | hcst_[f & 7] | oSt[f >> 4] | c & 40 | d & 128
};
z8oT_c253[203] = function() {
    tss += 7;
    var c = (z8.r[Regs_IYL] | z8.r[Regs_IYH] << 8) + sXd(wQj(z8.r2[Regs2_PC]++)),
        d = wQj(z8.r2[Regs2_PC]++);
    (d = z8oT_c253c203[d]) || (d = z8oT_c253c203[z8oT_c253c203.length - 1]);
    d(c)
};
z8oT_c253[225] = function() {
    tss += 6;
    z8.r[Regs_IYL] = wQj(z8.r2[Regs2_SP]++);
    z8.r[Regs_IYH] = wQj(z8.r2[Regs2_SP]++)
};
z8oT_c253[227] = function() {
    var c = wQj(z8.r2[Regs2_SP]),
        d = wQj(z8.r2[Regs2_SP] + 1);
    tss += 15;
    wQi(z8.r2[Regs2_SP] + 1, z8.r[Regs_IYH]);
    wQi(z8.r2[Regs2_SP], z8.r[Regs_IYL]);
    z8.r[Regs_IYL] = c;
    z8.r[Regs_IYH] = d
};
z8oT_c253[229] = function() {
    tss += 7;
    z8.r2[Regs2_SP]--;
    wQi(z8.r2[Regs2_SP], z8.r[Regs_IYH]);
    z8.r2[Regs2_SP]--;
    wQi(z8.r2[Regs2_SP], z8.r[Regs_IYL])
};
z8oT_c253[233] = function() {
    z8.r2[Regs2_PC] = z8.r[Regs_IYL] | z8.r[Regs_IYH] << 8
};
z8oT_c253[249] = function() {
    tss += 2;
    z8.r2[Regs2_SP] = z8.r[Regs_IYL] | z8.r[Regs_IYH] << 8
};
z8oT_c253[250] = function() {
    z8.r2[Regs2_PC]--;
    z8.r[Regs_R]--;
    z8.r[Regs_R] &= 127
};
window.z8oT = Array(257);
z8oT[0] = function() {};
z8oT[1] = function() {
    tss += 6;
    z8.r[Regs_C] = wQj(z8.r2[Regs2_PC]++);
    z8.r[Regs_B] = wQj(z8.r2[Regs2_PC]++)
};
z8oT[2] = function() {
    tss += 3;
    wQi(z8.r[Regs_C] | z8.r[Regs_B] << 8, z8.r[Regs_A])
};
z8oT[3] = function() {
    tss += 2;
    var c = (z8.r[Regs_C] | z8.r[Regs_B] << 8) + 1 & 65535;
    z8.r[Regs_B] = c >> 8;
    z8.r[Regs_C] = c
};
z8oT[4] = function() {
    z8.r[Regs_B] += 1;
    z8.r[Regs_F] = z8.r[Regs_F] & 1 | bfi_table[z8.r[Regs_B]]
};
z8oT[5] = function() {
    --z8.r[Regs_B];
    z8.r[Regs_F] = z8.r[Regs_F] & 1 | bfd_table[z8.r[Regs_B]]
};
z8oT[6] = function() {
    tss += 3;
    z8.r[Regs_B] = wQj(z8.r2[Regs2_PC]++)
};
z8oT[7] = function() {
    z8.r[Regs_A] = (z8.r[Regs_A] & 127) << 1 | z8.r[Regs_A] >> 7;
    z8.r[Regs_F] = z8.r[Regs_F] & 196 | z8.r[Regs_A] & 41
};
z8oT[8] = function() {
    var c = z8.r[Regs_A],
        d = z8.r[Regs_F];
    z8.r[Regs_A] = z8.r[Regs_A_];
    z8.r[Regs_F] = z8.r[Regs_F_];
    z8.r[Regs_A_] = c;
    z8.r[Regs_F_] = d
};
z8oT[9] = function() {
    var c = (z8.r[Regs_L] | z8.r[Regs_H] << 8) + (z8.r[Regs_C] | z8.r[Regs_B] << 8),
        d = ((z8.r[Regs_L] | z8.r[Regs_H] << 8) & 2048) >> 11 | ((z8.r[Regs_C] | z8.r[Regs_B] << 8) & 2048) >> 10 | (c & 2048) >> 9;
    tss += 7;
    z8.r[Regs_H] = c >> 8;
    z8.r[Regs_L] = c;
    z8.r[Regs_F] = z8.r[Regs_F] & 196 | (c & 65536 ? 1 : 0) | c >> 8 & 40 | hcat_[d]
};
z8oT[10] = function() {
    tss += 3;
    z8.r[Regs_A] = wQj(z8.r[Regs_C] | z8.r[Regs_B] << 8)
};
z8oT[11] = function() {
    tss += 2;
    var c = (z8.r[Regs_C] | z8.r[Regs_B] << 8) - 1 & 65535;
    z8.r[Regs_B] = c >> 8;
    z8.r[Regs_C] = c
};
z8oT[12] = function() {
    z8.r[Regs_C] += 1;
    z8.r[Regs_F] = z8.r[Regs_F] & 1 | bfi_table[z8.r[Regs_C]]
};
z8oT[13] = function() {
    --z8.r[Regs_C];
    z8.r[Regs_F] = z8.r[Regs_F] & 1 | bfd_table[z8.r[Regs_C]]
};
z8oT[14] = function() {
    tss += 3;
    z8.r[Regs_C] = wQj(z8.r2[Regs2_PC]++)
};
z8oT[15] = function() {
    z8.r[Regs_F] = z8.r[Regs_F] & 196 | z8.r[Regs_A] & 1;
    z8.r[Regs_A] = z8.r[Regs_A] >> 1 | (z8.r[Regs_A] & 1) << 7;
    z8.r[Regs_F] |= z8.r[Regs_A] & 40
};
z8oT[16] = function() {
    tss += 4;
    --z8.r[Regs_B];
    z8.r[Regs_B] && (tss += 1, tss += 1, tss += 1, tss += 1, tss += 1, z8.r2[Regs2_PC] += sXd(wQj(z8.r2[Regs2_PC])));
    z8.r2[Regs2_PC]++
};
z8oT[17] = function() {
    tss += 6;
    z8.r[Regs_E] = wQj(z8.r2[Regs2_PC]++);
    z8.r[Regs_D] = wQj(z8.r2[Regs2_PC]++)
};
z8oT[18] = function() {
    tss += 3;
    wQi(z8.r[Regs_E] | z8.r[Regs_D] << 8, z8.r[Regs_A])
};
z8oT[19] = function() {
    tss += 2;
    var c = (z8.r[Regs_E] | z8.r[Regs_D] << 8) + 1 & 65535;
    z8.r[Regs_D] = c >> 8;
    z8.r[Regs_E] = c
};
z8oT[20] = function() {
    z8.r[Regs_D] += 1;
    z8.r[Regs_F] = z8.r[Regs_F] & 1 | bfi_table[z8.r[Regs_D]]
};
z8oT[21] = function() {
    --z8.r[Regs_D];
    z8.r[Regs_F] = z8.r[Regs_F] & 1 | bfd_table[z8.r[Regs_D]]
};
z8oT[22] = function() {
    tss += 3;
    z8.r[Regs_D] = wQj(z8.r2[Regs2_PC]++)
};
z8oT[23] = function() {
    var c = z8.r[Regs_A];
    z8.r[Regs_A] = (z8.r[Regs_A] & 127) << 1 | z8.r[Regs_F] & 1;
    z8.r[Regs_F] = z8.r[Regs_F] & 196 | z8.r[Regs_A] & 40 | c >> 7
};
z8oT[24] = function() {
    tss += 8;
    z8.r2[Regs2_PC] += sXd(wQj(z8.r2[Regs2_PC]));
    z8.r2[Regs2_PC]++
};
z8oT[25] = function() {
    var c = (z8.r[Regs_L] | z8.r[Regs_H] << 8) + (z8.r[Regs_E] | z8.r[Regs_D] << 8),
        d = ((z8.r[Regs_L] | z8.r[Regs_H] << 8) & 2048) >> 11 | ((z8.r[Regs_E] | z8.r[Regs_D] << 8) & 2048) >> 10 | (c & 2048) >> 9;
    tss += 7;
    z8.r[Regs_H] = c >> 8;
    z8.r[Regs_L] = c;
    z8.r[Regs_F] = z8.r[Regs_F] & 196 | (c & 65536 ? 1 : 0) | c >> 8 & 40 | hcat_[d]
};
z8oT[26] = function() {
    tss += 3;
    z8.r[Regs_A] = wQj(z8.r[Regs_E] | z8.r[Regs_D] << 8)
};
z8oT[27] = function() {
    tss += 2;
    var c = (z8.r[Regs_E] | z8.r[Regs_D] << 8) - 1 & 65535;
    z8.r[Regs_D] = c >> 8;
    z8.r[Regs_E] = c
};
z8oT[28] = function() {
    z8.r[Regs_E] += 1;
    z8.r[Regs_F] = z8.r[Regs_F] & 1 | bfi_table[z8.r[Regs_E]]
};
z8oT[29] = function() {
    --z8.r[Regs_E];
    z8.r[Regs_F] = z8.r[Regs_F] & 1 | bfd_table[z8.r[Regs_E]]
};
z8oT[30] = function() {
    tss += 3;
    z8.r[Regs_E] = wQj(z8.r2[Regs2_PC]++)
};
z8oT[31] = function() {
    var c = z8.r[Regs_A];
    z8.r[Regs_A] = z8.r[Regs_A] >> 1 | (z8.r[Regs_F] & 1) << 7;
    z8.r[Regs_F] = z8.r[Regs_F] & 196 | z8.r[Regs_A] & 40 | c & 1
};
z8oT[32] = function() {
    tss += 3;
    z8.r[Regs_F] & 64 || (tss += 5, z8.r2[Regs2_PC] += sXd(wQj(z8.r2[Regs2_PC])));
    z8.r2[Regs2_PC]++
};
z8oT[33] = function() {
    tss += 6;
    z8.r[Regs_L] = wQj(z8.r2[Regs2_PC]++);
    z8.r[Regs_H] = wQj(z8.r2[Regs2_PC]++)
};
z8oT[34] = function() {
    tss += 12;
    var c = wQj(z8.r2[Regs2_PC]++),
        c = c | wQj(z8.r2[Regs2_PC]++) << 8;
    wQi(c++, z8.r[Regs_L]);
    wQi(c & 65535, z8.r[Regs_H])
};
z8oT[35] = function() {
    tss += 2;
    var c = (z8.r[Regs_L] | z8.r[Regs_H] << 8) + 1 & 65535;
    z8.r[Regs_H] = c >> 8;
    z8.r[Regs_L] = c
};
z8oT[36] = function() {
    z8.r[Regs_H] += 1;
    z8.r[Regs_F] = z8.r[Regs_F] & 1 | bfi_table[z8.r[Regs_H]]
};
z8oT[37] = function() {
    --z8.r[Regs_H];
    z8.r[Regs_F] = z8.r[Regs_F] & 1 | bfd_table[z8.r[Regs_H]]
};
z8oT[38] = function() {
    tss += 3;
    z8.r[Regs_H] = wQj(z8.r2[Regs2_PC]++)
};
z8oT[39] = function() {
    var c = 0,
        d = z8.r[Regs_F] & 1;
    if (z8.r[Regs_F] & 16 || 9 < (z8.r[Regs_A] & 15)) c = 6;
    if (d || 153 < z8.r[Regs_A]) c |= 96;
    153 < z8.r[Regs_A] && (d = 1);
    if (z8.r[Regs_F] & 2) {
        var f = z8.r[Regs_A] - c,
            c = (z8.r[Regs_A] & 136) >> 3 | (c & 136) >> 2 | (f & 136) >> 1;
        z8.r[Regs_A] = f;
        z8.r[Regs_F] = (f & 256 ? 1 : 0) | 2 | hcst_[c & 7] | oSt[c >> 4] | zTe5[z8.r[Regs_A]]
    } else f = z8.r[Regs_A] + c, c = (z8.r[Regs_A] & 136) >> 3 | (c & 136) >> 2 | (f & 136) >> 1, z8.r[Regs_A] = f, z8.r[Regs_F] = (f & 256 ? 1 : 0) | hcat_[c & 7] | oAt[c >> 4] | zTe5[z8.r[Regs_A]];
    z8.r[Regs_F] = z8.r[Regs_F] & -6 | d | parity_table[z8.r[Regs_A]]
};
z8oT[40] = function() {
    tss += 3;
    z8.r[Regs_F] & 64 && (tss += 5, z8.r2[Regs2_PC] += sXd(wQj(z8.r2[Regs2_PC])));
    z8.r2[Regs2_PC]++
};
z8oT[41] = function() {
    var c = (z8.r[Regs_L] | z8.r[Regs_H] << 8) + (z8.r[Regs_L] | z8.r[Regs_H] << 8),
        d = ((z8.r[Regs_L] | z8.r[Regs_H] << 8) & 2048) >> 11 | ((z8.r[Regs_L] | z8.r[Regs_H] << 8) & 2048) >> 10 | (c & 2048) >> 9;
    tss += 7;
    z8.r[Regs_H] = c >> 8;
    z8.r[Regs_L] = c;
    z8.r[Regs_F] = z8.r[Regs_F] & 196 | (c & 65536 ? 1 : 0) | c >> 8 & 40 | hcat_[d]
};
z8oT[42] = function() {
    tss += 12;
    var c = wQj(z8.r2[Regs2_PC]++),
        c = c | wQj(z8.r2[Regs2_PC]++) << 8;
    z8.r[Regs_L] = wQj(c++);
    z8.r[Regs_H] = wQj(c & 65535)
};
z8oT[43] = function() {
    tss += 2;
    var c = (z8.r[Regs_L] | z8.r[Regs_H] << 8) - 1 & 65535;
    z8.r[Regs_H] = c >> 8;
    z8.r[Regs_L] = c
};
z8oT[44] = function() {
    z8.r[Regs_L] += 1;
    z8.r[Regs_F] = z8.r[Regs_F] & 1 | bfi_table[z8.r[Regs_L]]
};
z8oT[45] = function() {
    --z8.r[Regs_L];
    z8.r[Regs_F] = z8.r[Regs_F] & 1 | bfd_table[z8.r[Regs_L]]
};
z8oT[46] = function() {
    tss += 3;
    z8.r[Regs_L] = wQj(z8.r2[Regs2_PC]++)
};
z8oT[47] = function() {
    z8.r[Regs_A] ^= 255;
    z8.r[Regs_F] = z8.r[Regs_F] & 197 | z8.r[Regs_A] & 40 | 18
};
z8oT[48] = function() {
    tss += 3;
    z8.r[Regs_F] & 1 || (tss += 5, z8.r2[Regs2_PC] += sXd(wQj(z8.r2[Regs2_PC])));
    z8.r2[Regs2_PC]++
};
z8oT[49] = function() {
    tss += 6;
    var c = wQj(z8.r2[Regs2_PC]++),
        d = wQj(z8.r2[Regs2_PC]++);
    z8.r2[Regs2_SP] = c | d << 8
};
z8oT[50] = function() {
    tss += 9;
    var c = wQj(z8.r2[Regs2_PC]++),
        c = c | wQj(z8.r2[Regs2_PC]++) << 8;
    wQi(c, z8.r[Regs_A])
};
z8oT[51] = function() {
    tss += 2;
    z8.r2[Regs2_SP] += 1
};
z8oT[52] = function() {
    tss += 7;
    var c = wQj(z8.r[Regs_L] | z8.r[Regs_H] << 8),
        c = c + 1 & 255;
    z8.r[Regs_F] = z8.r[Regs_F] & 1 | bfi_table[c];
    wQi(z8.r[Regs_L] | z8.r[Regs_H] << 8, c)
};
z8oT[53] = function() {
    tss += 7;
    var c = wQj(z8.r[Regs_L] | z8.r[Regs_H] << 8),
        c = c - 1 & 255;
    z8.r[Regs_F] = z8.r[Regs_F] & 1 | bfd_table[c];
    wQi(z8.r[Regs_L] | z8.r[Regs_H] << 8, c)
};
z8oT[54] = function() {
    tss += 6;
    wQi(z8.r[Regs_L] | z8.r[Regs_H] << 8, wQj(z8.r2[Regs2_PC]++))
};
z8oT[55] = function() {
    z8.r[Regs_F] = z8.r[Regs_F] & 196 | z8.r[Regs_A] & 40 | 1
};
z8oT[56] = function() {
    tss += 3;
    z8.r[Regs_F] & 1 && (tss += 5, z8.r2[Regs2_PC] += sXd(wQj(z8.r2[Regs2_PC])));
    z8.r2[Regs2_PC]++
};
z8oT[57] = function() {
    var c = (z8.r[Regs_L] | z8.r[Regs_H] << 8) + z8.r2[Regs2_SP],
        d = ((z8.r[Regs_L] | z8.r[Regs_H] << 8) & 2048) >> 11 | (z8.r2[Regs2_SP] & 2048) >> 10 | (c & 2048) >> 9;
    tss += 7;
    z8.r[Regs_H] = c >> 8;
    z8.r[Regs_L] = c;
    z8.r[Regs_F] = z8.r[Regs_F] & 196 | (c & 65536 ? 1 : 0) | c >> 8 & 40 | hcat_[d]
};
z8oT[58] = function() {
    tss += 9;
    var c = wQj(z8.r2[Regs2_PC]++),
        c = c | wQj(z8.r2[Regs2_PC]++) << 8;
    z8.r[Regs_A] = wQj(c)
};
z8oT[59] = function() {
    tss += 2;
    --z8.r2[Regs2_SP]
};
z8oT[60] = function() {
    z8.r[Regs_A] += 1;
    z8.r[Regs_F] = z8.r[Regs_F] & 1 | bfi_table[z8.r[Regs_A]]
};
z8oT[61] = function() {
    --z8.r[Regs_A];
    z8.r[Regs_F] = z8.r[Regs_F] & 1 | bfd_table[z8.r[Regs_A]]
};
z8oT[62] = function() {
    tss += 3;
    z8.r[Regs_A] = wQj(z8.r2[Regs2_PC]++)
};
z8oT[63] = function() {
    z8.r[Regs_F] = z8.r[Regs_F] & 196 | (z8.r[Regs_F] & 1 ? 16 : 1) | z8.r[Regs_A] & 40
};
z8oT[65] = function() {
    z8.r[Regs_B] = z8.r[Regs_C]
};
z8oT[66] = function() {
    z8.r[Regs_B] = z8.r[Regs_D]
};
z8oT[67] = function() {
    z8.r[Regs_B] = z8.r[Regs_E]
};
z8oT[68] = function() {
    z8.r[Regs_B] = z8.r[Regs_H]
};
z8oT[69] = function() {
    z8.r[Regs_B] = z8.r[Regs_L]
};
z8oT[70] = function() {
    tss += 3;
    z8.r[Regs_B] = wQj(z8.r[Regs_L] | z8.r[Regs_H] << 8)
};
z8oT[71] = function() {
    z8.r[Regs_B] = z8.r[Regs_A]
};
z8oT[72] = function() {
    z8.r[Regs_C] = z8.r[Regs_B]
};
z8oT[74] = function() {
    z8.r[Regs_C] = z8.r[Regs_D]
};
z8oT[75] = function() {
    z8.r[Regs_C] = z8.r[Regs_E]
};
z8oT[76] = function() {
    z8.r[Regs_C] = z8.r[Regs_H]
};
z8oT[77] = function() {
    z8.r[Regs_C] = z8.r[Regs_L]
};
z8oT[78] = function() {
    tss += 3;
    z8.r[Regs_C] = wQj(z8.r[Regs_L] | z8.r[Regs_H] << 8)
};
z8oT[79] = function() {
    z8.r[Regs_C] = z8.r[Regs_A]
};
z8oT[80] = function() {
    z8.r[Regs_D] = z8.r[Regs_B]
};
z8oT[81] = function() {
    z8.r[Regs_D] = z8.r[Regs_C]
};
z8oT[83] = function() {
    z8.r[Regs_D] = z8.r[Regs_E]
};
z8oT[84] = function() {
    z8.r[Regs_D] = z8.r[Regs_H]
};
z8oT[85] = function() {
    z8.r[Regs_D] = z8.r[Regs_L]
};
z8oT[86] = function() {
    tss += 3;
    z8.r[Regs_D] = wQj(z8.r[Regs_L] | z8.r[Regs_H] << 8)
};
z8oT[87] = function() {
    z8.r[Regs_D] = z8.r[Regs_A]
};
z8oT[88] = function() {
    z8.r[Regs_E] = z8.r[Regs_B]
};
z8oT[89] = function() {
    z8.r[Regs_E] = z8.r[Regs_C]
};
z8oT[90] = function() {
    z8.r[Regs_E] = z8.r[Regs_D]
};
z8oT[92] = function() {
    z8.r[Regs_E] = z8.r[Regs_H]
};
z8oT[93] = function() {
    z8.r[Regs_E] = z8.r[Regs_L]
};
z8oT[94] = function() {
    tss += 3;
    z8.r[Regs_E] = wQj(z8.r[Regs_L] | z8.r[Regs_H] << 8)
};
z8oT[95] = function() {
    z8.r[Regs_E] = z8.r[Regs_A]
};
z8oT[96] = function() {
    z8.r[Regs_H] = z8.r[Regs_B]
};
z8oT[97] = function() {
    z8.r[Regs_H] = z8.r[Regs_C]
};
z8oT[98] = function() {
    z8.r[Regs_H] = z8.r[Regs_D]
};
z8oT[99] = function() {
    z8.r[Regs_H] = z8.r[Regs_E]
};
z8oT[101] = function() {
    z8.r[Regs_H] = z8.r[Regs_L]
};
z8oT[102] = function() {
    tss += 3;
    z8.r[Regs_H] = wQj(z8.r[Regs_L] | z8.r[Regs_H] << 8)
};
z8oT[103] = function() {
    z8.r[Regs_H] = z8.r[Regs_A]
};
z8oT[104] = function() {
    z8.r[Regs_L] = z8.r[Regs_B]
};
z8oT[105] = function() {
    z8.r[Regs_L] = z8.r[Regs_C]
};
z8oT[106] = function() {
    z8.r[Regs_L] = z8.r[Regs_D]
};
z8oT[107] = function() {
    z8.r[Regs_L] = z8.r[Regs_E]
};
z8oT[108] = function() {
    z8.r[Regs_L] = z8.r[Regs_H]
};
z8oT[110] = function() {
    tss += 3;
    z8.r[Regs_L] = wQj(z8.r[Regs_L] | z8.r[Regs_H] << 8)
};
z8oT[111] = function() {
    z8.r[Regs_L] = z8.r[Regs_A]
};
z8oT[112] = function() {
    tss += 3;
    wQi(z8.r[Regs_L] | z8.r[Regs_H] << 8, z8.r[Regs_B])
};
z8oT[113] = function() {
    tss += 3;
    wQi(z8.r[Regs_L] | z8.r[Regs_H] << 8, z8.r[Regs_C])
};
z8oT[114] = function() {
    tss += 3;
    wQi(z8.r[Regs_L] | z8.r[Regs_H] << 8, z8.r[Regs_D])
};
z8oT[115] = function() {
    tss += 3;
    wQi(z8.r[Regs_L] | z8.r[Regs_H] << 8, z8.r[Regs_E])
};
z8oT[116] = function() {
    tss += 3;
    wQi(z8.r[Regs_L] | z8.r[Regs_H] << 8, z8.r[Regs_H])
};
z8oT[117] = function() {
    tss += 3;
    wQi(z8.r[Regs_L] | z8.r[Regs_H] << 8, z8.r[Regs_L])
};
z8oT[118] = function() {
    z8.halted = 1;
    z8.r2[Regs2_PC]--
};
z8oT[119] = function() {
    tss += 3;
    wQi(z8.r[Regs_L] | z8.r[Regs_H] << 8, z8.r[Regs_A])
};
z8oT[120] = function() {
    z8.r[Regs_A] = z8.r[Regs_B]
};
z8oT[121] = function() {
    z8.r[Regs_A] = z8.r[Regs_C]
};
z8oT[122] = function() {
    z8.r[Regs_A] = z8.r[Regs_D]
};
z8oT[123] = function() {
    z8.r[Regs_A] = z8.r[Regs_E]
};
z8oT[124] = function() {
    z8.r[Regs_A] = z8.r[Regs_H]
};
z8oT[125] = function() {
    z8.r[Regs_A] = z8.r[Regs_L]
};
z8oT[126] = function() {
    tss += 3;
    z8.r[Regs_A] = wQj(z8.r[Regs_L] | z8.r[Regs_H] << 8)
};
z8oT[128] = function() {
    var c = z8.r[Regs_A] + z8.r[Regs_B],
        d = (z8.r[Regs_A] & 136) >> 3 | (z8.r[Regs_B] & 136) >> 2 | (c & 136) >> 1;
    z8.r[Regs_A] = c;
    z8.r[Regs_F] = (c & 256 ? 1 : 0) | hcat_[d & 7] | oAt[d >> 4] | zTe5[z8.r[Regs_A]]
};
z8oT[129] = function() {
    var c = z8.r[Regs_A] + z8.r[Regs_C],
        d = (z8.r[Regs_A] & 136) >> 3 | (z8.r[Regs_C] & 136) >> 2 | (c & 136) >> 1;
    z8.r[Regs_A] = c;
    z8.r[Regs_F] = (c & 256 ? 1 : 0) | hcat_[d & 7] | oAt[d >> 4] | zTe5[z8.r[Regs_A]]
};
z8oT[130] = function() {
    var c = z8.r[Regs_A] + z8.r[Regs_D],
        d = (z8.r[Regs_A] & 136) >> 3 | (z8.r[Regs_D] & 136) >> 2 | (c & 136) >> 1;
    z8.r[Regs_A] = c;
    z8.r[Regs_F] = (c & 256 ? 1 : 0) | hcat_[d & 7] | oAt[d >> 4] | zTe5[z8.r[Regs_A]]
};
z8oT[131] = function() {
    var c = z8.r[Regs_A] + z8.r[Regs_E],
        d = (z8.r[Regs_A] & 136) >> 3 | (z8.r[Regs_E] & 136) >> 2 | (c & 136) >> 1;
    z8.r[Regs_A] = c;
    z8.r[Regs_F] = (c & 256 ? 1 : 0) | hcat_[d & 7] | oAt[d >> 4] | zTe5[z8.r[Regs_A]]
};
z8oT[132] = function() {
    var c = z8.r[Regs_A] + z8.r[Regs_H],
        d = (z8.r[Regs_A] & 136) >> 3 | (z8.r[Regs_H] & 136) >> 2 | (c & 136) >> 1;
    z8.r[Regs_A] = c;
    z8.r[Regs_F] = (c & 256 ? 1 : 0) | hcat_[d & 7] | oAt[d >> 4] | zTe5[z8.r[Regs_A]]
};
z8oT[133] = function() {
    var c = z8.r[Regs_A] + z8.r[Regs_L],
        d = (z8.r[Regs_A] & 136) >> 3 | (z8.r[Regs_L] & 136) >> 2 | (c & 136) >> 1;
    z8.r[Regs_A] = c;
    z8.r[Regs_F] = (c & 256 ? 1 : 0) | hcat_[d & 7] | oAt[d >> 4] | zTe5[z8.r[Regs_A]]
};
z8oT[134] = function() {
    tss += 3;
    var c = wQj(z8.r[Regs_L] | z8.r[Regs_H] << 8),
        d = z8.r[Regs_A] + c,
        c = (z8.r[Regs_A] & 136) >> 3 | (c & 136) >> 2 | (d & 136) >> 1;
    z8.r[Regs_A] = d;
    z8.r[Regs_F] = (d & 256 ? 1 : 0) | hcat_[c & 7] | oAt[c >> 4] | zTe5[z8.r[Regs_A]]
};
z8oT[135] = function() {
    var c = z8.r[Regs_A] + z8.r[Regs_A],
        d = (z8.r[Regs_A] & 136) >> 3 | (z8.r[Regs_A] & 136) >> 2 | (c & 136) >> 1;
    z8.r[Regs_A] = c;
    z8.r[Regs_F] = (c & 256 ? 1 : 0) | hcat_[d & 7] | oAt[d >> 4] | zTe5[z8.r[Regs_A]]
};
z8oT[136] = function() {
    var c = z8.r[Regs_A] + z8.r[Regs_B] + (z8.r[Regs_F] & 1),
        d = (z8.r[Regs_A] & 136) >> 3 | (z8.r[Regs_B] & 136) >> 2 | (c & 136) >> 1;
    z8.r[Regs_A] = c;
    z8.r[Regs_F] = (c & 256 ? 1 : 0) | hcat_[d & 7] | oAt[d >> 4] | zTe5[z8.r[Regs_A]]
};
z8oT[137] = function() {
    var c = z8.r[Regs_A] + z8.r[Regs_C] + (z8.r[Regs_F] & 1),
        d = (z8.r[Regs_A] & 136) >> 3 | (z8.r[Regs_C] & 136) >> 2 | (c & 136) >> 1;
    z8.r[Regs_A] = c;
    z8.r[Regs_F] = (c & 256 ? 1 : 0) | hcat_[d & 7] | oAt[d >> 4] | zTe5[z8.r[Regs_A]]
};
z8oT[138] = function() {
    var c = z8.r[Regs_A] + z8.r[Regs_D] + (z8.r[Regs_F] & 1),
        d = (z8.r[Regs_A] & 136) >> 3 | (z8.r[Regs_D] & 136) >> 2 | (c & 136) >> 1;
    z8.r[Regs_A] = c;
    z8.r[Regs_F] = (c & 256 ? 1 : 0) | hcat_[d & 7] | oAt[d >> 4] | zTe5[z8.r[Regs_A]]
};
z8oT[139] = function() {
    var c = z8.r[Regs_A] + z8.r[Regs_E] + (z8.r[Regs_F] & 1),
        d = (z8.r[Regs_A] & 136) >> 3 | (z8.r[Regs_E] & 136) >> 2 | (c & 136) >> 1;
    z8.r[Regs_A] = c;
    z8.r[Regs_F] = (c & 256 ? 1 : 0) | hcat_[d & 7] | oAt[d >> 4] | zTe5[z8.r[Regs_A]]
};
z8oT[140] = function() {
    var c = z8.r[Regs_A] + z8.r[Regs_H] + (z8.r[Regs_F] & 1),
        d = (z8.r[Regs_A] & 136) >> 3 | (z8.r[Regs_H] & 136) >> 2 | (c & 136) >> 1;
    z8.r[Regs_A] = c;
    z8.r[Regs_F] = (c & 256 ? 1 : 0) | hcat_[d & 7] | oAt[d >> 4] | zTe5[z8.r[Regs_A]]
};
z8oT[141] = function() {
    var c = z8.r[Regs_A] + z8.r[Regs_L] + (z8.r[Regs_F] & 1),
        d = (z8.r[Regs_A] & 136) >> 3 | (z8.r[Regs_L] & 136) >> 2 | (c & 136) >> 1;
    z8.r[Regs_A] = c;
    z8.r[Regs_F] = (c & 256 ? 1 : 0) | hcat_[d & 7] | oAt[d >> 4] | zTe5[z8.r[Regs_A]]
};
z8oT[142] = function() {
    tss += 3;
    var c = wQj(z8.r[Regs_L] | z8.r[Regs_H] << 8),
        d = z8.r[Regs_A] + c + (z8.r[Regs_F] & 1),
        c = (z8.r[Regs_A] & 136) >> 3 | (c & 136) >> 2 | (d & 136) >> 1;
    z8.r[Regs_A] = d;
    z8.r[Regs_F] = (d & 256 ? 1 : 0) | hcat_[c & 7] | oAt[c >> 4] | zTe5[z8.r[Regs_A]]
};
z8oT[143] = function() {
    var c = z8.r[Regs_A] + z8.r[Regs_A] + (z8.r[Regs_F] & 1),
        d = (z8.r[Regs_A] & 136) >> 3 | (z8.r[Regs_A] & 136) >> 2 | (c & 136) >> 1;
    z8.r[Regs_A] = c;
    z8.r[Regs_F] = (c & 256 ? 1 : 0) | hcat_[d & 7] | oAt[d >> 4] | zTe5[z8.r[Regs_A]]
};
z8oT[144] = function() {
    var c = z8.r[Regs_A] - z8.r[Regs_B],
        d = (z8.r[Regs_A] & 136) >> 3 | (z8.r[Regs_B] & 136) >> 2 | (c & 136) >> 1;
    z8.r[Regs_A] = c;
    z8.r[Regs_F] = (c & 256 ? 1 : 0) | 2 | hcst_[d & 7] | oSt[d >> 4] | zTe5[z8.r[Regs_A]]
};
z8oT[145] = function() {
    var c = z8.r[Regs_A] - z8.r[Regs_C],
        d = (z8.r[Regs_A] & 136) >> 3 | (z8.r[Regs_C] & 136) >> 2 | (c & 136) >> 1;
    z8.r[Regs_A] = c;
    z8.r[Regs_F] = (c & 256 ? 1 : 0) | 2 | hcst_[d & 7] | oSt[d >> 4] | zTe5[z8.r[Regs_A]]
};
z8oT[146] = function() {
    var c = z8.r[Regs_A] - z8.r[Regs_D],
        d = (z8.r[Regs_A] & 136) >> 3 | (z8.r[Regs_D] & 136) >> 2 | (c & 136) >> 1;
    z8.r[Regs_A] = c;
    z8.r[Regs_F] = (c & 256 ? 1 : 0) | 2 | hcst_[d & 7] | oSt[d >> 4] | zTe5[z8.r[Regs_A]]
};
z8oT[147] = function() {
    var c = z8.r[Regs_A] - z8.r[Regs_E],
        d = (z8.r[Regs_A] & 136) >> 3 | (z8.r[Regs_E] & 136) >> 2 | (c & 136) >> 1;
    z8.r[Regs_A] = c;
    z8.r[Regs_F] = (c & 256 ? 1 : 0) | 2 | hcst_[d & 7] | oSt[d >> 4] | zTe5[z8.r[Regs_A]]
};
z8oT[148] = function() {
    var c = z8.r[Regs_A] - z8.r[Regs_H],
        d = (z8.r[Regs_A] & 136) >> 3 | (z8.r[Regs_H] & 136) >> 2 | (c & 136) >> 1;
    z8.r[Regs_A] = c;
    z8.r[Regs_F] = (c & 256 ? 1 : 0) | 2 | hcst_[d & 7] | oSt[d >> 4] | zTe5[z8.r[Regs_A]]
};
z8oT[149] = function() {
    var c = z8.r[Regs_A] - z8.r[Regs_L],
        d = (z8.r[Regs_A] & 136) >> 3 | (z8.r[Regs_L] & 136) >> 2 | (c & 136) >> 1;
    z8.r[Regs_A] = c;
    z8.r[Regs_F] = (c & 256 ? 1 : 0) | 2 | hcst_[d & 7] | oSt[d >> 4] | zTe5[z8.r[Regs_A]]
};
z8oT[150] = function() {
    tss += 3;
    var c = wQj(z8.r[Regs_L] | z8.r[Regs_H] << 8),
        d = z8.r[Regs_A] - c,
        c = (z8.r[Regs_A] & 136) >> 3 | (c & 136) >> 2 | (d & 136) >> 1;
    z8.r[Regs_A] = d;
    z8.r[Regs_F] = (d & 256 ? 1 : 0) | 2 | hcst_[c & 7] | oSt[c >> 4] | zTe5[z8.r[Regs_A]]
};
z8oT[151] = function() {
    var c = z8.r[Regs_A] - z8.r[Regs_A],
        d = (z8.r[Regs_A] & 136) >> 3 | (z8.r[Regs_A] & 136) >> 2 | (c & 136) >> 1;
    z8.r[Regs_A] = c;
    z8.r[Regs_F] = (c & 256 ? 1 : 0) | 2 | hcst_[d & 7] | oSt[d >> 4] | zTe5[z8.r[Regs_A]]
};
z8oT[152] = function() {
    var c = z8.r[Regs_A] - z8.r[Regs_B] - (z8.r[Regs_F] & 1),
        d = (z8.r[Regs_A] & 136) >> 3 | (z8.r[Regs_B] & 136) >> 2 | (c & 136) >> 1;
    z8.r[Regs_A] = c;
    z8.r[Regs_F] = (c & 256 ? 1 : 0) | 2 | hcst_[d & 7] | oSt[d >> 4] | zTe5[z8.r[Regs_A]]
};
z8oT[153] = function() {
    var c = z8.r[Regs_A] - z8.r[Regs_C] - (z8.r[Regs_F] & 1),
        d = (z8.r[Regs_A] & 136) >> 3 | (z8.r[Regs_C] & 136) >> 2 | (c & 136) >> 1;
    z8.r[Regs_A] = c;
    z8.r[Regs_F] = (c & 256 ? 1 : 0) | 2 | hcst_[d & 7] | oSt[d >> 4] | zTe5[z8.r[Regs_A]]
};
z8oT[154] = function() {
    var c = z8.r[Regs_A] - z8.r[Regs_D] - (z8.r[Regs_F] & 1),
        d = (z8.r[Regs_A] & 136) >> 3 | (z8.r[Regs_D] & 136) >> 2 | (c & 136) >> 1;
    z8.r[Regs_A] = c;
    z8.r[Regs_F] = (c & 256 ? 1 : 0) | 2 | hcst_[d & 7] | oSt[d >> 4] | zTe5[z8.r[Regs_A]]
};
z8oT[155] = function() {
    var c = z8.r[Regs_A] - z8.r[Regs_E] - (z8.r[Regs_F] & 1),
        d = (z8.r[Regs_A] & 136) >> 3 | (z8.r[Regs_E] & 136) >> 2 | (c & 136) >> 1;
    z8.r[Regs_A] = c;
    z8.r[Regs_F] = (c & 256 ? 1 : 0) | 2 | hcst_[d & 7] | oSt[d >> 4] | zTe5[z8.r[Regs_A]]
};
z8oT[156] = function() {
    var c = z8.r[Regs_A] - z8.r[Regs_H] - (z8.r[Regs_F] & 1),
        d = (z8.r[Regs_A] & 136) >> 3 | (z8.r[Regs_H] & 136) >> 2 | (c & 136) >> 1;
    z8.r[Regs_A] = c;
    z8.r[Regs_F] = (c & 256 ? 1 : 0) | 2 | hcst_[d & 7] | oSt[d >> 4] | zTe5[z8.r[Regs_A]]
};
z8oT[157] = function() {
    var c = z8.r[Regs_A] - z8.r[Regs_L] - (z8.r[Regs_F] & 1),
        d = (z8.r[Regs_A] & 136) >> 3 | (z8.r[Regs_L] & 136) >> 2 | (c & 136) >> 1;
    z8.r[Regs_A] = c;
    z8.r[Regs_F] = (c & 256 ? 1 : 0) | 2 | hcst_[d & 7] | oSt[d >> 4] | zTe5[z8.r[Regs_A]]
};
z8oT[158] = function() {
    tss += 3;
    var c = wQj(z8.r[Regs_L] | z8.r[Regs_H] << 8),
        d = z8.r[Regs_A] - c - (z8.r[Regs_F] & 1),
        c = (z8.r[Regs_A] & 136) >> 3 | (c & 136) >> 2 | (d & 136) >> 1;
    z8.r[Regs_A] = d;
    z8.r[Regs_F] = (d & 256 ? 1 : 0) | 2 | hcst_[c & 7] | oSt[c >> 4] | zTe5[z8.r[Regs_A]]
};
z8oT[159] = function() {
    var c = z8.r[Regs_A] - z8.r[Regs_A] - (z8.r[Regs_F] & 1),
        d = (z8.r[Regs_A] & 136) >> 3 | (z8.r[Regs_A] & 136) >> 2 | (c & 136) >> 1;
    z8.r[Regs_A] = c;
    z8.r[Regs_F] = (c & 256 ? 1 : 0) | 2 | hcst_[d & 7] | oSt[d >> 4] | zTe5[z8.r[Regs_A]]
};
z8oT[160] = function() {
    z8.r[Regs_A] &= z8.r[Regs_B];
    z8.r[Regs_F] = 16 | zTe6[z8.r[Regs_A]]
};
z8oT[161] = function() {
    z8.r[Regs_A] &= z8.r[Regs_C];
    z8.r[Regs_F] = 16 | zTe6[z8.r[Regs_A]]
};
z8oT[162] = function() {
    z8.r[Regs_A] &= z8.r[Regs_D];
    z8.r[Regs_F] = 16 | zTe6[z8.r[Regs_A]]
};
z8oT[163] = function() {
    z8.r[Regs_A] &= z8.r[Regs_E];
    z8.r[Regs_F] = 16 | zTe6[z8.r[Regs_A]]
};
z8oT[164] = function() {
    z8.r[Regs_A] &= z8.r[Regs_H];
    z8.r[Regs_F] = 16 | zTe6[z8.r[Regs_A]]
};
z8oT[165] = function() {
    z8.r[Regs_A] &= z8.r[Regs_L];
    z8.r[Regs_F] = 16 | zTe6[z8.r[Regs_A]]
};
z8oT[166] = function() {
    tss += 3;
    var c = wQj(z8.r[Regs_L] | z8.r[Regs_H] << 8);
    z8.r[Regs_A] &= c;
    z8.r[Regs_F] = 16 | zTe6[z8.r[Regs_A]]
};
z8oT[167] = function() {
    z8.r[Regs_A] &= z8.r[Regs_A];
    z8.r[Regs_F] = 16 | zTe6[z8.r[Regs_A]]
};
z8oT[168] = function() {
    z8.r[Regs_A] ^= z8.r[Regs_B];
    z8.r[Regs_F] = zTe6[z8.r[Regs_A]]
};
z8oT[169] = function() {
    z8.r[Regs_A] ^= z8.r[Regs_C];
    z8.r[Regs_F] = zTe6[z8.r[Regs_A]]
};
z8oT[170] = function() {
    z8.r[Regs_A] ^= z8.r[Regs_D];
    z8.r[Regs_F] = zTe6[z8.r[Regs_A]]
};
z8oT[171] = function() {
    z8.r[Regs_A] ^= z8.r[Regs_E];
    z8.r[Regs_F] = zTe6[z8.r[Regs_A]]
};
z8oT[172] = function() {
    z8.r[Regs_A] ^= z8.r[Regs_H];
    z8.r[Regs_F] = zTe6[z8.r[Regs_A]]
};
z8oT[173] = function() {
    z8.r[Regs_A] ^= z8.r[Regs_L];
    z8.r[Regs_F] = zTe6[z8.r[Regs_A]]
};
z8oT[174] = function() {
    tss += 3;
    var c = wQj(z8.r[Regs_L] | z8.r[Regs_H] << 8);
    z8.r[Regs_A] ^= c;
    z8.r[Regs_F] = zTe6[z8.r[Regs_A]]
};
z8oT[175] = function() {
    z8.r[Regs_A] ^= z8.r[Regs_A];
    z8.r[Regs_F] = zTe6[z8.r[Regs_A]]
};
z8oT[176] = function() {
    z8.r[Regs_A] |= z8.r[Regs_B];
    z8.r[Regs_F] = zTe6[z8.r[Regs_A]]
};
z8oT[177] = function() {
    z8.r[Regs_A] |= z8.r[Regs_C];
    z8.r[Regs_F] = zTe6[z8.r[Regs_A]]
};
z8oT[178] = function() {
    z8.r[Regs_A] |= z8.r[Regs_D];
    z8.r[Regs_F] = zTe6[z8.r[Regs_A]]
};
z8oT[179] = function() {
    z8.r[Regs_A] |= z8.r[Regs_E];
    z8.r[Regs_F] = zTe6[z8.r[Regs_A]]
};
z8oT[180] = function() {
    z8.r[Regs_A] |= z8.r[Regs_H];
    z8.r[Regs_F] = zTe6[z8.r[Regs_A]]
};
z8oT[181] = function() {
    z8.r[Regs_A] |= z8.r[Regs_L];
    z8.r[Regs_F] = zTe6[z8.r[Regs_A]]
};
z8oT[182] = function() {
    tss += 3;
    var c = wQj(z8.r[Regs_L] | z8.r[Regs_H] << 8);
    z8.r[Regs_A] |= c;
    z8.r[Regs_F] = zTe6[z8.r[Regs_A]]
};
z8oT[183] = function() {
    z8.r[Regs_A] |= z8.r[Regs_A];
    z8.r[Regs_F] = zTe6[z8.r[Regs_A]]
};
z8oT[184] = function() {
    var c = z8.r[Regs_A] - z8.r[Regs_B],
        d = (z8.r[Regs_A] & 136) >> 3 | (z8.r[Regs_B] & 136) >> 2 | (c & 136) >> 1;
    z8.r[Regs_F] = (c & 256 ? 1 : c ? 0 : 64) | 2 | hcst_[d & 7] | oSt[d >> 4] | z8.r[Regs_B] & 40 | c & 128
};
z8oT[185] = function() {
    var c = z8.r[Regs_A] - z8.r[Regs_C],
        d = (z8.r[Regs_A] & 136) >> 3 | (z8.r[Regs_C] & 136) >> 2 | (c & 136) >> 1;
    z8.r[Regs_F] = (c & 256 ? 1 : c ? 0 : 64) | 2 | hcst_[d & 7] | oSt[d >> 4] | z8.r[Regs_C] & 40 | c & 128
};
z8oT[186] = function() {
    var c = z8.r[Regs_A] - z8.r[Regs_D],
        d = (z8.r[Regs_A] & 136) >> 3 | (z8.r[Regs_D] & 136) >> 2 | (c & 136) >> 1;
    z8.r[Regs_F] = (c & 256 ? 1 : c ? 0 : 64) | 2 | hcst_[d & 7] | oSt[d >> 4] | z8.r[Regs_D] & 40 | c & 128
};
z8oT[187] = function() {
    var c = z8.r[Regs_A] - z8.r[Regs_E],
        d = (z8.r[Regs_A] & 136) >> 3 | (z8.r[Regs_E] & 136) >> 2 | (c & 136) >> 1;
    z8.r[Regs_F] = (c & 256 ? 1 : c ? 0 : 64) | 2 | hcst_[d & 7] | oSt[d >> 4] | z8.r[Regs_E] & 40 | c & 128
};
z8oT[188] = function() {
    var c = z8.r[Regs_A] - z8.r[Regs_H],
        d = (z8.r[Regs_A] & 136) >> 3 | (z8.r[Regs_H] & 136) >> 2 | (c & 136) >> 1;
    z8.r[Regs_F] = (c & 256 ? 1 : c ? 0 : 64) | 2 | hcst_[d & 7] | oSt[d >> 4] | z8.r[Regs_H] & 40 | c & 128
};
z8oT[189] = function() {
    var c = z8.r[Regs_A] - z8.r[Regs_L],
        d = (z8.r[Regs_A] & 136) >> 3 | (z8.r[Regs_L] & 136) >> 2 | (c & 136) >> 1;
    z8.r[Regs_F] = (c & 256 ? 1 : c ? 0 : 64) | 2 | hcst_[d & 7] | oSt[d >> 4] | z8.r[Regs_L] & 40 | c & 128
};
z8oT[190] = function() {
    tss += 3;
    var c = wQj(z8.r[Regs_L] | z8.r[Regs_H] << 8),
        d = z8.r[Regs_A] - c,
        f = (z8.r[Regs_A] & 136) >> 3 | (c & 136) >> 2 | (d & 136) >> 1;
    z8.r[Regs_F] = (d & 256 ? 1 : d ? 0 : 64) | 2 | hcst_[f & 7] | oSt[f >> 4] | c & 40 | d & 128
};
z8oT[191] = function() {
    var c = z8.r[Regs_A] - z8.r[Regs_A],
        d = (z8.r[Regs_A] & 136) >> 3 | (z8.r[Regs_A] & 136) >> 2 | (c & 136) >> 1;
    z8.r[Regs_F] = (c & 256 ? 1 : c ? 0 : 64) | 2 | hcst_[d & 7] | oSt[d >> 4] | z8.r[Regs_A] & 40 | c & 128
};
z8oT[192] = function() {
    tss++;
    z8.r[Regs_F] & 64 || (tss += 3, b = wQj(z8.r2[Regs2_SP]++), tss += 3, a = wQj(z8.r2[Regs2_SP]++), z8.r2[Regs2_PC] = b | a << 8)
};
z8oT[193] = function() {
    tss += 6;
    z8.r[Regs_C] = wQj(z8.r2[Regs2_SP]++);
    z8.r[Regs_B] = wQj(z8.r2[Regs2_SP]++)
};
z8oT[194] = function() {
    tss += 6;
    z8.r[Regs_F] & 64 ? z8.r2[Regs2_PC] += 2 : (a = z8.r2[Regs2_PC], b = wQj(a++), a = wQj(a & 65535), z8.r2[Regs2_PC] = b | a << 8)
};
z8oT[195] = function() {
    tss += 6;
    var c = z8.r2[Regs2_PC],
        d = wQj(c++),
        c = wQj(c & 65535);
    z8.r2[Regs2_PC] = d | c << 8
};
z8oT[196] = function() {
    tss += 6;
    z8.r[Regs_F] & 64 ? z8.r2[Regs2_PC] += 2 : (b = wQj(z8.r2[Regs2_PC]++), tss += 1, a = wQj(z8.r2[Regs2_PC]++), z8.r2[Regs2_SP]--, tss += 3, wQi(z8.r2[Regs2_SP], z8.r2[Regs2_PC] >> 8), z8.r2[Regs2_SP]--, tss += 3, wQi(z8.r2[Regs2_SP], z8.r2[Regs2_PC] & 255), z8.r2[Regs2_PC] = b | a << 8)
};
z8oT[197] = function() {
    tss += 7;
    z8.r2[Regs2_SP]--;
    wQi(z8.r2[Regs2_SP], z8.r[Regs_B]);
    z8.r2[Regs2_SP]--;
    wQi(z8.r2[Regs2_SP], z8.r[Regs_C])
};
z8oT[198] = function() {
    tss += 3;
    var c = wQj(z8.r2[Regs2_PC]++),
        d = z8.r[Regs_A] + c,
        c = (z8.r[Regs_A] & 136) >> 3 | (c & 136) >> 2 | (d & 136) >> 1;
    z8.r[Regs_A] = d;
    z8.r[Regs_F] = (d & 256 ? 1 : 0) | hcat_[c & 7] | oAt[c >> 4] | zTe5[z8.r[Regs_A]]
};
z8oT[199] = function() {
    tss += 7;
    z8.r2[Regs2_SP]--;
    wQi(z8.r2[Regs2_SP], z8.r2[Regs2_PC] >> 8);
    z8.r2[Regs2_SP]--;
    wQi(z8.r2[Regs2_SP], z8.r2[Regs2_PC] & 255);
    z8.r2[Regs2_PC] = 0
};
z8oT[200] = function() {
    tss++;
    z8.r[Regs_F] & 64 && (tss += 3, b = wQj(z8.r2[Regs2_SP]++), tss += 3, a = wQj(z8.r2[Regs2_SP]++), z8.r2[Regs2_PC] = b | a << 8)
};
z8oT[201] = function() {
    tss += 6;
    var c = wQj(z8.r2[Regs2_SP]++),
        d = wQj(z8.r2[Regs2_SP]++);
    z8.r2[Regs2_PC] = c | d << 8
};
z8oT[202] = function() {
    tss += 6;
    z8.r[Regs_F] & 64 ? (a = z8.r2[Regs2_PC], b = wQj(a++), a = wQj(a & 65535), z8.r2[Regs2_PC] = b | a << 8) : z8.r2[Regs2_PC] += 2
};
z8oT[203] = function() {
    tss += 4;
    var c = wQj(z8.r2[Regs2_PC]++);
    z8.r[Regs_R] = z8.r[Regs_R] + 1 & 127;
    (c = z8oT_c203[c]) || (c = z8oT_c203[z8oT_c203.length - 1]);
    c()
};
z8oT[204] = function() {
    tss += 6;
    z8.r[Regs_F] & 64 ? (b = wQj(z8.r2[Regs2_PC]++), tss += 1, a = wQj(z8.r2[Regs2_PC]++), z8.r2[Regs2_SP]--, tss += 3, wQi(z8.r2[Regs2_SP], z8.r2[Regs2_PC] >> 8), z8.r2[Regs2_SP]--, tss += 3, wQi(z8.r2[Regs2_SP], z8.r2[Regs2_PC] & 255), z8.r2[Regs2_PC] = b | a << 8) : z8.r2[Regs2_PC] += 2
};
z8oT[205] = function() {
    tss += 13;
    var c = wQj(z8.r2[Regs2_PC]++),
        d = wQj(z8.r2[Regs2_PC]++);
    z8.r2[Regs2_SP]--;
    wQi(z8.r2[Regs2_SP], z8.r2[Regs2_PC] >> 8);
    z8.r2[Regs2_SP]--;
    wQi(z8.r2[Regs2_SP], z8.r2[Regs2_PC] & 255);
    z8.r2[Regs2_PC] = c | d << 8
};
z8oT[206] = function() {
    tss += 3;
    var c = wQj(z8.r2[Regs2_PC]++),
        d = z8.r[Regs_A] + c + (z8.r[Regs_F] & 1),
        c = (z8.r[Regs_A] & 136) >> 3 | (c & 136) >> 2 | (d & 136) >> 1;
    z8.r[Regs_A] = d;
    z8.r[Regs_F] = (d & 256 ? 1 : 0) | hcat_[c & 7] | oAt[c >> 4] | zTe5[z8.r[Regs_A]]
};
z8oT[207] = function() {
    tss += 7;
    z8.r2[Regs2_SP]--;
    wQi(z8.r2[Regs2_SP], z8.r2[Regs2_PC] >> 8);
    z8.r2[Regs2_SP]--;
    wQi(z8.r2[Regs2_SP], z8.r2[Regs2_PC] & 255);
    z8.r2[Regs2_PC] = 8
};
z8oT[208] = function() {
    tss++;
    z8.r[Regs_F] & 1 || (tss += 3, b = wQj(z8.r2[Regs2_SP]++), tss += 3, a = wQj(z8.r2[Regs2_SP]++), z8.r2[Regs2_PC] = b | a << 8)
};
z8oT[209] = function() {
    tss += 6;
    z8.r[Regs_E] = wQj(z8.r2[Regs2_SP]++);
    z8.r[Regs_D] = wQj(z8.r2[Regs2_SP]++)
};
z8oT[210] = function() {
    tss += 6;
    z8.r[Regs_F] & 1 ? z8.r2[Regs2_PC] += 2 : (a = z8.r2[Regs2_PC], b = wQj(a++), a = wQj(a & 65535), z8.r2[Regs2_PC] = b | a << 8)
};
z8oT[211] = function() {
    tss += 7;
    var c = wQj(z8.r2[Regs2_PC]++) + (z8.r[Regs_A] << 8);
    ti_common_out(c, z8.r[Regs_A])
};
z8oT[212] = function() {
    tss += 6;
    z8.r[Regs_F] & 1 ? z8.r2[Regs2_PC] += 2 : (b = wQj(z8.r2[Regs2_PC]++), tss += 1, a = wQj(z8.r2[Regs2_PC]++), z8.r2[Regs2_SP]--, tss += 3, wQi(z8.r2[Regs2_SP], z8.r2[Regs2_PC] >> 8), z8.r2[Regs2_SP]--, tss += 3, wQi(z8.r2[Regs2_SP], z8.r2[Regs2_PC] & 255), z8.r2[Regs2_PC] = b | a << 8)
};
z8oT[213] = function() {
    tss += 7;
    z8.r2[Regs2_SP]--;
    wQi(z8.r2[Regs2_SP], z8.r[Regs_D]);
    z8.r2[Regs2_SP]--;
    wQi(z8.r2[Regs2_SP], z8.r[Regs_E])
};
z8oT[214] = function() {
    tss += 3;
    var c = wQj(z8.r2[Regs2_PC]++),
        d = z8.r[Regs_A] - c,
        c = (z8.r[Regs_A] & 136) >> 3 | (c & 136) >> 2 | (d & 136) >> 1;
    z8.r[Regs_A] = d;
    z8.r[Regs_F] = (d & 256 ? 1 : 0) | 2 | hcst_[c & 7] | oSt[c >> 4] | zTe5[z8.r[Regs_A]]
};
z8oT[215] = function() {
    tss += 7;
    z8.r2[Regs2_SP]--;
    wQi(z8.r2[Regs2_SP], z8.r2[Regs2_PC] >> 8);
    z8.r2[Regs2_SP]--;
    wQi(z8.r2[Regs2_SP], z8.r2[Regs2_PC] & 255);
    z8.r2[Regs2_PC] = 16
};
z8oT[216] = function() {
    tss++;
    z8.r[Regs_F] & 1 && (tss += 6, b = wQj(z8.r2[Regs2_SP]++), a = wQj(z8.r2[Regs2_SP]++), z8.r2[Regs2_PC] = b | a << 8)
};
z8oT[217] = function() {
    var c = z8.r[Regs_B];
    z8.r[Regs_B] = z8.r[Regs_B_];
    z8.r[Regs_B_] = c;
    c = z8.r[Regs_C];
    z8.r[Regs_C] = z8.r[Regs_C_];
    z8.r[Regs_C_] = c;
    c = z8.r[Regs_D];
    z8.r[Regs_D] = z8.r[Regs_D_];
    z8.r[Regs_D_] = c;
    c = z8.r[Regs_E];
    z8.r[Regs_E] = z8.r[Regs_E_];
    z8.r[Regs_E_] = c;
    c = z8.r[Regs_H];
    z8.r[Regs_H] = z8.r[Regs_H_];
    z8.r[Regs_H_] = c;
    c = z8.r[Regs_L];
    z8.r[Regs_L] = z8.r[Regs_L_];
    z8.r[Regs_L_] = c
};
z8oT[218] = function() {
    tss += 6;
    z8.r[Regs_F] & 1 ? (a = z8.r2[Regs2_PC], b = wQj(a++), a = wQj(a & 65535), z8.r2[Regs2_PC] = b | a << 8) : z8.r2[Regs2_PC] += 2
};
z8oT[219] = function() {
    tss += 7;
    var c = wQj(z8.r2[Regs2_PC]++) + (z8.r[Regs_A] << 8);
    z8.r[Regs_A] = ti_common_in(c)
};
z8oT[220] = function() {
    tss += 6;
    z8.r[Regs_F] & 1 ? (b = wQj(z8.r2[Regs2_PC]++), tss += 1, a = wQj(z8.r2[Regs2_PC]++), z8.r2[Regs2_SP]--, tss += 3, wQi(z8.r2[Regs2_SP], z8.r2[Regs2_PC] >> 8), z8.r2[Regs2_SP]--, tss += 3, wQi(z8.r2[Regs2_SP], z8.r2[Regs2_PC] & 255), z8.r2[Regs2_PC] = b | a << 8) : z8.r2[Regs2_PC] += 2
};
z8oT[221] = function() {
    tss += 4;
    var c = wQj(z8.r2[Regs2_PC]++);
    z8.r[Regs_R] = z8.r[Regs_R] + 1 & 127;
    (c = z8oT_c221[c]) || (c = z8oT_c221[z8oT_c221.length - 1]);
    c()
};
z8oT[222] = function() {
    tss += 3;
    var c = wQj(z8.r2[Regs2_PC]++),
        d = z8.r[Regs_A] - c - (z8.r[Regs_F] & 1),
        c = (z8.r[Regs_A] & 136) >> 3 | (c & 136) >> 2 | (d & 136) >> 1;
    z8.r[Regs_A] = d;
    z8.r[Regs_F] = (d & 256 ? 1 : 0) | 2 | hcst_[c & 7] | oSt[c >> 4] | zTe5[z8.r[Regs_A]]
};
z8oT[223] = function() {
    tss += 7;
    z8.r2[Regs2_SP]--;
    wQi(z8.r2[Regs2_SP], z8.r2[Regs2_PC] >> 8);
    z8.r2[Regs2_SP]--;
    wQi(z8.r2[Regs2_SP], z8.r2[Regs2_PC] & 255);
    z8.r2[Regs2_PC] = 24
};
z8oT[224] = function() {
    tss++;
    z8.r[Regs_F] & 4 || (tss += 3, b = wQj(z8.r2[Regs2_SP]++), tss += 3, a = wQj(z8.r2[Regs2_SP]++), z8.r2[Regs2_PC] = b | a << 8)
};
z8oT[225] = function() {
    tss += 6;
    z8.r[Regs_L] = wQj(z8.r2[Regs2_SP]++);
    z8.r[Regs_H] = wQj(z8.r2[Regs2_SP]++)
};
z8oT[226] = function() {
    tss += 6;
    z8.r[Regs_F] & 4 ? z8.r2[Regs2_PC] += 2 : (a = z8.r2[Regs2_PC], b = wQj(a++), a = wQj(a & 65535), z8.r2[Regs2_PC] = b | a << 8)
};
z8oT[227] = function() {
    var c = wQj(z8.r2[Regs2_SP]),
        d = wQj(z8.r2[Regs2_SP] + 1);
    tss += 15;
    wQi(z8.r2[Regs2_SP] + 1, z8.r[Regs_H]);
    wQi(z8.r2[Regs2_SP], z8.r[Regs_L]);
    z8.r[Regs_L] = c;
    z8.r[Regs_H] = d
};
z8oT[228] = function() {
    tss += 6;
    z8.r[Regs_F] & 4 ? z8.r2[Regs2_PC] += 2 : (b = wQj(z8.r2[Regs2_PC]++), tss += 1, a = wQj(z8.r2[Regs2_PC]++), z8.r2[Regs2_SP]--, tss += 3, wQi(z8.r2[Regs2_SP], z8.r2[Regs2_PC] >> 8), z8.r2[Regs2_SP]--, tss += 3, wQi(z8.r2[Regs2_SP], z8.r2[Regs2_PC] & 255), z8.r2[Regs2_PC] = b | a << 8)
};
z8oT[229] = function() {
    tss++;
    z8.r2[Regs2_SP]--;
    tss += 3;
    wQi(z8.r2[Regs2_SP], z8.r[Regs_H]);
    z8.r2[Regs2_SP]--;
    tss += 3;
    wQi(z8.r2[Regs2_SP], z8.r[Regs_L])
};
z8oT[230] = function() {
    tss += 3;
    var c = wQj(z8.r2[Regs2_PC]++);
    z8.r[Regs_A] &= c;
    z8.r[Regs_F] = 16 | zTe6[z8.r[Regs_A]]
};
z8oT[231] = function() {
    tss++;
    z8.r2[Regs2_SP]--;
    tss += 6;
    wQi(z8.r2[Regs2_SP], z8.r2[Regs2_PC] >> 8);
    z8.r2[Regs2_SP]--;
    wQi(z8.r2[Regs2_SP], z8.r2[Regs2_PC] & 255);
    z8.r2[Regs2_PC] = 32
};
z8oT[232] = function() {
    tss++;
    z8.r[Regs_F] & 4 && (tss += 3, b = wQj(z8.r2[Regs2_SP]++), tss += 3, a = wQj(z8.r2[Regs2_SP]++), z8.r2[Regs2_PC] = b | a << 8)
};
z8oT[233] = function() {
    z8.r2[Regs2_PC] = z8.r[Regs_L] | z8.r[Regs_H] << 8
};
z8oT[234] = function() {
    tss += 6;
    z8.r[Regs_F] & 4 ? (a = z8.r2[Regs2_PC], b = wQj(a++), a = wQj(a & 65535), z8.r2[Regs2_PC] = b | a << 8) : z8.r2[Regs2_PC] += 2
};
z8oT[235] = function() {
    var c = z8.r[Regs_D];
    z8.r[Regs_D] = z8.r[Regs_H];
    z8.r[Regs_H] = c;
    c = z8.r[Regs_E];
    z8.r[Regs_E] = z8.r[Regs_L];
    z8.r[Regs_L] = c
};
z8oT[236] = function() {
    tss += 6;
    z8.r[Regs_F] & 4 ? (b = wQj(z8.r2[Regs2_PC]++), tss += 1, a = wQj(z8.r2[Regs2_PC]++), z8.r2[Regs2_SP]--, tss += 3, wQi(z8.r2[Regs2_SP], z8.r2[Regs2_PC] >> 8), z8.r2[Regs2_SP]--, z8.r2[Regs2_SP] &= 65535, tss += 3, wQi(z8.r2[Regs2_SP], z8.r2[Regs2_PC] & 255), z8.r2[Regs2_PC] = b | a << 8) : z8.r2[Regs2_PC] += 2
};
z8oT[237] = function() {
    tss += 4;
    var c = wQj(z8.r2[Regs2_PC]++);
    z8.r[Regs_R] = z8.r[Regs_R] + 1 & 127;
    (c = z8oT_c237[c]) || (c = z8oT_c237[z8oT_c237.length - 1]);
    c()
};
z8oT[238] = function() {
    tss += 3;
    var c = wQj(z8.r2[Regs2_PC]++);
    z8.r[Regs_A] ^= c;
    z8.r[Regs_F] = zTe6[z8.r[Regs_A]]
};
z8oT[239] = function() {
    tss += 7;
    z8.r2[Regs2_SP]--;
    wQi(z8.r2[Regs2_SP], z8.r2[Regs2_PC] >> 8);
    z8.r2[Regs2_SP]--;
    wQi(z8.r2[Regs2_SP], z8.r2[Regs2_PC] & 255);
    z8.r2[Regs2_PC] = 40
};
z8oT[240] = function() {
    tss++;
    z8.r[Regs_F] & 128 || (tss += 3, b = wQj(z8.r2[Regs2_SP]++), tss += 3, a = wQj(z8.r2[Regs2_SP]++), z8.r2[Regs2_PC] = b | a << 8)
};
z8oT[241] = function() {
    tss += 6;
    z8.r[Regs_F] = wQj(z8.r2[Regs2_SP]++);
    z8.r[Regs_A] = wQj(z8.r2[Regs2_SP]++)
};
z8oT[242] = function() {
    tss += 6;
    z8.r[Regs_F] & 128 ? z8.r2[Regs2_PC] += 2 : (a = z8.r2[Regs2_PC], b = wQj(a++), a = wQj(a & 65535), z8.r2[Regs2_PC] = b | a << 8)
};
z8oT[243] = function() {
    z8.iff1 = z8.iff2 = 0
};
z8oT[244] = function() {
    tss += 6;
    z8.r[Regs_F] & 128 ? z8.r2[Regs2_PC] += 2 : (b = wQj(z8.r2[Regs2_PC]++), tss += 1, a = wQj(z8.r2[Regs2_PC]++), z8.r2[Regs2_SP]--, tss += 3, wQi(z8.r2[Regs2_SP], z8.r2[Regs2_PC] >> 8), z8.r2[Regs2_SP]--, tss += 3, wQi(z8.r2[Regs2_SP], z8.r2[Regs2_PC] & 255), z8.r2[Regs2_PC] = b | a << 8)
};
z8oT[245] = function() {
    tss += 7;
    z8.r2[Regs2_SP]--;
    wQi(z8.r2[Regs2_SP], z8.r[Regs_A]);
    z8.r2[Regs2_SP]--;
    wQi(z8.r2[Regs2_SP], z8.r[Regs_F])
};
z8oT[246] = function() {
    tss += 3;
    var c = wQj(z8.r2[Regs2_PC]++);
    z8.r[Regs_A] |= c;
    z8.r[Regs_F] = zTe6[z8.r[Regs_A]]
};
z8oT[247] = function() {
    tss += 7;
    z8.r2[Regs2_SP]--;
    wQi(z8.r2[Regs2_SP], z8.r2[Regs2_PC] >> 8);
    z8.r2[Regs2_SP]--;
    wQi(z8.r2[Regs2_SP], z8.r2[Regs2_PC] & 255);
    z8.r2[Regs2_PC] = 48
};
z8oT[248] = function() {
    tss++;
    z8.r[Regs_F] & 128 && (tss += 3, b = wQj(z8.r2[Regs2_SP]++), tss += 3, a = wQj(z8.r2[Regs2_SP]++), z8.r2[Regs2_PC] = b | a << 8)
};
z8oT[249] = function() {
    tss += 2;
    z8.r2[Regs2_SP] = z8.r[Regs_L] | z8.r[Regs_H] << 8
};
z8oT[250] = function() {
    tss += 6;
    z8.r[Regs_F] & 128 ? (a = z8.r2[Regs2_PC], b = wQj(a++), a = wQj(a & 65535), z8.r2[Regs2_PC] = b | a << 8) : z8.r2[Regs2_PC] += 2
};
z8oT[251] = function() {
    z8.iff1 = z8.iff2 = 1;
    z8.ie = 2
};
z8oT[252] = function() {
    tss += 6;
    z8.r[Regs_F] & 128 ? (b = wQj(z8.r2[Regs2_PC]++), tss += 1, a = wQj(z8.r2[Regs2_PC]++), z8.r2[Regs2_SP]--, tss += 3, wQi(z8.r2[Regs2_SP], z8.r2[Regs2_PC] >> 8), z8.r2[Regs2_SP]--, tss += 3, wQi(z8.r2[Regs2_SP], z8.r2[Regs2_PC] & 255), z8.r2[Regs2_PC] = b | a << 8) : z8.r2[Regs2_PC] += 2
};
z8oT[253] = function() {
    tss += 4;
    var c = wQj(z8.r2[Regs2_PC]++);
    z8.r[Regs_R] = z8.r[Regs_R] + 1 & 127;
    (c = z8oT_c253[c]) || (c = z8oT_c253[z8oT_c253.length - 1]);
    c()
};
z8oT[254] = function() {
    tss += 3;
    var c = wQj(z8.r2[Regs2_PC]++),
        d = z8.r[Regs_A] - c,
        f = (z8.r[Regs_A] & 136) >> 3 | (c & 136) >> 2 | (d & 136) >> 1;
    z8.r[Regs_F] = (d & 256 ? 1 : d ? 0 : 64) | 2 | hcst_[f & 7] | oSt[f >> 4] | c & 40 | d & 128
};
z8oT[255] = function() {
    tss++;
    z8.r2[Regs2_SP]--;
    tss += 3;
    wQi(z8.r2[Regs2_SP], z8.r2[Regs2_PC] >> 8);
    z8.r2[Regs2_SP]--;
    tss += 3;
    wQi(z8.r2[Regs2_SP], z8.r2[Regs2_PC] & 255);
    z8.r2[Regs2_PC] = 56
};
z8oT[256] = z8oT[255];
var LINKDELAY = 6E6;

function Link() {
    this.packetstart = -1;
    this.curfull_file = "";
    this.curfull_offset = 0;
    this.data_dat = "";
    this.data_len = 0;
    this.gcn_send_frame = function(c) {};
    this.gcn_recv_frame = function(c) {};
    this.send_byte = function(c, d) {
        var f = 0;
        d || (d = LINKDELAY);
        if (i6.type != CTyE.CTyQ && i6.type != CTyE.CTyP && !(i6.portbuf[PSEnumX.PORT8] & 128)) {
            var e = 80;
            for (i6.portbuf[PSEnumX.PORT9] |= 8; i6.portbuf[PSEnumX.PORT9] & 16 && f < d;) calculator_run_timed(50), f += 50;
            i6.portbuf[PSEnumX.PORT9] & 16 ||
                (i6.portbuf[PSEnumX.PORTA] = c & 255, i6.portbuf[PSEnumX.PORT9] |= 16, e = 0);
            i6.portbuf[PSEnumX.PORT9] &= -9;
            i6.portbuf[PSEnumX.PORT8] & 1 && (i6.portbuf[PSEnumX.PORT9] |= 1, z8_interrupt_fire());
            return e
        }
        for (e = 0; 8 > e; e++) {
            emu.link_state = 2 - (c & 1);
            for (f = 0; f < d && 3 == emu.partner_link; f += 50) calculator_run_timed(50);
            if (f >= d) return emu.link_state = 3, e + 1;
            emu.link_state = 3;
            for (f = 0; f < d && 3 != emu.partner_link; f += 50) calculator_run_timed(50);
            if (f >= d) return e + 11;
            c >>= 1
        }
        return 0
    };
    this.recv_byte = function(c) {
        var d = 0,
            f =
            0;
        c || (c = LINKDELAY);
        if (i6.type != CTyE.CTyQ && i6.type != CTyE.CTyP && !(i6.portbuf[PSEnumX.PORT8] & 128)) {
            for (d = 0; 0 >= i6.la_outstamp && d < c; d += 50) calculator_run_timed(50);
            return 0 < i6.la_outstamp ? (i6.la_outstamp = -1, i6.portbuf[PSEnumX.PORT9] |= 32, c = i6.portbuf[PSEnumX.PORTD] & 255, i6.portbuf[PSEnumX.PORT8] & 2 && (i6.portbuf[PSEnumX.PORT9] |= 2, z8_interrupt_fire()), c) : -100
        }
        for (var e = 0; 8 > e; e++) {
            emu.link_state = 3;
            for (d = 0; d < c && 3 == emu.partner_link; d += 50) calculator_run_timed(50);
            if (d >= c) return -1;
            f = f >> 1 | emu.partner_link << 7 & 128;
            emu.link_state = emu.partner_link ^ 3;
            for (d = 0; d < c && 3 != emu.partner_link; d += 50) calculator_run_timed(50);
            if (d >= c) return emu.link_state = 3, -2
        }
        emu.link_state = 3;
        return f
    };
    this.send_data = function(c, d, f, e) {
        for (var g = 0; g < d; g++) {
            if (retval = this.send_byte(c[g], 0 == g ? 6E6 : LINKDELAY)) return g + 1 + .01 * retval;
            if ((g == d - 1 || 0 == g % 32) && null != e && 0 < e.length) window[e](1, f, d, "", g + 1)
        }
        return 0
    };
    this.serial_load = function(c) {};
    this.serial_save = function() {
        return "<none>"
    }
}
var link = new Link;

function js_to_sc3_inpage(c, d) {
    if (!sc3_present) return [!1, ""];
    if (1 > d.length || 8 < d.length) return [!1, "Invalid variable name"];
    for (var f = [0, 0, c, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], e = 0; e < d.length; e++) f[e + 3] = d.charCodeAt(e);
    contents = ti_common_get_file(f);
    if (!contents || !f || null == contents.length || 1 >= contents.length) return [!1, "Failed to fetch file from jsTIfied"];
    contents = buildfile_header(f, contents);
    return [!0, contents]
}

function sc3_to_js_inpage(c) {
    return sc3_present ? ti_common_send_file(c, "handleloadfile_pbcb") : -1
}

function js_to_sc2_inpage() {
    if (!sc2_present) return [!1, ""];
    name_obj = document.getElementById("sc2filename");
    if (!name_obj) return [!1, ""];
    if (1 > name_obj.value.length || 8 < name_obj.value.length) return [!1, "Missing filename or filename too long"];
    for (var c = [0, 0, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], d = 0; d < name_obj.value.length; d++) c[d + 3] = name_obj.value.charCodeAt(d);
    contents = ti_common_get_file(c);
    if (!contents || !c || null == contents.length || 1 >= contents.length) return [!1, "Failed to fetch file from jsTIfied"];
    var f = d = "";
    for (idx in c) d +=
        String.fromCharCode(c[idx]);
    for (idx in contents) f += String.fromCharCode(contents[idx]);
    params = "header=" + base64_encode(d) + "&contents=" + base64_encode(f);
    sc2_pushitem("http://www.cemetech.net/projects/basicelite/sc2/api.php?f=contents_detokenized_get", js_to_sc2_inpage_finish, params);
    return [!0, ""]
}

function js_to_sc2_inpage_finish() {
    var c = 0,
        d = "";
    if (4 == jstxmlhttp.readyState) {
        ajax_inprogress = !1;
        200 == jstxmlhttp.status ? "FAIL" == jstxmlhttp.responseText ? c = 1 : (output = "", lines = jstxmlhttp.responseText.split("\n"), lines.pop(), 1 < lines.length ? (c = 1, d = base64_decode(lines[1])) : contents = utf8_decode(base64_decode(lines[0]))) : c = 1;
        var f = document.getElementById("progdata");
        c || !f ? (document.getElementById("jstified_msgboxen").style.display = "block", document.getElementById("xfererr_txt").innerHTML = d, document.getElementById("sc2_jst_xfererr").style.display =
            "block", setTimeout('document.getElementById("sc2_jst_xfererr").style.display = "none";', 5500)) : (f.value = contents, document.getElementById("sc2_jst_xferwin").style.display = "block", setTimeout('document.getElementById("sc2_jst_xferwin").style.display = "none";', 5500));
        setTimeout("sc2_togglemenus(0,1);", 5E3)
    }
}

function sc2_to_js_inpage() {
    if (!sc2_present) return [!1, ""];
    name_obj = document.getElementById("sc2filename");
    if (!name_obj) return [!1, ""];
    if (1 > name_obj.value.length || 8 < name_obj.value.length) return [!1, "Missing filename or filename too long"];
    name = name_obj.value;
    contents = utf8_encode(document.getElementById("progdata").value);
    locked = document.getElementById("lockid").checked ? "1" : "0";
    archived = document.getElementById("arcid").checked ? "1" : "0";
    params = "name=" + base64_encode(name) + "&contents=" + base64_encode(contents) +
        "&locked=" + locked + "&archived=" + archived;
    sc2_pushitem("http://www.cemetech.net/projects/basicelite/sc2/api.php?f=contents_tokenized_get", sc2_to_js_inpage_finish, params);
    return [!0, ""]
}

function sc2_to_js_inpage_finish() {
    var c = 0,
        d = "";
    4 == jstxmlhttp.readyState && (ajax_inprogress = !1, 200 == jstxmlhttp.status ? "FAIL" == jstxmlhttp.responseText ? c = 1 : (output = "", lines = jstxmlhttp.responseText.split("\n"), lines.pop(), 1 < lines.length ? (c = 1, d = base64_decode(lines[1])) : contents = base64_decode(lines[0])) : c = 1, c ? (document.getElementById("jstified_msgboxen").style.display = "block", document.getElementById("xfererr_txt").innerHTML = d, document.getElementById("sc2_jst_xfererr").style.display = "block", setTimeout('document.getElementById("sc2_jst_xfererr").style.display = "none";',
        5500)) : (retval = ti_common_send_file(contents, "handleloadfile_pbcb"), document.getElementById("sc2_jst_xferwin").style.display = "block", setTimeout('document.getElementById("sc2_jst_xferwin").style.display = "none";', 5500)), setTimeout("sc2_togglemenus(0,1);", 5E3))
}

function utf8_encode(c) {
    if (null === c || "undefined" === typeof c) return "";
    c += "";
    var d = "",
        f, e, g = 0;
    f = e = 0;
    for (var g = c.length, l = 0; l < g; l++) {
        var h = c.charCodeAt(l),
            m = null;
        128 > h ? e++ : m = 127 < h && 2048 > h ? String.fromCharCode(h >> 6 | 192) + String.fromCharCode(h & 63 | 128) : String.fromCharCode(h >> 12 | 224) + String.fromCharCode(h >> 6 & 63 | 128) + String.fromCharCode(h & 63 | 128);
        null !== m && (e > f && (d += c.slice(f, e)), d += m, f = e = l + 1)
    }
    e > f && (d += c.slice(f, g));
    return d
}

function utf8_decode(c) {
    var d = [],
        f = 0,
        e = 0,
        g = 0,
        l = 0,
        h = 0;
    for (c += ""; f < c.length;) g = c.charCodeAt(f), 128 > g ? (d[e++] = String.fromCharCode(g), f++) : 191 < g && 224 > g ? (l = c.charCodeAt(f + 1), d[e++] = String.fromCharCode((g & 31) << 6 | l & 63), f += 2) : (l = c.charCodeAt(f + 1), h = c.charCodeAt(f + 2), d[e++] = String.fromCharCode((g & 15) << 12 | (l & 63) << 6 | h & 63), f += 3);
    return d.join("")
};

function md5_calcop(c) {
    var d = c[0],
        f = c[1],
        e = c[2],
        g = c[3],
        l = c[4],
        h = c[5],
        m = c[6];
    switch (c[7]) {
        case 0:
            return md5_ff(d, f, e, g, l, m, h);
        case 1:
            return md5_gg(d, f, e, g, l, m, h);
        case 2:
            return md5_hh(d, f, e, g, l, m, h);
        case 3:
            return md5_ii(d, f, e, g, l, m, h)
    }
    return 0
}

function md5_cmn(c, d, f, e, g, l) {
    return safe_add(bit_rol(safe_add(safe_add(d, c), safe_add(e, l)), g), f)
}

function md5_ff(c, d, f, e, g, l, h) {
    return md5_cmn(d & f | ~d & e, c, d, g, l, h)
}

function md5_gg(c, d, f, e, g, l, h) {
    return md5_cmn(d & e | f & ~e, c, d, g, l, h)
}

function md5_hh(c, d, f, e, g, l, h) {
    return md5_cmn(d ^ f ^ e, c, d, g, l, h)
}

function md5_ii(c, d, f, e, g, l, h) {
    return md5_cmn(f ^ (d | ~e), c, d, g, l, h)
}

function safe_add(c, d) {
    var f = (c & 65535) + (d & 65535);
    return (c >> 16) + (d >> 16) + (f >> 16) << 16 | f & 65535
}

function bit_rol(c, d) {
    return c << d | c >>> 32 - d
};
UTEnum = {
    LOOP: 1,
    INTERRUPT: 2,
    OVERFLOW: 4,
    FINISHED_INT: 128,
    FINISHED: 256,
    NO_HALT_INT: 512
};

function timer_timerval(c) {
    var d = timer_overflow_duration(c);
    c = c[0] & 128 ? timer_get_timer_clocks(c) : timer_get_timer_usecs(c);
    c = Math.floor(256 * c / d) % 256;
    return 0 > c ? 0 : c
}

function timer_overflow_duration(c) {
    return timer_duration(c[0], 256)
}

function timer_normal_duration(c) {
    return c[1] ? timer_duration(c[0], c[1]) : timer_duration(c[0], 256)
}

function timer_get_timer_clocks(c) {
    return c[3] - tss
}

function timer_get_timer_usecs(c) {
    return 1E6 * (timer_get_timer_clocks(c) / z8.speed)
}

function timer_duration(c, d) {
    var f = 0;
    if (c & 128) return c & 32 ? 64 * d : c & 16 ? 32 * d : c & 8 ? 16 * d : c & 4 ? 8 * d : c & 2 ? 4 * d : c & 1 ? 2 * d : d;
    if (c & 64) {
        switch (c & 7) {
            case 0:
                f = 3E6;
                break;
            case 1:
                f = 33E6;
                break;
            case 2:
                f = 328E6;
                break;
            case 3:
                f = 3277E6;
                break;
            case 4:
                f = 1E6;
                break;
            case 5:
                f = 16E6;
                break;
            case 6:
                f = 256E6;
                break;
            case 7:
                f = 4096E6
        }
        return (f * d + 16384) / 32768
    }
    return 0
}

function timer_set_frequency(c, d) {
    c[1] = timer_timerval(c);
    c[0] = d
}

function timer_set_mode(c, d) {
    c[2] = c[2] & UTEnum.NO_HALT_INT | d & 3;
    d & UTEnum.LOOP || 0 == c[1] || timer_set_period(c, 0)
}

function timer_start(c, d) {
    c[1] = d;
    var f = timer_normal_duration(c);
    if (f) {
        var e;
        e = !d || c[2] & UTEnum.FINISHED ? timer_overflow_duration(c) : c[2] & UTEnum.LOOP ? f : 0;
        timer_set_timer(c, f, e, c[0] & 128 ? 0 : 1)
    }
}

function timer_set_period(c, d) {
    c[4] = d
}

function timer_set_timer(c, d, f, e) {
    var g = 0,
        g = e ? Math.floor(z8.speed / 1E6 * d) : d;
    c[3] = tss + g;
    c[4] = f;
    for (d = 0; d < emu.ct_num; d++)
        if (emu.ct_ids[d] == c[5]) {
            emu.ct_cnt[d] = g;
            return
        } emu.ct_ids.push(c[5]);
    emu.ct_cnt.push(g);
    emu.ct_num++
}

function timer_expired(c) {
    var d;
    switch (c) {
        case 0:
            d = i6.timer0;
            break;
        case 1:
            d = i6.timer1;
            break;
        case 2:
            d = i6.timer2
    }
    d[2] |= UTEnum.FINISHED_INT;
    d[2] & UTEnum.INTERRUPT && (i6.it_active_timer = 1);
    d[2] & UTEnum.LOOP && timer_start(d, d[1])
};

function i6_swap_rom_page(c, d, f) {
    var e, g, l, h;
    i6.bank_a = c;
    i6.bank_b = d;
    i6.bank_c = f;
    g = 128;
    h = 7;
    var m = i6.rompages - 1;
    i6.type == CTyE.CTyQ && (g = 64, h = 1);
    i6.subtype == CTyE.CTySCSE && (m = i6.rompages / 2 - 1);
    c & g ? (c &= h, e = 0, l = 1) : (c &= m, i6.subtype == CTyE.CTySCSE && (c += 128 * (i6.portbuf[PSEnumX.PORTE] & 1)), e = 1, l = 0);
    d & g ? (d &= h, g = 0, h = 1) : (d &= m, i6.subtype == CTyE.CTySCSE && (d += 128 * (i6.portbuf[PSEnumX.PORTF] & 1)), g = 1, h = 0);
    f &= 7;
    i6.mmap ? (m = c & 254, i6.mut[1] = l, i6.exc[1] = i6.run_lock[m + (1 == e ? 0 : i6.rompages)], m <<= 14, i6.page[1] = 1 == e ? -1 - m : m) : (i6.page[1] = 1 == e ? -1 - (c << 14) : c << 14, i6.mut[1] = l, i6.exc[1] = i6.run_lock[c + (1 == e ? 0 : i6.rompages)]);
    i6.mmap ? i6.type == CTyE.CTyQ ? (i6.page[2] = 1 == e ? -1 - (c << 14) : c << 14, i6.mut[2] = l, i6.exc[2] = i6.run_lock[c + (1 == e ? 0 : i6.rompages)]) : (m = c | 1, i6.mut[2] = l, i6.exc[2] = i6.run_lock[m + (1 == e ? 0 : i6.rompages)], m <<= 14,
        i6.page[2] = 1 == e ? -1 - m : m) : (i6.page[2] = 1 == g ? -1 - (d << 14) : d << 14, i6.mut[2] = h, i6.exc[2] = i6.run_lock[d + (1 == g ? 0 : i6.rompages)]);
    i6.mmap ? (i6.page[3] = 1 == g ? -1 - (d << 14) : d << 14, i6.mut[3] = h, i6.exc[3] = i6.run_lock[d + (1 == g ? 0 : i6.rompages)]) : i6.type == CTyE.CTyQ ? (i6.page[3] = 0, i6.mut[3] = 1, i6.exc[3] = i6.run_lock[0 + i6.rompages]) : (i6.page[3] = f << 14, i6.mut[3] = 1, i6.exc[3] = i6.run_lock[f + i6.rompages])
}

function i6_write_normal(c, d) {
    var f, e = i6.page[f = c >> 14];
    9999 != e && (1 < f && i6.type != CTyE.CTyQ && (c > 65535 - 64 * i6.portbuf[PSEnumX.PORT27] ? e = 0 : 32768 <= c && c < 32768 + 64 * i6.portbuf[PSEnumX.PORT28] && (e = 1)), i6.mut[f] ? 0 > e ? i6.rom[-1 - e + (c & 16383)] = d : i6.ram[e + (c & 16383)] = d : i6.flash_lock & 1 && flash_write(-1 - e + (c & 16383), d))
}

function i6_read_flashid(c) {
    var d = 0,
        f = 0;
    if (0 == c) d = 194, f = 1;
    else if (2 == c) {
        switch (i6.type) {
            case CTyE.CTyQ:
                d = 185;
                break;
            case CTyE.CTyS:
                d = 218;
                break;
            default:
                d = 196
        }
        f = 1
    } else d = i6_read_port2728(c);
    f && (flash.phase = FlashModeEnum.FLASH_RESET, i6_mem_chmode());
    return d
}

function i6_read_port2728(c) {
    var d, f = i6.page[d = c >> 14];
    if (9999 == f) return 255;
    1 < d && i6.type != CTyE.CTyQ && (c > 65535 - 64 * i6.portbuf[PSEnumX.PORT27] ? f = 0 : 32768 <= c && c < 32768 + 64 * i6.portbuf[PSEnumX.PORT28] && (f = 16384));
    c == z8.r2[Regs2_PC] && i6.exc[d] && (z8.halted = 2);
    if (0 <= f) return i6.prot_buffer[i6.prot_cnt++] = 255, i6.prot_cnt &= 7, i6.ram[f + (c & 16383)];
    d = 0;
    d = i6.rom[-1 - f + (c & 16383)];
    i6.prot_buffer[i6.prot_cnt++] = (-1 - f >> 14 & i6.priv_page_mask) == i6.priv_page_val ?
        d : 255;
    i6.prot_cnt &= 7;
    return d
}

function i5_swap_rom_page(c, d, f) {
    var e, g, l, h, m, n;
    i6.bank_a = c;
    i6.bank_b = d;
    i6.bank_c = f;
    l = i6.rompages - 1;
    n = i6.type == CTyE.CALC_TYPE_82 ? 8 : 16;
    c & n ? (c &= 1, e = 0, h = 1) : (c &= l, e = 1, h = 0);
    d & n ? (d &= 1, g = 0, m = 1) : (d &= l, g = 1, m = 0);
    f & n ? (f &= 1, l = 0, n = 1) : (f &= l, l = 1, n = 0);
    i6.page[1] = 1 == e ? -1 - (c << 14) : c << 14;
    i6.mut[1] = h;
    i6.exc[1] = 0;
    i6.page[2] = 1 == g ? -1 - (d << 14) : d << 14;
    i6.mut[2] = m;
    i6.exc[2] = 0;
    i6.page[3] = 1 == l ? -1 - (f << 14) : f << 14;
    i6.mut[3] = n;
    i6.exc[3] = 0
}

function i6_read_normal(c) {
    var d, f = i6.page[d = c >> 14];
    if (9999 == f) return 255;
    c == z8.r2[Regs2_PC] && i6.exc[d] && (z8.halted = 2);
    if (0 <= f) return i6.prot_buffer[i6.prot_cnt++] = 255, i6.prot_cnt &= 7, i6.ram[f + (c & 16383)];
    d = 0;
    d = i6.rom[-1 - f + (c & 16383)];
    i6.prot_buffer[i6.prot_cnt++] = (-1 - f >> 14 & i6.priv_page_mask) == i6.priv_page_val ? d : 255;
    i6.prot_cnt &= 7;
    return d
}

function i6_rmem(c) {
    var d = i6.page[tmp = c >> 14];
    if (9999 == d) return 255;
    1 < tmp && i6.type != CTyE.CTyQ && (c > 65535 - 64 * i6.portbuf[PSEnumX.PORT27] ? d = 0 : 32768 <= c && c < 32768 + 64 * i6.portbuf[PSEnumX.PORT28] && (d = 16384));
    return 0 > d ? i6.rom[-1 - d + (c & 16383)] : i6.ram[d + (c & 16383)]
}

function i5_write_normal(c, d) {
    var f, e = i6.page[f = c >> 14];
    9999 != e && i6.mut[f] && 0 <= e && (i6.ram[e + (c & 16383)] = d)
}

function i5_read(c) {
    var d, f = i6.page[d = c >> 14];
    if (9999 == f) return 255;
    c == z8.r2[Regs2_PC] && i6.exc[d] && (z8.halted = 2);
    return 0 <= f ? i6.ram[f + (c & 16383)] : i6.rom[-1 - f + (c & 16383)]
}

function i6_read_watch(c) {
    z8.watches.hasOwnProperty(c) && z8.watches[c] & 1 && (debug_trapped = !0);
    return readbyte_sub(c)
}

function i6_write_watch(c, d) {
    z8.watches.hasOwnProperty(c) && z8.watches[c] & 2 && (debug_trapped = !0);
    return writebyte_sub(c, d)
}
var i6_read = i6_read_normal,
    i6_write = i6_write_normal,
    wQj = i6_read_normal,
    wQi = i6_write_normal,
    readbyte_sub = function() {},
    writebyte_sub = function() {};

function i6_mem_chmode(c) {
    wQi = i6_write_normal;
    if (i6.type == CTyE.CTyP || i6.type == CTyE.CALC_TYPE_82) i6_read = i5_read, i6_write = i5_write_normal, wQj = i5_read, wQi = i5_write_normal;
    else {
        if (null != c) switch (c) {
            case 0:
                wQj = i6_read = i6_read_normal;
                break;
            case 1:
                wQj = i6_read = i6_read_flashid;
                break;
            case 2:
                wQj = i6_read = i6_read_port2728
        } else wQj =
            flash.phase == FlashModeEnum.FLASH_ID ? i6_read = i6_read_flashid : i6.type == CTyE.CTyQ || 0 == i6.portbuf[PSEnumX.PORT27] && 0 == i6.portbuf[PSEnumX.PORT28] ? i6_read = i6_read_normal : i6_read = i6_read_port2728;
        c = 0;
        for (k in z8.watches) z8.watches.hasOwnProperty(k) && c++;
        c && (readbyte_sub = wQj, wQj = i6_read_watch, writebyte_sub = wQi, wQi = i6_write_watch)
    }
};

function Debugger() {
    this.table_loaded = 0;
    this.table = [];
    this.disas_base = 0;
    this.disas_base_shown = -1;
    this.disas_dirty = !0;
    this.disas_rev = {};
    this.disas_hls = [];
    this.disas_len = 255;
    this.mem_base = 0;
    this.mem_step = 8;
    this.mem_rows = 32;
    this.mem_selected = -1;
    this.mem_hls = [];
    this.toggle_fields = {
        cpu_raf: ["r", "a", "f", Regs_A, Regs_F],
        cpu_rbc: ["r", "b", "c", Regs_B, Regs_C],
        cpu_rde: ["r", "d", "e", Regs_D, Regs_E],
        cpu_rhl: ["r", "h", "l", Regs_H, Regs_L],
        cpu_rafp: ["r", "a_", "f_", Regs_A_, Regs_F_],
        cpu_rbcp: ["r", "b_", "c_", Regs_B_, Regs_C_],
        cpu_rdep: ["r", "d_", "e_", Regs_D_, Regs_E_],
        cpu_rhlp: ["r", "h_", "l_", Regs_H_, Regs_L_],
        cpu_rix: ["r", "ixh", "ixl", Regs_IXH, Regs_IXL],
        cpu_riy: ["r", "iyh", "iyl", Regs_IYH, Regs_IYL],
        cpu_rsp: ["rr", "sp", Regs2_SP],
        cpu_rpc: ["rr", "pc", Regs2_PC],
        cpu_b0p: ["b", 0],
        cpu_b1p: ["b", 1],
        cpu_b2p: ["b", 2],
        cpu_b3p: ["b", 3]
    };
    this.debug_pause = function() {
        for (var c = Object.keys(this.toggle_fields), d = 0; d < c.length; d++) document.getElementById(c[d]).removeAttribute("readonly"), document.getElementById(c[d]).className = "dbg_button", document.getElementById(c[d]).onchange =
            debug_register_validate
    };
    this.debug_continue = function() {
        for (var c = Object.keys(this.toggle_fields), d = 0; d < c.length; d++) document.getElementById(c[d]).setAttribute("readonly", "readonly"), document.getElementById(c[d]).className = "dbg_button_disabled", document.getElementById(c[d]).onchange = null;
        this.debug_mem_hide()
    };
    this.debug_popfields = function() {
        if (this.debug_havedebug()) {
            null != z8 && (document.getElementById("cpu_raf").value = ("000" + (z8.r[Regs_A] << 8 | z8.r[Regs_F]).toString(16)).slice(-4), document.getElementById("cpu_rbc").value =
                ("000" + (z8.r[Regs_B] << 8 | z8.r[Regs_C]).toString(16)).slice(-4), document.getElementById("cpu_rde").value = ("000" + (z8.r[Regs_D] << 8 | z8.r[Regs_E]).toString(16)).slice(-4), document.getElementById("cpu_rhl").value = ("000" + (z8.r[Regs_H] << 8 | z8.r[Regs_L]).toString(16)).slice(-4), document.getElementById("cpu_rafp").value = ("000" + (z8.r[Regs_A_] << 8 | z8.r[Regs_F_]).toString(16)).slice(-4), document.getElementById("cpu_rbcp").value = ("000" + (z8.r[Regs_B_] << 8 | z8.r[Regs_C_]).toString(16)).slice(-4), document.getElementById("cpu_rdep").value =
                ("000" + (z8.r[Regs_D_] << 8 | z8.r[Regs_E_]).toString(16)).slice(-4), document.getElementById("cpu_rhlp").value = ("000" + (z8.r[Regs_H_] << 8 | z8.r[Regs_L_]).toString(16)).slice(-4), document.getElementById("cpu_rix").value = ("000" + (z8.r[Regs_IXH] << 8 | z8.r[Regs_IXL]).toString(16)).slice(-4), document.getElementById("cpu_riy").value = ("000" + (z8.r[Regs_IYH] << 8 | z8.r[Regs_IYL]).toString(16)).slice(-4), document.getElementById("cpu_rsp").value = ("000" + z8.r2[Regs2_SP].toString(16)).slice(-4), document.getElementById("cpu_rpc").value =
                ("000" + z8.r2[Regs2_PC].toString(16)).slice(-4), document.getElementById("cpu_fs").checked = 0 != (z8.r[Regs_F] & 128), document.getElementById("cpu_fz").checked = 0 != (z8.r[Regs_F] & 64), document.getElementById("cpu_fh").checked = 0 != (z8.r[Regs_F] & 16), document.getElementById("cpu_fp").checked = 0 != (z8.r[Regs_F] & 4), document.getElementById("cpu_fn").checked = 0 != (z8.r[Regs_F] & 2), document.getElementById("cpu_fc").checked = 0 != (z8.r[Regs_F] & 1));
            if (null != i6 && null != i6.page) {
                var c = i6.type == CTyE.CTyQ ?
                    64 : i6.type == CTyE.CTyP ? 16 : i6.type == CTyE.CALC_TYPE_82 ? 8 : i6.subtype == CTyE.CTySCSE ? 256 : 128,
                    d = -(i6.subtype == CTyE.CTySCSE ? 3 : 2);
                document.getElementById("cpu_b0p").value = ("00" + this.debug_adrtopage(i6.page[0], c).toString(16)).slice(d);
                document.getElementById("cpu_b1p").value = ("00" + this.debug_adrtopage(i6.page[1], c).toString(16)).slice(d);
                document.getElementById("cpu_b2p").value = ("00" + this.debug_adrtopage(i6.page[2], c).toString(16)).slice(d);
                document.getElementById("cpu_b3p").value = ("00" + this.debug_adrtopage(i6.page[3], c).toString(16)).slice(d)
            }
            this.debug_popdis();
            this.debug_popdishls();
            this.debug_popmemhls();
            this.debug_popmem()
        }
    };
    this.debug_popdis = function() {
        if (null != i6 && null != i6.page && (this.disas_base != this.disas_base_shown || this.disas_dirty)) {
            var c = document.getElementById("cpu_dis");
            c.options.length = 0;
            this.disas_rev = {};
            for (var d = this.disas_base; d < this.disas_len + this.disas_base && 65535 >= d;) {
                var f = this.debug_readcommand(d),
                    e = document.createElement("option");
                e.text = (4096 > d ? "0" + (256 > d ? "0" + (16 > d ? "0" : "") : "") : "") + d.toString(16) + ": " + f[0];
                e.value = d;
                c.add(e, null);
                this.disas_rev[d] = c.options.length - 1;
                d += f[1]
            }
            this.disas_base_shown = this.disas_base;
            this.disas_dirty = !1
        }
    };
    this.debug_popdishls = function() {
        var c = document.getElementById("cpu_dis");
        if (c) {
            for (var d = 0; d < this.disas_hls.length; d++) c.options[this.disas_hls[d]].className = "";
            this.disas_hls.length = 0;
            if (this.disas_rev.hasOwnProperty(z8.r2[Regs2_PC])) {
                var f = this.disas_rev[z8.r2[Regs2_PC]];
                c.options[f].className = "cpu_dis_pc";
                this.disas_hls.push(f)
            }
            for (d = 0; d < z8.breakp.length; d++)
                if (this.disas_rev.hasOwnProperty(z8.breakp[d])) {
                    var f = this.disas_rev[z8.breakp[d]],
                        e = "cpu_dis_break";
                    z8.breakp[d] == z8.r2[Regs2_PC] && (e = "cpu_dis_breakpc");
                    c.options[f].className = e;
                    this.disas_hls.push(f)
                } c.selectedIndex = -1
        }
    };
    this.debug_popmem = function() {
        if (null != i6 && null != i6.page) {
            var c = document.getElementById("mem_all");
            if (c) {
                for (; c.hasChildNodes();) c.removeChild(c.lastChild);
                for (var d = this.mem_base; d <
                    this.mem_rows * this.mem_step + this.mem_base;) {
                    var f = document.createElement("div");
                    f.className = "mem_row";
                    var e = document.createElement("div");
                    e.className = "mem_addr";
                    e.appendChild(document.createTextNode((4096 > d ? "0" + (256 > d ? "0" + (16 > d ? "0" : "") : "") : "") + d.toString(16) + ":"));
                    f.appendChild(e);
                    for (var e = "", g = 0; g < this.mem_step; g++, d++) {
                        var l = document.createElement("div");
                        l.className = "mem_byte";
                        l.id = "mem_" + d.toString();
                        l.onclick = debug_mem_click;
                        var h = i6_read_normal(d & 65535),
                            e = e + (32 <= h && 126 >= h ? String.fromCharCode(h) :
                                ".");
                        l.appendChild(document.createTextNode((16 > h ? "0" : "") + h.toString(16)));
                        f.appendChild(l)
                    }
                    g = document.createElement("div");
                    g.className = "mem_chars";
                    g.appendChild(document.createTextNode(e));
                    f.appendChild(g);
                    c.appendChild(f)
                }
                this.debug_popmemhls()
            }
        }
    };
    this.debug_mem_hide = function() {
        document.getElementById("mem_popup").style.display = "none";
        if (-1 != this.mem_selected) {
            var c = document.getElementById("mem_" + this.mem_selected.toString());
            c && (c.className = this.debug_mem_getclass(this.mem_selected))
        }
    };
    this.debug_mem_click =
        function(c) {
            if (c && c.target && c.target.id && "mem_" == c.target.id.substring(0, 4)) {
                var d = parseInt(c.target.id.substring(4));
                if (-1 != this.mem_selected) {
                    var f = document.getElementById("mem_" + this.mem_selected.toString());
                    f && (f.className = this.debug_mem_getclass(this.mem_selected))
                }
                c.target.setAttribute("class", c.target.getAttribute("class") + " mem_byte_selected");
                this.mem_selected = d;
                for (f = d.toString(16); 4 > f.length;) f = "0" + f;
                document.getElementById("mem_addr").innerHTML = f;
                d = i6_read_normal(d & 65535);
                document.getElementById("mem_value").value =
                    (16 > d ? "0" : "") + d.toString(16);
                d = document.getElementById("mem_popup");
                f = document.getElementById("mem_all");
                d.style.top = (c.target.offsetTop - f.scrollTop - 37).toString() + "px";
                d.style.left = (c.target.offsetLeft - f.scrollLeft - 178).toString() + "px";
                d.style.display = "block"
            }
        };
    this.debug_mem_getclass = function(c, d) {
        var f = d;
        if (null == d) {
            var f = 0,
                e;
            for (e in z8.watches) z8.watches.hasOwnProperty(e) && e == c && (f = z8.watches[e])
        }
        switch (f) {
            default:
                return "mem_byte";
            case 1:
                return "mem_byte_r";
            case 2:
                return "mem_byte_w";
            case 3:
                return "mem_byte_rw"
        }
    };
    this.debug_srwatch = function(c) {
        if ("clrall" == c) {
            for (key in z8.watches) z8.watches.hasOwnProperty(key) && delete z8.watches[key];
            this.debug_mem_hide();
            this.debug_popmem()
        } else {
            var d = 0,
                f = this.mem_selected;
            switch (c) {
                case "r":
                    d = 1;
                    break;
                case "w":
                    d = 2;
                    break;
                case "rw":
                    d = 3;
                    break;
                default:
                    d = 0
            }
            0 == d ? delete z8.watches[f] : z8.watches[f] = d;
            i6_mem_chmode();
            this.debug_mem_hide();
            this.debug_popmemhls()
        }
    };
    this.debug_popmemhls = function() {
        for (var c = 0; c < this.mem_hls.length; c++) {
            var d = document.getElementById("mem_" +
                this.mem_hls[c]);
            d && (d.className = "mem_byte")
        }
        this.mem_hls.length = 0;
        for (var f in z8.watches) z8.watches.hasOwnProperty(f) && (c = this.debug_mem_getclass(f, z8.watches[f]), d = document.getElementById("mem_" + f)) && (d.setAttribute("class", d.getAttribute("class") + " " + c), this.mem_hls.push(f))
    };
    this.debug_step = function() {
        debug_stepping = 1;
        i6.it_cnt < i6.it_next && !i6.it_active && emu.stop_cnt < emu.stop_period && 2 > z8.halted ? z8_step() : i6_run();
        debug_stepping = 0;
        this.debug_popfields()
    };
    this.debug_stepover =
        function() {
            debug_stepping = 2;
            debug_ret_sp = z8.r2[Regs2_SP];
            debug_ret_pc = z8.r2[Regs2_PC];
            z8_step_chmode();
            running ? run() : start()
        };
    this.debug_adrtopage = function(c, d) {
        var f = 0 > c ? 0 : d;
        0 > c && (c = -1 - c);
        return f | c >> 14 & 255
    };
    this.debug_setbreak = function(c) {
        if (null == c) {
            c = document.getElementById("cpu_dis");
            if (!c) return;
            c = 0 <= c.selectedIndex ? parseInt(c.options[c.selectedIndex].value) : z8.r2[Regs2_PC]
        } - 1 >= z8.breakp.indexOf(c) ? (z8.breakp.push(c), z8.breaks = z8.breakp.length, this.debug_popdishls(), z8_step_chmode()) :
            this.debug_clearbreak(z8.breakp.indexOf(c))
    };
    this.debug_clearbreak = function(c) {
        null != c && 0 <= c ? (z8.breakp.splice(c, 1), z8.breaks--) : null == c && (z8.breakp.length = 0, z8.breaks = 0);
        this.debug_popdishls();
        z8_step_chmode()
    };
    this.debug_havedebug = function() {
        return null != document.getElementById("jstified_cpu")
    };
    this.debug_enablestep = function(c) {
        this.debug_havedebug() && (document.getElementById("cpu_step").disabled = 0 == c, document.getElementById("cpu_stepover").disabled = 0 == c)
    };
    this.debug_imbreak_set = function() {
        z8.breakim =
            document.getElementById("imbreak").checked
    };
    this.debug_readcommand = function(c) {
        this.table_loaded || this.debug_loadtable();
        var d = this.table,
            f = c;
        do var e = i6_read_normal(c++ & 65535),
            d = d[e]; while (null != d && 2 > c - f && (2 > d.length || "string" != typeof d[1]));
        null != d && 2 == c - f && (2 > d.length || "string" != typeof d[1]) ? d = d[i6_read_normal(c + 1 & 65535) & 199] : null == d && 2 == c - f && (c -= 2, d = this.table[i6_read_normal(c++ & 65535)], d = d[i6_read_normal(c & 65535) & 199], null == d || 2 > d.length || "string" != typeof d[1] || "B" != d[3]) && (d =
            null);
        if (null == d || null == d[1] || "string" != typeof d[1]) return ["???", 1];
        var e = d[1] + " ",
            g = 0,
            l = d[4];
        l && 6 > d.length && (g = i6_read_normal(c++ & 65535), 2 == l && (g += 256 * i6_read_normal(c++ & 65535)));
        if ("*" == d[2] && "N" == d[3]) e += "$" + g.toString(16);
        else if ("''" != d[2]) {
            e += d[2];
            if (-1 != e.indexOf("(ix*)") || -1 != e.indexOf("(iy*)")) 6 <= d.length && (g = i6_read_normal(c++ & 65535)), l = "", l = 128 > g ? "+$" + g.toString(16) : "-$" + (-(g - 256)).toString(16), e = e.replace("*)", l + ")"); - 1 != e.indexOf(",*,") && (l = i6_read_normal(c++ & 65535), e =
                e.replace(",*,", "," + (l & 56) / 8 + ",")); - 1 != e.indexOf(" *,") && (l = i6_read_normal(c++ & 65535), l = (l & 56) / 8, e = e.replace(" *,", " " + l + ",")); - 1 != e.indexOf("*") && (e = "R" == d[3] ? e.replace("*", "$" + ((127 < g ? g - 256 : g) + c).toString(16)) : e.replace("*", "$" + g.toString(16)))
        }
        return [e, c - f]
    };
    this.debug_loadtable = function() {
        for (var c = "ADC A,(HL) 8E 1 N 1;ADC A,(IX*) 8EDD 3 X 1;ADC A,(IY*) 8EFD 3 X 1;ADC A,A 8F 1 N 1;ADC A,B 88 1 N 1;ADC A,C 89 1 N 1;ADC A,D 8A 1 N 1;ADC A,E 8B 1 N 1;ADC A,H 8C 1 N 1;ADC A,IXH 8CDD 2 N 1;ADC A,IXL 8DDD 2 N 1;ADC A,IYH 8CFD 2 N 1;ADC A,IYL 8DFD 2 N 1;ADC A,L 8D 1 N 1;ADC A,* CE 2 N 1;ADC HL,BC 4AED 2 N 1;ADC HL,DE 5AED 2 N 1;ADC HL,HL 6AED 2 N 1;ADC HL,SP 7AED 2 N 1;ADD A,(HL) 86 1 N 1;ADD A,(IX*) 86DD 3 X 1;ADD A,(IY*) 86FD 3 X 1;ADD A,A 87 1 N 1;ADD A,B 80 1 N 1;ADD A,C 81 1 N 1;ADD A,D 82 1 N 1;ADD A,E 83 1 N 1;ADD A,H 84 1 N 1;ADD A,IXH 84DD 2 N 1;ADD A,IXL 85DD 2 N 1;ADD A,IYH 84FD 2 N 1;ADD A,IYL 85FD 2 N 1;ADD A,L 85 1 N 1;ADD A,* C6 2 N 1;ADD HL,BC 09 1 N 1;ADD HL,DE 19 1 N 1;ADD HL,HL 29 1 N 1;ADD HL,SP 39 1 N 1;ADD IX,BC 09DD 2 N 1;ADD IX,DE 19DD 2 N 1;ADD IX,IX 29DD 2 N 1;ADD IX,SP 39DD 2 N 1;ADD IY,BC 09FD 2 N 1;ADD IY,DE 19FD 2 N 1;ADD IY,IY 29FD 2 N 1;ADD IY,SP 39FD 2 N 1;AND (HL) A6 1 N 1;AND (IX*) A6DD 3 X 1;AND (IY*) A6FD 3 X 1;AND A A7 1 N 1;AND B A0 1 N 1;AND C A1 1 N 1;AND D A2 1 N 1;AND E A3 1 N 1;AND H A4 1 N 1;AND IXH A4DD 2 N 1;AND IXL A5DD 2 N 1;AND IYH A4FD 2 N 1;AND IYL A5FD 2 N 1;AND L A5 1 N 1;AND * E6 2 N 1;BCALL * EF 3 N 1;BIT *,(IX*) CBDD 4 B 1 0 4600;BIT *,(IY*) CBFD 4 B 1 0 4600;CALL C,* DC 3 N 1;CALL M,* FC 3 N 1;CALL NC,* D4 3 N 1;CALL NZ,* C4 3 N 1;CALL P,* F4 3 N 1;CALL PE,* EC 3 N 1;CALL PO,* E4 3 N 1;CALL Z,* CC 3 N 1;CALL * CD 3 N 1;CCF '' 3F 1 N 1;CP (HL) BE 1 N 1;CP (IX*) BEDD 3 X 1;CP (IY*) BEFD 3 X 1;CP A BF 1 N 1;CP B B8 1 N 1;CP C B9 1 N 1;CP D BA 1 N 1;CP E BB 1 N 1;CP H BC 1 N 1;CP IXH BCDD 2 N 1;CP IXL BDDD 2 N 1;CP IYH BCFD 2 N 1;CP IYL BDFD 2 N 1;CP L BD 1 N 1;CP * FE 2 N 1;CPD '' A9ED 2 N 1;CPDR '' B9ED 2 N 1;CPIR '' B1ED 2 N 1;CPI '' A1ED 2 N 1;CPL '' 2F 1 N 1;DAA '' 27 1 N 1;DEC (HL) 35 1 N 1;DEC (IX*) 35DD 3 X 1;DEC (IY*) 35FD 3 X 1;DEC A 3D 1 N 1;DEC B 05 1 N 1;DEC BC 0B 1 N 1;DEC C 0D 1 N 1;DEC D 15 1 N 1;DEC DE 1B 1 N 1;DEC E 1D 1 N 1;DEC H 25 1 N 1;DEC HL 2B 1 N 1;DEC IX 2BDD 2 N 1;DEC IXH 25DD 2 N 1;DEC IXL 2DDD 2 N 1;DEC IY 2BFD 2 N 1;DEC IYH 24FD 2 N 1;DEC IYL 2DFD 2 N 1;DEC L 2D 1 N 1;DEC SP 3B 1 N 1;DI '' F3 1 N 1;DJNZ * 10 2 R 1;EI '' FB 1 N 1;EX (SP),HL E3 1 N 1;EX (SP),IX E3DD 2 N 1;EX (SP),IY E3FD 2 N 1;EX AF,AF' 08 1 N 1;EX DE,HL EB 1 N 1;EXX '' D9 1 N 1;HALT '' 76 1 N 1;IM 0 46ED 2 N 1;IM 1 56ED 2 N 1;IM 2 5EED 2 N 1;IN A,(C) 78ED 2 N 1;IN B,(C) 40ED 2 N 1;IN C,(C) 48ED 2 N 1;IN D,(C) 50ED 2 N 1;IN E,(C) 58ED 2 N 1;IN F,(C) 70ED 2 N 1;IN H,(C) 60ED 2 N 1;IN L,(C) 68ED 2 N 1;IN A,(*) DB 2 N 1;INC (HL) 34 1 N 1;INC (IX*) 34DD 3 X 1;INC (IY*) 34FD 3 X 1;INC A 3C 1 N 1;INC B 04 1 N 1;INC BC 03 1 N 1;INC C 0C 1 N 1;INC D 14 1 N 1;INC DE 13 1 N 1;INC E 1C 1 N 1;INC H 24 1 N 1;INC HL 23 1 N 1;INC IX 23DD 2 N 1;INC IXH 24DD 2 N 1;INC IXL 2CDD 2 N 1;INC IY 23FD 2 N 1;INC IYH 24FD 2 N 1;INC IYL 2CFD 2 N 1;INC L 2C 1 N 1;INC SP 33 1 N 1;IND '' AAED 2 N 1;INDR '' BAED 2 N 1;INI '' A2ED 2 N 1;INIR '' B2ED 2 N 1;JP (HL) E9 1 N 1;JP (IX) E9DD 2 N 1;JP (IY) E9FD 2 N 1;JP C,* DA 3 N 1;JP M,* FA 3 N 1;JP NC,* D2 3 N 1;JP NZ,* C2 3 N 1;JP P,* F2 3 N 1;JP PE,* EA 3 N 1;JP PO,* E2 3 N 1;JP Z,* CA 3 N 1;JP * C3 3 N 1;JR C,* 38 2 R 1;JR NC,* 30 2 R 1;JR NZ,* 20 2 R 1;JR Z,* 28 2 R 1;JR * 18 2 R 1;LD (BC),A 02 1 N 1;LD (DE),A 12 1 N 1;LD (HL),A 77 1 N 1;LD (HL),B 70 1 N 1;LD (HL),C 71 1 N 1;LD (HL),D 72 1 N 1;LD (HL),E 73 1 N 1;LD (HL),H 74 1 N 1;LD (HL),L 75 1 N 1;LD (HL),* 36 2 N 1;LD (IX*),A 77DD 3 X 1;LD (IX*),B 70DD 3 X 1;LD (IX*),C 71DD 3 X 1;LD (IX*),D 72DD 3 X 1;LD (IX*),E 73DD 3 X 1;LD (IX*),H 74DD 3 X 1;LD (IX*),L 75DD 3 X 1;LD (IX*),* 36DD 4 X 1;LD (IY*),A 77FD 3 X 1;LD (IY*),B 70FD 3 X 1;LD (IY*),C 71FD 3 X 1;LD (IY*),D 72FD 3 X 1;LD (IY*),E 73FD 3 X 1;LD (IY*),H 74FD 3 X 1;LD (IY*),L 75FD 3 X 1;LD (IY*),* 36FD 4 X 1;LD (*),A 32 3 N 1;LD (*),BC 43ED 4 N 1;LD (*),DE 53ED 4 N 1;LD (*),HL 22 3 N 1;LD (*),IX 22DD 4 N 1;LD (*),IY 22FD 4 N 1;LD (*),SP 73ED 4 N 1;LD A,(BC) 0A 1 N 1;LD A,(DE) 1A 1 N 1;LD A,(HL) 7E 1 N 1;LD A,(IX*) 7EDD 3 X 1;LD A,(IY*) 7EFD 3 X 1;LD A,A 7F 1 N 1;LD A,B 78 1 N 1;LD A,C 79 1 N 1;LD A,D 7A 1 N 1;LD A,E 7B 1 N 1;LD A,H 7C 1 N 1;LD A,I 57ED 2 N 1;LD A,IXH 7CDD 2 N 1;LD A,IXL 7DDD 2 N 1;LD A,IYH 7CFD 2 N 1;LD A,IYL 7DFD 2 N 1;LD A,L 7D 1 N 1;LD A,R 5FED 2 N 1;LD A,(*) 3A 3 N 1;LD A,* 3E 2 N 1;LD B,(HL) 46 1 N 1;LD B,(IX*) 46DD 3 X 1;LD B,(IY*) 46FD 3 X 1;LD B,A 47 1 N 1;LD B,B 40 1 N 1;LD B,C 41 1 N 1;LD B,D 42 1 N 1;LD B,E 43 1 N 1;LD B,H 44 1 N 1;LD B,IXH 44DD 2 N 1;LD B,IXL 45DD 2 N 1;LD B,IYH 44FD 2 N 1;LD B,IYL 45FD 2 N 1;LD B,L 45 1 N 1;LD B,* 06 2 N 1;LD BC,(*) 4BED 4 N 1;LD BC,* 01 3 N 1;LD C,(HL) 4E 1 N 1;LD C,(IX*) 4EDD 3 X 1;LD C,(IY*) 4EFD 3 X 1;LD C,A 4F 1 N 1;LD C,B 48 1 N 1;LD C,C 49 1 N 1;LD C,D 4A 1 N 1;LD C,E 4B 1 N 1;LD C,H 4C 1 N 1;LD C,IXH 4CDD 2 N 1;LD C,IXL 4DDD 2 N 1;LD C,IYH 4CFD 2 N 1;LD C,IYL 4DFD 2 N 1;LD C,L 4D 1 N 1;LD C,* 0E 2 N 1;LD D,(HL) 56 1 N 1;LD D,(IX*) 56DD 3 X 1;LD D,(IY*) 56FD 3 X 1;LD D,A 57 1 N 1;LD D,B 50 1 N 1;LD D,C 51 1 N 1;LD D,D 52 1 N 1;LD D,E 53 1 N 1;LD D,H 54 1 N 1;LD D,IXH 54DD 2 N 1;LD D,IXL 55DD 2 N 1;LD D,IYH 54FD 2 N 1;LD D,IYL 55FD 2 N 1;LD D,L 55 1 N 1;LD D,* 16 2 N 1;LD DE,(*) 5BED 4 N 1;LD DE,* 11 3 N 1;LD E,(HL) 5E 1 N 1;LD E,(IX*) 5EDD 3 X 1;LD E,(IY*) 5EFD 3 X 1;LD E,A 5F 1 N 1;LD E,B 58 1 N 1;LD E,C 59 1 N 1;LD E,D 5A 1 N 1;LD E,E 5B 1 N 1;LD E,H 5C 1 N 1;LD E,IXH 5CDD 2 N 1;LD E,IXL 5DDD 2 N 1;LD E,IYH 5CFD 2 N 1;LD E,IYL 5DFD 2 N 1;LD E,L 5D 1 N 1;LD E,* 1E 2 N 1;LD H,(HL) 66 1 N 1;LD H,(IX*) 66DD 3 X 1;LD H,(IY*) 66FD 3 X 1;LD H,A 67 1 N 1;LD H,B 60 1 N 1;LD H,C 61 1 N 1;LD H,D 62 1 N 1;LD H,E 63 1 N 1;LD H,H 64 1 N 1;LD H,L 65 1 N 1;LD H,* 26 2 N 1;LD HL,(*) 2A 3 N 1;LD HL,* 21 3 N 1;LD I,A 47ED 2 N 1;LD IX,(*) 2ADD 4 N 1;LD IX,* 21DD 4 N 1;LD IXH,A 67DD 2 N 1;LD IXH,B 60DD 2 N 1;LD IXH,C 61DD 2 N 1;LD IXH,D 62DD 2 N 1;LD IXH,E 63DD 2 N 1;LD IXH,IXH 64DD 2 N 1;LD IXH,IXL 65DD 2 N 1;LD IXH,* 26DD 3 N 1;LD IXL,A 6FDD 2 N 1;LD IXL,B 68DD 2 N 1;LD IXL,C 69DD 2 N 1;LD IXL,D 6ADD 2 N 1;LD IXL,E 6BDD 2 N 1;LD IXL,IXH 6CDD 2 N 1;LD IXL,IXL 6DDD 2 N 1;LD IXL,* 2EDD 3 N 1;LD IY,(*) 2AFD 4 N 1;LD IY,* 21FD 4 N 1;LD IYH,A 67FD 2 N 1;LD IYH,B 60FD 2 N 1;LD IYH,C 61FD 2 N 1;LD IYH,D 62FD 2 N 1;LD IYH,E 63FD 2 N 1;LD IYH,IYH 64FD 2 N 1;LD IYH,IYL 65FD 2 N 1;LD IYH,* 26FD 3 N 1;LD IYL,A 6FFD 2 N 1;LD IYL,B 68FD 2 N 1;LD IYL,C 69FD 2 N 1;LD IYL,D 6AFD 2 N 1;LD IYL,E 6BFD 2 N 1;LD IYL,IYH 6CFD 2 N 1;LD IYL,IYL 6DFD 2 N 1;LD IYL,* 2EFD 3 N 1;LD L,(HL) 6E 1 N 1;LD L,(IX*) 6EDD 3 X 1;LD L,(IY*) 6EFD 3 X 1;LD L,A 6F 1 N 1;LD L,B 68 1 N 1;LD L,C 69 1 N 1;LD L,D 6A 1 N 1;LD L,E 6B 1 N 1;LD L,H 6C 1 N 1;LD L,L 6D 1 N 1;LD L,* 2E 2 N 1;LD R,A 4FED 2 N 1;LD SP,(*) 7BED 4 N 1;LD SP,HL F9 1 N 1;LD SP,IX F9DD 2 N 1;LD SP,IY F9FD 2 N 1;LD SP,* 31 3 N 1;LDD '' A8ED 2 N 1;LDDR '' B8ED 2 N 1;LDI '' A0ED 2 N 1;LDIR '' B0ED 2 N 1;NEG '' 44ED 2 N 1;NOP '' 00 1 N 1;OR (HL) B6 1 N 1;OR (IX*) B6DD 3 X 1;OR (IY*) B6FD 3 X 1;OR A B7 1 N 1;OR B B0 1 N 1;OR C B1 1 N 1;OR D B2 1 N 1;OR E B3 1 N 1;OR H B4 1 N 1;OR IXH B4DD 2 N 1;OR IXL B5DD 2 N 1;OR IYH B4FD 2 N 1;OR IYL B5FD 2 N 1;OR L B5 1 N 1;OR * F6 2 N 1;OTDM '' 8BED 2 N 2;OTDMR '' 9BED 2 N 2;OTDR '' BBED 2 N 1;OTIM '' 83ED 2 N 2;OTIMR '' 93ED 2 N 2;OTIR '' B3ED 2 N 1;OUT (C),A 79ED 2 N 1;OUT (C),B 41ED 2 N 1;OUT (C),C 49ED 2 N 1;OUT (C),D 51ED 2 N 1;OUT (C),E 59ED 2 N 1;OUT (C),F 71ED 2 N 1;OUT (C),0 71ED 2 N 1;OUT (C),H 61ED 2 N 1;OUT (C),L 69ED 2 N 1;OUT (*),A D3 2 N 1;OUTD '' ABED 2 N 1;OUTI '' A3ED 2 N 1;POP AF F1 1 N 1;POP BC C1 1 N 1;POP DE D1 1 N 1;POP HL E1 1 N 1;POP IX E1DD 2 N 1;POP IY E1FD 2 N 1;PUSH AF F5 1 N 1;PUSH BC C5 1 N 1;PUSH DE D5 1 N 1;PUSH HL E5 1 N 1;PUSH IX E5DD 2 N 1;PUSH IY E5FD 2 N 1;RES *,(IX*) CBDD 4 B 1 0 8600;RES *,(IY*) CBFD 4 B 1 0 8600;RES A,*,(IX*) CBDD 4 B 1 0 8700;RES A,*,(IY*) CBFD 4 B 1 0 8700;RES B,*,(IX*) CBDD 4 B 1 0 8000;RES B,*,(IY*) CBFD 4 B 1 0 8000;RES C,*,(IX*) CBDD 4 B 1 0 8100;RES C,*,(IY*) CBFD 4 B 1 0 8100;RES D,*,(IX*) CBDD 4 B 1 0 8200;RES D,*,(IY*) CBFD 4 B 1 0 8200;RES E,*,(IX*) CBDD 4 B 1 0 8300;RES E,*,(IY*) CBFD 4 B 1 0 8300;RES H,*,(IX*) CBDD 4 B 1 0 8400;RES H,*,(IY*) CBFD 4 B 1 0 8400;RES L,*,(IX*) CBDD 4 B 1 0 8500;RES L,*,(IY*) CBFD 4 B 1 0 8500;RET '' C9 1 N 1;RET C D8 1 N 1;RET M F8 1 N 1;RET NC D0 1 N 1;RET NZ C0 1 N 1;RET P F0 1 N 1;RET PE E8 1 N 1;RET PO E0 1 N 1;RET Z C8 1 N 1;RETI '' 4DED 2 N 1;RETN '' 45ED 2 N 1;RL (HL) 16CB 2 N 1;RL (IX*) CBDD 4 X 1 0 1600;RL (IY*) CBFD 4 X 1 0 1600;RL A 17CB 2 N 1;RL B 10CB 2 N 1;RL C 11CB 2 N 1;RL D 12CB 2 N 1;RL E 13CB 2 N 1;RL H 14CB 2 N 1;RL L 15CB 2 N 1;RLA '' 17 1 N 1;RL A,(IX*) CBDD 4 X 1 0 1700;RL A,(IY*) CBFD 4 X 1 0 1700;RL B,(IX*) CBDD 4 X 1 0 1000;RL B,(IY*) CBFD 4 X 1 0 1000;RL C,(IX*) CBDD 4 X 1 0 1100;RL C,(IY*) CBFD 4 X 1 0 1100;RL D,(IX*) CBDD 4 X 1 0 1200;RL D,(IY*) CBFD 4 X 1 0 1200;RL E,(IX*) CBDD 4 X 1 0 1300;RL E,(IY*) CBFD 4 X 1 0 1300;RL H,(IX*) CBDD 4 X 1 0 1400;RL H,(IY*) CBFD 4 X 1 0 1400;RL L,(IX*) CBDD 4 X 1 0 1500;RL L,(IY*) CBFD 4 X 1 0 1500;RLC (HL) 06CB 2 N 1;RLC (IX*) CBDD 4 X 1 0 0600;RLC (IY*) CBFD 4 X 1 0 0600;RLC A 07CB 2 N 1;RLC B 00CB 2 N 1;RLC C 01CB 2 N 1;RLC D 02CB 2 N 1;RLC E 03CB 2 N 1;RLC H 04CB 2 N 1;RLC L 05CB 2 N 1;RLCA '' 07 1 N 1;RLC A,(IX*) CBDD 4 X 1 0 0700;RLC A,(IY*) CBFD 4 X 1 0 0700;RLC B,(IX*) CBDD 4 X 1 0 0000;RLC B,(IY*) CBFD 4 X 1 0 0000;RLC C,(IX*) CBDD 4 X 1 0 0100;RLC C,(IY*) CBFD 4 X 1 0 0100;RLC D,(IX*) CBDD 4 X 1 0 0200;RLC D,(IY*) CBFD 4 X 1 0 0200;RLC E,(IX*) CBDD 4 X 1 0 0300;RLC E,(IY*) CBFD 4 X 1 0 0300;RLC H,(IX*) CBDD 4 X 1 0 0400;RLC H,(IY*) CBFD 4 X 1 0 0400;RLC L,(IX*) CBDD 4 X 1 0 0500;RLC L,(IY*) CBFD 4 X 1 0 0500;RLD '' 6FED 2 N 1;RR (HL) 1ECB 2 N 1;RR (IX*) CBDD 4 X 1 0 1E00;RR (IY*) CBFD 4 X 1 0 1E00 ;RR A 1FCB 2 N 1;RR B 18CB 2 N 1;RR C 19CB 2 N 1;RR D 1ACB 2 N 1;RR E 1BCB 2 N 1;RR H 1CCB 2 N 1;RR L 1DCB 2 N 1;RRA '' 1F 1 N 1;RR A,(IX*) CBDD 4 X 1 0 1F00;RR A,(IY*) CBFD 4 X 1 0 1F00;RR B,(IX*) CBDD 4 X 1 0 1800;RR B,(IY*) CBFD 4 X 1 0 1800;RR C,(IX*) CBDD 4 X 1 0 1900;RR C,(IY*) CBFD 4 X 1 0 1900;RR D,(IX*) CBDD 4 X 1 0 1A00;RR D,(IY*) CBFD 4 X 1 0 1A00;RR E,(IX*) CBDD 4 X 1 0 1B00;RR E,(IY*) CBFD 4 X 1 0 1B00;RR H,(IX*) CBDD 4 X 1 0 1C00;RR H,(IY*) CBFD 4 X 1 0 1C00;RR L,(IX*) CBDD 4 X 1 0 1D00;RR L,(IY*) CBFD 4 X 1 0 1D00;RRC (HL) 0ECB 2 N 1;RRC (IX*) CBDD 4 X 1 0 0E00;RRC (IY*) CBFD 4 X 1 0 0E00;RRC A 0FCB 2 N 1;RRC B 08CB 2 N 1;RRC C 09CB 2 N 1;RRC D 0ACB 2 N 1;RRC E 0BCB 2 N 1;RRC H 0CCB 2 N 1;RRC L 0DCB 2 N 1;RRCA '' 0F 1 N 1;RRC A,(IX*) CBDD 4 X 1 0 0F00;RRC A,(IY*) CBFD 4 X 1 0 0F00;RRC B,(IX*) CBDD 4 X 1 0 0800;RRC B,(IY*) CBFD 4 X 1 0 0800;RRC C,(IX*) CBDD 4 X 1 0 0900;RRC C,(IY*) CBFD 4 X 1 0 0900;RRC D,(IX*) CBDD 4 X 1 0 0A00;RRC D,(IY*) CBFD 4 X 1 0 0A00;RRC E,(IX*) CBDD 4 X 1 0 0B00;RRC E,(IY*) CBFD 4 X 1 0 0B00;RRC H,(IX*) CBDD 4 X 1 0 0C00;RRC H,(IY*) CBFD 4 X 1 0 0C00;RRC L,(IX*) CBDD 4 X 1 0 0D00;RRC L,(IY*) CBFD 4 X 1 0 0D00;RRD '' 67ED 2 N 1;RST 00H C7 1 N 1;RST 08H CF 1 N 1;RST 10H D7 1 N 1;RST 18H DF 1 N 1;RST 20H E7 1 N 1;RST 30H F7 1 N 1;RST 38H FF 1 N 1;SBC A,(HL) 9E 1 N 1;SBC A,(IX*) 9EDD 3 X 1;SBC A,(IY*) 9EFD 3 X 1;SBC A,A 9F 1 N 1;SBC A,B 98 1 N 1;SBC A,C 99 1 N 1;SBC A,D 9A 1 N 1;SBC A,E 9B 1 N 1;SBC A,H 9C 1 N 1;SBC A,IXH 9CDD 2 N 1;SBC A,IXL 9DDD 2 N 1;SBC A,IYH 9CFD 2 N 1;SBC A,IYL 9DFD 2 N 1;SBC A,L 9D 1 N 1;SBC HL,BC 42ED 2 N 1;SBC HL,DE 52ED 2 N 1;SBC HL,HL 62ED 2 N 1;SBC HL,SP 72ED 2 N 1;SBC A,* DE 2 N 1;SCF '' 37 1 N 1;SET *,(IX*) CBDD 4 B 1 0 C600;SET *,(IY*) CBFD 4 B 1 0 C600;SET A,*,(IY*) CBFD 4 B 1 0 C700;SET B,*,(IY*) CBFD 4 B 1 0 C000;SET C,*,(IY*) CBFD 4 B 1 0 C100;SET D,*,(IY*) CBFD 4 B 1 0 C200;SET E,*,(IY*) CBFD 4 B 1 0 C300;SET H,*,(IY*) CBFD 4 B 1 0 C400;SET L,*,(IY*) CBFD 4 B 1 0 C500;SET A,*,(IX*) CBDD 4 B 1 0 C700;SET B,*,(IX*) CBDD 4 B 1 0 C000;SET C,*,(IX*) CBDD 4 B 1 0 C100;SET D,*,(IX*) CBDD 4 B 1 0 C200;SET E,*,(IX*) CBDD 4 B 1 0 C300;SET H,*,(IX*) CBDD 4 B 1 0 C400;SET L,*,(IX*) CBDD 4 B 1 0 C500;SLA (HL) 26CB 2 N 1;SLA (IX*) CBDD 4 X 1 0 2600;SLA (IY*) CBFD 4 X 1 0 2600;SLA A 27CB 2 N 1;SLA B 20CB 2 N 1;SLA C 21CB 2 N 1;SLA D 22CB 2 N 1;SLA E 23CB 2 N 1;SLA H 24CB 2 N 1;SLA L 25CB 2 N 1;SLA A,(IX*) CBDD 4 X 1 0 2700;SLA A,(IY*) CBFD 4 X 1 0 2700;SLA B,(IX*) CBDD 4 X 1 0 2000;SLA B,(IY*) CBFD 4 X 1 0 2000;SLA C,(IX*) CBDD 4 X 1 0 2100;SLA C,(IY*) CBFD 4 X 1 0 2100;SLA D,(IX*) CBDD 4 X 1 0 2200;SLA D,(IY*) CBFD 4 X 1 0 2200;SLA E,(IX*) CBDD 4 X 1 0 2300;SLA E,(IY*) CBFD 4 X 1 0 2300;SLA H,(IX*) CBDD 4 X 1 0 2400;SLA H,(IY*) CBFD 4 X 1 0 2400;SLA L,(IX*) CBDD 4 X 1 0 2500;SLA L,(IY*) CBFD 4 X 1 0 2500;SL1 B 30CB 2 N 1;SL1 C 31CB 2 N 1;SL1 D 32CB 2 N 1;SL1 E 33CB 2 N 1;SL1 H 34CB 2 N 1;SL1 L 35CB 2 N 1;SL1 (HL) 36CB 2 N 1;SL1 A 37CB 2 N 1;SL1 (IX*) CBDD 4 X 1 0 3600;SL1 (IY*) CBFD 4 X 1 0 3600;SL1 A,(IX*) CBDD 4 X 1 0 3700;SL1 A,(IY*) CBFD 4 X 1 0 3700;SL1 B,(IX*) CBDD 4 X 1 0 3000;SL1 B,(IY*) CBFD 4 X 1 0 3000;SL1 C,(IX*) CBDD 4 X 1 0 3100;SL1 C,(IY*) CBFD 4 X 1 0 3100;SL1 D,(IX*) CBDD 4 X 1 0 3200;SL1 D,(IY*) CBFD 4 X 1 0 3200;SL1 E,(IX*) CBDD 4 X 1 0 3300;SL1 E,(IY*) CBFD 4 X 1 0 3300;SL1 H,(IX*) CBDD 4 X 1 0 3400;SL1 H,(IY*) CBFD 4 X 1 0 3400;SL1 L,(IX*) CBDD 4 X 1 0 3500;SL1 L,(IY*) CBFD 4 X 1 0 3500;SLL (HL) 36CB 2 N 1;SLL (IX*) CBDD 4 X 1 0 3600;SLL (IY*) CBFD 4 X 1 0 3600;SLL A 37CB 2 N 1;SLL B 30CB 2 N 1;SLL C 31CB 2 N 1;SLL D 32CB 2 N 1;SLL E 33CB 2 N 1;SLL H 34CB 2 N 1;SLL L 35CB 2 N 1;SLL A,(IX*) CBDD 4 X 1 0 3700;SLL A,(IY*) CBFD 4 X 1 0 3700;SLL B,(IX*) CBDD 4 X 1 0 3000;SLL B,(IY*) CBFD 4 X 1 0 3000;SLL C,(IX*) CBDD 4 X 1 0 3100;SLL C,(IY*) CBFD 4 X 1 0 3100;SLL D,(IX*) CBDD 4 X 1 0 3200;SLL D,(IY*) CBFD 4 X 1 0 3200;SLL E,(IX*) CBDD 4 X 1 0 3300;SLL E,(IY*) CBFD 4 X 1 0 3300;SLL H,(IX*) CBDD 4 X 1 0 3400;SLL H,(IY*) CBFD 4 X 1 0 3400;SLL L,(IX*) CBDD 4 X 1 0 3500;SLL L,(IY*) CBFD 4 X 1 0 3500;SRA (HL) 2ECB 2 N 1;SRA (IX*) CBDD 4 X 1 0 2E00;SRA (IY*) CBFD 4 X 1 0 2E00;SRA A 2FCB 2 N 1;SRA B 28CB 2 N 1;SRA C 29CB 2 N 1;SRA D 2ACB 2 N 1;SRA E 2BCB 2 N 1;SRA H 2CCB 2 N 1;SRA L 2DCB 2 N 1;SRA A,(IX*) CBDD 4 X 1 0 2F00;SRA A,(IY*) CBFD 4 X 1 0 2F00;SRA B,(IX*) CBDD 4 X 1 0 2800;SRA B,(IY*) CBFD 4 X 1 0 2800;SRA C,(IX*) CBDD 4 X 1 0 2900;SRA C,(IY*) CBFD 4 X 1 0 2900;SRA D,(IX*) CBDD 4 X 1 0 2A00;SRA D,(IY*) CBFD 4 X 1 0 2A00;SRA E,(IX*) CBDD 4 X 1 0 2B00;SRA E,(IY*) CBFD 4 X 1 0 2B00;SRA H,(IX*) CBDD 4 X 1 0 2C00;SRA H,(IY*) CBFD 4 X 1 0 2C00;SRA L,(IX*) CBDD 4 X 1 0 2D00;SRA L,(IY*) CBFD 4 X 1 0 2D00;SRL (HL) 3ECB 2 N 1;SRL (IX*) CBDD 4 X 1 0 3E00;SRL (IY*) CBFD 4 X 1 0 3E00;SRL A 3FCB 2 N 1;SRL B 38CB 2 N 1;SRL C 39CB 2 N 1;SRL D 3ACB 2 N 1;SRL E 3BCB 2 N 1;SRL H 3CCB 2 N 1;SRL L 3DCB 2 N 1;SRL A,(IX*) CBDD 4 X 1 0 3F00;SRL A,(IY*) CBFD 4 X 1 0 3F00;SRL B,(IX*) CBDD 4 X 1 0 3800;SRL B,(IY*) CBFD 4 X 1 0 3800;SRL C,(IX*) CBDD 4 X 1 0 3900;SRL C,(IY*) CBFD 4 X 1 0 3900;SRL D,(IX*) CBDD 4 X 1 0 3A00;SRL D,(IY*) CBFD 4 X 1 0 3A00;SRL E,(IX*) CBDD 4 X 1 0 3B00;SRL E,(IY*) CBFD 4 X 1 0 3B00;SRL H,(IX*) CBDD 4 X 1 0 3C00;SRL H,(IY*) CBFD 4 X 1 0 3C00;SRL L,(IX*) CBDD 4 X 1 0 3D00;SRL L,(IY*) CBFD 4 X 1 0 3D00;SUB (HL) 96 1 N 1;SUB (IX*) 96DD 3 X 1;SUB (IY*) 96FD 3 X 1;SUB A 97 1 N 1;SUB B 90 1 N 1;SUB C 91 1 N 1;SUB D 92 1 N 1;SUB E 93 1 N 1;SUB H 94 1 N 1;SUB IXH 94DD 2 N 1;SUB IXL 95DD 2 N 1;SUB IYH 94FD 2 N 1;SUB IYL 95FD 2 N 1;SUB L 95 1 N 1;SUB * D6 2 N 1;XOR (HL) AE 1 N 1;XOR (IX*) AEDD 3 X 1;XOR (IY*) AEFD 3 X 1;XOR A AF 1 N 1;XOR B A8 1 N 1;XOR C A9 1 N 1;XOR D AA 1 N 1;XOR E AB 1 N 1;XOR H AC 1 N 1;XOR IXH ACDD 2 N 1;XOR IXL ADDD 2 N 1;XOR IYH ACFD 2 N 1;XOR IYL ADFD 2 N 1;XOR L AD 1 N 1;XOR * EE 2 N 1;BIT *,(HL) CB 2 B 1 0 46;BIT *,A CB 2 B 1 0 47;BIT *,B CB 2 B 1 0 40;BIT *,C CB 2 B 1 0 41;BIT *,D CB 2 B 1 0 42;BIT *,E CB 2 B 1 0 43;BIT *,H CB 2 B 1 0 44;BIT *,L CB 2 B 1 0 45;RES *,(HL) CB 2 B 1 0 86;RES *,A CB 2 B 1 0 87;RES *,B CB 2 B 1 0 80;RES *,C CB 2 B 1 0 81;RES *,D CB 2 B 1 0 82;RES *,E CB 2 B 1 0 83;RES *,H CB 2 B 1 0 84;RES *,L CB 2 B 1 0 85;SET *,(HL) CB 2 B 1 0 C6;SET *,A CB 2 B 1 0 C7;SET *,B CB 2 B 1 0 C0;SET *,C CB 2 B 1 0 C1;SET *,D CB 2 B 1 0 C2;SET *,E CB 2 B 1 0 C3;SET *,H CB 2 B 1 0 C4;SET *,L CB 2 B 1 0 C5".split(";"),
                d = 0; d < c.length; d++) {
            var f = c[d].split(" ");
            f[0] = String.prototype.toLowerCase.apply(f[0]);
            f[1] = String.prototype.toLowerCase.apply(f[1]);
            var e = [],
                g = 0;
            e[g++] = parseInt(f[2].substring(f[2].length - 2), 16);
            2 < f[2].length && (e[g++] = parseInt(f[2].substring(0, 2), 16));
            8 <= f.length && (e[g++] = parseInt(f[7].substring(f[7].length - 2), 16), 2 < f[7].length && (e[g++] = parseInt(f[7].substring(0, 2), 16)));
            g = parseInt(f[3]) - e.length;
            if (null == this.table[e[0]] && 1 < e.length) this.table[e[0]] = [];
            else if (1 == e.length) {
                this.table[e[0]] = [parseInt(f[3]),
                    f[0], f[1], f[4], g
                ];
                continue
            }
            if (null == this.table[e[0]][e[1]] && 2 < e.length) this.table[e[0]][e[1]] = [];
            else if (2 == e.length) {
                this.table[e[0]][e[1]] = [parseInt(f[3]), f[0], f[1], f[4], g];
                continue
            }
            this.table[e[0]][e[1]][e[3]] = [parseInt(f[3]), f[0], f[1], f[4], g, e[2]]
        }
        this.table_loaded = 1
    };
    this.disas_scroll_up = function() {
        this.disas_base -= 192;
        0 > this.disas_base && (this.disas_base = 0);
        this.debug_popfields()
    };
    this.disas_scroll_down = function() {
        this.disas_base += 192;
        65280 < this.disas_base && (this.disas_base = 65280);
        this.debug_popfields()
    };
    this.disas_scroll_pc = function() {
        this.disas_base = z8.r2[Regs2_PC];
        this.debug_popfields()
    };
    this.disas_scroll_goto = function(c) {
        this.disas_base = parseInt(document.getElementById(c).value, 16);
        65280 < this.disas_base && (this.disas_base = 65280);
        0 > this.disas_base && (this.disas_base = 0);
        this.debug_popfields()
    };
    this.mem_scroll_up = function() {
        this.mem_base -= this.mem_rows * this.mem_step / 4 * 3;
        0 > this.mem_base && (this.mem_base = 0);
        this.debug_popfields()
    };
    this.mem_scroll_down = function() {
        this.mem_base += this.mem_rows * this.mem_step /
            4 * 3;
        this.mem_base > 65536 - this.mem_rows * this.mem_step && (this.mem_base = 65536 - this.mem_rows * this.mem_step);
        this.debug_popfields()
    };
    this.mem_scroll_pc = function() {
        this.mem_base = z8.r2[Regs2_PC];
        this.debug_popfields()
    };
    this.mem_scroll_goto = function(c) {
        this.mem_base = parseInt(document.getElementById(c).value, 16);
        this.mem_base > 65536 - this.mem_rows * this.mem_step && (this.mem_base = 65536 - this.mem_rows * this.mem_step);
        0 > this.mem_base && (this.mem_base = 0);
        this.debug_popfields()
    }
}

function debug_register_validate() {
    var c = this.value,
        d = debug.toggle_fields[this.id],
        f = !1;
    if (c && "r" == d[0] && 4 == c.length) {
        var e = parseInt(c.substring(0, 2), 16),
            c = parseInt(c.substring(2, 4), 16);
        0 <= e && 255 >= e && 0 <= c && 255 >= c && (eval("z8.r[" + d[3].toString() + "] = " + e.toString()), eval("z8.r[" + d[4].toString() + "] = " + c.toString()), f = !0)
    } else if (c && "rr" == d[0] && 4 == c.length) e = parseInt(c, 16), 0 <= e && 65535 >= e && (eval("z8.r2[" + d[2] + "] = " + e.toString()), f = !0);
    else if (c && "b" == d[0] && 3 == c.length) {
        var e = parseInt(c, 16),
            g = i6.type ==
            CTyE.CTyQ ? 64 : i6.type == CTyE.CTyP ? 16 : i6.type == CTyE.CALC_TYPE_82 ? 8 : i6.subtype == CTyE.CTySCSE ? 256 : 128,
            l = i6.type == CTyE.CTyQ || i6.type == CTyE.CTyR || i6.type == CTyE.CTyS || i6.type == CTyE.CTyT || i6.subtype == CTyE.CTySCSE ? 7 : 1,
            h = i6.subtype == CTyE.CTySCSE ? 3 : 2;
        c.length == h && e == (e & g - 1) && 0 <= e ? (i6.page[d[1]] = -1 - (e << 14), f = !0) : c.length == h && g == (e & g) && (e & ~g) <= l && 0 <= e && (i6.page[d[1]] = (e & l) << 14, f = !0)
    }
    f && d && (this.className = "dbg_button_valid", setTimeout(debug_register_resetstyle, 500, this), debug.debug_popfields())
}

function debug_mem_validate() {
    var c = document.getElementById("mem_value"),
        d = mem_value.value;
    if (!(null == debug || 0 > debug.mem_selected)) {
        var f = !1;
        if (d) {
            var e = parseInt(d, 16);
            0 <= e && 255 >= e && (f = !0)
        }
        f && (c.className = "dbg_button_valid", i6_write_normal(debug.mem_selected, e), setTimeout(debug_register_resetstyle, 500, c), debug.debug_popmem())
    }
}

function debug_register_resetstyle(c) {
    "dbg_button_valid" == c.className && (c.className = "dbg_button")
}
var debug = new Debugger;

function debug_step() {
    debug.debug_step()
}

function debug_stepover() {
    debug.debug_stepover()
}

function debug_popfields() {
    debug.debug_popfields()
}

function debug_imbreak_set() {
    debug.debug_imbreak_set()
}

function debug_clearbreak() {
    debug.debug_clearbreak()
}

function debug_setbreak(c) {
    debug.debug_setbreak(c)
}

function debug_mem_click(c) {
    debug.debug_mem_click(c)
}

function debug_mem_hide(c) {
    debug.debug_mem_hide(c)
}

function debug_srwatch(c) {
    debug.debug_srwatch(c)
}

function disas_scroll_up() {
    debug.disas_scroll_up()
}

function disas_scroll_down() {
    debug.disas_scroll_down()
}

function disas_scroll_goto(c) {
    debug.disas_scroll_goto(c)
}

function disas_scroll_pc() {
    debug.disas_scroll_pc()
}

function mem_scroll_up() {
    debug.mem_scroll_up()
}

function mem_scroll_down() {
    debug.mem_scroll_down()
}

function mem_scroll_goto(c) {
    debug.mem_scroll_goto(c)
}

function mem_scroll_pc() {
    debug.mem_scroll_pc()
};
LZWEncoder = function() {
    var c = {},
        d, f, e, g, l, h, m, n, q, p, r = [],
        u = [],
        z = 0,
        L = !1,
        U, O, W, y = 0,
        I = 0,
        w = [0, 1, 3, 7, 15, 31, 63, 127, 255, 511, 1023, 2047, 4095, 8191, 16383, 32767, 65535],
        t, C = [],
        J = c.LZWEncoder = function(c, l, m, n, p) {
            d = c;
            f = l;
            e = m;
            g = Math.max(2, n);
            h = null == p ? 0 : p
        },
        x = function(c) {
            for (var d = 0; d < c; ++d) r[d] = -1
        },
        A = c.compress = function(c, d) {
            var e, f, g, h, l, m;
            U = c;
            L = !1;
            q = U;
            p = (1 << q) - 1;
            O = 1 << c - 1;
            W = O + 1;
            z = O + 2;
            t = 0;
            h = D();
            m = 0;
            for (e = 5003; 65536 > e; e *= 2) ++m;
            m = 8 - m;
            x(5003);
            R(O, d);
            a: for (; - 1 != (g = D());)
                if (e = (g << 12) + h, f = g << m ^ h, r[f] == e) h = u[f];
                else {
                    if (0 <=
                        r[f]) {
                        l = 5003 - f;
                        0 == f && (l = 1);
                        do
                            if (0 > (f -= l) && (f += 5003), r[f] == e) {
                                h = u[f];
                                continue a
                            } while (0 <= r[f])
                    }
                    R(h, d);
                    h = g;
                    4096 > z ? (u[f] = z++, r[f] = e) : (e = d, x(5003), z = O + 2, L = !0, R(O, e))
                } R(h, d);
            R(W, d)
        };
    c.encode = function(c) {
        c.writeByte(g);
        l = d * f;
        m = d;
        n = 0;
        A(g + 1, c);
        c.writeByte(0)
    };
    var B = function(c) {
            0 < t && (c.writeByte(t), c.writeBytes(C, 0, t), t = 0)
        },
        D = function() {
            if (0 == l) return -1;
            --l;
            --m;
            var c = e[n++];
            m || (n += h, m = d);
            return c & 255
        },
        R = function(c, d) {
            y &= w[I];
            y = 0 < I ? y | c << I : c;
            for (I += q; 8 <= I;) {
                var e = y & 255,
                    f = d;
                C[t++] = e;
                254 <= t && B(f);
                y >>= 8;
                I -= 8
            }
            if (z >
                p || L) L ? (p = (1 << (q = U)) - 1, L = !1) : (++q, p = 12 == q ? 4096 : (1 << q) - 1);
            if (c == W) {
                for (; 0 < I;) e = y & 255, f = d, C[t++] = e, 254 <= t && B(f), y >>= 8, I -= 8;
                B(d)
            }
        };
    J.apply(this, arguments);
    return c
};
NeuQuant = function() {
    var c = {},
        d = 256,
        f = d - 1,
        e = d >> 3,
        g = 64 * e,
        l, h, m, n, q, p = [],
        r = [],
        u = [],
        z = [],
        L = c.NeuQuant = function(c, l, p, y) {
            h = c;
            m = l;
            n = p;
            null != y && (d = y, f = d - 1, e = d >> 3, g = 64 * e);
            q = Array(d);
            for (c = 0; c < d; c++) q[c] = Array(4), l = q[c], l[0] = l[1] = l[2] = (c << 12) / d, u[c] = 65536 / d, r[c] = 0
        };
    c.map = function(c, e, f) {
        var g, h, l, m, n, r, u;
        n = 1E3;
        u = -1;
        g = p[e];
        for (h = g - 1; g < d || 0 <= h;) g < d && (r = q[g], l = r[1] - e, l >= n ? g = d : (g++, 0 > l && (l = -l), m = r[0] - c, 0 > m && (m = -m), l += m, l < n && (m = r[2] - f, 0 > m && (m = -m), l += m, l < n && (n = l, u = r[3])))), 0 <= h && (r = q[h], l = e - r[1], l >= n ? h = -1 : (h--,
            0 > l && (l = -l), m = r[0] - c, 0 > m && (m = -m), l += m, l < n && (m = r[2] - f, 0 > m && (m = -m), l += m, l < n && (n = l, u = r[3]))));
        return u
    };
    c.process = function() {
        var c, e, L, y, I, w, t, C, J, x, A, B, D, R;
        1509 > m && (n = 1);
        l = 30 + (n - 1) / 3;
        B = h;
        D = 0;
        R = m;
        A = m / (3 * n);
        x = A / 100;
        C = 1024;
        w = g;
        t = w >> 6;
        1 >= t && (t = 0);
        for (c = 0; c < t; c++) z[c] = 256 * (t * t - c * c) / (t * t) * C;
        J = 1509 > m ? 3 : 0 != m % 499 ? 1497 : 0 != m % 491 ? 1473 : 0 != m % 487 ? 1461 : 1509;
        for (c = 0; c < A;) {
            L = (B[D + 0] & 255) << 4;
            y = (B[D + 1] & 255) << 4;
            I = (B[D + 2] & 255) << 4;
            e = L;
            for (var P = y, V = I, F = void 0, G = void 0, M = void 0, H = G = G = void 0, S = void 0, X = void 0, v = void 0, E = void 0,
                    v = X = 2147483647, S = H = -1, F = 0; F < d; F++) E = q[F], G = E[0] - e, 0 > G && (G = -G), M = E[1] - P, 0 > M && (M = -M), G += M, M = E[2] - V, 0 > M && (M = -M), G += M, G < X && (X = G, H = F), G -= r[F] >> 12, G < v && (v = G, S = F), G = u[F] >> 10, u[F] -= G, r[F] += G << 10;
            u[H] += 64;
            r[H] -= 65536;
            e = S;
            P = C;
            V = y;
            F = I;
            H = q[e];
            H[0] -= P * (H[0] - L) / 1024;
            H[1] -= P * (H[1] - V) / 1024;
            H[2] -= P * (H[2] - F) / 1024;
            if (0 != t)
                for (v = X = S = H = F = V = P = void 0, F = e - t, -1 > F && (F = -1), H = e + t, H > d && (H = d), P = e + 1, V = e - 1, X = 1; P < H || V > F;) {
                    S = z[X++];
                    if (P < H) {
                        v = q[P++];
                        try {
                            v[0] -= S * (v[0] - L) / 262144, v[1] -= S * (v[1] - y) / 262144, v[2] -= S * (v[2] - I) / 262144
                        } catch (N) {}
                    }
                    if (V >
                        F) {
                        v = q[V--];
                        try {
                            v[0] -= S * (v[0] - L) / 262144, v[1] -= S * (v[1] - y) / 262144, v[2] -= S * (v[2] - I) / 262144
                        } catch (Q) {}
                    }
                }
            D += J;
            D >= R && (D -= m);
            c++;
            0 == x && (x = 1);
            if (0 == c % x)
                for (C -= C / l, w -= w / 30, t = w >> 6, 1 >= t && (t = 0), e = 0; e < t; e++) z[e] = 256 * (t * t - e * e) / (t * t) * C
        }
        for (c = 0; c < d; c++) q[c][0] >>= 4, q[c][1] >>= 4, q[c][2] >>= 4, q[c][3] = c;
        for (c = B = A = 0; c < d; c++) {
            J = q[c];
            t = c;
            C = J[1];
            for (w = c + 1; w < d; w++) x = q[w], x[1] < C && (t = w, C = x[1]);
            x = q[t];
            c != t && (w = x[0], x[0] = J[0], J[0] = w, w = x[1], x[1] = J[1], J[1] = w, w = x[2], x[2] = J[2], J[2] = w, w = x[3], x[3] = J[3], J[3] = w);
            if (C != A) {
                p[A] = B + c >> 1;
                for (w =
                    A + 1; w < C; w++) p[w] = c;
                A = C;
                B = c
            }
        }
        p[A] = B + f >> 1;
        for (w = A + 1; 256 > w; w++) p[w] = f;
        c = [];
        w = Array(d);
        for (t = 0; t < d; t++) w[q[t][3]] = t;
        for (C = t = 0; C < d; C++) J = w[C], c[t++] = q[J][0], c[t++] = q[J][1], c[t++] = q[J][2];
        return c
    };
    L.apply(this, arguments);
    return c
};
GIFEncoder = function() {
    function c() {
        this.bin = []
    }
    for (var d = 0, f = {}; 256 > d; d++) f[d] = String.fromCharCode(d);
    c.prototype.getData = function() {
        for (var c = "", d = this.bin.length, e = 0; e < d; e++) c += f[this.bin[e]];
        return c
    };
    c.prototype.getCursor = function() {
        return this.bin.length
    };
    c.prototype.writeByte = function(c) {
        this.bin.push(c)
    };
    c.prototype.writeByteAt = function(c, d) {
        this.bin[d] = c
    };
    c.prototype.writeUTFBytes = function(c) {
        for (var d = c.length, e = 0; e < d; e++) this.writeByte(c.charCodeAt(e))
    };
    c.prototype.writeBytes = function(c,
        d, e) {
        e = e || c.length;
        for (d = d || 0; d < e; d++) this.writeByte(c[d])
    };
    var d = {},
        e, g, l = null,
        h, m = -1,
        n = 0,
        q = !1,
        p, r, u, z, L, U = 8,
        O, W = [],
        y = 7,
        I = -1,
        w = !0,
        t = -1,
        C = !1,
        J = 10,
        x = 0,
        A = 0,
        B = 0,
        D = 0,
        R = !1;
    d.setPalette = function(c, d) {
        R = !0;
        O = c;
        U = d;
        y = d - 1;
        for (var e = 0; e < 1 << 1 + y; e++) W[e] = !0
    };
    d.setColorDepth = function(c) {
        U = c;
        y = c - 1
    };
    d.setDelay = function(c) {
        n = Math.round(c / 10)
    };
    d.setDispose = function(c) {
        0 <= c && (I = c)
    };
    d.setRepeat = function(c) {
        0 <= c && (m = c)
    };
    d.setTransparent = function(c) {
        l = c
    };
    d.addFrame = function(c, d) {
        if (null == c || !q || null == p) return !1;
        d ? r = c :
            (r = c.getImageData(0, 0, c.canvas.width, c.canvas.height).data, C || V(c.canvas.width, c.canvas.height));
        var f = e,
            v = g;
        u = [];
        for (var E = r, N = 0, Q = 0; Q < v; Q++)
            for (var K = 0; K < f; K++) {
                var T = Q * f * 4 + 4 * K;
                u[N++] = E[T];
                u[N++] = E[T + 1];
                u[N++] = E[T + 2]
            }
        if (R)
            for (f = u.length / 3, z = [], v = 0, x = f, A = -1, B = f, D = -1, E = 0; E < f; E++) N = u[v++] << 16 | u[v++] << 8 | u[v++], N = F(N), w || N != L[E] ? (L[E] = N, Q = E % e, K = (E - Q) / e, Q < x && (x = Q), Q > A && (A = Q), K < B && (B = K), K > D && (D = K)) : N = h, z[E] = N;
        else
            for (v = u.length, f = v / 3, z = [], v = new NeuQuant(u, v, J, 1 << 1 + y), O = v.process(), E = 0, x = f, A = -1, B = f, D = -1, null != l && v.map(l >> 16 & 255, l >> 8 & 255, l & 255), N = 0; N < f; N++) {
                var K = u[E++] & 255,
                    T = u[E++] & 255,
                    P = u[E++] & 255,
                    Q = v.map(K, T, P),
                    K = K << 16 | T << 8 | P;
                w || K != L[N] || Q == h ? (L[N] = K, K = N % e, T = (N - K) / e, K < x && (x = K), K > A && (A = K), T < B && (B = T), T > D && (D = T)) : Q = h;
                W[Q] = !0;
                z[N] = Q
            }
        u = null;
        null != l && (h = F(l));
        if (w) {
            f = O.length / 3;
            v = 0;
            do v++, f /= 2; while (1 <= f);
            U = v;
            y = U - 1;
            M(e);
            M(g);
            p.writeByte(U - 1 << 4 | 128 | y);
            p.writeByte(0);
            p.writeByte(0);
            G();
            0 <= m && (p.writeByte(33), p.writeByte(255), p.writeByte(11), p.writeUTFBytes("NETSCAPE2.0"), p.writeByte(3), p.writeByte(1),
                M(m), p.writeByte(0))
        }
        f = !R;
        p.writeByte(33);
        p.writeByte(249);
        p.writeByte(4);
        null == l ? E = v = 0 : (v = 1, E = 2);
        0 <= I && (E = I & 7);
        p.writeByte(E << 2 | 0 | v);
        t = p.getCursor();
        M(n);
        p.writeByte(h);
        p.writeByte(0);
        p.writeByte(44);
        if (x > A || B > D) x = B = A = D = 0;
        M(x);
        M(B);
        M(A - x + 1);
        M(D - B + 1);
        w ? p.writeByte(0) : p.writeByte(f << 7 | 0 | y);
        !w && f && G();
        (new LZWEncoder(A - x + 1, D - B + 1, z.slice(x + e * B, 1 + A + e * D), U, e - (A - x + 1))).encode(p);
        w = !1;
        return !0
    };
    d.finish = function() {
        if (!q) return !1;
        var c = !0;
        q = !1;
        try {
            p.writeByte(59)
        } catch (d) {
            c = !1
        }
        return c
    };
    var P = function() {
        h =
            0;
        z = u = r = null;
        L = [];
        R || (O = null);
        w = !0
    };
    d.setFrameRate = function(c) {
        15 != c && (n = Math.round(100 / c))
    };
    d.setQuality = function(c) {
        1 > c && (c = 1);
        J = c
    };
    var V = d.setSize = function(c, d) {
        if (!q || w) e = c, g = d, 1 > e && (e = 192), 1 > g && (g = 128), C = !0
    };
    d.start = function() {
        P();
        var d = !0;
        p = new c;
        try {
            p.writeUTFBytes("GIF89a")
        } catch (e) {
            d = !1
        }
        return q = d
    };
    d.cont = function() {
        P();
        p = new c;
        return q = !0
    };
    var F = function(c) {
        if (null == O) return -1;
        var d = (c & 16711680) >> 16,
            e = (c & 65280) >> 8;
        c &= 255;
        for (var f = 0, g = 16777216, l = O.length, h = 0; h < l;) {
            var m = d - (O[h++] & 255),
                n =
                e - (O[h++] & 255),
                p = c - (O[h] & 255),
                m = m * m + n * n + p * p,
                n = h / 3;
            W[n] && m < g && (g = m, f = n);
            h++
        }
        return f
    };
    d.setPrevFrameDelay = function(c) {
        c /= 10;
        var d = t;
        p.writeByteAt(c & 255, d);
        p.writeByteAt(c >> 8 & 255, d + 1)
    };
    var G = function() {
            p.writeBytes(O);
            for (var c = 3 * (1 << y + 1) - O.length, d = 0; d < c; d++) p.writeByte(0)
        },
        M = function(c) {
            p.writeByte(c & 255);
            p.writeByte(c >> 8 & 255)
        };
    d.stream = function() {
        return p
    };
    d.setProperties = function(c, d) {
        q = c;
        w = d
    };
    return d
};

function lzw_encode(c, d, f, e) {
    f = void 0 !== f ? f : {};
    e = void 0 !== e ? e : 0;
    void 0 === f.complete && (f.dict = {}, f.out = "", f.currChar = "", f.phrase = c.charAt(0), f.code = 256, f.chunk = "", f.i = f.j = 1, f.complete = !1);
    for (; f.i < d; f.i++, f.j++) {
        if (0 == --e) return "";
        1 == f.i % 65536 && (f.chunk = c.substring(f.i, f.i + 65536 > d ? d : f.i + 65536), f.j = 0);
        f.currChar = f.chunk.charAt(f.j);
        null != f.dict[f.phrase + f.currChar] ? f.phrase += f.currChar : (f.out += 1 < f.phrase.length ? f.dict[f.phrase] : f.phrase, f.dict[f.phrase + f.currChar] = String.fromCharCode(f.code), f.code++,
            f.phrase = f.currChar, 4095 < f.code && (f.code = 256, f.dict = {}))
    }
    f.out += 1 < f.phrase.length && null != f.dict[f.phrase] ? f.dict[f.phrase] : f.phrase;
    f.complete = !0;
    return f.out
}

function lzw_unicode2bytestr(c) {
    var d = "";
    for (i = 0; i < c.length; i++) d += lzw_num2str(c.charCodeAt(i));
    return d
}

function lzw_num2str(c) {
    if (128 > c) return String.fromCharCode(c);
    if (2048 > c) return String.fromCharCode(192 | c >> 6) + String.fromCharCode(128 | c & 63);
    if (65536 > c) return String.fromCharCode(224 | c >> 12) + String.fromCharCode(128 | c >> 6 & 63) + String.fromCharCode(128 | c & 63);
    if (2097152 > c) return String.fromCharCode(240 | c >> 18) + String.fromCharCode(128 | c >> 12 & 63) + String.fromCharCode(128 | c >> 6 & 63) + String.fromCharCode(128 | c & 63);
    if (67108864 > c) return String.fromCharCode(248 | c >> 24) + String.fromCharCode(128 | c >> 18 & 63) + String.fromCharCode(128 |
        c >> 12 & 63) + String.fromCharCode(128 | c >> 6 & 63) + String.fromCharCode(128 | c & 63);
    alert("Error: overflow")
}

function lzw_bytestr2unicode(c) {
    for (var d = 0, f = ""; d < c.length; d++) {
        var e = c.charCodeAt(d);
        if (128 > e) f += String.fromCharCode(e);
        else if (194 <= e && 224 > e) var g = c.charCodeAt(++d),
            f = f + String.fromCharCode(((e & 31) << 6) + (g & 63));
        else if (224 <= e && 240 > e) var g = c.charCodeAt(++d),
            l = c.charCodeAt(++d),
            f = f + String.fromCharCode(((e & 255) << 12) + ((g & 63) << 6) + (l & 63));
        else if (240 <= e && 245 > e) var g = c.charCodeAt(++d),
            l = c.charCodeAt(++d),
            h = c.charCodeAt(++d),
            e = ((e & 7) << 18) + ((g & 63) << 12) + ((l & 63) << 6) + (h & 63),
            e = e - 65536,
            f = f + String.fromCharCode((e >>
                10) + 55296, (e & 1023) + 56320)
    }
    return f
}

function lzw_decode(c) {
    for (var d = {}, f = c.substring(0, 1), e = f, g = f, l = 256, h, m = 1; m < c.length; m++) h = c.charCodeAt(m), h = 256 > h ? c.charAt(m) : d[h] ? d[h] : e + f, g += h, f = h.charAt(0), d[l] = e + f, l++, 4095 < l && (l = 256, d = {}), e = h;
    return g
};
/*
 base32k.js / https://github.com/simonratner/base32k
 Copyright (C) 2012 Simon Ratner, distributed under the MIT license. */
(function(c) {
    var d = function(c, d) {
            return function(e) {
                "number" == typeof e && (e = [e]);
                for (var f = [], n = 0, q = e.length; n < q; n += d) f.push(c.apply(null, e.slice(n, n + d)));
                return f.join("")
            }
        }(String.fromCharCode, 2048),
        f = function(c) {
            if (13312 <= c && 19893 >= c) return c - 13312;
            if (19968 <= c && 40869 >= c) return c - 13386;
            if (57344 <= c && 62627 >= c) return c - 29860;
            throw "Invalid encoding U+" + ("000" + c.toString(16).toUpperCase()).slice(-4);
        },
        e = function(c) {
            return 6582 > c ? 13312 + c : 27484 > c ? 19968 + c - 6582 : 57344 + c - 27484
        };
    c.encode = function(c) {
        for (var f =
                32 * c.length, h = [], m, n, q = 0; q < f; q += 15) m = q / 32 | 0, n = q % 32, m = 17 >= n ? 32767 & c[m] >>> 17 - n : 32767 & c[m] << n - 17 | 32767 & c[m + 1] >>> 49 - n, h.push(e(m));
        h.push(9231 - (q - f));
        return d(h)
    };
    c.encodeBytes = function(c) {
        for (var f = 8 * c.length, h = "string" == typeof c ? function(d) {
                return c.charCodeAt(d)
            } : function(d) {
                return c[d]
            }, m = [], n, q, p, r = 0; r < f; r += 15) q = r / 8 | 0, p = r % 8, n = h(q) << 7 + p, n = 0 == p ? n | h(q + 1) >>> 1 : n | h(q + 1) << p - 1 | h(q + 2) >>> 9 - p, m.push(e(n & 32767));
        m.push(9231 - (r - f));
        return d(m)
    };
    c.decode = function(c) {
        var d = c.charCodeAt(c.length - 1) - 9216;
        if (1 > d ||
            15 < d) throw "Invalid encoding";
        for (var e = [], m, n, q, p = 0, r = c.length - 1; p < r; p++) m = f(c.charCodeAt(p)), n = 15 * p / 32 | 0, q = 15 * p % 32, 17 >= q ? e[n] |= m << 17 - q : (e[n] |= m >>> q - 17, e[n + 1] |= m << 49 - q);
        17 >= q ? e[n] &= 4294967295 << 32 - d - q : d > 32 - q ? e[n + 1] &= 4294967295 << 64 - d - q : (e[n] &= 4294967295 << 32 - d - q, e.length--);
        return e
    };
    c.decodeAsString = function(e) {
        return d(c.decode(e))
    };
    c.decodeBytes = function(c) {
        var e = c.charCodeAt(c.length - 1) - 9216;
        if (1 > e || 15 < e) throw "Invalid encoding";
        for (var h = [], m, n, q, p = 0, r = c.length - 1; p < r; p++) m = f(c.charCodeAt(p)), n = 15 *
            p / 8 | 0, q = 15 * p % 8, h[n] |= 255 & m >>> 7 + q, 0 == q ? h[n + 1] |= 255 & m << 1 : (h[n + 1] |= 255 & m >>> q - 1, h[n + 2] |= 255 & m << 9 - q);
        h.length = (15 * (c.length - 2) + e) / 8;
        return d(h)
    }
})("undefined" != typeof module && module.exports || (this.base32k = {}));

function CLCD() {
    this.registers = Array(256);
    this.cmdseq = this.dataword = this.datahl = this.cmdword = this.cmdhl = 0;
    this.canidd_addr = null;
    this.canidd_rowwidth = 0;
    this.curx = 319;
    this.cury = 239;
    this.incx = -1;
    this.incy = 0;
    this.eolx = 239;
    this.eoly = -1;
    this.sy = this.sx = 0;
    this.ex = 319;
    this.ey = 239;
    this.panicked = this.ntr = this.bgr = this.inv = 0;
    this.basee = 1;
    this.part1gs = this.part2 = this.part1 = 0;
    this.part1ge = 319;
    this.part2gs = this.part1d = 0;
    this.part2ge = 319;
    this.vscroll = this.part2d = 0;
    this.gram = new Uint8Array(230400);
    this.gram_offset =
        3 * this.curx + 960 * this.cury;
    this.gram_copy_pend = !0;
    this.lcd_command = function(c) {
        this.cmdword = c;
        this.cmdhl = 1 - this.cmdhl
    };
    this.lcd_write = function(c) {
        this.dataword = this.datahl ? this.dataword | c : c << 8;
        this.datahl = 1 - this.datahl;
        this.datahl || (34 != this.cmdword ? (this.registers[this.cmdword] = this.dataword, this.setmodes(this.cmdword)) : (c = this.panicked ? (this.curx & 1) - 1 & 65535 : this.dataword, this.gram[this.gram_offset] = (c & 31) << 3, this.gram[this.gram_offset + 1] = (c >> 5 & 63) << 2, this.gram[this.gram_offset + 2] = c >> 11 << 3, this.gramPixelToLCD(),
            this.curx += this.incx, this.cury += this.incy, this.sx - 1 == this.curx && (this.curx = this.ex, this.cury += this.eoly), this.ex + 1 == this.curx && (this.curx = this.sx, this.cury += this.eoly), this.sy - 1 == this.cury && (this.cury = this.ey, this.curx += this.eolx), this.ey + 1 == this.cury && (this.cury = this.sy, this.curx += this.eolx), this.sx - 1 == this.curx && (this.curx = this.ex, this.cury += this.eoly), this.ex + 1 == this.curx && (this.curx = this.sx, this.cury += this.eoly), this.gram_offset = 3 * this.curx + 960 * this.cury))
    };
    this.gramFullToLCD = function() {
        this.gram_copy_pend = !1;
        for (var c = 0, d = 0, f = 0; 230400 > f; f += 3) {
            var e = this.gram[f + 2 * this.bgr],
                g = this.gram[f + 1],
                l = this.gram[f + 2 - 2 * this.bgr];
            this.inv && (e ^= 255, g ^= 255, l ^= 255);
            if (this.basee) {
                var h = (c - this.vscroll + 320) % 320,
                    h = 4 * h + this.canidd_rowwidth * d;
                this.canidd_addr[h++] = e;
                this.canidd_addr[h++] = g;
                this.canidd_addr[h] = l
            } else h = c < this.part1gs && 320 <= this.part1ge ? c + 320 : c, this.part1 && h >= this.part1gs && h <= this.part1ge && (h += this.part1d - this.part1gs, this.ntr && (h = 160 <= h ? 1 + 2 * (h - 160) : 2 * h), h = this.canidd_rowwidth * d + 4 * h, this.canidd_addr[h++] =
                e, this.canidd_addr[h++] = g, this.canidd_addr[h++] = l), h = c < this.part2gs && 320 <= this.part2ge ? c + 320 : c, this.part2 && h >= this.part2gs && h <= this.part2ge && (h += this.part2d - this.part2gs, this.ntr && (h = 160 <= h ? 1 + 2 * (h - 160) : 2 * h), h = this.canidd_rowwidth * d + 4 * h, this.canidd_addr[h++] = e, this.canidd_addr[h++] = g, this.canidd_addr[h] = l);
            c++;
            320 <= c && (d++, c = 0); - 1 == c && (c = 319, d += this.eoly);
            320 == c && (c = 0, d += this.eoly); - 1 == d && (d = 239, c += this.eolx);
            240 == d && (d = 0, c += this.eolx); - 1 == c && (c = 319, d += this.eoly);
            320 == c && (c = 0, d += this.eoly)
        }
    };
    this.gramPixelToLCD =
        function() {
            var c = this.gram[this.gram_offset + 2 * this.bgr],
                d = this.gram[this.gram_offset + 1],
                f = this.gram[this.gram_offset + 2 - 2 * this.bgr];
            this.inv && (c ^= 255, d ^= 255, f ^= 255);
            var e = this.curx,
                g = this.cury;
            if (this.basee) {
                var l = (e - this.vscroll + 320) % 320,
                    l = 4 * l + this.canidd_rowwidth * g;
                this.canidd_addr[l++] = c;
                this.canidd_addr[l++] = d;
                this.canidd_addr[l] = f
            } else this.part1 && e >= this.part1gs && e <= this.part1ge && (l = this.part1d + e - this.part1gs, this.ntr && (l = 160 <= l ? 1 + 2 * (l - 160) : 2 * l), l = this.canidd_rowwidth * g + 4 * l, this.canidd_addr[l++] =
                c, this.canidd_addr[l++] = d, this.canidd_addr[l] = f), this.part2 && e >= this.part2gs && e <= this.part2ge && (e = this.part2d + e - this.part2gs, this.ntr && (e = 160 <= e ? 1 + 2 * (e - 160) : 2 * e), l = this.canidd_rowwidth * g + 4 * e, this.canidd_addr[l++] = c, this.canidd_addr[l++] = d, this.canidd_addr[l] = f)
        };
    this.panic = function() {
        this.panicked = 1;
        for (var c = 0; 230400 > c; c += 6) this.gram[c] = this.gram[c + 1] = this.gram[c + 2] = 255, this.gram[c + 3] = this.gram[c + 4] = this.gram[c + 5] = 0;
        this.gramFullToLCD()
    };
    this.setmodes = function(c) {
        switch (c) {
            case 1:
                this.ntr = this.dataword &
                    1024 ? 1 : 0;
                this.gramFullToLCD();
                break;
            case 3:
                c = this.bgr;
                var d = this.incx,
                    f = this.incy,
                    e = this.eolx,
                    g = this.eoly;
                this.bgr = this.dataword & 4096 ? 1 : 0;
                this.bgr != c && this.gramFullToLCD();
                this.setincmodes(this.dataword);
                if (e != this.eolx || g != this.eoly || d != this.incx || f != this.incy) {
                    if (1 == this.incy || 1 == this.eoly) this.cury = this.sy;
                    if (-1 == this.incy || -1 == this.eoly) this.cury = this.ey;
                    if (1 == this.incx || 1 == this.eolx) this.curx = this.sx;
                    if (-1 == this.incx || -1 == this.eolx) this.curx = this.ex
                }
                break;
            case 7:
                this.basee = this.dataword & 256 ?
                    1 : 0;
                this.part1 = this.dataword & 4096 ? 1 : 0;
                this.part2 = this.dataword & 8192 ? 1 : 0;
                this.gramFullToLCD();
                break;
            case 16:
                this.panicked = this.dataword & 3 ? 0 : this.panicked;
                break;
            case 32:
            case 33:
                if (this.registers[3] & 128)
                    if (32 == c) {
                        if (1 == this.incy || 1 == this.eoly) this.cury = this.sy;
                        if (-1 == this.incy || -1 == this.eoly) this.cury = this.ey
                    } else {
                        if (1 == this.incx || 1 == this.eolx) this.curx = this.sx;
                        if (-1 == this.incx || -1 == this.eolx) this.curx = this.ex
                    }
                else this.curx = this.registers[33], this.cury = this.registers[32];
                break;
            case 80:
                this.sy = this.dataword &
                    255;
                this.registers[3] & 128 && (1 == this.incy || 1 == this.eoly) && (this.cury = this.sy);
                break;
            case 81:
                this.ey = this.dataword & 255;
                this.registers[3] & 128 && (-1 == this.incy || -1 == this.eoly) && (this.cury = this.ey);
                break;
            case 82:
                this.sx = this.dataword & 511;
                this.registers[3] & 128 && (1 == this.incx || 1 == this.eolx) && (this.curx = this.sx);
                break;
            case 83:
                this.ex = this.dataword & 511;
                this.registers[3] & 128 && (-1 == this.incx || -1 == this.eolx) && (this.curx = this.ex);
                break;
            case 97:
                c = this.inv;
                d = this.vscroll;
                this.inv = 1 ^ this.dataword & 1;
                this.vscroll = this.dataword &
                    2 ? this.vscroll : 0;
                this.inv == c && this.vscroll == d || this.gramFullToLCD();
                break;
            case 106:
                this.vscroll = this.dataword & 511;
                this.gramFullToLCD();
                break;
            case 128:
                this.part1d = this.dataword & 511;
                this.gramFullToLCD();
                break;
            case 129:
                this.part1gs = this.dataword & 511;
                this.gramFullToLCD();
                break;
            case 130:
                this.part1ge = this.dataword & 511;
                this.gramFullToLCD();
                break;
            case 131:
                this.part2d = this.dataword & 511;
                this.gramFullToLCD();
                break;
            case 132:
                this.part2gs = this.dataword & 511;
                this.gramFullToLCD();
                break;
            case 133:
                this.part2ge = this.dataword &
                    511, this.gramFullToLCD()
        }
        this.setincmodes(this.registers[3]);
        this.calc_ac()
    };
    this.calc_ac = function() {
        this.gram_offset = 3 * this.curx + 960 * this.cury
    };
    this.setincmodes = function(c) {
        c & 8 ? (this.incy = 0, this.eolx = this.ex - this.sx + 1, this.eoly = c & 16 ? 1 : -1, this.incx = c & 32 ? 1 : -1) : (this.incx = 0, this.eoly = this.ey - this.sy + 1, this.eolx = c & 32 ? 1 : -1, this.incy = c & 16 ? 1 : -1)
    };
    this.lcd_status = function() {
        return 0
    };
    this.lcd_read = function() {
        if (this.datahl = 1 - this.datahl) {
            var c = 0;
            34 == this.cmdword ? (c = this.gram[this.gram_offset + 2] >> 3 << 11, c |=
                this.gram[this.gram_offset + 1] >> 2 << 5, c |= this.gram[this.gram_offset] >> 3) : c = this.registers[this.cmdword];
            this.dataword = c;
            return c >> 8
        }
        return this.dataword & 255
    };
    this.lcd_reset = function(c) {
        for (c = 0; 256 > c; c++) this.registers[c] = 0;
        this.registers[0] = 37685;
        this.datahl = this.cmdhl = 0;
        this.curx = 319;
        this.cury = 239;
        this.incx = -1;
        this.incy = 0;
        this.eolx = 239;
        this.eoly = -1;
        this.sy = this.sx = 0;
        this.ex = 319;
        this.ey = 239;
        this.ntr = this.vscroll = this.bgr = this.inv = 0;
        this.basee = 1;
        this.part1gs = this.part2 = this.part1 = 0;
        this.part1ge = 319;
        this.part2gs = this.part1d = 0;
        this.part2ge = 319;
        this.part2d = 0;
        this.gram_offset = 3 * this.curx + 960 * this.cury
    };
    this.lcd_update = function() {
        this.gram_copy_pend && this.gramFullToLCD()
    };
    this.serial_load = function(c, d) {
        lcd2 = JSON.parse(c);
        this.cmdhl = lcd2.cmdhl;
        this.datahl = lcd2.datahl;
        this.cmdword = lcd2.cmdword;
        this.dataword = lcd2.dataword;
        this.cmwseq = lcd2.cmdseq;
        this.canidd_rowwidth = lcd2.canidd_rowwidth;
        lcd2.gram_offset && (this.gram_offset = lcd2.gram_offset);
        this.registers = lcd2.registers;
        this.curx = lcd2.curx;
        this.cury =
            lcd2.cury;
        this.incx = lcd2.incx;
        this.incy = lcd2.incy;
        this.eoly = lcd2.eoly;
        this.sx = lcd2.sx;
        this.ex = lcd2.ex;
        this.sy = lcd2.sy;
        this.ey = lcd2.ey;
        this.inv = lcd2.inv;
        this.bgr = lcd2.bgr;
        lcd2.basee && (this.ntr = lcd2.ntr, this.basee = lcd2.basee, this.part1 = lcd2.part1, this.part2 = lcd2.part2, this.part1gs = lcd2.part1gs, this.part1ge = lcd2.part1ge, this.part1d = lcd2.part1d, this.part2gs = lcd2.part2gs, this.part2ge = lcd2.part2ge, this.part2d = lcd2.part2d, this.vscroll = lcd2.vscroll);
        lcd2.img && (void 0 !== d.localStoreVersion && 2 <= d.localStoreVersion ?
            lcd2.img = base32k.decodeBytes(lcd2.img) : (lcd2.img = lzw_bytestr2unicode(lcd2.img), lcd2.img = lzw_decode(lcd2.img)), serial_helper_bytearray_load(lcd2.img, this.gram), this.gram_copy_pend = !0)
    };
    this.serial_save = function() {
        js_lo = {};
        js_lo.cmdhl = this.cmdhl;
        js_lo.datahl = this.datahl;
        js_lo.cmdword = this.cmdword;
        js_lo.dataword = this.dataword;
        js_lo.cmdseq = this.cmdseq;
        js_lo.canidd_rowwidth = this.canidd_rowwidth;
        js_lo.gram_offset = this.gram_offset;
        js_lo.registers = this.registers;
        js_lo.curx = this.curx;
        js_lo.cury = this.cury;
        js_lo.incx = this.incx;
        js_lo.incy = this.incy;
        js_lo.eoly = this.eoly;
        js_lo.sx = this.sx;
        js_lo.ex = this.ex;
        js_lo.sy = this.sy;
        js_lo.ey = this.ey;
        js_lo.inv = this.inv;
        js_lo.bgr = this.bgr;
        js_lo.ntr = this.ntr;
        js_lo.basee = this.basee;
        js_lo.part1 = this.part1;
        js_lo.part2 = this.part2;
        js_lo.part1gs = this.part1gs;
        js_lo.part1ge = this.part1ge;
        js_lo.part1d = this.part1d;
        js_lo.part2gs = this.part2gs;
        js_lo.part2ge = this.part2ge;
        js_lo.part2d = this.part2d;
        js_lo.vscroll = this.vscroll;
        this.canidd_addr && (js_lo.img = serial_helper_bytearray_save(this.gram,
            230400), js_lo.img = base32k.encodeBytes(js_lo.img));
        return JSON.stringify(js_lo)
    };
    this.setcanvasprops = function(c) {
        this.canidd_addr = c[0];
        this.canidd_rowwidth = c[1];
        this.gram_copy_pend && this.gramFullToLCD()
    };
    this.getcanvaswidth = function() {
        return 320
    };
    this.getcanvasheight = function() {
        return 240
    };
    this.getneedrepaint = function() {
        return 0
    };
    this.getColorDepth = function() {
        return 6
    }
};

function loadfile() {
    document.getElementById("file_upload").style.display = "block";
    document.getElementById("file_download").style.display = "block";
    document.getElementById("file_upload_error").style.display = "none"
}

function doloadfile() {
    document.getElementById("file_upload_error").style.display = "none";
    var c = document.getElementById("8xpfile");
    c && c.files[0].name && c.files[0].name.match(/\.8[23xc].$/i) ? handleloadfile(c.files[0]) : document.getElementById("file_upload_error").style.display = "block";
    c.value = ""
}

function populate_var_list() {
    ftypes = "Real Num;Real List;Matrix;Y-Var;Str;Prog;Prot Prog;Pic;GDB;;;Window;Cplx Num;Cplx List;;Window;Window;TblSetup;;Backup;X;AppVar;;Group;;X;Image;;;;;;;;;OS;App;ID;Cert;Clock".split(";");
    list = ti_common_get_listing();
    output = "";
    if (0 == list.length) output = "<i>No files</i>";
    else if (1 == list.length && -1 == list[0][0]) output = "<i>Failed to fetch file list! Is calculator powered on and at the homescreen?</i>";
    else
        for (line in list) {
            data = list[line];
            type = ftypes[data[2]];
            size = data[0] +
                256 * data[1];
            name = "";
            switch (data[3]) {
                case 60:
                    name = "Image" + (data[4] + 1) % 10;
                    break;
                case 93:
                    name = "L" + data[4];
                    break;
                case 94:
                    32 > data[4] ? name = "Y" + (data[4] - 15) % 10 : 44 > data[4] && 0 == data[4] % 2 ? name = "X" + (data[4] - 30) / 2 + "t" : 44 > data[4] && 1 == data[4] % 2 ? name = "Y" + (data[4] - 31) / 2 + "t" : 70 > data[4] ? name = "r" + (data[4] - 63) : 128 == data[4] ? name = "u" : 129 == data[4] ? name = "v" : 130 == data[4] && (name = "w");
                    break;
                case 170:
                    name = "Str" + (data[4] + 1) % 10;
                    break;
                case 96:
                    name = "Pic" + (data[4] + 1) % 10;
                    break;
                case 97:
                    name = "GDB" + (data[4] + 1) % 10;
                    break;
                default:
                    for (i =
                        3; 11 > i; i++)
                        if (0 < data[i]) name += String.fromCharCode(data[i]);
                        else break
            }
            output += '<input type="button" value="&#9658;Comp" onclick="tocomp_pushfile(\'' + data.join(",") + "')\" /> ";
            if (5 == data[2] || 6 == data[2]) output += '<input type="button" value="&#9658;SC3" onclick="sc2_pushfile(\'' + data.join(",") + "')\" /> ";
            output += "<b>" + name + "</b> <i>(" + type + ", " + size + "b)</i><br />"
        }
    document.getElementById("dir_list").innerHTML = output
}

function buildfile_header(c, d) {
    for (var f = "", e = "", g = 0, l = 2; l < c.length; l++) f += String.fromCharCode(c[l]), g = (g + c[l]) % 65536;
    for (l in d) e += String.fromCharCode(d[l]), g = (g + d[l]) % 65536;
    output = "**TI83F*" + String.fromCharCode(26) + String.fromCharCode(10) + String.fromCharCode(0);
    output += "< Created by jsTIfied - www.cemetech.net >";
    size = e.length + 17;
    output += String.fromCharCode(size % 256) + String.fromCharCode(size / 256 | 0);
    output += String.fromCharCode(13) + String.fromCharCode(0);
    size = e.length;
    output += String.fromCharCode(size %
        256) + String.fromCharCode(size / 256 | 0);
    output += f;
    output += String.fromCharCode(size % 256) + String.fromCharCode(size / 256 | 0);
    g = (13 + g + 2 * (size % 256 + (size / 256 | 0))) % 65536;
    output += e;
    return output += String.fromCharCode(g % 256) + String.fromCharCode(g / 256 | 0)
}

function tocomp_pushfile(c) {
    c = c.split(",");
    if (contents = ti_common_get_file(c)) {
        var d = "";
        for (idx in c) d += String.fromCharCode(c[idx]);
        output = buildfile_header(c, contents);
        for (var d = "", f = 0; 8 > f && 0 != c[f + 3]; f++) d += String.fromCharCode(c[f + 3]);
        pushDownload(output, "application/ti83", d + "." + "8xn 8xl 8xm 8xy 8xs 8xp 8xp 8xi 8xd   8xw 8xn 8xl  8xw 8xw 8xt  8xb  8xv  8xg            8xu 8xk  8xq ".split(" ")[c[2]])
    }
}

function pushDownload(c, d, f) {
    $("#pushDownloadDiv").length && (URL.revokeObjectURL($("#pushDownloadLink").attr("href")), $("#pushDownloadDiv").remove());
    for (var e = new ArrayBuffer(c.length), e = new Uint8Array(e), g = 0; g < c.length; g++) e[g] = c.charCodeAt(g);
    d = new Blob([e.buffer], {
        type: d
    });
    c = document.createElement("a");
    $(c).attr("id", "pushDownloadLink").attr("download", f).attr("href", URL.createObjectURL(d));
    f = document.createElement("div");
    $(f).attr("id", "pushDownloadDiv").css("display", "none").append($(c)).appendTo($("body"));
    $(c)[0].click()
}

function sc2_pushfile(c) {
    c = c.split(",");
    contents = ti_common_get_file(c);
    sc2_pushfile_ajax(c, contents)
}

function handleloadfile(c, d) {
    var f = new FileReader;
    f.onload = function(c) {
        handleloadfiledata(c.target.result, d)
    };
    f.readAsBinaryString(c)
}

function handleloadfiledata(c, d) {
    success = !0;
    wasrunning = running;
    if ("**TI82**" == c.substring(0, 8) || "**TI83**" == c.substring(0, 8) || "**TI83F*" == c.substring(0, 8)) {
        var f = {};
        f.wasrunning = running;
        stop();
        f.epilog = function(c, d) {
            d.wasrunning && start();
            0 != c && (document.getElementById("file_upload_error").style.display = "block")
        };
        ti_common_send_file(c, "handleloadfile_pbcb", d, f)
    } else "**TIFL**" == c.substring(0, 8) ? (stop(), retval = i6_send_app(c, "handleloadfile_pbcb"), success = 0 == retval) : success = !1;
    wasrunning && start();
    success || (document.getElementById("file_upload_error").style.display = "block")
}

function handleloadfile_pbcb(c, d, f, e, g) {
    var l, h;
    0 < c && (l = document.getElementById("progdiv_outer_" + d), h = document.getElementById("progdiv_bar_" + d));
    var m = new Date;
    console.log("pbcb called in mode " + c + " for inner " + h + " ID " + d + ", width " + (h ? h.style.width : void 0));
    switch (c) {
        case 0:
            document.getElementById("uploaded_log").innerHTML = '<div class="progress_outer" id="progdiv_outer_' + d + '"><div class="progress_frame"><div class="progress_bar" id="progdiv_bar_' + d + '"></div></div>&nbsp;' + e + " (" + f + " bytes)</div>" +
                document.getElementById("uploaded_log").innerHTML;
            break;
        case 1:
            c = 100 * g / f;
            h.style.width = Math.round(c) + "px";
            h.innerHTML = Math.round(c).toString() + "%";
            break;
        case 2:
            h.style.width = "100px";
            h.innerHTML = "100%";
            l.innerHTML += ' <span class="progress_text_success">Complete</span> [Uploaded ' + m.toUTCString() + "]";
            console.log("pbcb called in mode " + c + " for inner " + h + ", width " + (h ? h.style.width : void 0));
            break;
        case 3:
            h.innerHTML = "--%", l.innerHTML += ' <span class="progress_text_fail">Failed!</span> [Uploaded ' + m.toUTCString() +
                "]"
    }
}

function sc2_fetchlist() {
    44 == qq && (document.getElementById("jstified_scxfer_filelist").innerHTML = "", ajax_kickoff("http://www.cemetech.net/projects/basicelite/sc2/api.php?f=list", sc2_fetchlist_display))
}

function sc2_fetchlist_display() {
    if (4 == jstxmlhttp.readyState && (ajax_inprogress = !1, 200 == jstxmlhttp.status && "FAIL" != jstxmlhttp.responseText)) {
        var c = "",
            d = jstxmlhttp.responseText.split("\n");
        d.pop();
        if (0 == d.length) c = "<i>No files</i>";
        else
            for (line in d) pieces = d[line].split("|"), name = base64_decode(pieces[0]), size = base64_decode(pieces[1]), xpi = base64_decode(pieces[2]), c += '<input type="button" value="Load" onclick="sc2_loadfile(\'' + xpi + "')\" /> <b>" + name + "</b> <i>(" + size + " bytes)</i><br />";
        document.getElementById("jstified_scxfer_filelist").innerHTML =
            c
    }
}

function sc2_pushfile_ajax(c, d) {
    if (44 == qq) {
        document.getElementById("downloaded_log").style.display = "none";
        var f = "",
            e = "";
        for (g in c) f += String.fromCharCode(c[g]);
        for (var g = 2; g < d.length; g++) e += String.fromCharCode(d[g]);
        params = "header=" + base64_encode(f) + "&contents=" + base64_encode(e);
        sc2_pushitem("http://www.cemetech.net/projects/basicelite/sc2/api.php?f=contents_rawbinary_put", sc2_pushfile_send, params)
    }
}

function sc2_pushfile_send() {
    if (44 == qq) {
        var c = 0,
            d = "";
        if (4 == jstxmlhttp.readyState) {
            ajax_inprogress = !1;
            if (200 == jstxmlhttp.status)
                if ("FAIL" == jstxmlhttp.responseText) c = 1;
                else {
                    var f = jstxmlhttp.responseText.split("\n");
                    f.pop();
                    1 < f.length ? (c = 1, d = base64_decode(f[1])) : contents = base64_decode(f[0])
                }
            else c = 1;
            f = document.getElementById("downloaded_log");
            c ? (f.className = "toperr", f.innerHTML = "Error: File NOT successfully saved to SourceCoder" + ("" != d ? ":<br />" + d : "")) : (f.className = "topinfo", f.innerHTML = "File was successfully saved to SourceCoder");
            f.style.display = "block";
            setTimeout("document.getElementById('downloaded_log').style.display = 'none';", 5E3)
        }
    }
}

function sc2_loadfile(c) {
    44 == qq && ajax_kickoff("http://www.cemetech.net/projects/basicelite/sc2/api.php?f=contents_binary&xpi=" + c, sc2_loadfile_send)
}

function sc2_loadfile_send() {
    if (44 == qq && 4 == jstxmlhttp.readyState && (ajax_inprogress = !1, 200 == jstxmlhttp.status && "FAIL" != jstxmlhttp.responseText)) {
        var c = jstxmlhttp.responseText.split("\n");
        c.pop();
        2 == c.length && (contents = base64_decode(c[1]), c = {}, c.wasrunning = running, stop(), c.epilog = function(c, f) {
            f.wasrunning && start();
            0 != c && (tabs_tools(), document.getElementById("file_upload").style.display = "block", document.getElementById("file_upload_error").style.display = "block")
        }, ti_common_send_file(contents, "handleloadfile_pbcb",
            !0, c))
    }
}
var jstxmlhttp, ajax_inprogress;

function sc2_pushitem(c, d, f) {
    1 != ajax_inprogress && (ajax_inprogress = !0, window.XMLHttpRequest ? jstxmlhttp = new XMLHttpRequest : window.ActiveXObject && (jstxmlhttp = new ActiveXObject("Microsoft.XMLHTTP")), jstxmlhttp && (jstxmlhttp.onreadystatechange = d, jstxmlhttp.open("POST", c, !0), jstxmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded"), jstxmlhttp.setRequestHeader("Content-length", f.length), jstxmlhttp.setRequestHeader("Connection", "close"), jstxmlhttp.send(f)))
}

function ajax_kickoff(c, d) {
    1 != ajax_inprogress && (ajax_inprogress = !0, window.XMLHttpRequest ? jstxmlhttp = new XMLHttpRequest : window.ActiveXObject && (jstxmlhttp = new ActiveXObject("Microsoft.XMLHTTP")), jstxmlhttp && (jstxmlhttp.onreadystatechange = d, jstxmlhttp.open("GET", c, !0), jstxmlhttp.send(null)))
}
var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

function base64_decode(c) {
    var d, f, e, g, l, h = 0,
        m = 0;
    g = "";
    var n = [];
    if (!c) return c;
    c += "";
    do d = b64.indexOf(c.charAt(h++)), f = b64.indexOf(c.charAt(h++)), g = b64.indexOf(c.charAt(h++)), l = b64.indexOf(c.charAt(h++)), e = d << 18 | f << 12 | g << 6 | l, d = e >> 16 & 255, f = e >> 8 & 255, e &= 255, 64 == g ? n[m++] = String.fromCharCode(d) : 64 == l ? n[m++] = String.fromCharCode(d, f) : n[m++] = String.fromCharCode(d, f, e); while (h < c.length);
    return g = n.join("")
}

function base64_encode(c) {
    var d, f, e, g, l, h, m = 0,
        n = 0,
        q = [];
    if (!c) return c;
    c += "";
    do d = c.charCodeAt(m++), f = c.charCodeAt(m++), e = c.charCodeAt(m++), h = d << 16 | f << 8 | e, d = h >> 18 & 63, g = h >> 12 & 63, l = h >> 6 & 63, h &= 63, isNaN(f) ? l = h = 64 : isNaN(e) && (h = 64), q[n++] = b64.charAt(d) + b64.charAt(g) + b64.charAt(l) + b64.charAt(h); while (m < c.length);
    return q.join("")
};
var jstified_web_audio = function() {
    function c() {
        d || "undefined" == typeof AudioContext || (d = new AudioContext, f = d.createGain(), f.gain.value = 1, f.connect(d.destination))
    }
    var d = null,
        f = null,
        e = null,
        g = [];
    return {
        set_mastervolume: function(e) {
            c();
            d && (e = 1 + +e / 32, 0 > e ? e = 0 : 1 < e && (e = 1), f.gain.value = e)
        },
        update_audio_stream: function(l, h) {
            c();
            if (d) {
                for (var m = d.createBuffer(2, h, d.sampleRate), n = m.getChannelData(0), q = m.getChannelData(1), p = 0, r = h | 0; p < r; p++) {
                    var u = (l / 2 | 0) + (2 * p | 0),
                        z = HEAP16[u + 1 | 0] / 32766;
                    n[p] = HEAP16[u] / 32766;
                    q[p] =
                        z
                }
                g.push(m);
                a: {
                    m = d.currentTime;
                    if (null === e) {
                        n = r = 0;
                        for (q = g.length; n < q; n++) p = g[n], r += p.duration;
                        if (.1 > r) break a
                    }
                    r = null === e ? m : e;
                    if (g.length) {
                        n = 0;
                        for (q = g.length; n < q; n++) p = g[n], u = d.createBufferSource(), u.buffer = p, u.connect(f), u.start(r), r += p.duration;
                        g.length = 0;
                        e = r;
                        e <= m && (e = m)
                    }
                }
            }
        },
        get_context: function() {
            return d
        }
    }
}();
audio_set_mastervolume = jstified_web_audio.set_mastervolume;
audio_update_audio_stream = jstified_web_audio.update_audio_stream;
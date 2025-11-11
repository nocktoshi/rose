let wasm;

let WASM_VECTOR_LEN = 0;

let cachedUint8ArrayMemory0 = null;

function getUint8ArrayMemory0() {
    if (cachedUint8ArrayMemory0 === null || cachedUint8ArrayMemory0.byteLength === 0) {
        cachedUint8ArrayMemory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8ArrayMemory0;
}

const cachedTextEncoder = new TextEncoder();

if (!('encodeInto' in cachedTextEncoder)) {
    cachedTextEncoder.encodeInto = function (arg, view) {
        const buf = cachedTextEncoder.encode(arg);
        view.set(buf);
        return {
            read: arg.length,
            written: buf.length
        };
    }
}

function passStringToWasm0(arg, malloc, realloc) {

    if (realloc === undefined) {
        const buf = cachedTextEncoder.encode(arg);
        const ptr = malloc(buf.length, 1) >>> 0;
        getUint8ArrayMemory0().subarray(ptr, ptr + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }

    let len = arg.length;
    let ptr = malloc(len, 1) >>> 0;

    const mem = getUint8ArrayMemory0();

    let offset = 0;

    for (; offset < len; offset++) {
        const code = arg.charCodeAt(offset);
        if (code > 0x7F) break;
        mem[ptr + offset] = code;
    }

    if (offset !== len) {
        if (offset !== 0) {
            arg = arg.slice(offset);
        }
        ptr = realloc(ptr, len, len = offset + arg.length * 3, 1) >>> 0;
        const view = getUint8ArrayMemory0().subarray(ptr + offset, ptr + len);
        const ret = cachedTextEncoder.encodeInto(arg, view);

        offset += ret.written;
        ptr = realloc(ptr, len, offset, 1) >>> 0;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
}

function isLikeNone(x) {
    return x === undefined || x === null;
}

let cachedDataViewMemory0 = null;

function getDataViewMemory0() {
    if (cachedDataViewMemory0 === null || cachedDataViewMemory0.buffer.detached === true || (cachedDataViewMemory0.buffer.detached === undefined && cachedDataViewMemory0.buffer !== wasm.memory.buffer)) {
        cachedDataViewMemory0 = new DataView(wasm.memory.buffer);
    }
    return cachedDataViewMemory0;
}

let cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });

cachedTextDecoder.decode();

const MAX_SAFARI_DECODE_BYTES = 2146435072;
let numBytesDecoded = 0;
function decodeText(ptr, len) {
    numBytesDecoded += len;
    if (numBytesDecoded >= MAX_SAFARI_DECODE_BYTES) {
        cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });
        cachedTextDecoder.decode();
        numBytesDecoded = len;
    }
    return cachedTextDecoder.decode(getUint8ArrayMemory0().subarray(ptr, ptr + len));
}

function getStringFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return decodeText(ptr, len);
}

function _assertClass(instance, klass) {
    if (!(instance instanceof klass)) {
        throw new Error(`expected instance of ${klass.name}`);
    }
}

function addToExternrefTable0(obj) {
    const idx = wasm.__externref_table_alloc();
    wasm.__wbindgen_export_2.set(idx, obj);
    return idx;
}

function passArrayJsValueToWasm0(array, malloc) {
    const ptr = malloc(array.length * 4, 4) >>> 0;
    for (let i = 0; i < array.length; i++) {
        const add = addToExternrefTable0(array[i]);
        getDataViewMemory0().setUint32(ptr + 4 * i, add, true);
    }
    WASM_VECTOR_LEN = array.length;
    return ptr;
}

function getArrayJsValueFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    const mem = getDataViewMemory0();
    const result = [];
    for (let i = ptr; i < ptr + 4 * len; i += 4) {
        result.push(wasm.__wbindgen_export_2.get(mem.getUint32(i, true)));
    }
    wasm.__externref_drop_slice(ptr, len);
    return result;
}

function takeFromExternrefTable0(idx) {
    const value = wasm.__wbindgen_export_2.get(idx);
    wasm.__externref_table_dealloc(idx);
    return value;
}

function passArray8ToWasm0(arg, malloc) {
    const ptr = malloc(arg.length * 1, 1) >>> 0;
    getUint8ArrayMemory0().set(arg, ptr / 1);
    WASM_VECTOR_LEN = arg.length;
    return ptr;
}
/**
 * Derive the first-name from a lock hash
 *
 * This implements the v1 first-name derivation algorithm:
 * first-name = hash([true, lock-hash])
 *
 * Arguments:
 * - lock_hash: Base58-encoded digest string (the hash of a lock structure)
 *
 * Returns:
 * - Base58-encoded digest string representing the first-name
 * @param {string} lock_hash
 * @returns {string}
 */
export function deriveFirstNameFromLockHash(lock_hash) {
    let deferred2_0;
    let deferred2_1;
    try {
        const ptr0 = passStringToWasm0(lock_hash, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.deriveFirstNameFromLockHash(ptr0, len0);
        deferred2_0 = ret[0];
        deferred2_1 = ret[1];
        return getStringFromWasm0(ret[0], ret[1]);
    } finally {
        wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
    }
}

/**
 * Derive the first-name for a simple PKH-locked note
 *
 * Creates a 1-of-1 PKH lock and derives the first-name from it.
 * Use this for querying regular transaction outputs.
 *
 * Arguments:
 * - pkh_hash: Base58-encoded digest string (TIP5 hash of the public key)
 *
 * Returns:
 * - Base58-encoded digest string representing the first-name
 * @param {string} pkh_hash
 * @returns {string}
 */
export function deriveSimpleFirstName(pkh_hash) {
    let deferred2_0;
    let deferred2_1;
    try {
        const ptr0 = passStringToWasm0(pkh_hash, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.deriveSimpleFirstName(ptr0, len0);
        deferred2_0 = ret[0];
        deferred2_1 = ret[1];
        return getStringFromWasm0(ret[0], ret[1]);
    } finally {
        wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
    }
}

/**
 * Derive the first-name for a coinbase (mining reward) note
 *
 * Creates a coinbase lock which includes both a PKH lock and a 100-block timelock.
 * Use this for querying mining rewards.
 *
 * Arguments:
 * - pkh_hash: Base58-encoded digest string (TIP5 hash of the public key)
 *
 * Returns:
 * - Base58-encoded digest string representing the first-name
 * @param {string} pkh_hash
 * @returns {string}
 */
export function deriveCoinbaseFirstName(pkh_hash) {
    let deferred2_0;
    let deferred2_1;
    try {
        const ptr0 = passStringToWasm0(pkh_hash, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.deriveCoinbaseFirstName(ptr0, len0);
        deferred2_0 = ret[0];
        deferred2_1 = ret[1];
        return getStringFromWasm0(ret[0], ret[1]);
    } finally {
        wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
    }
}

function getArrayU8FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getUint8ArrayMemory0().subarray(ptr / 1, ptr / 1 + len);
}
/**
 * Derive master key from seed bytes
 * @param {Uint8Array} seed
 * @returns {WasmExtendedKey}
 */
export function deriveMasterKey(seed) {
    const ptr0 = passArray8ToWasm0(seed, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.deriveMasterKey(ptr0, len0);
    return WasmExtendedKey.__wrap(ret);
}

/**
 * Derive master key from BIP39 mnemonic phrase
 * @param {string} mnemonic
 * @param {string | null} [passphrase]
 * @returns {WasmExtendedKey}
 */
export function deriveMasterKeyFromMnemonic(mnemonic, passphrase) {
    const ptr0 = passStringToWasm0(mnemonic, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    var ptr1 = isLikeNone(passphrase) ? 0 : passStringToWasm0(passphrase, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len1 = WASM_VECTOR_LEN;
    const ret = wasm.deriveMasterKeyFromMnemonic(ptr0, len0, ptr1, len1);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return WasmExtendedKey.__wrap(ret[0]);
}

const WasmDigestFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_wasmdigest_free(ptr >>> 0, 1));

export class WasmDigest {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(WasmDigest.prototype);
        obj.__wbg_ptr = ptr;
        WasmDigestFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        WasmDigestFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_wasmdigest_free(ptr, 0);
    }
    /**
     * @param {string} value
     */
    constructor(value) {
        const ptr0 = passStringToWasm0(value, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.wasmdigest_new(ptr0, len0);
        this.__wbg_ptr = ret >>> 0;
        WasmDigestFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @returns {string}
     */
    get value() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.wasmdigest_value(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
}
if (Symbol.dispose) WasmDigest.prototype[Symbol.dispose] = WasmDigest.prototype.free;

const WasmExtendedKeyFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_wasmextendedkey_free(ptr >>> 0, 1));

export class WasmExtendedKey {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(WasmExtendedKey.prototype);
        obj.__wbg_ptr = ptr;
        WasmExtendedKeyFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        WasmExtendedKeyFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_wasmextendedkey_free(ptr, 0);
    }
    /**
     * @returns {Uint8Array | undefined}
     */
    get private_key() {
        const ret = wasm.wasmextendedkey_private_key(this.__wbg_ptr);
        let v1;
        if (ret[0] !== 0) {
            v1 = getArrayU8FromWasm0(ret[0], ret[1]).slice();
            wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        }
        return v1;
    }
    /**
     * @returns {Uint8Array}
     */
    get public_key() {
        const ret = wasm.wasmextendedkey_public_key(this.__wbg_ptr);
        var v1 = getArrayU8FromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        return v1;
    }
    /**
     * @returns {Uint8Array}
     */
    get chain_code() {
        const ret = wasm.wasmextendedkey_chain_code(this.__wbg_ptr);
        var v1 = getArrayU8FromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        return v1;
    }
    /**
     * Derive a child key at the given index
     * @param {number} index
     * @returns {WasmExtendedKey}
     */
    deriveChild(index) {
        const ret = wasm.wasmextendedkey_deriveChild(this.__wbg_ptr, index);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return WasmExtendedKey.__wrap(ret[0]);
    }
}
if (Symbol.dispose) WasmExtendedKey.prototype[Symbol.dispose] = WasmExtendedKey.prototype.free;

const WasmLockPrimitiveFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_wasmlockprimitive_free(ptr >>> 0, 1));

export class WasmLockPrimitive {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(WasmLockPrimitive.prototype);
        obj.__wbg_ptr = ptr;
        WasmLockPrimitiveFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    static __unwrap(jsValue) {
        if (!(jsValue instanceof WasmLockPrimitive)) {
            return 0;
        }
        return jsValue.__destroy_into_raw();
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        WasmLockPrimitiveFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_wasmlockprimitive_free(ptr, 0);
    }
    /**
     * @param {WasmPkh} pkh
     * @returns {WasmLockPrimitive}
     */
    static newPkh(pkh) {
        _assertClass(pkh, WasmPkh);
        var ptr0 = pkh.__destroy_into_raw();
        const ret = wasm.wasmlockprimitive_newPkh(ptr0);
        return WasmLockPrimitive.__wrap(ret);
    }
    /**
     * @param {WasmLockTim} tim
     * @returns {WasmLockPrimitive}
     */
    static newTim(tim) {
        _assertClass(tim, WasmLockTim);
        var ptr0 = tim.__destroy_into_raw();
        const ret = wasm.wasmlockprimitive_newTim(ptr0);
        return WasmLockPrimitive.__wrap(ret);
    }
    /**
     * @returns {WasmLockPrimitive}
     */
    static newBrn() {
        const ret = wasm.wasmlockprimitive_newBrn();
        return WasmLockPrimitive.__wrap(ret);
    }
}
if (Symbol.dispose) WasmLockPrimitive.prototype[Symbol.dispose] = WasmLockPrimitive.prototype.free;

const WasmLockTimFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_wasmlocktim_free(ptr >>> 0, 1));

export class WasmLockTim {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(WasmLockTim.prototype);
        obj.__wbg_ptr = ptr;
        WasmLockTimFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        WasmLockTimFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_wasmlocktim_free(ptr, 0);
    }
    /**
     * @param {WasmTimelockRange} rel
     * @param {WasmTimelockRange} abs
     */
    constructor(rel, abs) {
        _assertClass(rel, WasmTimelockRange);
        var ptr0 = rel.__destroy_into_raw();
        _assertClass(abs, WasmTimelockRange);
        var ptr1 = abs.__destroy_into_raw();
        const ret = wasm.wasmlocktim_new(ptr0, ptr1);
        this.__wbg_ptr = ret >>> 0;
        WasmLockTimFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @returns {WasmLockTim}
     */
    static coinbase() {
        const ret = wasm.wasmlocktim_coinbase();
        return WasmLockTim.__wrap(ret);
    }
    /**
     * @returns {WasmTimelockRange}
     */
    get rel() {
        const ret = wasm.wasmlocktim_rel(this.__wbg_ptr);
        return WasmTimelockRange.__wrap(ret);
    }
    /**
     * @returns {WasmTimelockRange}
     */
    get abs() {
        const ret = wasm.wasmlocktim_abs(this.__wbg_ptr);
        return WasmTimelockRange.__wrap(ret);
    }
}
if (Symbol.dispose) WasmLockTim.prototype[Symbol.dispose] = WasmLockTim.prototype.free;

const WasmNameFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_wasmname_free(ptr >>> 0, 1));

export class WasmName {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(WasmName.prototype);
        obj.__wbg_ptr = ptr;
        WasmNameFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        WasmNameFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_wasmname_free(ptr, 0);
    }
    /**
     * @param {string} first
     * @param {string} last
     */
    constructor(first, last) {
        const ptr0 = passStringToWasm0(first, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passStringToWasm0(last, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        const ret = wasm.wasmname_new(ptr0, len0, ptr1, len1);
        this.__wbg_ptr = ret >>> 0;
        WasmNameFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @returns {string}
     */
    get first() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.wasmname_first(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {string}
     */
    get last() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.wasmname_last(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
}
if (Symbol.dispose) WasmName.prototype[Symbol.dispose] = WasmName.prototype.free;

const WasmNoteFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_wasmnote_free(ptr >>> 0, 1));

export class WasmNote {

    static __unwrap(jsValue) {
        if (!(jsValue instanceof WasmNote)) {
            return 0;
        }
        return jsValue.__destroy_into_raw();
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        WasmNoteFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_wasmnote_free(ptr, 0);
    }
    /**
     * @param {WasmVersion} version
     * @param {number} origin_page
     * @param {WasmName} name
     * @param {WasmDigest} note_data_hash
     * @param {number} assets
     */
    constructor(version, origin_page, name, note_data_hash, assets) {
        _assertClass(version, WasmVersion);
        var ptr0 = version.__destroy_into_raw();
        _assertClass(name, WasmName);
        var ptr1 = name.__destroy_into_raw();
        _assertClass(note_data_hash, WasmDigest);
        var ptr2 = note_data_hash.__destroy_into_raw();
        const ret = wasm.wasmnote_new(ptr0, origin_page, ptr1, ptr2, assets);
        this.__wbg_ptr = ret >>> 0;
        WasmNoteFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @returns {WasmVersion}
     */
    get version() {
        const ret = wasm.wasmnote_version(this.__wbg_ptr);
        return WasmVersion.__wrap(ret);
    }
    /**
     * @returns {number}
     */
    get originPage() {
        const ret = wasm.wasmnote_originPage(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @returns {WasmName}
     */
    get name() {
        const ret = wasm.wasmnote_name(this.__wbg_ptr);
        return WasmName.__wrap(ret);
    }
    /**
     * @returns {WasmDigest}
     */
    get noteDataHash() {
        const ret = wasm.wasmnote_noteDataHash(this.__wbg_ptr);
        return WasmDigest.__wrap(ret);
    }
    /**
     * @returns {number}
     */
    get assets() {
        const ret = wasm.wasmnote_assets(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @returns {WasmDigest}
     */
    hash() {
        const ret = wasm.wasmnote_hash(this.__wbg_ptr);
        return WasmDigest.__wrap(ret);
    }
}
if (Symbol.dispose) WasmNote.prototype[Symbol.dispose] = WasmNote.prototype.free;

const WasmPkhFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_wasmpkh_free(ptr >>> 0, 1));

export class WasmPkh {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(WasmPkh.prototype);
        obj.__wbg_ptr = ptr;
        WasmPkhFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        WasmPkhFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_wasmpkh_free(ptr, 0);
    }
    /**
     * @param {bigint} m
     * @param {string[]} hashes
     */
    constructor(m, hashes) {
        const ptr0 = passArrayJsValueToWasm0(hashes, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.wasmpkh_new(m, ptr0, len0);
        this.__wbg_ptr = ret >>> 0;
        WasmPkhFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @param {string} hash
     * @returns {WasmPkh}
     */
    static single(hash) {
        const ptr0 = passStringToWasm0(hash, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.wasmpkh_single(ptr0, len0);
        return WasmPkh.__wrap(ret);
    }
    /**
     * @returns {bigint}
     */
    get m() {
        const ret = wasm.wasmpkh_m(this.__wbg_ptr);
        return BigInt.asUintN(64, ret);
    }
    /**
     * @returns {string[]}
     */
    get hashes() {
        const ret = wasm.wasmpkh_hashes(this.__wbg_ptr);
        var v1 = getArrayJsValueFromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
        return v1;
    }
}
if (Symbol.dispose) WasmPkh.prototype[Symbol.dispose] = WasmPkh.prototype.free;

const WasmRawTxFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_wasmrawtx_free(ptr >>> 0, 1));

export class WasmRawTx {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(WasmRawTx.prototype);
        obj.__wbg_ptr = ptr;
        WasmRawTxFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        WasmRawTxFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_wasmrawtx_free(ptr, 0);
    }
    /**
     * @returns {WasmVersion}
     */
    get version() {
        const ret = wasm.wasmrawtx_version(this.__wbg_ptr);
        return WasmVersion.__wrap(ret);
    }
    /**
     * @returns {WasmDigest}
     */
    get id() {
        const ret = wasm.wasmrawtx_id(this.__wbg_ptr);
        return WasmDigest.__wrap(ret);
    }
}
if (Symbol.dispose) WasmRawTx.prototype[Symbol.dispose] = WasmRawTx.prototype.free;

const WasmSeedFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_wasmseed_free(ptr >>> 0, 1));

export class WasmSeed {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(WasmSeed.prototype);
        obj.__wbg_ptr = ptr;
        WasmSeedFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        WasmSeedFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_wasmseed_free(ptr, 0);
    }
    /**
     * @param {WasmDigest} pkh
     * @param {number} gift
     * @param {WasmDigest} parent_hash
     * @returns {WasmSeed}
     */
    static newSinglePkh(pkh, gift, parent_hash) {
        _assertClass(pkh, WasmDigest);
        var ptr0 = pkh.__destroy_into_raw();
        _assertClass(parent_hash, WasmDigest);
        var ptr1 = parent_hash.__destroy_into_raw();
        const ret = wasm.wasmseed_newSinglePkh(ptr0, gift, ptr1);
        return WasmSeed.__wrap(ret);
    }
    /**
     * @returns {WasmDigest}
     */
    get lockRoot() {
        const ret = wasm.wasmseed_lockRoot(this.__wbg_ptr);
        return WasmDigest.__wrap(ret);
    }
    /**
     * @returns {number}
     */
    get gift() {
        const ret = wasm.wasmseed_gift(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @returns {WasmDigest}
     */
    get parentHash() {
        const ret = wasm.wasmseed_parentHash(this.__wbg_ptr);
        return WasmDigest.__wrap(ret);
    }
}
if (Symbol.dispose) WasmSeed.prototype[Symbol.dispose] = WasmSeed.prototype.free;

const WasmSpendConditionFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_wasmspendcondition_free(ptr >>> 0, 1));

export class WasmSpendCondition {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(WasmSpendCondition.prototype);
        obj.__wbg_ptr = ptr;
        WasmSpendConditionFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        WasmSpendConditionFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_wasmspendcondition_free(ptr, 0);
    }
    /**
     * @param {WasmLockPrimitive[]} primitives
     */
    constructor(primitives) {
        const ptr0 = passArrayJsValueToWasm0(primitives, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.wasmspendcondition_new(ptr0, len0);
        this.__wbg_ptr = ret >>> 0;
        WasmSpendConditionFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @param {WasmPkh} pkh
     * @returns {WasmSpendCondition}
     */
    static newPkh(pkh) {
        _assertClass(pkh, WasmPkh);
        var ptr0 = pkh.__destroy_into_raw();
        const ret = wasm.wasmspendcondition_newPkh(ptr0);
        return WasmSpendCondition.__wrap(ret);
    }
    /**
     * @returns {WasmDigest}
     */
    hash() {
        const ret = wasm.wasmspendcondition_hash(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return WasmDigest.__wrap(ret[0]);
    }
}
if (Symbol.dispose) WasmSpendCondition.prototype[Symbol.dispose] = WasmSpendCondition.prototype.free;

const WasmTimelockRangeFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_wasmtimelockrange_free(ptr >>> 0, 1));

export class WasmTimelockRange {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(WasmTimelockRange.prototype);
        obj.__wbg_ptr = ptr;
        WasmTimelockRangeFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        WasmTimelockRangeFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_wasmtimelockrange_free(ptr, 0);
    }
    /**
     * @param {number | null} [min]
     * @param {number | null} [max]
     */
    constructor(min, max) {
        const ret = wasm.wasmtimelockrange_new(isLikeNone(min) ? 0x100000001 : (min) >>> 0, isLikeNone(max) ? 0x100000001 : (max) >>> 0);
        this.__wbg_ptr = ret >>> 0;
        WasmTimelockRangeFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @returns {number | undefined}
     */
    get min() {
        const ret = wasm.wasmtimelockrange_min(this.__wbg_ptr);
        return ret === 0x100000001 ? undefined : ret;
    }
    /**
     * @returns {number | undefined}
     */
    get max() {
        const ret = wasm.wasmtimelockrange_max(this.__wbg_ptr);
        return ret === 0x100000001 ? undefined : ret;
    }
}
if (Symbol.dispose) WasmTimelockRange.prototype[Symbol.dispose] = WasmTimelockRange.prototype.free;

const WasmTxBuilderFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_wasmtxbuilder_free(ptr >>> 0, 1));

export class WasmTxBuilder {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(WasmTxBuilder.prototype);
        obj.__wbg_ptr = ptr;
        WasmTxBuilderFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        WasmTxBuilderFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_wasmtxbuilder_free(ptr, 0);
    }
    /**
     * Create a simple transaction builder
     * @param {WasmNote[]} notes
     * @param {WasmSpendCondition} spend_condition
     * @param {WasmDigest} recipient
     * @param {number} gift
     * @param {number} fee
     * @param {WasmDigest} refund_pkh
     * @returns {WasmTxBuilder}
     */
    static newSimple(notes, spend_condition, recipient, gift, fee, refund_pkh) {
        const ptr0 = passArrayJsValueToWasm0(notes, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        _assertClass(spend_condition, WasmSpendCondition);
        _assertClass(recipient, WasmDigest);
        var ptr1 = recipient.__destroy_into_raw();
        _assertClass(refund_pkh, WasmDigest);
        var ptr2 = refund_pkh.__destroy_into_raw();
        const ret = wasm.wasmtxbuilder_newSimple(ptr0, len0, spend_condition.__wbg_ptr, ptr1, gift, fee, ptr2);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return WasmTxBuilder.__wrap(ret[0]);
    }
    /**
     * Sign the transaction with a private key
     * @param {Uint8Array} signing_key_bytes
     * @returns {WasmRawTx}
     */
    sign(signing_key_bytes) {
        const ptr0 = passArray8ToWasm0(signing_key_bytes, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.wasmtxbuilder_sign(this.__wbg_ptr, ptr0, len0);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return WasmRawTx.__wrap(ret[0]);
    }
}
if (Symbol.dispose) WasmTxBuilder.prototype[Symbol.dispose] = WasmTxBuilder.prototype.free;

const WasmVersionFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_wasmversion_free(ptr >>> 0, 1));

export class WasmVersion {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(WasmVersion.prototype);
        obj.__wbg_ptr = ptr;
        WasmVersionFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        WasmVersionFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_wasmversion_free(ptr, 0);
    }
    /**
     * @param {number} version
     */
    constructor(version) {
        const ret = wasm.wasmversion_new(version);
        this.__wbg_ptr = ret >>> 0;
        WasmVersionFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @returns {WasmVersion}
     */
    static V0() {
        const ret = wasm.wasmversion_V0();
        return WasmVersion.__wrap(ret);
    }
    /**
     * @returns {WasmVersion}
     */
    static V1() {
        const ret = wasm.wasmversion_V1();
        return WasmVersion.__wrap(ret);
    }
    /**
     * @returns {WasmVersion}
     */
    static V2() {
        const ret = wasm.wasmversion_V2();
        return WasmVersion.__wrap(ret);
    }
}
if (Symbol.dispose) WasmVersion.prototype[Symbol.dispose] = WasmVersion.prototype.free;

const EXPECTED_RESPONSE_TYPES = new Set(['basic', 'cors', 'default']);

async function __wbg_load(module, imports) {
    if (typeof Response === 'function' && module instanceof Response) {
        if (typeof WebAssembly.instantiateStreaming === 'function') {
            try {
                return await WebAssembly.instantiateStreaming(module, imports);

            } catch (e) {
                const validResponse = module.ok && EXPECTED_RESPONSE_TYPES.has(module.type);

                if (validResponse && module.headers.get('Content-Type') !== 'application/wasm') {
                    console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve Wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);

                } else {
                    throw e;
                }
            }
        }

        const bytes = await module.arrayBuffer();
        return await WebAssembly.instantiate(bytes, imports);

    } else {
        const instance = await WebAssembly.instantiate(module, imports);

        if (instance instanceof WebAssembly.Instance) {
            return { instance, module };

        } else {
            return instance;
        }
    }
}

function __wbg_get_imports() {
    const imports = {};
    imports.wbg = {};
    imports.wbg.__wbg_wasmlockprimitive_unwrap = function(arg0) {
        const ret = WasmLockPrimitive.__unwrap(arg0);
        return ret;
    };
    imports.wbg.__wbg_wasmnote_unwrap = function(arg0) {
        const ret = WasmNote.__unwrap(arg0);
        return ret;
    };
    imports.wbg.__wbg_wbindgenstringget_0f16a6ddddef376f = function(arg0, arg1) {
        const obj = arg1;
        const ret = typeof(obj) === 'string' ? obj : undefined;
        var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    };
    imports.wbg.__wbg_wbindgenthrow_451ec1a8469d7eb6 = function(arg0, arg1) {
        throw new Error(getStringFromWasm0(arg0, arg1));
    };
    imports.wbg.__wbindgen_cast_2241b6af4c4b2941 = function(arg0, arg1) {
        // Cast intrinsic for `Ref(String) -> Externref`.
        const ret = getStringFromWasm0(arg0, arg1);
        return ret;
    };
    imports.wbg.__wbindgen_init_externref_table = function() {
        const table = wasm.__wbindgen_export_2;
        const offset = table.grow(4);
        table.set(0, undefined);
        table.set(offset + 0, undefined);
        table.set(offset + 1, null);
        table.set(offset + 2, true);
        table.set(offset + 3, false);
        ;
    };

    return imports;
}

function __wbg_init_memory(imports, memory) {

}

function __wbg_finalize_init(instance, module) {
    wasm = instance.exports;
    __wbg_init.__wbindgen_wasm_module = module;
    cachedDataViewMemory0 = null;
    cachedUint8ArrayMemory0 = null;


    wasm.__wbindgen_start();
    return wasm;
}

function initSync(module) {
    if (wasm !== undefined) return wasm;


    if (typeof module !== 'undefined') {
        if (Object.getPrototypeOf(module) === Object.prototype) {
            ({module} = module)
        } else {
            console.warn('using deprecated parameters for `initSync()`; pass a single object instead')
        }
    }

    const imports = __wbg_get_imports();

    __wbg_init_memory(imports);

    if (!(module instanceof WebAssembly.Module)) {
        module = new WebAssembly.Module(module);
    }

    const instance = new WebAssembly.Instance(module, imports);

    return __wbg_finalize_init(instance, module);
}

async function __wbg_init(module_or_path) {
    if (wasm !== undefined) return wasm;


    if (typeof module_or_path !== 'undefined') {
        if (Object.getPrototypeOf(module_or_path) === Object.prototype) {
            ({module_or_path} = module_or_path)
        } else {
            console.warn('using deprecated parameters for the initialization function; pass a single object instead')
        }
    }

    if (typeof module_or_path === 'undefined') {
        module_or_path = new URL('nbx_nockchain_types_bg.wasm', import.meta.url);
    }
    const imports = __wbg_get_imports();

    if (typeof module_or_path === 'string' || (typeof Request === 'function' && module_or_path instanceof Request) || (typeof URL === 'function' && module_or_path instanceof URL)) {
        module_or_path = fetch(module_or_path);
    }

    __wbg_init_memory(imports);

    const { instance, module } = await __wbg_load(await module_or_path, imports);

    return __wbg_finalize_init(instance, module);
}

export { initSync };
export default __wbg_init;

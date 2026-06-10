import { assert, test } from "@hazae41/phobos";
import { Buffer } from "node:buffer";
import { ChaCha20Cipher, load, Memory } from "./mod.ts";

function equals(a: Uint8Array, b: Uint8Array) {
  return Buffer.from(a).equals(Buffer.from(b))
}

test("chacha20", async () => {
  await load()

  using key = new Memory(crypto.getRandomValues(new Uint8Array(32)))
  using nonce = new Memory(crypto.getRandomValues(new Uint8Array(12)))
  using original = new Memory(crypto.getRandomValues(new Uint8Array(256)))
  using modified = new Memory(original.bytes)

  using encryptor = new ChaCha20Cipher(key, nonce)

  encryptor.apply_keystream(modified)

  assert(!equals(original.bytes, modified.bytes))

  using decryptor = new ChaCha20Cipher(key, nonce)

  decryptor.apply_keystream(modified)

  assert(equals(original.bytes, modified.bytes))
})
pragma circom 2.0.0;

include "poseidon.circom";

template Ownership() {
    signal input secret;
    signal output hash_out;

    component hasher = Poseidon(1);
    hasher.inputs[0] <== secret;
    hash_out <== hasher.out;
}

component main = Ownership();

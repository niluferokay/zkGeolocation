declare module "snarkjs" {
  export namespace groth16 {
    export function fullProve(
      input: any,
      wasmPath: string,
      zkeyPath: string
    ): Promise<{ proof: any; publicSignals: any }>;

    export function verify(
      vkey: any,
      publicSignals: any,
      proof: any
    ): Promise<boolean>;
  }
}
